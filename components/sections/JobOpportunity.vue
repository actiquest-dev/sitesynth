<template>
  <section class="bg-[#161616] border-t border-[#363636]">
    <div class="max-w-[1248px] mx-auto px-6 py-24">

      <!-- Title -->
      <h2 class="text-white text-4xl font-medium mb-16">
        Open positions
      </h2>

      <div class="space-y-8">

        <!-- JOB CARDS -->
        <a
          v-for="(job, index) in jobs"
          :key="index"
          :href="job.link"
          class="group block border border-[#363636] h-[140px]"
        >
          <div class="flex h-full">

            <!-- Left graphic -->
            <div class="w-[180px] border-r border-[#363636] flex items-center justify-center">
              <img
                :src="job.image"
                alt=""
                class="opacity-40"
              />
            </div>

            <!-- Content -->
            <div class="flex flex-col justify-center px-10">
              <h3 class="text-white text-lg font-semibold mb-1">
                {{ job.title }}
              </h3>
              <p class="text-[#9a9a9a] text-sm">
                {{ job.meta }}
              </p>
            </div>

          </div>
        </a>

        <!-- CTA BLOCK (same height!) -->
        <div class="border border-[#363636] h-[140px] bg-[#e6e6e6] flex items-center justify-between px-12">

          <div>
            <p class="text-[#161616] text-lg font-medium">
              Don’t see a role that’s right for you?
            </p>
            <p class="text-[#161616]">
              Apply anyways!
            </p>
          </div>

          <a
            href="/careers/apply"
            class="bg-black text-white px-8 py-3 text-sm font-medium hover:bg-[#333] transition"
          >
            Apply
          </a>

        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
const jobs = [
  {
    title: 'Full Stack Developer',
    meta: 'Full Time | Belgium',
    link: '/careers/full-stack',
    image: '/assets/jobs/job-mark.svg',
  },
  {
    title: 'UI/UX Designer',
    meta: 'Full Time | Remote',
    link: '/careers/ui-ux',
    image: '/assets/jobs/job-mark.svg',
  },
  {
    title: 'Marketing Manager',
    meta: 'Full Time | Spain',
    link: '/careers/marketing',
    image: '/assets/jobs/job-mark.svg',
  },
];
</script>

