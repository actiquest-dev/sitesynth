import { onMounted, onUnmounted } from 'vue'

export const useCursorGlow = () => {
  let glowElement: HTMLElement | null = null

  const initCursorGlow = () => {
    // Create glow element
    glowElement = document.createElement('div')
    glowElement.id = 'cursor-glow'
    glowElement.style.cssText = `
      position: fixed;
      width: 80px;
      height: 80px;
      background: radial-gradient(circle, rgba(0, 51, 255, 0.4) 0%, rgba(0, 51, 255, 0.2) 40%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
      display: none;
      z-index: 9999;
      box-shadow: 0 0 30px rgba(0, 51, 255, 0.5), 0 0 60px rgba(0, 51, 255, 0.3);
      filter: blur(8px);
      transition: opacity 0.2s ease;
    `
    document.body.appendChild(glowElement)

    // Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      if (!glowElement) return

      const x = e.clientX
      const y = e.clientY

      glowElement.style.left = `${x - 40}px`
      glowElement.style.top = `${y - 40}px`
      glowElement.style.display = 'block'
    }

    const handleMouseLeave = () => {
      if (glowElement) {
        glowElement.style.display = 'none'
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }

  onMounted(() => {
    initCursorGlow()
  })

  onUnmounted(() => {
    if (glowElement) {
      glowElement.remove()
      glowElement = null
    }
  })
}
