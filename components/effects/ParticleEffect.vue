<template>
  <div class="particles-container absolute inset-0 z-0 overflow-hidden">
    <div
      v-for="particle in particles"
      :key="particle.id"
      class="particle"
      :style="{
        left: particle.x + '%',
        top: particle.y + '%',
        animationDelay: particle.delay + 's',
        animationDuration: particle.duration + 's',
      }"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const particles = ref([]);
let animationFrame = null;

const createParticle = (id) => ({
  id,
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 5,
  duration: 20 + Math.random() * 10, // Longer duration for slower animation
  vx: (Math.random() - 0.5) * 0.2, // Reduced from 0.5 to 0.2 for slower horizontal movement
  vy: (Math.random() - 0.5) * 0.2, // Reduced from 0.5 to 0.2 for slower vertical movement
});

const updateParticles = () => {
  particles.value.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    // Wrap around edges
    if (particle.x > 100) particle.x = 0;
    if (particle.x < 0) particle.x = 100;
    if (particle.y > 100) particle.y = 0;
    if (particle.y < 0) particle.y = 100;
  });

  animationFrame = requestAnimationFrame(updateParticles);
};

onMounted(() => {
  // Create initial particles
  for (let i = 0; i < 70; i++) {
    particles.value.push(createParticle(i));
  }

  // Start animation loop
  updateParticles();
});

onBeforeUnmount(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
});
</script>

<style scoped>
.particles-container {
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  animation: float linear infinite, fade ease-in-out infinite alternate;
}

@keyframes float {
  0% {
    transform: translateY(0px) translateX(0px);
  }
  25% {
    transform: translateY(-20px) translateX(10px);
  }
  50% {
    transform: translateY(-10px) translateX(-15px);
  }
  75% {
    transform: translateY(-30px) translateX(5px);
  }
  100% {
    transform: translateY(0px) translateX(0px);
  }
}

@keyframes fade {
  0% {
    opacity: 0.7;
  }
  100% {
    opacity: 0.8;
  }
}
</style>
