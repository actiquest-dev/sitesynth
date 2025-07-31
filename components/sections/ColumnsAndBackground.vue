<template>
    <section :id="id || undefined" class="bg-[#161616] bg-cover bg-center bg-no-repeat" :style="backgroundStyle">
        
        <div class="max-w-6xl mx-auto px-6 py-16">
            <!-- Title -->
            <div v-if="title" class="text-center mb-12">
                <h2 class="text-4xl font-bold text-white">{{ title }}</h2>
            </div>

            <!-- Two Columns -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Left Column -->
                <div class="flex flex-col space-y-8">
                    <div v-for="(element, index) in leftElements" :key="`left-${index}`" class="flex-1 bg-[#161616] border border-[#636363] p-8 flex flex-col">
                        <component :is="element.headerTag || 'h3'" class="text-white font-bold mb-3">
                            {{ element.title }}
                        </component>
                        <p class="text-[#999999] leading-relaxed flex-1">
                            {{ element.paragraph }}
                        </p>
                    </div>
                </div>

                <!-- Right Column -->
                <div class="flex flex-col space-y-8">
                    <div v-for="(element, index) in rightElements" :key="`right-${index}`" class="flex-1 bg-[#161616] border border-[#636363] p-8 flex flex-col">
                        <component :is="element.headerTag || 'h3'" class="text-white font-bold mb-3">
                            {{ element.title }}
                        </component>
                        <p class="text-[#999999] leading-relaxed flex-1">
                            {{ element.paragraph }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    id: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        default: ''
    },
    background: {
        type: String,
        default: ''
    },
    leftElements: {
        type: Array,
        default: () => []
    },
    rightElements: {
        type: Array,
        default: () => []
    }
})

// Computed background style
const backgroundStyle = computed(() => {
    if (props.background) {
        return {
            backgroundImage: `url(${props.background})`,
        }
    }
    return {
        backgroundColor: '#161616'
    }
})
</script>
