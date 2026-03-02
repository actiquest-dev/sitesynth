<template>
  <canvas
    ref="canvasRef"
    class="particles-canvas absolute inset-0 z-0 pointer-events-none"
    aria-hidden="true"
  />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvasRef = ref(null)

let ctx      = null
let raf      = null
let W        = 0
let H        = 0
let mouseX   = -9999
let mouseY   = -9999
let particles = []
let comets    = []
let cometTimer = null
let ro        = null
let _parent   = null
let _onMove   = null
let _onLeave  = null

// ─── Config ────────────────────────────────────────────────────────────────
const COUNT        = 100        // number of ambient particles
const CONNECT_DIST = 90         // max distance for constellation lines (px)
const MOUSE_R      = 140        // mouse repulsion radius
const COMET_EVERY  = 3800       // avg ms between comets

// Brand colour palette (weighted)
const PALETTE = [
  { r: 255, g: 255, b: 255, glow: false, w: 5 }, // white
  { r: 215, g: 200, b: 255, glow: false, w: 2 }, // soft lavender
  { r: 170, g: 110, b: 255, glow: true,  w: 2 }, // purple
  { r: 141, g:  53, b: 255, glow: true,  w: 1 }, // brand purple
]

function pickColor() {
  const total = PALETTE.reduce((s, c) => s + c.w, 0)
  let roll = Math.random() * total
  for (const c of PALETTE) { roll -= c.w; if (roll <= 0) return c }
  return PALETTE[0]
}

// ─── Factories ─────────────────────────────────────────────────────────────
function makeParticle(id) {
  const col = pickColor()
  return {
    id,
    x:          Math.random() * W,
    y:          Math.random() * H,
    vx:         (Math.random() - 0.5) * 0.13,
    vy:         (Math.random() - 0.5) * 0.13,
    col,
    size:       col.glow ? 1.3 + Math.random() * 2 : 0.5 + Math.random() * 1.3,
    baseAlpha:  0.22 + Math.random() * 0.58,
    alpha:      0,
    phase:      Math.random() * Math.PI * 2,
    phaseSpeed: 0.004 + Math.random() * 0.01,
  }
}

function makeComet() {
  const fromLeft = Math.random() < 0.5
  const x     = fromLeft ? -30 : W + 30
  const baseA = fromLeft ? 0 : Math.PI
  const angle = baseA + (Math.random() - 0.5) * 0.5
  const speed = 2.8 + Math.random() * 3.2
  const purple = Math.random() < 0.4
  return {
    x, y: Math.random() * H * 0.7,
    vx:   Math.cos(angle) * speed,
    vy:   Math.sin(angle) * speed + 0.25 + Math.random() * 0.45,
    trail: 70 + Math.random() * 110,
    sz:   0.7 + Math.random() * 1.2,
    r:    purple ? 170 : 255,
    g:    purple ? 120 : 255,
    b:    purple ? 255 : 255,
    a:    0.55 + Math.random() * 0.35,
    life: 1,
    decay:0.014 + Math.random() * 0.012,
  }
}

// ─── Resize ────────────────────────────────────────────────────────────────
function resize() {
  const c = canvasRef.value
  if (!c) return
  W = c.width  = c.offsetWidth  || c.parentElement?.offsetWidth  || 1280
  H = c.height = c.offsetHeight || c.parentElement?.offsetHeight || 720
}

// ─── Drawing ───────────────────────────────────────────────────────────────
function drawParticle(p) {
  const { r, g, b } = p.col
  const a = p.alpha

  if (p.col.glow) {
    const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5.5)
    grd.addColorStop(0,   `rgba(${r},${g},${b},${(a * 0.85).toFixed(3)})`)
    grd.addColorStop(0.35,`rgba(${r},${g},${b},${(a * 0.30).toFixed(3)})`)
    grd.addColorStop(1,   `rgba(${r},${g},${b},0)`)
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size * 5.5, 0, Math.PI * 2)
    ctx.fillStyle = grd
    ctx.fill()
  }

  ctx.beginPath()
  ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
  ctx.fillStyle = `rgba(${r},${g},${b},${a.toFixed(3)})`
  ctx.fill()
}

