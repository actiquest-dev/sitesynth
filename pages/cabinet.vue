<template>
  <div class="flex h-screen bg-[#161616] text-white overflow-hidden">

    <!-- Sidebar -->
    <aside class="w-60 flex-shrink-0 border-r border-[#333] flex flex-col" style="background: linear-gradient(180deg, #1a1a1a 0%, #161616 100%);">
      <!-- Logo (h-14 matches topbar) -->
      <div class="px-5 h-14 flex items-center border-b border-[#333] relative flex-shrink-0">
        <div class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#8D35FF] via-[#8D35FF]/50 to-transparent"></div>
        <NuxtLink to="/" class="flex items-center">
          <img src="/assets/Vector.svg" alt="SiteSynth" class="h-7 w-auto" />
        </NuxtLink>
      </div>

      <!-- Nav -->
      <nav class="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'w-full flex items-center gap-3 py-2 rounded-none text-sm transition-all text-left relative',
            activeTab === tab.id
              ? 'bg-[#8D35FF]/10 text-[#8D35FF] pl-[14px] pr-3'
              : 'text-[#888] hover:text-white hover:bg-white/5 px-3'
          ]"
        >
          <!-- Active left border -->
          <span v-if="activeTab === tab.id" class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#8D35FF] rounded-r-full"></span>
          <svg viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 flex-shrink-0">
            <path :d="iconPaths[tab.icon]" />
          </svg>
          {{ tab.label }}
        </button>
      </nav>

      <!-- User -->
      <div class="px-3 py-4 border-t border-[#333]">
        <div class="flex items-center gap-3 px-3 py-2 mb-1">
          <div class="w-7 h-7 rounded-full bg-[#8D35FF]/20 flex items-center justify-center text-xs font-medium text-[#8D35FF] flex-shrink-0">
            {{ userInitial }}
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-xs text-white font-medium truncate">{{ userEmail }}</p>
          </div>
        </div>
        <button
          @click="handleLogout"
          class="w-full flex items-center gap-3 px-3 py-2 rounded-none text-sm text-[#888] hover:text-white hover:bg-white/5 transition-all"
          style="font-family: Inter, sans-serif"
        >
            <svg viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 flex-shrink-0"><path :d="iconPaths.logout" /></svg>
          Log Out
        </button>
      </div>
    </aside>

    <!-- Main -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">

      <!-- Top bar -->
      <header class="h-14 border-b border-[#333] flex items-center justify-between px-6 flex-shrink-0">
        <div class="flex items-center gap-2 text-sm text-[#888]">
          <span class="text-[#555]">Dashboard</span>
          <span class="text-[#444]">/</span>
          <span class="text-white font-medium">{{ currentTab?.label }}</span>
        </div>
        <div class="flex items-center gap-2.5">
          <span class="text-xs text-[#555] hidden sm:block">{{ userEmail }}</span>
          <div class="w-7 h-7 rounded-full bg-[#8D35FF]/20 flex items-center justify-center text-xs font-medium text-[#8D35FF]">
            {{ userInitial }}
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="flex-1 overflow-y-auto bg-[#121212]">
        <ClientOnly>

          <!-- ── OVERVIEW ── -->
          <div v-if="activeTab === 'overview'" class="mx-auto w-full max-w-[1240px] px-6 py-8">
            <div class="mb-8">
              <h2 class="text-xl font-semibold text-white mb-1">{{ greeting }}, <span class="text-[#8D35FF]">{{ userName }}</span></h2>
              <p class="text-sm text-[#555]">Here's what's happening with your projects today.</p>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div class="border border-[#333] rounded-none p-5 min-h-[132px] bg-[#1a1a1a] group hover:border-[#555] transition-colors">
                <div class="flex items-center justify-between mb-4">
                  <p class="text-xs text-[#666] uppercase tracking-wider font-medium">Total Projects</p>
                  <div class="w-7 h-7 rounded-none bg-white/5 flex items-center justify-center text-[#555]">
                    <svg viewBox="0 0 16 16" fill="currentColor" class="w-3.5 h-3.5"><path :d="iconPaths.folder" /></svg>
                  </div>
                </div>
                <p class="text-3xl font-semibold text-white tabular-nums">{{ stats.totalProjects }}</p>
              </div>
              <div class="border border-[#333] rounded-none p-5 min-h-[132px] bg-[#1a1a1a] group hover:border-[#555] transition-colors">
                <div class="flex items-center justify-between mb-4">
                  <p class="text-xs text-[#666] uppercase tracking-wider font-medium">Total Spent</p>
                  <div class="w-7 h-7 rounded-none bg-white/5 flex items-center justify-center text-[#555]">
                    <svg viewBox="0 0 16 16" fill="currentColor" class="w-3.5 h-3.5"><path :d="iconPaths.package" /></svg>
                  </div>
                </div>
                <p class="text-3xl font-semibold text-white tabular-nums">€{{ stats.totalSpent.toLocaleString() }}</p>
              </div>
              <div class="border border-[#8D35FF]/30 rounded-none p-5 min-h-[132px] bg-[#8D35FF]/5 group hover:border-[#8D35FF]/50 transition-colors">
                <div class="flex items-center justify-between mb-4">
                  <p class="text-xs text-[#8D35FF]/70 uppercase tracking-wider font-medium">Active Websites</p>
                  <div class="w-7 h-7 rounded-none bg-[#8D35FF]/10 flex items-center justify-center text-[#8D35FF]">
                    <svg viewBox="0 0 16 16" fill="currentColor" class="w-3.5 h-3.5"><path :d="iconPaths.globe" /></svg>
                  </div>
                </div>
                <p class="text-3xl font-semibold text-[#8D35FF] tabular-nums">{{ stats.activeWebsites }}</p>
              </div>
            </div>

            <!-- Recent Orders -->
            <div class="border border-[#333] rounded-none overflow-hidden bg-[#1a1a1a]">
              <div class="flex items-center justify-between px-5 py-4 border-b border-[#333]">
                <div class="flex items-center gap-2">
                  <h3 class="text-sm font-medium text-white">Recent Orders</h3>
                  <span v-if="orders.length > 0" class="px-1.5 py-0.5 rounded-none text-xs bg-[#8D35FF]/10 text-[#8D35FF] tabular-nums">{{ orders.length }}</span>
                </div>
                <button @click="activeTab = 'orders'" class="text-xs text-[#555] hover:text-[#8D35FF] transition-colors flex items-center gap-1">
                  View all
                  <svg viewBox="0 0 16 16" fill="currentColor" class="w-3 h-3"><path d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z"/></svg>
                </button>
              </div>
              <div v-if="orders.length === 0" class="px-5 py-12 text-center">
                <div class="w-10 h-10 rounded-none border border-[#333] flex items-center justify-center mx-auto mb-3 text-[#444]">
                  <svg viewBox="0 0 16 16" fill="currentColor" class="w-5 h-5"><path :d="iconPaths.package" /></svg>
                </div>
                <p class="text-sm text-[#666] mb-1">No orders yet</p>
                <button @click="activeTab = 'orders'" class="text-xs text-[#8D35FF] hover:underline mt-1">Browse pricing →</button>
              </div>
              <div v-else>
                <div
                  v-for="order in orders.slice(0, 4)"
                  :key="order.id"
                  @click="openOrderDetails(order)"
                  class="flex items-center justify-between px-5 py-3.5 border-b border-[#333] last:border-0 hover:bg-white/5 cursor-pointer transition-colors group"
                >
                  <div class="flex items-center gap-3 min-w-0">
                    <span :class="['w-2 h-2 rounded-full flex-shrink-0', statusDotClass(order.status)]"></span>
                    <div class="min-w-0">
                      <p class="text-sm text-white truncate">{{ order.order_number || order.title || 'Website Design Package' }}</p>
                      <p class="text-xs text-[#666] mt-0.5">{{ timeAgo(order.created_at) }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-4 flex-shrink-0 ml-4">
                    <span class="text-sm font-medium text-white tabular-nums">€{{ (order.amount || 0).toLocaleString() }}</span>
                    <span :class="['inline-block px-2 py-0.5 rounded-none text-xs font-medium', statusBadgeInfo(order.status).cls]">{{ statusBadgeInfo(order.status).label }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ── ORDERS ── -->
          <div v-if="activeTab === 'orders'" class="mx-auto w-full max-w-[1240px] px-6 py-8">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-xl font-semibold text-white mb-1">Orders</h2>
                <p class="text-sm text-[#666]">{{ orders.length }} order{{ orders.length !== 1 ? 's' : '' }}</p>
              </div>
              <NuxtLink
                to="/pricing"
                class="inline-flex h-10 items-center gap-2 px-4 bg-[#8D35FF] text-white rounded-none text-sm font-medium hover:bg-[#7B2AE8] transition-colors"
              >
                <svg viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4"><path :d="iconPaths.plus" /></svg>
                New Order
              </NuxtLink>
            </div>

            <!-- Empty -->
            <div v-if="orders.length === 0" class="border border-[#333] rounded-none bg-[#1a1a1a]">
              <div class="py-16 text-center px-6">
                <div class="w-10 h-10 rounded-none border border-[#333] flex items-center justify-center mx-auto mb-4 text-[#444]">
                  <svg viewBox="0 0 16 16" fill="currentColor" class="w-5 h-5"><path :d="iconPaths.package" /></svg>
                </div>
                <p class="text-sm text-white font-medium mb-1">No orders found</p>
                <p class="text-xs text-[#666] mb-5">Signed in as <span class="text-[#888]">{{ userEmail }}</span></p>
                <NuxtLink to="/pricing" class="inline-flex h-10 items-center gap-2 px-4 bg-white text-[#161616] border border-white rounded-none text-sm font-medium hover:bg-[#E7E7E7] hover:border-[#D6D6D6] hover:text-black transition-colors">
                  View Pricing
                </NuxtLink>
              </div>
            </div>

            <!-- Orders Table -->
            <div v-else class="border border-[#333] rounded-none overflow-hidden bg-[#1a1a1a]">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-[#333]">
                    <th class="text-left px-5 py-3 text-xs text-[#666] font-medium uppercase tracking-wider">Order</th>
                    <th class="text-left px-5 py-3 text-xs text-[#666] font-medium uppercase tracking-wider">Date</th>
                    <th class="text-left px-5 py-3 text-xs text-[#666] font-medium uppercase tracking-wider">Status</th>
                    <th class="text-right px-5 py-3 text-xs text-[#666] font-medium uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="order in orders"
                    :key="order.id"
                    @click="openOrderDetails(order)"
                    class="border-b border-[#333] last:border-0 hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <td class="px-5 py-3.5">
                      <div class="flex items-center gap-2.5">
                        <span :class="['w-2 h-2 rounded-full flex-shrink-0', statusDotClass(order.status)]"></span>
                        <span class="text-white font-medium">{{ order.order_number || 'Website Design Package' }}</span>
                      </div>
                    </td>
                    <td class="px-5 py-3.5 text-[#666]">{{ timeAgo(order.created_at) }}</td>
                    <td class="px-5 py-3.5"><span :class="['inline-block px-2 py-0.5 rounded-none text-xs font-medium', statusBadgeInfo(order.status).cls]">{{ statusBadgeInfo(order.status).label }}</span></td>
                    <td class="px-5 py-3.5 text-right text-white font-medium tabular-nums">€{{ (order.amount || 0).toLocaleString() }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- ── PROJECTS (briefs = projects) ── -->
          <div v-if="activeTab === 'projects'" class="mx-auto w-full max-w-[1240px] px-6 py-8">

            <!-- Brief Editor (inline, no modal) -->
            <div v-if="selectedBrief" class="mb-8">
              <div class="flex items-center justify-between mb-4">
                <button @click="handleBackToProjects" class="text-[#999] hover:text-white text-sm flex items-center gap-1 transition">
                  ← Back to projects
                </button>
              <div class="flex gap-3 items-center flex-wrap">
                <div class="flex items-center gap-2">
                  <span :class="['px-2 py-1 rounded-none text-xs font-medium', statusClass]">{{ statusLabel }}</span>
                  <span v-if="lastDraftSource === 'agent' && isDirty" class="px-2 py-1 rounded-none text-xs font-medium bg-[#8D35FF]/10 text-[#C9A7FF] border border-[#8D35FF]/40">Updated by agent</span>
                  <span v-if="!isDirty && lastSavedAt" class="text-xs text-[#666]">Last saved {{ formatDateTime(lastSavedAt) }}</span>
                  <span v-if="isViewingHistory" class="px-2 py-1 rounded-none text-xs font-medium bg-[#1e3a8a]/20 text-[#bfdbfe] border border-[#1e3a8a]/40">Viewing version</span>
                </div>
                <span v-if="changeSummary.length > 0" class="text-xs text-[#b7b7b7]">
                  Updated sections: {{ changeSummary.slice(0, 3).join(', ') }}<span v-if="changeSummary.length > 3"> +{{ changeSummary.length - 3 }}</span>
                </span>
                <div class="relative">
                  <button
                    @click="showHistoryMenu = !showHistoryMenu"
                    class="px-4 py-2 border border-[#333] text-[#bbb] rounded-none hover:bg-[#1a1a1a] transition text-sm"
                  >
                    History
                  </button>
                  <div v-if="showHistoryMenu" class="absolute right-0 top-full mt-2 w-[360px] border border-[#333] bg-[#121212] z-20 p-3 space-y-2">
                    <div class="flex items-center justify-between mb-2">
                      <p class="text-white text-sm font-medium">Version history</p>
                      <button v-if="isViewingHistory" @click="exitHistoryView" class="text-xs text-[#999] hover:text-white">Back to current</button>
                    </div>
                    <div v-if="visibleHistoryItems.length === 0" class="text-xs text-[#666]">No saved versions yet.</div>
                    <div v-for="version in visibleHistoryItems" :key="version.id" class="border border-[#2a2a2a] p-3">
                      <div class="flex items-center justify-between gap-3">
                        <div>
                          <p class="text-sm text-white">
                            {{ version.source === 'current-local-draft' ? 'Current local draft' : (version.source === 'initial-version' ? 'Initial version' : (version.is_current ? 'Current' : (version.version > 0 ? `Version ${version.version}` : 'Local snapshot'))) }}
                          </p>
                          <p class="text-xs text-[#777]">{{ formatDateTime(version.created_at) }} · {{ version.source }}</p>
                        </div>
                        <div class="flex gap-2">
                          <button @click="viewHistoryVersion(version)" class="px-2 py-1 text-xs border border-[#333] text-[#bbb] hover:bg-[#1a1a1a]">View</button>
                          <button @click="restoreHistoryVersion(version)" class="px-2 py-1 text-xs border border-[#8D35FF]/40 text-[#d8c0ff] hover:bg-[#8D35FF]/10">Restore</button>
                          <button
                            @click="toggleCompareVersion(version)"
                            :class="[
                              'px-2 py-1 text-xs border transition',
                              compareVersionId === version.id
                                ? 'border-sky-500/40 bg-sky-500/10 text-sky-300'
                                : 'border-[#333] text-[#bbb] hover:bg-[#1a1a1a]'
                            ]"
                          >
                            {{ compareVersionId === version.id ? 'Close' : 'Compare' }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="isViewingHistory" class="flex items-center gap-2">
                  <button @click="navigateHistory(-1)" class="px-2 py-1 border border-[#333] text-[#999] text-xs hover:bg-[#1a1a1a]">←</button>
                  <button @click="navigateHistory(1)" class="px-2 py-1 border border-[#333] text-[#999] text-xs hover:bg-[#1a1a1a]">→</button>
                </div>
                <!-- Edit/Save Button (toggles based on mode) -->
                <button
                  v-if="briefEditMode"
                  @click="saveBriefEdit"
                  :disabled="isSavingBrief"
                  class="px-6 py-2 bg-[#8D35FF] text-white rounded-none hover:bg-[#7B2AE8] transition disabled:opacity-50 text-sm"
                >
                  {{ isSavingBrief ? 'Saving...' : 'Save' }}
                </button>
                <button
                  v-else
                  @click="briefEditMode = true"
                  class="px-6 py-2 border border-[#333] text-[#999] rounded-none hover:bg-[#1a1a1a] transition text-sm"
                >
                  Edit
                </button>

                <!-- Delete Button (always visible) -->
                <button
                  @click="deleteBrief"
                  class="px-6 py-2 border border-[#333] text-[#999] rounded-none hover:bg-[#1a1a1a] transition text-sm"
                >
                  Delete
                </button>
              </div>
              </div>

              <input
                v-if="briefEditMode"
                v-model="briefEditName"
                class="text-xl font-semibold text-white mb-1 bg-transparent border-b border-[#444] focus:border-[#8D35FF] focus:outline-none w-full pb-1"
                placeholder="Brief name..."
              />
              <h2 v-else class="text-xl font-semibold text-white mb-1">{{ selectedBrief.name || 'Untitled Brief' }}</h2>
              <p class="text-xs text-[#666] mb-6">Created {{ formatDate(selectedBrief.created_at) }}{{ selectedBrief.updated_at ? ' · Updated ' + formatDate(selectedBrief.updated_at) : '' }}</p>

              <div v-if="compareVersion" class="mb-4 border border-[#333] bg-[#161616]">
                <div class="border-b border-[#333] px-4 py-3 flex items-center justify-between gap-4">
                  <div>
                    <div class="font-medium text-white">Comparing {{ compareVersion.version > 0 ? `Version ${compareVersion.version}` : 'Local snapshot' }} vs current draft</div>
                    <div class="text-[#8b8b8b] text-xs mt-1">Left = selected history version. Right = current draft.</div>
                  </div>
                  <div class="flex items-center gap-2 text-xs">
                    <span class="px-2 py-1 border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">Added {{ compareCounts.added }}</span>
                    <span class="px-2 py-1 border border-rose-500/30 bg-rose-500/10 text-rose-300">Removed {{ compareCounts.removed }}</span>
                    <span class="px-2 py-1 border border-sky-500/30 bg-sky-500/10 text-sky-300">Changed {{ compareCounts.changed }}</span>
                    <button @click="compareVersionId = null" class="px-2 py-1 border border-[#333] text-[#bbb] hover:bg-[#1a1a1a]">Close</button>
                  </div>
                </div>
                <div v-if="compareSections.length === 0" class="px-4 py-8 text-sm text-[#777]">No section-level differences detected.</div>
                <div v-else class="grid grid-cols-1 xl:grid-cols-2 gap-px bg-[#333]">
                  <div class="bg-[#121212] px-4 py-3 text-xs uppercase tracking-[0.18em] text-[#7f7f7f]">Compared version</div>
                  <div class="bg-[#121212] px-4 py-3 text-xs uppercase tracking-[0.18em] text-[#7f7f7f]">Current</div>
                  <template v-for="section in compareSections" :key="section.title">
                    <div :class="[
                      'bg-[#0f0f0f] p-4 min-h-[120px]',
                      section.status === 'removed' ? 'compare-removed' : (section.status === 'changed' ? 'compare-changed' : '')
                    ]">
                      <div class="flex items-center justify-between mb-3">
                        <div class="text-white text-sm font-semibold">{{ section.title }}</div>
                        <span v-if="section.status === 'removed'" class="text-[10px] uppercase tracking-[0.16em] text-rose-300">Removed</span>
                        <span v-else-if="section.status === 'changed'" class="text-[10px] uppercase tracking-[0.16em] text-sky-300">Changed</span>
                      </div>
                      <div v-if="section.leftHtml" class="text-sm leading-relaxed text-[#d8d8d8]" v-html="section.leftHtml"></div>
                      <div v-else class="text-sm text-[#666]">No content in this version.</div>
                    </div>
                    <div :class="[
                      'bg-[#0f0f0f] p-4 min-h-[120px]',
                      section.status === 'added' ? 'compare-added' : (section.status === 'changed' ? 'compare-changed' : '')
                    ]">
                      <div class="flex items-center justify-between mb-3">
                        <div class="text-white text-sm font-semibold">{{ section.title }}</div>
                        <span v-if="section.status === 'added'" class="text-[10px] uppercase tracking-[0.16em] text-emerald-300">Added</span>
                        <span v-else-if="section.status === 'changed'" class="text-[10px] uppercase tracking-[0.16em] text-sky-300">Changed</span>
                      </div>
                      <div v-if="section.rightHtml" class="text-sm leading-relaxed text-[#d8d8d8]" v-html="section.rightHtml"></div>
                      <div v-else class="text-sm text-[#666]">No content in current draft.</div>
                    </div>
                  </template>
                </div>
              </div>

              <template v-if="!compareVersion">
                <div class="mt-8 space-y-8">
                  <section class="space-y-4">
                    <div>
                      <h3 class="text-white font-semibold text-lg">Brief</h3>
                      <p class="text-xs text-[#777] mt-1">Core product context, goals, scope, and constraints.</p>
                    </div>

                    <div v-if="briefEditMode" class="space-y-4">
                      <ClientOnly>
                        <RichTextEditor v-model="briefEditContent" />
                        <template #fallback>
                          <textarea
                            v-model="briefEditContent"
                            class="w-full min-h-[400px] px-4 py-3 bg-[#0f0f0f] border border-[#333] text-white text-sm leading-relaxed focus:border-[#8D35FF] focus:outline-none resize-y"
                          ></textarea>
                        </template>
                      </ClientOnly>
                    </div>

                    <div v-else class="bg-[#0f0f0f] border border-[#333] rounded-none p-6">
                      <div
                        class="text-white text-sm whitespace-pre-wrap leading-relaxed"
                        @click="handleBriefContentClick"
                        v-html="formatBriefHtml(selectedBrief.content || '')"
                      ></div>
                    </div>
                  </section>

                  <section class="space-y-4">
                    <div class="flex items-center justify-between gap-4 flex-wrap">
                      <div>
                        <h3 class="text-white font-semibold text-lg">References</h3>
                        <p class="text-xs text-[#777] mt-1">Competitive landscape, screenshots, and recommended visual direction based on the brief.</p>
                      </div>
                      <div class="flex gap-3 flex-wrap">
                        <button
                          @click="openMediaLibrary('references')"
                          class="px-6 py-3 border border-[#2f2f2f] text-white rounded-none hover:bg-[#1f1f1f] transition text-sm"
                        >
                          Media Library
                        </button>
                        <button
                          @click="analyzeReferences"
                          :disabled="isAnalyzingReferences"
                          class="px-6 py-3 border border-[#2f2f2f] text-white rounded-none hover:bg-[#1f1f1f] transition disabled:opacity-50 text-sm"
                        >
                          {{ isAnalyzingReferences ? 'Analyzing References...' : ((referenceStatus === 'completed' || referenceAnalysis) ? 'Re-analyze References' : 'Analyze References') }}
                        </button>
                      </div>
                    </div>

                    <div class="text-xs text-[#8b8b8b] space-y-1">
                      <div>
                        Reference analysis status:
                        <span class="uppercase tracking-[0.18em] text-[10px] text-[#bdbdbd]">{{ referenceStatus }}</span>
                      </div>
                      <div v-if="referenceJob" class="text-[#8b8b8b]">
                        Job:
                        <span class="text-[#cfcfcf]">{{ referenceJob.status }}</span>
                        <span v-if="referenceJob.started_at" class="ml-2">started {{ formatDateTime(referenceJob.started_at) }}</span>
                        <span v-if="referenceJob.finished_at" class="ml-2">finished {{ formatDateTime(referenceJob.finished_at) }}</span>
                      </div>
                      <div v-if="referenceJob?.last_error" class="text-[#ff9b9b]">
                        Last error: {{ referenceJob.last_error }}
                      </div>
                      <div v-if="referenceAnalysis?.summary?.recommended_direction" class="text-[#cfcfcf]">
                        Recommended direction: {{ referenceAnalysis.summary.recommended_direction }}
                      </div>
                    </div>

                    <div v-if="referenceStatus !== 'pending'" class="border border-[#2f2f2f] bg-[#0f0f0f] p-4 space-y-3">
                      <div class="flex items-center justify-between">
                        <span class="text-[#9a9a9a] text-xs uppercase tracking-[0.18em]">Reference Pipeline</span>
                        <span class="text-[10px] uppercase tracking-[0.18em] text-[#8b8b8b]">{{ referencePipelineState.status }}</span>
                      </div>
                      <div v-if="referencePipelineState.status === 'queued' && !referenceLogs.length" class="text-xs text-[#8b8b8b]">
                        Waiting for worker to pick up the job…
                      </div>
                      <div class="flex flex-wrap gap-2">
                        <div
                          v-for="(step, index) in referencePipelineSteps"
                          :key="step.key"
                          class="flex items-center gap-2 px-3 py-2 border text-xs uppercase tracking-[0.16em]"
                          :class="index <= referencePipelineState.activeIndex ? 'border-[#8D35FF] text-white' : 'border-[#262626] text-[#7a7a7a]'"
                        >
                          <span class="text-[10px]">{{ index + 1 }}</span>
                          <span>{{ step.label }}</span>
                        </div>
                      </div>
                      <div v-if="referencePipelineState.currentStep" class="text-xs text-[#bdbdbd]">
                        Current step: {{ referencePipelineState.currentStep }}
                      </div>
                    </div>

                    <div v-if="referenceAnalysis || referenceAssets.length || referenceLogs.length" class="border border-[#2f2f2f] bg-[#0f0f0f] p-4 space-y-4">
                      <div class="flex items-center justify-between">
                        <span class="text-[#9a9a9a] text-xs uppercase tracking-[0.18em]">Reference Analysis</span>
                        <span class="text-[10px] uppercase tracking-[0.18em] text-[#8b8b8b]">{{ referenceStatus }}</span>
                      </div>
                      <div v-if="referenceAnalysis?.curated_shortlist?.length" class="space-y-2">
                        <p class="text-xs uppercase tracking-[0.18em] text-[#777]">Curated shortlist</p>
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
                          <div v-for="item in referenceAnalysis.curated_shortlist" :key="item.id" class="border border-[#262626] p-3 text-xs space-y-1">
                            <div class="flex items-center justify-between gap-3">
                              <a :href="item.url" target="_blank" rel="noopener" class="text-white hover:text-[#8D35FF]">{{ item.title }}</a>
                              <span class="text-[#8b8b8b]">{{ item.score }}</span>
                            </div>
                            <div class="text-[#8b8b8b]">{{ item.source_type }}</div>
                            <div v-if="item.notes" class="text-[#bdbdbd]">{{ item.notes }}</div>
                          </div>
                        </div>
                      </div>
                      <div v-if="referenceAnalysis?.summary" class="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                        <div class="border border-[#262626] p-3">
                          <p class="text-xs uppercase tracking-[0.18em] text-[#777] mb-2">Visual direction</p>
                          <p class="text-white">{{ referenceAnalysis.summary.recommended_direction }}</p>
                          <div v-if="referenceAnalysis.summary.style_keywords?.length" class="mt-3 flex flex-wrap gap-2">
                            <span v-for="item in referenceAnalysis.summary.style_keywords" :key="item" class="px-2 py-1 text-[11px] border border-[#333] text-[#cfcfcf]">{{ item }}</span>
                          </div>
                        </div>
                        <div class="border border-[#262626] p-3 space-y-3">
                          <div v-if="referenceAnalysis.summary.do?.length">
                            <p class="text-xs uppercase tracking-[0.18em] text-[#777] mb-2">Do</p>
                            <ul class="text-[#d0d0d0] text-xs list-disc ml-4 space-y-1">
                              <li v-for="item in referenceAnalysis.summary.do" :key="item">{{ item }}</li>
                            </ul>
                          </div>
                          <div v-if="referenceAnalysis.summary.avoid?.length">
                            <p class="text-xs uppercase tracking-[0.18em] text-[#777] mb-2">Avoid</p>
                            <ul class="text-[#d0d0d0] text-xs list-disc ml-4 space-y-1">
                              <li v-for="item in referenceAnalysis.summary.avoid" :key="item">{{ item }}</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div v-if="referenceAssets.length" class="space-y-2">
                        <p class="text-xs uppercase tracking-[0.18em] text-[#777]">Captured reference assets</p>
                        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                          <button
                            v-for="asset in referenceAssets"
                            :key="asset.id"
                            type="button"
                            @click="openMediaLibrary('references', asset.public_url)"
                            class="border border-[#262626] p-3 hover:border-[#444] transition space-y-2"
                          >
                            <img :src="asset.public_url" :alt="asset.title || asset.competitor || 'Reference asset'" class="w-full h-40 object-cover border border-[#1f1f1f] bg-[#090909]" />
                            <div class="text-xs text-white truncate">{{ asset.title || asset.competitor || asset.source_url }}</div>
                            <div class="text-[11px] text-[#8b8b8b]">{{ asset.page_kind }} · {{ asset.viewport }}</div>
                          </button>
                        </div>
                      </div>
                      <div v-if="referenceLogs.length" class="space-y-2">
                        <p class="text-xs uppercase tracking-[0.18em] text-[#777]">Reference logs</p>
                        <div class="border border-[#262626] bg-[#0b0b0b] max-h-56 overflow-auto">
                          <div
                            v-for="(log, idx) in referenceLogs"
                            :key="`${log.ts}-${idx}`"
                            class="px-3 py-2 border-b border-[#1f1f1f] text-[11px] text-[#cfcfcf] flex items-start gap-2"
                          >
                            <span class="text-[#8b8b8b] whitespace-nowrap">{{ log.ts }}</span>
                            <span :class="log.level === 'error' ? 'text-[#ff8b8b]' : log.level === 'warn' ? 'text-[#ffd28b]' : 'text-[#cfcfcf]'">
                              {{ log.message }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section class="space-y-4">
                    <div class="flex items-center justify-between gap-4 flex-wrap">
                      <div>
                        <h3 class="text-white font-semibold text-lg">Design Specification Structure</h3>
                        <p class="text-xs text-[#777] mt-1">Generated from the brief and approved reference analysis.</p>
                      </div>
                      <div class="flex gap-3 flex-wrap">
                        <button
                          @click="generateDesignSpec"
                          :disabled="isGeneratingSpec || referenceStatus === 'processing'"
                          class="px-6 py-3 border border-[#8D35FF] text-white rounded-none hover:bg-[#8D35FF]/20 transition disabled:opacity-50 text-sm"
                        >
                          {{ isGeneratingSpec ? 'Generating Spec...' : (designSpec ? 'Re-generate' : 'Generate Design Spec') }}
                        </button>
                        <button
                          @click="queueFigmaBuild"
                          :disabled="isBuildingFigma || !designSpec"
                          class="px-6 py-3 border border-[#2f2f2f] text-white rounded-none hover:bg-[#1f1f1f] transition disabled:opacity-50 text-sm"
                        >
                          {{ isBuildingFigma ? 'Queuing Build...' : 'Build in Figma' }}
                        </button>
                        <button
                          @click="queueDemoBuild"
                          :disabled="isBuildingDemo || !designSpec"
                          class="px-6 py-3 border border-[#2f2f2f] text-white rounded-none hover:bg-[#1f1f1f] transition disabled:opacity-50 text-sm"
                        >
                          {{ isBuildingDemo ? 'Queuing Demo...' : 'Generate Demo Site' }}
                        </button>
                      </div>
                    </div>

                    <div v-if="figmaBuildStatus" class="text-xs text-[#8b8b8b]">
                      {{ figmaBuildStatus }}
                    </div>
                    <div v-if="figmaJob" class="border border-[#2f2f2f] bg-[#0f0f0f] p-4 text-xs text-[#cfcfcf] space-y-2">
                      <div class="flex items-center justify-between">
                        <span class="text-[#9a9a9a]">Figma build status</span>
                        <span class="uppercase tracking-[0.2em] text-[10px] text-[#8b8b8b]">{{ figmaJob.status }}</span>
                      </div>
                      <div v-if="figmaJob.figma_file_url" class="text-[#8D35FF]">
                        <a :href="figmaJob.figma_file_url" target="_blank" rel="noopener">Open Figma file</a>
                      </div>
                      <div v-if="figmaEvents.length" class="space-y-1 text-[#8b8b8b]">
                        <div v-for="event in figmaEvents" :key="event.id" class="border-b border-[#1f1f1f] pb-2 last:border-b-0">
                          <div>{{ formatDateTime(event.created_at) }} — {{ event.message }}</div>
                          <div v-if="event.payload?.name" class="mt-1 text-[11px] text-[#9a9a9a]">
                            node: {{ event.payload.name }}
                          </div>
                          <div v-if="event.payload?.error" class="mt-1 text-[11px] text-red-400 break-words">
                            error: {{ event.payload.error }}
                          </div>
                          <pre
                            v-if="event.payload?.props"
                            class="mt-1 overflow-x-auto whitespace-pre-wrap break-words bg-[#090909] border border-[#1f1f1f] p-2 text-[10px] text-[#7f7f7f]"
                          >{{ formatFigmaEventPayload(event.payload.props) }}</pre>
                        </div>
                      </div>
                      <div v-else class="text-[#777]">No build events yet.</div>
                    </div>

                    <div v-if="demoBuildStatus" class="text-xs text-[#8b8b8b]">
                      {{ demoBuildStatus }}
                    </div>
                    <div v-if="demoJob" class="border border-[#2f2f2f] bg-[#0f0f0f] p-4 text-xs text-[#cfcfcf] space-y-2">
                      <div class="flex items-center justify-between">
                        <span class="text-[#9a9a9a]">Demo build status</span>
                        <span class="uppercase tracking-[0.2em] text-[10px] text-[#8b8b8b]">{{ demoJob.status }}</span>
                      </div>
                      <div v-if="demoJob.current_stage" class="text-[#8b8b8b]">
                        stage: {{ demoJob.current_stage }}
                      </div>
                      <div v-if="demoJob.target_url || demoJob.slug" class="text-[#8D35FF]">
                        <a :href="demoJob.target_url || `https://demo.sitesynth.com/${demoJob.slug}/`" target="_blank" rel="noopener">Open demo site</a>
                      </div>
                      <div v-if="demoJob.error" class="text-red-400">
                        {{ demoJob.error }}
                      </div>
                      <div v-if="demoJob.provider || demoJob.model_provider" class="text-[#8b8b8b]">
                        executor: {{ demoJob.provider || '—' }} / model: {{ demoJob.model_provider || '—' }}
                      </div>
                      <div v-if="demoArtifacts.length" class="space-y-1">
                        <div class="text-[#9a9a9a]">Artifacts</div>
                        <div v-for="artifact in demoArtifacts" :key="artifact.id" class="border border-[#1f1f1f] bg-[#090909] p-2">
                          <div class="uppercase tracking-[0.14em] text-[10px] text-[#777]">{{ artifact.type }}</div>
                          <a v-if="artifact.public_url" :href="artifact.public_url" target="_blank" rel="noopener" class="text-[#8D35FF] break-all">
                            {{ artifact.public_url }}
                          </a>
                          <div v-else-if="artifact.path" class="text-[#8b8b8b] break-all">{{ artifact.path }}</div>
                        </div>
                      </div>
                      <div v-if="demoEvents.length" class="space-y-1 text-[#8b8b8b]">
                        <div v-for="event in demoEvents" :key="event.id" class="border-b border-[#1f1f1f] pb-2 last:border-b-0">
                          <div>{{ formatDateTime(event.created_at) }} — <span v-if="event.stage" class="uppercase tracking-[0.14em] text-[10px] text-[#777] mr-1">{{ event.stage }}</span>{{ event.message }}</div>
                          <div v-if="event.payload?.error" class="mt-1 text-[11px] text-red-400 break-words">
                            error: {{ event.payload.error }}
                          </div>
                          <pre
                            v-if="event.payload"
                            class="mt-1 overflow-x-auto whitespace-pre-wrap break-words bg-[#090909] border border-[#1f1f1f] p-2 text-[10px] text-[#7f7f7f]"
                          >{{ formatFigmaEventPayload(event.payload) }}</pre>
                        </div>
                      </div>
                      <div v-else class="text-[#777]">No demo events yet.</div>
                    </div>

                    <div v-if="designSpec" class="border-t border-[#333] pt-6 space-y-4">
                <h3 class="text-white font-semibold text-lg">Design Specification Structure</h3>
                <div v-if="designSpec.product_summary" class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div class="p-4 border border-[#333] bg-[#0f0f0f]">
                    <p class="text-xs uppercase tracking-[0.18em] text-[#777] mb-3">Product Summary</p>
                    <p class="text-sm text-white font-medium mb-2">{{ designSpec.product_summary.primary_goal }}</p>
                    <p class="text-xs text-[#9a9a9a] leading-relaxed">{{ designSpec.product_summary.vision }}</p>
                  </div>
                  <div class="p-4 border border-[#333] bg-[#0f0f0f]">
                    <p class="text-xs uppercase tracking-[0.18em] text-[#777] mb-3">Audience</p>
                    <p class="text-sm text-[#d4d4d4] leading-relaxed">{{ designSpec.product_summary.audience }}</p>
                  </div>
                  <div class="p-4 border border-[#333] bg-[#0f0f0f]">
                    <p class="text-xs uppercase tracking-[0.18em] text-[#777] mb-3">Experience Principles</p>
                    <ul class="space-y-2 text-sm text-[#d4d4d4]">
                      <li v-for="principle in designSpec.product_summary.experience_principles || []" :key="principle">• {{ principle }}</li>
                    </ul>
                  </div>
                </div>

                <div v-if="designSpec.design_direction || designSpec.theme" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div v-if="designSpec.design_direction" class="p-4 border border-[#333] bg-[#0f0f0f]">
                    <p class="text-xs uppercase tracking-[0.18em] text-[#777] mb-3">Design Direction</p>
                    <div class="space-y-3 text-sm">
                      <div>
                        <p class="text-[#8b8b8b] mb-1">Visual style</p>
                        <p class="text-white">{{ designSpec.design_direction.visual_style }}</p>
                      </div>
                      <div>
                        <p class="text-[#8b8b8b] mb-1">Interaction style</p>
                        <p class="text-white">{{ designSpec.design_direction.interaction_style }}</p>
                      </div>
                      <div>
                        <p class="text-[#8b8b8b] mb-1">Content tone</p>
                        <p class="text-white">{{ designSpec.design_direction.content_tone }}</p>
                      </div>
                    </div>
                  </div>
                  <div v-if="designSpec.theme" class="p-4 border border-[#333] bg-[#0f0f0f]">
                    <p class="text-xs uppercase tracking-[0.18em] text-[#777] mb-3">Theme</p>
                    <div class="grid grid-cols-2 gap-3 text-sm">
                      <div v-for="(value, key) in designSpec.theme.colors || {}" :key="key" class="border border-[#262626] p-3">
                        <p class="text-[#8b8b8b] text-xs uppercase mb-1">{{ key }}</p>
                        <p class="text-white">{{ value }}</p>
                      </div>
                    </div>
                    <div class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                      <div class="border border-[#262626] p-3">
                        <p class="text-[#8b8b8b] text-xs uppercase mb-1">Heading</p>
                        <p class="text-white">{{ designSpec.theme.typography?.heading }}</p>
                      </div>
                      <div class="border border-[#262626] p-3">
                        <p class="text-[#8b8b8b] text-xs uppercase mb-1">Body</p>
                        <p class="text-white">{{ designSpec.theme.typography?.body }}</p>
                      </div>
                      <div class="border border-[#262626] p-3">
                        <p class="text-[#8b8b8b] text-xs uppercase mb-1">Accent</p>
                        <p class="text-white">{{ designSpec.theme.typography?.accent }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="page in designSpec.pages" :key="page.path" class="p-4 border border-[#333] bg-[#0f0f0f]">
                    <div class="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <p class="text-white font-semibold text-sm">{{ page.title }}</p>
                        <p class="text-xs text-[#777] mt-1">{{ page.path }}</p>
                      </div>
                      <span class="text-[10px] uppercase tracking-[0.16em] text-[#8D35FF] border border-[#8D35FF]/30 px-2 py-1">Page</span>
                    </div>
                    <div class="space-y-3 text-sm">
                      <div>
                        <p class="text-[#8b8b8b] text-xs uppercase mb-1">Purpose</p>
                        <p class="text-[#dcdcdc]">{{ page.purpose }}</p>
                      </div>
                      <div>
                        <p class="text-[#8b8b8b] text-xs uppercase mb-1">Primary user goal</p>
                        <p class="text-[#dcdcdc]">{{ page.primary_user_goal }}</p>
                      </div>
                      <div v-if="page.success_criteria?.length">
                        <p class="text-[#8b8b8b] text-xs uppercase mb-1">Success criteria</p>
                        <ul class="text-[#dcdcdc] text-xs list-disc ml-4 space-y-1">
                          <li v-for="item in page.success_criteria" :key="item">{{ item }}</li>
                        </ul>
                      </div>
                      <div v-if="page.key_states?.length">
                        <p class="text-[#8b8b8b] text-xs uppercase mb-1">States</p>
                        <div class="flex flex-wrap gap-2">
                          <span v-for="state in page.key_states" :key="state" class="px-2 py-1 text-xs border border-[#333] text-[#cfcfcf]">{{ state }}</span>
                        </div>
                      </div>
                      <div v-if="page.ui_blocks?.length">
                        <p class="text-[#8b8b8b] text-xs uppercase mb-1">UI blocks</p>
                        <div class="space-y-3">
                          <div v-for="block in page.ui_blocks" :key="`${page.path}-${block.type}-${block.description}`" class="border border-[#262626] p-3">
                            <p class="text-white text-sm font-medium">{{ block.type }}</p>
                            <p class="text-[#bdbdbd] text-xs mt-1">{{ block.description }}</p>
                            <div v-if="block.content?.length" class="mt-3">
                              <p class="text-[#8b8b8b] text-[10px] uppercase mb-1">Content</p>
                              <ul class="text-[#d0d0d0] text-xs list-disc ml-4 space-y-1">
                                <li v-for="item in block.content" :key="item">{{ item }}</li>
                              </ul>
                            </div>
                            <div v-if="block.interactions?.length" class="mt-3">
                              <p class="text-[#8b8b8b] text-[10px] uppercase mb-1">Interactions</p>
                              <ul class="text-[#d0d0d0] text-xs list-disc ml-4 space-y-1">
                                <li v-for="item in block.interactions" :key="item">{{ item }}</li>
                              </ul>
                            </div>
                            <div v-if="block.states?.length" class="mt-3">
                              <p class="text-[#8b8b8b] text-[10px] uppercase mb-1">States</p>
                              <div class="flex flex-wrap gap-2">
                                <span v-for="item in block.states" :key="item" class="px-2 py-1 text-[11px] border border-[#333] text-[#cfcfcf]">{{ item }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div v-if="page.notes_for_figma?.length">
                        <p class="text-[#8b8b8b] text-xs uppercase mb-1">Notes for Figma</p>
                        <ul class="text-[#dcdcdc] text-xs list-disc ml-4 space-y-1">
                          <li v-for="note in page.notes_for_figma" :key="note">{{ note }}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

	                <div v-if="designSpec.figma_structure || designSpec.open_questions?.length" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div v-if="designSpec.figma_structure" class="p-4 border border-[#333] bg-[#0f0f0f]">
                    <p class="text-xs uppercase tracking-[0.18em] text-[#777] mb-3">Figma File Structure</p>
                    <div class="space-y-3">
                      <div v-for="page in designSpec.figma_structure.pages || []" :key="page.name" class="border border-[#262626] p-3">
                        <p class="text-white text-sm font-medium">{{ page.name }}</p>
                        <p class="text-[#bdbdbd] text-xs mt-1">{{ page.purpose }}</p>
                        <ul class="text-[#d0d0d0] text-xs list-disc ml-4 mt-2 space-y-1">
                          <li v-for="item in page.contents" :key="item">{{ item }}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div class="space-y-4">
                    <div v-if="designSpec.figma_structure?.handoff_notes?.length" class="p-4 border border-[#333] bg-[#0f0f0f]">
                      <p class="text-xs uppercase tracking-[0.18em] text-[#777] mb-3">Handoff Notes</p>
                      <ul class="text-[#d0d0d0] text-sm list-disc ml-4 space-y-2">
                        <li v-for="note in designSpec.figma_structure.handoff_notes" :key="note">{{ note }}</li>
                      </ul>
                    </div>
                    <div v-if="designSpec.open_questions?.length" class="p-4 border border-[#333] bg-[#0f0f0f]">
                      <p class="text-xs uppercase tracking-[0.18em] text-[#777] mb-3">Open Questions</p>
                      <ul class="text-[#d0d0d0] text-sm list-disc ml-4 space-y-2">
                        <li v-for="question in designSpec.open_questions" :key="question">{{ question }}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </template>
      </div>

            <!-- Brief list (when no brief is selected) -->
            <div v-else>
              <div class="flex items-center justify-between mb-6">
                <div>
                  <h2 class="text-xl font-semibold text-white mb-1">Projects</h2>
                  <p class="text-sm text-[#666]">{{ briefs.length }} brief{{ briefs.length !== 1 ? 's' : '' }}</p>
                </div>
                <button
                  @click="openBriefWizard"
                  class="inline-flex h-10 items-center gap-2 px-4 bg-[#8D35FF] text-white rounded-none text-sm font-medium hover:bg-[#7B2AE8] transition-colors"
                >
                  <svg viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4"><path :d="iconPaths.plus" /></svg>
                  New Project
                </button>
              </div>

              <div v-if="briefs.length === 0" class="border border-[#333] rounded-none bg-[#1a1a1a]">
                <div class="py-16 text-center px-6">
                  <div class="w-10 h-10 rounded-none border border-[#333] flex items-center justify-center mx-auto mb-4 text-[#444]">
                    <svg viewBox="0 0 16 16" fill="currentColor" class="w-5 h-5"><path :d="iconPaths.folder" /></svg>
                  </div>
                  <p class="text-sm text-white font-medium mb-1">No projects yet</p>
                  <p class="text-xs text-[#666] mb-5">Create your first brief to start a project</p>
                  <button @click="openBriefWizard" class="inline-flex h-10 items-center gap-2 px-4 bg-[#8D35FF] text-white rounded-none text-sm font-medium hover:bg-[#7B2AE8] transition-colors">
                    Create Brief
                  </button>
                </div>
              </div>

              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="brief in briefs"
                  :key="brief.id"
                  @click="openBriefEditor(brief)"
                  class="border border-[#333] rounded-none p-5 bg-[#1a1a1a] hover:border-[#8D35FF]/50 transition-colors cursor-pointer group"
                >
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center gap-2.5">
                      <div class="w-8 h-8 rounded-none bg-[#8D35FF]/10 flex items-center justify-center text-[#8D35FF]">
                        <svg viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4"><path :d="iconPaths.file" /></svg>
                      </div>
                      <h3 class="text-sm font-medium text-white">{{ brief.name || 'Untitled Brief' }}</h3>
                    </div>
                    <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-none text-xs font-medium bg-[#8D35FF]/10 text-[#8D35FF]">
                      Brief
                    </span>
                  </div>
                  <p class="text-xs text-[#666] mb-4 leading-relaxed line-clamp-2">{{ brief.description || stripHtmlPreview(brief.content || '') }}</p>
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-[#555]">{{ formatDate(brief.created_at) }}</span>
                    <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                      <button
                        @click.stop="openBriefEditor(brief)"
                        class="px-3 py-1 text-xs text-[#8D35FF] border border-[#8D35FF]/30 rounded-none hover:bg-[#8D35FF]/10 transition"
                      >
                        Open
                      </button>
                      <button
                        @click.stop="deleteBrief(brief)"
                        class="px-3 py-1 text-xs text-[#999] border border-[#333] rounded-none hover:text-red-400 hover:border-red-500/30 transition"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ── FILES ── -->
          <div v-if="activeTab === 'files'" class="mx-auto w-full max-w-[980px] px-6 py-8">
            <div class="mb-6">
              <h2 class="text-xl font-semibold text-white mb-1">Project Files</h2>
              <p class="text-sm text-[#666]">Upload brand guidelines, design assets, or documents for your project brief</p>
            </div>

            <!-- Upload Zone -->
            <div
              @dragover.prevent="dragActive = true"
              @dragleave="dragActive = false"
              @drop.prevent="handleFileDrop"
              @click="fileInput?.click()"
              :class="[
                'border rounded-none p-8 mb-6 cursor-pointer transition-colors text-center',
                dragActive ? 'border-white/30 bg-white/5' : 'border-[#333] border-dashed hover:border-[#555] bg-[#1a1a1a]'
              ]"
            >
              <input ref="fileInput" type="file" multiple @change="handleFileSelect" class="hidden" accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.zip" />
              <div class="w-10 h-10 rounded-none border border-[#333] flex items-center justify-center mx-auto mb-3 text-[#444]">
                <svg viewBox="0 0 16 16" fill="currentColor" class="w-5 h-5"><path :d="iconPaths.upload" /></svg>
              </div>
              <p class="text-sm text-[#888] mb-1">Drop files here or <span class="text-white">click to browse</span></p>
              <p class="text-xs text-[#555]">PDF, DOC, DOCX, TXT, JPG, PNG, ZIP</p>
            </div>

            <!-- Upload Progress -->
            <div v-if="uploading" class="border border-[#333] rounded-none p-4 mb-6 bg-[#1a1a1a]">
              <div class="flex items-center justify-between mb-2">
                <p class="text-xs text-[#888]">Uploading...</p>
                <p class="text-xs text-[#888] tabular-nums">{{ uploadProgress }}%</p>
              </div>
              <div class="w-full bg-[#1a1a1a] rounded-none h-0.5">
                <div class="bg-[#8D35FF] h-0.5 rounded-none transition-all" :style="{ width: `${uploadProgress}%` }"></div>
              </div>
            </div>

            <!-- Files List -->
            <div class="border border-[#333] rounded-none overflow-hidden bg-[#1a1a1a]">
              <div class="px-5 py-3.5 border-b border-[#333]">
                <span class="text-xs text-[#666] uppercase tracking-wider">{{ userFiles.length }} file{{ userFiles.length !== 1 ? 's' : '' }}</span>
              </div>
              <div v-if="userFiles.length === 0 && !uploading" class="py-10 text-center">
                <p class="text-sm text-[#666]">No files uploaded yet</p>
              </div>
              <div v-else>
                <div
                  v-for="file in userFiles"
                  :key="file.id"
                  class="flex items-center justify-between px-5 py-3.5 border-b border-[#333] last:border-0 group hover:bg-white/5 transition-colors"
                >
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="w-8 h-8 rounded-none bg-[#1a1a1a] flex items-center justify-center flex-shrink-0 text-[#555]">
                      <svg viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4"><path :d="iconPaths.file" /></svg>
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm text-white truncate">{{ file.name }}</p>
                      <p class="text-xs text-[#555] mt-0.5">{{ formatFileSize(file.size) }} · {{ timeAgo(file.uploadedAt) }}</p>
                    </div>
                  </div>
                  <button
                    @click.stop="deleteFile(file.id)"
                    class="p-1.5 text-[#666] hover:text-red-400 rounded-none transition-colors ml-4 flex-shrink-0"
                    title="Delete file"
                  >
                    <svg viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4"><path :d="iconPaths.trash" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- ── SETTINGS ── -->
          <div v-if="activeTab === 'settings'" class="mx-auto w-full max-w-[920px] px-6 py-8">
            <div class="mb-6">
              <h2 class="text-xl font-semibold text-white mb-1">Settings</h2>
              <p class="text-sm text-[#666]">Manage your account preferences</p>
            </div>

            <div class="space-y-4">
              <!-- Email -->
              <div class="border border-[#333] rounded-none overflow-hidden bg-[#1a1a1a]">
                <div class="px-5 py-4 border-b border-[#333]">
                  <p class="text-sm font-medium text-white">Email Address</p>
                </div>
                <div class="px-5 py-4 flex items-center justify-between">
                  <p class="text-sm text-[#888]">{{ userEmail }}</p>
                  <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs">
                    <span class="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                    Verified
                  </span>
                </div>
              </div>

              <!-- Password -->
              <div class="border border-[#333] rounded-none overflow-hidden bg-[#1a1a1a]">
                <div class="px-5 py-4 border-b border-[#333]">
                  <p class="text-sm font-medium text-white">Password</p>
                </div>
                <div class="px-5 py-4 flex items-center justify-between">
                  <p class="text-sm text-[#888]">••••••••••••</p>
                  <button class="inline-flex h-10 items-center px-4 text-sm text-[#888] hover:text-white border border-[#333] hover:border-[#555] rounded-none transition-colors">
                    Change
                  </button>
                </div>
              </div>

              <!-- Billing -->
              <div class="border border-[#333] rounded-none overflow-hidden bg-[#1a1a1a]">
                <div class="px-5 py-4 border-b border-[#333]">
                  <p class="text-sm font-medium text-white">Billing</p>
                </div>
                <div class="px-5 py-4 flex items-center justify-between">
                  <p class="text-sm text-[#888]">Manage your billing information and invoices</p>
                  <button class="inline-flex h-10 items-center px-4 text-sm text-[#888] hover:text-white border border-[#333] hover:border-[#555] rounded-none transition-colors">
                    Manage
                  </button>
                </div>
              </div>

              <!-- Danger Zone -->
              <div class="border border-red-500/20 rounded-none overflow-hidden bg-[#1a1a1a]">
                <div class="px-5 py-4 border-b border-red-500/20">
                  <p class="text-sm font-medium text-red-400">Danger Zone</p>
                </div>
                <div class="px-5 py-4 flex items-center justify-between">
                  <div>
                    <p class="text-sm text-[#888]">Sign out of your account</p>
                  </div>
                  <button
                    @click="handleLogout"
                    class="inline-flex h-10 items-center px-4 text-sm text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 rounded-none transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>

        </ClientOnly>
      </main>
    </div>

    <!-- Order Details Modal -->
    <Teleport to="body">
      <div
        v-if="showOrderDetails"
        class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click.self="closeOrderDetails"
      >
        <div class="bg-[#161616] border border-[#333] rounded-none max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl">
          <!-- Modal Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-[#333]">
            <div class="flex items-center gap-3">
              <span :class="['w-2 h-2 rounded-full flex-shrink-0', statusDotClass(selectedOrder?.status || '')]"></span>
              <h3 class="text-sm font-semibold text-white">{{ selectedOrder?.order_number || 'Order Details' }}</h3>
            </div>
            <button @click="closeOrderDetails" class="p-1.5 text-[#555] hover:text-white rounded-none hover:bg-[#1a1a1a] transition-colors">
              <svg viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4"><path :d="iconPaths.x" /></svg>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6 space-y-5">
            <!-- Order Info Grid -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-[#555] mb-1.5">Status</p>
                <span :class="['inline-block px-2 py-0.5 rounded-none text-xs font-medium', statusBadgeInfo(selectedOrder?.status || '').cls]">{{ statusBadgeInfo(selectedOrder?.status || '').label }}</span>
              </div>
              <div>
                <p class="text-xs text-[#555] mb-1.5">Amount</p>
                <p class="text-sm font-semibold text-white tabular-nums">{{ selectedOrder?.currency || 'EUR' }} {{ (selectedOrder?.amount || 0).toLocaleString() }}</p>
              </div>
              <div>
                <p class="text-xs text-[#555] mb-1.5">Client</p>
                <p class="text-sm text-white">{{ selectedOrder?.full_name || '—' }}</p>
              </div>
              <div>
                <p class="text-xs text-[#555] mb-1.5">Payment</p>
                <p class="text-sm text-white">{{ selectedOrder?.payment_method || '—' }}</p>
              </div>
              <div>
                <p class="text-xs text-[#555] mb-1.5">Date</p>
                <p class="text-sm text-white">{{ formatDate(selectedOrder?.created_at) }}</p>
              </div>
              <div v-if="selectedOrder?.charge_id">
                <p class="text-xs text-[#555] mb-1.5">Charge ID</p>
                <p class="text-xs text-white font-mono break-all">{{ selectedOrder?.charge_id }}</p>
              </div>
            </div>

            <!-- Form Data -->
            <div v-if="selectedOrder?.form_data" class="border border-[#333] rounded-none overflow-hidden">
              <div class="px-4 py-3 border-b border-[#333]">
                <p class="text-xs text-[#555] uppercase tracking-wider">Brief Data</p>
              </div>
              <div class="p-4">
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

    <!-- Brief Wizard Modal -->
    <Teleport to="body" v-if="showBriefWizard">
      <div class="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center">
        <div class="bg-[#161616] border border-[#333] w-full max-w-3xl mx-4 rounded-none flex flex-col" style="max-height: 90vh">
          <!-- Header -->
          <div class="bg-[#161616] border-b border-[#333] p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-white">Create Brief</h2>
              <button @click="showBriefWizard = false" class="text-[#666] hover:text-white text-xl">✕</button>
            </div>
            <!-- Progress bar -->
            <div class="w-full h-1 bg-[#333] rounded-none">
              <div class="h-1 bg-[#8D35FF] rounded-none transition-all duration-300" :style="{ width: wizardProgress + '%' }"></div>
            </div>
            <div class="flex items-center justify-between mt-3">
              <p class="text-[#999] text-sm">{{ wizardProgressLabel }}</p>
              <!-- Attached Files Badge -->
              <div v-if="wizardFiles.length > 0" class="flex items-center gap-2 px-3 py-1 bg-[#8D35FF]/10 border border-[#8D35FF]/30 rounded-none">
                <svg viewBox="0 0 16 16" fill="currentColor" class="w-3.5 h-3.5 text-[#8D35FF] flex-shrink-0"><path :d="iconPaths.file" /></svg>
                <span class="text-[#8D35FF] text-xs font-semibold">{{ wizardFiles.length }} file{{ wizardFiles.length !== 1 ? 's' : '' }} attached</span>
              </div>
            </div>
          </div>

          <!-- Attached Files Panel (always visible when files exist) -->
          <div v-if="wizardFiles.length > 0" class="border-b border-[#333] bg-[#0f0f0f]">
            <button
              @click="expandFilesPanel = !expandFilesPanel"
              class="w-full px-6 py-3 flex items-center justify-between hover:bg-[#1a1a1a] transition"
            >
              <div class="flex items-center gap-2">
                <svg viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 text-[#8D35FF] flex-shrink-0"><path :d="iconPaths.file" /></svg>
                <span class="text-white text-sm font-semibold">Attached Files ({{ wizardFiles.length }})</span>
              </div>
              <span class="text-[#666]" :class="expandFilesPanel ? 'transform rotate-180' : ''">▼</span>
            </button>
            <div v-if="expandFilesPanel" class="border-t border-[#333] space-y-0">
              <div v-for="(f, i) in wizardFiles" :key="i" class="flex items-center justify-between px-5 py-3.5 border-b border-[#333] last:border-0 group hover:bg-white/5 transition-colors">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-8 h-8 rounded-none bg-[#1a1a1a] flex items-center justify-center flex-shrink-0 text-[#555]">
                    <svg viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4"><path :d="iconPaths.file" /></svg>
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm text-white truncate">{{ f.name }}</p>
                    <p class="text-xs text-[#555] mt-0.5">{{ (f.size / 1024).toFixed(1) }}KB</p>
                  </div>
                </div>
                <button
                  @click="wizardFiles.splice(i, 1)"
                  class="p-1.5 text-[#666] hover:text-red-400 rounded-none transition-colors ml-4 flex-shrink-0"
                  title="Remove file"
                >
                  <svg viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4"><path :d="iconPaths.trash" /></svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Content (scrollable) -->
          <div class="flex-1 overflow-y-auto p-6 space-y-6" ref="wizardContentRef">

            <!-- Phase: Files -->
            <div v-if="wizardPhase === 'upload'" class="space-y-6">
              <!-- Brief Name Input -->
              <div class="space-y-2">
                <label class="block text-white text-sm font-semibold">Brief Name</label>
                <input
                  v-model="briefData.projectName"
                  type="text"
                  placeholder="e.g., Membria Redesign, Mobile App Brief"
                  class="w-full px-4 py-3 bg-[#0f0f0f] border border-[#333] rounded-none text-white placeholder-[#666] focus:border-[#8D35FF] focus:outline-none transition"
                />
              </div>

              <div class="flex items-center justify-between mb-2">
                <div>
                  <h3 class="text-white font-semibold">Upload Reference Files</h3>
                  <p class="text-[#999] text-sm">Upload brand guidelines, wireframes, or any reference materials. You can skip this step.</p>
                </div>
                <div v-if="wizardFiles.length > 0" class="px-3 py-2 bg-[#8D35FF]/10 border border-[#8D35FF]/50 rounded-none">
                  <p class="text-[#8D35FF] text-sm font-semibold">{{ wizardFiles.length }} file{{ wizardFiles.length !== 1 ? 's' : '' }}</p>
                </div>
              </div>

              <div @drop.prevent="handleWizardFileDrop" @dragover.prevent class="border-2 border-dashed border-[#333] rounded-none p-8 text-center cursor-pointer hover:border-[#8D35FF] transition">
                <input ref="wizardFileInput" type="file" multiple class="hidden" @change="handleWizardFileSelect" accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png" />
                <button @click="wizardFileInput?.click()" class="text-center w-full">
                  <p class="text-[#999] mb-2">Drop files or click to browse</p>
                  <p class="text-[#666] text-sm">PDF, DOC, DOCX, TXT, JPG, PNG</p>
                </button>
              </div>

              <!-- Available files from storage -->
              <div v-if="userFiles.length > 0" class="bg-[#1a1a1a] border border-[#333] rounded-none">
                <div class="px-5 py-4 border-b border-[#333]">
                  <p class="text-white text-sm font-semibold">Available Project Files</p>
                  <p class="text-[#666] text-xs mt-0.5">These files will be included in your brief automatically</p>
                </div>
                <div>
                  <div v-for="file in userFiles" :key="file.id" class="flex items-center justify-between px-5 py-3.5 border-b border-[#333] last:border-0 hover:bg-white/5 transition-colors">
                    <div class="flex items-center gap-3 min-w-0">
                      <div class="w-8 h-8 rounded-none bg-[#1a1a1a] flex items-center justify-center flex-shrink-0 text-[#555]">
                        <svg viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4"><path :d="iconPaths.file" /></svg>
                      </div>
                      <div class="min-w-0">
                        <p class="text-sm text-white truncate">{{ file.name }}</p>
                        <p class="text-xs text-[#555] mt-0.5">{{ formatFileSize(file.size) }}</p>
                      </div>
                    </div>
                    <button
                      @click.stop="deleteFile(file.id)"
                      class="p-1.5 text-[#666] hover:text-red-400 rounded-none transition-colors ml-4 flex-shrink-0"
                      title="Delete file"
                    >
                      <svg viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4"><path :d="iconPaths.trash" /></svg>
                    </button>
                  </div>
                </div>
                <div class="px-5 py-3 border-t border-[#333]">
                  <p class="text-[#8D35FF] text-xs">{{ userFiles.length }} file(s) will be included</p>
                </div>
              </div>

              <!-- Files list (newly uploaded) -->
              <div v-if="wizardFiles.length > 0" class="bg-[#8D35FF]/5 border border-[#8D35FF]/20 rounded-none p-4 space-y-2">
                <p class="text-white text-sm font-semibold flex items-center gap-2">
                  <span>Newly Uploaded Files</span>
                  <span class="text-[#8D35FF] text-xs px-2 py-1 bg-[#8D35FF]/20 rounded-none">{{ wizardFiles.length }}</span>
                </p>
                <div v-for="(f, i) in wizardFiles" :key="i" class="flex items-center justify-between bg-[#161616] px-5 py-3.5 border border-[#333] rounded-none group hover:bg-white/5 transition-colors">
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="w-8 h-8 rounded-none bg-[#1a1a1a] flex items-center justify-center flex-shrink-0 text-[#555]">
                      <svg viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4"><path :d="iconPaths.file" /></svg>
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm text-white truncate">{{ f.name }}</p>
                      <p class="text-xs text-[#555] mt-0.5">{{ (f.size / 1024).toFixed(1) }}KB</p>
                    </div>
                  </div>
                  <button
                    @click="wizardFiles.splice(i, 1)"
                    class="p-1.5 text-[#666] hover:text-red-400 rounded-none transition-colors ml-4 flex-shrink-0"
                    title="Remove file"
                  >
                    <svg viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4"><path :d="iconPaths.trash" /></svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Phase: Questions -->
            <!-- Phase: Product Description -->
            <div v-if="wizardPhase === 'description'" class="space-y-4">
              <h3 class="text-white font-semibold">Describe Your Product</h3>
              <p class="text-[#999] text-sm">Tell us about your product or company. Based on this, we'll generate a custom questionnaire tailored to your needs.</p>
              <div v-if="isGeneratingIntakeSummary" class="text-xs text-[#8D35FF]">
                Preparing summary from intake data...
              </div>
              <div class="space-y-2">
                <p class="text-xs uppercase tracking-[0.16em] text-[#777]">What are we designing?</p>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="option in projectTypeOptions"
                    :key="option.value"
                    @click="selectProjectType(option.value)"
                    :class="[
                      'px-3 py-2 text-sm border rounded-none transition',
                      briefData.projectType === option.value
                        ? 'border-[#8D35FF]/50 bg-[#8D35FF]/10 text-white'
                        : 'border-[#333] bg-[#141414] text-[#b3b3b3] hover:bg-[#1a1a1a] hover:text-white'
                    ]"
                  >
                    {{ option.label }}
                  </button>
                </div>
              </div>
              <textarea
                v-model="productDescription"
                :placeholder="productDescriptionPlaceholder"
                rows="6"
                class="w-full px-4 py-3 bg-[#0f0f0f] border border-[#333] rounded-none text-white placeholder-[#666] focus:border-[#8D35FF] focus:outline-none transition resize-none"
              ></textarea>
              <p class="text-[#666] text-xs">
                At least 20 characters. The more detail, the better the questions.
                <span v-if="briefData.projectType" class="text-[#8D35FF]">Current type: {{ projectTypeLabel }}</span>
              </p>
            </div>

            <!-- Phase: Questions Error -->
            <div v-if="wizardPhase === 'questions_error'" class="text-center py-16 space-y-4 px-6">
              <div class="text-red-400 text-4xl mb-2">⚠️</div>
              <h3 class="text-white font-semibold text-lg">AI Service Busy</h3>
              <p class="text-[#999] text-sm max-w-sm mx-auto leading-relaxed">
                We couldn't generate dynamic questions right now because the AI model is experiencing high demand.
              </p>
              <div class="pt-4 flex flex-col sm:flex-row gap-3 justify-center items-center">
                <button 
                  @click="generateDynamicQuestions"
                  class="px-8 py-3 bg-[#8D35FF] text-white rounded-none hover:bg-[#7B2AE8] transition text-sm flex items-center gap-2"
                >
                  <svg viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4"><path d="M1.705 8.005a.75.75 0 0 1 .834.656 5.5 5.5 0 0 0 9.592 2.97l-1.204-1.204a.25.25 0 0 1 .177-.427h3.646a.25.25 0 0 1 .25.25v3.646a.25.25 0 0 1-.427.177l-1.38-1.38A7.002 7.002 0 0 1 1.05 8.84a.75.75 0 0 1 .656-.834ZM8 2.5a5.487 5.487 0 0 0-4.131 1.869l1.204 1.204A.25.25 0 0 1 4.896 6H1.25A.25.25 0 0 1 1 5.75V2.104a.25.25 0 0 1 .427-.177l1.38 1.38A7.002 7.002 0 0 1 14.95 7.16a.75.75 0 0 1-1.49.148A5.5 5.5 0 0 0 8 2.5Z"/></svg>
                  Retry AI Generation
                </button>
                <button 
                  @click="useDefaultQuestions"
                  class="px-8 py-3 border border-[#333] text-white rounded-none hover:bg-[#1a1a1a] transition text-sm"
                >
                  Use Default Questions
                </button>
              </div>
            </div>

            <div v-if="wizardPhase === 'questions'" class="space-y-4">
              <!-- Answered questions history (chat-like) -->
              <div v-for="(answer, idx) in answeredQuestions" :key="answer.id" class="space-y-2">
                <!-- Question bubble -->
                <div class="bg-[#1a1a1a] border border-[#333] rounded-none p-4">
                  <p class="text-[#999] text-xs mb-1">Question {{ idx + 1 }}</p>
                  <p class="text-white text-sm font-semibold">{{ answer.questionText }}</p>
                </div>
                <!-- Answer bubble -->
                <div class="bg-[#8D35FF]/10 border border-[#8D35FF]/30 rounded-none p-4 relative group">
                  <p class="text-white text-sm pr-8">{{ answer.value }}</p>
                  <div class="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button @click="editAnswer(idx)" class="text-[#999] hover:text-[#8D35FF] text-xs px-2 py-1 border border-[#333] rounded-none bg-[#161616]">Edit</button>
                    <button @click="deleteAnswer(idx)" class="text-[#999] hover:text-red-400 text-xs px-2 py-1 border border-[#333] rounded-none bg-[#161616]">✕</button>
                  </div>
                  <!-- AI enhanced badge -->
                  <p v-if="answer.enhanced" class="text-[#8D35FF] text-xs mt-2 flex items-center gap-1">✨ Enhanced by AI</p>
                </div>
              </div>

              <!-- Current Question -->
              <div v-if="currentQ" class="space-y-4">
                <div class="bg-[#1a1a1a] border border-[#333] rounded-none p-4">
                  <p class="text-[#999] text-xs mb-1">Question {{ currentQuestionIndex + 1 }}</p>
                  <p class="text-white text-lg">{{ currentQ.text }}</p>
                </div>

                <!-- Text Input -->
                <div v-if="currentQ.type === 'text_input'" class="space-y-3">
                  <input
                    v-model="userMessage"
                    @keyup.enter="submitAnswer"
                    type="text"
                    :placeholder="currentQ.hint || 'Your answer...'"
                    class="w-full px-4 py-3 bg-[#0f0f0f] border border-[#333] rounded-none text-white placeholder-[#666] focus:border-[#8D35FF] focus:outline-none transition"
                  />
                </div>

                <!-- Textarea -->
                <div v-else-if="currentQ.type === 'textarea'" class="space-y-3">
                  <textarea
                    v-model="userMessage"
                    @keydown.ctrl.enter.prevent="enhanceWithAI"
                    :placeholder="currentQ.hint || 'Your answer...'"
                    rows="5"
                    class="w-full px-4 py-3 bg-[#0f0f0f] border border-[#333] rounded-none text-white placeholder-[#666] focus:border-[#8D35FF] focus:outline-none transition resize-none"
                  ></textarea>
                </div>

                <!-- Single Select -->
                <div v-else-if="currentQ.type === 'single_select'" class="space-y-3">
                  <div class="grid grid-cols-2 gap-2">
                    <button
                      v-for="option in currentQ.options"
                      :key="option.id"
                      @click="userMessage = option.label; submitAnswer()"
                      :class="{
                        'bg-[#8D35FF] border-[#8D35FF] text-white': userMessage === option.label,
                        'bg-[#0f0f0f] border-[#333] text-[#999] hover:border-[#8D35FF] hover:text-white': userMessage !== option.label
                      }"
                      class="px-4 py-3 border rounded-none font-medium transition text-sm"
                    >
                      {{ option.label }}
                    </button>
                  </div>
                </div>

                <!-- Multi Select -->
                <div v-else-if="currentQ.type === 'multi_select'" class="space-y-3">
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="option in currentQ.options"
                      :key="option.id"
                      @click="toggleMultiSelect(option.label)"
                      :class="{
                        'bg-[#8D35FF] border-[#8D35FF] text-white': multiSelectValues.includes(option.label),
                        'bg-[#0f0f0f] border-[#333] text-[#999] hover:border-[#8D35FF] hover:text-white': !multiSelectValues.includes(option.label)
                      }"
                      class="px-4 py-2 border rounded-none transition text-sm"
                    >
                      {{ option.label }}
                    </button>
                  </div>
                  <p class="text-[#666] text-xs">Select all that apply, then click Next</p>
                </div>

                <!-- Action buttons for text fields -->
                <div v-if="currentQ.type === 'text_input' || currentQ.type === 'textarea'" class="flex gap-3">
                  <button
                    v-if="userMessage.trim()"
                    @click="enhanceWithAI"
                    :disabled="isEnhancing"
                    class="flex-1 px-4 py-3 border border-[#8D35FF]/50 text-[#8D35FF] rounded-none hover:bg-[#8D35FF]/10 transition text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <svg v-if="!isEnhancing" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4"><path d="M8 1l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4l2-4z" /></svg>
                    <span v-if="isEnhancing">Enhancing...</span>
                    <span v-else>Enhance</span>
                  </button>
                  <button
                    @click="submitAnswer"
                    :disabled="!userMessage.trim()"
                    class="flex-1 px-4 py-3 bg-[#8D35FF] text-white rounded-none hover:bg-[#7B2AE8] transition text-sm disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>

                <!-- Next button for multi_select -->
                <div v-if="currentQ.type === 'multi_select'" class="flex gap-3">
                  <button
                    @click="submitMultiSelect"
                    :disabled="multiSelectValues.length === 0"
                    class="w-full px-4 py-3 bg-[#8D35FF] text-white rounded-none hover:bg-[#7B2AE8] transition text-sm disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            <!-- Phase: Generating -->
            <div v-if="wizardPhase === 'generating'" class="text-center py-16 space-y-4">
              <div class="inline-block w-8 h-8 border-2 border-[#8D35FF] border-t-transparent rounded-full animate-spin"></div>
              <p class="text-white font-semibold">Generating your brief with AI...</p>
              <p class="text-[#999] text-sm">Analyzing your answers and uploaded files</p>
            </div>

            <!-- Phase: Review Brief -->
            <div v-if="wizardPhase === 'review'" class="space-y-4">
              <h3 class="text-white font-semibold">Your Generated Brief</h3>
              <div class="bg-[#0f0f0f] border border-[#333] rounded-none p-6 max-h-[50vh] overflow-y-auto">
                <div class="text-white text-sm whitespace-pre-wrap leading-relaxed" v-html="formatBriefHtml(generatedBrief)"></div>
              </div>
            </div>

            <!-- Phase: Error -->
            <div v-if="wizardPhase === 'error'" class="text-center py-16 space-y-4 px-6">
              <div class="text-red-400 text-4xl mb-2">⚠️</div>
              <h3 class="text-white font-semibold text-lg">AI Service Busy</h3>
              <p class="text-[#999] text-sm max-w-sm mx-auto leading-relaxed">
                The AI model is currently experiencing high demand. Your data is safe—please try again in a few moments.
              </p>
              <div class="pt-4">
                <button 
                  @click="generateBriefWithGemini"
                  class="px-8 py-3 bg-[#8D35FF] text-white rounded-none hover:bg-[#7B2AE8] transition text-sm flex items-center gap-2 mx-auto"
                >
                  <svg viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4"><path d="M1.705 8.005a.75.75 0 0 1 .834.656 5.5 5.5 0 0 0 9.592 2.97l-1.204-1.204a.25.25 0 0 1 .177-.427h3.646a.25.25 0 0 1 .25.25v3.646a.25.25 0 0 1-.427.177l-1.38-1.38A7.002 7.002 0 0 1 1.05 8.84a.75.75 0 0 1 .656-.834ZM8 2.5a5.487 5.487 0 0 0-4.131 1.869l1.204 1.204A.25.25 0 0 1 4.896 6H1.25A.25.25 0 0 1 1 5.75V2.104a.25.25 0 0 1 .427-.177l1.38 1.38A7.002 7.002 0 0 1 14.95 7.16a.75.75 0 0 1-1.49.148A5.5 5.5 0 0 0 8 2.5Z"/></svg>
                  Retry Generation
                </button>
              </div>
            </div>

            <!-- Phase: Saved -->
            <div v-if="wizardPhase === 'saved'" class="text-center py-16 space-y-4">
              <p class="text-4xl">✅</p>
              <h3 class="text-white font-semibold text-xl">Brief Saved Successfully!</h3>
              <p class="text-[#999] text-sm">You can now edit it with AI assistance in your Projects.</p>
            </div>
          </div>

          <!-- Footer Navigation -->
          <div class="bg-[#161616] border-t border-[#333] p-4 flex gap-3 items-center">
            <button
              v-if="wizardPhase !== 'saved'"
              @click="resetWizard"
              class="px-6 py-3 border border-[#333] text-[#999] rounded-none hover:bg-[#1a1a1a] hover:text-white transition text-sm"
            >
              Reset
            </button>
            <div class="flex-1"></div>
            <div v-if="wizardPhase === 'questions' && currentQ && (currentQ.type === 'textarea' || currentQ.type === 'text_input')" class="flex gap-2">
              <button
                v-if="canUndo"
                @click="undoEnhance"
                class="px-6 py-3 border border-[#333] text-[#999] rounded-none hover:bg-[#1a1a1a] hover:text-white transition text-sm flex items-center gap-2"
                title="Undo"
              >
                <svg viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4"><path d="M3.854 4.854a.5.5 0 1 0-.708-.708l-3 3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708-.708L1.707 8l2.147-2.146zm8.292-.708a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L14.293 8l-2.147-2.146z" /></svg>
                Undo
              </button>
              <button
                v-if="canRedo"
                @click="redoEnhance"
                class="px-6 py-3 border border-[#333] text-[#999] rounded-none hover:bg-[#1a1a1a] hover:text-white transition text-sm flex items-center gap-2"
                title="Redo"
              >
                Redo
                <svg viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4"><path d="M12.146 4.854a.5.5 0 0 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L14.293 8l-2.147-2.146zM3.854 4.146a.5.5 0 0 0-.708 0l-3 3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708-.708L1.707 8l2.147 2.146z" /></svg>
              </button>
            </div>
            <button
              v-if="wizardPhase === 'upload'"
              @click="startDescription"
              class="px-8 py-3 bg-[#8D35FF] text-white rounded-none hover:bg-[#7B2AE8] transition text-sm"
            >
              Continue
            </button>
            <button
              v-if="wizardPhase === 'review'"
              @click="saveBrief"
              class="px-8 py-3 bg-[#8D35FF] text-white rounded-none hover:bg-[#7B2AE8] transition text-sm"
            >
              Save Brief
            </button>
            <button
              v-if="wizardPhase === 'error'"
              @click="wizardPhase = 'questions'"
              class="px-8 py-3 bg-[#1a1a1a] border border-[#333] text-white rounded-none hover:bg-[#222] transition text-sm"
            >
              Back to Questions
            </button>
            <button
              v-if="wizardPhase === 'saved'"
              @click="finishWizard"
              class="px-8 py-3 bg-[#8D35FF] text-white rounded-none hover:bg-[#7B2AE8] transition text-sm"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="showMediaLibrary"
        class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click.self="closeMediaLibrary"
      >
        <div class="bg-[#111] border border-[#333] w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-none flex flex-col">
          <div class="flex items-center justify-between px-6 py-4 border-b border-[#333]">
            <div class="flex items-center gap-3">
              <h3 class="text-white text-sm font-semibold">Media Library</h3>
              <div class="flex border border-[#333]">
                <button
                  @click="mediaLibraryTab = 'references'; selectedMediaIndex = 0"
                  :class="mediaLibraryTab === 'references' ? 'bg-[#8D35FF] text-white' : 'text-[#999] hover:bg-white/5'"
                  class="px-3 py-1.5 text-xs transition"
                >
                  References
                </button>
                <button
                  @click="mediaLibraryTab = 'files'; selectedMediaIndex = 0"
                  :class="mediaLibraryTab === 'files' ? 'bg-[#8D35FF] text-white' : 'text-[#999] hover:bg-white/5'"
                  class="px-3 py-1.5 text-xs transition border-l border-[#333]"
                >
                  Client Files
                </button>
              </div>
            </div>
            <button @click="closeMediaLibrary" class="p-1.5 text-[#555] hover:text-white transition-colors">
              <svg viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4"><path :d="iconPaths.x" /></svg>
            </button>
          </div>
          <div class="grid grid-cols-[minmax(0,1fr)_320px] flex-1 min-h-0">
            <div class="bg-[#090909] flex items-center justify-center p-6 min-h-[420px]">
              <div v-if="activeMediaItem" class="w-full h-full flex flex-col gap-4">
                <img
                  v-if="activeMediaItem.kind === 'image'"
                  :src="activeMediaItem.url"
                  :alt="activeMediaItem.title"
                  class="max-h-[65vh] w-full object-contain bg-[#050505] border border-[#1f1f1f]"
                />
                <div v-else class="border border-[#262626] p-6 bg-[#0f0f0f]">
                  <p class="text-white text-sm font-medium">{{ activeMediaItem.title }}</p>
                  <p class="text-[#888] text-xs mt-2">{{ activeMediaItem.meta }}</p>
                  <a :href="activeMediaItem.url" target="_blank" rel="noopener" class="inline-block mt-4 text-[#8D35FF] text-sm">Open file</a>
                </div>
                <div class="flex items-center justify-between gap-4">
                  <div>
                    <p class="text-white text-sm">{{ activeMediaItem.title }}</p>
                    <p class="text-[#777] text-xs mt-1">{{ activeMediaItem.meta }}</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <button @click="selectPrevMedia" class="px-3 py-2 border border-[#333] text-[#bbb] text-xs hover:bg-white/5">Prev</button>
                    <button @click="selectNextMedia" class="px-3 py-2 border border-[#333] text-[#bbb] text-xs hover:bg-white/5">Next</button>
                    <a :href="activeMediaItem.url" target="_blank" rel="noopener" class="px-3 py-2 border border-[#333] text-[#bbb] text-xs hover:bg-white/5">Open</a>
                  </div>
                </div>
              </div>
              <div v-else class="text-[#666] text-sm">No media yet.</div>
            </div>
            <div class="border-l border-[#333] bg-[#0f0f0f] overflow-y-auto">
              <div class="p-4 space-y-3">
                <button
                  v-for="(item, index) in visibleMediaItems"
                  :key="`${mediaLibraryTab}-${item.id || item.url}`"
                  @click="selectedMediaIndex = index"
                  :class="selectedMediaIndex === index ? 'border-[#8D35FF] bg-[#8D35FF]/10' : 'border-[#262626] hover:border-[#444]'"
                  class="w-full text-left border p-3 transition"
                >
                  <div class="flex gap-3">
                    <img v-if="item.kind === 'image'" :src="item.url" :alt="item.title" class="w-16 h-16 object-cover border border-[#1f1f1f] bg-[#090909] flex-shrink-0" />
                    <div v-else class="w-16 h-16 border border-[#1f1f1f] bg-[#090909] flex items-center justify-center text-[#666] text-xs flex-shrink-0">FILE</div>
                    <div class="min-w-0">
                      <p class="text-white text-xs truncate">{{ item.title }}</p>
                      <p class="text-[#777] text-[11px] mt-1 break-words">{{ item.meta }}</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Toast Notification -->
    <Transition name="fade">
      <div v-if="toast" class="fixed bottom-6 right-6 z-50">
        <div :class="[
          'px-4 py-3 rounded-none text-sm font-medium transition-all',
          toast.type === 'success'
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
        ]">
          {{ toast.message }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch, onBeforeUnmount } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { marked } from 'marked'
import FormDataDisplay from '@/components/FormDataDisplay.vue'
import { useGoogleAuth } from '@/composables/useGoogleAuth'
import { useChatDrawer } from '@/composables/useChatDrawer'
import { useAnonymousChat } from '@/composables/useAnonymousChat'
import { briefQuestions } from '@/config/brief-questions'
import type { BriefQuestion } from '@/config/brief-questions'

// ── SVG icon paths ──
const iconPaths: Record<string, string> = {
  home: 'M6.906.664a1.749 1.749 0 0 1 2.187 0l5.25 4.2c.415.332.657.835.657 1.367v7.019A1.75 1.75 0 0 1 13.25 15h-3.5a.75.75 0 0 1-.75-.75V9H7v5.25a.75.75 0 0 1-.75.75h-3.5A1.75 1.75 0 0 1 1 13.25V6.23c0-.531.242-1.034.657-1.366l5.25-4.2Zm1.25 1.171a.25.25 0 0 0-.312 0l-5.25 4.2a.25.25 0 0 0-.094.195v7.019c0 .138.112.25.25.25H5.5V8.25a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 .75.75v5.25h2.75a.25.25 0 0 0 .25-.25V6.23a.25.25 0 0 0-.094-.195Z',
  package: 'M8.878.392a1.75 1.75 0 0 0-1.756 0l-5.25 3.045A1.75 1.75 0 0 0 1 4.951v6.098c0 .624.332 1.2.872 1.514l5.25 3.045a1.75 1.75 0 0 0 1.756 0l5.25-3.045c.54-.313.872-.89.872-1.514V4.951c0-.624-.332-1.2-.872-1.514ZM7.875 1.69a.25.25 0 0 1 .25 0l4.63 2.685L8 7.133 3.245 4.375ZM2.5 5.677v5.372c0 .09.047.171.125.216l4.625 2.683V8.432Zm6.25 8.271 4.625-2.683a.25.25 0 0 0 .125-.216V5.677L8.75 8.432Z',
  folder: 'M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25v-8.5A1.75 1.75 0 0 0 14.25 3H7.5a.25.25 0 0 1-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75Zm0 1.5H5c.11 0 .221.053.3.15l.9 1.2c.27.35.68.55 1.1.55h7a.25.25 0 0 1 .25.25v8.5a.25.25 0 0 1-.25.25H1.75a.25.25 0 0 1-.25-.25V2.75c0-.138.112-.25.25-.25Z',
  file: 'M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688a.252.252 0 0 0-.011-.013Z',
  settings: 'M8 0a8.2 8.2 0 0 1 .701.031C9.444.095 9.99.645 10.16 1.29l.288 1.107c.018.066.079.158.212.224.231.114.454.243.668.386.123.082.233.09.299.071l1.103-.303c.644-.176 1.392.021 1.82.63.27.385.506.792.704 1.218.315.675.111 1.422-.364 1.891l-.814.806c-.049.048-.098.147-.088.294.016.257.016.515 0 .772-.01.147.038.246.088.294l.814.806c.475.469.679 1.216.364 1.891a7.977 7.977 0 0 1-.704 1.217c-.428.61-1.176.807-1.82.63l-1.102-.302c-.067-.019-.177-.011-.3.071a5.909 5.909 0 0 1-.668.386c-.133.066-.194.158-.211.224l-.29 1.106c-.168.646-.715 1.196-1.458 1.26a8.006 8.006 0 0 1-1.402 0c-.743-.064-1.289-.614-1.458-1.26l-.289-1.106c-.018-.066-.079-.158-.212-.224a5.738 5.738 0 0 1-.668-.386c-.123-.082-.233-.09-.299-.071l-1.103.303c-.644.176-1.392-.021-1.82-.63a8.12 8.12 0 0 1-.704-1.218c-.315-.675-.111-1.422.363-1.891l.815-.806c.05-.048.098-.147.088-.294a6.214 6.214 0 0 1 0-.772c.01-.147-.038-.246-.088-.294l-.815-.806C.635 6.045.431 5.298.746 4.623a7.92 7.92 0 0 1 .704-1.217c.428-.61 1.176-.807 1.82-.63l1.102.302c.067.019.177.011.3-.071.214-.143.437-.272.668-.386.133-.066.194-.158.211-.224l.29-1.106C6.009.645 6.556.095 7.299.03 7.53.01 7.764 0 8 0Zm-.571 1.525c-.036.003-.108.036-.137.146l-.289 1.105c-.147.561-.549.967-.998 1.189-.173.086-.34.183-.5.29-.417.278-.97.423-1.529.27l-1.103-.303c-.109-.03-.175.016-.195.045-.22.312-.412.644-.573.99-.014.031-.021.11.059.19l.815.806c.411.406.562.957.53 1.456a4.709 4.709 0 0 0 0 .582c.032.499-.119 1.05-.53 1.456l-.815.806c-.081.08-.073.159-.059.19.162.346.353.677.573.989.02.03.085.076.195.046l1.102-.303c.56-.153 1.113-.008 1.53.27.161.107.328.204.501.29.447.222.85.629.997 1.189l.289 1.105c.029.109.101.143.137.146a6.6 6.6 0 0 0 1.142 0c.036-.003.108-.036.137-.146l.289-1.105c.147-.561.549-.967.998-1.189.173-.086.34-.183.5-.29.417-.278.97-.423 1.529-.27l1.103.303c.109.03.175-.016.195-.045.22-.313.411-.644.573-.99.014-.031.021-.11-.059-.19l-.815-.806c-.411-.406-.562-.957-.53-1.456a4.709 4.709 0 0 0 0-.582c-.032-.499.119-1.05.53-1.456l.815-.806c.081-.08.073-.159.059-.19a6.464 6.464 0 0 0-.573-.989c-.02-.03-.085-.076-.195-.046l-1.102.303c-.56.153-1.113.008-1.53-.27a4.44 4.44 0 0 0-.501-.29c-.447-.222-.85-.629-.997-1.189l-.289-1.105c-.029-.11-.101-.143-.137-.146a6.6 6.6 0 0 0-1.142 0ZM8 5.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM6.5 8a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z',
  logout: 'M2 2.75C2 1.784 2.784 1 3.75 1h2.5a.75.75 0 0 1 0 1.5h-2.5a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A1.75 1.75 0 0 1 2 13.25Zm10.44 4.5-1.97-1.97a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .744.215l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l1.97-1.97H6.75a.75.75 0 0 1 0-1.5Z',
  plus: 'M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z',
  x: 'M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z',
  trash: 'M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.675l.66 6.6a.25.25 0 0 0 .249.225h5.19a.25.25 0 0 0 .249-.225l.66-6.6a.75.75 0 0 1 1.492.149l-.66 6.6A1.748 1.748 0 0 1 10.595 15h-5.19a1.75 1.75 0 0 1-1.741-1.575l-.66-6.6a.75.75 0 1 1 1.492-.15ZM6.5 1.75V3h3V1.75a.25.25 0 0 0-.25-.25h-2.5a.25.25 0 0 0-.25.25Z',
  upload: 'M8.53 1.22a.749.749 0 0 0-1.06 0L4.22 4.47a.749.749 0 1 0 1.06 1.06l2-2v8.69a.75.75 0 0 0 1.5 0V3.53l2 2a.749.749 0 1 0 1.06-1.06ZM2.75 14.5a.75.75 0 0 0 0 1.5h10.5a.75.75 0 0 0 0-1.5Z',
  globe: 'M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM5.78 8.75a9.64 9.64 0 0 0 1.363 4.177c.255.426.542.832.857 1.215.245-.296.551-.705.857-1.215A9.64 9.64 0 0 0 10.22 8.75Zm4.44-1.5a9.64 9.64 0 0 0-1.363-4.177c-.307-.51-.612-.919-.857-1.215a9.927 9.927 0 0 0-.857 1.215A9.64 9.64 0 0 0 5.78 7.25Zm-5.944 1.5H1.543a6.507 6.507 0 0 0 4.292 5.204 11.168 11.168 0 0 1-1.158-2.306 11.303 11.303 0 0 1-.401-2.898Zm-2.733-1.5h2.733a11.281 11.281 0 0 1 1.56-5.204A6.507 6.507 0 0 0 1.543 7.25Zm9.899 0H14.457a6.507 6.507 0 0 0-4.292-5.204 11.168 11.168 0 0 1 1.158 2.306c.253.86.39 1.727.401 2.898Zm2.733 1.5h-2.733a11.281 11.281 0 0 1-1.56 5.204A6.507 6.507 0 0 0 14.457 8.75Z',
  external: 'M3.75 2h3.5a.75.75 0 0 1 0 1.5h-3.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-3.5a.75.75 0 0 1 1.5 0v3.5A1.75 1.75 0 0 1 12.25 14h-8.5A1.75 1.75 0 0 1 2 12.25v-8.5C2 2.784 2.784 2 3.75 2Zm6.854-1h4.146a.25.25 0 0 1 .25.25v4.146a.25.25 0 0 1-.427.177L13.03 4.03 9.28 7.78a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l3.75-3.75-1.543-1.543A.25.25 0 0 1 10.604 1Z',
  chat: 'M2.75 2h10.5A1.75 1.75 0 0 1 15 3.75v7.5A1.75 1.75 0 0 1 13.25 13h-4.19l-2.53 2.11a.75.75 0 0 1-1.23-.576V13H2.75A1.75 1.75 0 0 1 1 11.25v-7.5C1 2.784 1.784 2 2.75 2Zm0 1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h3.3a.75.75 0 0 1 .75.75v.647l1.596-1.33a.75.75 0 0 1 .48-.177h4.374a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25H2.75Z',
}

const statusDotClass = (status: string) => ({
  paid: 'bg-green-400', pending: 'bg-yellow-400', failed: 'bg-red-400', refunded: 'bg-orange-400',
}[status] || 'bg-[#555]')

const statusBadgeInfo = (status: string) => ({
  paid:     { label: 'Paid',     cls: 'bg-green-500/10 text-green-400' },
  pending:  { label: 'Pending',  cls: 'bg-yellow-500/10 text-yellow-400' },
  failed:   { label: 'Failed',   cls: 'bg-red-500/10 text-red-400' },
  refunded: { label: 'Refunded', cls: 'bg-orange-500/10 text-orange-400' },
}[status] || { label: status || '—', cls: 'bg-[#1a1a1a] text-[#666]' })

// ── Tabs ──
const tabs = [
  { id: 'overview',  label: 'Overview',  icon: 'home' },
  { id: 'orders',    label: 'Orders',    icon: 'package' },
  { id: 'projects',  label: 'Projects',  icon: 'folder' },
  { id: 'files',     label: 'Files',     icon: 'file' },
  { id: 'settings',  label: 'Settings',  icon: 'settings' },
]
const activeTab = ref('overview')
const currentTab = computed(() => tabs.find(t => t.id === activeTab.value))

// ── Auth ──
const { logout, getCurrentUser, getToken } = useGoogleAuth()
const { openPostBrief, briefDraft, briefEditorIntent, clearBriefDraft, clearBriefEditorIntent } = useChatDrawer()

const userEmail = ref('')
const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
})
const userName = computed(() => {
  const email = userEmail.value
  if (!email || email === 'guest@sitesynth.com') return 'there'
  return email.split('@')[0]
})
const userInitial = computed(() => (userEmail.value?.[0] || 'U').toUpperCase())
const normalizeBriefContent = (raw: string) => (raw.startsWith('<') ? raw : marked(raw) as string)
const isHtmlContent = (raw: string) => raw.trim().startsWith('<')
const formatDateTime = (dateString: string | Date): string => {
  if (!dateString) return '—'
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date)
}

const referencePipelineSteps = [
  { key: 'discovery', label: 'Discovery' },
  { key: 'capture', label: 'Capture' },
  { key: 'upload', label: 'Upload' },
  { key: 'analyze', label: 'Analyze' },
  { key: 'summary', label: 'Summary' },
]

const getStepFromLog = (message: string) => {
  const text = (message || '').toLowerCase()
  if (text.includes('reference discovery') || text.includes('discovered')) return 'discovery'
  if (text.includes('capture') || text.includes('captured')) return 'capture'
  if (text.includes('upload') || text.includes('drive')) return 'upload'
  if (text.includes('analyzing') || text.includes('analysis')) return 'analyze'
  if (text.includes('summary')) return 'summary'
  return null
}

const referencePipelineState = computed(() => {
  const logs = referenceLogs.value || []
  let currentStep: string | null = null
  for (const log of logs) {
    const step = getStepFromLog(log.message || '')
    if (step) currentStep = step
  }
  const activeIndex = referencePipelineSteps.findIndex((step) => step.key === currentStep)
  return {
    currentStep,
    activeIndex,
    status: referenceStatus.value,
  }
})

type Conversation = {
  id: string
  title?: string
  updated_at?: string
  created_at?: string
}

type ConversationMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

type BriefVersionItem = {
  id: string
  version: number
  markdown_content: string
  created_at: string
  source: string
  is_current?: boolean
  name?: string
}

const conversations = ref<Conversation[]>([])
const selectedConversationId = ref<string | null>(null)
const chatMessages = ref<ConversationMessage[]>([])
const chatInput = ref('')
const chatLoading = ref(false)
const conversationLoading = ref(false)
const chatError = ref('')
const chatMessagesContainer = ref<HTMLElement | null>(null)
const selectedConversation = computed(() => conversations.value.find((c) => c.id === selectedConversationId.value) || null)

// ── Data ──
const orders = ref<any[]>([])
const projects = ref<any[]>([])
const selectedOrder = ref<any>(null)
const showOrderDetails = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const userFiles = ref<any[]>([])
const dragActive = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)
const stats = ref({ totalProjects: 0, totalSpent: 0, activeWebsites: 0 })
const briefs = ref<any[]>([])
const selectedBrief = ref<any>(null)
const briefEditMode = ref(false)
const briefEditContent = ref('')
const briefEditName = ref('')
const showMediaLibrary = ref(false)
const mediaLibraryTab = ref<'references' | 'files'>('references')
const selectedMediaIndex = ref(0)
const isSavingBrief = ref(false)
const isGeneratingSpec = ref(false)
const isAnalyzingReferences = ref(false)
const referenceStatus = ref<'pending' | 'processing' | 'completed' | 'failed'>('pending')
const referenceAnalysis = ref<any | null>(null)
const referenceAssets = ref<any[]>([])
const referenceLogs = ref<Array<{ ts: string; level: string; message: string }>>([])
const referenceJob = ref<any | null>(null)
const isLoadingReferenceStatus = ref(false)
const isBuildingFigma = ref(false)
const figmaBuildStatus = ref<string | null>(null)
const lastFigmaJobId = ref<string | null>(null)
const lastFigmaBuildPlan = ref<any | null>(null)
const figmaJob = ref<any | null>(null)
const figmaEvents = ref<any[]>([])
const isLoadingFigmaStatus = ref(false)
let figmaStatusTimer: number | null = null
const isBuildingDemo = ref(false)
const demoBuildStatus = ref<string | null>(null)
const lastDemoJobId = ref<string | null>(null)
const demoJob = ref<any | null>(null)
const demoEvents = ref<any[]>([])
const demoArtifacts = ref<any[]>([])
const isLoadingDemoStatus = ref(false)
let demoStatusTimer: number | null = null
let referenceStatusTimer: number | null = null
const designSpec = ref<any>(null)
const lastSavedContent = ref('')
const lastSavedAt = ref<string | null>(null)
const lastDraftSource = ref<'agent' | null>(null)
const saveError = ref('')
const changeSummary = ref<string[]>([])
const queuedDraft = ref<{ briefId: string; markdown: string } | null>(null)
const draftDebug = ref<string[]>([])
const briefVersions = ref<BriefVersionItem[]>([])
const localHistoryVersions = ref<BriefVersionItem[]>([])
const showHistoryMenu = ref(false)
const viewedVersionId = ref<string | null>(null)
const compareVersionId = ref<string | null>(null)

const pushDraftDebug = (message: string) => {
  const line = `${new Date().toLocaleTimeString('en-US', { hour12: false })} ${message}`
  draftDebug.value = [line, ...draftDebug.value].slice(0, 6)
  console.log('[Cabinet Draft Debug]', line)
}

const isDirty = computed(() => {
  if (!briefEditMode.value) return false
  return briefEditContent.value !== lastSavedContent.value
})

const statusLabel = computed(() => {
  if (isSavingBrief.value) return 'Saving...'
  if (saveError.value) return 'Save failed'
  if (isDirty.value) return 'Unsaved changes'
  return 'Saved'
})

const statusClass = computed(() => {
  if (isSavingBrief.value) return 'bg-blue-500/10 text-blue-300 border border-blue-500/30'
  if (saveError.value) return 'bg-red-500/10 text-red-400 border border-red-500/30'
  if (isDirty.value) return 'bg-yellow-500/10 text-yellow-300 border border-yellow-500/30'
  return 'bg-green-500/10 text-green-400 border border-green-500/30'
})

const historyItems = computed(() => [...localHistoryVersions.value, ...briefVersions.value])
const viewedVersion = computed(() => historyItems.value.find((item) => item.id === viewedVersionId.value) || null)
const compareVersion = computed(() => historyItems.value.find((item) => item.id === compareVersionId.value) || null)
const isViewingHistory = computed(() => !!viewedVersion.value)
const compareSummary = computed(() => {
  if (!compareVersion.value) return [] as string[]
  return computeDraftDiff(lastSavedContent.value, normalizeBriefContent(compareVersion.value.markdown_content)).changedTitles
})
const referenceMediaItems = computed(() => (
  referenceAssets.value || []
).map((asset: any) => ({
  id: asset.id,
  kind: 'image',
  url: asset.public_url,
  title: asset.title || asset.competitor || asset.source_url || 'Reference',
  meta: `${asset.page_kind || 'page'} · ${asset.viewport || 'view'} · ${asset.competitor || 'reference'}`,
})))
const clientMediaItems = computed(() => (
  userFiles.value || []
).map((file: any) => ({
  id: file.id,
  kind: String(file.mimeType || '').startsWith('image/') ? 'image' : 'file',
  url: file.url,
  title: file.name || 'Client file',
  meta: `${file.mimeType || 'file'}${file.size ? ` · ${formatFileSize(file.size)}` : ''}`,
})).filter((item: any) => item.url))
const visibleMediaItems = computed(() => mediaLibraryTab.value === 'references' ? referenceMediaItems.value : clientMediaItems.value)
const activeMediaItem = computed(() => visibleMediaItems.value[selectedMediaIndex.value] || null)
const currentCompareHtml = computed(() => {
  if (isDirty.value && briefEditContent.value.trim()) return stripDraftDecorations(briefEditContent.value)
  return stripDraftDecorations(lastSavedContent.value || selectedBrief.value?.content || '')
})
const compareSections = computed(() => {
  if (!compareVersion.value) return [] as Array<{
    title: string
    leftHtml: string
    rightHtml: string
    status: 'added' | 'removed' | 'changed' | 'same'
  }>

  const leftMap = buildSectionMap(normalizeBriefContent(compareVersion.value.markdown_content || ''))
  const rightMap = buildSectionMap(currentCompareHtml.value)
  const titles = Array.from(new Set([...leftMap.keys(), ...rightMap.keys()]))

  return titles.map((title) => {
    const leftHtml = leftMap.get(title) || ''
    const rightHtml = rightMap.get(title) || ''
    let status: 'added' | 'removed' | 'changed' | 'same' = 'same'
    if (!leftHtml && rightHtml) status = 'added'
    else if (leftHtml && !rightHtml) status = 'removed'
    else if (leftHtml !== rightHtml) status = 'changed'
    return { title, leftHtml, rightHtml, status }
  })
})
const compareCounts = computed(() => ({
  added: compareSections.value.filter((section) => section.status === 'added').length,
  removed: compareSections.value.filter((section) => section.status === 'removed').length,
  changed: compareSections.value.filter((section) => section.status === 'changed').length,
}))
const initialVersionItem = computed<BriefVersionItem | null>(() => {
  if (!selectedBrief.value || briefVersions.value.length > 0) return null
  const initialContent = selectedBrief.value.content || lastSavedContent.value
  if (!initialContent) return null
  return {
    id: `initial-${selectedBrief.value.id}`,
    version: 1,
    markdown_content: initialContent,
    created_at: selectedBrief.value.created_at || new Date().toISOString(),
    source: 'initial-version',
    is_current: false,
    name: selectedBrief.value.name || 'Untitled Brief',
  }
})
const currentLocalDraftItem = computed<BriefVersionItem | null>(() => {
  if (!isDirty.value || !briefEditContent.value.trim()) return null
  return {
    id: `current-local-${selectedBrief.value?.id || 'unknown'}`,
    version: 0,
    markdown_content: stripDraftDecorations(briefEditContent.value),
    created_at: new Date().toISOString(),
    source: 'current-local-draft',
    is_current: false,
    name: selectedBrief.value?.name || 'Untitled Brief',
  }
})
const visibleHistoryItems = computed(() => {
  const items: BriefVersionItem[] = []
  if (currentLocalDraftItem.value) items.push(currentLocalDraftItem.value)
  if (initialVersionItem.value) items.push(initialVersionItem.value)
  items.push(...historyItems.value)
  return items
})

const pushLocalHistorySnapshot = (html: string, source: string) => {
  if (!html.trim()) return
  localHistoryVersions.value = [
    {
      id: `local-${Date.now()}`,
      version: 0,
      markdown_content: stripDraftDecorations(html),
      created_at: new Date().toISOString(),
      source,
      is_current: false,
      name: selectedBrief.value?.name || 'Untitled Brief',
    },
    ...localHistoryVersions.value,
  ].slice(0, 10)
}

const applyDraftToEditor = (draftHtml: string, source: 'agent', summary: string[] = []) => {
  briefEditMode.value = true
  briefEditContent.value = draftHtml
  lastDraftSource.value = source
  saveError.value = ''
  changeSummary.value = summary
}

const extractSections = (html: string): Array<{ title: string; html: string }> => {
  if (!html) return []
  if (typeof DOMParser === 'undefined') return []
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const nodes = Array.from(doc.body.childNodes)
  const sections: Array<{ title: string; html: string }> = []
  let buffer: Node[] = []
  let currentTitle = 'Intro'

  const flush = () => {
    if (buffer.length === 0) return
    const container = doc.createElement('div')
    buffer.forEach((n) => container.appendChild(n.cloneNode(true)))
    sections.push({ title: currentTitle, html: container.innerHTML })
    buffer = []
  }

  for (const node of nodes) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement
      if (['H1', 'H2', 'H3'].includes(el.tagName)) {
        flush()
        currentTitle = el.textContent?.trim() || 'Untitled'
        continue
      }
    }
    buffer.push(node)
  }
  flush()
  return sections
}

const buildSectionMap = (html: string): Map<string, string> => {
  const map = new Map<string, string>()
  for (const s of extractSections(html)) {
    map.set(s.title, s.html.replace(/\s+/g, ' ').trim())
  }
  return map
}

const decorateChangedSections = (html: string, changedTitles: Set<string>) => {
  if (!html || typeof DOMParser === 'undefined' || changedTitles.size === 0) return html
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const nodes = Array.from(doc.body.childNodes)
  const out = doc.createElement('div')
  let buffer: Node[] = []
  let currentTitle = 'Intro'

  const flush = () => {
    if (buffer.length === 0) return
    const section = doc.createElement('section')
    section.setAttribute('data-brief-section', 'true')
    if (changedTitles.has(currentTitle)) {
      section.setAttribute('data-changed', 'true')
    }
    buffer.forEach((n) => section.appendChild(n.cloneNode(true)))
    out.appendChild(section)
    buffer = []
  }

  for (const node of nodes) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement
      if (['H1', 'H2', 'H3'].includes(el.tagName)) {
        flush()
        currentTitle = el.textContent?.trim() || 'Untitled'
      }
    }
    buffer.push(node)
  }
  flush()
  return out.innerHTML
}

