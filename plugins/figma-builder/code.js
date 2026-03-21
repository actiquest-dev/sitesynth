const FONT = { family: 'Roboto', style: 'Regular' }

const ensureFont = async () => {
  await figma.loadFontAsync(FONT)
}

const createPage = (name) => {
  const page = figma.createPage()
  page.name = name
  figma.root.appendChild(page)
  return page
}

const createTitle = (parent, text, x, y) => {
  const node = figma.createText()
  node.fontName = FONT
  node.characters = text
  node.fontSize = 20
  node.x = x
  node.y = y
  parent.appendChild(node)
  return node
}

const createFrame = (parent, name, x, y, width = 800, height = 520) => {
  const frame = figma.createFrame()
  frame.name = name
  frame.x = x
  frame.y = y
  frame.resize(width, height)
  frame.fills = [{ type: 'SOLID', color: { r: 0.05, g: 0.05, b: 0.06 } }]
  frame.strokes = [{ type: 'SOLID', color: { r: 0.2, g: 0.2, b: 0.22 } }]
  frame.cornerRadius = 12
  parent.appendChild(frame)
  return frame
}

const hexToRgb = (hex) => {
  if (!hex) return { r: 0.5, g: 0.5, b: 0.5 }
  const clean = hex.replace('#', '')
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean
  const num = parseInt(full, 16)
  return {
    r: ((num >> 16) & 255) / 255,
    g: ((num >> 8) & 255) / 255,
    b: (num & 255) / 255,
  }
}

const createSwatch = (parent, name, hex, x, y) => {
  const swatch = figma.createFrame()
  swatch.name = name
  swatch.x = x
  swatch.y = y
  swatch.resize(120, 80)
  swatch.fills = [{ type: 'SOLID', color: hexToRgb(hex) }]
  swatch.strokes = [{ type: 'SOLID', color: { r: 0.2, g: 0.2, b: 0.22 } }]
  swatch.cornerRadius = 10
  parent.appendChild(swatch)

  const label = figma.createText()
  label.fontName = FONT
  label.fontSize = 10
  label.characters = `${name}\n${hex || ''}`
  label.x = x
  label.y = y + 90
  label.fills = [{ type: 'SOLID', color: { r: 0.75, g: 0.75, b: 0.78 } }]
  parent.appendChild(label)
}

const createComponentCard = (parent, name, description, x, y) => {
  const frame = figma.createFrame()
  frame.name = name
  frame.x = x
  frame.y = y
  frame.resize(220, 120)
  frame.fills = [{ type: 'SOLID', color: { r: 0.09, g: 0.09, b: 0.1 } }]
  frame.strokes = [{ type: 'SOLID', color: { r: 0.25, g: 0.25, b: 0.27 } }]
  frame.cornerRadius = 12
  parent.appendChild(frame)

  const title = figma.createText()
  title.fontName = FONT
  title.fontSize = 12
  title.characters = name
  title.x = x + 12
  title.y = y + 10
  title.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.92 } }]
  parent.appendChild(title)

  if (description) {
    const body = figma.createText()
    body.fontName = FONT
    body.fontSize = 10
    body.characters = description
    body.x = x + 12
    body.y = y + 36
    body.resize(196, 70)
    body.fills = [{ type: 'SOLID', color: { r: 0.7, g: 0.7, b: 0.72 } }]
    parent.appendChild(body)
  }
}

const createTypographySample = (parent, name, value, x, y) => {
  const label = figma.createText()
  label.fontName = FONT
  label.fontSize = 12
  label.characters = `${name}: ${value || ''}`
  label.x = x
  label.y = y
  label.fills = [{ type: 'SOLID', color: { r: 0.85, g: 0.85, b: 0.86 } }]
  parent.appendChild(label)
}

const createBulletList = (parent, lines, x, y) => {
  if (!lines || !lines.length) return
  const textNode = figma.createText()
  textNode.fontName = FONT
  textNode.fontSize = 12
  textNode.x = x
  textNode.y = y
  textNode.characters = lines.map((line) => `• ${line}`).join('\n')
  textNode.fills = [{ type: 'SOLID', color: { r: 0.85, g: 0.85, b: 0.86 } }]
  parent.appendChild(textNode)
}

const buildDesignSystem = (page, plan) => {
  const designSystem = plan && plan.design_system ? plan.design_system : {}
  const colors = Array.isArray(designSystem.colors) ? designSystem.colors : []
  const typography = Array.isArray(designSystem.typography) ? designSystem.typography : []
  const components = Array.isArray(designSystem.components) ? designSystem.components : []
  const spacing = Array.isArray(designSystem.spacing) ? designSystem.spacing : []
  const tokens = designSystem.tokens || {}
  const frame = createFrame(page, 'Design System', 40, 80, 1120, 680)
  createTitle(frame, 'Design System', 24, 24)

  createTitle(frame, 'Color Tokens', 24, 72)
  const swatchBaseX = 24
  let swatchX = swatchBaseX
  let swatchY = 110
  const swatches = [
    ['Primary', tokens.brand_primary],
    ['Secondary', tokens.brand_secondary],
    ['Background', tokens.background],
    ['Surface', tokens.surface],
    ['Text', tokens.text_primary],
    ['Text Secondary', tokens.text_secondary],
    ['Accent', tokens.accent],
  ]
  swatches.forEach((entry, index) => {
    createSwatch(frame, entry[0], entry[1], swatchX, swatchY)
    swatchX += 150
    if ((index + 1) % 5 === 0) {
      swatchX = swatchBaseX
      swatchY += 140
    }
  })

  createTitle(frame, 'Typography', 24, 330)
  createTypographySample(frame, 'Heading', typography[0] || 'Heading / 24px', 24, 360)
  createTypographySample(frame, 'Body', typography[1] || 'Body / 14px', 24, 390)
  createTypographySample(frame, 'Accent', typography[2] || 'Accent / 12px', 24, 420)

  createTitle(frame, 'Components', 520, 330)
  let compX = 520
  let compY = 360
  components.slice(0, 6).forEach((component) => {
    createComponentCard(frame, component, '', compX, compY)
    compX += 240
    if (compX > 980) {
      compX = 520
      compY += 140
    }
  })

  createTitle(frame, 'Spacing', 520, 540)
  createBulletList(frame, spacing, 520, 570)
}

