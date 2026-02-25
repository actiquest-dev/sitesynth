<template>
  <div class="flex h-screen bg-[#161616]">
    <!-- Sidebar -->
    <div class="w-64 bg-[#0f0f0f] border-r border-[#333] overflow-y-auto">
      <div class="p-6 space-y-8">
        <!-- User Info -->
        <div>
          <p class="text-white font-semibold">{{ userEmail.split('@')[0] }}</p>
          <p class="text-xs text-[#999999]">📌 Same-Day Cutoff: 12 PM EST</p>
        </div>

        <!-- Navigation -->
        <nav class="space-y-2">
          <button
            @click="activeTab = 'dashboard'"
            :class="[
              'w-full text-left px-4 py-2 rounded transition',
              activeTab === 'dashboard'
                ? 'bg-[#1a1a1a] text-white'
                : 'text-[#999999] hover:text-white',
            ]"
          >
            📅 Dashboard
          </button>

          <button
            @click="activeTab = 'projects'"
            :class="[
              'w-full text-left px-4 py-2 rounded transition',
              activeTab === 'projects'
                ? 'bg-[#0033ff] text-white'
                : 'text-[#999999] hover:text-white',
            ]"
          >
            📁 Projects
          </button>

          <button
            @click="activeTab = 'templates'"
            :class="[
              'w-full text-left px-4 py-2 rounded transition',
              activeTab === 'templates'
                ? 'bg-[#1a1a1a] text-white'
                : 'text-[#999999] hover:text-white',
            ]"
          >
            📄 Templates
          </button>

          <button
            @click="activeTab = 'brand-profiles'"
            :class="[
              'w-full text-left px-4 py-2 rounded transition',
              activeTab === 'brand-profiles'
                ? 'bg-[#1a1a1a] text-white'
                : 'text-[#999999] hover:text-white',
            ]"
          >
            🎨 Brand Profiles
          </button>
        </nav>

        <!-- Team Tools -->
        <div>
          <p class="text-xs text-[#999999] uppercase tracking-wider mb-3">Team Tools</p>
          <button
            @click="activeTab = 'ai-tools'"
            :class="[
              'w-full text-left px-4 py-2 rounded transition',
              activeTab === 'ai-tools'
                ? 'bg-[#1a1a1a] text-white'
                : 'text-[#999999] hover:text-white',
            ]"
          >
            ⚙️ AI Tools
          </button>
        </div>

        <!-- Pricing -->
        <div class="space-y-2">
          <p class="text-xs text-[#999999]">👑 4 Daily Hours Plan</p>
          <div class="w-full bg-[#1a1a1a] rounded h-2">
            <div class="bg-[#0033ff] h-2 rounded" style="width: 60%"></div>
          </div>
        </div>

        <!-- Settings -->
        <button
          @click="activeTab = 'settings'"
          class="w-full text-left px-4 py-2 rounded text-[#999999] hover:text-white transition"
        >
          ⚙️ Settings
        </button>

        <!-- Logout -->
        <button
          @click="handleLogout"
          class="w-full text-left px-4 py-2 rounded text-[#AA3733] hover:text-red-400 transition"
        >
          🚪 Logout
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-y-auto">
      <!-- Header -->
      <div class="bg-[#161616] border-b border-[#333] p-6 sticky top-0 z-10">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-white">
            {{ tabTitles[activeTab] || 'Projects' }}
          </h1>
          <button
            v-if="activeTab === 'projects'"
            @click="showCreateRequest = true"
            class="px-6 py-2 bg-[#0033ff] text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            ➕ CREATE REQUEST
          </button>
        </div>
      </div>

      <!-- Content Area -->
      <div class="p-6">
        <!-- Projects Tab -->
        <div v-if="activeTab === 'projects'" class="space-y-6">
          <!-- Tabs -->
          <div class="flex gap-4 border-b border-[#333]">
            <button
              @click="requestsFilter = 'queue'"
              :class="[
                'px-4 py-2 font-semibold transition border-b-2',
                requestsFilter === 'queue'
                  ? 'text-white border-[#0033ff]'
                  : 'text-[#999999] border-transparent',
              ]"
            >
              Queue
            </button>
            <button
              @click="requestsFilter = 'delivered'"
              :class="[
                'px-4 py-2 font-semibold transition border-b-2',
                requestsFilter === 'delivered'
                  ? 'text-white border-[#0033ff]'
                  : 'text-[#999999] border-transparent',
              ]"
            >
              Delivered
            </button>
            <button
              @click="requestsFilter = 'draft'"
              :class="[
                'px-4 py-2 font-semibold transition border-b-2',
                requestsFilter === 'draft'
                  ? 'text-white border-[#0033ff]'
                  : 'text-[#999999] border-transparent',
              ]"
            >
              Draft
            </button>
          </div>

          <!-- Search & Filter -->
          <div class="flex gap-4">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search requests..."
              class="flex-1 px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded text-white placeholder-[#555] focus:border-[#0033ff] outline-none"
            />
            <button class="px-6 py-2 border border-[#333] text-[#999999] rounded hover:text-white transition">
              🔽 FILTER
            </button>
          </div>

          <!-- Requests Table -->
          <div class="bg-[#1a1a1a] border border-[#333] rounded overflow-hidden">
            <table class="w-full">
              <thead class="bg-[#0f0f0f] border-b border-[#333]">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-[#999999]">Name</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-[#999999]">Status</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-[#999999]">Brand</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-[#999999]">Designer(s)</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-[#999999]">Design</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-[#999999]">Owner</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-[#999999]">Last Updated</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#333]">
                <tr
                  v-for="request in filteredRequests"
                  :key="request.id"
                  class="hover:bg-[#0f0f0f] transition cursor-pointer"
                >
                  <td class="px-6 py-3 text-white font-semibold">{{ request.name }}</td>
                  <td class="px-6 py-3">
                    <span
                      :class="[
                        'px-3 py-1 rounded text-sm font-semibold',
                        request.status === 'ongoing'
                          ? 'bg-purple-500/20 text-purple-400'
                          : request.status === 'completed'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400',
                      ]"
                    >
                      {{ request.status }}
                    </span>
                  </td>
                  <td class="px-6 py-3 text-[#999999]">
                    <div class="w-6 h-6 rounded-full" :style="{ backgroundColor: request.brandColor }"></div>
                  </td>
                  <td class="px-6 py-3 text-[#999999]">{{ request.designer }}</td>
                  <td class="px-6 py-3 text-[#999999]">{{ request.design }}</td>
                  <td class="px-6 py-3 text-[#999999]">{{ request.owner }}</td>
                  <td class="px-6 py-3 text-[#999999] text-sm">{{ request.lastUpdated }}</td>
                </tr>
              </tbody>
            </table>
            <div v-if="filteredRequests.length === 0" class="p-8 text-center text-[#999999]">
              No requests found
            </div>
          </div>
        </div>

        <!-- Templates Tab -->
        <div v-if="activeTab === 'templates'" class="space-y-6">
          <button
            class="px-6 py-2 bg-[#0033ff] text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            ➕ CREATE TEMPLATE
          </button>
          <div class="grid grid-cols-3 gap-6">
            <div
              v-for="template in templates"
              :key="template.id"
              class="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 hover:border-[#0033ff] transition cursor-pointer"
            >
              <h3 class="text-white font-semibold mb-2">{{ template.name }}</h3>
              <p class="text-[#999999] text-sm">{{ template.description }}</p>
            </div>
          </div>
        </div>

        <!-- Brand Profiles Tab -->
        <div v-if="activeTab === 'brand-profiles'" class="space-y-6">
          <button
            class="px-6 py-2 bg-[#0033ff] text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            ➕ CREATE BRAND
          </button>
          <div class="grid grid-cols-2 gap-6">
            <div v-for="brand in brands" :key="brand.id" class="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
              <div class="flex items-center justify-between mb-6">
                <div class="w-16 h-16 rounded-full flex items-center justify-center" :style="{ backgroundColor: brand.color }">
                  <span class="text-3xl">{{ brand.icon }}</span>
                </div>
                <button class="text-[#999999] hover:text-white">⋯</button>
              </div>
              <h3 class="text-white font-semibold mb-4">{{ brand.name }}</h3>

              <!-- Important Links -->
              <div class="mb-6 pb-6 border-b border-[#333]">
                <p class="text-[#999999] text-sm mb-2">Important Links</p>
                <p class="text-xs text-[#666] space-y-1">
                  <div>Website: {{ brand.website }}</div>
                  <div>Instagram: {{ brand.instagram }}</div>
                </p>
              </div>

              <!-- Brand Colors -->
              <div class="mb-6 pb-6 border-b border-[#333]">
                <p class="text-[#999999] text-sm mb-3">Brand Colors</p>
                <div class="space-y-2">
                  <div v-for="color in brand.colors" :key="color.name" class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded" :style="{ backgroundColor: color.hex }"></div>
                    <div>
                      <p class="text-white text-sm">{{ color.name }}</p>
                      <p class="text-[#999999] text-xs">{{ color.hex }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Upload Files -->
              <div
                class="border-2 border-dashed border-[#333] rounded p-6 text-center hover:border-[#0033ff] transition"
              >
                <p class="text-[#999999]">📤 Upload your files</p>
              </div>
            </div>
          </div>
        </div>

        <!-- AI Tools Tab -->
        <div v-if="activeTab === 'ai-tools'" class="space-y-6">
          <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-8">
            <div class="max-w-2xl">
              <h2 class="text-2xl font-bold text-white mb-4">AI Copywriting Assistant</h2>
              <p class="text-[#999999] mb-6">
                Generate compelling copy for your projects using AI-powered tools
              </p>

              <div class="space-y-4">
                <div>
                  <label class="block text-white font-semibold mb-2">Topic</label>
                  <input
                    type="text"
                    placeholder="What do you need help with?"
                    class="w-full px-4 py-2 bg-[#0f0f0f] border border-[#333] rounded text-white placeholder-[#555] focus:border-[#0033ff] outline-none"
                  />
                </div>

                <div>
                  <label class="block text-white font-semibold mb-2">Brand Profile (Optional)</label>
                  <select class="w-full px-4 py-2 bg-[#0f0f0f] border border-[#333] rounded text-white focus:border-[#0033ff] outline-none">
                    <option value="">Select a brand profile</option>
                    <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                      {{ brand.name }}
                    </option>
                  </select>
                </div>

                <button class="w-full px-6 py-3 bg-[#0033ff] text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                  ✨ Generate Copy
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Settings Tab -->
        <div v-if="activeTab === 'settings'" class="space-y-6 max-w-2xl">
          <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
            <h2 class="text-xl font-bold text-white mb-4">Account Settings</h2>
            <div class="space-y-4">
              <div>
                <p class="text-[#999999] text-sm mb-2">Email</p>
                <p class="text-white">{{ userEmail }}</p>
              </div>
              <div>
                <p class="text-[#999999] text-sm mb-2">Plan</p>
                <p class="text-white">4 Daily Hours Plan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Request Modal -->
    <Teleport v-if="showCreateRequest" to="body">
      <div class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" @click.self="showCreateRequest = false">
        <div class="bg-[#1a1a1a] border border-[#333] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="sticky top-0 bg-[#1a1a1a] border-b border-[#333] p-6 flex items-center justify-between">
            <h2 class="text-2xl font-bold text-white">Create New Request</h2>
            <button @click="showCreateRequest = false" class="text-[#999999] hover:text-white text-2xl">✕</button>
          </div>

          <div class="p-6 space-y-6">
            <div>
              <label class="block text-white font-semibold mb-2">Request Name</label>
              <input
                type="text"
                placeholder="Name your request"
                class="w-full px-4 py-2 bg-[#0f0f0f] border border-[#333] rounded text-white placeholder-[#555] focus:border-[#0033ff] outline-none"
              />
            </div>

            <div>
              <label class="block text-white font-semibold mb-2">Choose a brand</label>
              <select class="w-full px-4 py-2 bg-[#0f0f0f] border border-[#333] rounded text-white focus:border-[#0033ff] outline-none">
                <option value="">Select a brand</option>
                <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                  {{ brand.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-white font-semibold mb-2">Choose a category</label>
              <div class="grid grid-cols-3 gap-4">
                <button
                  v-for="category in categories"
                  :key="category.id"
                  class="p-4 border-2 border-[#333] rounded hover:border-[#0033ff] transition text-center"
                >
                  <p class="text-3xl mb-2">{{ category.icon }}</p>
                  <p class="text-white text-sm">{{ category.name }}</p>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-white font-semibold mb-2">Description</label>
              <textarea
                placeholder="Describe your request..."
                rows="5"
                class="w-full px-4 py-2 bg-[#0f0f0f] border border-[#333] rounded text-white placeholder-[#555] focus:border-[#0033ff] outline-none"
              ></textarea>
            </div>

            <div class="flex gap-4">
              <button
                @click="showCreateRequest = false"
                class="flex-1 px-6 py-2 border border-[#333] text-[#999999] rounded-lg hover:text-white transition"
              >
                Cancel
              </button>
              <button
                class="flex-1 px-6 py-2 bg-[#0033ff] text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Create Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGoogleAuth } from '@/composables/useGoogleAuth'

const { logout: logoutAuth } = useGoogleAuth()

const activeTab = ref('projects')
const requestsFilter = ref('queue')
const searchQuery = ref('')
const showCreateRequest = ref(false)

const userEmail = ref('user@example.com')

const tabTitles = {
  dashboard: 'Dashboard',
  projects: 'Projects',
  templates: 'Templates',
  'brand-profiles': 'Brand Profiles',
  'ai-tools': 'AI Tools',
  settings: 'Settings',
}

const requests = ref([
  {
    id: 1,
    name: '#000001 - Instagram Ad',
    status: 'ongoing',
    brand: 'Nexora',
    brandColor: '#1e3a5f',
    designer: 'John Doe',
    design: 'Illustration',
    owner: 'Michael',
    lastUpdated: '20 Oct, 14:28 PM',
  },
  {
    id: 2,
    name: 'Logo Design',
    status: 'ongoing',
    brand: 'Nexora',
    brandColor: '#1e3a5f',
    designer: 'Jane Smith',
    design: 'Brand Identity',
    owner: 'Sarah',
    lastUpdated: '19 Oct, 10:15 AM',
  },
])

const templates = ref([
  { id: 1, name: 'Instagram Campaign', description: 'Social media posts template' },
  { id: 2, name: 'Web Design', description: 'Landing page template' },
])

const brands = ref([
  {
    id: 1,
    name: 'Trisarah Topbooks',
    icon: '🌿',
    color: '#7c3aed',
    website: 'www.trisarahtopsbooks.com',
    instagram: 'www.instagram.com/trisarahtopsbooks',
    colors: [
      { name: 'Dino Green', hex: '#00d066', type: 'Primary' },
      { name: 'Lava Orange', hex: '#ff7714', type: 'Secondary' },
    ],
  },
])

const categories = ref([
  { id: 1, name: 'Digital Design', icon: '🎨' },
  { id: 2, name: 'Print Design', icon: '🖨️' },
  { id: 3, name: 'Web Design', icon: '💻' },
  { id: 4, name: 'Motion Graphics', icon: '🎬' },
  { id: 5, name: 'Illustration', icon: '🖼️' },
  { id: 6, name: 'Video Editing', icon: '📹' },
])

const filteredRequests = computed(() => {
  return requests.value.filter((req) => {
    const matchesSearch = req.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesFilter =
      requestsFilter.value === 'queue' ? req.status === 'ongoing' :
      requestsFilter.value === 'delivered' ? req.status === 'completed' :
      req.status === 'draft'

    return matchesSearch && matchesFilter
  })
})

const handleLogout = async () => {
  await logoutAuth()
  await navigateTo('/login')
}

// Initialize user email from localStorage and fetch user's projects
onMounted(async () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (user.email) {
    userEmail.value = user.email
  }

  const authToken = localStorage.getItem('authToken')
  if (authToken) {
    try {
      // Fetch user's projects via secure backend endpoint
      const response = await fetch('/api/user/projects', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        requests.value = data.data || []
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }
})
</script>
