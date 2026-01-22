<template>
  <HeaderSection />

  <!-- HERO -->
  <ContactHero glowEffect="GlowBlue" :content="heroContent" />

  <!-- TWO COLUMNS -->
  <TwoColumnsDesign
    sectionBgColor="bg-[#161616]"
    leftColumnBgColor="bg-[#161616]"
    rightColumnBgColor="bg-[#161616]"
  >
    <!-- LEFT -->
    <template #left>
      <div
        class="relative overflow-hidden py-24 md:border-r border-[#636363] bg-[#161616]"
      >
        <!-- gradient только в нижнем правом углу левой колонки -->
        <div
          class="absolute pointer-events-none z-[1] opacity-100"
          style="
            right: -40px;
            bottom: -60px;
            width: 560px;
            height: 560px;
            background-image: url('/assets/gradients/gradient_right_corner.svg');
            background-repeat: no-repeat;
            background-position: bottom right;
            background-size: contain;
          "
        ></div>

        <!-- content -->
        <div class="relative z-[2] max-w-[600px] ml-auto pr-12">
          <h2 class="text-white text-3xl sm:text-4xl mb-10 font-bold">
            Talk to our team.
          </h2>

          <!-- 2 cards (как ConsultancySection) -->
          <div class="space-y-10">
            <InfoCard
              title="Start a custom project"
              description="Tell us what you’re building and where it’s stuck. We’ll propose a clear plan, scope, and next steps — from strategy to design to build."
            >
              <template #icon>
                <img
                  src="/assets/icons/box.svg"
                  alt=""
                  class="w-9 h-9"
                  loading="lazy"
                />
              </template>
            </InfoCard>

            <InfoCard
              title="Explore a partnership"
              description="Need a long-term team to ship with you? We plug into your workflow, take ownership of specific areas, and deliver consistently — without handoff pain."
            >
              <template #icon>
                <img
                  src="/assets/icons/messages.svg"
                  alt=""
                  class="w-9 h-9"
                  loading="lazy"
                />
              </template>
            </InfoCard>
          </div>

          <div class="mt-14">
            <p class="text-[#999999] text-sm leading-relaxed mb-2">
              We're based in Belgium and work globally.
            </p>
            <p class="text-[#999999] text-sm leading-relaxed">
              Prefer email? Reach us at
              <a
                class="text-[#8CB0FF] hover:text-white transition"
                href="mailto:hello@sitesynth.com"
              >
                hello@sitesynth.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </template>

    <!-- RIGHT -->
    <template #right>
      <!-- relative + overlay mask to kill glow on the right column -->
      <div class="relative py-24 bg-[#161616] flex items-center justify-center">
        <!-- glow mask -->
        <div class="absolute inset-0 bg-[#161616] z-0 pointer-events-none"></div>

        <div class="relative z-10 max-w-[600px] w-full px-6">
          <form class="space-y-6" @submit.prevent="handleSubmit">
            <!-- Header -->
            <div class="mb-8">
              <h2 class="text-white text-3xl font-bold mb-2">
                Tell us how we can help
              </h2>
              <p class="text-[#999999] text-sm leading-relaxed">
                Share a few details about your project or question. We usually
                reply within 1–2 business days.
              </p>
            </div>

            <!-- Success / Error -->
            <div
              v-if="state.submitMessage"
              class="p-4 bg-green-600/15 border border-green-500/50 rounded-0 text-sm text-green-300"
            >
              ✓ {{ state.submitMessage }}
            </div>
            <div
              v-if="state.submitError"
              class="p-4 bg-red-600/15 border border-red-500/50 rounded-0 text-sm text-red-300"
            >
              ✕ {{ state.submitError }}
            </div>

            <!-- Row 1 -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  class="block text-[#999999] text-xs uppercase tracking-wide mb-2 font-medium"
                  for="fullName"
                >
                  Full Name *
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  v-model="formData.fullName"
                  placeholder="John Doe"
                  required
                  class="w-full bg-[#1a1a1a] border border-[#333] rounded-0 px-4 py-3 text-sm text-white placeholder:text-[#555] focus:outline-none focus:ring-1 focus:ring-[#8CB0FF] focus:border-[#8CB0FF] transition duration-200 hover:border-[#444]"
                />
              </div>

              <div>
                <label
                  class="block text-[#999999] text-xs uppercase tracking-wide mb-2 font-medium"
                  for="company"
                >
                  Company
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  v-model="formData.company"
                  placeholder="Your company"
                  class="w-full bg-[#1a1a1a] border border-[#333] rounded-0 px-4 py-3 text-sm text-white placeholder:text-[#555] focus:outline-none focus:ring-1 focus:ring-[#8CB0FF] focus:border-[#8CB0FF] transition duration-200 hover:border-[#444]"
                />
              </div>
            </div>

            <!-- Row 2 -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  class="block text-[#999999] text-xs uppercase tracking-wide mb-2 font-medium"
                  for="email"
                >
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  v-model="formData.email"
                  placeholder="hello@example.com"
                  required
                  class="w-full bg-[#1a1a1a] border border-[#333] rounded-0 px-4 py-3 text-sm text-white placeholder:text-[#555] focus:outline-none focus:ring-1 focus:ring-[#8CB0FF] focus:border-[#8CB0FF] transition duration-200 hover:border-[#444]"
                />
              </div>

              <div>
                <label
                  class="block text-[#999999] text-xs uppercase tracking-wide mb-2 font-medium"
                  for="phone"
                >
                  Phone
                </label>
                <ClientOnly>
                  <PhoneInput
                    v-model="formData.phone"
                    :input-options="{
                      placeholder: '04 23 456 789',
                      id: 'phone',
                      name: 'phone',
                      class:
                        'w-full bg-[#1a1a1a] border border-[#333] rounded-0 px-4 py-3 text-sm text-white placeholder:text-[#555] focus:outline-none focus:ring-1 focus:ring-[#8CB0FF] focus:border-[#8CB0FF] transition duration-200 hover:border-[#444]',
                    }"
                    :dropdown-options="{
                      showDialCodeInSelection: true,
                      showFlags: true,
                      showSearchBox: true,
                    }"
                  />
                  <template #fallback>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="04 12 345 678"
                      v-model="formData.phone"
                      class="w-full bg-[#1a1a1a] border border-[#333] rounded-0 px-4 py-3 text-sm text-white placeholder:text-[#555] focus:outline-none focus:ring-1 focus:ring-[#8CB0FF] focus:border-[#8CB0FF] transition duration-200 hover:border-[#444]"
                    />
                  </template>
                </ClientOnly>
              </div>
            </div>

            <!-- Topic -->
            <div>
              <label
                class="block text-[#999999] text-xs uppercase tracking-wide mb-2 font-medium"
                for="topic"
              >
                Topic *
              </label>

              <div class="relative group">
                <select
                  id="topic"
                  name="topic"
                  v-model="formData.topic"
                  required
                  class="w-full bg-[#1a1a1a] border border-[#333] rounded-0 px-4 py-3 pr-10 text-sm text-white appearance-none focus:outline-none focus:ring-1 focus:ring-[#8CB0FF] focus:border-[#8CB0FF] transition duration-200 hover:border-[#444] cursor-pointer"
                >
                  <option value="">Select a topic</option>
                  <option value="project">Start a custom project</option>
                  <option value="partnership">Explore a partnership</option>
                  <option value="career">Career opportunity</option>
                  <option value="other">Other</option>
                </select>

                <!-- chevron like FA (no dependency) -->
                <svg
                  class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] transition-transform duration-200 group-focus-within:rotate-180"
                  width="18"
                  height="12"
                  viewBox="0 0 24 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 2L12 12L22 2"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    opacity="0.9"
                  />
                </svg>
              </div>
            </div>

            <!-- Message -->
            <div>
              <label
                class="block text-[#999999] text-xs uppercase tracking-wide mb-2 font-medium"
                for="message"
              >
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                v-model="formData.message"
                placeholder="Tell us more about your project..."
                required
                class="w-full bg-[#1a1a1a] border border-[#333] rounded-0 px-4 py-3 text-sm text-white placeholder:text-[#555] focus:outline-none focus:ring-1 focus:ring-[#8CB0FF] focus:border-[#8CB0FF] transition duration-200 hover:border-[#444] resize-none"
              ></textarea>
            </div>

            <!-- Consent -->
            <label class="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                v-model="formData.consent"
                required
                class="w-5 h-5 rounded-md accent-[#8CB0FF] mt-0.5 cursor-pointer shrink-0"
              />
              <span
                class="text-[#999999] text-xs leading-relaxed group-hover:text-[#bbb] transition"
              >
                I agree to SiteSynth storing and processing my data according to
                the privacy policy.
              </span>
            </label>

            <!-- Submit -->
            <button
              type="submit"
              :disabled="state.isSubmitting"
              class="w-full px-6 py-3 border border-white rounded-0 text-sm font-semibold text-white bg-transparent hover:bg-white hover:text-black transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {{ state.isSubmitting ? "Sending..." : "Send Message" }}
            </button>
          </form>
        </div>
      </div>
    </template>
  </TwoColumnsDesign>

  <MapboxSection />
  <FooterSection />
</template>

<script setup>
import { seoConfig, structuredData } from "~/config/seo";

const { formData, state, handleSubmit } = useContactForm();

const heroContent = [
  {
    tag: "h1",
    text: "Let's build something<br> meaningful — together.",
    margin: "mb-8",
    html: true,
  },
  {
    tag: "p",
    text: "Whether you're looking to launch a new product, align your brand, or join our team — we'd love to hear from you. Drop us a message and we'll get back to you soon.",
    margin: "mb-0",
  },
];

// SEO
const siteUrl = useRuntimeConfig().public?.siteUrl;
const seo = seoConfig.contact;

useSeoMeta({
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  ogTitle: seo.ogTitle,
  ogDescription: seo.ogDescription,
  ogImage: `${siteUrl}/assets/shareimage.png`,
  ogImageAlt: "Contact SiteSynth",
  twitterTitle: seo.twitterTitle,
  twitterDescription: seo.twitterDescription,
  twitterImage: `${siteUrl}/assets/shareimage.png`,
});

useHead({
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify(structuredData.contactPage(siteUrl)),
    },
  ],
});
</script>
