<template>
  <section :id="id || undefined" class="bg-[#161616] flex justify-center">
    <div class="w-full">
      <div
        ref="card"
        class="grid grid-cols-1 md:grid-cols-2 gap-8 relative border border-[#636363] group overflow-hidden"
      >
        <GlowEffect />
        
        <!-- Gradient Background -->
        <div 
          class="absolute inset-0 pointer-events-none"
          :style="{
            backgroundImage: 'url(/assets/gradients/gradient-for-banner-section.svg)',
            backgroundPosition: 'bottom left',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '50% 50%',
          }"
        ></div>
        
        <!-- Left Column (1/2) -->
        <div :class="`flex flex-col justify-center ${leftPadding} relative z-10`">
          <!-- Image and Text Row -->
          <div class="flex items-center gap-4 mb-6">
            <img
              :src="leftContent.image.src"
              :alt="leftContent.image.alt"
              class="w-auto max-w-[80px] h-auto"
            />
            <div>
              <component
                :is="leftContent.imageText.tag"
                :class="getTextClasses(leftContent.imageText.tag)"
              >
                {{ leftContent.imageText.content }}
              </component>
            </div>
          </div>
          
          <!-- Dynamic Text Elements -->
          <div
            v-for="(textItem, index) in leftContent.textElements"
            :key="index"
            class="mb-4"
          >
            <component :is="textItem.tag" :class="getTextClasses(textItem.tag)">
              {{ textItem.content }}
            </component>
          </div>
          
          <!-- Link -->
          <a
            :href="leftContent.link.href"
            :target="leftContent.link.target"
            class="text-[#8CB0FF] mt-6 w-auto max-w-max py-2 font-semibold inline-block"
          >
            <span>{{ leftContent.link.text }}</span>
            <i
              class="fa-solid fa-chevron-right relative top-[2px]"
              aria-hidden="true"
            ></i>
          </a>
        </div>
        
        <!-- Right Column (1/2) -->
        <div
          :class="`flex flex-col justify-center items-center ${rightPadding} relative z-10`"
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
  id: {
    type: String,
    default: "",
  },
  leftContent: {
    type: Object,
    required: true,
  },
  rightContent: {
    type: Object,
    required: true,
  },
  leftPadding: {
    type: String,
    default: "",
  },
  rightPadding: {
    type: String,
    default: "",
  },
});

const getTextClasses = (tag) => {
  const baseClasses = "text-white";
  switch (tag) {
    case "h1":
      return `${baseClasses} text-4xl font-bold mb-4`;
    case "h2":
      return `${baseClasses} text-3xl font-bold mb-3`;
    case "h3":
      return `${baseClasses} text-2xl font-bold mb-3`;
    case "h4":
      return `${baseClasses} text-xl font-semibold mb-2`;
    case "h5":
      return `${baseClasses} text-lg font-semibold mb-2`;
    case "h6":
      return `${baseClasses} text-base font-semibold mb-2`;
    case "p":
      return `${baseClasses} text-gray-300 leading-relaxed`;
    default:
      return `${baseClasses} text-gray-300`;
  }
};
</script>