const buildWireframes = (page, plan) => {
  const wireframes = plan && Array.isArray(plan.wireframes) ? plan.wireframes : []
  let offsetX = 40
  let offsetY = 80
  const maxWidth = 1200

  wireframes.forEach((wire) => {
    const frame = createFrame(page, `Wireframe: ${wire.name}`, offsetX, offsetY, 520, 420)
    createTitle(frame, wire.name, 24, 24)
    createBulletList(frame, wire.frames || [], 24, 70)
    createBulletList(frame, wire.key_flows || [], 24, 180)

    offsetX += 560
    if (offsetX > maxWidth) {
      offsetX = 40
      offsetY += 460
    }
  })
}

const buildMockups = (page, plan) => {
  const mockups = plan && Array.isArray(plan.mockups) ? plan.mockups : []
  let offsetX = 40
  let offsetY = 80
  const maxWidth = 1200

  mockups.forEach((mock) => {
    const frame = createFrame(page, `Mockup: ${mock.name}`, offsetX, offsetY, 520, 420)
    createTitle(frame, mock.name, 24, 24)
    createBulletList(frame, mock.frames || [], 24, 70)
    createBulletList(frame, mock.visual_notes || [], 24, 180)

    offsetX += 560
    if (offsetX > maxWidth) {
      offsetX = 40
      offsetY += 460
    }
  })
}

const buildPageMap = (page, plan) => {
  const maps = plan && Array.isArray(plan.page_map) ? plan.page_map : []
  let offsetY = 80
  maps.forEach((entry) => {
    const frame = createFrame(page, entry.page, 40, offsetY, 900, 260)
    createTitle(frame, entry.page, 24, 24)
    createBulletList(frame, entry.sections || [], 24, 70)
    createBulletList(frame, entry.critical_components || [], 24, 160)
    offsetY += 280
  })
}

figma.showUI(__html__, { width: 420, height: 200 })

const API_BASE = 'https://sitesynth-eight.vercel.app'
const PLUGIN_TOKEN = '268cc61590a8f2e541fa99e322722364c528bbc57c97efcaf8eb21b7eece1461'
const POLL_INTERVAL = 8000

let isBusy = false

const formatTimestamp = (date) => {
  const pad = (value) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const postStatus = (text) => {
  figma.ui.postMessage({ type: 'status', text })
}

const fetchNextJob = async () => {
  const url = `${API_BASE}/api/figma/build/next?token=${encodeURIComponent(PLUGIN_TOKEN)}`
  const response = await fetch(url)
  const data = await response.json()
  if (!data.success) {
    return null
  }
  return data.data
}

const markComplete = async (jobId, fileKey) => {
  const url = `${API_BASE}/api/figma/build/complete`
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token: PLUGIN_TOKEN,
      jobId,
      fileKey,
      fileUrl: `https://www.figma.com/file/${fileKey}`,
    }),
  })
}

const buildFromPlan = async (jobId, plan) => {
  await ensureFont()
  const pageSuffix = `${formatTimestamp(new Date())} (${jobId})`
  const designSystemPage = createPage(`Build ${pageSuffix} · Design System`)
  const wireframesPage = createPage(`Build ${pageSuffix} · Wireframes`)
  const mockupsPage = createPage(`Build ${pageSuffix} · Mockups`)
  const pageMap = createPage(`Build ${pageSuffix} · Page Map`)

  buildDesignSystem(designSystemPage, plan)
  buildWireframes(wireframesPage, plan)
  buildMockups(mockupsPage, plan)
  buildPageMap(pageMap, plan)

  figma.viewport.scrollAndZoomIntoView([...designSystemPage.children])
}

const pollLoop = async () => {
  if (isBusy) return
  isBusy = true
  try {
    const job = await fetchNextJob()
    if (!job) {
      postStatus('Idle. Waiting for new build jobs...')
      return
    }
    postStatus(`Building job ${job.jobId}...`)
    await buildFromPlan(job.jobId, job.buildPlan)
    await markComplete(job.jobId, figma.fileKey)
    postStatus(`Job ${job.jobId} completed.`)
  } catch (error) {
    postStatus(`Build failed: ${error.message || error}`)
  } finally {
    isBusy = false
  }
}

setInterval(pollLoop, POLL_INTERVAL)
pollLoop()
