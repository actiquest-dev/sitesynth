/**
 * Debug script to verify Google OAuth configuration
 * Run this in browser console on localhost:3000 or sitesynth.com
 */

async function debugGoogleConfig() {
  console.log('🔍 Google Configuration Debug\n')
  
  // 1. Check if God SDK is loaded
  console.log('1. Google SDK Status:')
  if (window.google) {
    console.log('   ✅ Google SDK loaded')
  } else {
    console.log('   ❌ Google SDK NOT loaded')
    console.log('   Trying to load manually...')
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.onload = () => {
      console.log('   ✅ Google SDK loaded manually')
    }
    document.head.appendChild(script)
  }

  // 2. Check Client ID
  console.log('\n2. Client ID Configuration:')
  const config = useRuntimeConfig?.()
  if (config?.public?.googleClientId) {
    console.log('   ✅ Client ID found:', config.public.googleClientId.substring(0, 20) + '...')
  } else {
    console.log('   ❌ Client ID NOT found in runtime config')
    console.log('   Check: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID in .env.local')
  }

  // 3. Check current origin
  console.log('\n3. Current Origin:')
  console.log('   📍 Origin:', window.location.origin)
  console.log('   🌐 Hostname:', window.location.hostname)

  // 4. Required origins checklist
  console.log('\n4. Required Authorized Origins in Google Console:')
  const requiredOrigins = [
    'http://localhost:3000',
    'http://localhost',
    'https://sitesynth.com',
    'https://www.sitesynth.com'
  ]
  requiredOrigins.forEach(origin => {
    console.log(`   ⚠️  ${origin}`)
  })

  // 5. Required redirect URIs
  console.log('\n5. Required Redirect URIs in Google Console:')
  const requiredRedirects = [
    'http://localhost:3000/confirmation',
    'https://sitesynth.com/confirmation',
    'https://www.sitesynth.com/confirmation'
  ]
  requiredRedirects.forEach(uri => {
    console.log(`   ⚠️  ${uri}`)
  })

  console.log('\n✅ Configuration check complete!')
}

// Run it
debugGoogleConfig()
