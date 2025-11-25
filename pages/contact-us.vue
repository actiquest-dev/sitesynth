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
  <!-- ЛЕВАЯ КОЛОНКА (текст) -->
  <template #left>
    <div class="py-24 md:border-r border-[#363636] bg-[#161616]">
      <div class="max-w-[560px] mr-auto px-6 md:px-0 md:pr-16">
        <h2 class="text-white text-3xl sm:text-4xl mb-6">
          Talk to our team.
        </h2>

        <h3 class="text-white text-2xl mt-10 mb-4 flex items-center gap-3">
          🧩 <span>Start a custom project</span>
        </h3>
        <p class="text-[#b3b3b3] text-base font-light mb-6">
          Let’s discuss how SiteSynth can help your company design scalable
          systems, ship faster, and elevate user experience.
        </p>

        <h3 class="text-white text-2xl mt-10 mb-4 flex items-center gap-3">
          🤝 <span>Explore a partnership</span>
        </h3>
        <p class="text-[#b3b3b3] text-base font-light mb-10">
          We’re open to long-term collaborations with agencies, product teams,
          and technology partners.
        </p>

        <p class="text-[#999999] text-sm mb-2">
          We’re based in Belgium and work globally.
        </p>
        <p class="text-[#999999] text-sm">
          Prefer email? Reach us at
          <a class="text-white underline underline-offset-2" href="mailto:hello@sitesynth.com">
            hello@sitesynth.com
          </a>
        </p>
      </div>
    </div>
  </template>

  <!-- ПРАВАЯ КОЛОНКА (ФОРМА) -->
  <template #right>
    <div class="py-24 bg-[#161616]">
      <div class="max-w-[560px] ml-auto px-6 md:px-0 md:pl-16">
        <form class="space-y-8" @submit="handleSubmit">
          <h2 class="text-white text-3xl sm:text-4xl mb-2">
            Tell us how we can help
          </h2>
          <p class="text-[#aaaaaa] text-sm mb-4">
            Share a few details about your project or question. We usually reply within 1–2 business days.
          </p>

          <!-- Success/Error Messages -->
          <div
            v-if="state.submitMessage"
            class="p-4 bg-green-600/15 border border-green-500/60 rounded-lg text-sm text-green-300"
          >
            {{ state.submitMessage }}
          </div>
          <div
            v-if="state.submitError"
            class="p-4 bg-red-600/15 border border-red-500/70 rounded-lg text-sm text-red-300"
          >
            {{ state.submitError }}
          </div>

          <!-- Имя + Компания -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[#b3b3b3] mb-2 text-sm" for="fullName">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                v-model="formData.fullName"
                required
                class="w-full bg-[#202020] border border-[#333] rounded-lg px-4 py-3 text-sm text-white
                       focus:outline-none focus:ring-2 focus:ring-[#8CB0FF] focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-[#b3b3b3] mb-2 text-sm" for="company">
                Company (optional)
              </label>
              <input
                id="company"
                name="company"
                type="text"
                v-model="formData.company"
                class="w-full bg-[#202020] border border-[#333] rounded-lg px-4 py-3 text-sm text-white
                       focus:outline-none focus:ring-2 focus:ring-[#8CB0FF] focus:border-transparent"
              />
            </div>
          </div>

          <!-- Email + Phone -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[#b3b3b3] mb-2 text-sm" for="email">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                v-model="formData.email"
                required
                class="w-full bg-[#202020] border border-[#333] rounded-lg px-4 py-3 text-sm text-white
                       focus:outline-none focus:ring-2 focus:ring-[#8CB0FF] focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-[#b3b3b3] mb-2 text-sm" for="phone">
                Phone number
              </label>
              <ClientOnly>
                <PhoneInput
                  v-model="formData.phone"
                  :input-options="{
                    placeholder: 'Enter phone',
                    id: 'phone',
                    name: 'phone',
                  }"
                  :dropdown-options="{
                    showDialCodeInSelection: true,
                    showFlags: true,
                    showSearchBox: true,
                  }"
                  class="w-full"
                />
                <template #fallback>
                  <input
                    type="tel"
                    placeholder="Enter phone"
                    v-model="formData.phone"
                    class="w-full bg-[#202020] border border-[#333] rounded-lg px-4 py-3 text-sm text-white
                           focus:outline-none focus:ring-2 focus:ring-[#8CB0FF] focus:border-transparent"
                  />
                </template>
              </ClientOnly>
            </div>
          </div>

          <!-- Topic -->
          <div>
            <label class="block text-[#b3b3b3] mb-2 text-sm" for="topic">
              Topic
            </label>
            <div class="relative">
              <select
                id="topic"
                name="topic"
                v-model="formData.topic"
                required
                class="w-full bg-[#202020] border border-[#333] rounded-lg px-4 py-3 pr-10 text-sm text-white
                       focus:outline-none focus:ring-2 focus:ring-[#8CB0FF] focus:border-transparent
                       appearance-none"
              >
                <option value="">Select a topic</option>
                <option value="project">Start a custom project</option>
                <option value="partnership">Explore a partnership</option>
                <option value="career">Career opportunity</option>
                <option value="other">Other</option>
              </select>
              <!-- Кастомная стрелка -->
              <span
                class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#888]"
              >
                ▼
              </span>
            </div>
          </div>

          <!-- Message -->
          <div>
            <label class="block text-[#b3b3b3] mb-2 text-sm" for="message">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="4"
              v-model="formData.message"
              required
              class="w-full bg-[#202020] border border-[#333] rounded-lg px-4 py-3 text-sm text-white
                     focus:outline-none focus:ring-2 focus:ring-[#8CB0FF] focus:border-transparent resize-y"
            ></textarea>
          </div>

          <!-- Consent + Button -->
          <div>
            <div class="mb-6 flex items-start gap-3">
              <input
                id="consent"
                name="consent"
                type="checkbox"
                v-model="formData.consent"
                required
                class="mt-[2px] accent-[#8CB0FF] w-4 h-4
                       focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[#8CB0FF]"
              />
              <label for="consent" class="text-[#9b9b9b] text-xs leading-relaxed">
                I agree to SiteSynth storing and processing my data.
              </label>
            </div>

            <button
              type="submit"
              :disabled="state.isSubmitting"
              class="inline-flex items-center justify-center px-6 py-2.5
                     border border-white bg-[#161616] text-white text-sm font-semibold
                     hover:bg-white hover:text-[#161616] hover:border-white
                     transition-colors duration-[900ms]
                     disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ state.isSubmitting ? "Sending..." : "Send Message" }}
            </button>
          </div>
        </form>
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
