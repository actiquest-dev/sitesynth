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
          Enterprise · Custom Pricing
        </span>
        <span class="text-xs text-[#888]">Complex projects, SaaS & custom solutions</span>
      </div>

      <!-- Booking screen (shown after form is submitted) -->
      <div v-if="submitted" class="border border-[#2a2a2a]" style="background: #161616;">
        <div class="h-11 border-b border-[#2a2a2a] flex items-center px-6" style="background: #1a1a1a;">
          <span class="text-sm text-white font-medium">Book a Discovery Call</span>
        </div>
        <div class="px-10 py-8 max-w-3xl mx-auto w-full">
          <div class="flex items-center gap-2 mb-1">
            <svg viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 text-[#8D35FF]">
              <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
            </svg>
            <h1 class="text-xl font-semibold text-white">Brief received</h1>
          </div>
          <p class="text-sm text-[#888] mb-8">Select a time that works for you and we'll review your project together.</p>

          <!-- Calendly embed -->
          <div class="border border-[#2a2a2a] overflow-hidden" style="background: #111;">
            <!-- Replace YOUR_CALENDLY_URL with actual Calendly link -->
            <iframe
              src="https://calendly.com/sitesynth/discovery"
              width="100%"
              height="600"
              frameborder="0"
              style="border: none; display: block;"
            ></iframe>
          </div>

          <div class="mt-6 pt-5 border-t border-[#1f1f1f] flex items-center justify-between">
            <p class="text-xs text-[#777]">You can also access your project status in the dashboard</p>
            <NuxtLink to="/cabinet"
              class="flex items-center gap-1.5 text-sm text-[#8D35FF] hover:text-[#a855ff] transition-colors">
              Go to dashboard
              <svg viewBox="0 0 16 16" fill="currentColor" class="w-3.5 h-3.5">
                <path d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z" />
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Form (shown while not yet submitted) -->
      <template v-else>
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
              <h1 class="text-xl font-semibold text-white mb-1">What are you building?</h1>
              <p class="text-sm text-[#888] mb-7">Complex projects that require a custom approach and dedicated team</p>
              <div class="grid grid-cols-2 gap-2">
                <label v-for="service in services" :key="service.id" class="cursor-pointer group">
                  <input type="radio" :value="service.id" v-model="formData.service" class="sr-only" />
                  <div :class="[
                    'p-4 border transition-all duration-150',
                    formData.service === service.id
                      ? 'border-[#8D35FF]/60 bg-[#8D35FF]/5'
                      : 'border-[#2a2a2a] bg-[#1a1a1a] hover:border-[#3a3a3a] hover:bg-[#1e1e1e]'
                  ]">
                    <div class="flex items-start gap-3 mb-2">
                      <img :src="service.iconSrc" :alt="service.label" class="w-5 h-5 object-contain flex-shrink-0 mt-0.5"
                        :class="formData.service === service.id ? 'opacity-80' : 'opacity-30 group-hover:opacity-50'" />
                      <span :class="['text-sm font-medium', formData.service === service.id ? 'text-white' : 'text-[#888] group-hover:text-[#888]']">
                        {{ service.label }}
                      </span>
                      <div class="ml-auto w-3.5 h-3.5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all"
                        :class="formData.service === service.id ? 'border-[#8D35FF]' : 'border-[#333]'">
                        <div v-if="formData.service === service.id" class="w-1.5 h-1.5 rounded-full bg-[#8D35FF]"></div>
                      </div>
                    </div>
                    <p class="text-xs text-[#777] pl-8">{{ service.description }}</p>
                  </div>
                </label>
              </div>
            </div>

            <!-- STEP 2: Project Requirements -->
            <div v-if="currentStep === 2">
              <h1 class="text-xl font-semibold text-white mb-1">Tell us about your project</h1>
              <p class="text-sm text-[#888] mb-7">The more detail you give, the better we can prepare for the call</p>
              <div class="space-y-4">
                <div>
                  <label class="block text-[10px] uppercase tracking-widest text-[#777] mb-1.5">Project description *</label>
                  <textarea v-model="formData.description" rows="5" required minlength="50"
                    placeholder="Describe your project: what it does, who it's for, what problems it solves, any similar products…"
                    class="w-full border px-3 py-2.5 text-sm text-white placeholder:text-[#888] focus:outline-none transition-colors resize-none"
                    style="background: #1a1a1a; border-color: #2a2a2a;"
                    @focus="e => e.target.style.borderColor = '#8D35FF'"
                    @blur="e => e.target.style.borderColor = '#2a2a2a'"></textarea>
                  <p class="mt-1 text-[11px]" :class="formData.description.length >= 50 ? 'text-[#777]' : 'text-[#8D35FF]/60'">
                    {{ formData.description.length }}/50 characters minimum
                  </p>
                </div>
                <div>
                  <label class="block text-[10px] uppercase tracking-widest text-[#777] mb-1.5">Tech stack / integrations</label>
                  <input v-model="formData.techStack" type="text"
                    placeholder="e.g. Stripe, Supabase, React, REST API…"
                    class="w-full border px-3 py-2.5 text-sm text-white placeholder:text-[#888] focus:outline-none transition-colors"
                    style="background: #1a1a1a; border-color: #2a2a2a;"
                    @focus="e => e.target.style.borderColor = '#8D35FF'"
                    @blur="e => e.target.style.borderColor = '#2a2a2a'" />
                </div>
                <div>
                  <label class="block text-[10px] uppercase tracking-widest text-[#777] mb-1.5">Target audience</label>
                  <input v-model="formData.targetAudience" type="text"
                    placeholder="e.g. B2B SaaS companies, freelancers, online shoppers…"
                    class="w-full border px-3 py-2.5 text-sm text-white placeholder:text-[#888] focus:outline-none transition-colors"
                    style="background: #1a1a1a; border-color: #2a2a2a;"
                    @focus="e => e.target.style.borderColor = '#8D35FF'"
                    @blur="e => e.target.style.borderColor = '#2a2a2a'" />
                </div>
              </div>
            </div>

            <!-- STEP 3: Budget & Timeline -->
            <div v-if="currentStep === 3">
              <h1 class="text-xl font-semibold text-white mb-1">Budget & timeline</h1>
              <p class="text-sm text-[#888] mb-7">This helps us assign the right team and plan accordingly</p>
              <div class="space-y-5">
                <div>
                  <label class="block text-[10px] uppercase tracking-widest text-[#777] mb-2">Approximate budget *</label>
                  <div class="grid grid-cols-2 gap-2">
                    <label v-for="range in budgetRanges" :key="range.value" class="cursor-pointer">
                      <input type="radio" :value="range.value" v-model="formData.budget" class="sr-only" required />
                      <div :class="[
                        'p-4 border transition-all',
                        formData.budget === range.value
                          ? 'border-[#8D35FF]/60 bg-[#8D35FF]/5'
                          : 'border-[#2a2a2a] hover:border-[#3a3a3a]'
                      ]" style="background: #1a1a1a;">
                        <p class="text-sm font-semibold text-white">{{ range.label }}</p>
                        <p class="text-[11px] text-[#777] mt-0.5">{{ range.note }}</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label class="block text-[10px] uppercase tracking-widest text-[#777] mb-2">Timeline *</label>
                  <div class="relative">
                    <select v-model="formData.timeline" required
                      class="w-full border px-4 py-2.5 pr-10 text-sm text-white appearance-none focus:outline-none transition-colors cursor-pointer"
                      style="background: #1a1a1a; border-color: #2a2a2a;"
                      @focus="e => e.target.style.borderColor = '#8D35FF'"
                      @blur="e => e.target.style.borderColor = '#2a2a2a'">
                      <option value="" disabled style="background:#1a1a1a">Select expected timeline</option>
                      <option value="1-3m" style="background:#1a1a1a">1–3 months</option>
                      <option value="3-6m" style="background:#1a1a1a">3–6 months</option>
                      <option value="6-12m" style="background:#1a1a1a">6–12 months</option>
                      <option value="flexible" style="background:#1a1a1a">Flexible / not sure yet</option>
                    </select>
                    <svg class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#777] w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M4.427 7.427l3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 7H4.604a.25.25 0 0 0-.177.427Z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- STEP 4: Features -->
            <div v-if="currentStep === 4">
              <h1 class="text-xl font-semibold text-white mb-1">Features & requirements</h1>
              <p class="text-sm text-[#888] mb-7">Select everything relevant to your project</p>
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
                </label>
              </div>
              <div class="mt-5">
                <label class="block text-[10px] uppercase tracking-widest text-[#777] mb-1.5">Custom requirements</label>
                <textarea v-model="formData.customRequirements" rows="3"
                  placeholder="Any specific technical requirements, integrations, or constraints not listed above…"
                  class="w-full border px-3 py-2.5 text-sm text-white placeholder:text-[#888] focus:outline-none transition-colors resize-none"
                  style="background: #1a1a1a; border-color: #2a2a2a;"
                  @focus="e => e.target.style.borderColor = '#8D35FF'"
                  @blur="e => e.target.style.borderColor = '#2a2a2a'"></textarea>
              </div>
            </div>

            <!-- STEP 5: Contact -->
            <div v-if="currentStep === 5">
              <h1 class="text-xl font-semibold text-white mb-1">Contact details</h1>
              <p class="text-sm text-[#888] mb-7">Our team will review your brief before the call</p>
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
                    <label class="block text-[10px] uppercase tracking-widest text-[#777] mb-1.5">Company *</label>
                    <input v-model="formData.companyName" type="text" placeholder="Acme Inc." required
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
                  <label class="block text-[10px] uppercase tracking-widest text-[#777] mb-1.5">Role / Position</label>
                  <input v-model="formData.role" type="text" placeholder="CEO, CTO, Product Manager…"
                    class="w-full border px-3 py-2.5 text-sm text-white placeholder:text-[#888] focus:outline-none transition-colors"
                    style="background: #1a1a1a; border-color: #2a2a2a;"
                    @focus="e => e.target.style.borderColor = '#8D35FF'"
                    @blur="e => e.target.style.borderColor = '#2a2a2a'" />
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

                <!-- Info note -->
                <div class="flex gap-3 p-4 border border-[#2a2a2a]" style="background: #1a1a1a;">
                  <div class="w-0.5 bg-[#8D35FF]/30 flex-shrink-0 rounded"></div>
                  <p class="text-xs text-[#777] leading-relaxed">
                    After submitting, you'll be able to book a discovery call with our team. We'll review your brief beforehand so the call is focused and productive.
                  </p>
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

            <button v-if="currentStep === totalSteps" @click="submitAndBook" :disabled="!isStepValid || submitting"
              class="flex items-center gap-2 px-6 py-2.5 text-sm font-medium transition-all disabled:opacity-25 disabled:cursor-not-allowed"
              :class="isStepValid ? 'bg-[#8D35FF] text-white hover:bg-[#7B2EF0]' : 'bg-[#333] text-[#888]'">
              <svg v-if="submitting" viewBox="0 0 16 16" fill="currentColor" class="w-3.5 h-3.5 animate-spin">
                <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Z" opacity=".3"/>
                <path d="M8 1.5A6.5 6.5 0 0 1 14.5 8a.75.75 0 0 0 1.5 0A8 8 0 0 0 8 0a.75.75 0 0 0 0 1.5Z"/>
              </svg>
              {{ submitting ? 'Submitting…' : 'Submit & Book a Call' }}
              <svg v-if="!submitting" viewBox="0 0 16 16" fill="currentColor" class="w-3.5 h-3.5">
                <path d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z" />
              </svg>
            </button>
          </div>

        </div>
      </template>

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
  { id: 2, title: 'Requirements' },
  { id: 3, title: 'Budget' },
  { id: 4, title: 'Features' },
  { id: 5, title: 'Contact' },
]

