<script setup>
import { ref } from "vue";

const phone = ref("");
</script>

<template>
  <HeaderSection />
  <HeroGeneric
    backgroundImage=""
    backgroundPosition="bg-right-bottom"
    paddingClasses="pt-[16rem] h-[100vh]"
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
  <TwoColumnsDesign
    sectionBgColor="bg-[#161616]"
    leftColumnBgColor="bg-[#161616]"
    rightColumnBgColor="bg-[#161616]"
  >
    <template #right>
      <div class="py-24 md:border-r border-[#636363] bg-[#161616]">
        <div class="max-w-[600px] mr-auto px-6 md:px-0 md:pl-16">
          <form class="space-y-8">
            <h2 class="text-white text-3xl sm:text-4xl mb-6">
              Tell us how we can help
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-[#999999] mb-2" for="fullName">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  class="w-full bg-[#232323] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#8CB0FF]"
                />
              </div>
              <div>
                <label class="block text-[#999999] mb-2" for="company">
                  Company (optional)
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  class="w-full bg-[#232323] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#8CB0FF]"
                />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-[#999999] mb-2" for="email">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  class="w-full bg-[#232323] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#8CB0FF]"
                />
              </div>
              <div>
                <label class="block text-[#999999] mb-2" for="phone">
                  Phone number
                </label>
                <ClientOnly>
                  <PhoneInput
                    v-model="phone"
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
                  />
                  <template #fallback>
                    <input
                      type="tel"
                      placeholder="Enter phone"
                      class="w-full bg-[#232323] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#8CB0FF]"
                    />
                  </template>
                </ClientOnly>
              </div>
            </div>
            <div>
              <label class="block text-[#999999] mb-2" for="topic">Topic</label>
              <select
                id="topic"
                name="topic"
                class="w-full bg-[#232323] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#8CB0FF]"
              >
                <option value="">Select a topic</option>
                <option value="project">Start a custom project</option>
                <option value="partnership">Explore a partnership</option>
                <option value="career">Career opportunity</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label class="block text-[#999999] mb-2" for="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                class="w-full bg-[#232323] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#8CB0FF]"
              ></textarea>
            </div>
            <div>
              <div class="mb-6 flex items-center">
                <input
                  id="consent"
                  name="consent"
                  type="checkbox"
                  required
                  class="accent-[#8CB0FF] w-5 h-5 mr-3 focus:outline-none focus:ring-2 focus:ring-[#8CB0FF]"
                />
                <label for="consent" class="text-[#999999] text-sm">
                  I agree to SiteSynth storing and processing my data.
                </label>
              </div>
              <button
                type="submit"
                class="px-6 py-2 border-1 border-white hover:bg-white hover:text-[#161616] hover:border-white bg-[#161616] text-white transition-colors duration-[1000ms] font-semibold cursor-pointer"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </template>

    <template #left>
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
