<template>
  <HeaderSection />

  <!-- НОВЫЙ HERO -->
  <ContactHero
    glowEffect="GlowBlue"
    :content="[
      {
        tag: 'h1',
        text: 'Let’s build something<br> meaningful — together.',
        margin: 'mb-8',
        html: true,
      },
      {
        tag: 'p',
        text: 'Whether you\'re looking to launch a new product, align your brand, or join our team — we’d love to hear from you. Drop us a message and we’ll get back to you soon.',
        margin: 'mb-0',
      },
    ]"
  />

  <!-- ФОРМА + ТЕКСТ (оставляем как было) -->
 <TwoColumnsDesign
  sectionBgColor="bg-[#161616]"
  leftColumnBgColor="bg-[#161616]"
  rightColumnBgColor="bg-[#161616]"
>
  <!-- ПРАВАЯ КОЛОНКА: ФОРМА -->
  <template #right>
    <div class="py-24 bg-[#161616]">
      <div class="px-6 md:px-12">
        <form class="space-y-8" @submit="handleSubmit">
          <div class="mb-6">
            <h2 class="text-white text-3xl sm:text-4xl mb-3">
              Tell us how we can help
            </h2>
            <p class="text-[#999999] text-sm leading-relaxed max-w-[420px]">
              Share a few details about your project or question. We usually reply
              within 1–2 business days.
            </p>
          </div>

          <!-- УСПЕХ / ОШИБКА -->
          <div
            v-if="state.submitMessage"
            class="p-4 bg-green-600/15 border border-green-500/70 rounded-[10px] text-sm text-green-300"
          >
            {{ state.submitMessage }}
          </div>
          <div
            v-if="state.submitError"
            class="p-4 bg-red-600/15 border border-red-500/70 rounded-[10px] text-sm text-red-300"
          >
            {{ state.submitError }}
          </div>

          <!-- РЯД 1: Имя + Компания -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="block text-[#999999] text-sm mb-2" for="fullName">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                v-model="formData.fullName"
                required
                class="w-full bg-[#151515] border border-[#333333] rounded-[10px]
                       px-4 py-3.5 text-sm text-white/90 placeholder:text-[#666666]
                       focus:outline-none focus:ring-2 focus:ring-[#8CB0FF] focus:border-transparent
                       transition"
              />
            </div>

            <div>
              <label class="block text-[#999999] text-sm mb-2" for="company">
                Company (optional)
              </label>
              <input
                id="company"
                name="company"
                type="text"
                v-model="formData.company"
                class="w-full bg-[#151515] border border-[#333333] rounded-[10px]
                       px-4 py-3.5 text-sm text-white/90 placeholder:text-[#666666]
                       focus:outline-none focus:ring-2 focus:ring-[#8CB0FF] focus:border-transparent
                       transition"
              />
            </div>
          </div>

         <template #right>
  <div class="py-24 bg-[#161616]">
    <div class="px-6 md:px-12 w-full">

      <form class="space-y-8" @submit="handleSubmit">
        <!-- Title -->
        <div class="mb-6">
          <h2 class="text-white text-3xl sm:text-4xl mb-3">
            Tell us how we can help
          </h2>
          <p class="text-[#999999] text-sm leading-relaxed max-w-[520px]">
            Share a few details about your project or question.
            We usually reply within 1–2 business days.
          </p>
        </div>

        <!-- Row 1 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-[#999999] text-sm mb-2" for="fullName">Full Name</label>
            <input
              id="fullName"
              v-model="formData.fullName"
              required
              class="w-full bg-[#151515] border border-[#333] rounded-lg px-4 py-3 text-white"
            />
          </div>

          <div>
            <label class="block text-[#999999] text-sm mb-2" for="company">Company (optional)</label>
            <input
              id="company"
              v-model="formData.company"
              class="w-full bg-[#151515] border border-[#333] rounded-lg px-4 py-3 text-white"
            />
          </div>
        </div>

        <!-- Row 2 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-[#999999] text-sm mb-2" for="email">Email Address</label>
            <input
              id="email"
              type="email"
              v-model="formData.email"
              required
              class="w-full bg-[#151515] border border-[#333] rounded-lg px-4 py-3 text-white"
            />
          </div>

          <div>
            <label class="block text-[#999999] text-sm mb-2" for="phone">Phone number</label>
            <ClientOnly>
              <PhoneInput
                v-model="formData.phone"
                :input-options="{ placeholder: 'Enter phone' }"
              />
            </ClientOnly>
          </div>
        </div>

        <!-- Topic -->
        <div>
          <label class="block text-[#999999] text-sm mb-2" for="topic">Topic</label>
          <div class="relative">
            <select
              id="topic"
              v-model="formData.topic"
              required
              class="w-full bg-[#151515] border border-[#333] rounded-lg px-4 py-3 text-white appearance-none"
            >
              <option value="">Select a topic</option>
              <option value="project">Start a custom project</option>
              <option value="partnership">Explore a partnership</option>
              <option value="career">Career opportunity</option>
              <option value="other">Other</option>
            </select>

            <!-- Arrow -->
            <span class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#888]">
              ▼
            </span>
          </div>
        </div>

        <!-- Message -->
        <div>
          <label class="block text-[#999999] text-sm mb-2" for="message">Message</label>
          <textarea
            id="message"
            rows="5"
            v-model="formData.message"
            required
            class="w-full bg-[#151515] border border-[#333] rounded-lg px-4 py-3 text-white"
          ></textarea>
        </div>

        <!-- Checkbox -->
        <label class="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" v-model="formData.consent" required class="w-5 h-5 rounded-md accent-[#8CB0FF]">
          <span class="text-[#999999] text-sm">I agree to SiteSynth storing and processing my data.</span>
        </label>

        <!-- Button -->
        <button
          type="submit"
          :disabled="state.isSubmitting"
          class="px-6 py-2 border border-white rounded-full text-white hover:bg-white hover:text-black transition"
        >
          {{ state.isSubmitting ? "Sending..." : "Send Message" }}
        </button>
      </form>
    </div>
  </div>
</template>


  <!-- ЛЕВАЯ КОЛОНКА ОСТАЁТСЯ КАК БЫЛО -->
  <template #left>
    <!-- твой текущий текст "Talk to our team..." без изменений -->
    <div class="py-24 md:border-r border-[#636363] bg-[#161616]">
      <div class="max-w-[600px] mr-auto px-6 md:px-0 md:pl-16">
        <h2 class="text-white text-3xl sm:text-4xl mb-6">
          Talk to our team.
        </h2>
        <h3 class="text-white text-2xl mt-[3rem] mb-[3rem]">
          🧩 Start a custom project
        </h3>
        <p class="text-[#999999] text-normal font-light mb-4">
          Let’s discuss how SiteSynth can help your company design scalable
          systems, ship faster, and elevate user experience.
        </p>
        <h3 class="text-white text-2xl mt-[3rem] mb-[3rem]">
          🤝 Explore a partnership
        </h3>
        <p class="text-[#999999] text-normal font-light mb-[8rem]">
          Let’s discuss how SiteSynth can help your company design scalable
          systems, ship faster, and elevate user experience.
        </p>
        <p class="text-[#999999] text-normal font-light mb-4">
          We’re based in Belgium and work globally.
        </p>
        <p class="text-[#999999] text-normal font-light mb-4">
          Prefer email? Reach us at
          <a class="text-white" href="mailto:hello@sitesynth.com">
            hello@sitesynth.com
          </a>
        </p>
      </div>
    </div>
  </template>
</TwoColumnsDesign>



  <FooterSection />
</template>

<script setup>
const { formData, state, handleSubmit } = useContactForm();

// SEO Configuration for Contact page
const siteUrl = useRuntimeConfig().public?.siteUrl;
useSeoMeta({
  title: "Contact Us - SiteSynth | Let's build something meaningful",
  description:
    "Get in touch with SiteSynth to start a project, explore partnerships, or join our team. We’re based in Belgium and work globally.",
  keywords:
    "contact, sitesynth, get in touch, hire, partnership, careers, contact us",

  ogTitle: "Contact SiteSynth - Let's build something meaningful",
  ogDescription:
    "Get in touch with SiteSynth to start a project, explore partnerships, or join our team.",
  ogImage: `${siteUrl}/assets/shareimage.png`,
  ogImageAlt: "Contact SiteSynth",
  ogUrl: `${siteUrl}/contact-us`,

  twitterTitle: "Contact SiteSynth",
  twitterDescription:
    "Get in touch with SiteSynth to start a project, explore partnerships, or join our team.",
  twitterImage: `${siteUrl}/assets/twitter-card-home.jpg`,

  canonical: `${siteUrl}/contact-us`,
});

useHead({
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: "Contact SiteSynth",
        description:
          "Contact SiteSynth to start a project, explore partnerships, or join our team.",
        url: `${siteUrl}/contact-us`,
      }),
    },
  ],
});
</script>
