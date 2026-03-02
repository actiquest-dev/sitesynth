<template>
  <HeaderSection />

  <section
    class="relative bg-[#161616] min-h-screen pt-36 md:pt-32 pb-16 md:pb-24 overflow-hidden bg-cover bg-center bg-no-repeat"
    style="background-image: url('/assets/new-assets/test/sitesynth-animated-gradient-v2.svg');"
  >
    <!-- Background Effects -->
    <GlowEffect />
    <ParticleEffect />

    <div class="relative max-w-2xl mx-auto px-6 md:px-12">
      <!-- Progress Indicator -->
      <div class="mb-16">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-3xl font-extrabold text-white">
              Step {{ currentStep }}/{{ totalSteps }}
            </h2>
            <p class="text-[#999999] text-sm mt-1">Project Setup</p>
          </div>
          <span class="text-right">
            <span class="text-3xl font-bold text-white">
              {{ Math.round((currentStep / totalSteps) * 100) }}%
            </span>
            <p class="text-[#999999] text-xs">Complete</p>
          </span>
        </div>

        <!-- Progress Bar with Gradient -->
        <div class="w-full bg-[#333] rounded-full h-2 overflow-hidden">
          <div
            :style="{ width: (currentStep / totalSteps) * 100 + '%' }"
            class="h-full bg-gradient-to-r from-[#8D35FF] to-[#B06BFF] transition-all duration-300 rounded-full"
          ></div>
        </div>
      </div>

      <!-- Form Container -->
      <form @submit.prevent="nextStep" class="space-y-8">
        <!-- STEP 1: Service Selection -->
        <div v-if="currentStep === 1" class="space-y-8">
          <div>
            <h3 class="text-3xl font-bold text-white mb-2">
              What services do you need?
            </h3>
            <p class="text-[#999999] mb-8">
              Select the service that best matches your project
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label
              v-for="service in services"
              :key="service.id"
              class="cursor-pointer"
            >
              <input
                type="radio"
                :value="service.id"
                v-model="formData.service"
                class="hidden"
              />
              <div
                :class="[
                  'p-6 border-2 rounded-none transition-all',
                  formData.service === service.id
                    ? 'border-[#8D35FF] bg-[#8D35FF]/10'
                    : 'border-[#333] bg-[#1a1a1a] hover:border-[#555]',
                ]"
              >
                <img
                  :src="service.iconSrc"
                  :alt="service.label"
                  class="w-8 h-8 mb-3 object-contain"
                />
                <h4 class="text-white font-semibold">{{ service.label }}</h4>
              </div>
            </label>
          </div>
        </div>

        <!-- STEP 2: Complexity Level -->
        <div v-if="currentStep === 2" class="space-y-8">
          <div>
            <h3 class="text-3xl font-bold text-white mb-2">
              Choose complexity level
            </h3>
            <p class="text-[#999999] mb-8">
              Select the level that matches your project scope
            </p>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-[#999999] text-xs uppercase tracking-wide mb-4 font-medium">
                Complexity *
              </label>
              <div class="relative group">
                <select
                  v-model="formData.complexity"
                  class="w-full bg-[#1a1a1a] border border-[#333] rounded-none px-4 py-3 pr-10 text-sm text-white appearance-none focus:outline-none focus:ring-1 focus:ring-[#8D35FF] focus:border-[#8D35FF] transition duration-200 hover:border-[#444] cursor-pointer"
                  required
                >
                  <option value="">Select complexity</option>
                  <option value="simple">Simple</option>
                  <option value="medium">Medium</option>
                  <option value="complex">Complex</option>
                </select>
                <svg
                  class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#999999]"
                  width="18"
                  height="14"
                  viewBox="0 0 320 512"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
                  />
                </svg>
              </div>
            </div>

            <div v-if="formData.complexity" class="mt-6">
              <label class="block text-[#999999] text-xs uppercase tracking-wide mb-4 font-medium">
                Package Level *
              </label>
              <div class="relative group">
                <select
                  v-model="formData.packageLevel"
                  class="w-full bg-[#1a1a1a] border border-[#333] rounded-none px-4 py-3 pr-10 text-sm text-white appearance-none focus:outline-none focus:ring-1 focus:ring-[#8D35FF] focus:border-[#8D35FF] transition duration-200 hover:border-[#444] cursor-pointer"
                  required
                >
                  <option value="">Select package</option>
                  <option v-for="pkg in availablePackages" :key="pkg" :value="pkg">
                    {{ pkg }}
                  </option>
                </select>
                <svg
                  class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#999999]"
                  width="18"
                  height="14"
                  viewBox="0 0 320 512"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 3: Features Selection -->
        <div v-if="currentStep === 3" class="space-y-8">
          <div>
            <h3 class="text-3xl font-bold text-white mb-2">
              What features do you want?
            </h3>
            <p class="text-[#999999] mb-8">
              Select the features you need for your project
            </p>
          </div>

          <div class="space-y-4">
            <label
              v-for="feature in features"
              :key="feature.id"
              class="flex items-center gap-4 p-4 border border-[#333] rounded-none hover:border-[#555] cursor-pointer transition"
            >
              <input
                type="checkbox"
                :value="feature.id"
                v-model="formData.selectedFeatures"
                class="sr-only"
              />
              <span
                :class="[
                  'w-5 h-5 flex-shrink-0 border bg-[#1a1a1a] flex items-center justify-center transition-all duration-200',
                  isFeatureSelected(feature.id) ? 'border-[#8D35FF] bg-[#8D35FF]/20' : 'border-[#555]',
                ]"
              >
                <svg
                  v-if="isFeatureSelected(feature.id)"
                  class="w-3.5 h-3.5 text-[#8D35FF]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
              <div class="flex-1">
                <h4 class="text-white font-semibold">{{ feature.label }}</h4>
                <p class="text-[#999999] text-sm">{{ feature.description }}</p>
              </div>
              <span class="text-[#7a7a7a] font-semibold whitespace-nowrap">
                {{ feature.price }}
              </span>
            </label>
          </div>

          <!-- Price Update -->
          <div class="border-t border-[#333] pt-6">
            <div class="flex justify-between items-center">
              <span class="text-[#999999]">Current Price:</span>
              <span class="text-2xl font-bold text-[#d4d4d4]">
                €{{ calculatePrice() }}
              </span>
            </div>
          </div>
        </div>

        <!-- STEP 4: Budget & Timeline -->
        <div v-if="currentStep === 4" class="space-y-8">
          <div>
            <h3 class="text-3xl font-bold text-white mb-2">
              What's your budget?
            </h3>
            <p class="text-[#999999] mb-8">
              Choose a plan that fits your needs
            </p>
          </div>

          <div class="space-y-6">
            <div>
              <label class="block text-[#999999] text-xs uppercase tracking-wide mb-4 font-medium">
                Budget *
              </label>
              <div class="relative group">
                <select
                  v-model="formData.budget"
                  class="w-full bg-[#1a1a1a] border border-[#333] rounded-none px-4 py-3 pr-10 text-sm text-white appearance-none focus:outline-none focus:ring-1 focus:ring-[#8D35FF] focus:border-[#8D35FF] transition duration-200 hover:border-[#444] cursor-pointer"
                  required
                >
                  <option value="">Select budget</option>
                  <option value="starter">Starter (€500)</option>
                  <option value="growth">Growth (€900)</option>
                  <option value="enterprise">Enterprise (Custom)</option>
                </select>
                <svg
                  class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#999999]"
                  width="18"
                  height="14"
                  viewBox="0 0 320 512"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
                  />
                </svg>
              </div>
            </div>

            <div>
              <label class="block text-[#999999] text-xs uppercase tracking-wide mb-4 font-medium">
                Timeline Preference *
              </label>
              <div class="relative group">
                <select
                  v-model="formData.timeline"
                  class="w-full bg-[#1a1a1a] border border-[#333] rounded-none px-4 py-3 pr-10 text-sm text-white appearance-none focus:outline-none focus:ring-1 focus:ring-[#8D35FF] focus:border-[#8D35FF] transition duration-200 hover:border-[#444] cursor-pointer"
                  required
                >
                  <option value="">Select timeline</option>
                  <option value="5days">5 days (Starter)</option>
                  <option value="7days">7 days (Growth)</option>
                  <option value="custom">Custom (Enterprise)</option>
                </select>
                <svg
                  class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#999999]"
                  width="18"
                  height="14"
                  viewBox="0 0 320 512"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
                  />
                </svg>
              </div>
            </div>

            <label class="flex items-start gap-3 p-4 border border-[#333] rounded-none hover:border-[#555] cursor-pointer transition">
              <input
                type="checkbox"
                v-model="formData.rushFee"
                class="sr-only"
              />
              <span
                :class="[
                  'w-5 h-5 mt-0.5 flex-shrink-0 border bg-[#1a1a1a] flex items-center justify-center transition-all duration-200',
                  formData.rushFee ? 'border-[#8D35FF] bg-[#8D35FF]/20' : 'border-[#555]',
                ]"
              >
                <svg
                  v-if="formData.rushFee"
                  class="w-3.5 h-3.5 text-[#8D35FF]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
              <div>
                <h4 class="text-white font-semibold">Need it faster?</h4>
                <p class="text-[#999999] text-sm">Add rush fee for expedited delivery</p>
              </div>
            </label>
          </div>

          <!-- Price Summary -->
          <div class="border border-[#8D35FF] bg-[#1a1a1a] p-6 rounded-none">
            <p class="text-[#999999] text-sm mb-2">Total Budget:</p>
            <p class="text-4xl font-bold text-[#8D35FF]">
              €{{ formData.budget === 'starter' ? 500 : formData.budget === 'growth' ? 900 : 'Custom' }}
            </p>
          </div>
        </div>

        <!-- STEP 5: Contact Info -->
        <div v-if="currentStep === 5" class="space-y-8">
          <div>
            <h3 class="text-3xl font-bold text-white mb-2">
              Let's get in touch
            </h3>
            <p class="text-[#999999] mb-8">
              Share your contact details so we can reach you
            </p>
          </div>

          <div class="space-y-6">
            <!-- Full Name -->
            <div>
              <label class="block text-[#999999] text-xs uppercase tracking-wide mb-2 font-medium">
                Full Name <span class="text-[#AA3733]">*</span>
              </label>
              <input
                v-model="formData.fullName"
                type="text"
                placeholder="John Doe"
                required
                class="w-full bg-[#1a1a1a] border border-[#333] rounded-none px-4 py-3 text-white placeholder:text-[#555] focus:outline-none focus:ring-1 focus:ring-[#8D35FF] focus:border-[#8D35FF] transition"
              />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-[#999999] text-xs uppercase tracking-wide mb-2 font-medium">
                Email <span class="text-[#AA3733]">*</span>
              </label>
              <input
                v-model="formData.email"
                type="email"
                placeholder="hello@example.com"
                required
                class="w-full bg-[#1a1a1a] border border-[#333] rounded-none px-4 py-3 text-white placeholder:text-[#555] focus:outline-none focus:ring-1 focus:ring-[#8D35FF] focus:border-[#8D35FF] transition"
              />
            </div>

            <!-- Phone -->
            <div>
              <label class="block text-[#999999] text-xs uppercase tracking-wide mb-2 font-medium">
                Phone (Optional)
              </label>
              <input
                v-model="formData.phone"
                type="tel"
                placeholder="+32 (0)4 23 456 789"
                class="w-full bg-[#1a1a1a] border border-[#333] rounded-none px-4 py-3 text-white placeholder:text-[#555] focus:outline-none focus:ring-1 focus:ring-[#8D35FF] focus:border-[#8D35FF] transition"
              />
            </div>

            <!-- Company/Project Name -->
            <div>
              <label class="block text-[#999999] text-xs uppercase tracking-wide mb-2 font-medium">
                Company/Project Name (Optional)
              </label>
              <input
                v-model="formData.companyName"
                type="text"
                placeholder="Your company"
                class="w-full bg-[#1a1a1a] border border-[#333] rounded-none px-4 py-3 text-white placeholder:text-[#555] focus:outline-none focus:ring-1 focus:ring-[#8D35FF] focus:border-[#8D35FF] transition"
              />
            </div>

            <!-- Project Description -->
            <div>
              <label class="block text-[#999999] text-xs uppercase tracking-wide mb-2 font-medium">
                Project Description <span class="text-[#AA3733]">*</span>
              </label>
              <textarea
                v-model="formData.description"
                placeholder="Tell us more about your project..."
                rows="5"
                required
                minlength="10"
                class="w-full bg-[#1a1a1a] border border-[#333] rounded-none px-4 py-3 text-white placeholder:text-[#555] focus:outline-none focus:ring-1 focus:ring-[#8D35FF] focus:border-[#8D35FF] transition resize-none"
              ></textarea>
            </div>

            <!-- Preferred Contact Method -->
            <div>
              <label class="block text-[#999999] text-xs uppercase tracking-wide mb-4 font-medium">
                Preferred Contact Method <span class="text-[#AA3733]">*</span>
              </label>
              <div class="space-y-2">
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    value="email"
                    v-model="formData.contactMethod"
                    class="sr-only"
                    required
                  />
                  <span
                    :class="[
                      'w-5 h-5 flex-shrink-0 rounded-full border bg-[#1a1a1a] flex items-center justify-center transition-all duration-200',
                      formData.contactMethod === 'email' ? 'border-[#8D35FF]' : 'border-[#555]',
                    ]"
                  >
                    <span
                      v-if="formData.contactMethod === 'email'"
                      class="w-2.5 h-2.5 rounded-full bg-[#8D35FF]"
                    ></span>
                  </span>
                  <span class="text-white">Email</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    value="phone"
                    v-model="formData.contactMethod"
                    class="sr-only"
                  />
                  <span
                    :class="[
                      'w-5 h-5 flex-shrink-0 rounded-full border bg-[#1a1a1a] flex items-center justify-center transition-all duration-200',
                      formData.contactMethod === 'phone' ? 'border-[#8D35FF]' : 'border-[#555]',
                    ]"
                  >
                    <span
                      v-if="formData.contactMethod === 'phone'"
                      class="w-2.5 h-2.5 rounded-full bg-[#8D35FF]"
                    ></span>
                  </span>
                  <span class="text-white">Phone</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    value="both"
                    v-model="formData.contactMethod"
                    class="sr-only"
                  />
                  <span
                    :class="[
                      'w-5 h-5 flex-shrink-0 rounded-full border bg-[#1a1a1a] flex items-center justify-center transition-all duration-200',
                      formData.contactMethod === 'both' ? 'border-[#8D35FF]' : 'border-[#555]',
                    ]"
                  >
                    <span
                      v-if="formData.contactMethod === 'both'"
                      class="w-2.5 h-2.5 rounded-full bg-[#8D35FF]"
                    ></span>
                  </span>
                  <span class="text-white">Both</span>
                </label>
              </div>
            </div>

            <!-- Newsletter -->
            <label class="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                v-model="formData.newsletter"
                class="sr-only"
              />
              <span
                :class="[
                  'w-5 h-5 mt-0.5 flex-shrink-0 border bg-[#1a1a1a] flex items-center justify-center transition-all duration-200',
                  formData.newsletter ? 'border-[#8D35FF] bg-[#8D35FF]/20' : 'border-[#555]',
                ]"
              >
                <svg
                  v-if="formData.newsletter"
                  class="w-3.5 h-3.5 text-[#8D35FF]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
              <span class="text-[#999999] text-sm leading-relaxed">
                Subscribe to our updates and project insights
              </span>
            </label>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex gap-4 pt-6 border-t border-[#333]">
          <button
            v-if="currentStep > 1"
            type="button"
            @click="previousStep"
            class="px-6 py-3 border border-[#999999] text-[#999999] rounded-none font-semibold hover:border-white hover:text-white transition"
          >
            Back
          </button>

          <button
            v-if="currentStep < totalSteps"
            type="submit"
            :disabled="!isStepValid"
            class="flex-1 px-6 py-3 bg-[#8D35FF] text-white rounded-none font-semibold hover:bg-[#7B2EF0] disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next
          </button>

          <button
            v-if="currentStep === totalSteps"
            type="button"
            @click="goToPayment"
            class="flex-1 px-6 py-3 bg-[#8D35FF] text-white text-center rounded-none font-semibold hover:bg-[#7B2EF0] transition"
          >
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  </section>

  <FooterSection />
</template>

<script setup>
import { ref, computed } from "vue";
import GlowEffect from "@/components/effects/GlowEffect.vue";
import ParticleEffect from "@/components/effects/ParticleEffect.vue";

const currentStep = ref(1);
const totalSteps = 5;

const formData = ref({
  service: "",
  complexity: "",
  packageLevel: "",
  selectedFeatures: [],
  budget: "",
  timeline: "",
  rushFee: false,
  fullName: "",
  email: "",
  phone: "",
  companyName: "",
  description: "",
  contactMethod: "email",
  newsletter: false,
});

const services = [
  { id: "mobile", label: "Mobile Adaptation", iconSrc: "/assets/icons/monitor-mobbile.svg" },
  { id: "ecommerce", label: "E-commerce", iconSrc: "/assets/icons/box.svg" },
  { id: "blog", label: "Blog/Content Site", iconSrc: "/assets/icons/book.svg" },
  { id: "portfolio", label: "Portfolio", iconSrc: "/assets/icons/eye.svg" },
  { id: "custom", label: "Custom", iconSrc: "/assets/icons/setting-2.svg" },
];

const features = [
  {
    id: "analytics",
    label: "Plausible Analytics",
    description: "Privacy-focused analytics included",
    price: "Included",
  },
  {
    id: "deploy",
    label: "Vercel Deploy",
    description: "Automatic deployments included",
    price: "Included",
  },
  {
    id: "seo",
    label: "SEO Optimization",
    description: "Complete SEO setup and optimization",
    price: "+€50-100",
  },
  {
    id: "email",
    label: "Email Setup",
    description: "Custom email configuration",
    price: "+€75",
  },
  {
    id: "cloudflare",
    label: "Cloudflare Email Routing",
    description: "Email forwarding setup",
    price: "Included",
  },
];

const availablePackages = computed(() => {
  const packages = {
    simple: ["Basic", "Standard", "Pro"],
    medium: ["Standard", "Advanced", "Pro"],
    complex: ["Advanced", "Enterprise", "Custom"],
  };
  return packages[formData.value.complexity] || [];
});

const isStepValid = computed(() => {
  switch (currentStep.value) {
    case 1:
      return formData.value.service !== "";
    case 2:
      return (
        formData.value.complexity !== "" && formData.value.packageLevel !== ""
      );
    case 3:
      return true; // Features are optional
    case 4:
      return formData.value.budget !== "" && formData.value.timeline !== "";
    case 5:
      return (
        formData.value.fullName !== "" &&
        formData.value.email !== "" &&
        formData.value.description.length >= 10
      );
    default:
      return false;
  }
});

const nextStep = () => {
  if (isStepValid.value && currentStep.value < totalSteps) {
    currentStep.value++;
  }
};

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const calculatePrice = () => {
  let price = 0;
  if (formData.value.budget === "starter") price = 500;
  if (formData.value.budget === "growth") price = 900;

  formData.value.selectedFeatures.forEach((featureId) => {
    const feature = features.find((f) => f.id === featureId);
    if (feature && feature.price.includes("€")) {
      const amount = parseInt(feature.price.match(/\d+/)?.[0] || 0);
      price += amount;
    }
  });

  return price;
};

const isFeatureSelected = (featureId) =>
  formData.value.selectedFeatures.includes(featureId);

// Save intake data and navigate to payment
const goToPayment = () => {
  // Save all 5-step form data to sessionStorage
  sessionStorage.setItem('intakeFormData', JSON.stringify(formData.value));
  console.log('✅ Intake data saved:', formData.value);

  // Navigate to payment
  navigateTo('/payment');
};

// SEO
const siteUrl = useRuntimeConfig().public?.siteUrl;

useSeoMeta({
  title: "Service Intake Form | SiteSynth",
  description: "Tell us about your project and get a custom quote from SiteSynth.",
  ogTitle: "Service Intake Form | SiteSynth",
  ogDescription: "Tell us about your project and get a custom quote.",
  ogImage: `${siteUrl}/assets/shareimage.png`,
});
</script>