function drawComet(c) {
  const mag  = Math.hypot(c.vx, c.vy)
  const tailX = c.x - (c.vx / mag) * c.trail
  const tailY = c.y - (c.vy / mag) * c.trail
  const a     = (c.a * c.life).toFixed(3)

  const grd = ctx.createLinearGradient(c.x, c.y, tailX, tailY)
  grd.addColorStop(0, `rgba(${c.r},${c.g},${c.b},${a})`)
  grd.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`)

  ctx.beginPath()
  ctx.moveTo(c.x, c.y)
  ctx.lineTo(tailX, tailY)
  ctx.strokeStyle = grd
  ctx.lineWidth   = c.sz
  ctx.stroke()

  // bright head dot
  ctx.beginPath()
  ctx.arc(c.x, c.y, c.sz * 1.6, 0, Math.PI * 2)
  ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${a})`
  ctx.fill()

  // tiny glow halo around head
  const halo = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.sz * 7)
  halo.addColorStop(0,   `rgba(${c.r},${c.g},${c.b},${(c.a * c.life * 0.5).toFixed(3)})`)
  halo.addColorStop(1,   `rgba(${c.r},${c.g},${c.b},0)`)
  ctx.beginPath()
  ctx.arc(c.x, c.y, c.sz * 7, 0, Math.PI * 2)
  ctx.fillStyle = halo
  ctx.fill()
}

// ─── Main animation loop ───────────────────────────────────────────────────
function tick() {
  ctx.clearRect(0, 0, W, H)

  // — Constellation lines —
  const cd2 = CONNECT_DIST * CONNECT_DIST
  for (let i = 0; i < particles.length; i++) {
    const pi = particles[i]
    for (let j = i + 1; j < particles.length; j++) {
      const pj  = particles[j]
      const dx  = pi.x - pj.x
      const dy  = pi.y - pj.y
      const d2  = dx * dx + dy * dy
      if (d2 >= cd2) continue

      const d    = Math.sqrt(d2)
      const lineA = (1 - d / CONNECT_DIST) * 0.065
      const mr   = (pi.col.r + pj.col.r) >> 1
      const mg   = (pi.col.g + pj.col.g) >> 1
      const mb   = (pi.col.b + pj.col.b) >> 1
      ctx.beginPath()
      ctx.moveTo(pi.x, pi.y)
      ctx.lineTo(pj.x, pj.y)
      ctx.strokeStyle = `rgba(${mr},${mg},${mb},${lineA.toFixed(3)})`
      ctx.lineWidth   = 0.55
      ctx.stroke()
    }
  }

  // — Particles —
  for (const p of particles) {
    // mouse repulsion
    const mdx = p.x - mouseX
    const mdy = p.y - mouseY
    const md  = Math.hypot(mdx, mdy)
    if (md < MOUSE_R && md > 1) {
      const f = (1 - md / MOUSE_R) * 0.02
      p.vx += (mdx / md) * f
      p.vy += (mdy / md) * f
    }

    // friction + speed cap
    p.vx *= 0.997
    p.vy *= 0.997
    const spd = Math.hypot(p.vx, p.vy)
    if (spd > 0.5) { p.vx = p.vx / spd * 0.5; p.vy = p.vy / spd * 0.5 }

    // twinkle
    p.phase += p.phaseSpeed
    p.alpha  = p.baseAlpha * (0.4 + 0.6 * Math.sin(p.phase))

    // move + wrap
    p.x += p.vx; p.y += p.vy
    if (p.x < -6) p.x = W + 6; else if (p.x > W + 6) p.x = -6
    if (p.y < -6) p.y = H + 6; else if (p.y > H + 6) p.y = -6

    drawParticle(p)
  }

  // — Comets —
  comets = comets.filter(c => {
    c.x += c.vx; c.y += c.vy
    c.life -= c.decay
    if (c.life <= 0) return false
    drawComet(c)
    return true
  })

  raf = requestAnimationFrame(tick)
}

// ─── Comet scheduler ──────────────────────────────────────────────────────
function scheduleComet() {
  const jitter = (Math.random() - 0.5) * 2000
  cometTimer = setTimeout(() => {
    if (comets.length < 2) comets.push(makeComet())
    scheduleComet()
  }, COMET_EVERY + jitter)
}

// ─── Lifecycle ────────────────────────────────────────────────────────────
onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  // respect reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  resize()
  ctx = canvas.getContext('2d')

  for (let i = 0; i < COUNT; i++) particles.push(makeParticle(i))

  tick()
  scheduleComet()

  _parent  = canvas.parentElement || canvas
  _onMove  = (e) => {
    const rect = canvas.getBoundingClientRect()
    mouseX = e.clientX - rect.left
    mouseY = e.clientY - rect.top
  }
  _onLeave = () => { mouseX = -9999; mouseY = -9999 }

  _parent.addEventListener('mousemove', _onMove,  { passive: true })
  _parent.addEventListener('mouseleave', _onLeave, { passive: true })

  ro = new ResizeObserver(resize)
  ro.observe(_parent)
})

onBeforeUnmount(() => {
  if (raf)        cancelAnimationFrame(raf)
  if (cometTimer) clearTimeout(cometTimer)
  if (_parent)    {
    _parent.removeEventListener('mousemove',  _onMove)
    _parent.removeEventListener('mouseleave', _onLeave)
  }
  ro?.disconnect()
})
</script>

<style scoped>
.particles-canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
