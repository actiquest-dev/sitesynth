<template>
  <section :id="id || undefined" :class="backgroundColor">
    <div class="max-w-[1248px] mx-auto px-6">
      <div class="space-y-12">
        <div
          v-for="(job, index) in jobs"
          :key="index"
          :class="[job.bgColor || '']"
          class="job-box group relative border border-[#636363] flex cursor-pointer"
        >
          <a :href="job.link" class="flex w-full" rel="noopener noreferrer">
            <!-- Image Section (1/6 width) -->
            <div class="w-1/6 flex-shrink-0">
              <img
                :src="job.image"
                :alt="job.imageAlt || job.title"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- Content Section (4/6 width) -->
            <div class="w-4/6 p-6 flex flex-col justify-center">
              <!-- Title -->
              <component :is="job.titleTag || 'h3'" :class="job.titleClass">
                {{ job.title }}
              </component>

              <component
                :is="job.descriptionClass ? 'p' : 'div'"
                :class="job.descriptionClass"
              >
                {{ job.description }}
              </component>
            </div>

            <!-- Link Section (1/6 width) -->
            <div class="w-1/6 flex flex-col justify-center items-center">
              <span
                class="text-[#636363] flex items-center group-hover:text-white transition-colors duration-200"
              >
                <span class="mr-2 font-semibold">
                  {{ job.linkText }}
                </span>
                <i
                  class="fa fa-chevron-right group-hover:translate-x-1 transition-transform duration-200"
                ></i>
              </span>
            </div>
          </a>
        </div>
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
  backgroundColor: {
    type: String,
    default: "bg-[#161616]",
  },
  jobs: {
    type: Array,
    required: true,
  },
});
</script>
