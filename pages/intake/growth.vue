<template>
  <HeaderSection />

  <section
    class="relative min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
    style="background-image: url('/assets/new-assets/test/sitesynth-animated-gradient-v2.svg'); background-color: #161616; padding-top: 128px;"
  >
    <GlowEffect />
    <ParticleEffect />

    <div class="relative w-full max-w-[1248px] mx-auto px-6 py-10">

      <!-- Tier badge -->
      <div class="flex items-center gap-3 mb-6">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium border border-[#8D35FF]/30 text-[#8D35FF]" style="background: #8D35FF18;">
          Growth Plan · €900
        </span>
        <span class="text-xs text-[#888]">Multi-page websites & integrations</span>
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
          <span class="text-xs text-[#777] tabular-nums">{{ currentStep }} of {{ totalSteps }}</span>
        </div>

        <!-- Content -->
        <div class="px-10 py-8 max-w-3xl mx-auto w-full">

          <!-- STEP 1: Service -->
          <div v-if="currentStep === 1">
            <h1 class="text-xl font-semibold text-white mb-1">What do you need built?</h1>
            <p class="text-sm text-[#888] mb-7">Multi-page projects with advanced features and integrations</p>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
              <label v-for="service in services" :key="service.id" class="cursor-pointer group">
                <input type="radio" :value="service.id" v-model="formData.service" class="sr-only" />
                <div :class="[
                  'p-4 border transition-all duration-150 flex items-center gap-3',
                  formData.service === service.id
                    ? 'border-[#8D35FF]/60 bg-[#8D35FF]/5'
                    : 'border-[#2a2a2a] bg-[#1a1a1a] hover:border-[#3a3a3a] hover:bg-[#1e1e1e]'
                ]">
                  <img :src="service.iconSrc" :alt="service.label" class="w-5 h-5 object-contain flex-shrink-0"
                    :class="formData.service === service.id ? 'opacity-80' : 'opacity-30 group-hover:opacity-50'" />
                  <span :class="['text-sm', formData.service === service.id ? 'text-white' : 'text-[#888] group-hover:text-[#888]']">
                    {{ service.label }}
                  </span>
                  <div class="ml-auto w-3.5 h-3.5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all"
                    :class="formData.service === service.id ? 'border-[#8D35FF]' : 'border-[#333]'">
                    <div v-if="formData.service === service.id" class="w-1.5 h-1.5 rounded-full bg-[#8D35FF]"></div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <!-- STEP 2: Scope -->
          <div v-if="currentStep === 2">
            <h1 class="text-xl font-semibold text-white mb-1">Project scope</h1>
            <p class="text-sm text-[#888] mb-7">Help us understand the size and complexity of your project</p>
            <div class="space-y-5">
              <div>
                <label class="block text-[10px] uppercase tracking-widest text-[#777] mb-2">Complexity *</label>
                <div class="relative">
                  <select v-model="formData.complexity" required
                    class="w-full border px-4 py-2.5 pr-10 text-sm text-white appearance-none focus:outline-none transition-colors cursor-pointer"
                    style="background: #1a1a1a; border-color: #2a2a2a;"
                    @focus="e => e.target.style.borderColor = '#8D35FF'"
                    @blur="e => e.target.style.borderColor = '#2a2a2a'">
                    <option value="" disabled style="background:#1a1a1a">Select complexity</option>
                    <option value="simple" style="background:#1a1a1a">Simple — 2–3 pages, standard layout</option>
                    <option value="medium" style="background:#1a1a1a">Medium — up to 5 pages, CMS or integrations</option>
                    <option value="complex" style="background:#1a1a1a">Complex — 5+ pages, advanced features</option>
                  </select>
                  <svg class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#777] w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M4.427 7.427l3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 7H4.604a.25.25 0 0 0-.177.427Z" />
                  </svg>
                </div>
              </div>


              <div v-if="formData.complexity" class="flex gap-3 p-4 border border-[#2a2a2a]" style="background: #1a1a1a;">
                <div class="w-0.5 bg-[#8D35FF]/30 flex-shrink-0 rounded"></div>
                <p class="text-xs text-[#777] leading-relaxed">
                  <span v-if="formData.complexity === 'simple'">2–3 pages, standard layout, basic integrations. Delivery: 5–7 days.</span>
                  <span v-else-if="formData.complexity === 'medium'">Up to 5 pages, CMS integration (Decap), contact forms. Delivery: 7–14 days.</span>
                  <span v-else>5+ pages, advanced features, custom integrations. Delivery: 14–21 days.</span>
                </p>
              </div>

              <!-- Extra pages (complex only) -->
              <div v-if="formData.complexity === 'complex'">
                <label class="block text-[10px] uppercase tracking-widest text-[#777] mb-2">Additional pages beyond 5</label>
                <div class="flex items-center gap-3">
                  <div class="relative flex-1">
                    <input
                      v-model.number="formData.extraPages"
                      type="number" min="0" placeholder="0"
                      class="w-full border px-4 py-2.5 text-sm text-white placeholder:text-[#888] focus:outline-none transition-colors"
                      style="background: #1a1a1a; border-color: #2a2a2a;"
                      @focus="e => e.target.style.borderColor = '#8D35FF'"
                      @blur="e => { if (e.target.value < 0) formData.extraPages = 0; e.target.style.borderColor = '#2a2a2a' }"
                    />
                  </div>
                  <div class="text-sm text-[#777] whitespace-nowrap">
                    × €85 =
                    <span class="text-[#8D35FF] font-medium">€{{ (Math.max(0, formData.extraPages || 0) * 85) }}</span>
                  </div>
                </div>
                <p class="text-xs text-[#666] mt-1.5">Each additional page beyond 5 is billed at €85</p>
              </div>
            </div>
          </div>

          <!-- STEP 3: Features -->
          <div v-if="currentStep === 3">
            <h1 class="text-xl font-semibold text-white mb-1">Select features</h1>
            <p class="text-sm text-[#888] mb-7">Included items are free. Add-ons are billed once.</p>
            <div class="space-y-1.5">
              <label v-for="feature in features" :key="feature.id" :class="[
                'flex items-center gap-4 px-4 py-3 border cursor-pointer transition-all',
                isFeatureSelected(feature.id) ? 'border-[#8D35FF]/40 bg-[#8D35FF]/5' : 'border-[#2a2a2a] hover:border-[#2a2a2a]'
              ]" style="background: #1a1a1a;">
                <input type="checkbox" :value="feature.id" v-model="formData.selectedFeatures" class="sr-only" />
                <span :class="[
                  'w-3.5 h-3.5 flex-shrink-0 border flex items-center justify-center transition-all',
                  isFeatureSelected(feature.id) ? 'border-[#8D35FF] bg-[#8D35FF]' : 'border-[#333]'
                ]">
                  <svg v-if="isFeatureSelected(feature.id)" viewBox="0 0 16 16" fill="currentColor" class="w-2.5 h-2.5 text-white">
                    <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
                  </svg>
                </span>
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-white">{{ feature.label }}</p>
                  <p class="text-xs text-[#777] mt-0.5">{{ feature.description }}</p>
                </div>
                <span :class="['text-xs font-medium', feature.price === 'Included' ? 'text-[#777]' : 'text-[#8D35FF]']">{{ feature.price }}</span>
              </label>
            </div>

            <!-- Rush delivery -->
            <label :class="[
              'mt-2 flex items-center gap-4 px-4 py-3 border cursor-pointer transition-all',
              formData.rushFee ? 'border-[#8D35FF]/40 bg-[#8D35FF]/5' : 'border-[#2a2a2a] hover:border-[#2a2a2a]'
            ]" style="background: #1a1a1a;">
              <input type="checkbox" v-model="formData.rushFee" class="sr-only" />
              <span :class="[
                'w-3.5 h-3.5 flex-shrink-0 border flex items-center justify-center transition-all',
                formData.rushFee ? 'border-[#8D35FF] bg-[#8D35FF]' : 'border-[#333]'
              ]">
                <svg v-if="formData.rushFee" viewBox="0 0 16 16" fill="currentColor" class="w-2.5 h-2.5 text-white">
                  <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
                </svg>
              </span>
              <div class="flex-1">
                <p class="text-sm text-white">Rush delivery</p>
                <p class="text-xs text-[#777] mt-0.5">Priority queue, expedited turnaround</p>
              </div>
              <span class="text-xs text-[#8D35FF]">+20%</span>
            </label>

            <div class="mt-5 flex items-center justify-between pt-4 border-t border-[#1f1f1f]">
              <span class="text-xs text-[#777]">Add-on total</span>
              <span class="text-sm text-white tabular-nums">+€{{ addOnTotal }}</span>
            </div>
          </div>

          <!-- STEP 4: Contact -->
          <div v-if="currentStep === 4">
            <h1 class="text-xl font-semibold text-white mb-1">Your details</h1>
            <p class="text-sm text-[#888] mb-7">We'll send your invoice and project updates here</p>
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[10px] uppercase tracking-widest text-[#777] mb-1.5">Full name *</label>
                  <input v-model="formData.fullName" type="text" placeholder="Jane Smith" required
                    class="w-full border px-3 py-2.5 text-sm text-white placeholder:text-[#888] focus:outline-none transition-colors"
                    style="background: #1a1a1a; border-color: #2a2a2a;"
                    @focus="e => e.target.style.borderColor = '#8D35FF'"
                    @blur="e => e.target.style.borderColor = '#2a2a2a'" />
                </div>
                <div>
                  <label class="block text-[10px] uppercase tracking-widest text-[#777] mb-1.5">Company</label>
                  <input v-model="formData.companyName" type="text" placeholder="Acme Inc."
                    class="w-full border px-3 py-2.5 text-sm text-white placeholder:text-[#888] focus:outline-none transition-colors"
                    style="background: #1a1a1a; border-color: #2a2a2a;"
                    @focus="e => e.target.style.borderColor = '#8D35FF'"
                    @blur="e => e.target.style.borderColor = '#2a2a2a'" />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[10px] uppercase tracking-widest text-[#777] mb-1.5">Email *</label>
                  <input v-model="formData.email" type="email" placeholder="jane@example.com" required
                    class="w-full border px-3 py-2.5 text-sm text-white placeholder:text-[#888] focus:outline-none transition-colors"
                    style="background: #1a1a1a; border-color: #2a2a2a;"
                    @focus="e => e.target.style.borderColor = '#8D35FF'"
                    @blur="e => e.target.style.borderColor = '#2a2a2a'" />
                </div>
                <div>
                  <label class="block text-[10px] uppercase tracking-widest text-[#777] mb-1.5">Phone</label>
                  <input v-model="formData.phone" type="tel" placeholder="+32 470 000 000"
                    class="w-full border px-3 py-2.5 text-sm text-white placeholder:text-[#888] focus:outline-none transition-colors"
                    style="background: #1a1a1a; border-color: #2a2a2a;"
                    @focus="e => e.target.style.borderColor = '#8D35FF'"
                    @blur="e => e.target.style.borderColor = '#2a2a2a'" />
                </div>
              </div>
              <div>
                <label class="block text-[10px] uppercase tracking-widest text-[#777] mb-1.5">Project description *</label>
                <textarea v-model="formData.description" rows="4" required minlength="10"
                  placeholder="Tell us about your goals, audience, and any references…"
                  class="w-full border px-3 py-2.5 text-sm text-white placeholder:text-[#888] focus:outline-none transition-colors resize-none"
                  style="background: #1a1a1a; border-color: #2a2a2a;"
                  @focus="e => e.target.style.borderColor = '#8D35FF'"
                  @blur="e => e.target.style.borderColor = '#2a2a2a'"></textarea>
              </div>
              <div>
                <label class="block text-[10px] uppercase tracking-widest text-[#777] mb-2">Preferred contact *</label>
                <div class="grid grid-cols-3 gap-2">
                  <label v-for="m in ['email','phone','both']" :key="m" class="cursor-pointer">
                    <input type="radio" :value="m" v-model="formData.contactMethod" class="sr-only" required />
                    <div :class="[
                      'py-2.5 border text-center text-xs capitalize transition-all',
                      formData.contactMethod === m
                        ? 'border-[#8D35FF]/60 bg-[#8D35FF]/5 text-white'
                        : 'border-[#2a2a2a] text-[#777] hover:border-[#3a3a3a] hover:text-[#777]'
                    ]" style="background: #1a1a1a;">{{ m }}</div>
                  </label>
                </div>
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
                <span class="text-xs text-[#777]">Subscribe to updates and insights from SiteSynth</span>
              </label>
            </div>
          </div>

          <!-- STEP 5: Summary -->
          <div v-if="currentStep === 5">
            <h1 class="text-xl font-semibold text-white mb-1">Order summary</h1>
            <p class="text-sm text-[#888] mb-7">Review your project before proceeding to payment</p>

            <div class="space-y-3">
              <div class="border border-[#2a2a2a]" style="background: #1a1a1a;">
                <div class="px-4 py-2.5 border-b border-[#2a2a2a]">
                  <p class="text-[10px] uppercase tracking-widest text-[#777]">Project</p>
                </div>
                <div class="px-4 py-3 space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-[#777]">Service</span>
                    <span class="text-white capitalize">{{ services.find(s => s.id === formData.service)?.label || '—' }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-[#777]">Complexity</span>
                    <span class="text-white capitalize">{{ formData.complexity || '—' }}</span>
                  </div>

                  <div class="flex justify-between text-sm">
                    <span class="text-[#777]">Name</span>
                    <span class="text-white">{{ formData.fullName || '—' }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-[#777]">Email</span>
                    <span class="text-white">{{ formData.email || '—' }}</span>
                  </div>
                </div>
              </div>

              <div class="border border-[#2a2a2a]" style="background: #1a1a1a;">
                <div class="px-4 py-2.5 border-b border-[#2a2a2a] flex items-center gap-2">
                  <div class="w-0.5 h-3.5 bg-[#8D35FF] rounded"></div>
                  <p class="text-[10px] uppercase tracking-widest text-[#777]">Pricing</p>
                </div>
                <div class="px-4 py-3 space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-[#777]">Growth Plan</span>
                    <span class="text-white">€900</span>
                  </div>
                  <div v-if="addOnTotal > 0" class="flex justify-between text-sm">
                    <span class="text-[#777]">Add-ons</span>
                    <span class="text-white">+€{{ addOnTotal }}</span>
                  </div>
                  <div v-if="extraPagesTotal > 0" class="flex justify-between text-sm">
                    <span class="text-[#777]">Extra pages ({{ formData.extraPages }} × €85)</span>
                    <span class="text-white">+€{{ extraPagesTotal }}</span>
                  </div>
                  <div v-if="formData.rushFee" class="flex justify-between text-sm">
                    <span class="text-[#777]">Rush fee (+20%)</span>
                    <span class="text-white">+€{{ Math.round((900 + addOnTotal + extraPagesTotal) * 0.2) }}</span>
                  </div>
                  <div class="pt-2 border-t border-[#2a2a2a] flex justify-between">
                    <span class="text-sm text-white font-medium">Total</span>
                    <span class="text-sm font-semibold text-[#8D35FF]">€{{ calculateTotal() }}</span>
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
  { id: 1, title: 'Service' },
  { id: 2, title: 'Scope' },
  { id: 3, title: 'Features' },
  { id: 4, title: 'Contact' },
  { id: 5, title: 'Summary' },
]

const currentStep = ref(1)
const totalSteps = steps.length

const formData = ref({
  tier: 'growth',
  service: '',
  complexity: '', extraPages: 0,
  selectedFeatures: [], rushFee: false,
  fullName: '', email: '', phone: '', companyName: '',
  description: '', contactMethod: 'email', newsletter: false,
})

const services = [
  { id: 'ecommerce', label: 'E-commerce',           iconSrc: '/assets/icons/box.svg' },
  { id: 'corporate', label: 'Corporate / Business', iconSrc: '/assets/icons/global.svg' },
  { id: 'mobile',    label: 'Mobile Adaptation',    iconSrc: '/assets/icons/monitor-mobbile.svg' },
  { id: 'redesign',  label: 'Redesign',             iconSrc: '/assets/icons/like-shapes.svg' },
  { id: 'blog',      label: 'Blog / Content',       iconSrc: '/assets/icons/book.svg' },
]

const features = [
  { id: 'analytics',  label: 'Plausible Analytics',     description: 'Privacy-focused analytics, no cookies',    price: 'Included' },
  { id: 'deploy',     label: 'Vercel Deploy',            description: 'Automatic CI/CD deployments',              price: 'Included' },
  { id: 'cms',        label: 'Decap CMS',                description: 'Git-based content management system',      price: 'Included' },
  { id: 'seo',        label: 'SEO Optimization',         description: 'Meta, structured data, performance audit', price: '+€75' },
  { id: 'email',      label: 'Email Setup',              description: 'Custom domain email configuration',        price: '+€75' },
  { id: 'cloudflare', label: 'Cloudflare Email Routing', description: 'Free email forwarding via Cloudflare',     price: 'Included' },
]


const isFeatureSelected = (id) => formData.value.selectedFeatures.includes(id)

const addOnTotal = computed(() =>
  formData.value.selectedFeatures.reduce((sum, id) => {
    const f = features.find(f => f.id === id)
    if (!f || !f.price.includes('€')) return sum
    return sum + parseInt(f.price.match(/\d+/)?.[0] || 0)
  }, 0)
)

const extraPagesTotal = computed(() =>
  formData.value.complexity === 'complex' ? Math.max(0, formData.value.extraPages || 0) * 85 : 0
)

const calculateTotal = () => {
  const base = 900
  const total = base + addOnTotal.value + extraPagesTotal.value
  return formData.value.rushFee ? Math.round(total * 1.2) : total
}

const isStepValid = computed(() => {
  switch (currentStep.value) {
    case 1: return formData.value.service !== ''
    case 2: return formData.value.complexity !== ''
    case 3: return true
    case 4: return formData.value.fullName !== '' && formData.value.email !== '' && formData.value.description.length >= 10
    case 5: return true
    default: return false
  }
})

const nextStep = () => { if (isStepValid.value && currentStep.value < totalSteps) currentStep.value++ }
const previousStep = () => { if (currentStep.value > 1) currentStep.value-- }

const goToPayment = () => {
  sessionStorage.setItem('intakeFormData', JSON.stringify({
    ...formData.value,
    budget: 'growth',
    basePrice: 900,
    extraPagesTotal: extraPagesTotal.value,
    total: calculateTotal(),
  }))
  navigateTo('/payment')
}

const siteUrl = useRuntimeConfig().public?.siteUrl
useSeoMeta({
  title: 'Growth Project | SiteSynth',
  description: 'Multi-page website from €900. E-commerce, corporate sites, and more.',
  ogImage: `${siteUrl}/assets/shareimage.png`,
})
</script>
