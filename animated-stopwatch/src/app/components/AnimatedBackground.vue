<template>
  <canvas
    ref="canvasRef"
    class="absolute inset-0 w-full h-full pointer-events-none"
    style="z-index: 0"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  let animId: number

  const resize = () => {
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width || canvas.parentElement?.offsetWidth || 800
    canvas.height = rect.height || canvas.parentElement?.offsetHeight || 475
  }

  const ro = new ResizeObserver(resize)
  if (canvas.parentElement) ro.observe(canvas.parentElement)
  resize()

  const blobs = [
    { baseX: 0.78, baseY: -0.05, r: 0.42, color: [165, 31, 255], speed: 0.00018, amp: 0.06, phase: 0 },
    { baseX: 0.88, baseY: 0.55, r: 0.30, color: [0, 80, 255], speed: 0.00024, amp: 0.07, phase: 1.3 },
    { baseX: 0.58, baseY: 0.12, r: 0.24, color: [110, 0, 230], speed: 0.00020, amp: 0.05, phase: 2.6 },
    { baseX: 0.12, baseY: 0.65, r: 0.20, color: [60, 0, 190], speed: 0.00014, amp: 0.08, phase: 0.8 },
  ]

  const draw = (ts: number) => {
    const W = canvas.width
    const H = canvas.height
    ctx.clearRect(0, 0, W, H)

    blobs.forEach((b) => {
      const px = (b.baseX + Math.sin(ts * b.speed + b.phase) * b.amp) * W
      const py = (b.baseY + Math.cos(ts * b.speed * 1.3 + b.phase) * b.amp) * H
      const pulse = 1 + 0.06 * Math.sin(ts * b.speed * 3 + b.phase)
      const radius = b.r * Math.min(W, H) * pulse

      const gr = ctx.createRadialGradient(px, py, 0, px, py, radius)
      const [r, g, bl] = b.color
      gr.addColorStop(0, `rgba(${r},${g},${bl},0.30)`)
      gr.addColorStop(0.45, `rgba(${r},${g},${bl},0.12)`)
      gr.addColorStop(1, `rgba(${r},${g},${bl},0)`)

      ctx.fillStyle = gr
      ctx.beginPath()
      ctx.arc(px, py, radius, 0, Math.PI * 2)
      ctx.fill()
    })

    animId = requestAnimationFrame(draw)
  }

  animId = requestAnimationFrame(draw)

  onUnmounted(() => {
    cancelAnimationFrame(animId)
    ro.disconnect()
  })
})
</script>
