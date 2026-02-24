<template>
  <HeaderSection />

  <section class="relative bg-[#161616] min-h-screen pt-20 md:pt-32 pb-16 md:pb-24 overflow-hidden">
    <!-- Background Effects -->
    <GlowBlue />
    <ParticleEffect />

    <!-- Background Gradients -->
    <div class="absolute inset-0 pointer-events-none opacity-50">
      <div
        class="absolute top-20 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute bottom-20 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
      ></div>
    </div>

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
            <span class="text-3xl font-bold text-[#0033ff]">
              {{ Math.round((currentStep / totalSteps) * 100) }}%
            </span>
            <p class="text-[#999999] text-xs">Complete</p>
          </span>
        </div>

        <!-- Progress Bar with Gradient -->
        <div class="w-full bg-[#333] rounded-full h-2 overflow-hidden">
          <div
            :style="{ width: (currentStep / totalSteps) * 100 + '%' }"
            class="h-full bg-gradient-to-r from-[#0033ff] to-[#8D35FF] transition-all duration-300 rounded-full"
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
                  'p-6 border-2 rounded-lg transition-all',
                  formData.service === service.id
                    ? 'border-[#0033ff] bg-[#0033ff]/10'
                    : 'border-[#333] bg-[#1a1a1a] hover:border-[#555]',
                ]"
              >
                <div class="text-3xl mb-3">{{ service.icon }}</div>
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
              <select
                v-model="formData.complexity"
                class="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-[#8CB0FF] focus:border-[#8CB0FF] transition"
                required
              >
                <option value="">Select complexity</option>
                <option value="simple">Simple</option>
                <option value="medium">Medium</option>
                <option value="complex">Complex</option>
              </select>
            </div>

            <div v-if="formData.complexity" class="mt-6">
              <label class="block text-[#999999] text-xs uppercase tracking-wide mb-4 font-medium">
                Package Level *
              </label>
              <select
                v-model="formData.packageLevel"
                class="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-[#8CB0FF] focus:border-[#8CB0FF] transition"
                required
              >
                <option value="">Select package</option>
                <option v-for="pkg in availablePackages" :key="pkg" :value="pkg">
                  {{ pkg }}
                </option>
              </select>
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
              class="flex items-start gap-4 p-4 border border-[#333] rounded-lg hover:border-[#555] cursor-pointer transition"
            >
              <input
                type="checkbox"
                :value="feature.id"
                v-model="formData.selectedFeatures"
                class="w-5 h-5 rounded accent-[#0033ff] mt-0.5 flex-shrink-0"
              />
              <div class="flex-1">
                <h4 class="text-white font-semibold">{{ feature.label }}</h4>
                <p class="text-[#999999] text-sm">{{ feature.description }}</p>
              </div>
              <span class="text-[#0033ff] font-semibold whitespace-nowrap">
                {{ feature.price }}
              </span>
            </label>
          </div>

          <!-- Price Update -->
          <div class="border-t border-[#333] pt-6">
            <div class="flex justify-between items-center">
              <span class="text-[#999999]">Current Price:</span>
              <span class="text-2xl font-bold text-[#0033ff]">
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
              <select
                v-model="formData.budget"
                class="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-[#8CB0FF] focus:border-[#8CB0FF] transition"
                required
              >
                <option value="">Select budget</option>
                <option value="starter">Starter (€500)</option>
                <option value="growth">Growth (€900)</option>
                <option value="enterprise">Enterprise (Custom)</option>
              </select>
            </div>

            <div>
              <label class="block text-[#999999] text-xs uppercase tracking-wide mb-4 font-medium">
                Timeline Preference *
              </label>
              <select
                v-model="formData.timeline"
                class="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-[#8CB0FF] focus:border-[#8CB0FF] transition"
                required
              >
                <option value="">Select timeline</option>
                <option value="5days">5 days (Starter)</option>
                <option value="7days">7 days (Growth)</option>
                <option value="custom">Custom (Enterprise)</option>
              </select>
            </div>

            <label class="flex items-start gap-3 p-4 border border-[#333] rounded-lg hover:border-[#555] cursor-pointer transition">
              <input
                type="checkbox"
                v-model="formData.rushFee"
                class="w-5 h-5 rounded accent-[#0033ff] mt-0.5 flex-shrink-0"
              />
              <div>
                <h4 class="text-white font-semibold">Need it faster?</h4>
                <p class="text-[#999999] text-sm">Add rush fee for expedited delivery</p>
              </div>
            </label>
          </div>

          <!-- Price Summary -->
          <div class="border border-[#0033ff] bg-[#1a1a1a] p-6 rounded-lg">
            <p class="text-[#999999] text-sm mb-2">Total Budget:</p>
            <p class="text-4xl font-bold text-[#0033ff]">
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
                class="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder:text-[#555] focus:outline-none focus:ring-1 focus:ring-[#8CB0FF] focus:border-[#8CB0FF] transition"
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
                class="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder:text-[#555] focus:outline-none focus:ring-1 focus:ring-[#8CB0FF] focus:border-[#8CB0FF] transition"
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
                class="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder:text-[#555] focus:outline-none focus:ring-1 focus:ring-[#8CB0FF] focus:border-[#8CB0FF] transition"
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
                class="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder:text-[#555] focus:outline-none focus:ring-1 focus:ring-[#8CB0FF] focus:border-[#8CB0FF] transition"
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
                class="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder:text-[#555] focus:outline-none focus:ring-1 focus:ring-[#8CB0FF] focus:border-[#8CB0FF] transition resize-none"
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
                    class="accent-[#0033ff]"
                    required
                  />
                  <span class="text-white">Email</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    value="phone"
                    v-model="formData.contactMethod"
                    class="accent-[#0033ff]"
                  />
                  <span class="text-white">Phone</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    value="both"
                    v-model="formData.contactMethod"
                    class="accent-[#0033ff]"
                  />
                  <span class="text-white">Both</span>
                </label>
              </div>
            </div>

            <!-- Newsletter -->
            <label class="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                v-model="formData.newsletter"
                class="w-5 h-5 rounded accent-[#0033ff] mt-0.5 flex-shrink-0"
              />
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
            class="px-6 py-3 border border-[#999999] text-[#999999] rounded-lg font-semibold hover:border-white hover:text-white transition"
          >
            Back
          </button>

          <button
            v-if="currentStep < totalSteps"
            type="submit"
            :disabled="!isStepValid"
            class="flex-1 px-6 py-3 bg-[#0033ff] text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next
          </button>

          <NuxtLink
            v-if="currentStep === totalSteps"
            to="/payment"
            class="flex-1 px-6 py-3 bg-[#0033ff] text-white text-center rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Continue to Payment
          </NuxtLink>
        </div>
      </form>
    </div>
  </section>

  <FooterSection />
</template>

<script setup>
import { ref, computed } from "vue";
import GlowBlue from "@/components/effects/GlowBlue.vue";
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
  { id: "mobile", label: "Mobile Adaptation", icon: "📱" },
  { id: "ecommerce", label: "E-commerce", icon: "🛒" },
  { id: "blog", label: "Blog/Content Site", icon: "📄" },
  { id: "portfolio", label: "Portfolio", icon: "🎨" },
  { id: "custom", label: "Custom", icon: "⭐" },
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
