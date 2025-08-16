<template>
  <!-- Content Section -->
  <section
    :id="id || undefined"
    :class="`group relative overflow-hidden border-t border-b border-[#636363] ${contentBgColor}`"
  >
    <GlowEffect />
    <div class="max-w-[1248px] px-6 mx-auto grid grid-cols-1 md:grid-cols-2">
      <!-- Left Column -->
      <div class="md:border-r border-[#636363] py-12 md:pr-6">
        <h2 :class="`text-2xl font-semibold pb-6 ${textColor}`">
          {{ leftTitle }}
        </h2>
        <p :class="`leading-relaxed ${textColor}`">
          {{ leftDescription }}
        </p>

        <!-- Tags -->
        <div v-if="tags?.length" class="flex flex-wrap gap-4 py-10">
          <a
            v-for="(tag, index) in tags"
            :key="index"
            href="#"
            :class="`${tagBgColor} ${tagTextColor} ${borderColor} border px-6 py-3 rounded-[49px] inline-block`"
          >
            {{ tag }}
          </a>
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
      </div>

      <!-- Right Column Image -->
      <div :class="`${paddingImage} relative`">
        <img :src="imageSrc" alt="Section image" :class="`${imagePosition}`" />
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  id: {
    type: String,
    default: "",
  },
  title: String,
  bgColor: {
    type: String,
    default: "bg-[#DDDDDD]",
  },
  contentBgColor: {
    type: String,
    default: "bg-[#DDDDDD]",
  },
  textColor: {
    type: String,
    default: "text-[#161616]",
  },
  h2Color: {
    type: String,
    default: "text-[#161616]",
  },
  tagBgColor: {
    type: String,
    default: "bg-[#161616]",
  },
  tagTextColor: {
    type: String,
    default: "text-white",
  },
  borderColor: {
    type: String,
    default: "border-white",
  },
  paddingImage: {
    type: String,
    default: "",
  },
  imagePosition: {
    type: String,
    default: "",
  },
  leftTitle: String,
  leftDescription: String,
  tags: Array,
  toolsTitle: String,
  toolsList: Array,
  imageSrc: String,
});
</script>
