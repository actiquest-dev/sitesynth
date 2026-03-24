import fs from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const API_BASE = (process.env.DEMO_BUILD_API_URL || 'https://sitesynth-eight.vercel.app/api').replace(/\/+$/, '')
const BUILD_TOKEN = process.env.DEMO_BUILD_TOKEN
const SITE_ROOT = process.env.DEMO_SITE_ROOT || '/var/www/sitesynth/demo.sitesynth.com'
const EXECUTOR_MODE = process.env.DEMO_BUILD_EXECUTOR || 'plan'
const CLINE_BIN = process.env.CLINE_BIN || 'cline'
const CLINE_TIMEOUT_MS = Number(process.env.CLINE_TIMEOUT_MS || 20 * 60 * 1000)

if (!BUILD_TOKEN) {
  throw new Error('Missing DEMO_BUILD_TOKEN')
}

const apiGet = async (route) => {
  const response = await fetch(`${API_BASE}${route}`, {
    headers: { Accept: 'application/json' },
  })
  return response.json()
}

const apiPost = async (route, payload) => {
  const response = await fetch(`${API_BASE}${route}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  })
  return response.json()
}

const logEvent = async (jobId, message, level = 'info', payload = null) => {
  await apiPost('/demo/build/event', {
    token: BUILD_TOKEN,
    jobId,
    level,
    stage: payload?.stage || 'general',
    status: payload?.status,
    message,
    payload,
  })
}

const writeContractFiles = async (targetDir, payload) => {
  const files = {
    'build_job.json': payload,
    'design_contract.json': payload?.buildContract?.designContract || {},
    'brief.json': payload?.buildContract?.brief || {},
    'reference_report.json': payload?.buildContract?.referenceReport || {},
    'asset_manifest.json': payload?.buildContract?.assetManifest || {},
  }

  for (const [filename, contents] of Object.entries(files)) {
    await fs.writeFile(path.join(targetDir, filename), JSON.stringify(contents, null, 2), 'utf8')
  }
}

const writeBuildFiles = async (targetDir, html, css, assets = []) => {
  await fs.mkdir(targetDir, { recursive: true })
  await fs.writeFile(path.join(targetDir, 'index.html'), html, 'utf8')
  await fs.writeFile(path.join(targetDir, 'styles.css'), css, 'utf8')

  if (Array.isArray(assets)) {
    for (const asset of assets) {
      if (!asset?.path || !asset?.data_base64) continue
      const assetPath = path.join(targetDir, asset.path)
      await fs.mkdir(path.dirname(assetPath), { recursive: true })
      const buffer = Buffer.from(asset.data_base64, 'base64')
      await fs.writeFile(assetPath, buffer)
    }
  }
}

const runCommand = (command, args, options = {}) => new Promise((resolve, reject) => {
  const child = spawn(command, args, {
    cwd: options.cwd,
    env: options.env || process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  let stdout = ''
  let stderr = ''
  const timer = setTimeout(() => {
    child.kill('SIGTERM')
    reject(new Error(`${command} timed out after ${CLINE_TIMEOUT_MS}ms`))
  }, options.timeoutMs || CLINE_TIMEOUT_MS)

  child.stdout.on('data', (chunk) => {
    stdout += String(chunk)
  })

  child.stderr.on('data', (chunk) => {
    stderr += String(chunk)
  })

  child.on('error', (error) => {
    clearTimeout(timer)
    reject(error)
  })

  child.on('close', (code) => {
    clearTimeout(timer)
    if (code !== 0) {
      const error = new Error(`${command} exited with code ${code}\n${stderr || stdout}`.trim())
      error.stdout = stdout
      error.stderr = stderr
      error.exitCode = code
      reject(error)
      return
    }
    resolve({ stdout, stderr, code })
  })
})

const listWorkspaceFiles = async (targetDir) => {
  const results = []
  const walk = async (dir) => {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        await walk(fullPath)
      } else {
        results.push(fullPath)
      }
    }
  }
  await walk(targetDir)
  return results
}

const buildClinePrompt = (payload) => `You are implementing a production-quality demo website in the current workspace.

Read these files first:
- build_job.json
- design_contract.json
- brief.json
- reference_report.json
- asset_manifest.json

Requirements:
- implement the requested demo website in this workspace
- prefer semantic HTML/CSS or the framework specified in build_job.json
- use the design tokens and layout direction from design_contract.json
- use any provided assets from asset_manifest.json
- no lorem ipsum unless the brief explicitly requires placeholders
- run the appropriate build or validation commands if package.json exists
- fix any build errors before finishing

When done, leave the workspace in a runnable state and print a short summary of what changed.

Project slug: ${payload?.slug || 'demo-site'}
Target URL: ${payload?.targetUrl || payload?.buildContract?.project?.targetUrl || ''}
Executor mode: ${EXECUTOR_MODE}
`.trim()

const runClineBuild = async (payload) => {
  const targetDir = payload.workspacePath
  const promptPath = path.join(targetDir, '.sitesynth-cline-prompt.txt')
  const prompt = buildClinePrompt(payload)
  await fs.mkdir(targetDir, { recursive: true })
  await fs.writeFile(promptPath, `${prompt}\n`, 'utf8')

  const result = await runCommand(
    CLINE_BIN,
    ['-y', prompt],
    { cwd: targetDir }
  )

  const files = await listWorkspaceFiles(targetDir)
  const htmlPath = files.find((file) => file.endsWith('index.html')) || null
  const cssPath = files.find((file) => file.endsWith('styles.css')) || null

  return {
    summary: result.stdout.trim().slice(0, 4000),
    stdout: result.stdout,
    stderr: result.stderr,
    htmlPath,
    cssPath,
    files,
  }
}

const runLoop = async () => {
  while (true) {
    try {
      const next = await apiGet(`/demo/build/next?token=${encodeURIComponent(BUILD_TOKEN)}`)
      if (!next?.success) {
        await sleep(5000)
        continue
      }

      const jobId = next?.data?.jobId
      const slug = next?.data?.slug
      const workspacePath = next?.data?.workspacePath || path.join(SITE_ROOT, slug || '')
      if (!jobId || !slug) {
        await sleep(5000)
        continue
      }

      await logEvent(jobId, 'Preparing workspace', 'info', {
        stage: 'prepare',
        status: 'running',
        workspacePath,
        targetUrl: next?.data?.targetUrl || null,
      })
      await writeContractFiles(workspacePath, next.data)

      if (EXECUTOR_MODE === 'cline') {
        await logEvent(jobId, 'Starting Cline executor', 'info', {
          stage: 'build',
          status: 'running',
          provider: next?.data?.provider || 'cline_executor',
          modelProvider: next?.data?.modelProvider || null,
        })

        try {
          const result = await runClineBuild(next.data)
          const url = `https://demo.sitesynth.com/${slug}/`
          await logEvent(jobId, 'Cline executor finished', 'info', {
            stage: 'verify',
            status: 'running',
            summary: result.summary,
            htmlPath: result.htmlPath,
            cssPath: result.cssPath,
          })

          await apiPost('/demo/build/complete', {
            token: BUILD_TOKEN,
            jobId,
            status: 'published',
            stage: 'publish',
            targetUrl: url,
            summary: result.summary,
            changedFiles: result.files.map((file) => path.relative(workspacePath, file)),
            output: {
              url,
              htmlPath: result.htmlPath,
              cssPath: result.cssPath,
              executor: 'cline',
            },
            artifacts: [
              ...(result.htmlPath ? [{
                type: 'html',
                path: result.htmlPath,
                publicUrl: `${url}${path.basename(result.htmlPath)}`,
                metadata: { slug },
              }] : []),
              ...(result.cssPath ? [{
                type: 'css',
                path: result.cssPath,
                publicUrl: `${url}${path.basename(result.cssPath)}`,
                metadata: { slug },
              }] : []),
              {
                type: 'log',
                path: path.join(workspacePath, 'cline-output.log'),
                metadata: { stdout: result.stdout.slice(0, 12000), stderr: result.stderr.slice(0, 12000) },
              },
            ],
          })
        } catch (error) {
          const errorMessage = error?.message || 'Cline execution failed'
          await logEvent(jobId, 'Cline executor failed', 'error', {
            stage: 'build',
            error: errorMessage,
            stdout: error?.stdout?.slice?.(0, 12000) || null,
            stderr: error?.stderr?.slice?.(0, 12000) || null,
          })
          await apiPost('/demo/build/complete', {
            token: BUILD_TOKEN,
            jobId,
            status: 'failed',
            stage: 'failed',
            error: errorMessage,
          })
        }
      } else {
        await logEvent(jobId, 'Generating demo site', 'info', {
          stage: 'plan',
          status: 'running',
          provider: next?.data?.provider || null,
          modelProvider: next?.data?.modelProvider || null,
        })
        const plan = await apiPost('/demo/build/plan', {
          token: BUILD_TOKEN,
          jobId,
        })

        if (!plan?.success || !plan?.data?.html || !plan?.data?.css) {
          const errorMessage = plan?.error || 'Failed to generate demo site'
          await logEvent(jobId, 'Generation failed', 'error', { stage: 'plan', error: errorMessage })
          await apiPost('/demo/build/complete', {
            token: BUILD_TOKEN,
            jobId,
            status: 'failed',
            stage: 'failed',
            error: errorMessage,
          })
          await sleep(2000)
          continue
        }

        await logEvent(jobId, 'Writing files to demo host', 'info', { stage: 'build', status: 'running', workspacePath })
        await writeBuildFiles(workspacePath, plan.data.html, plan.data.css, plan.data.assets)

        const url = `https://demo.sitesynth.com/${slug}/`
        await logEvent(jobId, 'Workspace published', 'info', { stage: 'publish', url })
        await apiPost('/demo/build/complete', {
          token: BUILD_TOKEN,
          jobId,
          status: 'published',
          stage: 'publish',
          targetUrl: url,
          output: {
            url,
            htmlPath: path.join(workspacePath, 'index.html'),
            cssPath: path.join(workspacePath, 'styles.css'),
            notes: plan.data.notes || [],
          },
          artifacts: [
            {
              type: 'html',
              path: path.join(workspacePath, 'index.html'),
              publicUrl: `${url}index.html`,
              metadata: { slug },
            },
            {
              type: 'css',
              path: path.join(workspacePath, 'styles.css'),
              publicUrl: `${url}styles.css`,
              metadata: { slug },
            },
          ],
        })
      }
    } catch (error) {
      console.error('[demo-builder] error', error?.message || error)
      await sleep(5000)
    }
  }
}

runLoop().catch((error) => {
  console.error('[demo-builder] fatal', error?.message || error)
  process.exit(1)
})
