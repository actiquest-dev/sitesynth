<template>
  <button
    type="button"
    :disabled="loading"
    @click="handleCustomGoogleClick"
    class="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white text-[#1f2937] font-semibold rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-[#8D35FF]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
  >
    <svg v-if="loading" class="animate-spin h-5 w-5 text-[#8D35FF]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path>
    </svg>
    <span v-if="!loading">Sign in with Google</span>
    <span v-else>Signing in...</span>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
  clientId: string
  onSuccess?: (response: any) => void
  onError?: (error: any) => void
}

const props = defineProps<Props>()
const loading = ref(false)
let googleInitialized = false

// Ensure SDK is loaded
const ensureGoogleSDKLoaded = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.google) {
      console.log('✅ Google SDK already loaded')
      resolve(true)
      return
    }

    console.log('📱 Loading Google SDK...')
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true

    script.onload = () => {
      if (window.google) {
        console.log('✅ Google SDK loaded successfully')
        resolve(true)
      } else {
        console.error('❌ Google SDK object not available after script load')
        resolve(false)
      }
    }

    script.onerror = (error) => {
      console.error('❌ Failed to load Google SDK:', error)
      resolve(false)
    }

    // Check if already appended
    if (!document.getElementById('google-gsi-script')) {
      script.id = 'google-gsi-script'
      document.head.appendChild(script)
    } else {
      resolve(true)
    }
  })
}

// Handle button click
const handleCustomGoogleClick = async () => {
  loading.value = true
  console.log('🔐 Button clicked, ensuring SDK is ready...')

  try {
    // Ensure SDK is loaded
    const sdkLoaded = await ensureGoogleSDKLoaded()
    if (!sdkLoaded) {
      throw new Error('Google SDK failed to load')
    }

    if (!window.google) {
      throw new Error('Google SDK not available')
    }

    console.log('✅ SDK ready, initializing...')

    // Initialize if not done yet
    if (!googleInitialized) {
      window.google.accounts.id.initialize({
        client_id: props.clientId,
        callback: (response: any) => {
          console.log('✅ Google Sign-In callback received')
          console.log('   Credential:', response.credential ? 'Present' : 'Missing')
          loading.value = false
          props.onSuccess?.(response)
        },
        error_callback: (error: any) => {
          console.error('❌ Google initialization error:', error)
          loading.value = false
          props.onError?.(error)
        },
        auto_select: false,
        ux_mode: 'popup',
      })
      googleInitialized = true
      console.log('✅ Google Sign-In initialized')
    }

    // Create hidden div for button rendering
    const hiddenDiv = document.createElement('div')
    hiddenDiv.style.display = 'none'
    document.body.appendChild(hiddenDiv)

    console.log('🔓 Rendering Google Sign-In button to trigger popup...')
    
    // Render button to trigger popup
    window.google.accounts.id.renderButton(hiddenDiv, {
      type: 'standard',
      width: '100%',
      ux_mode: 'popup',
    })

    // Click the hidden button
    const button = hiddenDiv.querySelector('div[role="button"]') as HTMLElement | null
    if (button) {
      console.log('💡 Found button, clicking it...')
      button.click()
    } else {
      console.warn('⚠️ Could not find rendered button, trying prompt instead...')
      window.google.accounts.id.prompt()
    }

    // Clean up
    setTimeout(() => {
      document.body.removeChild(hiddenDiv)
    }, 1000)
  } catch (error: any) {
    console.error('❌ Error in handleCustomGoogleClick:', error)
    loading.value = false
    props.onError?.(error)
  }
}

// Initialize on mount
onMounted(async () => {
  console.log('📱 GoogleSignInButton mounted')

  if (!props.clientId) {
    const err = new Error('Client ID not provided to GoogleSignInButton')
    console.error('❌', err.message)
    props.onError?.(err)
    return
  }

  console.log('   Client ID:', props.clientId.substring(0, 20) + '...')

  // Pre-load SDK
  const loaded = await ensureGoogleSDKLoaded()
  if (!loaded) {
    const err = new Error('Failed to load Google SDK on mount')
    console.error('❌', err.message)
    props.onError?.(err)
  } else {
    console.log('✅ Component ready')
  }
})
</script>