const stripDraftDecorations = (html: string) => {
  if (!html || typeof DOMParser === 'undefined') return html
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const sections = Array.from(doc.querySelectorAll('section[data-brief-section]'))
  for (const section of sections) {
    section.removeAttribute('data-brief-section')
    section.removeAttribute('data-changed')
    const parent = section.parentNode
    if (!parent) continue
    while (section.firstChild) {
      parent.insertBefore(section.firstChild, section)
    }
    parent.removeChild(section)
  }
  return doc.body.innerHTML
}

const computeDraftDiff = (prevHtml: string, nextHtml: string) => {
  const cleanPrev = stripDraftDecorations(prevHtml)
  const cleanNext = stripDraftDecorations(nextHtml)
  const prevMap = buildSectionMap(cleanPrev)
  const nextMap = buildSectionMap(cleanNext)
  const changed = new Set<string>()
  for (const [title, nextContent] of nextMap.entries()) {
    const prevContent = prevMap.get(title)
    if (!prevContent || prevContent !== nextContent) changed.add(title)
  }
  return {
    changedTitles: Array.from(changed),
    decoratedHtml: decorateChangedSections(cleanNext, changed),
  }
}

const handleIncomingDraft = (draftMarkdown: string, source: 'agent') => {
  pushDraftDebug(`handleIncomingDraft source=${source} selectedBrief=${selectedBrief.value?.id || 'none'} dirty=${String(isDirty.value)}`)
  const draftHtml = normalizeBriefContent(draftMarkdown)
  const diff = computeDraftDiff(briefEditContent.value, draftHtml)
  applyDraftToEditor(diff.decoratedHtml, source, diff.changedTitles)
  pushDraftDebug(`editor mode enabled summary=${diff.changedTitles.length}`)
}