const currentStep = ref(1)
const totalSteps = steps.length
const submitted = ref(false)
const submitting = ref(false)

const formData = ref({
  tier: 'enterprise',
  service: '',
  description: '', techStack: '', targetAudience: '',
  budget: '', timeline: '',
  selectedFeatures: [], customRequirements: '',
  fullName: '', email: '', phone: '', companyName: '', role: '',
  contactMethod: 'email',
})

const services = [
  { id: 'saas',        label: 'SaaS / Web App',        iconSrc: '/assets/icons/code.svg',          description: 'Multi-tenant apps, dashboards, portals' },
  { id: 'ecommerce-l', label: 'E-commerce (Large)',     iconSrc: '/assets/icons/box.svg',           description: 'Complex shops, custom checkout, ERP integration' },
  { id: 'corporate-l', label: 'Corporate (Large)',      iconSrc: '/assets/icons/global.svg',        description: 'Multi-region, multi-language, high-traffic sites' },
  { id: 'custom',      label: 'Custom',                 iconSrc: '/assets/icons/setting-2.svg',     description: 'Unique project that doesn\'t fit standard categories' },
]

const budgetRanges = [
  { value: '2k-5k',  label: '€2,000 – €5,000',   note: 'Lean MVP or focused feature' },
  { value: '5k-10k', label: '€5,000 – €10,000',   note: 'Full product launch' },
  { value: '10k-25k',label: '€10,000 – €25,000',  note: 'Complex platform' },
  { value: '25k+',   label: '€25,000+',            note: 'Enterprise scale' },
]

