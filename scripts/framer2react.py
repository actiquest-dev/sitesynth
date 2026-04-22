#!/usr/bin/env python3
from __future__ import annotations

import argparse
import html
import json
import os
import re
import shutil
import subprocess
import sys
import time
from pathlib import Path
from typing import Iterable
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urljoin, urlparse
from urllib.request import Request, urlopen

LOCALIZE_HOSTS = {
    "framerusercontent.com",
    "fonts.gstatic.com",
    "fonts.googleapis.com",
    "cdn.framerauth.com",
    "events.framer.com",
    "framer.com",
}

TEXT_SUFFIXES = {".html", ".js", ".mjs", ".css", ".json", ".txt", ".map", ".svg", ".xml"}
USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64) Framer2React/1.0"

FRAMERAUTH_STUB_JS = r"""(function () {
  var w = typeof window !== "undefined" ? window : globalThis;
  var listeners = [];
  var store = {
    user: null,
    isAuthenticated: false,
    isLoaded: true,
  };

  function notify(changedKeys) {
    for (var i = 0; i < listeners.length; i++) {
      try {
        var item = listeners[i];
        if (!item) continue;
        if (!item.keys || !changedKeys || !changedKeys.length) {
          item.cb(store);
          continue;
        }
        var hit = false;
        for (var j = 0; j < item.keys.length; j++) {
          if (changedKeys.indexOf(item.keys[j]) !== -1) {
            hit = true;
            break;
          }
        }
        if (hit) item.cb(store);
      } catch (_e) {
        // no-op
      }
    }
  }

  function shallowMerge(target, patch) {
    var out = {};
    var k;
    for (k in target) out[k] = target[k];
    for (k in patch) out[k] = patch[k];
    return out;
  }

  w.FramerAuth = {
    getStoreState: function () {
      return store;
    },
    setStoreState: function (next, changedKeys) {
      store = shallowMerge(store, next || {});
      notify(changedKeys || []);
      return store;
    },
    subscribe: function (cb, keys) {
      var item = { cb: cb, keys: Array.isArray(keys) ? keys : null };
      listeners.push(item);
      return function unsubscribe() {
        var idx = listeners.indexOf(item);
        if (idx >= 0) listeners.splice(idx, 1);
      };
    },
    signOut: function (redirectTo) {
      store = { user: null, isAuthenticated: false, isLoaded: true };
      notify(["user", "isAuthenticated"]);
      if (redirectTo && typeof w.location !== "undefined") {
        try {
          w.location.href = redirectTo;
        } catch (_e) {
          // no-op
        }
      }
      return Promise.resolve({ data: true, error: null });
    },
    patchUserData: function (patch) {
      var user = store.user || { data: {} };
      var data = shallowMerge(user.data || {}, patch || {});
      store = shallowMerge(store, { user: shallowMerge(user, { data: data }) });
      notify(["user.data"]);
      return Promise.resolve({ data: { user: store.user }, error: null });
    },
  };

  if (typeof console !== "undefined" && console.info) {
    console.info("Framer Auth - Local stub - v0.1");
  }
})();"""


def log(msg: str) -> None:
    print(msg, flush=True)


def run_cmd(cmd: list[str], cwd: Path, check: bool = True) -> int:
    log(f"$ {' '.join(cmd)}")
    proc = subprocess.run(cmd, cwd=str(cwd))
    if check and proc.returncode != 0:
        raise RuntimeError(f"Command failed ({proc.returncode}): {' '.join(cmd)}")
    return proc.returncode


def fetch_bytes(url: str, timeout: int = 20) -> bytes:
    req = Request(url, headers={"User-Agent": USER_AGENT})
    with urlopen(req, timeout=timeout) as resp:
        return resp.read()


def fetch_to_file(url: str, out_file: Path, skip_existing: bool = True, timeout: int = 20) -> bool:
    if skip_existing and out_file.exists():
        return False
    out_file.parent.mkdir(parents=True, exist_ok=True)
    data = fetch_bytes(url, timeout=timeout)
    out_file.write_bytes(data)
    return True


def is_text_file(path: Path) -> bool:
    return path.suffix.lower() in TEXT_SUFFIXES


def walk_files(root: Path) -> list[Path]:
    return [p for p in root.rglob("*") if p.is_file()]


