import { reactive } from 'vue'

interface IntakeFormData {
  service: string
  complexity: string
  packageLevel: string
  selectedFeatures: string[]
  budget: string
  timeline: string
  rushFee: boolean
  fullName: string
  email: string
  phone: string
  companyName: string
  description: string
  contactMethod: string
  newsletter: boolean
}

interface BillingData {
  fullName: string
  email: string
  street: string
  apartment: string
  city: string
  postal: string
  country: string
  company: string
}

interface CardData {
  number: string
  expiry: string
  cvv: string
  holder: string
  sameAddress: boolean
}

interface PaymentFlowState {
  currentStep: number
  isSubmitting: boolean
  submitError: string
  submitMessage: string
}

export const usePaymentFlow = () => {
  // Intake form data
  const intakeData = reactive<IntakeFormData>({
    service: '',
    complexity: '',
    packageLevel: '',
    selectedFeatures: [],
    budget: '',
    timeline: '',
    rushFee: false,
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    description: '',
    contactMethod: 'email',
    newsletter: false,
  })

  // Billing data
  const billingData = reactive<BillingData>({
    fullName: '',
    email: '',
    street: '',
    apartment: '',
    city: '',
    postal: '',
    country: '',
    company: '',
  })

  // Card data
  const cardData = reactive<CardData>({
    number: '',
    expiry: '',
    cvv: '',
    holder: '',
    sameAddress: false,
  })

  // Flow state
  const state = reactive<PaymentFlowState>({
    currentStep: 1,
    isSubmitting: false,
    submitError: '',
    submitMessage: '',
  })

  // Reset messages
  const resetMessages = () => {
    state.submitError = ''
    state.submitMessage = ''
  }

  // Validate intake form
  const validateIntakeForm = (): boolean => {
    if (!intakeData.service) {
      state.submitError = 'Please select a service'
      return false
    }
    if (!intakeData.complexity || !intakeData.packageLevel) {
      state.submitError = 'Please select complexity level and package'
      return false
    }
    if (!intakeData.budget || !intakeData.timeline) {
      state.submitError = 'Please select budget and timeline'
      return false
    }
    if (!intakeData.fullName || !intakeData.email || !intakeData.description) {
      state.submitError = 'Please fill in all required fields'
      return false
    }
    return true
  }

  // Validate billing form
  const validateBillingForm = (): boolean => {
    if (!billingData.fullName || !billingData.email || !billingData.street ||
        !billingData.city || !billingData.postal || !billingData.country) {
      state.submitError = 'Please fill in all required billing fields'
      return false
    }
    return true
  }

  // Submit intake form
  const submitIntakeForm = async (): Promise<void> => {
    resetMessages()

    if (!validateIntakeForm()) {
      return
    }

    state.isSubmitting = true

    try {
      const response = await fetch('/api/intake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(intakeData)
      })

      const data = await response.json()

      if (data.success) {
        state.submitMessage = 'Intake form submitted successfully'
        state.currentStep++
      } else {
        state.submitError = data.error || 'Failed to submit form'
      }
    } catch (error: any) {
      console.error('Form submission error:', error)
      state.submitError = error?.message || 'Failed to submit form'
    } finally {
      state.isSubmitting = false
    }
  }

  // Submit payment
  const submitPayment = async (): Promise<void> => {
    resetMessages()

    if (!validateBillingForm()) {
      return
    }

    state.isSubmitting = true

    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          intake: intakeData,
          billing: billingData,
          card: cardData,
        })
      })

      const data = await response.json()

      if (data.success) {
        state.submitMessage = 'Payment processed successfully'
        // Redirect to confirmation page
        navigateTo('/confirmation')
      } else {
        state.submitError = data.error || 'Payment failed'
      }
    } catch (error: any) {
      console.error('Payment error:', error)
      state.submitError = error?.message || 'Payment processing failed'
    } finally {
      state.isSubmitting = false
    }
  }

  // Reset form data
  const resetForm = () => {
    Object.assign(intakeData, {
      service: '',
      complexity: '',
      packageLevel: '',
      selectedFeatures: [],
      budget: '',
      timeline: '',
      rushFee: false,
      fullName: '',
      email: '',
      phone: '',
      companyName: '',
      description: '',
      contactMethod: 'email',
      newsletter: false,
    })
  }

  // Save intake data to session/local storage for later retrieval
  const saveIntakeData = () => {
    if (process.client) {
      sessionStorage.setItem('intakeData', JSON.stringify(intakeData))
    }
  }

  // Load intake data from session/local storage
  const loadIntakeData = () => {
    if (process.client) {
      const saved = sessionStorage.getItem('intakeData')
      if (saved) {
        Object.assign(intakeData, JSON.parse(saved))
      }
    }
  }

  return {
    intakeData,
    billingData,
    cardData,
    state,
    validateIntakeForm,
    validateBillingForm,
    submitIntakeForm,
    submitPayment,
    resetForm,
    resetMessages,
    saveIntakeData,
    loadIntakeData,
  }
}
