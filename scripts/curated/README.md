# Curated Source Extraction

Quick utility to collect candidate company names/domains from inspiration directories.

Run:

```bash
npm run curated:extract
```

Optional output path:

```bash
node scripts/curated/extract-source-links.mjs tmp/my-candidates.json
```

Optional limit per source:

```bash
CURATED_MAX_LINKS_PER_SOURCE=300 npm run curated:extract
```

Output JSON contains:
- `candidates[]`: `{ title, url, discovered_from, discovered_href, source_id }`
- `errors[]`: source fetch failures

Notes:
- This extractor is intentionally conservative (no browser automation), so some sources with heavy anti-bot JS may return fewer links.
- It is Stage A only. Final ingestion should still dedupe, validate, and tag records before adding to curated library.