def extract_urls(text: str) -> set[str]:
    return set(re.findall(r"https://[^\s\"'<>`)]+", text))


def to_local_mapping(raw_url: str) -> tuple[str, Path, str] | None:
    decoded = raw_url.replace("&amp;", "&")
    try:
        u = urlparse(decoded)
    except Exception:
        return None

    if not u.scheme or not u.netloc:
        return None
    if u.hostname not in LOCALIZE_HOSTS:
        return None
    if not u.path or u.path.endswith("/"):
        return None

    path_part = u.path
    if u.query:
        safe_query = quote(u.query, safe="")
        path_part = f"{path_part}__q_{safe_query}"

    rel = Path(u.hostname + path_part)
    web_path = f"/_local/{u.hostname}{path_part}"
    return decoded, rel, web_path


def extract_site_id(html_text: str) -> str | None:
    m = re.search(r"framerusercontent\.com/sites/([A-Za-z0-9_-]+)/", html_text)
    return m.group(1) if m else None


def replace_in_file(path: Path, replacements: dict[str, str]) -> bool:
    try:
        content = path.read_text(encoding="utf-8")
    except Exception:
        return False

    rewritten = content
    for src, dst in replacements.items():
        if src in rewritten:
            rewritten = rewritten.replace(src, dst)
        esc_src = html.escape(src, quote=False)
        if esc_src in rewritten:
            rewritten = rewritten.replace(esc_src, dst)

    if rewritten != content:
        path.write_text(rewritten, encoding="utf-8")
        return True
    return False


def read_text_safe(path: Path) -> str | None:
    try:
        return path.read_text(encoding="utf-8")
    except Exception:
        return None


def crawl_site_chunks(
    project_root: Path,
    site_id: str,
    request_timeout: int,
    max_refs: int,
) -> tuple[int, int]:
    site_dir = project_root / "public" / "_local" / "framerusercontent.com" / "sites" / site_id
    site_dir.mkdir(parents=True, exist_ok=True)
    base_url = f"https://framerusercontent.com/sites/{site_id}/"

    refs: set[str] = set()
    seen: set[str] = set()

    for p in walk_files(site_dir):
        if p.suffix.lower() in {".mjs", ".js", ".json"}:
            refs.add(str(p.relative_to(site_dir)).replace("\\", "/"))

    refs.add("script_main.BMnVM_eB.mjs")

    patterns = [
        re.compile(r"\./([A-Za-z0-9._/-]+\.(?:mjs|js|json))"),
        re.compile(rf"/_local/framerusercontent\.com/sites/{re.escape(site_id)}/([A-Za-z0-9._/-]+\.(?:mjs|js|json))"),
        re.compile(rf"https://framerusercontent\.com/sites/{re.escape(site_id)}/([A-Za-z0-9._/-]+\.(?:mjs|js|json))"),
    ]

    downloaded = 0
    failed = 0

    while True:
        if len(seen) >= max_refs:
            break
        next_ref = next((r for r in refs if r not in seen), None)
        if not next_ref:
            break
        seen.add(next_ref)

        out_path = site_dir / next_ref
        if not out_path.exists():
            try:
                if fetch_to_file(
                    urljoin(base_url, next_ref),
                    out_path,
                    skip_existing=False,
                    timeout=request_timeout,
                ):
                    downloaded += 1
            except (HTTPError, URLError, TimeoutError, ValueError):
                failed += 1
                continue

        text = read_text_safe(out_path)
        if not text:
            continue

        for pat in patterns:
            for m in pat.finditer(text):
                refs.add(m.group(1))

    return downloaded, failed


def crawl_local_paths(project_root: Path, request_timeout: int, max_assets: int) -> tuple[int, int]:
    public_dir = project_root / "public"
    local_dir = public_dir / "_local"
    downloaded = 0
    failed = 0

    path_pattern = re.compile(r"/_local/([A-Za-z0-9.-]+/[A-Za-z0-9._~!$&'()*+,;=:@%/?#\-]+)")

    processed_assets = 0
    for file_path in walk_files(public_dir):
        if not is_text_file(file_path):
            continue
        text = read_text_safe(file_path)
        if not text:
            continue

        for rel in set(path_pattern.findall(text)):
            if processed_assets >= max_assets:
                return downloaded, failed
            target = local_dir / rel
            if target.exists():
                continue
            host, _, rest = rel.partition("/")
            if host not in LOCALIZE_HOSTS:
                continue
            remote_url = f"https://{host}/{rest}"
            try:
                if fetch_to_file(remote_url, target, skip_existing=True, timeout=request_timeout):
                    downloaded += 1
                processed_assets += 1
            except (HTTPError, URLError, TimeoutError, ValueError):
                failed += 1
                processed_assets += 1

    return downloaded, failed


