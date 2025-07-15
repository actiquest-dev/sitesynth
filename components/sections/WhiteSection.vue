<template>
    <section :class="`${bgColor} flex justify-center bg-cover bg-center bg-no-repeat`" :style="backgroundImageStyle">
        <div class="relative overflow-hidden z-0 testimonial-card max-w-6xl mx-auto text-center px-6 group">
            <div :class="`${bgInside} border border-[#636363] py-20 px-20 relative overflow-hidden`">
                <component :is="selectedGlowEffect" />

                <!-- Text Content -->
                <div class="flex flex-col items-center relative z-10">
                    <h2 :class="`${textColor} text-4xl font-bold`">{{ title }}</h2>
                    <p :class="`${textColor} my-6`">{{ description }}</p>

                    <!-- Call-to-Action Buttons -->
                    <div class="flex justify-center gap-4 mt-6">
                        <a :href="primaryLink"
                            class="px-6 py-2 bg-black text-white font-semibold hover:bg-gray-800 transition-colors duration-500">
                            {{ primaryText }}
                        </a>
                        <a :href="secondaryLink"
                            class="px-6 py-2 bg-white text-black font-semibold hover:bg-gray-200 transition-colors duration-500">
                            {{ secondaryText }}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>

import { defineAsyncComponent, computed } from 'vue'

const props = defineProps({
    title: String,
    description: String,
    primaryText: String,
    primaryLink: String,
    secondaryText: String,
    secondaryLink: String,
    bgColor: {
        type: String,
        default: 'bg-[#161616]'
    },
    bgInside: {
        type: String,
        default: 'bg-[#DDDDDD]'
    },
    textColor: {
        type: String,
        default: 'text-[#161616]'
    },
    glowEffect: {
        type: String,
        default: 'GlowEffect'
    },
    bgImage: {
        type: String,
        default: null
    }
});

// Dynamically load the glow component by name from the effects folder
const selectedGlowEffect = computed(() =>
    defineAsyncComponent(() =>
        import(`@/components/effects/${props.glowEffect}.vue`)
    )
)

// Computed background image style
const backgroundImageStyle = computed(() => {
    if (props.bgImage) {
        return {
            backgroundImage: `url(${props.bgImage})`
        }
    }
    return {}
})

</script>

