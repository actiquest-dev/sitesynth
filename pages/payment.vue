<template>
  <HeaderSection />

  <section class="relative bg-[#161616] min-h-screen pt-20 md:pt-32 pb-16 md:pb-24 overflow-hidden">
    <!-- Background Effects -->
    <GlowRed />
    <ParticleEffect />

    <!-- Background Gradients -->
    <div class="absolute inset-0 pointer-events-none opacity-50">
      <div
        class="absolute top-20 right-0 w-96 h-96 bg-red-500/30 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute bottom-20 left-0 w-96 h-96 bg-blue-500/25 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl transform -translate-x-1/2"
      ></div>
    </div>

    <div class="relative max-w-7xl mx-auto px-6 md:px-12">
      <h1 class="text-5xl font-extrabold text-white mb-16">
        Complete Your
        <span class="bg-gradient-to-r from-[#0033ff] to-[#AA3733] bg-clip-text text-transparent">
          Order
        </span>
      </h1>

      <!-- Error Message -->
      <div v-if="paymentError" class="mb-6 p-4 bg-[#AA3733]/20 border border-[#AA3733] rounded-lg">
        <p class="text-[#AA3733] text-sm">{{ paymentError }}</p>
      </div>

      <form @submit.prevent="submitPayment" class="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <!-- LEFT COLUMN: Billing Form (60%) -->
        <div class="lg:col-span-3 space-y-12">
          <!-- BILLING INFORMATION -->
          <div>
            <h2 class="text-2xl font-bold text-white mb-8">Billing Information</h2>

            <div class="space-y-6">
              <!-- Full Name -->
              <div>
                <label class="block text-[#999999] text-xs uppercase tracking-wide mb-2 font-medium">
                  Full Name *
                </label>
                <input
                  v-model="billingData.fullName"
                  type="text"
                  placeholder="John Doe"
                  required
                  class="w-full bg-[#1a1a1a] border border-[#333] px-4 py-3 rounded-lg text-white placeholder:text-[#555] focus:outline-none focus:border-[#0033ff] focus:ring-1 focus:ring-[#0033ff] transition"
                />
              </div>

              <!-- Email -->
              <div>
                <label class="block text-[#999999] text-xs uppercase tracking-wide mb-2 font-medium">
                  Email *
                </label>
                <input
                  v-model="billingData.email"
                  type="email"
                  placeholder="hello@example.com"
                  required
                  class="w-full bg-[#1a1a1a] border border-[#333] px-4 py-3 rounded-lg text-white placeholder:text-[#555] focus:outline-none focus:border-[#0033ff] focus:ring-1 focus:ring-[#0033ff] transition"
                />
              </div>

              <!-- Street Address -->
              <div>
                <label class="block text-[#999999] text-xs uppercase tracking-wide mb-2 font-medium">
                  Street Address *
                </label>
                <input
                  v-model="billingData.street"
                  type="text"
                  placeholder="123 Main Street"
                  required
                  class="w-full bg-[#1a1a1a] border border-[#333] px-4 py-3 rounded-lg text-white placeholder:text-[#555] focus:outline-none focus:border-[#0033ff] focus:ring-1 focus:ring-[#0033ff] transition"
                />
              </div>

              <!-- Building/Apartment -->
              <div>
                <label class="block text-[#999999] text-xs uppercase tracking-wide mb-2 font-medium">
                  Building/Apartment (Optional)
                </label>
                <input
                  v-model="billingData.apartment"
                  type="text"
                  placeholder="Apt 4B"
                  class="w-full bg-[#1a1a1a] border border-[#333] px-4 py-3 rounded-lg text-white placeholder:text-[#555] focus:outline-none focus:border-[#0033ff] focus:ring-1 focus:ring-[#0033ff] transition"
                />
              </div>

              <!-- City & Postal Code -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-[#999999] text-xs uppercase tracking-wide mb-2 font-medium">
                    City *
                  </label>
                  <input
                    v-model="billingData.city"
                    type="text"
                    placeholder="New York"
                    required
                    class="w-full bg-[#1a1a1a] border border-[#333] px-4 py-3 rounded-lg text-white placeholder:text-[#555] focus:outline-none focus:border-[#0033ff] focus:ring-1 focus:ring-[#0033ff] transition"
                  />
                </div>
                <div>
                  <label class="block text-[#999999] text-xs uppercase tracking-wide mb-2 font-medium">
                    Postal Code *
                  </label>
                  <input
                    v-model="billingData.postal"
                    type="text"
                    placeholder="10001"
                    required
                    class="w-full bg-[#1a1a1a] border border-[#333] px-4 py-3 rounded-lg text-white placeholder:text-[#555] focus:outline-none focus:border-[#0033ff] focus:ring-1 focus:ring-[#0033ff] transition"
                  />
                </div>
              </div>

              <!-- Country -->
              <div>
                <label class="block text-[#999999] text-xs uppercase tracking-wide mb-2 font-medium">
                  Country *
                </label>
                <CountrySelect v-model="billingData.country" />
              </div>

              <!-- Company Name -->
              <div>
                <label class="block text-[#999999] text-xs uppercase tracking-wide mb-2 font-medium">
                  Company Name (Optional)
                </label>
                <input
                  v-model="billingData.company"
                  type="text"
                  placeholder="Your company"
                  class="w-full bg-[#1a1a1a] border border-[#333] px-4 py-3 rounded-lg text-white placeholder:text-[#555] focus:outline-none focus:border-[#0033ff] focus:ring-1 focus:ring-[#0033ff] transition"
                />
              </div>
            </div>
          </div>

          <!-- PAYMENT METHOD -->
          <div>
            <h2 class="text-2xl font-bold text-white mb-8">Payment Method</h2>

            <div class="space-y-8">
              <!-- Stripe Card Element -->
              <div>
                <label class="block text-[#999999] text-xs uppercase tracking-wide mb-2 font-medium">
                  Card Details *
                </label>
                <div
                  id="card-element"
                  class="w-full bg-[#1a1a1a] border border-[#333] px-4 py-3 rounded-lg min-h-[48px]"
                ></div>
                <div v-if="cardError" class="text-[#AA3733] text-sm mt-3">
                  {{ cardError }}
                </div>
              </div>

              <!-- Cardholder Name -->
              <div>
                <label class="block text-[#999999] text-xs uppercase tracking-wide mb-2 font-medium">
                  Cardholder Name *
                </label>
                <input
                  v-model="cardholderName"
                  type="text"
                  placeholder="John Doe"
                  required
                  class="w-full bg-[#1a1a1a] border border-[#333] px-4 py-3 rounded-lg text-white placeholder:text-[#555] focus:outline-none focus:border-[#0033ff] focus:ring-1 focus:ring-[#0033ff] transition"
                />
              </div>

              <!-- Billing Address Same as Shipping -->
              <label class="flex items-start gap-3">
                <input
                  type="checkbox"
                  v-model="billingAddressSameAsShipping"
                  class="w-5 h-5 rounded accent-[#0033ff] mt-0.5 flex-shrink-0"
                />
                <span class="text-[#999999] text-sm">
                  Billing address same as shipping
                </span>
              </label>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: Order Summary (40%) -->
        <div class="lg:col-span-2">
          <div
            class="sticky top-8 border-l-4 border-[#0033ff] bg-[#1a1a1a] p-6 rounded-lg"
          >
            <h3 class="text-xl font-bold text-white mb-6">Order Summary</h3>

            <div class="space-y-4 mb-6 pb-6 border-b border-[#333]">
              <div class="flex justify-between">
                <span class="text-[#999999]">Growth Plan</span>
                <span class="text-white font-semibold">€900</span>
              </div>
              <p class="text-[#999999] text-xs">Service Package</p>
            </div>

            <div class="space-y-3 mb-6 pb-6 border-b border-[#333]">
              <p class="text-white font-semibold text-sm mb-3">Features:</p>
              <div class="flex justify-between text-sm">
                <span class="text-[#999999]">Decap CMS</span>
                <span class="text-white">Included</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-[#999999]">5 Pages</span>
                <span class="text-white">Included</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-[#999999]">SEO Setup</span>
                <span class="text-[#0033ff]">+€75</span>
              </div>
            </div>

            <div class="space-y-3 mb-6 pb-6 border-b border-[#333]">
              <div class="flex justify-between">
                <span class="text-[#999999]">Subtotal</span>
                <span class="text-white">€975</span>
              </div>
              <div class="flex justify-between">
                <span class="text-[#999999]">Tax (20%)</span>
                <span class="text-white">€195</span>
              </div>
            </div>

            <div class="flex justify-between mb-8">
              <span class="text-white font-semibold">Total</span>
              <span class="text-2xl font-bold text-[#0033ff]">€1,170</span>
            </div>

            <div class="text-[#999999] text-xs text-center mb-8">
              🔒 Secure SSL Encrypted Payment
            </div>

            <div class="space-y-3">
              <NuxtLink
                to="/intake"
                class="block px-6 py-3 border border-[#999999] text-[#999999] text-center rounded-lg font-semibold hover:border-white hover:text-white transition"
              >
                Back
              </NuxtLink>

              <button
                type="submit"
                :disabled="isProcessing"
                class="w-full px-6 py-3 bg-[#0033ff] text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {{ isProcessing ? "Processing..." : "Place Order" }}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </section>

  <FooterSection />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import GlowRed from '@/components/effects/GlowRed.vue'
import ParticleEffect from '@/components/effects/ParticleEffect.vue'
import { useCursorGlow } from '@/composables/useCursorGlow'

// Initialize cursor glow effect
useCursorGlow()

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
      // User will be able to login via Google or email on the login page
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
