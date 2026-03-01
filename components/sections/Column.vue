<template>
  <section
    :id="id || undefined"
    :class="backgroundColor"
    :style="backgroundImageStyle"
  >
    <div class="max-w-[1248px] mx-auto px-6 py-12">
      <div :class="gridClasses">
        <div
          v-for="(column, index) in columns"
          :key="index"
          class="flex flex-col items-start p-6"
        >
          <!-- Icon/Image and Header Row -->
          <div class="flex items-center mb-4">
            <div class="mr-3">
              <img
                v-if="column.imageSrc"
                :src="column.imageSrc"
                :alt="column.imageAlt || ''"
                class="w-12 h-12 object-contain"
              />
              <span v-else-if="column.icon" class="text-4xl">
                {{ column.icon }}
              </span>
            </div>

            <!-- Dynamic Header -->
            <component
              :is="column.headerTag || 'h3'"
              :class="getHeaderClasses(column.headerTag || 'h3')"
            >
              {{ column.title }}
            </component>
          </div>

          <!-- Paragraph -->
          <p class="text-[#999999] leading-relaxed">
            {{ column.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  id: {
    type: String,
    default: "",
  },
  columns: {
    type: Array,
    required: true,
    // Structure:
    // [
    //   {
    //     icon?: String,           // Emoji or text icon
    //     imageSrc?: String,       // Image URL
    //     imageAlt?: String,       // Image alt text
    //     title: String,           // Header text
    //     headerTag?: String,      // h1, h2, h3, h4, h5, h6 (default: h3)
    //     description: String      // Paragraph text
    //   }
    // ]
  },
  columnCount: {
    type: Number,
    default: null, // Auto-detect from columns length
  },
  backgroundColor: {
    type: String,
    default: "bg-[#161616]",
  },
  headerTextColor: {
    type: String,
    default: "text-white",
  },
  backgroundImage: {
    type: String,
    default: null,
  },
});

// Compute grid classes based on column count
const gridClasses = computed(() => {
  const count = props.columnCount || props.columns.length;

  if (count === 2) {
    // 2 columns: centered with equal width, space on sides
    return "grid grid-cols-1 md:grid-cols-2 md:max-w-4xl md:mx-auto gap-8";
  } else if (count === 3) {
    // 3 columns: full width with equal distribution
    return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8";
  }

  // Default fallback
  return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8";
});

// Computed style for background image
const backgroundImageStyle = computed(() => {
  if (props.backgroundImage) {
    return {
      backgroundImage: `url(${props.backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
  }
  return {};
});

// Function to get appropriate CSS classes based on header tag
const getHeaderClasses = (tag) => {
  const baseClasses = `${props.headerTextColor} font-bold`;

  switch (tag) {
    case "h1":
      return `${baseClasses} text-4xl sm:text-5xl`;
    case "h2":
      return `${baseClasses} text-3xl sm:text-4xl`;
    case "h3":
      return `${baseClasses} text-2xl sm:text-3xl`;
    case "h4":
      return `${props.headerTextColor} font-semibold text-xl sm:text-2xl`;
    case "h5":
      return `${props.headerTextColor} font-semibold text-lg sm:text-xl`;
    case "h6":
      return `${props.headerTextColor} font-semibold text-base sm:text-lg`;
    default:
      return `${baseClasses} text-2xl sm:text-3xl`;
  }
};
</script>
