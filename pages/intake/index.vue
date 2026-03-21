<template>
  <HeaderSection />

  <section
    class="relative min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
    style="background-image: url('/assets/new-assets/test/sitesynth-animated-gradient-v2.svg'); background-color: #161616; padding-top: 128px; color: #999999;"
  >
    <GlowEffect />
    <ParticleEffect />

    <div class="relative w-full max-w-[1248px] mx-auto px-6 py-10">

      <!-- ── Step progress header ── -->
      <div class="mb-8">
        <!-- Step numbers row -->
        <div class="flex items-center justify-between mb-4 relative">
          <!-- connecting line -->
          <div class="absolute left-4 right-4 top-4 h-px bg-[#222] -z-0"></div>
          <!-- filled line -->
          <div
            class="absolute left-4 top-4 h-px bg-[#8D35FF] -z-0 transition-all duration-500"
            :style="{ width: ((currentStep - 1) / (totalSteps - 1) * 100) + '%' }"
          ></div>

          <div
            v-for="(step, index) in steps"
            :key="step.id"
            class="flex flex-col items-center gap-2 z-10"
          >
            <!-- circle -->
            <div :class="[
              'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 border',
              currentStep > index + 1
                ? 'bg-[#8D35FF] border-[#8D35FF] text-white'
                : currentStep === index + 1
                  ? 'bg-[#161616] border-[#8D35FF] text-[#8D35FF]'
                  : 'bg-[#161616] border-[#2a2a2a] text-[#999999]'
            ]">
              <!-- check icon for completed -->
              <svg v-if="currentStep > index + 1" viewBox="0 0 16 16" fill="currentColor" class="w-3.5 h-3.5">
                <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
              </svg>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <!-- label -->
            <span :class="[
              'text-[11px] transition-colors',
              currentStep === index + 1 ? 'text-white' : currentStep > index + 1 ? 'text-[#8D35FF]/60' : 'text-[#999999]'
            ]">{{ step.title }}</span>
          </div>
        </div>
      </div>

      <!-- ── Form card ── -->
      <div class="border border-[#2a2a2a]" style="background: #161616;">

        <!-- Card topbar -->
        <div class="h-11 border-b border-[#2a2a2a] flex items-center justify-between px-6" style="background: #1a1a1a;">
          <span class="text-sm text-white font-medium">{{ steps[currentStep - 1]?.title }}</span>
          <span class="text-xs text-[#999999] tabular-nums">{{ currentStep }} of {{ totalSteps }}</span>
        </div>

        <!-- Form content -->
        <div class="px-10 py-8 max-w-3xl mx-auto w-full">

          <!-- ── STEP 1: Service ── -->
          <div v-if="currentStep === 1">
            <h1 class="text-xl font-semibold text-white mb-1">What do you need built?</h1>
            <p class="text-sm text-[#999999] mb-7">Select the service that best fits your project</p>

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
                  <span class="text-sm" :style="{ color: formData.service === service.id ? '#ffffff' : '#999999' }">
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

          <!-- ── STEP 2: Complexity ── -->
          <div v-if="currentStep === 2">
            <h1 class="text-xl font-semibold text-white mb-1">Project complexity</h1>
            <p class="text-sm text-[#999999] mb-7">How large is the scope of your project?</p>

            <div class="space-y-5">
              <div>
                <label class="block text-[10px] uppercase tracking-widest text-[#999999] mb-2">Complexity *</label>
                <div class="relative">
                  <select v-model="formData.complexity" required
                    class="w-full border px-4 py-2.5 pr-10 text-sm appearance-none focus:outline-none transition-colors cursor-pointer"
                    style="background: #1a1a1a; border-color: #2a2a2a;"
                    :style="{ color: formData.complexity ? 'white' : '#999999' }"
                    @focus="e => e.target.style.borderColor = '#8D35FF'"
                    @blur="e => e.target.style.borderColor = '#2a2a2a'">
                    <option value="" disabled style="background:#1a1a1a">Select complexity</option>
                    <option value="simple" style="background:#1a1a1a">Simple — minimal features, quick turnaround</option>
                    <option value="medium" style="background:#1a1a1a">Medium — moderate scope and integrations</option>
                    <option value="complex" style="background:#1a1a1a">Complex — advanced features, custom logic</option>
                  </select>
                  <svg class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M4.427 7.427l3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 7H4.604a.25.25 0 0 0-.177.427Z" />
                  </svg>
                </div>
              </div>

              <div v-if="formData.complexity">
                <label class="block text-[10px] uppercase tracking-widest text-[#999999] mb-2">Package *</label>
                <div class="grid grid-cols-3 gap-2">
                  <label v-for="pkg in availablePackages" :key="pkg" class="cursor-pointer">
                    <input type="radio" :value="pkg" v-model="formData.packageLevel" class="sr-only" />
                    <div :class="[
                      'py-2.5 border text-center text-sm transition-all',
                      formData.packageLevel === pkg
                        ? 'border-[#8D35FF]/60 bg-[#8D35FF]/5 text-white'
                        : 'border-[#2a2a2a] text-[#999999] hover:border-[#3a3a3a] hover:text-[#999999]'
                    ]" style="background: #1a1a1a;">{{ pkg }}</div>
                  </label>
                </div>
              </div>

              <div v-if="formData.complexity" class="flex gap-3 p-4 border border-[#222]" style="background: #1a1a1a;">
                <div class="w-0.5 bg-[#8D35FF]/30 flex-shrink-0 rounded"></div>
                <p class="text-xs text-[#999999] leading-relaxed">
                  <span v-if="formData.complexity === 'simple'">Landing pages, portfolios, small business sites. Delivery: 3–5 days.</span>
                  <span v-else-if="formData.complexity === 'medium'">E-commerce, blogs, sites with integrations. Delivery: 7–14 days.</span>
                  <span v-else>Custom architecture and advanced solutions. Timeline discussed per project.</span>
                </p>
              </div>
            </div>
          </div>

          <!-- ── STEP 3: Features ── -->
          <div v-if="currentStep === 3">
            <h1 class="text-xl font-semibold text-white mb-1">Select features</h1>
            <p class="text-sm text-[#999999] mb-7">Add-ons for your project. "Included" items are free.</p>

            <div class="space-y-1.5">
              <label v-for="feature in features" :key="feature.id" :class="[
                'flex items-center gap-4 px-4 py-3 border cursor-pointer transition-all',
                isFeatureSelected(feature.id) ? 'border-[#8D35FF]/40 bg-[#8D35FF]/5' : 'border-[#222] hover:border-[#2a2a2a]'
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
                  <p class="text-xs text-[#999999] mt-0.5">{{ feature.description }}</p>
                </div>
                <span :class="['text-xs font-medium', feature.price === 'Included' ? 'text-[#999999]' : 'text-[#8D35FF]']">{{ feature.price }}</span>
              </label>
            </div>

            <div class="mt-5 flex items-center justify-between pt-4 border-t border-[#1f1f1f]">
              <span class="text-xs text-[#999999]">Add-on total</span>
              <span class="text-sm text-white tabular-nums">+€{{ addOnTotal }}</span>
            </div>
          </div>

          <!-- ── STEP 4: Budget ── -->
          <div v-if="currentStep === 4">
            <h1 class="text-xl font-semibold text-white mb-1">Budget & timeline</h1>
            <p class="text-sm text-[#999999] mb-5">Choose a plan that works for you</p>

            <!-- Custom quote hint for complex project types -->
            <div v-if="['saas', 'custom'].includes(formData.service)" class="flex items-start gap-3 px-4 py-3 border border-[#8D35FF]/20 bg-[#8D35FF]/5 mb-6">
              <svg viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 text-[#8D35FF] flex-shrink-0 mt-0.5">
                <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm6.5-.25A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/>
              </svg>
              <p class="text-sm text-[#999999]">This project type requires a <span class="text-white">custom quote</span>. Our team will reach out with tailored pricing after reviewing your details.</p>
            </div>

            <div class="space-y-5">
              <div>
                <label class="block text-[10px] uppercase tracking-widest text-[#999999] mb-2">Budget *</label>
                <div class="grid grid-cols-3 gap-2">
                  <label v-for="plan in availableBudgetPlans" :key="plan.value" class="cursor-pointer">
                    <input type="radio" :value="plan.value" v-model="formData.budget" class="sr-only" required />
                    <div :class="[
                      'p-4 border transition-all',
                      formData.budget === plan.value ? 'border-[#8D35FF]/60 bg-[#8D35FF]/5' : 'border-[#2a2a2a] hover:border-[#3a3a3a]'
                    ]" style="background: #1a1a1a;">
                      <p :class="['text-[10px] uppercase tracking-wider mb-1', formData.budget === plan.value ? 'text-[#8D35FF]/70' : 'text-[#999999]']">{{ plan.label }}</p>
                      <p class="text-base font-semibold text-white">{{ plan.price }}</p>
                      <p class="text-[11px] text-[#999999] mt-1">{{ plan.note }}</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label class="block text-[10px] uppercase tracking-widest text-[#999999] mb-2">Timeline *</label>
                <div class="relative">
                  <select v-model="formData.timeline" required
                    class="w-full border px-4 py-2.5 pr-10 text-sm appearance-none focus:outline-none transition-colors cursor-pointer"
                    style="background: #1a1a1a; border-color: #2a2a2a;"
                    :style="{ color: formData.timeline ? 'white' : '#999999' }"
                    @focus="e => e.target.style.borderColor = '#8D35FF'"
                    @blur="e => e.target.style.borderColor = '#2a2a2a'">
                    <option value="" disabled style="background:#1a1a1a">Select timeline</option>
                    <option v-for="plan in availableBudgetPlans" :key="plan.timeline" :value="plan.timeline" style="background:#1a1a1a">{{ plan.timelineLabel }}</option>
                  </select>
                  <svg class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M4.427 7.427l3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 7H4.604a.25.25 0 0 0-.177.427Z" />
                  </svg>
                </div>
              </div>

              <label :class="[
                'flex items-center gap-4 px-4 py-3 border cursor-pointer transition-all',
                formData.rushFee ? 'border-[#8D35FF]/40 bg-[#8D35FF]/5' : 'border-[#222] hover:border-[#2a2a2a]'
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
                  <p class="text-xs text-[#999999] mt-0.5">Priority queue, expedited turnaround</p>
                </div>
                <span class="text-xs text-[#8D35FF]">+20%</span>
              </label>

              <!-- Summary -->
              <div class="border border-[#222]" style="background: #1a1a1a;">
                <div class="px-4 py-2.5 border-b border-[#222] flex items-center gap-2">
                  <div class="w-0.5 h-3.5 bg-[#8D35FF] rounded"></div>
                  <p class="text-[10px] uppercase tracking-widest text-[#999999]">Summary</p>
                </div>
                <div class="px-4 py-3 space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-[#999999]">Base</span>
                    <span class="text-white">{{ formData.budget === 'starter' ? '€500' : formData.budget === 'growth' ? '€900' : formData.budget ? 'Custom' : '—' }}</span>
                  </div>
                  <div v-if="addOnTotal > 0" class="flex justify-between text-sm">
                    <span class="text-[#999999]">Add-ons</span>
                    <span class="text-white">+€{{ addOnTotal }}</span>
                  </div>
                  <div v-if="formData.rushFee" class="flex justify-between text-sm">
                    <span class="text-[#999999]">Rush fee</span>
                    <span class="text-white">+20%</span>
                  </div>
                  <div class="pt-2 border-t border-[#222] flex justify-between">
                    <span class="text-sm text-white font-medium">Total</span>
                    <span class="text-sm font-semibold text-[#8D35FF]">{{ formData.budget ? '€' + calculatePrice() : '—' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ── STEP 5: Contact ── -->
          <div v-if="currentStep === 5">
            <h1 class="text-xl font-semibold text-white mb-1">Contact details</h1>
            <p class="text-sm text-[#999999] mb-7">We'll use this to send your quote and updates</p>

            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[10px] uppercase tracking-widest text-[#999999] mb-1.5">Full name *</label>
                  <input v-model="formData.fullName" type="text" placeholder="Jane Smith" required
                    class="w-full border px-3 py-2.5 text-sm text-white placeholder:text-[#999999] focus:outline-none transition-colors"
                    style="background: #1a1a1a; border-color: #2a2a2a;"
                    @focus="e => e.target.style.borderColor = '#8D35FF'"
                    @blur="e => e.target.style.borderColor = '#2a2a2a'" />
                </div>
                <div>
                  <label class="block text-[10px] uppercase tracking-widest text-[#999999] mb-1.5">Company</label>
                  <input v-model="formData.companyName" type="text" placeholder="Acme Inc."
                    class="w-full border px-3 py-2.5 text-sm text-white placeholder:text-[#999999] focus:outline-none transition-colors"
                    style="background: #1a1a1a; border-color: #2a2a2a;"
                    @focus="e => e.target.style.borderColor = '#8D35FF'"
                    @blur="e => e.target.style.borderColor = '#2a2a2a'" />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[10px] uppercase tracking-widest text-[#999999] mb-1.5">Email *</label>
                  <input v-model="formData.email" type="email" placeholder="jane@example.com" required
                    class="w-full border px-3 py-2.5 text-sm text-white placeholder:text-[#999999] focus:outline-none transition-colors"
                    style="background: #1a1a1a; border-color: #2a2a2a;"
                    @focus="e => e.target.style.borderColor = '#8D35FF'"
                    @blur="e => e.target.style.borderColor = '#2a2a2a'" />
                </div>
                <div>
                  <label class="block text-[10px] uppercase tracking-widest text-[#999999] mb-1.5">Phone</label>
                  <input v-model="formData.phone" type="tel" placeholder="+32 470 000 000"
                    class="w-full border px-3 py-2.5 text-sm text-white placeholder:text-[#999999] focus:outline-none transition-colors"
                    style="background: #1a1a1a; border-color: #2a2a2a;"
                    @focus="e => e.target.style.borderColor = '#8D35FF'"
                    @blur="e => e.target.style.borderColor = '#2a2a2a'" />
                </div>
              </div>

              <div>
                <label class="block text-[10px] uppercase tracking-widest text-[#999999] mb-1.5">Project description *</label>
                <textarea v-model="formData.description" rows="4" required minlength="10"
                  placeholder="Tell us about your goals, audience, and any references…"
                  class="w-full border px-3 py-2.5 text-sm text-white placeholder:text-[#999999] focus:outline-none transition-colors resize-none"
                  style="background: #1a1a1a; border-color: #2a2a2a;"
                  @focus="e => e.target.style.borderColor = '#8D35FF'"
                  @blur="e => e.target.style.borderColor = '#2a2a2a'"></textarea>
              </div>

              <div>
                <label class="block text-[10px] uppercase tracking-widest text-[#999999] mb-2">Preferred contact *</label>
                <div class="grid grid-cols-3 gap-2">
                  <label v-for="m in ['email','phone','both']" :key="m" class="cursor-pointer">
                    <input type="radio" :value="m" v-model="formData.contactMethod" class="sr-only" required />
                    <div :class="[
                      'py-2.5 border text-center text-xs capitalize transition-all',
                      formData.contactMethod === m
                        ? 'border-[#8D35FF]/60 bg-[#8D35FF]/5 text-white'
                        : 'border-[#2a2a2a] text-[#999999] hover:border-[#3a3a3a] hover:text-[#999999]'
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
                <span class="text-xs text-[#999999]">Subscribe to updates and insights from SiteSynth</span>
              </label>
            </div>
          </div>

        </div>

        <!-- ── Card footer: nav buttons ── -->
        <div class="border-t border-[#2a2a2a] px-6 py-4 flex items-center justify-between" style="background: #1a1a1a;">
          <button v-if="currentStep > 1" @click="previousStep"
            class="flex items-center gap-1.5 text-sm text-[#999999] hover:text-white transition-colors">
            <svg viewBox="0 0 16 16" fill="currentColor" class="w-3.5 h-3.5">
              <path d="M9.78 12.78a.75.75 0 0 1-1.06 0L4.47 8.53a.75.75 0 0 1 0-1.06l4.25-4.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L6.06 8l3.72 3.72a.75.75 0 0 1 0 1.06Z" />
            </svg>
            Back
          </button>
          <div v-else></div>

          <button
            v-if="currentStep < totalSteps"
            @click="nextStep"
            :disabled="!isStepValid"
            class="flex items-center gap-2 px-6 py-2.5 text-sm font-medium transition-all disabled:opacity-25 disabled:cursor-not-allowed"
            :class="isStepValid ? 'bg-[#8D35FF] text-white hover:bg-[#7B2EF0]' : 'bg-[#222] text-[#999999]'"
          >
            Continue
            <svg viewBox="0 0 16 16" fill="currentColor" class="w-3.5 h-3.5">
              <path d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z" />
            </svg>
          </button>

          <button
            v-if="currentStep === totalSteps"
            @click="goToPayment"
            :disabled="!isStepValid"
            class="flex items-center gap-2 px-6 py-2.5 text-sm font-medium transition-all disabled:opacity-25 disabled:cursor-not-allowed"
            :class="isStepValid ? 'bg-[#8D35FF] text-white hover:bg-[#7B2EF0]' : 'bg-[#222] text-[#999999]'"
          >
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
// Redirect old /intake to /intake/growth (backwards compatibility)
navigateTo('/intake/growth', { redirectCode: 301 })

import { ref, computed } from "vue";
import GlowEffect from "@/components/effects/GlowEffect.vue";
import ParticleEffect from "@/components/effects/ParticleEffect.vue";

const steps = [
  { id: 1, title: 'Service' },
  { id: 2, title: 'Complexity' },
  { id: 3, title: 'Features' },
  { id: 4, title: 'Budget' },
  { id: 5, title: 'Contact' },
]

const currentStep = ref(1)
const totalSteps = steps.length

const formData = ref({
  service: '', complexity: '', packageLevel: '', selectedFeatures: [],
  budget: '', timeline: '', rushFee: false,
  fullName: '', email: '', phone: '', companyName: '',
  description: '', contactMethod: 'email', newsletter: false,
})

const services = [
  { id: 'landing',   label: 'Landing Page',        iconSrc: '/assets/icons/flash.svg' },
  { id: 'portfolio', label: 'Portfolio',            iconSrc: '/assets/icons/eye.svg' },
  { id: 'blog',      label: 'Blog / Content',       iconSrc: '/assets/icons/book.svg' },
  { id: 'ecommerce', label: 'E-commerce',           iconSrc: '/assets/icons/box.svg' },
  { id: 'mobile',    label: 'Mobile Adaptation',    iconSrc: '/assets/icons/monitor-mobbile.svg' },
  { id: 'corporate', label: 'Corporate / Business', iconSrc: '/assets/icons/global.svg' },
  { id: 'redesign',  label: 'Redesign',             iconSrc: '/assets/icons/like-shapes.svg' },
  { id: 'saas',      label: 'SaaS / Web App',       iconSrc: '/assets/icons/code.svg' },
  { id: 'custom',    label: 'Custom',               iconSrc: '/assets/icons/setting-2.svg' },
]

const serviceBudgetTiers = {
  landing:   ['starter', 'growth', 'enterprise'],
  portfolio: ['starter', 'growth', 'enterprise'],
  blog:      ['starter', 'growth', 'enterprise'],
  ecommerce: ['growth', 'enterprise'],
  mobile:    ['growth', 'enterprise'],
  corporate: ['growth', 'enterprise'],
  redesign:  ['growth', 'enterprise'],
  saas:      ['enterprise'],
  custom:    ['enterprise'],
}

const features = [
  { id: 'analytics',  label: 'Plausible Analytics',     description: 'Privacy-focused analytics, no cookies',    price: 'Included' },
  { id: 'deploy',     label: 'Vercel Deploy',            description: 'Automatic CI/CD deployments',              price: 'Included' },
  { id: 'seo',        label: 'SEO Optimization',         description: 'Meta, structured data, performance audit', price: '+€75' },
  { id: 'email',      label: 'Email Setup',              description: 'Custom domain email configuration',        price: '+€75' },
  { id: 'cloudflare', label: 'Cloudflare Email Routing', description: 'Free email forwarding via Cloudflare',     price: 'Included' },
]

const budgetPlans = [
  { value: 'starter',    label: 'Starter',    price: '€500',   note: '5-day delivery',  timeline: '5days',  timelineLabel: '5 days — Starter' },
  { value: 'growth',     label: 'Growth',     price: '€900',   note: '7-day delivery',  timeline: '7days',  timelineLabel: '7 days — Growth' },
  { value: 'enterprise', label: 'Enterprise', price: 'Custom', note: 'Per project',     timeline: 'custom', timelineLabel: 'Custom — Enterprise' },
]

const availableBudgetPlans = computed(() => {
  const allowed = serviceBudgetTiers[formData.value.service] ?? ['starter', 'growth', 'enterprise']
  return budgetPlans.filter(p => allowed.includes(p.value))
})

const availablePackages = computed(() => ({
  simple:  ['Basic', 'Standard', 'Pro'],
  medium:  ['Standard', 'Advanced', 'Pro'],
  complex: ['Advanced', 'Enterprise', 'Custom'],
}[formData.value.complexity] || []))

const isStepValid = computed(() => {
  switch (currentStep.value) {
    case 1: return formData.value.service !== ''
    case 2: return formData.value.complexity !== '' && formData.value.packageLevel !== ''
    case 3: return true
    case 4: return formData.value.budget !== '' && formData.value.timeline !== ''
    case 5: return formData.value.fullName !== '' && formData.value.email !== '' && formData.value.description.length >= 10
    default: return false
  }
})

const isFeatureSelected = (id) => formData.value.selectedFeatures.includes(id)

const addOnTotal = computed(() =>
  formData.value.selectedFeatures.reduce((sum, id) => {
    const f = features.find(f => f.id === id)
    if (!f || !f.price.includes('€')) return sum
    return sum + parseInt(f.price.match(/\d+/)?.[0] || 0)
  }, 0)
)

const calculatePrice = () => {
  const base = formData.value.budget === 'starter' ? 500 : formData.value.budget === 'growth' ? 900 : 0
  if (!base) return 'Custom'
  const total = base + addOnTotal.value
  return formData.value.rushFee ? Math.round(total * 1.2) : total
}

watch(() => formData.value.service, () => {
  const allowed = serviceBudgetTiers[formData.value.service] ?? []
  if (formData.value.budget && !allowed.includes(formData.value.budget)) {
    formData.value.budget = ''
    formData.value.timeline = ''
  }
})

const nextStep = () => { if (isStepValid.value && currentStep.value < totalSteps) currentStep.value++ }
const previousStep = () => { if (currentStep.value > 1) currentStep.value-- }
const goToPayment = () => {
  sessionStorage.setItem('intakeFormData', JSON.stringify(formData.value))
  navigateTo('/payment')
}

const siteUrl = useRuntimeConfig().public?.siteUrl
useSeoMeta({
  title: 'Project Intake | SiteSynth',
  description: 'Tell us about your project and get a custom quote from SiteSynth.',
  ogImage: `${siteUrl}/assets/shareimage.png`,
})
</script>
