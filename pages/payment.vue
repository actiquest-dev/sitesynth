<template>
  <HeaderSection />

  <section class="relative bg-[#161616] min-h-screen pt-20 md:pt-32 pb-16 md:pb-24 overflow-hidden">
    <!-- Background Effects -->
    <GlowRed />

    <!-- Background Gradients -->
    <div class="absolute inset-0 pointer-events-none opacity-40">
      <div
        class="absolute top-20 right-0 w-96 h-96 bg-red-500/20 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute bottom-20 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
      ></div>
    </div>

    <div class="relative max-w-7xl mx-auto px-6 md:px-12">
      <h1 class="text-5xl font-extrabold text-white mb-16">
        Complete Your
        <span class="bg-gradient-to-r from-[#0033ff] to-[#AA3733] bg-clip-text text-transparent">
          Order
        </span>
      </h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <!-- LEFT COLUMN: Billing Form (60%) -->
        <div class="lg:col-span-2 space-y-12">
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
                  class="w-full bg-[#1a1a1a] border-b border-[#333] px-0 py-3 text-white placeholder:text-[#555] focus:outline-none focus:border-b-[#0033ff] transition"
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
                  class="w-full bg-[#1a1a1a] border-b border-[#333] px-0 py-3 text-white placeholder:text-[#555] focus:outline-none focus:border-b-[#0033ff] transition"
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
                  class="w-full bg-[#1a1a1a] border-b border-[#333] px-0 py-3 text-white placeholder:text-[#555] focus:outline-none focus:border-b-[#0033ff] transition"
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
                  class="w-full bg-[#1a1a1a] border-b border-[#333] px-0 py-3 text-white placeholder:text-[#555] focus:outline-none focus:border-b-[#0033ff] transition"
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
                    class="w-full bg-[#1a1a1a] border-b border-[#333] px-0 py-3 text-white placeholder:text-[#555] focus:outline-none focus:border-b-[#0033ff] transition"
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
                    class="w-full bg-[#1a1a1a] border-b border-[#333] px-0 py-3 text-white placeholder:text-[#555] focus:outline-none focus:border-b-[#0033ff] transition"
                  />
                </div>
              </div>

              <!-- Country -->
              <div>
                <label class="block text-[#999999] text-xs uppercase tracking-wide mb-2 font-medium">
                  Country *
                </label>
                <select
                  v-model="billingData.country"
                  required
                  class="w-full bg-[#1a1a1a] border-b border-[#333] px-0 py-3 text-white focus:outline-none focus:border-b-[#0033ff] transition"
                >
                  <option value="">Select country</option>
                  <option value="US">United States</option>
                  <option value="BE">Belgium</option>
                  <option value="NL">Netherlands</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="GB">United Kingdom</option>
                  <option value="other">Other</option>
                </select>
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
                  class="w-full bg-[#1a1a1a] border-b border-[#333] px-0 py-3 text-white placeholder:text-[#555] focus:outline-none focus:border-b-[#0033ff] transition"
                />
              </div>
            </div>
          </div>

          <!-- PAYMENT METHOD -->
          <div>
            <h2 class="text-2xl font-bold text-white mb-8">Payment Method</h2>

            <!-- Stripe Payment Form -->
            <StripePaymentForm
              :amount="orderTotal"
              @payment-success="handlePaymentSuccess"
              @payment-error="handlePaymentError"
            />
              <div>
                <label class="block text-[#999999] text-xs uppercase tracking-wide mb-2 font-medium">
                  Card Number *
                </label>
                <input
                  v-model="cardData.number"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  maxlength="19"
                  @input="formatCardNumber"
                  required
                  class="w-full bg-[#1a1a1a] border-b border-[#333] px-0 py-3 text-white placeholder:text-[#555] focus:outline-none focus:border-b-[#0033ff] transition font-mono"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-[#999999] text-xs uppercase tracking-wide mb-2 font-medium">
                    Expiry Date *
                  </label>
                  <input
                    v-model="cardData.expiry"
                    type="text"
                    placeholder="MM/YY"
                    maxlength="5"
                    @input="formatExpiry"
                    required
                    class="w-full bg-[#1a1a1a] border-b border-[#333] px-0 py-3 text-white placeholder:text-[#555] focus:outline-none focus:border-b-[#0033ff] transition font-mono"
                  />
                </div>
                <div>
                  <label class="block text-[#999999] text-xs uppercase tracking-wide mb-2 font-medium">
                    CVV *
                  </label>
                  <input
                    v-model="cardData.cvv"
                    type="password"
                    placeholder="123"
                    maxlength="4"
                    required
                    class="w-full bg-[#1a1a1a] border-b border-[#333] px-0 py-3 text-white placeholder:text-[#555] focus:outline-none focus:border-b-[#0033ff] transition font-mono"
                  />
                </div>
              </div>

              <div>
                <label class="block text-[#999999] text-xs uppercase tracking-wide mb-2 font-medium">
                  Cardholder Name *
                </label>
                <input
                  v-model="cardData.holder"
                  type="text"
                  placeholder="John Doe"
                  required
                  class="w-full bg-[#1a1a1a] border-b border-[#333] px-0 py-3 text-white placeholder:text-[#555] focus:outline-none focus:border-b-[#0033ff] transition"
                />
              </div>

              <label class="flex items-start gap-3">
                <input
                  type="checkbox"
                  v-model="cardData.sameAddress"
                  class="w-5 h-5 rounded accent-[#0033ff] mt-0.5 flex-shrink-0"
                />
                <span class="text-[#999999] text-sm">
                  Billing address same as shipping
                </span>
          </div>
        </div>

        <!-- RIGHT COLUMN: Order Summary (40%) -->
        <div class="lg:col-span-1">
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
                @click="submitPayment"
                :disabled="isProcessing"
                class="w-full px-6 py-3 bg-[#0033ff] text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {{ isProcessing ? "Processing..." : "Place Order" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <FooterSection />
</template>

<script setup>
import { ref } from "vue";
import GlowRed from "@/components/effects/GlowRed.vue";
import StripePaymentForm from "@/components/StripePaymentForm.vue";

const orderTotal = ref(1170);

const billingData = ref({
  fullName: "",
  email: "",
  street: "",
  apartment: "",
  city: "",
  postal: "",
  country: "",
  company: "",
});

const handlePaymentSuccess = async (result) => {
  // Payment successful - save transaction and redirect to confirmation
  const sessionData = {
    chargeId: result.chargeId,
    amount: result.amount,
    email: result.email,
    timestamp: new Date().toISOString(),
  };

  // Save to session storage
  sessionStorage.setItem('paymentResult', JSON.stringify(sessionData));

  // Redirect to confirmation page
  navigateTo("/confirmation");
};

const handlePaymentError = (error) => {
  console.error('Payment error:', error);
  // Show error notification
};

// SEO
const siteUrl = useRuntimeConfig().public?.siteUrl;

useSeoMeta({
  title: "Payment | SiteSynth",
  description: "Complete your payment for SiteSynth services.",
  ogTitle: "Payment | SiteSynth",
  ogDescription: "Secure payment processing for SiteSynth.",
  ogImage: `${siteUrl}/assets/shareimage.png`,
});
</script>
