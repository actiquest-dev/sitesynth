import { onMounted, onUnmounted } from 'vue'

export const useCursorGlow = () => {
  let raf: number | null = null
  let container: HTMLElement | null = null
  let layerOuter: HTMLElement | null = null
  let layerMid:   HTMLElement | null = null
  let layerInner: HTMLElement | null = null
  const cleanupFns: (() => void)[] = []

  onMounted(() => {
    if (typeof window === 'undefined') return
    // Only on real pointer devices — skip touch
    if (!window.matchMedia('(pointer: fine)').matches) return

    // Remove stale instance if any (HMR safety)
    document.getElementById('cursor-glow-root')?.remove()

    // ── Build DOM ──────────────────────────────────────────────────────────
    container = document.createElement('div')
    container.id = 'cursor-glow-root'
    Object.assign(container.style, {
      position:      'fixed',
      top:           '0',
      left:          '0',
      width:         '0',
      height:        '0',
      pointerEvents: 'none',
      zIndex:        '9998',
      overflow:      'visible',
    })

    /**
     * Each layer is centered at (0,0) via negative margin,
     * then translated to the mouse position each frame.
     */
    const makeLayer = (
      size: number,
      blur: number,
      stops: [string, string],
    ): HTMLElement => {
      const half = size / 2
      const el   = document.createElement('div')
      Object.assign(el.style, {
        position:     'absolute',
        width:        `${size}px`,
        height:       `${size}px`,
        marginLeft:   `-${half}px`,
        marginTop:    `-${half}px`,
        background:   `radial-gradient(circle, ${stops[0]} 0%, ${stops[1]} 45%, transparent 70%)`,
        borderRadius: '50%',
        filter:       `blur(${blur}px)`,
        willChange:   'transform, opacity',
        opacity:      '0',
        transition:   'opacity 0.6s ease',
      })
      container!.appendChild(el)
      return el
    }

    // Outer halo  — large, very soft, diffuse
    layerOuter = makeLayer(340, 32, [
      'rgba(141,53,255,0.10)',
      'rgba(141,53,255,0.04)',
    ])
    // Mid glow  — medium, noticeable
    layerMid = makeLayer(110, 12, [
      'rgba(160,80,255,0.28)',
      'rgba(141,53,255,0.10)',
    ])
    // Inner core — small bright point of light
    layerInner = makeLayer(30, 3, [
      'rgba(220,180,255,0.85)',
      'rgba(160,80,255,0.40)',
    ])

    document.body.appendChild(container)

    // ── Cursor state ───────────────────────────────────────────────────────
    let mx = window.innerWidth  / 2
    let my = window.innerHeight / 2

    // Each layer tracks position at a different lerp speed
    let ox = mx, oy = my   // outer  (slow / dreamy)
    let px = mx, py = my   // mid    (moderate)
    let ix = mx, iy = my   // inner  (snappy)

    let visible    = false
    let clickPulse = 0     // 0–1, decays each frame

    // ── Event handlers ─────────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY

      if (!visible) {
        // Snap all layers to cursor on first appearance so there's no jump
        ox = mx; oy = my
        px = mx; py = my
        ix = mx; iy = my
        visible = true
        layerOuter!.style.opacity = '1'
        layerMid!.style.opacity   = '1'
        layerInner!.style.opacity = '1'
      }
    }

    const onLeave = () => {
      visible = false
      layerOuter!.style.opacity = '0'
      layerMid!.style.opacity   = '0'
      layerInner!.style.opacity = '0'
    }

    const onClick = () => { clickPulse = 1 }

    document.addEventListener('mousemove',  onMove,  { passive: true })
    document.addEventListener('mouseleave', onLeave, { passive: true })
    document.addEventListener('click',      onClick, { passive: true })

    cleanupFns.push(
      () => document.removeEventListener('mousemove',  onMove),
      () => document.removeEventListener('mouseleave', onLeave),
      () => document.removeEventListener('click',      onClick),
    )

    // ── Animation loop ─────────────────────────────────────────────────────
    const tick = () => {
      // Lerp: outer drifts lazily, inner reacts quickly
      ox += (mx - ox) * 0.055
      oy += (my - oy) * 0.055

      px += (mx - px) * 0.13
      py += (my - py) * 0.13

      ix += (mx - ix) * 0.26
      iy += (my - iy) * 0.26

      // Click pulse decays smoothly
      if (clickPulse > 0) clickPulse = Math.max(0, clickPulse - 0.035)
      const cp = clickPulse

      layerOuter!.style.transform = `translate3d(${ox}px,${oy}px,0) scale(${1 + cp * 0.35})`
      layerMid!.style.transform   = `translate3d(${px}px,${py}px,0) scale(${1 + cp * 0.65})`
      layerInner!.style.transform = `translate3d(${ix}px,${iy}px,0) scale(${1 + cp * 1.20})`

      raf = requestAnimationFrame(tick)
    }

    tick()
  })

  onUnmounted(() => {
    if (raf) cancelAnimationFrame(raf)
    cleanupFns.forEach(fn => fn())
    container?.remove()
    container = null
    layerOuter = layerMid = layerInner = null
  })
}