const confirmDiscardUnsaved = () => {
  if (!isDirty.value) return true
  return confirm('You have unsaved changes. Discard them and continue?')
}

const processIncomingBriefDraft = async (draft: { briefId: string; markdown: string }) => {
  if (!draft) return
  pushDraftDebug(`processIncomingBriefDraft briefId=${draft.briefId}`)
  if (!selectedBrief.value) {
    if (briefs.value.length === 0) {
      pushDraftDebug('brief list not loaded yet, queueing draft')
      queuedDraft.value = { briefId: draft.briefId, markdown: draft.markdown }
      return
    }
    const match = briefs.value.find((b: any) => b.id === draft.briefId)
    if (!match) {
      pushDraftDebug('target brief not found in loaded briefs')
      toast.value = { message: 'Draft prepared, but the brief could not be found.', type: 'error' }
      return
    }
    pushDraftDebug(`opening brief ${match.id} from draft`)
    openBriefEditor(match)
    await nextTick()
  }

  if (draft.briefId !== selectedBrief.value?.id) {
    const match = briefs.value.find((b: any) => b.id === draft.briefId)
    if (!match) return
    pushDraftDebug(`switching selected brief to ${match.id}`)
    openBriefEditor(match)
    await nextTick()
  }

  if (briefEditContent.value.trim()) {
    pushLocalHistorySnapshot(briefEditContent.value, isDirty.value ? 'local-overwrite' : 'pre-draft')
  }

  handleIncomingDraft(draft.markdown, 'agent')
}

