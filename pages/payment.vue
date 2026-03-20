<template>
  <HeaderSection />

  <section
    class="relative min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
    style="background-image: url('/assets/new-assets/test/sitesynth-animated-gradient-v2.svg'); background-color: #161616; padding-top: 128px;"
  >
    <ParticleEffect />

    <div class="relative w-full max-w-[1248px] mx-auto px-6 py-10">

      <!-- ── Progress: all steps done + payment ── -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4 relative">
          <div class="absolute left-0 right-0 top-4 h-px bg-[#8D35FF]/40"></div>
          <div
            v-for="(step, i) in ['Service','Complexity','Features','Budget','Contact','Payment']"
            :key="i"
            class="flex flex-col items-center gap-2 z-10"
          >
            <div :class="[
              'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all border',
              i < 5
                ? 'bg-[#8D35FF] border-[#8D35FF] text-white'
                : 'bg-[#161616] border-[#8D35FF] text-[#8D35FF]'
            ]">
              <svg v-if="i < 5" viewBox="0 0 16 16" fill="currentColor" class="w-3.5 h-3.5">
                <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
              </svg>
              <span v-else>6</span>
            </div>
            <span :class="['text-[11px]', i === 5 ? 'text-white' : 'text-[#8D35FF]/60']">{{ step }}</span>
          </div>
        </div>
      </div>

      <!-- ── Payment card ── -->
      <div class="border border-[#2a2a2a]" style="background: #161616;">

        <!-- Topbar -->
        <div class="h-11 border-b border-[#2a2a2a] flex items-center justify-between px-6" style="background: #1a1a1a;">
          <span class="text-sm text-white font-medium">Payment</span>
          <div class="flex items-center gap-1.5 text-xs text-[#444]" style="font-family: 'Inter', sans-serif;">
            <svg viewBox="0 0 16 16" fill="currentColor" class="w-3 h-3 text-[#555] flex-shrink-0">
              <path d="M8 0a3.5 3.5 0 0 0-3.5 3.5V5H3.5A1.5 1.5 0 0 0 2 6.5v7A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 12.5 5h-1V3.5A3.5 3.5 0 0 0 8 0Zm-2 5V3.5a2 2 0 1 1 4 0V5H6Z"/>
            </svg>
            SSL Secured
          </div>
        </div>

        <!-- Error -->
        <div v-if="paymentError" class="mx-6 mt-6 p-4 bg-[#AA3733]/10 border border-[#AA3733]/40 flex gap-3 items-start">
          <svg viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 text-[#AA3733] flex-shrink-0 mt-0.5">
            <path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
          </svg>
          <p class="text-[#AA3733] text-sm">{{ paymentError }}</p>
        </div>

        <!-- Content: 2 cols -->
        <form @submit.prevent="submitPayment" class="grid grid-cols-1 lg:grid-cols-5">

          <!-- LEFT: Billing + Payment -->
          <div class="lg:col-span-3 px-8 py-8 border-r border-[#2a2a2a] space-y-10">

            <!-- Billing Info -->
            <div>
              <h2 class="text-xl font-semibold text-white mb-6">Billing Information</h2>
              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[10px] uppercase tracking-widest text-[#444] mb-1.5">Full Name *</label>
                    <input v-model="billingData.fullName" type="text" placeholder="John Doe" required
                      class="w-full border px-3 py-2.5 text-sm text-white placeholder:text-[#333] focus:outline-none transition-colors"
                      style="background: #1a1a1a; border-color: #2a2a2a;"
                      @focus="e => e.target.style.borderColor = '#8D35FF'"
                      @blur="e => e.target.style.borderColor = '#2a2a2a'" />
                  </div>
                  <div>
                    <label class="block text-[10px] uppercase tracking-widest text-[#444] mb-1.5">Company (Optional)</label>
                    <input v-model="billingData.company" type="text" placeholder="Acme Inc."
                      class="w-full border px-3 py-2.5 text-sm text-white placeholder:text-[#333] focus:outline-none transition-colors"
                      style="background: #1a1a1a; border-color: #2a2a2a;"
                      @focus="e => e.target.style.borderColor = '#8D35FF'"
                      @blur="e => e.target.style.borderColor = '#2a2a2a'" />
                  </div>
                </div>
                <div>
                  <label class="block text-[10px] uppercase tracking-widest text-[#444] mb-1.5">Email *</label>
                  <input v-model="billingData.email" type="email" placeholder="hello@example.com" required
                    class="w-full border px-3 py-2.5 text-sm text-white placeholder:text-[#333] focus:outline-none transition-colors"
                    style="background: #1a1a1a; border-color: #2a2a2a;"
                    @focus="e => e.target.style.borderColor = '#8D35FF'"
                    @blur="e => e.target.style.borderColor = '#2a2a2a'" />
                </div>
                <div>
                  <label class="block text-[10px] uppercase tracking-widest text-[#444] mb-1.5">Street Address *</label>
                  <input v-model="billingData.street" type="text" placeholder="123 Main Street" required
                    class="w-full border px-3 py-2.5 text-sm text-white placeholder:text-[#333] focus:outline-none transition-colors"
                    style="background: #1a1a1a; border-color: #2a2a2a;"
                    @focus="e => e.target.style.borderColor = '#8D35FF'"
                    @blur="e => e.target.style.borderColor = '#2a2a2a'" />
                </div>
                <div class="grid grid-cols-3 gap-3">
                  <div>
                    <label class="block text-[10px] uppercase tracking-widest text-[#444] mb-1.5">City *</label>
                    <input v-model="billingData.city" type="text" placeholder="Antwerp" required
                      class="w-full border px-3 py-2.5 text-sm text-white placeholder:text-[#333] focus:outline-none transition-colors"
                      style="background: #1a1a1a; border-color: #2a2a2a;"
                      @focus="e => e.target.style.borderColor = '#8D35FF'"
                      @blur="e => e.target.style.borderColor = '#2a2a2a'" />
                  </div>
                  <div>
                    <label class="block text-[10px] uppercase tracking-widest text-[#444] mb-1.5">Postal *</label>
                    <input v-model="billingData.postal" type="text" placeholder="2000" required
                      class="w-full border px-3 py-2.5 text-sm text-white placeholder:text-[#333] focus:outline-none transition-colors"
                      style="background: #1a1a1a; border-color: #2a2a2a;"
                      @focus="e => e.target.style.borderColor = '#8D35FF'"
                      @blur="e => e.target.style.borderColor = '#2a2a2a'" />
                  </div>
                  <div>
                    <label class="block text-[10px] uppercase tracking-widest text-[#444] mb-1.5">Country *</label>
                    <CountrySelect v-model="billingData.country" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Payment Method -->
            <div>
              <h2 class="text-xl font-semibold text-white mb-6">Payment Method</h2>
              <div class="space-y-4">
                <div>
                  <label class="block text-[10px] uppercase tracking-widest text-[#444] mb-1.5">Card Details *</label>
                  <div id="card-element"
                    class="w-full border px-4 py-3 min-h-[46px]"
                    style="background: #1a1a1a; border-color: #2a2a2a;"></div>
                  <p v-if="cardError" class="text-[#AA3733] text-xs mt-2">{{ cardError }}</p>
                </div>
                <div>
                  <label class="block text-[10px] uppercase tracking-widest text-[#444] mb-1.5">Cardholder Name *</label>
                  <input v-model="cardholderName" type="text" placeholder="John Doe" required
                    class="w-full border px-3 py-2.5 text-sm text-white placeholder:text-[#333] focus:outline-none transition-colors"
                    style="background: #1a1a1a; border-color: #2a2a2a;"
                    @focus="e => e.target.style.borderColor = '#8D35FF'"
                    @blur="e => e.target.style.borderColor = '#2a2a2a'" />
                </div>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" v-model="billingAddressSameAsShipping" class="sr-only" />
                  <span :class="[
                    'w-3.5 h-3.5 flex-shrink-0 border flex items-center justify-center transition-all',
                    billingAddressSameAsShipping ? 'border-[#8D35FF] bg-[#8D35FF]' : 'border-[#333]'
                  ]">
                    <svg v-if="billingAddressSameAsShipping" viewBox="0 0 16 16" fill="currentColor" class="w-2.5 h-2.5 text-white">
                      <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
                    </svg>
                  </span>
                  <span class="text-xs text-[#444]">Billing address same as shipping</span>
                </label>
              </div>
            </div>
          </div>

          <!-- RIGHT: Order Summary -->
          <div class="lg:col-span-2 px-6 py-8" style="background: #111111;">
            <h3 class="text-xl font-semibold text-white mb-6">Order Summary</h3>

            <!-- Package -->
            <div class="p-4 border border-[#222] mb-4" style="background: #1a1a1a;">
              <div class="flex justify-between items-start mb-1">
                <span class="text-sm text-white font-medium">Growth Plan</span>
                <span class="text-sm text-white font-semibold">€900</span>
              </div>
              <span class="text-xs text-[#444]">Service Package</span>
            </div>

            <!-- Features -->
            <div class="space-y-2 mb-4 pb-4 border-b border-[#222]">
              <p class="text-[10px] uppercase tracking-widest text-[#444] mb-3">Included Features</p>
              <div class="flex justify-between text-sm">
                <span class="text-[#555]">Decap CMS</span>
                <span class="text-[#444] text-xs">Included</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-[#555]">5 Pages</span>
                <span class="text-[#444] text-xs">Included</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-[#555]">SEO Setup</span>
                <span class="text-xs text-[#8D35FF]">+€75</span>
              </div>
            </div>

            <!-- Totals -->
            <div class="space-y-2 mb-4 pb-4 border-b border-[#222]">
              <div class="flex justify-between text-sm">
                <span class="text-[#444]">Subtotal</span>
                <span class="text-white">€975</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-[#444]">Tax (20%)</span>
                <span class="text-white">€195</span>
              </div>
            </div>

            <div class="flex justify-between items-center mb-8">
              <span class="text-sm text-white font-medium">Total</span>
              <span class="text-xl font-bold text-[#8D35FF]">€1,170</span>
            </div>

            <!-- Buttons -->
            <div class="space-y-2">
              <button type="submit" :disabled="isProcessing"
                class="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-[#8D35FF] text-white hover:bg-[#7B2EF0]">
                <svg v-if="!isProcessing" viewBox="0 0 16 16" fill="currentColor" class="w-3.5 h-3.5">
                  <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h10A1.5 1.5 0 0 1 14 3.5v2A1.5 1.5 0 0 1 12.5 7h-10A1.5 1.5 0 0 1 1 5.5ZM2.5 3a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5ZM1 9.5A1.5 1.5 0 0 1 2.5 8h10A1.5 1.5 0 0 1 14 9.5v2A1.5 1.5 0 0 1 12.5 13h-10A1.5 1.5 0 0 1 1 11.5Zm1.5-.5a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5Z"/>
                </svg>
                {{ isProcessing ? 'Processing…' : 'Place Order' }}
              </button>
              <NuxtLink to="/intake"
                class="w-full flex items-center justify-center gap-1.5 px-6 py-2.5 text-sm text-[#555] hover:text-white border border-[#222] hover:border-[#333] transition-all">
                <svg viewBox="0 0 16 16" fill="currentColor" class="w-3.5 h-3.5">
                  <path d="M9.78 12.78a.75.75 0 0 1-1.06 0L4.47 8.53a.75.75 0 0 1 0-1.06l4.25-4.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L6.06 8l3.72 3.72a.75.75 0 0 1 0 1.06Z" />
                </svg>
                Back to Intake
              </NuxtLink>
            </div>

            <p class="flex items-center justify-center gap-1.5 text-[10px] text-[#333] mt-5" style="font-family: 'Inter', sans-serif; letter-spacing: 0.02em;">
              <svg viewBox="0 0 16 16" fill="currentColor" class="w-3 h-3 flex-shrink-0">
                <path d="M8 0a3.5 3.5 0 0 0-3.5 3.5V5H3.5A1.5 1.5 0 0 0 2 6.5v7A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 12.5 5h-1V3.5A3.5 3.5 0 0 0 8 0Zm-2 5V3.5a2 2 0 1 1 4 0V5H6Z"/>
              </svg>
              SSL Encrypted · Powered by Stripe
            </p>
          </div>

        </form>
      </div>
    </div>
  </section>

  <FooterSection />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ParticleEffect from '@/components/effects/ParticleEffect.vue'

const orderTotal = ref(1170)
let stripePublishableKey = ''

// Stripe refs
let stripe: any = null
let elements: any = null
let cardElement: any = null

// Load Stripe from CDN
const loadStripe = async (publishableKey: string) => {
  if (!(window as any).Stripe) {
    // Load Stripe.js from CDN
    const script = document.createElement('script')
    script.src = 'https://js.stripe.com/v3/'
    script.async = true
    document.head.appendChild(script)

    return new Promise((resolve, reject) => {
      script.onload = () => {
        try {
          if (!publishableKey) {
            throw new Error('Stripe publishable key is empty')
          }
          const stripeInstance = (window as any).Stripe(publishableKey)
          if (!stripeInstance) {
            throw new Error('Failed to initialize Stripe - returned null')
          }
          resolve(stripeInstance)
        } catch (error: any) {
          console.error('❌ Stripe initialization error:', error.message)
          reject(error)
        }
      }
      script.onerror = () => {
        reject(new Error('Failed to load Stripe.js from CDN'))
      }
    })
  }

  try {
    if (!publishableKey) {
      throw new Error('Stripe publishable key is empty')
    }
    const stripeInstance = (window as any).Stripe(publishableKey)
    if (!stripeInstance) {
      throw new Error('Failed to initialize Stripe - returned null')
    }
    return stripeInstance
  } catch (error: any) {
    console.error('❌ Stripe initialization error:', error.message)
    throw error
  }
}

// Get intake data from intake form (saved in sessionStorage)
const intakeFormData = ref<any>(null)

const billingData = ref({
  fullName: '',
  email: '',
  street: '',
  apartment: '',
  city: '',
  postal: '',
  country: '',
  company: '',
})

const cardholderName = ref('')
const billingAddressSameAsShipping = ref(false)
const isProcessing = ref(false)
const cardError = ref('')
const paymentError = ref('')

// Initialize Stripe
onMounted(async () => {
  // Get intake form data from sessionStorage
  try {
    const intakeData = sessionStorage.getItem('intakeFormData')
    if (intakeData) {
      intakeFormData.value = JSON.parse(intakeData)
      console.log('✅ Intake data loaded:', intakeFormData.value)

      // Pre-fill email and name from intake form
      if (intakeFormData.value.email) {
        billingData.value.email = intakeFormData.value.email
      }
      if (intakeFormData.value.fullName) {
        billingData.value.fullName = intakeFormData.value.fullName
      }
      if (intakeFormData.value.companyName) {
        billingData.value.company = intakeFormData.value.companyName
      }
    }
  } catch (error) {
    console.warn('Could not load intake data:', error)
  }

  // Get runtime config on client side
  try {
    const config = useRuntimeConfig()
    stripePublishableKey = config.public?.stripePublishableKey || ''

    if (!stripePublishableKey) {
      console.error('Stripe publishable key not configured')
      paymentError.value = 'Payment system not configured'
      return
    }
  } catch (error) {
    console.error('Error loading config:', error)
    paymentError.value = 'Failed to load configuration'
    return
  }

  try {
    stripe = await loadStripe(stripePublishableKey)

    if (!stripe) {
      console.error('Failed to load Stripe')
      paymentError.value = 'Failed to load payment system'
      return
    }
  } catch (error: any) {
    console.error('❌ Error initializing Stripe:', error.message)
    paymentError.value = `Failed to load payment system: ${error.message}`
    return
  }

  elements = stripe.elements()

  if (!elements) {
    console.error('Failed to create Stripe elements')
    paymentError.value = 'Failed to initialize payment form'
    return
  }

  cardElement = elements.create('card', {
    style: {
      base: {
        color: '#ffffff',
        fontFamily: 'Inter, sans-serif',
        fontSize: '16px',
        '::placeholder': {
          color: '#555555',
        },
      },
      invalid: {
        color: '#AA3733',
      },
    },
  })

  cardElement.mount('#card-element')

  // Handle card errors
  cardElement.addEventListener('change', (event) => {
    if (event.error) {
      cardError.value = event.error.message || ''
    } else {
      cardError.value = ''
    }
  })
})

const submitPayment = async () => {
  if (!stripe || !elements || !cardElement) {
    paymentError.value = 'Payment system not ready'
    return
  }

  // Validate form
  if (!billingData.value.fullName || !billingData.value.email || !billingData.value.street ||
      !billingData.value.city || !billingData.value.postal || !billingData.value.country) {
    paymentError.value = 'Please fill in all billing information'
    return
  }

  if (!cardholderName.value) {
    cardError.value = 'Please enter cardholder name'
    return
  }

  isProcessing.value = true
  paymentError.value = ''

  try {
    // Create token from card element
    const { token, error } = await stripe.createToken(cardElement, {
      name: cardholderName.value,
      address_country: billingData.value.country,
    })

    if (error) {
      cardError.value = error.message || 'Failed to create payment token'
      isProcessing.value = false
      return
    }

    if (!token) {
      paymentError.value = 'Failed to create payment token'
      isProcessing.value = false
      return
    }

    // Send payment to backend
    const response = await fetch('/api/process-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token.id,
        amount: orderTotal.value,
        email: billingData.value.email,
        billingData: {
          fullName: billingData.value.fullName,
          street: billingData.value.street,
          apartment: billingData.value.apartment,
          city: billingData.value.city,
          postal: billingData.value.postal,
          country: billingData.value.country,
          company: billingData.value.company,
        },
        // Include ALL intake form data (5 steps)
        intakeFormData: intakeFormData.value,
      }),
    })

    const result = await response.json()

    if (result.success) {
      // Save transaction data
      const sessionData = {
        chargeId: result.chargeId,
        amount: orderTotal.value,
        currency: 'USD',
        email: billingData.value.email,
        fullName: billingData.value.fullName,
        paymentMethod: 'Credit Card',
        timestamp: new Date().toISOString(),
      }

      // Carry over presale conversation_id so it can be claimed after login
      const presaleConvId = localStorage.getItem('presale_conversation_id')
      if (presaleConvId) sessionData.presale_conversation_id = presaleConvId

      localStorage.setItem('paymentResult', JSON.stringify(sessionData))

      // Create auth token so user can access cabinet
      const authToken = btoa(`${billingData.value.email}:${Date.now()}`)
      localStorage.setItem('authToken', authToken)
      localStorage.setItem('user', JSON.stringify({
        email: billingData.value.email,
        name: billingData.value.fullName,
        provider: 'payment',
        authenticatedAt: new Date().toISOString(),
      }))

      // Payment successful - redirect to confirmation
      console.log('✅ Payment successful, redirecting to confirmation')
      await navigateTo('/confirmation')
    } else {
      paymentError.value = result.error || result.message || 'Payment failed'
    }
  } catch (error: any) {
    console.error('Payment error:', error)
    paymentError.value = error.message || 'Payment processing failed'
  } finally {
    isProcessing.value = false
  }
}

// SEO
const siteUrl = useRuntimeConfig().public?.siteUrl || 'https://www.sitesynth.com'

useSeoMeta({
  title: 'Payment | SiteSynth',
  description: 'Complete your payment for SiteSynth services.',
  ogTitle: 'Payment | SiteSynth',
  ogDescription: 'Secure payment processing for SiteSynth.',
  ogImage: `${siteUrl}/assets/shareimage.png`,
})
</script>
