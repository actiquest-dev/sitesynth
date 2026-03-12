<template>
  <HeaderSection />

  <section
    class="relative min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
    style="background-image: url('/assets/new-assets/test/sitesynth-animated-gradient-v2.svg'); background-color: #161616; padding-top: 128px;"
  >
    <GlowEffect />
    <ParticleEffect />

    <div class="relative w-full max-w-[1248px] mx-auto px-6 py-10">

      <!-- Header -->
      <div class="flex items-center gap-3 mb-6">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium border border-[#8D35FF]/30 text-[#8D35FF]" style="background: #8D35FF18;">
          Add-on Services
        </span>
        <span class="text-xs text-[#888]">Subscribe to any service — no website build required</span>
      </div>

      <!-- Step progress -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4 relative">
          <div class="absolute left-4 right-4 top-4 h-px bg-[#333] -z-0"></div>
          <div
            class="absolute left-4 top-4 h-px bg-[#8D35FF] -z-0 transition-all duration-500"
            :style="{ width: ((currentStep - 1) / (totalSteps - 1) * 100) + '%' }"
          ></div>
          <div v-for="(step, index) in steps" :key="step.id" class="flex flex-col items-center gap-2 z-10">
            <div :class="[
              'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 border',
              currentStep > index + 1
                ? 'bg-[#8D35FF] border-[#8D35FF] text-white'
                : currentStep === index + 1
                  ? 'bg-[#161616] border-[#8D35FF] text-[#8D35FF]'
                  : 'bg-[#161616] border-[#2a2a2a] text-[#888]'
            ]">
              <svg v-if="currentStep > index + 1" viewBox="0 0 16 16" fill="currentColor" class="w-3.5 h-3.5">
                <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
              </svg>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <span :class="[
              'text-[11px] transition-colors',
              currentStep === index + 1 ? 'text-white' : currentStep > index + 1 ? 'text-[#8D35FF]/60' : 'text-[#888]'
            ]">{{ step.title }}</span>
          </div>
        </div>
      </div>

      <!-- Form card -->
      <div class="border border-[#2a2a2a]" style="background: #161616;">

        <!-- Topbar -->
        <div class="h-11 border-b border-[#2a2a2a] flex items-center justify-between px-6" style="background: #1a1a1a;">
          <span class="text-sm text-white font-medium">{{ steps[currentStep - 1]?.title }}</span>
          <span class="text-xs text-[#888] tabular-nums">{{ currentStep }} of {{ totalSteps }}</span>
        </div>

        <!-- Content -->
        <div class="px-10 py-8 max-w-3xl mx-auto w-full">

          <!-- STEP 1: Select services -->
          <div v-if="currentStep === 1">
            <h1 class="text-xl font-semibold text-white mb-1">Which services do you need?</h1>
            <p class="text-sm text-[#888] mb-7">Select one or more — mix and match as needed</p>

            <div class="space-y-2">
              <div v-for="service in services" :key="service.id"
                :class="[
                  'flex items-start gap-4 px-4 py-4 border cursor-pointer transition-all',
                  isSelected(service.id) ? 'border-[#8D35FF]/40 bg-[#8D35FF]/5' : 'border-[#2a2a2a] hover:border-[#333]'
                ]"
                style="background: #1a1a1a;"
                @click="toggleService(service.id)"
              >
                <!-- Checkbox -->
                <span :class="[
                  'w-3.5 h-3.5 flex-shrink-0 border flex items-center justify-center transition-all mt-0.5',
                  isSelected(service.id) ? 'border-[#8D35FF] bg-[#8D35FF]' : 'border-[#333]'
                ]">
                  <svg v-if="isSelected(service.id)" viewBox="0 0 16 16" fill="currentColor" class="w-2.5 h-2.5 text-white">
                    <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
                  </svg>
                </span>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-white font-medium">{{ service.label }}</p>
                  <p class="text-xs text-[#888] mt-0.5">{{ service.description }}</p>
                </div>

                <!-- Pricing toggle (visible only when selected) -->
                <div v-if="isSelected(service.id)" class="flex-shrink-0 flex items-center gap-1 border border-[#2a2a2a]" @click.stop>
                  <button
                    @click="setBilling(service.id, 'onetime')"
                    :class="[
                      'px-3 py-1.5 text-xs transition-all',
                      getBilling(service.id) === 'onetime' ? 'bg-[#8D35FF] text-white' : 'text-[#888] hover:text-white'
                    ]"
                  >
                    One-time<br/>
                    <span class="font-semibold">€{{ service.priceOnetime }}</span>
                  </button>
                  <div class="w-px h-8 bg-[#2a2a2a]"></div>
                  <button
                    @click="setBilling(service.id, 'monthly')"
                    :class="[
                      'px-3 py-1.5 text-xs transition-all',
                      getBilling(service.id) === 'monthly' ? 'bg-[#8D35FF] text-white' : 'text-[#888] hover:text-white'
                    ]"
                  >
                    Monthly<br/>
                    <span class="font-semibold">€{{ service.priceMonthly }}/mo</span>
                  </button>
                </div>

                <!-- Price preview (not selected) -->
                <div v-else class="flex-shrink-0 text-right">
                  <p class="text-xs text-[#777]">from €{{ service.priceOnetime }}</p>
                  <p class="text-[10px] text-[#666]">or €{{ service.priceMonthly }}/mo</p>
                </div>
              </div>
            </div>

            <!-- Total -->
            <div v-if="selectedServices.length > 0" class="mt-5 flex items-center justify-between pt-4 border-t border-[#1f1f1f]">
              <span class="text-xs text-[#888]">{{ selectedServices.length }} service{{ selectedServices.length > 1 ? 's' : '' }} selected</span>
              <span class="text-sm text-white tabular-nums">{{ orderTotal }}</span>
            </div>
          </div>

          <!-- STEP 2: Contact -->
          <div v-if="currentStep === 2">
            <h1 class="text-xl font-semibold text-white mb-1">Your details</h1>
            <p class="text-sm text-[#888] mb-7">We'll set up your services and send access details here</p>
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[10px] uppercase tracking-widest text-[#888] mb-1.5">Full name *</label>
                  <input v-model="formData.fullName" type="text" placeholder="Jane Smith" required
                    class="w-full border px-3 py-2.5 text-sm text-white placeholder:text-[#888] focus:outline-none transition-colors"
                    style="background: #1a1a1a; border-color: #2a2a2a;"
                    @focus="e => e.target.style.borderColor = '#8D35FF'"
                    @blur="e => e.target.style.borderColor = '#2a2a2a'" />
                </div>
                <div>
                  <label class="block text-[10px] uppercase tracking-widest text-[#888] mb-1.5">Company</label>
                  <input v-model="formData.company" type="text" placeholder="Acme Inc."
                    class="w-full border px-3 py-2.5 text-sm text-white placeholder:text-[#888] focus:outline-none transition-colors"
                    style="background: #1a1a1a; border-color: #2a2a2a;"
                    @focus="e => e.target.style.borderColor = '#8D35FF'"
                    @blur="e => e.target.style.borderColor = '#2a2a2a'" />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[10px] uppercase tracking-widest text-[#888] mb-1.5">Email *</label>
                  <input v-model="formData.email" type="email" placeholder="jane@example.com" required
                    class="w-full border px-3 py-2.5 text-sm text-white placeholder:text-[#888] focus:outline-none transition-colors"
                    style="background: #1a1a1a; border-color: #2a2a2a;"
                    @focus="e => e.target.style.borderColor = '#8D35FF'"
                    @blur="e => e.target.style.borderColor = '#2a2a2a'" />
                </div>
                <div>
                  <label class="block text-[10px] uppercase tracking-widest text-[#888] mb-1.5">Website URL</label>
                  <input v-model="formData.website" type="url" placeholder="https://yoursite.com"
                    class="w-full border px-3 py-2.5 text-sm text-white placeholder:text-[#888] focus:outline-none transition-colors"
                    style="background: #1a1a1a; border-color: #2a2a2a;"
                    @focus="e => e.target.style.borderColor = '#8D35FF'"
                    @blur="e => e.target.style.borderColor = '#2a2a2a'" />
                </div>
              </div>
              <div>
                <label class="block text-[10px] uppercase tracking-widest text-[#888] mb-1.5">Additional notes</label>
                <textarea v-model="formData.notes" rows="3"
                  placeholder="Anything we should know about your project or setup…"
                  class="w-full border px-3 py-2.5 text-sm text-white placeholder:text-[#888] focus:outline-none transition-colors resize-none"
                  style="background: #1a1a1a; border-color: #2a2a2a;"
                  @focus="e => e.target.style.borderColor = '#8D35FF'"
                  @blur="e => e.target.style.borderColor = '#2a2a2a'"></textarea>
              </div>
              <label class="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" v-model="formData.newsletter" class="sr-only" />
                <span :class="[
                  'w-3.5 h-3.5 flex-shrink-0 border flex items-center justify-center transition-all',
                  formData.newsletter ? 'border-[#8D35FF] bg-[#8D35FF]' : 'border-[#333]'
                ]">
                  <svg v-if="formData.newsletter" viewBox="0 0 16 16" fill="currentColor" class="w-2.5 h-2.5 text-white">
                    <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
                  </svg>
                </span>
                <span class="text-xs text-[#888]">Subscribe to updates and insights from SiteSynth</span>
              </label>
            </div>
          </div>

          <!-- STEP 3: Summary -->
          <div v-if="currentStep === 3">
            <h1 class="text-xl font-semibold text-white mb-1">Order summary</h1>
            <p class="text-sm text-[#888] mb-7">Review your selected services before payment</p>

            <div class="space-y-3">
              <!-- Services breakdown -->
              <div class="border border-[#2a2a2a]" style="background: #1a1a1a;">
                <div class="px-4 py-2.5 border-b border-[#2a2a2a]">
                  <p class="text-[10px] uppercase tracking-widest text-[#888]">Services</p>
                </div>
                <div class="px-4 py-3 space-y-2">
                  <div v-for="id in selectedServices" :key="id" class="flex justify-between text-sm">
                    <div>
                      <span class="text-white">{{ getService(id)?.label }}</span>
                      <span class="ml-2 text-[10px] px-1.5 py-0.5 border" :class="getBilling(id) === 'monthly' ? 'border-[#8D35FF]/30 text-[#8D35FF]' : 'border-[#2a2a2a] text-[#888]'">
                        {{ getBilling(id) === 'monthly' ? 'monthly' : 'one-time' }}
                      </span>
                    </div>
                    <span class="text-white tabular-nums">
                      €{{ getBilling(id) === 'monthly' ? getService(id)?.priceMonthly + '/mo' : getService(id)?.priceOnetime }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Contact -->
              <div class="border border-[#2a2a2a]" style="background: #1a1a1a;">
                <div class="px-4 py-2.5 border-b border-[#2a2a2a]">
                  <p class="text-[10px] uppercase tracking-widest text-[#888]">Contact</p>
                </div>
                <div class="px-4 py-3 space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-[#888]">Name</span>
                    <span class="text-white">{{ formData.fullName }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-[#888]">Email</span>
                    <span class="text-white">{{ formData.email }}</span>
                  </div>
                  <div v-if="formData.website" class="flex justify-between text-sm">
                    <span class="text-[#888]">Website</span>
                    <span class="text-white">{{ formData.website }}</span>
                  </div>
                </div>
              </div>

              <!-- Total -->
              <div class="border border-[#2a2a2a]" style="background: #1a1a1a;">
                <div class="px-4 py-2.5 border-b border-[#2a2a2a] flex items-center gap-2">
                  <div class="w-0.5 h-3.5 bg-[#8D35FF] rounded"></div>
                  <p class="text-[10px] uppercase tracking-widest text-[#888]">Pricing</p>
                </div>
                <div class="px-4 py-3 space-y-2">
                  <div v-if="onetimeTotal > 0" class="flex justify-between text-sm">
                    <span class="text-[#888]">One-time fees</span>
                    <span class="text-white">€{{ onetimeTotal }}</span>
                  </div>
                  <div v-if="monthlyTotal > 0" class="flex justify-between text-sm">
                    <span class="text-[#888]">Monthly recurring</span>
                    <span class="text-white">€{{ monthlyTotal }}/mo</span>
                  </div>
                  <div class="pt-2 border-t border-[#2a2a2a] flex justify-between">
                    <span class="text-sm text-white font-medium">Due today</span>
                    <span class="text-sm font-semibold text-[#8D35FF]">€{{ onetimeTotal + monthlyTotal }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Footer nav -->
        <div class="border-t border-[#2a2a2a] px-6 py-4 flex items-center justify-between" style="background: #1a1a1a;">
          <button v-if="currentStep > 1" @click="previousStep"
            class="flex items-center gap-1.5 text-sm text-[#888] hover:text-white transition-colors">
            <svg viewBox="0 0 16 16" fill="currentColor" class="w-3.5 h-3.5">
              <path d="M9.78 12.78a.75.75 0 0 1-1.06 0L4.47 8.53a.75.75 0 0 1 0-1.06l4.25-4.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L6.06 8l3.72 3.72a.75.75 0 0 1 0 1.06Z" />
            </svg>
            Back
          </button>
          <div v-else></div>

          <button v-if="currentStep < totalSteps" @click="nextStep" :disabled="!isStepValid"
            class="flex items-center gap-2 px-6 py-2.5 text-sm font-medium transition-all disabled:opacity-25 disabled:cursor-not-allowed"
            :class="isStepValid ? 'bg-[#8D35FF] text-white hover:bg-[#7B2EF0]' : 'bg-[#333] text-[#888]'">
            Continue
            <svg viewBox="0 0 16 16" fill="currentColor" class="w-3.5 h-3.5">
              <path d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z" />
            </svg>
          </button>

          <button v-if="currentStep === totalSteps" @click="goToPayment" :disabled="!isStepValid"
            class="flex items-center gap-2 px-6 py-2.5 text-sm font-medium transition-all disabled:opacity-25 disabled:cursor-not-allowed"
            :class="isStepValid ? 'bg-[#8D35FF] text-white hover:bg-[#7B2EF0]' : 'bg-[#333] text-[#888]'">
            Continue to Payment
            <svg viewBox="0 0 16 16" fill="currentColor" class="w-3.5 h-3.5">
              <path d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  </section>

  <FooterSection />
</template>

<script setup>
import { ref, computed } from 'vue'
import GlowEffect from '@/components/effects/GlowEffect.vue'
import ParticleEffect from '@/components/effects/ParticleEffect.vue'

const steps = [
  { id: 1, title: 'Services' },
  { id: 2, title: 'Contact' },
  { id: 3, title: 'Summary' },
]

const currentStep = ref(1)
const totalSteps = steps.length

const services = [
  {
    id: 'seo',
    label: 'SEO Optimization',
    description: 'Meta tags, structured data, sitemap, performance audit — monthly reporting included',
    priceOnetime: 75,
    priceMonthly: 49,
  },
  {
    id: 'email',
    label: 'Email Setup',
    description: 'Custom domain email configuration (Google Workspace or Zoho), DNS setup included',
    priceOnetime: 75,
    priceMonthly: 15,
  },
  {
    id: 'analytics',
    label: 'Plausible Analytics',
    description: 'Privacy-focused analytics — no cookies, GDPR compliant, clean dashboard',
    priceOnetime: 0,
    priceMonthly: 12,
  },
  {
    id: 'deploy',
    label: 'Vercel Hosting & Deploy',
    description: 'Managed Vercel hosting with CI/CD, custom domain, SSL certificate',
    priceOnetime: 0,
    priceMonthly: 20,
  },
  {
    id: 'cloudflare',
    label: 'Cloudflare Email Routing',
    description: 'Free email forwarding via Cloudflare — setup and DNS configuration',
    priceOnetime: 49,
    priceMonthly: 0,
  },
  {
    id: 'maintenance',
    label: 'Maintenance & Support',
    description: 'Monthly site updates, content edits, bug fixes, priority support via chat',
    priceOnetime: 0,
    priceMonthly: 99,
  },
]

const formData = ref({
  fullName: '',
  company: '',
  email: '',
  website: '',
  notes: '',
  newsletter: false,
})

// Selected services: { id: string, billing: 'onetime' | 'monthly' }[]
const selections = ref([])

const selectedServices = computed(() => selections.value.map(s => s.id))

const isSelected = (id) => selections.value.some(s => s.id === id)
const getBilling = (id) => selections.value.find(s => s.id === id)?.billing ?? 'onetime'
const getService = (id) => services.find(s => s.id === id)

const toggleService = (id) => {
  const idx = selections.value.findIndex(s => s.id === id)
  if (idx >= 0) {
    selections.value.splice(idx, 1)
  } else {
    const svc = getService(id)
    // Default to monthly if no onetime price, else onetime
    const billing = svc?.priceOnetime > 0 ? 'onetime' : 'monthly'
    selections.value.push({ id, billing })
  }
}

const setBilling = (id, billing) => {
  const item = selections.value.find(s => s.id === id)
  if (item) item.billing = billing
}

const onetimeTotal = computed(() =>
  selections.value
    .filter(s => s.billing === 'onetime')
    .reduce((sum, s) => sum + (getService(s.id)?.priceOnetime ?? 0), 0)
)

const monthlyTotal = computed(() =>
  selections.value
    .filter(s => s.billing === 'monthly')
    .reduce((sum, s) => sum + (getService(s.id)?.priceMonthly ?? 0), 0)
)

const orderTotal = computed(() => {
  const parts = []
  if (onetimeTotal.value > 0) parts.push(`€${onetimeTotal.value} one-time`)
  if (monthlyTotal.value > 0) parts.push(`€${monthlyTotal.value}/mo`)
  return parts.join(' + ') || '—'
})

const isStepValid = computed(() => {
  switch (currentStep.value) {
    case 1: return selections.value.length > 0
    case 2: return formData.value.fullName !== '' && formData.value.email !== ''
    case 3: return true
    default: return false
  }
})

const nextStep = () => { if (isStepValid.value && currentStep.value < totalSteps) currentStep.value++ }
const previousStep = () => { if (currentStep.value > 1) currentStep.value-- }

const goToPayment = () => {
  sessionStorage.setItem('addonOrderData', JSON.stringify({
    selections: selections.value,
    ...formData.value,
    onetimeTotal: onetimeTotal.value,
    monthlyTotal: monthlyTotal.value,
    total: onetimeTotal.value + monthlyTotal.value,
  }))
  navigateTo('/payment')
}

const siteUrl = useRuntimeConfig().public?.siteUrl
useSeoMeta({
  title: 'Add-on Services | SiteSynth',
  description: 'Subscribe to SEO, hosting, analytics, maintenance and more — no website build required.',
  ogImage: `${siteUrl}/assets/shareimage.png`,
})
</script>
