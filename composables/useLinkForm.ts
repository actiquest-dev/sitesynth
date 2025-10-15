import { reactive } from 'vue'

interface LinkFormData {
  link: string
}

interface LinkFormState {
  isSubmitting: boolean
  message: string
}

interface LinkApiResponse {
  success: boolean
  message: string
  error?: string
}

export const useLinkForm = () => {
  // Form data
  const formData = reactive<LinkFormData>({
    link: ''
  })

  // Form state
  const state = reactive<LinkFormState>({
    isSubmitting: false,
    message: ''
  })

  // Reset message
  const resetMessage = () => {
    state.message = ''
  }

  // Validate form
  const validateForm = (): boolean => {
    if (!formData.link.trim()) {
      state.message = 'Please enter a link'
      return false
    }
    return true
  }

  // Reset form data
  const resetForm = () => {
    formData.link = ''
  }

  // Submit form
  const submitForm = async (): Promise<void> => {
    resetMessage()

    if (!validateForm()) {
      return
    }

    state.isSubmitting = true

    try {
      const response = await $fetch<LinkApiResponse>('/api/send-link', {
        method: 'POST',
        body: { link: formData.link }
      })

      if (response.success) {
        state.message = response.message || 'Link submitted successfully!'
        resetForm()
      } else {
        state.message = response.error || 'Something went wrong'
      }
    } catch (error: any) {
      console.error('Link submission error:', error)
      state.message = error.data?.error || 'Failed to submit link. Please try again.'
    } finally {
      state.isSubmitting = false
    }
  }

  // Form submit handler
  const handleSubmit = async (event?: Event) => {
    if (event) {
      event.preventDefault()
    }
    await submitForm()
  }

  // Computed property for message styling
  const isSuccessMessage = () => {
    return state.message.toLowerCase().includes('successfully')
  }

  return {
    formData,
    state,
    handleSubmit,
    resetMessage,
    resetForm,
    isSuccessMessage
  }
}