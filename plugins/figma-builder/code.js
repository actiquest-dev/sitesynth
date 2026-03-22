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

const createButtonSample = (parent, label, x, y, fill) => {
  const button = figma.createFrame()
  button.name = `Button/${label}`
  button.x = x
  button.y = y
  button.resize(160, 44)
  button.fills = [{ type: 'SOLID', color: fill }]
  button.cornerRadius = 10
  parent.appendChild(button)

  const text = figma.createText()
  text.fontName = FONT
  text.fontSize = 12
  text.characters = label
  text.x = x + 20
  text.y = y + 13
  text.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]
  parent.appendChild(text)

  const component = figma.createComponent()
  component.resize(160, 44)
  component.x = x
  component.y = y
  component.name = `Button/${label}`
  component.appendChild(button)
  component.appendChild(text)
  parent.appendChild(component)
  return component
}

const createInputSample = (parent, label, x, y) => {
  const input = figma.createFrame()
  input.name = `Input/${label}`
  input.x = x
  input.y = y
  input.resize(220, 44)
  input.fills = [{ type: 'SOLID', color: { r: 0.12, g: 0.12, b: 0.13 } }]
  input.strokes = [{ type: 'SOLID', color: { r: 0.25, g: 0.25, b: 0.27 } }]
  input.cornerRadius = 8
  parent.appendChild(input)

  const text = figma.createText()
  text.fontName = FONT
  text.fontSize = 11
  text.characters = label
  text.x = x + 12
  text.y = y + 14
  text.fills = [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.62 } }]
  parent.appendChild(text)

  const component = figma.createComponent()
  component.resize(220, 44)
  component.x = x
  component.y = y
  component.name = `Input/${label}`
  component.appendChild(input)
  component.appendChild(text)
  parent.appendChild(component)
  return component
}

const createCardSample = (parent, title, x, y) => {
  const card = figma.createFrame()
  card.name = `Card/${title}`
  card.x = x
  card.y = y
  card.resize(240, 140)
  card.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.11 } }]
  card.strokes = [{ type: 'SOLID', color: { r: 0.24, g: 0.24, b: 0.26 } }]
  card.cornerRadius = 12
  parent.appendChild(card)

  const label = figma.createText()
  label.fontName = FONT
  label.fontSize = 12
  label.characters = title
  label.x = x + 12
  label.y = y + 12
  label.fills = [{ type: 'SOLID', color: { r: 0.85, g: 0.85, b: 0.87 } }]
  parent.appendChild(label)

  const component = figma.createComponent()
  component.resize(240, 140)
  component.x = x
  component.y = y
  component.name = `Card/${title}`
  component.appendChild(card)
  component.appendChild(label)
  parent.appendChild(component)
  return component
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
  const primaryColor = hexToRgb(tokens.brand_primary || '#8D35FF')
  createButtonSample(frame, 'Primary', 520, 360, primaryColor)
  createButtonSample(frame, 'Secondary', 700, 360, hexToRgb(tokens.brand_secondary || '#5B5B5B'))
  createInputSample(frame, 'Email input', 520, 420)
  createInputSample(frame, 'Search input', 760, 420)
  createCardSample(frame, 'Summary card', 520, 480)
  createCardSample(frame, 'Preview card', 780, 480)

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
let currentJobId = null

const formatTimestamp = (date) => {
  const pad = (value) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const postStatus = (text) => {
  figma.ui.postMessage({ type: 'status', text })
}

const logEvent = async (jobId, level, message, payload) => {
  const url = `${API_BASE}/api/figma/build/event`
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: PLUGIN_TOKEN,
        jobId,
        level,
        message,
        payload: payload || null,
      }),
    })
  } catch (error) {
    // Keep plugin running even if event logging fails.
  }
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

