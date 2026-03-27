<template>
  <section
    :id="id || undefined"
    class="bg-[#161616] border-t border-b border-[#333] py-20"
  >
    <div class="max-w-[1248px] mx-auto px-6">
      <!-- Заголовок секции -->
      <div class="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#555] mb-4">Our Team</p>
          <h2 class="text-white text-3xl sm:text-4xl font-bold">
            {{ title }}
          </h2>
        </div>
        <p class="text-[#666] text-sm leading-relaxed max-w-sm md:text-right">
          {{ subtitle }}
        </p>
      </div>

      <!-- Карточки лидеров -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <article
          v-for="(leader, index) in leaders"
          :key="index"
          class="group relative overflow-hidden bg-[#101010]"
        >
          <!-- Фото (сделали выше) -->
          <img
            :src="leader.image"
            :alt="leader.name"
            class="w-full h-[520px] object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.03]"
          />

          <!-- Слой затемнения + blur (под текстом, над фото) -->
          <div
            class="absolute inset-0 z-10 bg-black/0 backdrop-blur-[0px]
                   transition-all duration-300 ease-out
                   group-hover:bg-black/55 group-hover:backdrop-blur-[3px]"
          ></div>

          <!-- Статичный заголовок (не анимируем) -->
          <div class="absolute inset-x-0 bottom-0 z-30 p-6">
            <h3 class="text-white text-lg font-semibold">
              {{ leader.name }}
            </h3>
            <p class="text-[#d0d0d0] text-sm mt-1">
              {{ leader.role }}
            </p>
          </div>

          <!-- Описание, появляется при hover -->
          <div
            class="absolute inset-0 z-20 flex items-start
                   opacity-0 translate-y-3
                   transition-all duration-350 ease-[cubic-bezier(0.22,0.61,0.36,1)]
                   group-hover:opacity-100 group-hover:translate-y-0"
          >
            <div class="p-6 pt-8 pr-7 pb-24">
              <p class="text-[#f5f5f5] text-sm leading-relaxed">
                {{ leader.description }}
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  id: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "Our leaders",
  },
  subtitle: {
    type: String,
    default:
      "Four people. One team. Strategy, design, engineering, and growth — working without silos.",
  },
  // [{ name, role, image, description }]
  leaders: {
    type: Array,
    required: true,
  },
});
</script>
