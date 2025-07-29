<template>
    <section class="relative bg-[#161616] text-white group overflow-hidden">
        <GlowEffect />
        <div class="relative max-w-6xl mx-auto px-6 pt-[6rem] pb-[6rem]">
            <div class="text-center px-6">
                <img :src="imageSrc" :alt="imageAlt" class="mx-auto block w-20 pb-6" />
                <h2 class="text-4xl font-extrabold mb-10">{{ title }}</h2>
                <h3 class="text-2xl font-normal mb-10">{{ h3 }}</h3>
                <p class="text-base sm:text-lg font-normal">{{ description }}</p>
                <!-- Call-to-Action Buttons -->
                <div class="flex justify-center gap-4 mt-6">
                    <a :href="primaryLink"
                        class="px-6 py-2 border-[1px] border-white hover:bg-[#8D35FF] hover:text-white hover:border-[#8D35FF] bg-white text-[#161616] transition-colors duration-[1000ms]">
                        {{ primaryText }}
                    </a>
                    <a :href="secondaryLink"
                        class="px-6 py-2 border-[#161616] hover:bg-white hover:text-[#161616] hover:border-white bg-[#161616] text-white transition-colors duration-[1000ms]">
                        {{ secondaryText }}
                    </a>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>

defineProps({
    title: String,
    h3: String,
    description: String,
    imageSrc: String,
    imageAlt: String,
    primaryText: String,
    primaryLink: String,
    secondaryText: String,
    secondaryLink: String
});

</script>