<template>
    <section class="text-center py-20 bg-[#161616]">
        <h2 class="text-4xl text-white">{{ sectionTitle }}</h2>
    </section>
</template>

<script setup>
defineProps({
    sectionTitle: String,
});
</script>