import http from 'node:http'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import crypto from 'node:crypto'
import puppeteer from 'puppeteer-core'
import slugify from 'slugify'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = Number(process.env.REFERENCE_CAPTURE_PORT || 8890)
const HOST = process.env.REFERENCE_CAPTURE_HOST || '127.0.0.1'
const TOKEN = process.env.REFERENCE_CAPTURE_TOKEN || ''
const STORAGE_ROOT = process.env.REFERENCE_CAPTURE_STORAGE_ROOT || path.join(__dirname, 'storage')
const PUBLIC_BASE_URL = process.env.REFERENCE_CAPTURE_PUBLIC_BASE_URL || 'https://mcp.sitesynth.com/design_references'
const CHROMIUM_PATH = process.env.CHROMIUM_PATH || '/usr/bin/chromium-browser'
const CAPTURE_HEADLESS = process.env.REFERENCE_CAPTURE_HEADLESS === 'true'
const USER_DATA_DIR = process.env.REFERENCE_CAPTURE_USER_DATA_DIR || '/tmp/reference-capture-chrome-profile'

const json = (statusCode, payload) => ({
  statusCode,
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify(payload),
})

const send = (res, response) => {
  res.writeHead(response.statusCode, response.headers)
  res.end(response.body)
}

const parseBody = async (req) => {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const raw = Buffer.concat(chunks).toString('utf8')
  return raw ? JSON.parse(raw) : {}
}

const ensureAuthorized = (req) => {
  if (!TOKEN) return true
  const header = req.headers.authorization || ''
  return header === `Bearer ${TOKEN}`
}

const sanitizeSegment = (value, fallback) => {
  const normalized = slugify(String(value || fallback || 'item'), {
    lower: true,
    strict: true,
    trim: true,
  })
  return normalized || fallback || 'item'
}

const ensureDir = async (dir) => {
  await fs.mkdir(dir, { recursive: true })
}

const uniqueName = (name) => {
  const suffix = crypto.randomBytes(4).toString('hex')
  return `${name}-${suffix}`
}

const launchBrowser = async () => {
  await ensureDir(USER_DATA_DIR)
  return puppeteer.launch({
    executablePath: CHROMIUM_PATH,
    headless: CAPTURE_HEADLESS,
    userDataDir: USER_DATA_DIR,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--start-maximized',
      '--hide-scrollbars',
      '--disable-blink-features=AutomationControlled',
    ],
    defaultViewport: null,
  })
}

const captureOne = async (browser, jobRoot, publicRoot, item, viewport) => {
  const page = await browser.newPage()
  await page.setUserAgent(
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  )
  await page.setExtraHTTPHeaders({ 'accept-language': 'en-US,en;q=0.9' })
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false })
  })
  await page.setViewport(viewport)
  await page.goto(item.url, {
    waitUntil: 'networkidle2',
    timeout: 45000,
  })

  const safeSlug = sanitizeSegment(item.slug || item.label || item.url, 'reference')
  const filename = uniqueName(`${safeSlug}-${viewport.name}`) + '.png'
  const outputPath = path.join(jobRoot, filename)

  await page.screenshot({
    path: outputPath,
    fullPage: true,
    type: 'png',
  })

  const title = await page.title().catch(() => '')
  const finalUrl = page.url()
  await page.close()

  return {
    kind: item.kind || 'page',
    label: item.label || safeSlug,
    sourceUrl: item.url,
    finalUrl,
    viewport: viewport.name,
    title,
    fileName: filename,
    publicUrl: `${publicRoot}/${filename}`,
  }
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      return send(res, json(200, { status: 'ok' }))
    }

    if (req.method === 'POST' && req.url === '/capture') {
      if (!ensureAuthorized(req)) {
        return send(res, json(401, { success: false, error: 'Unauthorized' }))
      }

      const body = await parseBody(req)
      const briefId = sanitizeSegment(body.briefId || 'unscoped', 'unscoped')
      const competitor = sanitizeSegment(body.competitor || 'reference', 'reference')
      const pages = Array.isArray(body.pages) ? body.pages.filter((item) => item && item.url) : []

      if (!pages.length) {
        return send(res, json(400, { success: false, error: 'pages[] with url is required' }))
      }

      const jobRoot = path.join(STORAGE_ROOT, briefId, competitor)
      const publicRoot = `${PUBLIC_BASE_URL}/${briefId}/${competitor}`
      await ensureDir(jobRoot)

      const browser = await launchBrowser()
      try {
        const outputs = []
        const viewports = [
          { name: 'desktop', width: 1440, height: 2200 },
          { name: 'mobile', width: 430, height: 1800 },
        ]

        for (const item of pages) {
          const targetViewports = item.viewport === 'desktop'
            ? [viewports[0]]
            : item.viewport === 'mobile'
              ? [viewports[1]]
              : viewports

          for (const viewport of targetViewports) {
            outputs.push(await captureOne(browser, jobRoot, publicRoot, item, viewport))
          }
        }

        return send(res, json(200, {
          success: true,
          data: {
            briefId,
            competitor,
            assets: outputs,
          },
        }))
      } finally {
        await browser.close()
      }
    }

    return send(res, json(404, { success: false, error: 'Not found' }))
  } catch (error) {
    return send(res, json(500, {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }))
  }
})

server.listen(PORT, HOST, async () => {
  await ensureDir(STORAGE_ROOT)
  console.log(`[reference-capture] listening on http://${HOST}:${PORT} mode=${CAPTURE_HEADLESS ? 'headless' : 'headed'} profile=${USER_DATA_DIR}`)
})
