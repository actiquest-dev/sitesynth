import fs from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const API_BASE = (process.env.DEMO_BUILD_API_URL || '').replace(/\/+$/, '')
const BUILD_TOKEN = process.env.DEMO_BUILD_TOKEN

if (!API_BASE) {
  throw new Error('Missing DEMO_BUILD_API_URL environment variable. Set it on the Linux worker.')
}
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
  await fs.mkdir(targetDir, { recursive: true })
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

const generateAssets = async (payload) => {
  const response = await apiPost('/demo/build/assets', {
    token: BUILD_TOKEN,
    jobId: payload?.jobId,
    slug: payload?.slug,
    buildContract: payload?.buildContract || {},
  })

  if (!response?.success) {
    throw new Error(response?.error || 'Asset generation failed')
  }

  return response.data || { assetManifest: { assets: [] }, generatedAssets: [] }
}

const writeGeneratedAssets = async (targetDir, generatedAssets = []) => {
  for (const asset of generatedAssets) {
    if (!asset?.path || !asset?.data_base64) continue
    const assetPath = path.join(targetDir, asset.path)
    await fs.mkdir(path.dirname(assetPath), { recursive: true })
    await fs.writeFile(assetPath, Buffer.from(asset.data_base64, 'base64'))
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

const extractFirstJsonObject = (value) => {
  const text = String(value || '').trim()
  const start = text.indexOf('{')
  if (start === -1) return null

  let depth = 0
  let inString = false
  let escaped = false

  for (let i = start; i < text.length; i += 1) {
    const char = text[i]
    if (inString) {
      if (escaped) {
        escaped = false
      } else if (char === '\\') {
        escaped = true
      } else if (char === '"') {
        inString = false
      }
      continue
    }

    if (char === '"') {
      inString = true
      continue
    }

    if (char === '{') depth += 1
    if (char === '}') {
      depth -= 1
      if (depth === 0) {
        const candidate = text.slice(start, i + 1)
        try {
          return JSON.parse(candidate)
        } catch {
          return null
        }
      }
    }
  }

  return null
}

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

const buildCriticPrompt = (payload) => `You are reviewing a generated website implementation in the current workspace.

Read these files first:
- build_job.json
- design_contract.json
- asset_manifest.json
- index.html
- styles.css

Return STRICT JSON only:
{
  "score": number,
  "passed": boolean,
  "strengths": string[],
  "issues": string[],
  "fixInstructions": string[]
}

Scoring rubric:
- 5.0 = strongly matches art direction contract
- 4.0 = acceptable but still needs polish
- below 4.0 = clear mismatch

Review criteria:
- fidelity to color_system, typography, spacing, section_blueprints
- quality of composition and hierarchy
- use of exact copy from the contract
- avoidance of anti_patterns
- responsiveness and implementation quality

If the site is weak, produce concrete fixInstructions the builder can apply immediately.

Project slug: ${payload?.slug || 'demo-site'}
`.trim()

const buildFixPrompt = (payload, critique) => `You are improving the generated website in the current workspace.

Read these files first:
- build_job.json
- design_contract.json
- asset_manifest.json
- index.html
- styles.css

Apply these fixes exactly:
${JSON.stringify(critique?.fixInstructions || [], null, 2)}

Also address these issues:
${JSON.stringify(critique?.issues || [], null, 2)}

Requirements:
- keep the site runnable
- preserve valid HTML and CSS
- move the implementation closer to the art direction contract
- do not add generic filler sections

When finished, print a short summary.
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

const runClineCritic = async (payload) => {
  const targetDir = payload.workspacePath
  const prompt = buildCriticPrompt(payload)
  const result = await runCommand(CLINE_BIN, ['-y', prompt], { cwd: targetDir })
  const critique = extractFirstJsonObject(result.stdout) || extractFirstJsonObject(result.stderr)

  if (!critique || typeof critique.score !== 'number') {
    throw new Error(`Failed to parse critic output\n${(result.stdout || result.stderr || '').slice(0, 4000)}`)
  }

  return {
    critique,
    stdout: result.stdout,
    stderr: result.stderr,
  }
}

const runClineFixPass = async (payload, critique) => {
  const targetDir = payload.workspacePath
  const prompt = buildFixPrompt(payload, critique)
  const result = await runCommand(CLINE_BIN, ['-y', prompt], { cwd: targetDir })
  return {
    summary: result.stdout.trim().slice(0, 4000),
    stdout: result.stdout,
    stderr: result.stderr,
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

      const assetRequirements = Array.isArray(next?.data?.buildContract?.designContract?.asset_requirements)
        ? next.data.buildContract.designContract.asset_requirements
        : []

      if (assetRequirements.length > 0) {
        await logEvent(jobId, 'Generating assets', 'info', {
          stage: 'assets',
          status: 'running',
          count: assetRequirements.length,
          model: next?.data?.buildContract?.executor?.assetGeneration?.model || null,
        })

        const assetResult = await generateAssets(next.data)
        await writeGeneratedAssets(workspacePath, assetResult.generatedAssets || [])
        next.data.buildContract.assetManifest = assetResult.assetManifest || { assets: [] }
        await writeContractFiles(workspacePath, next.data)

        await logEvent(jobId, 'Assets generated', 'info', {
          stage: 'assets',
          status: 'running',
          count: Array.isArray(assetResult?.assetManifest?.assets) ? assetResult.assetManifest.assets.length : 0,
        })
      }

      if (EXECUTOR_MODE === 'cline') {
        await logEvent(jobId, 'Starting Cline executor', 'info', {
          stage: 'build',
          status: 'running',
          provider: next?.data?.provider || 'cline_executor',
          modelProvider: next?.data?.modelProvider || null,
        })

        try {
          const result = await runClineBuild(next.data)
          const criticConfig = next?.data?.buildContract?.executor?.critic || {}
          const criticEnabled = Boolean(criticConfig?.enabled)
          const maxIterations = Math.max(0, Number(criticConfig?.maxIterations || 0))
          const passThreshold = Number(criticConfig?.passThreshold || 4.2)

          let critiqueSummary = null
          let fixSummaries = []

          if (criticEnabled) {
            for (let iteration = 1; iteration <= maxIterations; iteration += 1) {
              await logEvent(jobId, 'Running critic pass', 'info', {
                stage: 'critic',
                status: 'running',
                iteration,
                passThreshold,
              })

              const critiqueResult = await runClineCritic(next.data)
              const critique = critiqueResult.critique || {}
              const passed = Boolean(critique?.passed) || Number(critique?.score || 0) >= passThreshold
              critiqueSummary = critique

              await logEvent(jobId, passed ? 'Critic passed' : 'Critic requested fixes', passed ? 'info' : 'warn', {
                stage: 'critic',
                status: passed ? 'passed' : 'needs_revision',
                iteration,
                score: critique?.score || null,
                issues: critique?.issues || [],
                fixInstructions: critique?.fixInstructions || [],
              })

              if (passed || !Array.isArray(critique?.fixInstructions) || critique.fixInstructions.length === 0) {
                break
              }

              const fixResult = await runClineFixPass(next.data, critique)
              fixSummaries.push({
                iteration,
                summary: fixResult.summary,
              })

              await logEvent(jobId, 'Applied critic fixes', 'info', {
                stage: 'critic',
                status: 'running',
                iteration,
                summary: fixResult.summary,
              })
            }
          }

          const finalFiles = await listWorkspaceFiles(workspacePath)
          const finalHtmlPath = finalFiles.find((file) => file.endsWith('index.html')) || result.htmlPath
          const finalCssPath = finalFiles.find((file) => file.endsWith('styles.css')) || result.cssPath
          const url = `https://demo.sitesynth.com/${slug}/`
          await logEvent(jobId, 'Cline executor finished', 'info', {
            stage: 'verify',
            status: 'running',
            summary: result.summary,
            htmlPath: finalHtmlPath,
            cssPath: finalCssPath,
            critique: critiqueSummary,
          })

          await apiPost('/demo/build/complete', {
            token: BUILD_TOKEN,
            jobId,
            status: 'published',
            stage: 'publish',
            targetUrl: url,
            summary: result.summary,
            changedFiles: finalFiles.map((file) => path.relative(workspacePath, file)),
            output: {
              url,
              htmlPath: finalHtmlPath,
              cssPath: finalCssPath,
              executor: 'cline',
              critique: critiqueSummary,
              fixSummaries,
            },
            artifacts: [
              ...(finalHtmlPath ? [{
                type: 'html',
                path: finalHtmlPath,
                publicUrl: `${url}${path.basename(finalHtmlPath)}`,
                metadata: { slug },
              }] : []),
              ...(finalCssPath ? [{
                type: 'css',
                path: finalCssPath,
                publicUrl: `${url}${path.basename(finalCssPath)}`,
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