def create_aliases_for_query_filenames(project_root: Path) -> int:
    img_dir = project_root / "public" / "_local" / "framerusercontent.com" / "images"
    if not img_dir.exists():
        return 0

    created = 0
    for p in list(img_dir.iterdir()):
        if not p.is_file():
            continue
        name = p.name
        if "__q_" not in name:
            continue

        # create alias for encoded query tails that runtime may request with raw & and =
        alias = re.sub(r"%26([A-Za-z0-9_-]+)%3D", r"&\1=", name)
        if alias != name:
            dst = p.with_name(alias)
            if not dst.exists():
                shutil.copy2(p, dst)
                created += 1

    return created


def write_local_framerauth_stub(project_root: Path) -> Path:
    target = project_root / "public" / "_local" / "cdn.framerauth.com" / "packages" / "sdk" / "live" / "latest" / "framerauth.js"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(FRAMERAUTH_STUB_JS + "\n", encoding="utf-8")
    return target


def patch_exported_index_html(project_root: Path) -> bool:
    index_file = project_root / "public" / "site" / "index.html"
    if not index_file.exists():
        return False

    text = index_file.read_text(encoding="utf-8", errors="ignore")
    original = text

    # Remove any existing framerauth script tags to avoid duplicate initialization.
    text = re.sub(r"<script\b[^>]*framerauth\.js[^>]*></script>\s*", "", text, flags=re.I)

    # Ensure local framerauth stub is loaded at the start of body.
    body_script = '<script src="/_local/cdn.framerauth.com/packages/sdk/live/latest/framerauth.js"></script>'
    if body_script not in text:
        text = re.sub(r"(<body\b[^>]*>)", r"\1\n        " + body_script, text, count=1, flags=re.I)

    # Remove FramerAuth modulepreload links.
    text = re.sub(r"<link\b[^>]*href=\"[^\"]*FramerAuth\.[^\"]*\.mjs\"[^>]*>\s*", "", text, flags=re.I)

    # Remove inline hydrate payload attribute so runtime doesn't attempt SSR hydration.
    text = re.sub(r"\sdata-framer-hydrate-v2='[^']*'", "", text, flags=re.I)
    text = re.sub(r'\sdata-framer-hydrate-v2="[^"]*"', "", text, flags=re.I)

    # Clear SSR markup before script_main bootstraps (client-only mount).
    marker = "framer2react-client-only-mount"
    if marker not in text:
        clear_script = (
            f'<script data-{marker}="1">\n'
            "            (function () {\n"
            '                var main = document.getElementById("main");\n'
            "                if (!main) return;\n"
            '                main.removeAttribute("data-framer-hydrate-v2");\n'
            "                while (main.firstChild) main.removeChild(main.firstChild);\n"
            "            })();\n"
            "        </script>\n"
        )
        text = re.sub(
            r"(<script\b[^>]*src=\"[^\"]*/script_main[^\"/]*\.mjs\"[^>]*></script>)",
            clear_script + r"\1",
            text,
            count=1,
            flags=re.I,
        )

    if text != original:
        index_file.write_text(text, encoding="utf-8")
        return True
    return False


def patch_script_main_client_render(project_root: Path, site_id: str | None) -> tuple[int, int]:
    if not site_id:
        return 0, 0
    site_dir = project_root / "public" / "_local" / "framerusercontent.com" / "sites" / site_id
    if not site_dir.exists():
        return 0, 0

    touched = 0
    replacements = 0
    for p in site_dir.glob("script_main*.mjs"):
        text = p.read_text(encoding="utf-8", errors="ignore")
        new_text = text

        # Force createRoot render path to avoid hydration mismatch errors (#418/#423).
        new_text, c1 = re.subn(
            r"g\(t,u,\{onRecoverableError:n\}\)",
            "h(t,{onRecoverableError:n}).render(u)",
            new_text,
        )

        # Some bundles decide hydrate path via data-framer-hydrate-v2 check; always use client path.
        new_text, c2 = re.subn(
            r"`framerHydrateV2`in e\.dataset\?U\(!0,e\):U\(!1,e\)",
            "U(!1,e)",
            new_text,
        )

        if new_text != text:
            p.write_text(new_text, encoding="utf-8")
            touched += 1
            replacements += c1 + c2

    return touched, replacements


