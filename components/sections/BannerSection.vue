<template>
    <section :class="`py-20 ${backgroundColor} ${textAlign}`">
        <h2 :class="`max-w-6xl mx-auto text-4xl ${textColor}`">{{ sectionTitle }}</h2>
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
    },
    textAlign: {
        type: String,
        default: 'text-center'
    }
});
</script>