const loadBriefVersions = async (briefId: string) => {
  try {
    const response = await fetch(`/api/briefs/${briefId}/versions`, {
      headers: { 'x-user-email': userEmail.value },
    })
    const data = await response.json()
    if (response.ok && data.success) {
      briefVersions.value = data.data || []
    }
  } catch (error) {
    console.error('[Brief Versions] Failed to load versions:', error)
  }
}

const viewHistoryVersion = (version: BriefVersionItem) => {
  viewedVersionId.value = version.id
  compareVersionId.value = null
  briefEditMode.value = false
  selectedBrief.value = {
    ...selectedBrief.value,
    content: version.markdown_content,
  }
}

const exitHistoryView = () => {
  viewedVersionId.value = null
  compareVersionId.value = null
  if (selectedBrief.value) {
    selectedBrief.value = {
      ...selectedBrief.value,
      content: lastSavedContent.value,
    }
  }
}

const restoreHistoryVersion = (version: BriefVersionItem) => {
  const restoredHtml = normalizeBriefContent(version.markdown_content)
  pushLocalHistorySnapshot(briefEditContent.value || lastSavedContent.value, 'restore-backup')
  briefEditMode.value = true
  briefEditContent.value = restoredHtml
  changeSummary.value = computeDraftDiff(lastSavedContent.value, restoredHtml).changedTitles
  lastDraftSource.value = null
  viewedVersionId.value = null
  compareVersionId.value = null
}

