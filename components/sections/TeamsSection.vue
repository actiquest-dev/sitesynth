<template>
  <section
    :id="id || undefined"
    :class="backgroundColor"
    :style="backgroundImageStyle"
  >
    <div class="max-w-[1248px] mx-auto px-6 py-12">
      <div :class="gridClasses">
        <div
          v-for="(member, index) in teamMembers"
          :key="index"
          class="flex flex-col items-center text-center p-6"
        >
          <div class="mb-6 relative">
            <div
              :class="`${ovalWidth} ${ovalHeight} rounded-full overflow-hidden`"
            >
              <img
                :src="member.imageSrc"
                :alt="member.imageAlt || member.name"
                :class="member.imageClass || 'w-full h-full object-cover'"
              />
            </div>
          </div>

          <!-- Name with Dynamic Tag and Classes -->
          <component
            :is="member.nameTag || 'h3'"
            :class="getNameClasses(member.nameTag || 'h3', member.nameClass)"
            class="mb-2"
          >
            {{ member.name }}
          </component>

          <!-- Position -->
          <p :class="positionTextColor + ' leading-relaxed'">
            {{ member.position }}
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
  teamMembers: {
    type: Array,
    required: true,
    // Structure:
    // [
    //   {
    //     imageSrc: String,       // Path to team member image
    //     imageAlt?: String,      // Alt text for image (optional, defaults to name)
    //     imageClass?: String,    // Custom classes for image (optional)
    //     name: String,           // Team member name
    //     nameTag?: String,       // HTML tag for name (h1, h2, h3, h4, h5, h6, p) - defaults to h3
    //     nameClass?: String,     // Custom classes for name (optional)
    //     position: String        // Team member position/title
    //   }
    // ]
  },
  columnCount: {
    type: Number,
    default: 3, // Always 3 for teams, but keeping it flexible
  },
  backgroundColor: {
    type: String,
    default: "bg-[#161616]",
  },
  nameTextColor: {
    type: String,
    default: "text-white",
  },
  positionTextColor: {
    type: String,
    default: "text-[#999999]",
  },
  backgroundImage: {
    type: String,
    default: null,
  },
  ovalWidth: {
    type: String,
    default: "w-[140px]", // 140px width
  },
  ovalHeight: {
    type: String,
    default: "h-[204px]", // 204px height
  },
});

// Compute grid classes based on column count
const gridClasses = computed(() => {
  const count = props.columnCount || 3;

  if (count === 2) {
    return "grid grid-cols-1 md:grid-cols-2 md:max-w-4xl md:mx-auto gap-8";
  } else if (count === 3) {
    return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8";
  } else if (count === 4) {
    return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8";
  }

  // Default fallback for 3 columns
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

// Function to get appropriate CSS classes for name based on tag and custom classes
const getNameClasses = (tag, customClass) => {
  const baseTextColor = props.nameTextColor;
  const customClasses = customClass || "";

  let defaultTagClasses = "";

  switch (tag) {
    case "h1":
      defaultTagClasses = "text-4xl font-extrabold";
      break;
    case "h2":
      defaultTagClasses = "text-3xl font-bold";
      break;
    case "h3":
      defaultTagClasses = "text-2xl font-bold";
      break;
    case "h4":
      defaultTagClasses = "text-xl font-semibold";
      break;
    case "h5":
      defaultTagClasses = "text-lg font-semibold";
      break;
    case "h6":
      defaultTagClasses = "text-base font-semibold";
      break;
    case "p":
      defaultTagClasses = "text-base font-medium";
      break;
    default:
      defaultTagClasses = "text-2xl font-bold";
  }

  return `${baseTextColor} ${defaultTagClasses} ${customClasses}`.trim();
};
</script>
