<template>
  <div class="space-y-6">
    <!-- Card Element Container -->
    <div class="space-y-2">
      <label class="block text-[#999999] text-xs uppercase tracking-wide font-medium">
        Card Details
      </label>
      <div
        id="card-element"
        class="w-full bg-[#1a1a1a] border-b border-[#333] px-0 py-3 text-white focus:outline-none focus:border-b-[#8D35FF] transition"
      ></div>
      <div v-if="cardError" class="text-[#AA3733] text-sm mt-2">
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
        class="w-full bg-[#1a1a1a] border-b border-[#333] px-0 py-3 text-white placeholder:text-[#555] focus:outline-none focus:border-b-[#8D35FF] transition"
      />
    </div>

    <!-- Billing Address -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-[#999999] text-xs uppercase tracking-wide mb-2 font-medium">
          Email *
        </label>
        <input
          v-model="email"
          type="email"
          placeholder="john@example.com"
          class="w-full bg-[#1a1a1a] border-b border-[#333] px-0 py-3 text-white placeholder:text-[#555] focus:outline-none focus:border-b-[#8D35FF] transition"
        />
      </div>
      <div>
        <label class="block text-[#999999] text-xs uppercase tracking-wide mb-2 font-medium">
          Country *
        </label>
        <select
          v-model="country"
          class="w-full bg-[#1a1a1a] border-b border-[#333] px-0 py-3 text-white focus:outline-none focus:border-b-[#8D35FF] transition"
        >
          <option value="">Select Country</option>
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="GB">United Kingdom</option>
          <option value="AU">Australia</option>
          <option value="DE">Germany</option>
          <option value="FR">France</option>
          <option value="NL">Netherlands</option>
          <option value="BE">Belgium</option>
        </select>
      </div>
    </div>

    <!-- Submit Button -->
    <button
      @click="handlePayment"
      :disabled="isProcessing"
      class="w-full px-6 py-3 bg-gradient-to-r from-[#8D35FF] to-[#B06BFF] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#8D35FF]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span v-if="!isProcessing">Pay €{{ amount }}</span>
      <span v-else class="flex items-center justify-center gap-2">
        <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Processing...
      </span>
    </button>

    <!-- Info Text -->
    <p class="text-[#666] text-xs">
      Your payment information is secure and encrypted. We use Stripe to process payments securely.
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRuntimeConfig } from '#app'

// Load Stripe.js from CDN
const loadStripeFromCDN = async (publishableKey: string) => {
  if (!(window as any).Stripe) {
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

const props = defineProps({
  amount: {
    type: Number,
    required: true,
  },
  clientSecret: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(['payment-success', 'payment-error']);

const stripe = ref(null);
const elements = ref(null);
const cardElement = ref(null);
const isProcessing = ref(false);
const cardError = ref('');

const cardholderName = ref('');
const email = ref('');
const country = ref('');

onMounted(async () => {
  // Initialize Stripe with publishable key from config
  const config = useRuntimeConfig()
  const stripePublishableKey = config.public?.stripePublishableKey

  if (!stripePublishableKey) {
    cardError.value = 'Stripe configuration error. Please contact support.'
    return
  }

  try {
    stripe.value = await loadStripeFromCDN(stripePublishableKey)

    if (!stripe.value) {
      cardError.value = 'Failed to initialize payment system'
      return
    }

    elements.value = stripe.value.elements();
    cardElement.value = elements.value.create('card', {
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
    });

    cardElement.value.mount('#card-element');

    // Handle card errors
    cardElement.value.addEventListener('change', (event) => {
      if (event.error) {
        cardError.value = event.error.message;
      } else {
        cardError.value = '';
      }
    });
  } catch (error: any) {
    console.error('❌ Error initializing Stripe in StripePaymentForm:', error.message)
    cardError.value = `Failed to initialize payment form: ${error.message}`
  }
});

const handlePayment = async () => {
  if (!stripe.value || !cardElement.value) {
    cardError.value = 'Payment system not ready';
    return;
  }

  if (!cardholderName.value || !email.value || !country.value) {
    cardError.value = 'Please fill in all required fields';
    return;
  }

  isProcessing.value = true;

  try {
    const { token, error } = await stripe.value.createToken(cardElement.value, {
      name: cardholderName.value,
      address_country: country.value,
    });

    if (error) {
      cardError.value = error.message;
      emit('payment-error', error);
    } else if (token) {
      // Send token to your server for payment processing
      const response = await fetch('/api/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token.id,
          email: email.value,
          amount: props.amount,
          cardholderName: cardholderName.value,
          country: country.value,
        }),
      });

      const result = await response.json();

      if (result.success) {
        emit('payment-success', result);
        // Clear form
        cardholderName.value = '';
        email.value = '';
        country.value = '';
        cardElement.value.clear();
      } else {
        cardError.value = result.error || 'Payment processing failed';
        emit('payment-error', result);
      }
    }
  } catch (error) {
    cardError.value = error.message;
    emit('payment-error', error);
  } finally {
    isProcessing.value = false;
  }
};
</script>

<style scoped>
#card-element {
  padding: 0;
}
</style>