const toggleCompareVersion = (version: BriefVersionItem) => {
  compareVersionId.value = compareVersionId.value === version.id ? null : version.id
}

const navigateHistory = (direction: -1 | 1) => {
  if (!viewedVersion.value) return
  const index = historyItems.value.findIndex((item) => item.id === viewedVersion.value?.id)
  if (index === -1) return
  const target = historyItems.value[index + direction]
  if (!target) return
  viewHistoryVersion(target)
}

const openMediaLibrary = (tab: 'references' | 'files', initialUrl?: string | null) => {
  mediaLibraryTab.value = tab
  const items = tab === 'references' ? referenceMediaItems.value : clientMediaItems.value
  const index = initialUrl ? items.findIndex((item: any) => item.url === initialUrl) : 0
  selectedMediaIndex.value = index >= 0 ? index : 0
  showMediaLibrary.value = true
}

const closeMediaLibrary = () => {
  showMediaLibrary.value = false
}

const selectPrevMedia = () => {
  const items = visibleMediaItems.value
  if (!items.length) return
  selectedMediaIndex.value = (selectedMediaIndex.value - 1 + items.length) % items.length
}

const selectNextMedia = () => {
  const items = visibleMediaItems.value
  if (!items.length) return
  selectedMediaIndex.value = (selectedMediaIndex.value + 1) % items.length
}

const handleBriefContentClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement | null
  const link = target?.closest?.('a') as HTMLAnchorElement | null
  if (!link?.href) return
  if (link.href.includes('/design_references/')) {
    event.preventDefault()
    openMediaLibrary('references', link.href)
  }
}

const handleMediaLibraryKeydown = (event: KeyboardEvent) => {
  if (!showMediaLibrary.value) return
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    selectPrevMedia()
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    selectNextMedia()
  } else if (event.key === 'Escape') {
    event.preventDefault()
    closeMediaLibrary()
  }
}

const loadReferenceStatus = async () => {
  if (!selectedBrief.value) return
  isLoadingReferenceStatus.value = true
  try {
    const res = await fetch(`/api/briefs/references/status?briefId=${encodeURIComponent(selectedBrief.value.id)}`, {
      headers: { 'x-user-email': userEmail.value },
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data?.success) {
      console.error('[References] Status error', { status: res.status, data })
      return
    }
    referenceStatus.value = data.data?.status || 'pending'
    referenceAnalysis.value = data.data?.analysis || null
    referenceAssets.value = data.data?.assets || []
    referenceLogs.value = data.data?.logs || []
    referenceJob.value = data.data?.job || null
    if (['processing', 'queued'].includes(referenceStatus.value)) {
      startReferencePolling()
    } else {
      stopReferencePolling()
    }
  } finally {
    isLoadingReferenceStatus.value = false
  }
}

const startReferencePolling = () => {
  if (referenceStatusTimer) return
  referenceStatusTimer = window.setInterval(loadReferenceStatus, 3000)
}

const stopReferencePolling = () => {
  if (referenceStatusTimer) {
    window.clearInterval(referenceStatusTimer)
    referenceStatusTimer = null
  }
}

const analyzeReferences = async () => {
  if (!selectedBrief.value) return
  isAnalyzingReferences.value = true
  referenceStatus.value = 'processing'
  referenceAnalysis.value = null
  referenceAssets.value = []
  referenceLogs.value = []
  referenceJob.value = null
  try {
    const res = await fetch('/api/briefs/references/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-email': userEmail.value },
      body: JSON.stringify({ briefId: selectedBrief.value.id, force: true }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data?.success) {
      console.error('[References] Run error', { status: res.status, data })
      throw new Error(data?.error || 'Reference analysis failed')
    }
    if (data?.data) {
      referenceJob.value = data.data
    }
    // Force status to queued locally so polling won't stop on stale 'failed'
    referenceStatus.value = 'queued'
    // Start polling — status is now queued so loadReferenceStatus won't kill the timer
    stopReferencePolling()
    startReferencePolling()
    showToast('Reference analysis queued', 'success')
  } catch (error: any) {
    console.error('[References] Analysis failed', error)
    referenceStatus.value = 'failed'
    showToast(error?.message || 'Reference analysis failed', 'error')
  } finally {
    isAnalyzingReferences.value = false
  }
}

const generateDesignSpec = async () => {
  if (!selectedBrief.value) return
  isGeneratingSpec.value = true
  try {
    const res = await fetch('/api/briefs/generate-spec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-email': userEmail.value },
      body: JSON.stringify({
        briefId: selectedBrief.value.id,
        markdownContent: briefEditContent.value
      })
    })
    const data = await res.json().catch(() => ({}))
    if (data.success) {
      designSpec.value = data.data
      await loadReferenceStatus()
    } else {
      console.error('[DesignSpec] Generate error', { status: res.status, data })
      alert('Failed to generate spec: ' + data.error)
    }
  } catch (e: any) {
    console.error('[DesignSpec] Generate failed', e)
  } finally {
    isGeneratingSpec.value = false
  }
}

watch(selectedBrief, async (value) => {
  if (!value) return
  await loadReferenceStatus()
  await loadFigmaBuildStatus()
  await loadDemoBuildStatus()
  if (figmaStatusTimer) window.clearInterval(figmaStatusTimer)
  if (demoStatusTimer) window.clearInterval(demoStatusTimer)
  if (referenceStatusTimer) window.clearInterval(referenceStatusTimer)
  figmaStatusTimer = window.setInterval(loadFigmaBuildStatus, 8000)
  demoStatusTimer = window.setInterval(loadDemoBuildStatus, 8000)
})

watch(mediaLibraryTab, () => {
  selectedMediaIndex.value = 0
})

onBeforeUnmount(() => {
  if (figmaStatusTimer) window.clearInterval(figmaStatusTimer)
  if (demoStatusTimer) window.clearInterval(demoStatusTimer)
  if (referenceStatusTimer) window.clearInterval(referenceStatusTimer)
})

