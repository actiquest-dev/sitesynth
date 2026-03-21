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
  const frame = createFrame(page, 'Design System', 40, 80, 960, 520)
  createTitle(frame, 'Design System', 24, 24)
  createBulletList(frame, [
    `Colors: ${colors.join(', ')}`,
    `Typography: ${typography.join(', ')}`,
    `Components: ${components.join(', ')}`,
    `Spacing: ${spacing.join(', ')}`,
  ], 24, 72)
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

figma.showUI(__html__, { width: 420, height: 420 })

figma.ui.onmessage = async (message) => {
  if (message.type !== 'build') return
  try {
    await ensureFont()
    const plan = message.plan || {}

    const designSystemPage = createPage('Design System')
    const wireframesPage = createPage('Wireframes')
    const mockupsPage = createPage('Mockups')
    const pageMap = createPage('Page Map')

    buildDesignSystem(designSystemPage, plan)
    buildWireframes(wireframesPage, plan)
    buildMockups(mockupsPage, plan)
    buildPageMap(pageMap, plan)

    figma.viewport.scrollAndZoomIntoView([...designSystemPage.children])
    figma.notify('SiteSynth build plan applied')
  } catch (error) {
    figma.notify(`Build failed: ${error.message || error}`)
  }
}
