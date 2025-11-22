<template>
  <section
    :id="id || undefined"
    class="bg-[#161616] border-t border-b border-[#636363] py-20"
  >
    <div class="max-w-[1248px] mx-auto px-6">
      <!-- Заголовок -->
      <div class="text-center max-w-3xl mx-auto mb-14">
        <h2 class="text-white text-3xl sm:text-4xl font-bold mb-4">
          {{ title }}
        </h2>
        <p class="text-[#bbbbbb] text-sm sm:text-base leading-relaxed">
          {{ subtitle }}
        </p>
      </div>

      <!-- Карточки -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <article
          v-for="(leader, index) in leaders"
          :key="index"
          class="group relative overflow-hidden rounded-xl bg-[#101010]"
        >
          <!-- Фото -->
          <img
            :src="leader.image"
            :alt="leader.name"
            class="h-[420px] w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.03]"
          />

          <!-- Градиент внизу для имени/роли (всегда) -->
          <div
            class="pointer-events-none absolute inset-x-0 bottom-0 h-40
                   bg-gradient-to-t from-black/80 via-black/40 to-transparent"
          ></div>

          <!-- Имя + роль (всегда видно) -->
          <div
            class="absolute inset-x-0 bottom-0 z-10 p-6"
          >
            <h3 class="text-white text-lg font-semibold">
              {{ leader.name }}
            </h3>
            <p class="text-[#d0d0d0] text-sm mt-1">
              {{ leader.role }}
            </p>
          </div>

          <!-- Оверлей с описанием (появляется при hover) -->
          <div
            class="absolute inset-0 z-20 flex flex-col justify-between
                   bg-gradient-to-t from-black/90 via-black/80 to-black/10
                   opacity-0 translate-y-2
                   transition-all duration-400 ease-[cubic-bezier(0.22,0.61,0.36,1)]
                   group-hover:opacity-100 group-hover:translate-y-0"
          >
            <div class="p-6 pt-7 pr-7">
              <p class="text-[#f5f5f5] text-sm leading-relaxed">
                {{ leader.description }}
              </p>
            </div>

            <!-- Имя + роль повторно внизу, как на референсе -->
            <div class="p-6 pt-4">
              <h3 class="text-white text-lg font-semibold">
                {{ leader.name }}
              </h3>
              <p class="text-[#d0d0d0] text-sm mt-1">
                {{ leader.role }}
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
    default: ""
  },
  title: {
    type: String,
    default: "Our leaders"
  },
  subtitle: {
    type: String,
    default:
      "Creatives, Developers, Designers — meet the team that specializes in turning dreams into digital masterpieces."
  },
  leaders: {
    type: Array,
    required: true
    // [{ name, role, image, description }]
  }
});
</script>