const queueFigmaBuild = async () => {
  if (!selectedBrief.value) return
  if (!designSpec.value) {
    showToast('Generate a design spec first', 'error')
    return
  }
  isBuildingFigma.value = true
  figmaBuildStatus.value = 'Submitting build job...'
  try {
    const res = await fetch('/api/figma/build', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-email': userEmail.value },
      body: JSON.stringify({ briefId: selectedBrief.value.id }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data?.success) {
      throw new Error(data?.error || 'Failed to queue Figma build')
    }
    lastFigmaJobId.value = data.data?.jobId || null
    lastFigmaBuildPlan.value = data.data?.buildPlan || null
    await loadFigmaBuildStatus()
    const buildToken = data.data?.buildToken || null
    figmaBuildStatus.value = `Build queued${lastFigmaJobId.value ? ` (job ${lastFigmaJobId.value})` : ''}`
    showToast('Figma build queued', 'success')
  } catch (error: any) {
    figmaBuildStatus.value = error.message || 'Failed to queue build'
    showToast(figmaBuildStatus.value, 'error')
  } finally {
    isBuildingFigma.value = false
  }
}

const loadFigmaBuildStatus = async () => {
  if (!selectedBrief.value) return
  isLoadingFigmaStatus.value = true
  try {
    const res = await fetch(`/api/figma/build/status?briefId=${encodeURIComponent(selectedBrief.value.id)}`, {
      headers: { 'x-user-email': userEmail.value },
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data?.success) {
      return
    }
    figmaJob.value = data.data?.job || null
    figmaEvents.value = data.data?.events || []
  } finally {
    isLoadingFigmaStatus.value = false
  }
}

const queueDemoBuild = async () => {
  if (!selectedBrief.value) return
  if (!designSpec.value) {
    showToast('Generate a design spec first', 'error')
    return
  }
  isBuildingDemo.value = true
  demoBuildStatus.value = 'Submitting demo build job...'
  try {
    const res = await fetch('/api/demo/build', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-email': userEmail.value },
      body: JSON.stringify({ briefId: selectedBrief.value.id }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data?.success) {
      throw new Error(data?.error || 'Failed to queue demo build')
    }
    lastDemoJobId.value = data.data?.jobId || null
    await loadDemoBuildStatus()
    demoBuildStatus.value = `Demo build queued${lastDemoJobId.value ? ` (job ${lastDemoJobId.value})` : ''}`
    showToast('Demo build queued', 'success')
  } catch (error: any) {
    demoBuildStatus.value = error.message || 'Failed to queue demo build'
    showToast(demoBuildStatus.value, 'error')
  } finally {
    isBuildingDemo.value = false
  }
}

const loadDemoBuildStatus = async () => {
  if (!selectedBrief.value) return
  isLoadingDemoStatus.value = true
  try {
    const res = await fetch(`/api/demo/build/status?briefId=${encodeURIComponent(selectedBrief.value.id)}`, {
      headers: { 'x-user-email': userEmail.value },
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data?.success) {
      return
    }
    demoJob.value = data.data?.job || null
    demoEvents.value = data.data?.events || []
    demoArtifacts.value = data.data?.artifacts || []
  } finally {
    isLoadingDemoStatus.value = false
  }
}

// ── Brief Wizard ──
const showBriefWizard = ref(false)
const wizardPhase = ref<'upload' | 'description' | 'questions' | 'generating' | 'review' | 'saved' | 'error' | 'questions_error'>('upload')
const wizardFiles = ref<File[]>([])
const wizardFileInput = ref<HTMLInputElement | null>(null)
const wizardContentRef = ref<HTMLElement | null>(null)
const expandFilesPanel = ref(false)
const selectedStorageFileIds = ref<string[]>([])
const isGenerating = ref(false)
const isEnhancing = ref(false)
const generatedBrief = ref('')
const briefError = ref('')
const brevityData = ref({ uploadedFileIds: [] as string[] })
const currentQuestionIndex = ref(0)
const chatDrawerOpen = ref(false)
const chatConversationId = ref<string | null>(null)
const wizardConversationId = ref<string | null>(null)
const toast = ref<{ message: string; type: 'success' | 'error' } | null>(null)
const userMessage = ref('')
const lastOriginalMessage = ref('')
const enhanceHistory = ref<string[]>([])
const enhanceHistoryIndex = ref(-1)
const multiSelectValues = ref<string[]>([])
const answeredQuestions = ref<Array<{ id: string; questionText: string; saveKey: string; value: string; enhanced: boolean }>>([])
const productDescription = ref('')
const dynamicQuestions = ref<any[]>([])
const intakeSummaryDraft = ref('')
const isGeneratingIntakeSummary = ref(false)
const isGeneratingQuestions = ref(false)

// Current question computed (dynamic or static)
const currentQ = computed(() => {
  if (dynamicQuestions.value.length > 0) {
    return dynamicQuestions.value[currentQuestionIndex.value] || null
  }
  return briefQuestions[currentQuestionIndex.value] || null
})

// Progress
const totalQuestions = computed(() => dynamicQuestions.value.length || briefQuestions.length)

const wizardProgress = computed(() => {
  if (wizardPhase.value === 'upload') return 0
  if (wizardPhase.value === 'description') return 5
  if (wizardPhase.value === 'questions') return Math.round(((currentQuestionIndex.value) / totalQuestions.value) * 80) + 10
  if (wizardPhase.value === 'generating') return 90
  if (wizardPhase.value === 'review') return 95
  return 100
})

const wizardProgressLabel = computed(() => {
  if (wizardPhase.value === 'upload') return 'Upload reference files'
  if (wizardPhase.value === 'description') return 'Describe your product'
  if (wizardPhase.value === 'questions') return `Question ${currentQuestionIndex.value + 1} of ${totalQuestions.value}`
  if (wizardPhase.value === 'generating') return 'Generating brief...'
  if (wizardPhase.value === 'review') return 'Review your brief'
  return 'Done!'
})

// ── Brief Data ──
const briefData = ref<Record<string, any>>({
  projectName: '',
  projectDescription: '',
  projectType: '',
  projectCategory: '',
  industry: '',
  primaryGoal: '',
  targetAudience: '',
  painPoints: '',
  colorPalette: '',
  timeline: '',
  budget: '',
  deliverables: '',
  technicalRequirements: '',
})

const formatSummaryLabel = (key: string) =>
  key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())

const formatFigmaEventPayload = (payload: any) => {
  try {
    return JSON.stringify(payload, null, 2)
  } catch {
    return String(payload || '')
  }
}

const flattenSummaryLines = (value: any, path = ''): string[] => {
  if (value === null || value === undefined || value === '') return []
  if (Array.isArray(value)) {
    if (value.length === 0) return []
    if (value.every((item) => typeof item !== 'object')) {
      return [`- ${formatSummaryLabel(path || 'Items')}: ${value.join(', ')}`]
    }
    return value.flatMap((item, index) => flattenSummaryLines(item, path ? `${path} ${index + 1}` : `Item ${index + 1}`))
  }
  if (typeof value === 'object') {
    return Object.entries(value).flatMap(([key, nested]) => flattenSummaryLines(nested, path ? `${path} ${formatSummaryLabel(key)}` : formatSummaryLabel(key)))
  }
  return [`- ${path || 'Value'}: ${String(value)}`]
}

const latestIntakePayload = computed(() => {
  const sourceOrder = orders.value.find((order: any) => order?.form_data)
  if (!sourceOrder) return null
  try {
    const raw = typeof sourceOrder.form_data === 'string' ? JSON.parse(sourceOrder.form_data) : sourceOrder.form_data
    return raw || null
  } catch {
    return null
  }
})

const intakeSummaryText = computed(() => {
  const payload = latestIntakePayload.value
  if (!payload) return ''

  const sections: string[] = ['Client and project intake summary']
  const intakeFormData = payload.intakeFormData || {}
  const billingData = payload.billingData || {}

  if (briefData.value.projectType) {
    sections.push(`Product type: ${projectTypeLabel.value}`)
  }

  const lines = [
    ...flattenSummaryLines(intakeFormData, 'Project'),
    ...flattenSummaryLines(billingData, 'Billing'),
    ...flattenSummaryLines({ email: payload.email, amount: payload.amount }, 'Order'),
  ]

  if (lines.length > 0) {
    sections.push('', 'Known intake details:', ...lines)
  }

  sections.push('', 'Expand this into a fuller project description: what is being built, for whom, what outcomes matter, what constraints exist, and what should shape the design work.')
  return sections.join('\n')
})

const effectiveIntakeSummary = computed(() => intakeSummaryDraft.value.trim() || intakeSummaryText.value)

const projectTypeOptions = [
  { value: 'website', label: 'Website' },
  { value: 'mobile_app', label: 'Mobile App' },
  { value: 'web_app', label: 'Web App' },
  { value: 'catalog', label: 'Catalog' },
  { value: 'landing', label: 'Landing' },
]

const projectTypeLabel = computed(() =>
  projectTypeOptions.find((option) => option.value === briefData.value.projectType)?.label || ''
)

const productDescriptionPlaceholder = computed(() => {
  if (briefData.value.projectType === 'mobile_app') {
    return "E.g., 'We're building a mobile app for people managing recurring subscriptions. Users need quick onboarding, a clear dashboard, push reminders, and simple cancellation flows...'"
  }
  if (briefData.value.projectType === 'catalog') {
    return "E.g., 'We're building a searchable catalog where users browse items, filter by category, compare options, and open detailed item pages before contacting sales...'"
  }
  if (briefData.value.projectType === 'web_app') {
    return "E.g., 'We're building a web app for teams to manage tasks, monitor progress, and collaborate across projects. It needs dashboards, permissions, filters, and detailed views...'"
  }
  if (briefData.value.projectType === 'landing') {
    return "E.g., 'We're building a landing page to explain the product, build trust, and convert visitors into demo requests or signups...'"
  }
  return "E.g., 'We're building a SaaS project management tool for remote teams. It helps teams collaborate on tasks, set deadlines, and track progress. We're in MVP stage and targeting small startups...'"
})

// ── Helpers ──
const timeAgo = (dateString: string | Date): string => {
  if (!dateString) return '—'
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return formatDate(dateString)
}

const formatDate = (dateString: string | Date): string => {
  if (!dateString) return '—'
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date)
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

const handleBackToProjects = () => {
  if (!confirmDiscardUnsaved()) return
  selectedBrief.value = null
  briefEditMode.value = false
}

const getEmailFromToken = (rawToken: string | null): string => {
  if (!rawToken) return ''
  try { return atob(rawToken).split(':')[0] || '' } catch { return '' }
}

onMounted(async () => {
  // Get user email from auth
  const { loadStoredAuth } = useGoogleAuth()
  loadStoredAuth()
  const user = getCurrentUser()
  if (user?.email) {
    userEmail.value = user.email
  } else {
    // Fallback: try token
    const token = getToken()
    const email = getEmailFromToken(token)
    if (email) userEmail.value = email
  }

  if (!userEmail.value) {
    navigateTo('/login')
    return
  }

  try {
    localStorage.setItem('user_email', userEmail.value)
  } catch {}

  await tryClaimAnonymousConversation()

  // Load projects and briefs first to update stats correctly
  await loadBriefs()
  await loadUserFiles()
  await loadOrders()
  
  // Update stats — briefs ARE the projects now
  stats.value.totalProjects = briefs.value.length
  stats.value.totalSpent = orders.value.reduce((s: number, o: any) => s + (o.amount || 0), 0)
  stats.value.activeWebsites = projects.value.filter((p: any) => p.status === 'in_progress').length
})

const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if (!isDirty.value) return
  e.preventDefault()
  e.returnValue = ''
}

const handleBrowserDraftEvent = (event: Event) => {
  const customEvent = event as CustomEvent<{ briefId: string; markdown: string }>
  if (!customEvent.detail) return
  pushDraftDebug(`browser event received briefId=${customEvent.detail.briefId}`)
  processIncomingBriefDraft(customEvent.detail)
}

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
  window.addEventListener('sitesynth:brief-draft-ready', handleBrowserDraftEvent as EventListener)
  window.addEventListener('keydown', handleMediaLibraryKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
  window.removeEventListener('sitesynth:brief-draft-ready', handleBrowserDraftEvent as EventListener)
  window.removeEventListener('keydown', handleMediaLibraryKeydown)
})

onBeforeRouteLeave(() => {
  if (!isDirty.value) return true
  return confirm('You have unsaved changes. Leave this page and discard them?')
})

watch(briefDraft, async (draft) => {
  if (!draft) return
  pushDraftDebug(`watch briefDraft briefId=${draft.briefId}`)
  await processIncomingBriefDraft(draft)
  clearBriefDraft()
})

watch(briefEditorIntent, async (intent) => {
  if (!intent) return
  pushDraftDebug(`watch briefEditorIntent briefId=${intent.briefId} nonce=${intent.nonce}`)
  await processIncomingBriefDraft({ briefId: intent.briefId, markdown: intent.markdown })
  clearBriefEditorIntent()
})

const loadUserFiles = async () => {
  try {
    const r = await fetch('/api/files', { headers: { 'x-user-email': userEmail.value } })
    if (r.ok) { const d = await r.json(); userFiles.value = d.data || [] }
  } catch {}
}

const handleFileSelect = async (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files) { await uploadFiles(Array.from(input.files)); input.value = '' }
}

const handleFileDrop = async (e: DragEvent) => {
  dragActive.value = false
  if (e.dataTransfer?.files) await uploadFiles(Array.from(e.dataTransfer.files))
}

const uploadFiles = async (files: File[]) => {
  if (!files.length) return
  uploading.value = true
  uploadProgress.value = 0
  const existingIds = new Set(userFiles.value.map((file: any) => file.id))
  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      console.log('[Files] Uploading:', file.name, 'Size:', file.size, 'Email:', userEmail.value)

      // Step 1: Get resumable upload URL from server (small JSON request)
      const urlRes = await fetch('/api/files/get-upload-url', {
        method: 'POST',
        headers: { 'x-user-email': userEmail.value, 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, mimeType: file.type, fileSize: file.size }),
      })
      if (!urlRes.ok) {
        const err = await urlRes.json().catch(() => ({}))
        console.error('[Files] Get upload URL error:', urlRes.status, err)
        throw new Error(`Failed to get upload URL for ${file.name}`)
      }
      const { uploadUrl } = await urlRes.json()

      // Step 2: Upload file directly to Google Drive (bypasses Vercel size limit)
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
        body: file,
      })
      if (!uploadRes.ok) {
        const errText = await uploadRes.text()
        console.error('[Files] Direct upload error:', uploadRes.status, errText)
        throw new Error(`Upload failed: ${file.name}`)
      }

      console.log('[Files] Uploaded:', file.name)
      uploadProgress.value = Math.round(((i + 1) / files.length) * 100)
    }
    await loadUserFiles()
    const newIds = userFiles.value
      .map((file: any) => file.id)
      .filter((id: string) => id && !existingIds.has(id))
    if (newIds.length > 0) {
      fetch('/api/files/ingest', {
        method: 'POST',
        headers: { 'x-user-email': userEmail.value, 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileIds: newIds }),
      }).catch((error) => console.error('[Files] Ingest error:', error))
    }
  } catch (e) { console.error('[Files] Error:', e) }
  finally { uploading.value = false; uploadProgress.value = 0 }
}

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toast.value = { message, type }
  setTimeout(() => { toast.value = null }, 2500)
}

const deleteFile = async (fileId: string) => {
  try {
    const r = await fetch('/api/files', { method: 'DELETE', headers: { 'x-user-email': userEmail.value, 'Content-Type': 'application/json' }, body: JSON.stringify({ fileId }) })
    if (!r.ok) {
      const err = await r.json().catch(() => ({ message: r.statusText }))
      console.error('[Files] Delete error:', r.status, err)
      showToast('Failed to delete file', 'error')
      return
    }
    console.log('[Files] Deleted:', fileId)
    showToast('File deleted', 'success')
    await loadUserFiles()
  } catch (e) {
    console.error('[Files] Delete error:', e)
    showToast('Failed to delete file', 'error')
  }
}

const formatFileSize = (bytes: number): string => {
  if (!bytes) return '0 B'
  const k = 1024
  const s = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Math.round(bytes / Math.pow(k, i) * 100) / 100} ${s[i]}`
}

const chatTime = (iso?: string) => {
  if (!iso) return ''
  const date = new Date(iso)
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'now'
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const { deviceId, getClaimToken, clearClaimToken } = useAnonymousChat()

const tryClaimAnonymousConversation = async () => {
  if (!userEmail.value) return
  const claimToken = getClaimToken()
  if (!claimToken) return
  try {
    const response = await fetch('/api/auth/claim-conversation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ claim_token: claimToken, user_email: userEmail.value }),
    })
    if (response.ok) {
      clearClaimToken()
      console.log('[Cabinet] Claimed anonymous conversation via claim_token')
    } else {
      const err = await response.json().catch(() => ({}))
      console.warn('[Cabinet] Claim conversation failed:', err?.statusMessage || err?.error || response.status)
    }
  } catch (e) {
    console.warn('[Cabinet] Claim conversation error:', e)
  }
}

const getChatHeaders = (extra: Record<string, string> = {}) => {
  const headers: Record<string, string> = { ...extra }
  if (userEmail.value) headers['x-user-email'] = userEmail.value
  if (deviceId) headers['x-device-id'] = deviceId
  return headers
}

const loadConversationMessages = async (conversationId: string) => {
  chatLoading.value = true
  chatError.value = ''
  try {
    const response = await fetch(`/api/chat/messages?conversation_id=${conversationId}`, {
      headers: getChatHeaders(),
    })
    if (!response.ok) throw new Error('Failed to load messages')
    const data = await response.json()
    chatMessages.value = data.messages || data.data || []
  } catch (error: any) {
    chatError.value = error.message || 'Failed to load messages'
  } finally {
    chatLoading.value = false
    await nextTick()
    if (chatMessagesContainer.value) {
      chatMessagesContainer.value.scrollTop = chatMessagesContainer.value.scrollHeight
    }
  }
}

const selectConversation = async (conversationId: string) => {
  selectedConversationId.value = conversationId
  await loadConversationMessages(conversationId)
}

const createNewConversation = async () => {
  conversationLoading.value = true
  chatError.value = ''
  try {
    const response = await fetch('/api/chat/conversations', {
      method: 'POST',
      headers: getChatHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        title: `Cabinet Chat - ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
        agentType: 'briefing',
      }),
    })
    if (!response.ok) throw new Error('Failed to create chat')

    const data = await response.json()
    const conversation = data?.data
    if (conversation?.id) {
      conversations.value = [conversation, ...conversations.value]
      selectedConversationId.value = conversation.id
      chatMessages.value = []
    }
  } catch (error: any) {
    chatError.value = error.message || 'Failed to create chat'
  } finally {
    conversationLoading.value = false
  }
}

const deleteConversation = async (conversationId: string) => {
  if (!conversationId) return
  const confirmed = confirm('Delete this chat? This action cannot be undone.')
  if (!confirmed) return

  conversationLoading.value = true
  chatError.value = ''
  try {
    const response = await fetch('/api/chat/conversations', {
      method: 'DELETE',
      headers: getChatHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ conversationId }),
    })

    const result = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(result?.statusMessage || result?.error || 'Failed to delete chat')
    }

    const previousSelectedId = selectedConversationId.value
    conversations.value = conversations.value.filter((c) => c.id !== conversationId)

    if (conversations.value.length === 0) {
      selectedConversationId.value = null
      chatMessages.value = []
      await createNewConversation()
      return
    }

    if (previousSelectedId === conversationId) {
      selectedConversationId.value = conversations.value[0].id
      await loadConversationMessages(conversations.value[0].id)
    }
  } catch (error: any) {
    chatError.value = error.message || 'Failed to delete chat'
  } finally {
    conversationLoading.value = false
  }
}

const loadConversations = async () => {
  conversationLoading.value = true
  chatError.value = ''
  try {
    const response = await fetch('/api/chat/conversations?agentType=briefing', {
      headers: getChatHeaders(),
    })
    if (!response.ok) throw new Error('Failed to load chats')

    const data = await response.json()
    conversations.value = data.data || []

    if (conversations.value.length === 0) {
      await createNewConversation()
      return
    }

    const targetId = selectedConversationId.value || conversations.value[0].id
    if (targetId) {
      await selectConversation(targetId)
    }
  } catch (error: any) {
    chatError.value = error.message || 'Failed to load chats'
  } finally {
    conversationLoading.value = false
  }
}

const sendChatMessage = async () => {
  const message = chatInput.value.trim()
  if (!message || !selectedConversationId.value || chatLoading.value) return

  chatInput.value = ''
  chatError.value = ''
  chatLoading.value = true

  const temporaryMessage: ConversationMessage = {
    id: `tmp_${Date.now()}`,
    role: 'user',
    content: message,
    created_at: new Date().toISOString(),
  }
  chatMessages.value.push(temporaryMessage)

  try {
    const response = await fetch('/api/chat/messages', {
      method: 'POST',
      headers: getChatHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        conversation_id: selectedConversationId.value,
        message,
        history: chatMessages.value.filter((m) => m.id !== temporaryMessage.id),
        agent_type: 'briefing',
      }),
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data?.statusMessage || data?.error || 'Failed to send message')

    chatMessages.value = data.messages || []
    await loadConversations()

    if (data.briefDraft && selectedBrief.value) {
      handleIncomingDraft(data.briefDraft, 'agent')
    }

    // If we have a brief open that is tied to this conversation, fetch the latest brief content
    // because the AI might have updated it via tool call during this request!
    if (selectedBrief.value && selectedBrief.value.conversation_id === selectedConversationId.value) {
      try {
        const briefRes = await fetch(`/api/briefs/${selectedBrief.value.id}`, { headers: { 'x-user-email': userEmail.value } })
        if (briefRes.ok) {
          const briefData = await briefRes.json()
          if (briefData.data && briefData.data.markdown_content) {
            // Update the live editor window with the newly updated markdown content!
            selectedBrief.value.content = briefData.data.markdown_content
            selectedBrief.value.markdown_content = briefData.data.markdown_content
            if (!briefEditMode.value) {
              const normalized = normalizeBriefContent(briefData.data.markdown_content)
              briefEditContent.value = normalized
              lastSavedContent.value = normalized
              lastSavedAt.value = briefData.data.updated_at || lastSavedAt.value
            }
          }
        }
        await loadBriefs() // Keep side list updated too
      } catch (e) {
        console.error('Failed to sync brief updates from chat:', e)
      }
    }
  } catch (error: any) {
    chatMessages.value = chatMessages.value.filter((m) => m.id !== temporaryMessage.id)
    chatError.value = error.message || 'Failed to send message'
  } finally {
    chatLoading.value = false
    await nextTick()
    if (chatMessagesContainer.value) {
      chatMessagesContainer.value.scrollTop = chatMessagesContainer.value.scrollHeight
    }
  }
}

