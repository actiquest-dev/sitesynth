<template>
    <section :class="`text-center py-20 ${backgroundColor}`">
        <h2 :class="`text-4xl ${textColor}`">{{ sectionTitle }}</h2>
    </section>
</template>

<script setup>
defineProps({
    sectionTitle: String,
    backgroundColor: {
        type: String,
        default: 'bg-[#161616]'
    },
    textColor: {
        type: String,
        default: 'text-white'
    }
});
</script>