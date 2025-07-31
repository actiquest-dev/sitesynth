<template>
    <section :id="id || undefined" :class="`${bgColor} flex justify-center bg-cover bg-center bg-no-repeat`" :style="backgroundImageStyle">
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
                            :class="`px-6 py-2 border-[1px] border-white hover:bg-[${hover}] hover:text-white hover:border-[${hover}] bg-white text-[#161616] transition-colors duration-[1000ms] font-semibold`">
                            {{ primaryText }}
                        </a>
                        <a :href="secondaryLink"
                            :class="`px-6 py-2 border-1 border-white hover:bg-white hover:text-[#161616] hover:border-white bg-[#161616] text-white transition-colors duration-[1000ms] font-semibold`">
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
    id: {
        type: String,
        default: ''
    },
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
    },
    hover: {
        type: String,
        default: '#8D35FF'
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

