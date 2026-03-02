<template>
  <HeaderSection />

  <section class="relative bg-[#161616] min-h-screen pt-20 md:pt-32 pb-16 md:pb-24 overflow-hidden">
    <!-- Background Effects -->
    <GlowBlue />
    <ParticleEffect />

    <!-- Gradient Background -->
    <div class="absolute inset-0 pointer-events-none opacity-70">
      <div
        class="absolute top-0 left-1/2 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl transform -translate-x-1/2"
      ></div>
      <div
        class="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute top-1/2 left-1/3 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"
      ></div>
    </div>

    <div class="relative max-w-6xl w-full mx-auto px-6 md:px-12">
      <!-- Header with Welcome and Logout -->
      <div class="flex items-center justify-between mb-12">
        <div>
          <h1 class="text-5xl font-bold text-white mb-2">
            Your Cabinet
          </h1>
          <p class="text-xl text-[#999999]">
            Welcome back, <span class="text-white font-semibold">{{ userEmail }}</span>
          </p>
        </div>
        <button
          @click="handleLogout"
          class="px-6 py-3 border border-[#999999] text-[#999999] rounded-lg font-semibold hover:border-white hover:text-white transition"
        >
          Sign Out
        </button>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-8">
          <p class="text-[#999999] text-sm mb-2">Total Projects</p>
          <p class="text-4xl font-bold text-white">
            {{ stats.totalProjects }}
          </p>
        </div>

        <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-8">
          <p class="text-[#999999] text-sm mb-2">Total Spent</p>
          <p class="text-4xl font-bold text-white">
            €{{ stats.totalSpent.toLocaleString() }}
          </p>
        </div>

        <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-8">
          <p class="text-[#999999] text-sm mb-2">Active Websites</p>
          <p class="text-4xl font-bold text-[#0033ff]">
            {{ stats.activeWebsites }}
          </p>
        </div>
      </div>

      <!-- Orders Section -->
      <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-8 mb-12">
        <h2 class="text-2xl font-bold text-white mb-8">Your Orders</h2>

        <div v-if="orders.length === 0" class="text-center py-12">
          <div class="mb-6 p-4 bg-[#333]/50 border border-[#555] rounded-lg">
            <p class="text-[#999999] text-sm mb-2">Searching for orders with email: <span class="text-white font-semibold">{{ userEmail }}</span></p>
            <p class="text-[#666] text-xs">If you paid with a different email, you may need to use that email to sign in.</p>
          </div>
          <p class="text-[#999999] mb-6">No orders found</p>
          <div class="space-y-3">
            <NuxtLink
              to="/pricing"
              class="block px-6 py-3 bg-[#0033ff] text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              View Pricing Plans
            </NuxtLink>
            <button
              @click="handleLogout"
              class="block w-full px-6 py-3 bg-[#1a1a1a] border border-[#333] text-[#999999] rounded-lg font-semibold hover:border-white hover:text-white transition"
            >
              Sign in with Different Email
            </button>
          </div>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="order in orders"
            :key="order.id"
            @click="openOrderDetails(order)"
            class="bg-[#0f0f0f] border border-[#333] rounded-lg p-6 cursor-pointer hover:border-[#0033ff] transition"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <p class="text-white font-semibold mb-1">
                  {{ order.title || 'Website Design Package' }}
                </p>
                <p class="text-[#999999] text-sm">
                  {{ formatDate(order.payment_date || order.created_at) }}
                </p>
              </div>

              <div class="text-right ml-4">
                <p class="text-white font-bold text-xl mb-1">
                  €{{ (order.amount || 0).toLocaleString() }}
                </p>
                <span
                  :class="[
                    'inline-block px-3 py-1 rounded text-sm font-semibold',
                    getStatusColor(order.status),
                  ]"
                >
                  {{ formatStatus(order.status) }}
                </span>
              </div>
            </div>

            <!-- Quick preview of form data -->
            <div v-if="order.form_data" class="mt-4 pt-4 border-t border-[#333]">
              <div class="text-xs text-[#999999] space-y-1">
                <p v-if="typeof order.form_data === 'string' && JSON.parse(order.form_data)?.intakeFormData?.service">
                  <span class="text-white">Service:</span> {{ JSON.parse(order.form_data).intakeFormData.service }}
                </p>
                <p v-if="typeof order.form_data === 'string' && JSON.parse(order.form_data)?.billingData?.fullName">
                  <span class="text-white">Client:</span> {{ JSON.parse(order.form_data).billingData.fullName }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Details Modal -->
      <Teleport to="body">
        <div
          v-if="showOrderDetails"
          class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          @click.self="closeOrderDetails"
        >
          <div class="bg-[#1a1a1a] border border-[#333] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <!-- Modal Header -->
            <div class="sticky top-0 bg-[#1a1a1a] border-b border-[#333] p-6 flex items-center justify-between">
              <h3 class="text-2xl font-bold text-white">Order Details</h3>
              <button
                @click="closeOrderDetails"
                class="text-[#999999] hover:text-white transition text-2xl"
              >
                ✕
              </button>
            </div>

            <!-- Modal Content -->
            <div class="p-6 space-y-6">
              <!-- Order Info -->
              <div class="bg-[#0f0f0f] border border-[#333] rounded-lg p-6">
                <h4 class="text-lg font-bold text-white mb-4">Order Information</h4>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p class="text-[#999999] mb-1">Order Title</p>
                    <p class="text-white font-semibold">{{ selectedOrder?.title || 'Website Design Package' }}</p>
                  </div>
                  <div>
                    <p class="text-[#999999] mb-1">Status</p>
                    <span
                      :class="[
                        'inline-block px-3 py-1 rounded text-sm font-semibold',
                        getStatusColor(selectedOrder?.status),
                      ]"
                    >
                      {{ formatStatus(selectedOrder?.status) }}
                    </span>
                  </div>
                  <div>
                    <p class="text-[#999999] mb-1">Amount</p>
                    <p class="text-white font-semibold">€{{ (selectedOrder?.amount || 0).toLocaleString() }}</p>
                  </div>
                  <div>
                    <p class="text-[#999999] mb-1">Payment Date</p>
                    <p class="text-white font-semibold">
                      {{ formatDate(selectedOrder?.payment_date || selectedOrder?.created_at) }}
                    </p>
                  </div>
                  <div v-if="selectedOrder?.stripe_charge_id" class="col-span-2">
                    <p class="text-[#999999] mb-1">Stripe Charge ID</p>
                    <p class="text-white font-semibold text-xs break-all">{{ selectedOrder?.stripe_charge_id }}</p>
                  </div>
                </div>
              </div>

              <!-- Form Data -->
              <div
                v-if="selectedOrder?.form_data"
                class="bg-[#0f0f0f] border border-[#333] rounded-lg p-6"
              >
                <h4 class="text-lg font-bold text-white mb-4">Form Data</h4>
                <div class="space-y-4">
                  <!-- Parse and display form data -->
                  <div v-if="typeof selectedOrder.form_data === 'string'">
                    <FormDataDisplay :data="JSON.parse(selectedOrder.form_data)" />
                  </div>
                  <div v-else>
                    <FormDataDisplay :data="selectedOrder.form_data" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- Projects Section -->
      <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-8 mb-12">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold text-white">Your Projects</h2>
          <NuxtLink
            to="/pricing"
            class="px-6 py-3 bg-[#0033ff] text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            + New Project
          </NuxtLink>
        </div>

        <div v-if="projects.length === 0" class="text-center py-12">
          <p class="text-[#999999] mb-4">No projects yet</p>
          <p class="text-[#999999] text-sm">
            Get started by creating your first website
          </p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="project in projects"
            :key="project.id"
            class="bg-[#0f0f0f] border border-[#333] rounded-lg p-6 hover:border-[#0033ff] transition"
          >
            <div class="flex items-start justify-between mb-4">
              <h3 class="text-white font-bold text-lg">
                {{ project.name }}
              </h3>
              <span
                :class="[
                  'px-3 py-1 rounded text-sm font-semibold',
                  project.status === 'active'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-yellow-500/20 text-yellow-400',
                ]"
              >
                {{ project.status }}
              </span>
            </div>

            <p class="text-[#999999] text-sm mb-4">
              {{ project.description }}
            </p>

            <div class="mb-6">
              <p class="text-[#999999] text-xs mb-2">Progress</p>
              <div class="w-full bg-[#1a1a1a] rounded-full h-2">
                <div
                  class="bg-[#0033ff] h-2 rounded-full"
                  :style="{ width: `${project.progress}%` }"
                ></div>
              </div>
            </div>

            <a
              :href="project.url"
              target="_blank"
              class="inline-block px-4 py-2 border border-[#0033ff] text-[#0033ff] rounded-lg text-sm font-semibold hover:bg-[#0033ff] hover:text-white transition"
            >
              View Website →
            </a>
          </div>
        </div>
      </div>

      <!-- AI Assistant - Briefing Section -->
      <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-8 mb-12">
        <div class="flex items-center gap-3 mb-8">
          <h2 class="text-2xl font-bold text-white">🤖 AI Briefing Assistant</h2>
          <span class="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">active</span>
        </div>

        <div class="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p class="text-[#d4d4d4] text-sm">
            Get professional briefing assistance for your projects. Upload documents, define workflows, and let our AI help fill your briefs.
          </p>
        </div>

        <ChatInterface :agentType="'briefing'" :userEmail="userEmail" />
      </div>

      <!-- Account Settings Section -->
      <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-8">
        <h2 class="text-2xl font-bold text-white mb-8">Account Settings</h2>

        <div class="space-y-6">
          <div class="pb-6 border-b border-[#333]">
            <p class="text-white font-semibold mb-2">Email Address</p>
            <p class="text-[#999999]">{{ userEmail }}</p>
          </div>

          <div class="pb-6 border-b border-[#333]">
            <p class="text-white font-semibold mb-4">Password</p>
            <button
              class="px-6 py-3 border border-[#999999] text-[#999999] rounded-lg font-semibold hover:border-white hover:text-white transition"
            >
              Change Password
            </button>
          </div>

          <div>
            <p class="text-white font-semibold mb-4">Billing Information</p>
            <button
              class="px-6 py-3 border border-[#999999] text-[#999999] rounded-lg font-semibold hover:border-white hover:text-white transition"
            >
              Manage Billing
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <FooterSection />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ParticleEffect from '@/components/effects/ParticleEffect.vue'
import GlowBlue from '@/components/effects/GlowBlue.vue'
import FormDataDisplay from '@/components/FormDataDisplay.vue'
import ChatInterface from '@/components/ChatInterface.vue'
import { useGoogleAuth } from '@/composables/useGoogleAuth'
import { useNocoBase } from '@/composables/useNocoBase'

const { logout, getCurrentUser, getToken } = useGoogleAuth()
const { getList } = useNocoBase()

const userEmail = ref('')
const orders = ref<any[]>([])
const projects = ref<any[]>([])
const selectedOrder = ref<any>(null)
const showOrderDetails = ref(false)

const stats = ref({
  totalProjects: 0,
  totalSpent: 0,
  activeWebsites: 0,
})

const formatDate = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'paid': 'Paid',
    'pending': 'Pending',
    'cancelled': 'Cancelled',
    'refunded': 'Refunded',
    'failed': 'Failed',
  }
  return statusMap[status] || status
}

