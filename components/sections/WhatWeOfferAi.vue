<template>
  <section
    :id="id || undefined"
    class="relative bg-[#161616] text-white group overflow-hidden"
  >
    <GlowEffect />

    <div class="relative max-w-[1248px] mx-auto px-6">
      <!-- Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(card, index) in cards"
          :key="index"
          class="border border-[#636363] bg-[#ffffff14] p-6 py-12 flex flex-col justify-between cursor-pointer"
        >
          <h3 class="text-xl font-semibold text-center pt-6 pb-8">
            {{ card.icon }} {{ card.title }}
          </h3>
          <p class="text-center text-[#999999] mt-2">{{ card.description }}</p>
          <!-- <div class="text-center mt-4">
                        <a :href="card.link"
                            class="text-[#8CB0FF] font-semibold hover:text-[#A620FF] transition-colors duration-1000">Read
                            more
                            →</a>
                    </div> -->
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    default: "",
  },
  cards: Array,
});
</script>
