<template>
    <section class="bg-[#161616] flex justify-center">
        <div class="relative overflow-hidden z-0 testimonial-card max-w-6xl mx-auto text-center px-6 group">
            <div class="bg-[#DDDDDD] border border-[#636363] py-20 px-20 relative overflow-hidden">
                <GlowEffect />

                <!-- Text Content -->
                <div class="flex flex-col items-center relative z-10">
                    <h2 class="text-4xl font-bold text-black">{{ title }}</h2>
                    <p class="text-gray-700 my-6">{{ description }}</p>

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

defineProps({
    title: String,
    description: String,
    primaryText: String,
    primaryLink: String,
    secondaryText: String,
    secondaryLink: String
});

</script>