const handleLogout = async () => {
  await logout()
  navigateTo('/login')
}

const openOrderDetails = (order: any) => {
  selectedOrder.value = order
  showOrderDetails.value = true
}

const closeOrderDetails = () => {
  showOrderDetails.value = false
  selectedOrder.value = null
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-green-500/20 text-green-400'
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-400'
    case 'failed':
      return 'bg-red-500/20 text-red-400'
    case 'refunded':
      return 'bg-orange-500/20 text-orange-400'
    default:
      return 'bg-gray-500/20 text-gray-400'
  }
}

onMounted(async () => {
  // Check if user is authenticated via Google Auth
  const user = getCurrentUser()
  const token = getToken()

  // Also check localStorage for stored user
  const storedUser = localStorage.getItem('user')
  const storedToken = localStorage.getItem('authToken')
  const paymentUser = localStorage.getItem('paymentResult')

  if (!user && !storedUser) {
    navigateTo('/login')
    return
  }

  // Use current user (e.g., from Google Sign-In), fall back to stored user
  const currentUser = user || (storedUser ? JSON.parse(storedUser) : null)
  userEmail.value = currentUser?.email || ''
  const authToken = token || storedToken

  console.log('📋 Cabinet Debug Info:')
  console.log('  Current User Email:', userEmail.value)
  if (paymentUser) {
    const paymentData = JSON.parse(paymentUser)
    console.log('  Payment Email:', paymentData.email)
    console.log('  ⚠️ Emails Match:', userEmail.value === paymentData.email)
  }

  // Open chat with ACTIVE briefing mode when cabinet loads
  const { openChatInMode, detectContext, initializeChat } = useAIChat()
  await detectContext()
  openChatInMode('active')
  await initializeChat()

  try {
    // Fetch user's orders via secure backend endpoint
    const ordersResponse = await fetch('/api/user/orders', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (ordersResponse.ok) {
      const ordersData = await ordersResponse.json()
      orders.value = (ordersData.data || []).sort((a, b) => {
        const dateA = new Date(a.payment_date || a.created_at || 0).getTime()
        const dateB = new Date(b.payment_date || b.created_at || 0).getTime()
        return dateB - dateA
      })
    }

    // Fetch user's projects via secure backend endpoint
    const projectsResponse = await fetch('/api/user/projects', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (projectsResponse.ok) {
      const projectsData = await projectsResponse.json()
      projects.value = projectsData.data || []
    }

    // Calculate stats
    stats.value.totalProjects = projects.value.length
    stats.value.totalSpent = orders.value.reduce((sum, order) => {
      if (order.status === 'paid') {
        return sum + (order.amount || 0)
      }
      return sum
    }, 0)
    stats.value.activeWebsites = projects.value.filter((p: any) => p.status === 'in_progress').length
  } catch (error) {
    console.error('Error fetching data:', error)
    // Silently fail - show empty state
  }
})

// SEO
const siteUrl = useRuntimeConfig().public?.siteUrl

useSeoMeta({
  title: 'Cabinet | SiteSynth',
  description: 'Manage your SiteSynth projects and account settings.',
  ogTitle: 'Cabinet | SiteSynth',
  ogDescription: 'Your personal SiteSynth dashboard.',
  ogImage: `${siteUrl}/assets/shareimage.png`,
})
</script>