const features = [
  { id: 'auth',       label: 'User Authentication',    description: 'Sign up, login, OAuth, role-based access' },
  { id: 'payments',   label: 'Payment Integration',    description: 'Stripe, subscriptions, invoicing' },
  { id: 'cms',        label: 'CMS / Content Layer',    description: 'Headless CMS, content editing workflow' },
  { id: 'api',        label: 'REST / GraphQL API',     description: 'Custom backend API development' },
  { id: 'analytics',  label: 'Analytics Dashboard',   description: 'Custom reporting and data visualisation' },
  { id: 'i18n',       label: 'Multi-language',         description: 'Internationalisation and localisation' },
  { id: 'mobile',     label: 'Mobile App',             description: 'iOS/Android companion app' },
  { id: 'devops',     label: 'DevOps / Infrastructure',description: 'CI/CD, cloud setup, monitoring' },
]

const isFeatureSelected = (id) => formData.value.selectedFeatures.includes(id)

const isStepValid = computed(() => {
  switch (currentStep.value) {
    case 1: return formData.value.service !== ''
    case 2: return formData.value.description.length >= 50
    case 3: return formData.value.budget !== '' && formData.value.timeline !== ''
    case 4: return true
    case 5: return formData.value.fullName !== '' && formData.value.email !== '' && formData.value.companyName !== ''
    default: return false
  }
})

const nextStep = () => { if (isStepValid.value && currentStep.value < totalSteps) currentStep.value++ }
const previousStep = () => { if (currentStep.value > 1) currentStep.value-- }

const submitAndBook = async () => {
  if (!isStepValid.value) return
  submitting.value = true
  try {
    // Save brief to sessionStorage for reference
    sessionStorage.setItem('enterpriseBrief', JSON.stringify(formData.value))
    // Small delay for UX
    await new Promise(r => setTimeout(r, 600))
    submitted.value = true
  } finally {
    submitting.value = false
  }
}

const siteUrl = useRuntimeConfig().public?.siteUrl
useSeoMeta({
  title: 'Enterprise Project | SiteSynth',
  description: 'Custom pricing for complex projects. SaaS, web apps, and large-scale solutions.',
  ogImage: `${siteUrl}/assets/shareimage.png`,
})
</script>
