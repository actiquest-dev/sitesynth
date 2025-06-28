<template>
  <section :class="`group relative overflow-hidden border-t border-b border-[#636363] services ${sectionBgColor}`">
    

    <!-- Content -->
    <div class="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 relative z-10">
      <GlowEffect />
      <!-- Left Column -->
      <div :class="`py-24 md:pr-6 md:border-r border-[#636363] ${leftColumnBgColor}`">
        <!-- Use slot if provided, otherwise fallback to prop -->
        <slot name="left">
          <h2 :class="`leading-snug text-4xl font-bold ${textColorLeft}`">{{ leftTitle }}</h2>
        </slot>
      </div>

      <!-- Right Column -->
      <div :class="`py-24 md:pl-6 ${rightColumnBgColor}`">
        <!-- Use slot if provided, otherwise fallback to prop -->
        <slot name="right">
          <p :class="`leading-relaxed text-1xl font-bold ${textColorRight}`">{{ rightParagraph }}</p>
        </slot>
      </div>
    </div>
    
  </section>
</template>

<script setup>
defineProps({
  // Legacy props for backwards compatibility
  leftTitle: String,
  rightParagraph: String,
  
  // New styling props
  sectionBgColor: {
    type: String,
    default: 'bg-[#161616]'
  },
  leftColumnBgColor: {
    type: String,
    default: ''
  },
  rightColumnBgColor: {
    type: String,
    default: ''
  },
  textColorLeft: {
    type: String,
    default: 'text-white'
  },
  textColorRight: {
    type: String,
    default: 'text-white'
  }
})
</script>
