<template>
  <section
    ref="sectionRef"
    :id="id || undefined"
    :class="`group relative overflow-hidden border-t border-b border-[#636363] ${contentBgColor}`"
  >
    <GlowEffect />

    <!-- как было: max-w + px-6 -->
    <div class="relative z-10 max-w-[1248px] px-6 mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2">
        <!-- Left Column -->
        <div class="pt-12 pb-0 md:py-12 md:pr-6 md:border-r border-[#636363]">
          <h2 :class="`text-2xl font-semibold pb-6 ${textColor}`">
            {{ leftTitle }}
          </h2>

          <p :class="`leading-relaxed ${textColor}`">
            {{ leftDescription }}
          </p>

          <!-- Tags (animated on scroll into view) -->
          <div
            v-if="tags?.length"
            class="flex flex-wrap gap-4 py-10"
            :class="{ 'pills-visible': inView }"
          >
            <div
              v-for="(tag, index) in tags"
              :key="index"
              :style="{ '--i': index }"
              :class="[
                'tag-pill inline-flex rounded-full p-[3px] border-[2px]',
                borderColor,
              ]"
            >
              <a
                href="#"
                class="tag-pill-inner inline-flex items-center justify-center rounded-full px-6 py-3 font-medium"
                :class="[tagBgColor, tagTextColor]"
                @click.prevent
              >
                {{ tag }}
              </a>
            </div>
          </div>

          <!-- Tools -->
          <h2 :class="`text-2xl font-semibold pb-6 ${textColor}`">
            {{ toolsTitle }}
          </h2>

          <ul class="list-disc pl-6" :class="textColor">
            <li class="pb-2" v-for="(tool, index) in toolsList" :key="index">
              {{ tool }}
            </li>
          </ul>

          <!-- Mobile image: ближе к тексту + в край + без пустоты снизу -->
          <div class="mt-6 md:hidden -mx-6">
            <img
              :src="imageSrc"
              alt="Section image"
              class="w-full h-auto block object-cover"
            />
          </div>
        </div>

       <!-- Right Column (Image) -->
      <!-- без padding: картинка в край и на мобилке и на десктопе -->
      <div class="relative border-t border-[#636363] md:border-t-0">
        <img
          :src="imageSrc"
          alt="Section image"
          class="w-full h-full block object-cover"
          :class="imagePosition"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

defineProps({
  id: { type: String, default: "" },

  contentBgColor: { type: String, default: "bg-[#DDDDDD]" },
  textColor: { type: String, default: "text-[#161616]" },

  tagBgColor: { type: String, default: "bg-[#161616]" },
  tagTextColor: { type: String, default: "text-white" },
  borderColor: { type: String, default: "border-white" },

  // object-position классы: object-center / object-right / object-right-bottom etc.
  imagePosition: { type: String, default: "object-center" },

  leftTitle: String,
  leftDescription: String,

  tags: { type: Array, default: () => [] },

  toolsTitle: String,
  toolsList: { type: Array, default: () => [] },

  imageSrc: String,
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
        observer?.disconnect();
      }
    },
    { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
  );

  if (sectionRef.value) observer.observe(sectionRef.value);
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<style scoped>
.tag-pill {
  cursor: pointer;
  transition: transform 380ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 380ms cubic-bezier(0.22, 1, 0.36, 1);
}

.tag-pill {
  border-color: #ffffff !important;
}
@media (hover: hover) and (pointer: fine) {
  .tag-pill:hover {
    border-color: #ffffff !important;
  }
}

.tag-pill-inner {
  opacity: 0;
  transform: translateY(10px);
  will-change: transform, box-shadow, opacity;
  transition: filter 380ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 380ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 380ms cubic-bezier(0.22, 1, 0.36, 1);
}

.pills-visible .tag-pill-inner {
  animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards,
    softPulse 4s ease-in-out infinite;
  animation-delay: calc(var(--i) * 90ms);
}

@media (hover: hover) and (pointer: fine) {
  .tag-pill:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 18px rgba(255, 255, 255, 0.22);
  }

  .tag-pill:hover .tag-pill-inner {
    box-shadow: 0 0 18px rgba(255, 255, 255, 0.22);
    transform: translateY(0);
    filter: brightness(1.06);
  }
}

.tag-pill:focus-within {
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.22);
}

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