const sendCritique = async (jobId, stage, node, structure) => {
  const bytes = await node.exportAsync({ format: 'PNG', constraint: { type: 'WIDTH', value: 1600 } })
  const base64 = figma.base64Encode(bytes)
  const url = `${API_BASE}/api/figma/build/critique`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token: PLUGIN_TOKEN,
      jobId,
      stage,
      imageBase64: base64,
      structure,
    }),
  })
  const data = await response.json()
  if (!data.success) {
    postStatus(data.error || 'Critique failed')
    return null
  }
  return data.data
}

const collectStructure = (page) => {
  return page.findAll().map((node) => ({
    id: node.id,
    name: node.name,
    type: node.type,
    x: node.x,
    y: node.y,
    width: node.width,
    height: node.height,
  }))
}

const applyFixes = (page, fixes) => {
  if (!fixes) return
  const textDelta = typeof fixes.text_size_delta === 'number' ? fixes.text_size_delta : 0
  const radiusDelta = typeof fixes.radius_delta === 'number' ? fixes.radius_delta : 0
  const brighten = typeof fixes.brightness_delta === 'number' ? fixes.brightness_delta : 0

  page.findAll().forEach((node) => {
    if (node.type === 'TEXT' && textDelta) {
      node.fontSize = Math.max(10, node.fontSize + textDelta)
    }
    if ('cornerRadius' in node && radiusDelta) {
      node.cornerRadius = Math.max(0, (node.cornerRadius || 0) + radiusDelta)
    }
    if ('fills' in node && Array.isArray(node.fills) && brighten) {
      node.fills = node.fills.map((fill) => {
        if (fill.type !== 'SOLID') return fill
        return Object.assign({}, fill, {
          color: {
            r: Math.min(1, fill.color.r + brighten),
            g: Math.min(1, fill.color.g + brighten),
            b: Math.min(1, fill.color.b + brighten),
          },
        })
      })
    }
  })
}