// ── Brief Management ──
const loadOrders = async () => {
  try {
    const token = localStorage.getItem('authToken') || ''
    const r = await fetch('/api/orders', { headers: { 'Authorization': `Bearer ${token}` } })
    if (r.ok) { const d = await r.json(); orders.value = d.data || [] }
  } catch {}
}

const loadBriefs = async () => {
  try {
    const r = await fetch('/api/briefs', { headers: { 'x-user-email': userEmail.value } })
    if (r.ok) {
      const d = await r.json()
      briefs.value = d.data || []
      stats.value.totalProjects = briefs.value.length
      if (queuedDraft.value) {
        const match = briefs.value.find((b: any) => b.id === queuedDraft.value?.briefId)
        if (match) {
          await processIncomingBriefDraft(queuedDraft.value)
          queuedDraft.value = null
        }
      }
    }
  } catch {}
}

const openBriefEditor = (brief: any) => {
  selectedBrief.value = brief
  briefEditMode.value = false
  // Convert markdown to HTML for TipTap (handles both old markdown and new HTML content)
  const raw = brief.content || ''
  const normalized = normalizeBriefContent(raw)
  briefEditContent.value = normalized
  lastSavedContent.value = normalized
  lastSavedAt.value = brief.updated_at || brief.created_at || null
  saveError.value = ''
  lastDraftSource.value = null
  changeSummary.value = []
  localHistoryVersions.value = []
  viewedVersionId.value = null
  compareVersionId.value = null
  showHistoryMenu.value = false
  briefEditName.value = brief.name || ''
  // Restore saved design spec if exists
  designSpec.value = brief.design_spec_json || null
  referenceStatus.value = brief.reference_status || 'pending'
  referenceAnalysis.value = brief.reference_analysis_json || null
  referenceAssets.value = []
  referenceLogs.value = Array.isArray(brief.reference_analysis_json?.logs) ? brief.reference_analysis_json.logs : []
  // Auto-start polling if brief is already queued or processing
  stopReferencePolling()
  if (['queued', 'processing'].includes(referenceStatus.value)) {
    loadReferenceStatus()
  }
  loadBriefVersions(brief.id)

  // Open chat drawer in post-brief mode so AI can assist with this brief
  if (brief.content) {
    openPostBrief({
      id: brief.id,
      name: brief.name || 'Untitled Brief',
      content: brief.content,
      conversationId: brief.conversation_id,
      files: userFiles.value.map((f: any) => f.name).filter(Boolean),
      fileIds: userFiles.value.map((f: any) => f.id).filter(Boolean),
    })
  }
}

const deleteBrief = async (brief: any) => {
  if (!confirm(`Delete "${brief.name || 'Untitled'}"?`)) return
  try {
    await fetch(`/api/briefs/${brief.id}`, {
      method: 'DELETE',
      headers: { 'x-user-email': userEmail.value },
    })
    if (selectedBrief.value?.id === brief.id) selectedBrief.value = null
    await loadBriefs()
  } catch (e) { console.error('Error deleting brief:', e) }
}

const saveBriefEdit = async () => {
  if (!selectedBrief.value?.id) return
  isSavingBrief.value = true
  saveError.value = ''
  try {
    const cleanHtml = stripDraftDecorations(briefEditContent.value)
    const r = await fetch(`/api/briefs/${selectedBrief.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-user-email': userEmail.value },
      // We persist the editor HTML into markdown_content to preserve rich formatting.
      body: JSON.stringify({ content: cleanHtml, name: briefEditName.value, source: lastDraftSource.value === 'agent' ? 'agent-save' : 'user-save' }),
    })
    const d = await r.json()
    if (r.ok && d.success) {
      selectedBrief.value = { ...selectedBrief.value, ...d.data, content: d.data?.content ?? cleanHtml, name: briefEditName.value }
      lastSavedContent.value = cleanHtml
      lastSavedAt.value = d.data?.updated_at || new Date().toISOString()
      lastDraftSource.value = null
      changeSummary.value = []
      briefEditContent.value = cleanHtml
      briefEditMode.value = false
      await loadBriefs()
      await loadBriefVersions(selectedBrief.value.id)
    } else {
      console.error('Save brief failed:', d.error)
      saveError.value = d.error || 'Failed to save brief'
    }
  } catch (e) {
    console.error('Error saving brief:', e)
    saveError.value = 'Failed to save brief'
  }
  finally { isSavingBrief.value = false }
}

// ── Brief Wizard Functions ──
const openBriefWizard = async () => {
  showBriefWizard.value = true
  resetWizard()
  await loadUserFiles() // Load available files from storage
  selectedStorageFileIds.value = userFiles.value.map((f: any) => f.id)
  if (latestIntakePayload.value) {
    await generateIntakeSummary()
  }
  if (effectiveIntakeSummary.value) {
    productDescription.value = effectiveIntakeSummary.value
    briefData.value.projectDescription = effectiveIntakeSummary.value
  }
}

const resetWizard = () => {
  wizardPhase.value = 'upload'
  wizardFiles.value = []
  selectedStorageFileIds.value = [] // Clear selected files
  currentQuestionIndex.value = 0
  userMessage.value = ''
  lastOriginalMessage.value = ''
  multiSelectValues.value = []
  answeredQuestions.value = []
  generatedBrief.value = ''
  productDescription.value = ''
  intakeSummaryDraft.value = ''
  wizardConversationId.value = null
  dynamicQuestions.value = []
  brevityData.value.uploadedFileIds = []
  lastOriginalMessage.value = ''
  enhanceHistory.value = []
  enhanceHistoryIndex.value = -1
  Object.keys(briefData.value).forEach(key => { briefData.value[key] = '' })
}

const handleWizardFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    const files = Array.from(input.files)
    wizardFiles.value.push(...files)
    input.value = ''
    await uploadFiles(files)
    selectedStorageFileIds.value = userFiles.value.map((f: any) => f.id)
  }
}

const handleWizardFileDrop = async (e: DragEvent) => {
  const files = Array.from(e.dataTransfer?.files || [])
  if (files.length) {
    wizardFiles.value.push(...files)
    await uploadFiles(files)
    selectedStorageFileIds.value = userFiles.value.map((f: any) => f.id)
  }
}

const toggleStorageFile = (fileId: string) => {
  const idx = selectedStorageFileIds.value.indexOf(fileId)
  if (idx > -1) {
    selectedStorageFileIds.value.splice(idx, 1)
  } else {
    selectedStorageFileIds.value.push(fileId)
  }
}

const uploadWizardFiles = async () => {
  if (wizardFiles.value.length === 0) return
  try {
    const uploadedIds: string[] = []
    for (const file of wizardFiles.value) {
      // Step 1: Get resumable upload URL (briefMode creates a subfolder)
      const urlRes = await fetch('/api/files/get-upload-url', {
        method: 'POST',
        headers: { 'x-user-email': userEmail.value, 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, mimeType: file.type, fileSize: file.size, briefMode: true }),
      })
      if (!urlRes.ok) throw new Error('Failed to get upload URL')
      const { uploadUrl } = await urlRes.json()

      // Step 2: Upload directly to Google Drive
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
        body: file,
      })
      if (!uploadRes.ok) throw new Error(`Failed to upload ${file.name}`)
      const fileData = await uploadRes.json()
      if (fileData.id) uploadedIds.push(fileData.id)
    }
    brevityData.value.uploadedFileIds = uploadedIds
    console.log('[Brief] Files uploaded:', uploadedIds)
    if (uploadedIds.length > 0) {
      fetch('/api/files/ingest', {
        method: 'POST',
        headers: { 'x-user-email': userEmail.value, 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileIds: uploadedIds }),
      }).catch((error) => console.error('[Brief] Ingest error:', error))
    }
  } catch (error) {
    console.error('Error uploading files:', error)
  }
}

const startDescription = async () => {
  wizardPhase.value = 'description'
  if (!productDescription.value.trim()) {
    if (!intakeSummaryDraft.value.trim() && latestIntakePayload.value) {
      await generateIntakeSummary()
    }
    productDescription.value = effectiveIntakeSummary.value || ''
  }
  briefData.value.projectDescription = productDescription.value
}

const ensureWizardConversation = async () => {
  if (wizardConversationId.value) return wizardConversationId.value
  const response = await fetch('/api/chat/conversations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-user-email': userEmail.value },
    body: JSON.stringify({
      agentType: 'briefing',
      title: briefData.value.projectName || 'Brief Intake',
    }),
  })
  const data = await response.json()
  if (response.ok && data?.data?.id) {
    wizardConversationId.value = data.data.id
    return wizardConversationId.value
  }
  throw new Error(data?.statusMessage || 'Failed to create intake conversation')
}

const persistIntakeSummaryToConversation = async () => {
  if (!effectiveIntakeSummary.value.trim()) return
  const conversationId = await ensureWizardConversation()
  await fetch('/api/chat/conversations/intake-summary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-user-email': userEmail.value },
    body: JSON.stringify({
      conversationId,
      summary: effectiveIntakeSummary.value,
    }),
  })
}

const generateIntakeSummary = async () => {
  if (!latestIntakePayload.value || isGeneratingIntakeSummary.value) return
  isGeneratingIntakeSummary.value = true
  try {
    const response = await fetch('/api/intake/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-email': userEmail.value },
      body: JSON.stringify({
        intakePayload: latestIntakePayload.value,
        projectType: briefData.value.projectType || null,
      }),
    })
    const data = await response.json()
    if (response.ok && data?.success && data?.data?.summary) {
      intakeSummaryDraft.value = data.data.summary
      if (!productDescription.value.trim() || productDescription.value === intakeSummaryText.value) {
        productDescription.value = data.data.summary
      }
    }
  } catch (error) {
    console.error('[Intake Summary] Error:', error)
  } finally {
    isGeneratingIntakeSummary.value = false
  }
}

const selectProjectType = (type: string) => {
  briefData.value.projectType = type
  if (latestIntakePayload.value) {
    generateIntakeSummary()
  }
}

const generateDynamicQuestions = async () => {
  if (!productDescription.value.trim() || productDescription.value.length < 20) {
    alert('Please provide a detailed product description (at least 20 characters)')
    return
  }

  isGeneratingQuestions.value = true
  try {
    briefData.value.projectDescription = productDescription.value
    await persistIntakeSummaryToConversation()
    const response = await fetch('/api/questionnaire/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productDescription: productDescription.value,
        projectType: briefData.value.projectType || null,
      }),
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || 'Failed to generate questions')
    }

    // Convert dynamic questions to standard format
    dynamicQuestions.value = (data.data?.questions || []).map((q: any) => ({
      id: q.id,
      text: q.text,
      type: q.type,
      options: q.options,
      hint: q.hint,
      saveKey: q.id.toLowerCase(), // Use question ID as save key
    }))

    if (dynamicQuestions.value.length === 0) {
      // Fallback to static questions if generation fails
      dynamicQuestions.value = []
    }

    currentQuestionIndex.value = 0
    answeredQuestions.value = []
    if (data.data?.productType && !briefData.value.projectType) {
      briefData.value.projectType = String(data.data.productType).toLowerCase().replace(/\s+/g, '_')
    }
    wizardPhase.value = 'questions'
  } catch (error) {
    console.error('[Questionnaire] Error:', error)
    wizardPhase.value = 'questions_error'
  } finally {
    isGeneratingQuestions.value = false
  }
}

const useDefaultQuestions = () => {
  dynamicQuestions.value = []
  currentQuestionIndex.value = 0
  wizardPhase.value = 'questions'
}

const startQuestions = async () => {
  wizardPhase.value = 'questions'
  currentQuestionIndex.value = 0
}

const toggleMultiSelect = (label: string) => {
  const idx = multiSelectValues.value.indexOf(label)
  if (idx >= 0) multiSelectValues.value.splice(idx, 1)
  else multiSelectValues.value.push(label)
}

const submitMultiSelect = () => {
  if (!currentQ.value || multiSelectValues.value.length === 0) return
  const value = multiSelectValues.value.join(', ')
  briefData.value[currentQ.value.saveKey] = value
  answeredQuestions.value.push({
    id: currentQ.value.id,
    questionText: currentQ.value.text,
    saveKey: currentQ.value.saveKey,
    value,
    enhanced: false,
  })
  multiSelectValues.value = []
  advanceQuestion()
}

const submitAnswer = () => {
  if (!userMessage.value.trim() || !currentQ.value) return
  briefData.value[currentQ.value.saveKey] = userMessage.value
  answeredQuestions.value.push({
    id: currentQ.value.id,
    questionText: currentQ.value.text,
    saveKey: currentQ.value.saveKey,
    value: userMessage.value,
    enhanced: false,
  })
  userMessage.value = ''
  lastOriginalMessage.value = ''
  enhanceHistory.value = []
  enhanceHistoryIndex.value = -1
  advanceQuestion()
}

const advanceQuestion = async () => {
  if (currentQuestionIndex.value < briefQuestions.length - 1) {
    currentQuestionIndex.value++
    await nextTick()
    wizardContentRef.value?.scrollTo({ top: wizardContentRef.value.scrollHeight, behavior: 'smooth' })
  } else {
    // All questions answered - generate brief
    wizardPhase.value = 'generating'
    await generateBriefWithGemini()
  }
}

const editAnswer = (idx: number) => {
  // Go back to that question
  const answer = answeredQuestions.value[idx]
  userMessage.value = answer.value
  currentQuestionIndex.value = briefQuestions.findIndex(q => q.id === answer.id)
  lastOriginalMessage.value = ''
  enhanceHistory.value = []
  enhanceHistoryIndex.value = -1
  const removed = answeredQuestions.value.splice(idx)
  removed.forEach(a => { briefData.value[a.saveKey] = '' })
}

const deleteAnswer = (idx: number) => {
  const answer = answeredQuestions.value[idx]
  userMessage.value = ''
  currentQuestionIndex.value = briefQuestions.findIndex(q => q.id === answer.id)
  const removed = answeredQuestions.value.splice(idx)
  removed.forEach(a => { briefData.value[a.saveKey] = '' })
}

const enhanceWithAI = async () => {
  if (!userMessage.value.trim() || !currentQ.value || isEnhancing.value) return
  if (!lastOriginalMessage.value) {
    lastOriginalMessage.value = userMessage.value
  }
  isEnhancing.value = true
  try {
    const response = await fetch('/api/brief/enhance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionText: currentQ.value.text,
        userAnswer: userMessage.value,
      }),
    })
    const data = await response.json()
    if (data.success && data.enhanced) {
      enhanceHistory.value.push(userMessage.value)
      enhanceHistoryIndex.value = enhanceHistory.value.length - 1
      userMessage.value = data.enhanced
    }
  } catch (error) {
    console.error('[Enhance] Error:', error)
  } finally {
    isEnhancing.value = false
  }
}

const undoEnhance = () => {
  if (enhanceHistoryIndex.value >= 0) {
    const current = userMessage.value
    userMessage.value = enhanceHistory.value[enhanceHistoryIndex.value]
    enhanceHistory.value[enhanceHistoryIndex.value] = current
    enhanceHistoryIndex.value--
  } else if (lastOriginalMessage.value) {
    enhanceHistory.value.push(userMessage.value)
    enhanceHistoryIndex.value = 0
    userMessage.value = lastOriginalMessage.value
    lastOriginalMessage.value = ''
  }
}

const redoEnhance = () => {
  if (enhanceHistoryIndex.value < enhanceHistory.value.length - 1) {
    enhanceHistoryIndex.value++
    const current = userMessage.value
    userMessage.value = enhanceHistory.value[enhanceHistoryIndex.value]
    enhanceHistory.value[enhanceHistoryIndex.value] = current
  }
}

const canUndo = computed(() => enhanceHistoryIndex.value >= 0 || !!lastOriginalMessage.value)
const canRedo = computed(() => enhanceHistoryIndex.value < enhanceHistory.value.length - 1)

// Strip HTML tags and return preview text (first 120 chars + ellipsis)
const stripHtmlPreview = (html: string): string => {
  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, '')
  // Decode common HTML entities
  text = text.replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
  // Trim whitespace and return first 120 chars with ellipsis
  text = text.trim()
  return text.length > 120 ? text.substring(0, 120) + '...' : text
}

const formatBriefHtml = (text: string): string => {
  if (!text) return ''
  if (isHtmlContent(text)) return text
  return text
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-[#8D35FF] mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-white mt-8 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-white mt-8 mb-4">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>')
    .replace(/^- (.+)$/gm, '<li class="text-[#ccc] ml-4 list-disc">$1</li>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>')
}

const generateBriefWithGemini = async () => {
  isGenerating.value = true
  try {
    const response = await fetch('/api/brief/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-email': userEmail.value },
      body: JSON.stringify({
        briefData: briefData.value,
        storageFileIds: selectedStorageFileIds.value
      }),
    })
    if (!response.ok) throw new Error(`API error: ${response.status}`)
    const data = await response.json()
    if (!data.success) throw new Error(data.error || 'Failed to generate brief')
    generatedBrief.value = data.content || ''
    wizardPhase.value = 'review'
  } catch (error) {
    console.error('Error generating brief:', error)
    briefError.value = error instanceof Error ? error.message : 'Unknown error'
    wizardPhase.value = 'error'
  } finally {
    isGenerating.value = false
  }
}

const newlySavedBrief = ref<any>(null)

const saveBrief = async () => {
  try {
    briefData.value.projectDescription = productDescription.value
    const response = await fetch('/api/briefs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-email': userEmail.value },
      body: JSON.stringify({
        name: briefData.value.projectName || 'Untitled Brief',
        briefData: briefData.value,
        content: generatedBrief.value,
        conversationId: wizardConversationId.value,
      }),
    })
    
    if (!response.ok) throw new Error('Failed to save brief (Network/Server error)')
    const data = await response.json()
    if (!data.success) throw new Error(data.error || "Failed to save brief (API returned success: false)")
    
    if (data.data) {
      newlySavedBrief.value = data.data
    }

    wizardPhase.value = 'saved'
    await loadBriefs()
  } catch (error: any) {
    console.error('Error saving brief:', error)
    alert(`Could not save brief: ${error.message}`)
  }
}

const finishWizard = async () => {
  showBriefWizard.value = false
  activeTab.value = 'projects'
  
  if (newlySavedBrief.value) {
    // Open the newly created brief inline
    openBriefEditor(newlySavedBrief.value)

    // Open AIChatDrawer in post-brief mode — agent will proactively guide next steps
    openPostBrief({
      id: newlySavedBrief.value.id,
      name: newlySavedBrief.value.name || 'Untitled Brief',
      content: newlySavedBrief.value.content || '',
      conversationId: newlySavedBrief.value.conversation_id,
      files: uploadedFiles.value.map((f: any) => f.name),
      fileIds: uploadedFiles.value.map((f: any) => f.id).filter(Boolean),
    })
  }
}

watch(activeTab, async (tab) => {
  if (tab === 'chat' && conversations.value.length === 0 && !conversationLoading.value) {
    await loadConversations()
  }
})

useSeoMeta({
  title: 'Cabinet | SiteSynth',
  description: 'Manage your SiteSynth projects and account settings.',
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

:deep(.compare-added) {
  box-shadow: inset 3px 0 0 rgba(16, 185, 129, 0.8);
  background: rgba(16, 185, 129, 0.06);
}

:deep(.compare-removed) {
  box-shadow: inset 3px 0 0 rgba(244, 63, 94, 0.8);
  background: rgba(244, 63, 94, 0.06);
}

:deep(.compare-changed) {
  box-shadow: inset 3px 0 0 rgba(56, 189, 248, 0.8);
  background: rgba(56, 189, 248, 0.06);
}

:deep([data-brief-section][data-changed]) {
  border-left: 2px solid rgba(141, 53, 255, 0.6);
  background: rgba(141, 53, 255, 0.08);
  padding-left: 12px;
  margin-left: -12px;
}

:deep([data-brief-section][data-changed] h1),
:deep([data-brief-section][data-changed] h2),
:deep([data-brief-section][data-changed] h3) {
  background: rgba(141, 53, 255, 0.12);
  padding: 4px 6px;
  display: inline-block;
}
</style>
