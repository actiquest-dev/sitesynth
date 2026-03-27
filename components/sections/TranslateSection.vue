<template>
  <section
    ref="sectionRef"
    :id="id || undefined"
    :class="`${bgColor} group relative overflow-hidden`"
  >
    <GlowEffect />

    <div :class="`border-t border-b border-[#333] ${contentBgColor}`">
      <!-- FULL WIDTH GRID -->
      <div class="mx-auto grid grid-cols-1 md:grid-cols-2 relative z-10">
        <!-- Left Column (Image or slot) -->
        <div class="md:border-r border-[#333] overflow-hidden">
          <slot name="image">
            <img
              :src="imageSrc"
              :alt="imageAlt"
              class="w-full h-full block object-cover"
              :class="imagePosition"
            />
          </slot>
        </div>

        <!-- Right Column (Content) -->
        <div class="py-12 md:py-24">
          <div class="max-w-[600px] mr-auto px-6 md:px-0 md:pl-16">
            <h2 :class="`text-2xl font-semibold pb-4 ${textColor}`">
              {{ mainTitle }}
            </h2>

            <p :class="`leading-relaxed ${textColor}`">
              {{ mainDescription }}
            </p>

            <!-- Dynamic Links (Pills with animation on scroll) -->
            <div
              class="flex flex-wrap gap-[10px] py-6"
              :class="{ 'pills-visible': inView }"
            >
              <div
                v-for="(link, index) in links"
                :key="index"
                :style="{ '--i': index }"
                class="tag-pill"
              >
                <div class="pill-body">{{ link.text }}</div>
              </div>
            </div>

            <!-- Tools Section -->
            <hr class="border-t border-current opacity-10 mb-6" />
            <p :class="`text-xs font-semibold uppercase tracking-[0.14em] pb-4 opacity-50 ${textColor}`">
              {{ toolsTitle }}
            </p>

            <ul :class="`space-y-3 ${textColor}`">
              <li v-for="(tool, index) in tools" :key="index" class="flex items-center gap-3">
                <img
                  v-if="tool.logo"
                  :src="tool.logo"
                  :alt="tool.text"
                  class="w-5 h-5 rounded shrink-0"
                />
                <span v-else class="opacity-40 shrink-0 text-sm">–</span>
                <span class="text-sm leading-snug">{{ tool.text ?? tool }}</span>
              </li>
            </ul>
          </div>
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

  imagePosition: { type: String, default: "object-center" },
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
  opacity: 0;
}

.pills-visible .tag-pill {
  animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: calc(var(--i) * 70ms);
}

.pill-body {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  border-radius: 9999px;
  border: 1px solid #444444;
  background: transparent;
  padding: 0 16px;
  font-size: 0.75rem;
  line-height: 1;
  font-weight: 500;
  letter-spacing: 0.025em;
  color: #888888;
  white-space: nowrap;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.tag-pill:hover .pill-body {
  color: #aaaaaa;
  border-color: #666666;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .tag-pill { animation: none; opacity: 1; }
}
</style>