const buildFromPlan = async (jobId, plan) => {
  await ensureFont()
  const pageSuffix = `${formatTimestamp(new Date())} (${jobId})`
  const registry = new Map()
  const pendingVariantSets = new Map()

  const register = (name, node, meta) => {
    if (name && node) registry.set(name, { node, meta: meta || {} })
  }

  const getParent = (parentName) => {
    if (!parentName) return figma.currentPage
    const entry = registry.get(parentName)
    return (entry && entry.node) || figma.currentPage
  }

  const getNode = (name) => {
    const entry = registry.get(name)
    return entry && entry.node ? entry.node : null
  }

  const getMeta = (name) => {
    const entry = registry.get(name)
    return entry && entry.meta ? entry.meta : {}
  }

  const setMeta = (name, meta) => {
    const entry = registry.get(name)
    if (entry) {
      entry.meta = Object.assign({}, entry.meta || {}, meta || {})
    }
  }

  const finalizeVariantSets = () => {
    pendingVariantSets.forEach((setInfo, setName) => {
      if (!setInfo.components.length) return

      setInfo.components.forEach((component) => {
        const componentName = component.name
        const meta = getMeta(componentName)
        const variantProps = meta.variantProps || null
        if (variantProps) {
          const pairs = Object.keys(variantProps).map((key) => `${key}=${variantProps[key]}`)
          component.name = pairs.join(', ')
        }
      })

      let componentSet = null
      if (setInfo.components.length === 1) {
        componentSet = setInfo.components[0]
        componentSet.name = setName
        componentSet.x = setInfo.x
        componentSet.y = setInfo.y
      } else {
        componentSet = figma.combineAsVariants(setInfo.components, setInfo.parent)
        componentSet.name = setName
        componentSet.x = setInfo.x
        componentSet.y = setInfo.y
      }
      registry.set(setName, { node: componentSet, meta: { kind: 'component_set' } })
    })
  }

  if (Array.isArray(plan.commands) && plan.commands.length) {
    await logEvent(jobId, 'info', 'Executing command plan', { commandCount: plan.commands.length })

    for (const cmd of plan.commands) {
      const props = cmd.props || {}
      await logEvent(jobId, 'info', `op:${cmd.op}`, { name: cmd.name, parent: cmd.parent || null, props })

      try {
      if (cmd.op === 'create_page') {
        const page = createPage(cmd.name)
        register(cmd.name, page, { kind: 'page' })
      }
      if (cmd.op === 'create_frame') {
        const parent = getParent(cmd.parent)
        const frame = createFrame(parent, cmd.name, props.x || 40, props.y || 40, props.width || 800, props.height || 520)
        register(cmd.name, frame, { kind: 'frame' })
      }
      if (cmd.op === 'create_text') {
        const parent = getParent(cmd.parent)
        const node = figma.createText()
        node.fontName = FONT
        node.characters = props.text || cmd.name
        node.fontSize = props.fontSize || 12
        node.x = props.x || 0
        node.y = props.y || 0
        parent.appendChild(node)
        register(cmd.name, node, { kind: 'text' })
      }
      if (cmd.op === 'set_fill') {
        const node = getNode(cmd.name)
        if (node && props.color) {
          node.fills = [{ type: 'SOLID', color: hexToRgb(props.color) }]
        }
      }
      if (cmd.op === 'set_stroke') {
        const node = getNode(cmd.name)
        if (node && props.color) {
          node.strokes = [{ type: 'SOLID', color: hexToRgb(props.color) }]
        }
      }
      if (cmd.op === 'set_radius') {
        const node = getNode(cmd.name)
        if (node && typeof props.radius === 'number') {
          node.cornerRadius = props.radius
        }
      }
      if (cmd.op === 'resize') {
        const node = getNode(cmd.name)
        if (node && typeof props.width === 'number' && typeof props.height === 'number') {
          node.resize(props.width, props.height)
        }
      }
      if (cmd.op === 'move') {
        const node = getNode(cmd.name)
        if (node && typeof props.x === 'number' && typeof props.y === 'number') {
          node.x = props.x
          node.y = props.y
        }
      }
      if (cmd.op === 'set_text') {
        const node = getNode(cmd.name)
        if (node && node.type === 'TEXT' && typeof props.text === 'string') {
          node.characters = props.text
        }
      }
      if (cmd.op === 'set_font_size') {
        const node = getNode(cmd.name)
        if (node && node.type === 'TEXT' && typeof props.size === 'number') {
          node.fontSize = props.size
        }
      }
      if (cmd.op === 'set_autolayout') {
        const node = getNode(cmd.name)
        if (node && node.type !== 'TEXT') {
          node.layoutMode = props.layoutMode || 'VERTICAL'
        }
      }
      if (cmd.op === 'set_padding') {
        const node = getNode(cmd.name)
        if (node && node.type !== 'TEXT') {
          node.paddingTop = props.top || 0
          node.paddingRight = props.right || 0
          node.paddingBottom = props.bottom || 0
          node.paddingLeft = props.left || 0
        }
      }
      if (cmd.op === 'set_spacing') {
        const node = getNode(cmd.name)
        if (node && node.type !== 'TEXT') {
          node.itemSpacing = props.value || 0
        }
      }
      if (cmd.op === 'set_alignment') {
        const node = getNode(cmd.name)
        if (node && node.type !== 'TEXT') {
          if (props.primaryAxisAlign) node.primaryAxisAlignItems = props.primaryAxisAlign
          if (props.counterAxisAlign) node.counterAxisAlignItems = props.counterAxisAlign
        }
      }
      if (cmd.op === 'set_text_style') {
        const node = getNode(cmd.name)
        if (node && node.type === 'TEXT') {
          if (props.fontSize) node.fontSize = props.fontSize
          if (props.lineHeight) node.lineHeight = { value: props.lineHeight, unit: 'PIXELS' }
          if (props.letterSpacing) node.letterSpacing = { value: props.letterSpacing, unit: 'PERCENT' }
        }
      }
      if (cmd.op === 'create_component') {
        let parent = getParent(cmd.parent)
        if (cmd.parent && pendingVariantSets.has(cmd.parent)) {
          parent = pendingVariantSets.get(cmd.parent).parent
        }
        const component = figma.createComponent()
        component.name = cmd.name
        component.x = props.x || 0
        component.y = props.y || 0
        if (props.width && props.height) {
          component.resize(props.width, props.height)
        }
        parent.appendChild(component)
        register(cmd.name, component, { kind: 'component' })
        if (cmd.parent && pendingVariantSets.has(cmd.parent)) {
          pendingVariantSets.get(cmd.parent).components.push(component)
        }
      }
      if (cmd.op === 'create_component_set') {
        const parent = getParent(cmd.parent)
        pendingVariantSets.set(cmd.name, {
          name: cmd.name,
          parent,
          x: props.x || 0,
          y: props.y || 0,
          components: [],
        })
      }
      if (cmd.op === 'set_variant_props') {
        const node = getNode(cmd.name)
        if (node && node.type === 'COMPONENT') {
          setMeta(cmd.name, { variantProps: props })
        }
      }
      if (cmd.op === 'set_image_fill') {
        const node = getNode(cmd.name)
        if (node && props.imageBytes) {
          const image = figma.createImage(new Uint8Array(props.imageBytes))
          node.fills = [{ type: 'IMAGE', imageHash: image.hash, scaleMode: 'FILL' }]
        }
      }
      if (cmd.op === 'insert_svg') {
        const parent = getParent(cmd.parent)
        if (props.svg) {
          const node = figma.createNodeFromSvg(props.svg)
          node.x = props.x || 0
          node.y = props.y || 0
          parent.appendChild(node)
          register(cmd.name, node, { kind: 'svg' })
        }
      }
      } catch (error) {
        await logEvent(jobId, 'error', `op_failed:${cmd.op}`, {
          name: cmd.name,
          parent: cmd.parent || null,
          props,
          error: error && error.message ? error.message : String(error),
        })
        throw error
      }
    }

    finalizeVariantSets()
    await logEvent(jobId, 'info', 'Command plan executed', { registeredNodes: registry.size, variantSets: pendingVariantSets.size })
  } else {
    const designSystemPage = createPage(`Build ${pageSuffix} · Design System`)
    const wireframesPage = createPage(`Build ${pageSuffix} · Wireframes`)
    const mockupsPage = createPage(`Build ${pageSuffix} · Mockups`)
    const pageMap = createPage(`Build ${pageSuffix} · Page Map`)

    buildDesignSystem(designSystemPage, plan)
    buildWireframes(wireframesPage, plan)
    buildMockups(mockupsPage, plan)
    buildPageMap(pageMap, plan)

    const dsStructure = collectStructure(designSystemPage)
    const critique = await sendCritique(jobId, 'design_system', designSystemPage, dsStructure)
    if (critique && critique.fixes) {
      applyFixes(designSystemPage, critique.fixes)
      await sendCritique(jobId, 'design_system_after', designSystemPage, collectStructure(designSystemPage))
    }

    figma.viewport.scrollAndZoomIntoView([...designSystemPage.children])
  }
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
    currentJobId = job.jobId
    postStatus(`Building job ${job.jobId}...`)
    await logEvent(job.jobId, 'info', 'Plugin started build', { mode: Array.isArray(job.buildPlan && job.buildPlan.commands) && job.buildPlan.commands.length ? 'commands' : 'plan' })
    await buildFromPlan(job.jobId, job.buildPlan)
    await markComplete(job.jobId, figma.fileKey)
    postStatus(`Job ${job.jobId} completed.`)
  } catch (error) {
    if (currentJobId) {
      await logEvent(currentJobId, 'error', 'Plugin build failed', { error: error && error.message ? error.message : String(error) })
    }
    postStatus(`Build failed: ${error.message || error}`)
  } finally {
    isBusy = false
    currentJobId = null
  }
}

setInterval(pollLoop, POLL_INTERVAL)
pollLoop()

// no-op handler to prevent UI->plugin warnings
figma.ui.onmessage = () => {}
