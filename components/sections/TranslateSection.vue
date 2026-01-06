<template>
  <section
    ref="sectionRef"
    :id="id || undefined"
    :class="`${bgColor} group relative overflow-hidden`"
  >
    <GlowEffect />

    <div :class="`border-t border-b border-[#636363] ${contentBgColor}`">
      <div class="max-w-[1248px] mx-auto grid grid-cols-1 md:grid-cols-2 px-6">
        <!-- Image Section -->
        <div class="md:border-r border-[#636363]">
          <img :src="imageSrc" :alt="imageAlt" :class="`${imagePosition}`" />
        </div>

        <!-- Content Section -->
        <div class="py-12 md:pl-8">
          <h2 :class="`text-2xl font-semibold pb-4 ${textColor}`">
            {{ mainTitle }}
          </h2>

          <p :class="`leading-relaxed ${textColor}`">
            {{ mainDescription }}
          </p>

          <!-- Dynamic Links (Pills with animation on scroll) -->
          <div class="flex flex-wrap gap-4 py-6" :class="{ 'pills-visible': inView }">
            <div
              v-for="(link, index) in links"
              :key="index"
              :style="{ '--i': index }"
              :class="[
                'tag-pill inline-flex rounded-full p-[3px] border-[2px]',
                borderColor,
              ]"
            >
              <a
                :href="link.url"
                class="tag-pill-inner inline-flex items-center justify-center rounded-full px-6 py-3 font-medium"
                :class="[tagBgColor, tagTextColor]"
              >
                {{ link.text }}
              </a>
            </div>
          </div>

          <!-- Tools Section -->
          <h2 :class="`text-2xl font-semibold pb-6 ${textColor}`">
            {{ toolsTitle }}
          </h2>

          <ul :class="`list-disc pl-6 ${textColor}`">
            <li v-for="(tool, index) in tools" :key="index">{{ tool }}</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

defineProps({
  id: { type: String, default: "" },
  sectionTitle: String,
  imageSrc: String,
  imageAlt: String,
  mainTitle: String,
  mainDescription: String,

  links: { type: Array, default: () => [] },

  toolsTitle: String,
  tools: { type: Array, default: () => [] },

  bgColor: { type: String, default: "bg-[#DDDDDD]" },
  contentBgColor: { type: String, default: "bg-[#DDDDDD]" },
  textColor: { type: String, default: "text-[#161616]" },
  h2Color: { type: String, default: "text-[#161616]" },

  tagBgColor: { type: String, default: "bg-[#161616]" },
  tagTextColor: { type: String, default: "text-white" },
  borderColor: { type: String, default: "border-white" },

  imagePosition: { type: String, default: "" },
});

const sectionRef = ref(null);
const inView = ref(false);

let observer;

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry?.isIntersecting) {
        inView.value = true;
        observer?.disconnect(); // один раз
      }
    },
    {
      threshold: 0.25,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  if (sectionRef.value) observer.observe(sectionRef.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
});
</script>

<style scoped>
/* Внешняя оболочка таблетки */
.tag-pill {
  cursor: pointer;
  transition: transform 380ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 380ms cubic-bezier(0.22, 1, 0.36, 1);
}

/* База: скрыто (до скролла) */
.tag-pill-inner {
  opacity: 0;
  transform: translateY(10px);
  will-change: transform, box-shadow, opacity;
  transition: filter 380ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 380ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 380ms cubic-bezier(0.22, 1, 0.36, 1);
}

/* Запуск анимаций только когда секция в зоне видимости */
.pills-visible .tag-pill-inner {
  animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards,
    softPulse 4s ease-in-out infinite;
  animation-delay: calc(var(--i) * 90ms);
}

/* Hover эффекты только для устройств с мышкой */
@media (hover: hover) and (pointer: fine) {
  .tag-pill:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 18px rgba(255, 255, 255, 0.22);
  }

  .tag-pill:hover .tag-pill-inner {
    box-shadow: 0 0 18px rgba(255, 255, 255, 0.22);
    transform: translateY(0);
    filter: brightness(1.08);
  }
}

/* Фокус с клавиатуры */
.tag-pill:focus-within {
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.22);
}

/* Плавное появление */
@keyframes fadeUp {
  0% {
    opacity: 0;
    transform: translateY(12px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Мягкий пульс (белый glow) */
@keyframes softPulse {
  0% {
    box-shadow: 0 0 0 rgba(255, 255, 255, 0);
  }
  50% {
    box-shadow: 0 0 14px rgba(255, 255, 255, 0.14);
  }
  100% {
    box-shadow: 0 0 0 rgba(255, 255, 255, 0);
  }
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .tag-pill,
  .tag-pill-inner {
    transition: none !important;
    animation: none !important;
  }
  .tag-pill-inner {
    opacity: 1;
    transform: none;
  }
}
</style>