def patch_react_bundle_disable_hydrate(project_root: Path, site_id: str | None) -> tuple[int, int]:
    if not site_id:
        return 0, 0
    site_dir = project_root / "public" / "_local" / "framerusercontent.com" / "sites" / site_id
    if not site_dir.exists():
        return 0, 0

    touched = 0
    replacements = 0
    for p in site_dir.glob("react*.mjs"):
        text = p.read_text(encoding="utf-8", errors="ignore")
        new_text = text

        # Force hydrateRoot alias to point at createRoot in minified react-dom client bundle.
        new_text, c1 = re.subn(
            r"Ap\.hydrateRoot=jp\.hydrateRoot",
            "Ap.hydrateRoot=jp.createRoot",
            new_text,
        )

        if new_text != text:
            p.write_text(new_text, encoding="utf-8")
            touched += 1
            replacements += c1

    return touched, replacements


def build_react_vite_scaffold(project_root: Path, site_entry: str) -> None:
    src = project_root / "src"
    src.mkdir(parents=True, exist_ok=True)

    pkg = {
        "name": project_root.name,
        "private": True,
        "version": "0.1.0",
        "type": "module",
        "scripts": {
            "dev": "vite",
            "build": "vite build",
            "preview": "vite preview"
        },
        "dependencies": {
            "react": "^18.3.1",
            "react-dom": "^18.3.1"
        },
        "devDependencies": {
            "@vitejs/plugin-react": "^4.3.3",
            "vite": "^5.4.8"
        }
    }

    (project_root / "package.json").write_text(json.dumps(pkg, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    (project_root / "vite.config.js").write_text(
        "import { defineConfig } from 'vite'\n"
        "import react from '@vitejs/plugin-react'\n\n"
        "export default defineConfig({\n"
        "  plugins: [react()],\n"
        "})\n",
        encoding="utf-8",
    )

    (project_root / ".gitignore").write_text(
        "node_modules\n"
        "dist\n"
        ".vercel\n"
        ".DS_Store\n",
        encoding="utf-8",
    )

    (project_root / "index.html").write_text(
        "<!doctype html>\n"
        "<html lang=\"en\">\n"
        "  <head>\n"
        "    <meta charset=\"UTF-8\" />\n"
        "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n"
        f"    <title>{project_root.name}</title>\n"
        "  </head>\n"
        "  <body>\n"
        "    <div id=\"root\"></div>\n"
        "    <script type=\"module\" src=\"/src/main.jsx\"></script>\n"
        "  </body>\n"
        "</html>\n",
        encoding="utf-8",
    )

    (src / "main.jsx").write_text(
        "import React from 'react'\n"
        "import { createRoot } from 'react-dom/client'\n"
        "import App from './App'\n\n"
        "createRoot(document.getElementById('root')).render(<App />)\n",
        encoding="utf-8",
    )

    (src / "App.jsx").write_text(
        "import React from 'react'\n\n"
        "export default function App() {\n"
        "  return (\n"
        "    <iframe\n"
        f"      src=\"{site_entry}\"\n"
        "      title=\"Framer export\"\n"
        "      style={{ width: '100vw', height: '100vh', border: 0, display: 'block' }}\n"
        "      loading=\"eager\"\n"
        "    />\n"
        "  )\n"
        "}\n",
        encoding="utf-8",
    )

    (project_root / "vercel.json").write_text(
        json.dumps(
            {
                "$schema": "https://openapi.vercel.sh/vercel.json",
                "buildCommand": "npm run build",
                "outputDirectory": "dist"
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )


def ensure_git_repo(project_root: Path) -> None:
    if not (project_root / ".git").exists():
        run_cmd(["git", "init"], cwd=project_root)


def github_push(project_root: Path, repo: str, branch: str, token: str | None, commit_message: str) -> None:
    ensure_git_repo(project_root)
    run_cmd(["git", "add", "-A"], cwd=project_root)

    commit_rc = run_cmd(["git", "commit", "-m", commit_message], cwd=project_root, check=False)
    if commit_rc != 0:
        log("No changes to commit (or commit skipped).")

    remote_url = repo
    if token and repo.startswith("https://") and "@" not in repo:
        remote_url = repo.replace("https://", f"https://x-access-token:{token}@", 1)

    existing_remotes = subprocess.check_output(["git", "remote"], cwd=str(project_root), text=True).split()
    if "origin" in existing_remotes:
        run_cmd(["git", "remote", "set-url", "origin", remote_url], cwd=project_root)
    else:
        run_cmd(["git", "remote", "add", "origin", remote_url], cwd=project_root)

    run_cmd(["git", "push", "-u", "origin", branch], cwd=project_root)


def vercel_deploy(project_root: Path, prod: bool, token: str | None, org_id: str | None, project_id: str | None) -> None:
    env = os.environ.copy()
    if token:
        env["VERCEL_TOKEN"] = token

    args = ["npx", "vercel", "--yes"]
    if prod:
        args.append("--prod")
    if token:
        args.extend(["--token", token])

    if org_id:
        env["VERCEL_ORG_ID"] = org_id
    if project_id:
        env["VERCEL_PROJECT_ID"] = project_id

    log(f"$ {' '.join(args)}")
    proc = subprocess.run(args, cwd=str(project_root), env=env)
    if proc.returncode != 0:
        raise RuntimeError(f"Vercel deploy failed ({proc.returncode})")


def slug_from_url(url: str) -> str:
    u = urlparse(url)
    host = (u.hostname or "framer-site").replace(".", "-")
    return re.sub(r"[^a-zA-Z0-9-_]", "-", host).strip("-") or "framer-site"


def prepare_output_dir(path: Path, force: bool) -> None:
    if path.exists() and any(path.iterdir()) and not force:
        raise RuntimeError(f"Output directory is not empty: {path}. Use --force to overwrite.")
    path.mkdir(parents=True, exist_ok=True)


def main() -> None:
    parser = argparse.ArgumentParser(description="Export Framer URL to deployable React/Vite project with localized assets.")
    parser.add_argument("url", help="Framer website URL")
    parser.add_argument("--out", default="./exports", help="Base output directory")
    parser.add_argument("--name", default=None, help="Project folder name")
    parser.add_argument("--force", action="store_true", help="Allow writing into non-empty output directory")
    parser.add_argument("--install", action="store_true", help="Run npm install in generated project")
    parser.add_argument("--request-timeout", type=int, default=20, help="Per-request timeout in seconds")
    parser.add_argument("--max-crawl-refs", type=int, default=800, help="Max JS chunk refs to crawl")
    parser.add_argument("--max-crawl-assets", type=int, default=2000, help="Max _local asset URLs to crawl")

    parser.add_argument("--github-repo", default=None, help="GitHub repo URL, e.g. https://github.com/org/repo.git")
    parser.add_argument("--github-branch", default="main", help="Git branch for push")
    parser.add_argument("--github-token", default=os.getenv("GITHUB_TOKEN"), help="GitHub token (optional)")

    parser.add_argument("--vercel", action="store_true", help="Deploy to Vercel via CLI")
    parser.add_argument("--vercel-prod", action="store_true", help="Deploy to production")
    parser.add_argument("--vercel-token", default=os.getenv("VERCEL_TOKEN"), help="Vercel token (optional)")
    parser.add_argument("--vercel-org-id", default=os.getenv("VERCEL_ORG_ID"), help="Vercel org ID (optional)")
    parser.add_argument("--vercel-project-id", default=os.getenv("VERCEL_PROJECT_ID"), help="Vercel project ID (optional)")

    args = parser.parse_args()

    url = args.url.strip()
    if not re.match(r"^https?://", url, re.I):
        url = "https://" + url

    out_base = Path(args.out).expanduser().resolve()
    name = args.name or slug_from_url(url)
    project_root = out_base / name

    prepare_output_dir(project_root, args.force)
    (project_root / "public" / "site").mkdir(parents=True, exist_ok=True)
    (project_root / "public" / "_local").mkdir(parents=True, exist_ok=True)

    log(f"Fetching HTML: {url}")
    html_bytes = fetch_bytes(url)
    html_text = html_bytes.decode("utf-8", errors="ignore")

    site_entry = "/site/index.html"
    site_file = project_root / "public" / "site" / "index.html"
    site_file.write_text(html_text, encoding="utf-8")

    replacements: dict[str, str] = {}
    downloaded_assets = 0

    urls = extract_urls(html_text)
    for raw in urls:
        mapped = to_local_mapping(raw)
        if not mapped:
            continue
        decoded, rel, web_path = mapped
        out_file = project_root / "public" / "_local" / rel
        try:
            if fetch_to_file(decoded, out_file, skip_existing=True, timeout=args.request_timeout):
                downloaded_assets += 1
            replacements[raw] = web_path
            replacements[decoded] = web_path
        except (HTTPError, URLError, TimeoutError, ValueError):
            pass

    # rewrite files repeatedly because downloaded files can contain more URLs
    rewrites = 0
    for _ in range(3):
        changed = 0
        for p in walk_files(project_root / "public"):
            if is_text_file(p):
                if replace_in_file(p, replacements):
                    changed += 1
        rewrites += changed
        if changed == 0:
            break

        # discover fresh URLs after rewrite pass
        for p in walk_files(project_root / "public"):
            if not is_text_file(p):
                continue
            txt = read_text_safe(p)
            if not txt:
                continue
            for raw in extract_urls(txt):
                if raw in replacements:
                    continue
                mapped = to_local_mapping(raw)
                if not mapped:
                    continue
                decoded, rel, web_path = mapped
                out_file = project_root / "public" / "_local" / rel
                try:
                    if fetch_to_file(decoded, out_file, skip_existing=True, timeout=args.request_timeout):
                        downloaded_assets += 1
                    replacements[raw] = web_path
                    replacements[decoded] = web_path
                except (HTTPError, URLError, TimeoutError, ValueError):
                    pass

    site_id = extract_site_id(html_text)
    chunks_downloaded = 0
    chunks_failed = 0
    if site_id:
        log(f"Detected Framer site id: {site_id}")
        dl, fail = crawl_site_chunks(
            project_root,
            site_id,
            request_timeout=args.request_timeout,
            max_refs=args.max_crawl_refs,
        )
        chunks_downloaded += dl
        chunks_failed += fail

    dl2, fail2 = crawl_local_paths(
        project_root,
        request_timeout=args.request_timeout,
        max_assets=args.max_crawl_assets,
    )
    chunks_downloaded += dl2
    chunks_failed += fail2

    alias_count = create_aliases_for_query_filenames(project_root)
    write_local_framerauth_stub(project_root)
    index_patched = patch_exported_index_html(project_root)
    script_files_patched, script_patch_count = patch_script_main_client_render(project_root, site_id)
    react_files_patched, react_patch_count = patch_react_bundle_disable_hydrate(project_root, site_id)

    build_react_vite_scaffold(project_root, site_entry)

    if args.install:
        run_cmd(["npm", "install"], cwd=project_root)

    commit_message = f"Export Framer site {urlparse(url).hostname} at {time.strftime('%Y-%m-%d %H:%M:%S')}"
    if args.github_repo:
        github_push(project_root, args.github_repo, args.github_branch, args.github_token, commit_message)

    if args.vercel:
        vercel_deploy(project_root, prod=args.vercel_prod, token=args.vercel_token, org_id=args.vercel_org_id, project_id=args.vercel_project_id)

    log("\nDone.")
    log(f"Project: {project_root}")
    log(f"Downloaded initial assets: {downloaded_assets}")
    log(f"Downloaded chunks/assets in crawl: {chunks_downloaded}")
    log(f"Failed chunk/asset downloads: {chunks_failed}")
    log(f"Created filename aliases: {alias_count}")
    log(f"Patched site index runtime: {'yes' if index_patched else 'no'}")
    log(f"Patched script_main files: {script_files_patched} (replacements: {script_patch_count})")
    log(f"Patched react bundles: {react_files_patched} (replacements: {react_patch_count})")
    log("Run locally: npm install && npm run dev")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        sys.exit(1)
