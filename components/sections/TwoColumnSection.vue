<template>
  <section
    :id="id || undefined"
    :class="['bg-[#161616] flex justify-center', sectionClass]"
  >
    <div class="max-w-[1248px] mx-auto px-6 w-full">
      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-8 relative border border-[#636363] group overflow-hidden"
      >
        <GlowEffect />

        <!-- Gradient Background -->
        <div
          class="absolute inset-0 pointer-events-none opacity-100"
          :style="{
            backgroundImage: 'url(/assets/gradients/gradient-for-banner-section.svg)',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }"
        ></div>

        <!-- Left Column -->
        <div
          :class="[
            'flex flex-col justify-center relative z-10',
            // ✅ mobile padding (fix)
            'px-8 py-10',
            // ✅ keep your existing prop padding for md+
            leftPadding,
          ].join(' ')"
        >
          <div class="flex items-center gap-4 mb-6">
            <img
              :src="leftContent.image.src"
              :alt="leftContent.image.alt"
              class="w-auto max-w-[80px] h-auto flex-shrink-0 -translate-y-2"
            />

            <component
              :is="leftContent.imageText.tag"
              :class="getTextClasses(leftContent.imageText.tag)"
            >
              {{ leftContent.imageText.content }}
            </component>
          </div>

          <div
            v-for="(textItem, index) in leftContent.textElements"
            :key="index"
            class="mb-4"
          >
            <component :is="textItem.tag" :class="getTextClasses(textItem.tag)">
              {{ textItem.content }}
            </component>
          </div>

          <a
            :href="leftContent.link.href"
            :target="leftContent.link.target"
            class="text-[#8CB0FF] mt-6 w-auto max-w-max py-2 font-semibold inline-flex items-center gap-2 group/link relative"
          >
            <span>{{ leftContent.link.text }}</span>

            <font-awesome
              :icon="['fas', 'chevron-right']"
              class="text-sm relative top-[1px] transition-transform duration-300 group-hover/link:translate-x-1"
              aria-hidden="true"
            />

            <div
              class="absolute bottom-0 left-0 h-[2px] bg-[#8CB0FF] w-0 group-hover/link:w-full transition-all duration-300"
            ></div>
          </a>
        </div>

        <!-- Right Column -->
        <div
          :class="[
            'flex flex-col justify-center items-center relative z-10',
            // ✅ mobile padding (fix)
            'px-8 pb-10',
            // ✅ keep your existing prop padding for md+
            rightPadding,
          ].join(' ')"
        >
          <img
            :src="rightContent.image.src"
            :alt="rightContent.image.alt"
            :class="rightContent.image.class || 'w-full h-auto max-w-[100%]'"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  id: { type: String, default: "" },

  sectionClass: { type: String, default: "pb-40" },

  leftContent: { type: Object, required: true },
  rightContent: { type: Object, required: true },

  leftPadding: { type: String, default: "" },
  rightPadding: { type: String, default: "" },
})

const getTextClasses = (tag) => {
  switch (tag) {
    case "h1":
      return "text-white text-4xl font-bold mb-4"
    case "h2":
      return "text-white text-3xl font-bold mb-3"
    case "h3":
      return "text-white text-2xl font-bold mb-3"
    case "h4":
      return "text-white text-xl font-semibold mb-2"
    case "h5":
      return "text-white text-lg font-semibold mb-2"
    case "h6":
      return "text-white text-base font-semibold mb-2"
    case "p":
      return "text-gray-300 leading-relaxed"
    default:
      return "text-gray-300"
  }
}
</script>
