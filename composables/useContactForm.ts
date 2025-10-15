import { reactive } from 'vue'

interface ContactFormData {
  fullName: string
  company: string
  email: string
  phone: string
  topic: string
  message: string
  consent: boolean
}

interface ContactFormState {
  isSubmitting: boolean
  submitMessage: string
  submitError: string
}

interface ApiResponse {
  success: boolean
  message: string
}

export const useContactForm = () => {
  // Form data
  const formData = reactive<ContactFormData>({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    topic: '',
    message: '',
    consent: false
  })

  // Form state
  const state = reactive<ContactFormState>({
    isSubmitting: false,
    submitMessage: '',
    submitError: ''
  })

  // Reset messages
  const resetMessages = () => {
    state.submitMessage = ''
    state.submitError = ''
  }

  // Validate form
  const validateForm = (): boolean => {
    if (!formData.fullName || !formData.email || !formData.phone || 
        !formData.topic || !formData.message || !formData.consent) {
      state.submitError = 'Please fill in all required fields and accept the data processing consent.'
      return false
    }
    return true
  }

  // Reset form data
  const resetForm = () => {
    Object.assign(formData, {
      fullName: '',
      company: '',
      email: '',
      phone: '',
      topic: '',
      message: '',
      consent: false
    })
  }

  // Submit form
  const submitForm = async (): Promise<void> => {
    resetMessages()

    if (!validateForm()) {
      return
    }

    state.isSubmitting = true

    try {
      const response = await $fetch<ApiResponse>('/api/contact', {
        method: 'POST',
        body: { ...formData }
      })

      if (response.success) {
        state.submitMessage = response.message
        resetForm()
      }
    } catch (error: any) {
      console.error('Form submission error:', error)
      state.submitError = error.data?.error || 'Failed to send message. Please try again.'
    } finally {
      state.isSubmitting = false
    }
  }

  // Form submit handler
  const handleSubmit = async (event: Event) => {
    event.preventDefault()
    await submitForm()
  }

  return {
    formData,
    state,
    handleSubmit,
    resetMessages,
    resetForm
  }
}