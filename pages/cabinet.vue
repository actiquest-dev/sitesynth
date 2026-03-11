<template>
  <div class="flex h-screen bg-[#161616] text-white overflow-hidden">

    <!-- Sidebar Menu -->
    <aside class="w-60 flex-shrink-0 border-r border-[#333] flex flex-col" style="background: linear-gradient(180deg, #1a1a1a 0%, #161616 100%);">
      <!-- Logo -->
      <div class="px-5 h-14 flex items-center border-b border-[#333] relative flex-shrink-0">
        <div class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#8D35FF] via-[#8D35FF]/50 to-transparent"></div>
        <NuxtLink to="/" class="flex items-center">
          <img src="/assets/Vector.svg" alt="SiteSynth" class="h-7 w-auto" />
        </NuxtLink>
      </div>

      <!-- Navigation Menu -->
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
          <Icon :name="tab.icon" size="16" class="flex-shrink-0" />
          {{ tab.label }}
        </button>
      </nav>

      <!-- User Section -->
      <div class="px-3 py-4 border-t border-[#333]">
        <div class="flex items-center gap-3 px-3 py-2 mb-1">
          <div class="w-7 h-7 rounded-none bg-[#8D35FF]/20 flex items-center justify-center text-xs font-medium text-[#8D35FF] flex-shrink-0">
            {{ userInitial }}
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-xs text-white font-medium truncate">{{ userEmail }}</p>
          </div>
        </div>
        <button
          @click="handleLogout"
          class="w-full flex items-center gap-3 px-3 py-2 rounded-none text-sm text-[#888] hover:text-white hover:bg-white/5 transition-all"
        >
          <Icon name="sign-out-alt" size="16" class="flex-shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">

      <!-- Top Breadcrumb bar -->
      <header class="h-14 border-b border-[#333] flex items-center justify-between px-6 flex-shrink-0">
        <div class="flex items-center gap-2 text-sm text-[#888]">
          <span class="text-[#555]">Cabinet</span>
          <span class="text-[#444]">/</span>
          <span class="text-white font-medium">{{ currentTab?.label }}</span>
        </div>
        <div class="flex items-center gap-2.5">
          <span class="text-xs text-[#555] hidden sm:block">{{ userEmail }}</span>
          <div class="w-7 h-7 rounded-none bg-[#8D35FF]/20 flex items-center justify-center text-xs font-medium text-[#8D35FF]">
            {{ userInitial }}
          </div>
        </div>
      </header>

      <!-- Content Area -->
      <main class="flex-1 overflow-y-auto bg-[#121212]">
        <ClientOnly>

          <!-- DASHBOARD TAB -->
          <div v-if="activeTab === 'dashboard'" class="mx-auto w-full max-w-[1240px] px-6 py-8">
            <div class="mb-8">
              <h2 class="text-xl font-semibold text-white mb-1">Welcome back, <span class="text-[#8D35FF]">{{ userName }}</span></h2>
              <p class="text-sm text-[#555]">Manage your briefs and projects</p>
            </div>

            <!-- Quick Stats -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div class="border border-[#333] rounded-none p-5 min-h-[132px] bg-[#1a1a1a] hover:border-[#555] transition-colors">
                <div class="flex items-center justify-between mb-4">
                  <p class="text-xs text-[#666] uppercase tracking-wider font-medium">Total Briefs</p>
                  <div class="w-7 h-7 rounded-none bg-white/5 flex items-center justify-center text-[#555]">
                    <Icon name="file" size="16" />
                  </div>
                </div>
                <p class="text-3xl font-semibold text-white tabular-nums">{{ totalBriefs }}</p>
              </div>
              <div class="border border-[#333] rounded-none p-5 min-h-[132px] bg-[#1a1a1a] hover:border-[#555] transition-colors">
                <div class="flex items-center justify-between mb-4">
                  <p class="text-xs text-[#666] uppercase tracking-wider font-medium">Files Uploaded</p>
                  <div class="w-7 h-7 rounded-none bg-white/5 flex items-center justify-center text-[#555]">
                    <Icon name="folder-open" size="16" />
                  </div>
                </div>
                <p class="text-3xl font-semibold text-white tabular-nums">{{ userFiles.length }}</p>
              </div>
              <div class="border border-[#8D35FF]/30 rounded-none p-5 min-h-[132px] bg-[#8D35FF]/5 hover:border-[#8D35FF]/50 transition-colors">
                <div class="flex items-center justify-between mb-4">
                  <p class="text-xs text-[#8D35FF]/70 uppercase tracking-wider font-medium">Active Projects</p>
                  <div class="w-7 h-7 rounded-none bg-[#8D35FF]/10 flex items-center justify-center text-[#8D35FF]">
                    <Icon name="project-diagram" size="16" />
                  </div>
                </div>
                <p class="text-3xl font-semibold text-[#8D35FF] tabular-nums">{{ stats.activeWebsites }}</p>
              </div>
            </div>

            <!-- Primary CTA -->
            <div class="border border-[#8D35FF]/30 rounded-none overflow-hidden bg-[#8D35FF]/5 mb-8">
              <div class="flex items-center justify-between px-5 py-4 border-b border-[#8D35FF]/30">
                <h3 class="text-sm font-medium text-white">Create New Brief</h3>
                <button
                  @click="openBriefWizard"
                  class="inline-flex h-10 items-center gap-2 px-4 bg-[#8D35FF] text-white rounded-none text-sm font-medium hover:bg-[#7B2AE8] transition-colors"
                >
                  <Icon name="sparkles" size="16" />
                  Start Wizard
                </button>
              </div>
              <div class="px-5 py-4">
                <p class="text-sm text-[#999]">Launch an interactive AI-guided wizard to create professional project briefs in minutes.</p>
              </div>
            </div>

            <!-- Recent Briefs -->
            <div v-if="recentBriefs.length > 0">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-medium text-white">Recent Briefs</h3>
                <button @click="activeTab = 'briefs'" class="text-xs text-[#8D35FF] hover:underline">View all →</button>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="brief in recentBriefs.slice(0, 4)"
                  :key="brief.id"
                  class="border border-[#333] rounded-none p-4 bg-[#1a1a1a] hover:border-[#555] transition-colors cursor-pointer"
                  @click="() => { activeTab = 'briefs'; selectedBriefId = brief.id }"
                >
                  <div class="flex items-start justify-between mb-2">
                    <h4 class="text-sm text-white font-medium flex-1 truncate">{{ brief.brief_data?.projectName || 'Untitled' }}</h4>
                    <span :class="['inline-block px-2 py-0.5 rounded-none text-xs font-medium ml-2 flex-shrink-0',
                      brief.status === 'approved' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                    ]">{{ brief.status || 'draft' }}</span>
                  </div>
                  <p class="text-xs text-[#666]">{{ formatDate(brief.createdAt || new Date().toISOString()) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- BRIEFS TAB -->
          <div v-if="activeTab === 'briefs'" class="mx-auto w-full max-w-[1240px] px-6 py-8">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-xl font-semibold text-white mb-1">Briefs</h2>
                <p class="text-sm text-[#666]">{{ briefs.length }} brief{{ briefs.length !== 1 ? 's' : '' }}</p>
              </div>
              <button
                @click="openBriefWizard"
                class="inline-flex h-10 items-center gap-2 px-4 bg-[#8D35FF] text-white rounded-none text-sm font-medium hover:bg-[#7B2AE8] transition-colors"
              >
                <Icon name="plus" size="16" />
                Create New Brief
              </button>
            </div>

            <!-- Briefs Grid -->
            <div v-if="briefs.length === 0" class="border border-[#333] rounded-none bg-[#1a1a1a]">
              <div class="py-16 text-center px-6">
                <Icon name="briefcase" size="32" class="mx-auto mb-4 text-[#444]" />
                <p class="text-sm text-white font-medium mb-1">No briefs yet</p>
                <p class="text-xs text-[#666] mb-5">Create your first brief to get started</p>
                <button
                  @click="openBriefWizard"
                  class="inline-flex h-10 items-center gap-2 px-4 bg-white text-[#161616] rounded-none text-sm font-medium hover:bg-[#E7E7E7] transition-colors"
                >
                  <Icon name="plus" size="16" />
                  Create Brief
                </button>
              </div>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="brief in briefs"
                :key="brief.id"
                class="border border-[#333] rounded-none p-5 bg-[#1a1a1a] hover:border-[#555] transition-colors"
              >
                <div class="flex items-start justify-between mb-3">
                  <h3 class="text-sm font-medium text-white flex-1">{{ brief.brief_data?.projectName || 'Untitled' }}</h3>
                  <span :class="['inline-block px-2 py-0.5 rounded-none text-xs font-medium ml-2 flex-shrink-0',
                    brief.status === 'approved' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                  ]">{{ brief.status || 'draft' }}</span>
                </div>
                <p class="text-xs text-[#666] mb-4">{{ formatDate(brief.createdAt || new Date().toISOString()) }}</p>
                <div class="flex gap-2">
                  <button
                    @click="viewBrief(brief)"
                    class="flex-1 px-3 py-2 border border-[#333] text-[#888] hover:text-white rounded-none text-xs transition-colors"
                  >
                    View
                  </button>
                  <button
                    @click="deleteBrief(brief)"
                    class="flex-1 px-3 py-2 border border-[#333] text-[#888] hover:text-red-400 rounded-none text-xs transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- FILES TAB -->
          <div v-if="activeTab === 'files'" class="mx-auto w-full max-w-[1240px] px-6 py-8">
            <div class="mb-6">
              <h2 class="text-xl font-semibold text-white mb-1">Project Files</h2>
              <p class="text-sm text-[#666]">Upload files for your briefs</p>
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
              <Icon name="upload" size="32" class="mx-auto mb-3 text-[#444]" />
              <p class="text-sm text-[#888] mb-1">Drop files here or <span class="text-white">click to browse</span></p>
              <p class="text-xs text-[#555]">PDF, DOC, DOCX, TXT, JPG, PNG, ZIP</p>
            </div>

            <!-- Upload Progress -->
            <div v-if="uploading" class="border border-[#333] rounded-none p-4 mb-6 bg-[#1a1a1a]">
              <div class="flex items-center justify-between mb-2">
                <p class="text-xs text-[#888]">Uploading...</p>
                <p class="text-xs text-[#888] tabular-nums">{{ uploadProgress }}%</p>
              </div>
              <div class="w-full bg-[#1a1a1a] rounded-none h-1">
                <div class="bg-[#8D35FF] h-1 rounded-none transition-all" :style="{ width: `${uploadProgress}%` }"></div>
              </div>
            </div>

            <!-- Files List -->
            <div class="border border-[#333] rounded-none overflow-hidden bg-[#1a1a1a]">
              <div class="px-5 py-3.5 border-b border-[#333]">
                <span class="text-xs text-[#666] uppercase tracking-wider">{{ userFiles.length }} file{{ userFiles.length !== 1 ? 's' : '' }}</span>
              </div>
              <div v-if="userFiles.length === 0" class="py-10 text-center">
                <p class="text-sm text-[#666]">No files uploaded yet</p>
              </div>
              <div v-else>
                <div
                  v-for="file in userFiles"
                  :key="file.id"
                  class="flex items-center justify-between px-5 py-3.5 border-b border-[#333] last:border-0 group hover:bg-white/5 transition-colors"
                >
                  <div class="flex items-center gap-3 min-w-0">
                    <Icon name="file" size="16" class="text-[#555] flex-shrink-0" />
                    <div class="min-w-0">
                      <p class="text-sm text-white truncate">{{ file.name }}</p>
                      <p class="text-xs text-[#555] mt-0.5">{{ formatFileSize(file.size) }} · {{ timeAgo(file.uploadedAt) }}</p>
                    </div>
                  </div>
                  <button
                    @click.stop="deleteFile(file.id)"
                    class="opacity-0 group-hover:opacity-100 p-1.5 text-[#555] hover:text-red-400 rounded-none transition-all ml-4"
                  >
                    <Icon name="trash" size="16" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- SETTINGS TAB -->
          <div v-if="activeTab === 'settings'" class="mx-auto w-full max-w-[920px] px-6 py-8">
            <div class="mb-6">
              <h2 class="text-xl font-semibold text-white mb-1">Settings</h2>
              <p class="text-sm text-[#666]">Manage your account</p>
            </div>

            <div class="space-y-4">
              <!-- Email -->
              <div class="border border-[#333] rounded-none overflow-hidden bg-[#1a1a1a]">
                <div class="px-5 py-4 border-b border-[#333]">
                  <p class="text-sm font-medium text-white">Email Address</p>
                </div>
                <div class="px-5 py-4 flex items-center justify-between">
                  <p class="text-sm text-[#888]">{{ userEmail }}</p>
                  <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-none bg-green-500/10 text-green-400 text-xs">
                    <span class="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                    Verified
                  </span>
                </div>
              </div>
            </div>
          </div>

        </ClientOnly>
      </main>
    </div>

    <!-- BRIEF CREATION WIZARD MODAL -->
    <Teleport to="body">
      <div
        v-if="showBriefWizard"
        class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click="closeBriefWizard"
      >
        <div
          class="bg-[#1a1a1a] border border-[#333] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          @click.stop
        >
          <!-- Modal Header -->
          <div class="sticky top-0 bg-[#1a1a1a] border-b border-[#333] p-6 flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-white">Create New Brief</h2>
              <p class="text-[#999999] text-sm mt-1">Stage {{ wizardStage }} of 5</p>
            </div>
            <button
              @click="closeBriefWizard"
              class="text-[#999999] hover:text-white transition"
            >
              <Icon name="times" size="24" />
            </button>
          </div>

          <!-- Progress Bar -->
          <div class="px-6 pt-6">
            <div class="w-full bg-[#0f0f0f] rounded-full h-2">
              <div
                class="bg-[#8D35FF] h-2 rounded-full transition-all duration-300"
                :style="{ width: `${(wizardStage / 5) * 100}%` }"
              ></div>
            </div>
          </div>

          <!-- Modal Content -->
          <div class="p-6">
            <!-- STAGE 1: UPLOAD FILES -->
            <div v-if="wizardStage === 1" class="space-y-6">
              <div>
                <h3 class="text-xl font-bold text-white mb-2"><Icon name="upload" class="mr-2 inline" />Upload Reference Files</h3>
                <p class="text-[#999999] text-sm">
                  Start by uploading brand guidelines, wireframes, or any reference materials. The AI will analyze these files to understand your project context.
                </p>
              </div>

              <!-- Upload Area -->
              <div
                @dragover.prevent="dragActive = true"
                @dragleave="dragActive = false"
                @drop.prevent="handleFileDrop"
                :class="{
                  'border-[#8D35FF] bg-[#8D35FF]/5': dragActive,
                  'border-[#333]': !dragActive,
                }"
                class="border-2 border-dashed rounded-lg p-8 transition cursor-pointer"
              >
                <input
                  ref="wizardFileInput"
                  type="file"
                  multiple
                  @change="handleWizardFileSelect"
                  class="hidden"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.zip"
                />
                <div @click="wizardFileInput?.click()" class="text-center">
                  <p class="text-[#999999] mb-2"><Icon name="upload" class="mr-2 inline" />Drop files here or click to browse</p>
                  <p class="text-[#666] text-sm">Supported: PDF, DOC, DOCX, TXT, JPG, PNG, ZIP</p>
                </div>
              </div>

              <!-- Files Added -->
              <div v-if="wizardFiles.length > 0" class="space-y-3">
                <p class="text-white text-sm font-semibold">{{ wizardFiles.length }} file(s) selected:</p>
                <div v-for="(file, idx) in wizardFiles" :key="idx" class="bg-[#0f0f0f] border border-[#333] rounded-lg p-3 flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <span class="text-lg">{{ getFileIcon(file.name) }}</span>
                    <span class="text-white text-sm">{{ file.name }}</span>
                  </div>
                  <button
                    @click="wizardFiles.splice(idx, 1)"
                    class="text-[#999999] hover:text-red-400 transition"
                  >
                    <Icon name="times" size="20" />
                  </button>
                </div>
              </div>

              <p class="text-[#999999] text-xs"><Icon name="lightbulb" class="mr-2 inline" />You can also skip this step and add files later</p>

              <!-- Navigation -->
              <div class="flex gap-3">
                <button
                  @click="closeBriefWizard"
                  class="flex-1 px-4 py-3 border border-[#333] text-[#999999] rounded-lg font-semibold hover:border-white hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  @click="nextWizardStage"
                  class="flex-1 px-4 py-3 bg-[#8D35FF] text-white rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
                >
                  Continue <Icon name="arrow-right" size="20" />
                </button>
              </div>
            </div>

            <!-- STAGE 2: GUIDED CONVERSATION -->
            <div v-if="wizardStage === 2" class="space-y-6">
              <div>
                <h3 class="text-xl font-bold text-white mb-2"><Icon name="comments" class="mr-2 inline" />Guided Conversation</h3>
                <p class="text-[#999999] text-sm mb-6">
                  Answer a few key questions about your project. The AI will extract important details to build your brief.
                </p>
                <div class="bg-[#0f0f0f] border border-[#333] rounded-lg p-3 mb-6">
                  <p class="text-white text-xs font-semibold">Question {{ currentQuestionIndex + 1 }} of {{ questionTree.length }}</p>
                </div>
              </div>

              <!-- Chat Messages -->
              <div class="bg-[#0f0f0f] border border-[#333] rounded-lg p-6 max-h-80 overflow-y-auto space-y-4">
                <div v-for="(msg, idx) in chatHistory" :key="idx" :class="[
                  'p-4 rounded-lg',
                  msg.role === 'assistant' ? 'bg-[#1a1a1a] border border-[#333]' : 'bg-[#8D35FF]/20 border border-[#8D35FF]/50'
                ]">
                  <p :class="msg.role === 'assistant' ? 'text-white' : 'text-[#8D35FF]'" class="text-sm flex items-center gap-2">
                    <Icon :name="msg.role === 'assistant' ? 'wand-magic' : 'user'" size="16" />
                    {{ msg.role === 'assistant' ? 'AI:' : 'You:' }}
                  </p>
                  <p class="text-[#999999] text-sm mt-1">{{ msg.content }}</p>
                </div>
              </div>

              <!-- Current Question -->
              <div v-if="getCurrentQuestion()" class="bg-[#0f0f0f] border border-[#333] rounded-lg p-6 space-y-4">
                <p class="text-white font-semibold">{{ getCurrentQuestion().text }}</p>
                
                <!-- Text Input -->
                <div v-if="getCurrentQuestion().type === 'text_input'" class="flex gap-3">
                  <input
                    v-model="userMessage"
                    @keyup.enter="sendMessage"
                    type="text"
                    :placeholder="getCurrentQuestion().hint || 'Your answer...'"
                    class="flex-1 px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-[#666] focus:border-[#8D35FF] focus:outline-none transition"
                  />
                  <button
                    @click="sendMessage"
                    class="px-6 py-3 bg-[#8D35FF] text-white rounded-lg font-semibold hover:bg-purple-700 transition"
                  >
                    Next
                  </button>
                </div>

                <!-- Textarea -->
                <div v-else-if="getCurrentQuestion().type === 'textarea'" class="flex flex-col gap-3">
                  <textarea
                    v-model="userMessage"
                    @keyup.ctrl.enter="sendMessage"
                    :placeholder="getCurrentQuestion().hint || 'Your answer...'"
                    class="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-[#666] focus:border-[#8D35FF] focus:outline-none transition h-24 resize-none"
                  ></textarea>
                  <button
                    @click="sendMessage"
                    class="w-full px-6 py-3 bg-[#8D35FF] text-white rounded-lg font-semibold hover:bg-purple-700 transition"
                  >
                    Next (Ctrl+Enter)
                  </button>
                </div>

                <!-- Single Select -->
                <div v-else-if="getCurrentQuestion().type === 'single_select'" class="flex flex-col gap-3">
                  <div class="grid grid-cols-2 gap-2">
                    <button
                      v-for="option in getCurrentQuestion().options"
                      :key="option.id"
                      @click="userMessage = option.label; sendMessage()"
                      :class="{
                        'bg-[#8D35FF] border-[#8D35FF] text-white': userMessage === option.label,
                        'bg-[#1a1a1a] border-[#333] text-[#999999] hover:border-[#8D35FF] hover:text-white': userMessage !== option.label
                      }"
                      class="px-4 py-3 border rounded-lg font-semibold transition"
                    >
                      {{ option.label }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- STAGE 3: GENERATE -->
            <div v-if="wizardStage === 3" class="space-y-6">
              <div>
                <h3 class="text-xl font-bold text-white mb-2"><Icon name="wand-magic" class="mr-2 inline" />Generate Brief</h3>
                <p class="text-[#999999] text-sm mb-6">
                  AI is analyzing your information and generating your professional brief.
                </p>
              </div>

              <div v-if="isGenerating && !generatedBrief" class="space-y-6">
                <!-- Loading -->
                <div class="flex justify-center py-8">
                  <div class="relative w-16 h-16">
                    <div class="absolute inset-0 border-2 border-[#333] rounded-full"></div>
                    <div class="absolute inset-0 border-2 border-transparent border-t-[#8D35FF] rounded-full animate-spin"></div>
                  </div>
                </div>
                <p class="text-center text-[#999999]">Analyzing your files and generating your brief...</p>
              </div>

              <div v-else-if="generatedBrief" class="space-y-4">
                <!-- Brief Preview -->
                <div class="bg-[#0f0f0f] border border-[#333] rounded-lg p-6 max-h-96 overflow-y-auto">
                  <div class="prose prose-invert max-w-none text-sm">
                    <div v-html="markdownToHtml(generatedBrief)" class="text-[#999999]"></div>
                  </div>
                </div>

                <!-- Refinement -->
                <div class="bg-[#0f0f0f] border border-[#333] rounded-lg p-6">
                  <p class="text-white font-semibold mb-3">Refine Your Brief</p>
                  <div class="flex gap-3 mb-3">
                    <input
                      v-model="briefQuestion"
                      @keyup.enter="askBriefQuestion"
                      type="text"
                      placeholder="Ask for changes (e.g., 'Make the goals section more detailed')"
                      class="flex-1 px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-[#666] focus:border-[#8D35FF] focus:outline-none transition"
                    />
                    <button
                      @click="askBriefQuestion"
                      :disabled="isGenerating"
                      class="px-6 py-3 bg-[#8D35FF] text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 transition"
                    >
                      Refine
                    </button>
                  </div>
                </div>

                <!-- Chat history with AI -->
                <div v-if="briefChatHistory.length > 0" class="bg-[#0f0f0f] border border-[#333] rounded-lg p-6 max-h-64 overflow-y-auto space-y-3">
                  <div v-for="(msg, idx) in briefChatHistory" :key="idx" :class="[
                    'p-3 rounded-lg text-sm',
                    msg.role === 'assistant' ? 'bg-[#1a1a1a] border border-[#333] text-[#999999]' : 'bg-[#8D35FF]/20 text-[#8D35FF]'
                  ]">
                    {{ msg.content }}
                  </div>
                </div>
              </div>
            </div>

            <!-- STAGE 4: REVIEW -->
            <div v-if="wizardStage === 4" class="space-y-6">
              <div>
                <h3 class="text-xl font-bold text-white mb-2"><Icon name="eye" class="mr-2 inline" />Review Your Brief</h3>
                <p class="text-[#999999] text-sm mb-6">
                  Here's your generated brief. Please review all details before saving.
                </p>
              </div>

              <div class="bg-[#0f0f0f] border border-[#333] rounded-lg p-6 max-h-[60vh] overflow-y-auto space-y-6">
                <!-- Project Overview -->
                <div class="border-b border-[#333] pb-4">
                  <h4 class="text-white font-bold mb-3 text-lg">📋 Project Overview</h4>
                  <div class="space-y-3">
                    <div>
                      <p class="text-[#666] text-xs uppercase tracking-wider">Project Name</p>
                      <p class="text-white font-semibold">{{ briefData.projectName || 'N/A' }}</p>
                    </div>
                    <div>
                      <p class="text-[#666] text-xs uppercase tracking-wider">Description</p>
                      <p class="text-[#999999] text-sm">{{ briefData.projectDescription || 'N/A' }}</p>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <p class="text-[#666] text-xs uppercase tracking-wider">Category</p>
                        <p class="text-white">{{ briefData.projectCategory || 'N/A' }}</p>
                      </div>
                      <div>
                        <p class="text-[#666] text-xs uppercase tracking-wider">Industry</p>
                        <p class="text-white">{{ briefData.industry || 'N/A' }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Rest of review sections like before -->
                <div class="border-b border-[#333] pb-4">
                  <h4 class="text-white font-bold mb-3 text-lg">🎯 Goals & Audience</h4>
                  <div class="space-y-3">
                    <div>
                      <p class="text-[#666] text-xs uppercase tracking-wider">Primary Goal</p>
                      <p class="text-white">{{ briefData.primaryGoal || 'N/A' }}</p>
                    </div>
                    <div>
                      <p class="text-[#666] text-xs uppercase tracking-wider">Target Audience</p>
                      <p class="text-[#999999] text-sm">{{ briefData.targetAudience || 'N/A' }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex gap-3">
                <button
                  @click="wizardStage = 3"
                  class="flex-1 px-4 py-3 border border-[#333] text-[#999999] rounded-lg font-semibold hover:border-white hover:text-white transition flex items-center justify-center gap-2"
                >
                  <Icon name="arrow-left" size="20" />Edit
                </button>
                <button
                  @click="nextWizardStage"
                  class="flex-1 px-4 py-3 bg-[#8D35FF] text-white rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
                >
                  Save Brief <Icon name="arrow-right" size="20" />
                </button>
              </div>
            </div>

            <!-- STAGE 5: SAVE -->
            <div v-if="wizardStage === 5" class="space-y-6">
              <div>
                <h3 class="text-xl font-bold text-white mb-2"><Icon name="save" class="mr-2 inline" />Save Your Brief</h3>
                <p class="text-[#999999] text-sm mb-6">
                  Save your brief to your dashboard or export it in various formats.
                </p>
              </div>

              <div class="space-y-4">
                <div class="bg-[#0f0f0f] border border-[#333] rounded-lg p-6">
                  <label class="text-[#999999] text-sm mb-2 block">Brief Name</label>
                  <input
                    v-model="briefName"
                    type="text"
                    placeholder="e.g., 'E-Commerce Redesign'"
                    class="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-[#666] focus:border-[#8D35FF] focus:outline-none transition"
                  />
                </div>

                <button
                  @click="saveBrief"
                  class="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  <Icon name="check" size="20" />Save to Dashboard
                </button>
              </div>
            </div>
          </div>

          <!-- Modal Footer Navigation -->
          <div class="sticky bottom-0 bg-[#1a1a1a] border-t border-[#333] p-6 flex items-center justify-between">
            <button
              v-if="wizardStage > 1"
              @click="wizardStage--"
              class="px-6 py-3 border border-[#333] text-[#999999] rounded-lg font-semibold hover:border-white hover:text-white transition flex items-center gap-2"
            >
              <Icon name="arrow-left" size="20" /> Back
            </button>
            <div v-else></div>

            <div class="flex items-center gap-3">
              <button
                @click="closeBriefWizard"
                class="px-6 py-3 border border-[#333] text-[#999999] rounded-lg font-semibold hover:border-white hover:text-white transition"
              >
                Cancel
              </button>
              <button
                v-if="wizardStage < 5"
                @click="nextWizardStage"
                class="px-6 py-3 bg-[#8D35FF] text-white rounded-lg font-semibold hover:bg-purple-700 transition flex items-center gap-2"
              >
                Next <Icon name="arrow-right" size="20" />
              </button>
              <button
                v-else
                @click="saveBrief"
                class="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center gap-2"
              >
                <Icon name="check" size="20" /> Save Brief
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Icon from '@/components/ui/Icon.vue'
import { useGoogleAuth } from '@/composables/useGoogleAuth'

const { logout, getCurrentUser, getToken } = useGoogleAuth()

const siteUrl = useRuntimeConfig().public?.siteUrl

// ── Tabs ──
const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: 'home' },
  { id: 'briefs', label: 'Briefs', icon: 'briefcase' },
  { id: 'files', label: 'Files', icon: 'folder' },
  { id: 'settings', label: 'Settings', icon: 'cog' },
]
const activeTab = ref('dashboard')
const currentTab = computed(() => tabs.find(t => t.id === activeTab.value))

// ── Auth ──
const userEmail = ref('')
const userName = computed(() => {
  const email = userEmail.value
  if (!email) return 'there'
  return email.split('@')[0]
})
const userInitial = computed(() => (userEmail.value?.[0] || 'U').toUpperCase())

// ── Brief Wizard State ──
const showBriefWizard = ref(false)
const wizardStage = ref(1)
const wizardFiles = ref<File[]>([])
const wizardFileInput = ref<HTMLInputElement | null>(null)
const chatHistory = ref<Array<{ role: string; content: string }>>([])
const userMessage = ref('')
const briefName = ref('')
const isGenerating = ref(false)
const generatedBrief = ref('')
const briefChatHistory = ref<Array<{ role: string; content: string }>>([])
const briefQuestion = ref('')
const additionalFileInput = ref<HTMLInputElement | null>(null)
const dragActive = ref(false)

// ── Brief Data ──
const briefData = ref({
  projectName: '',
  projectDescription: '',
  projectType: '',
  projectCategory: '',
  industry: '',
  primaryGoal: '',
  targetAudience: '',
  painPoints: [] as string[],
  colorPalette: [] as any[],
  timeline: '',
  budget: '',
  deliverables: [] as string[],
  technicalRequirements: [] as string[],
})

const brevityData = ref({
  uploadedFileIds: [] as string[],
  uploadedFolderIds: [] as string[],
})

// ── Question Tree ──
const currentQuestionIndex = ref(0)
const questionTree = [
  {
    id: 'Q2.1',
    stage: 2,
    text: 'What is your project called?',
    type: 'text_input',
    saveKey: 'projectName',
    hint: 'e.g., E-Commerce Redesign, FinTech App',
  },
  {
    id: 'Q2.2',
    stage: 2,
    text: 'In one sentence, what are you building?',
    type: 'textarea',
    saveKey: 'projectDescription',
    hint: 'Brief description of your project',
  },
  {
    id: 'Q2.3',
    stage: 2,
    text: 'What type of project is this?',
    type: 'single_select',
    options: [
      { id: 'website', label: 'Website / Landing page' },
      { id: 'mobile_app', label: 'Mobile Application' },
      { id: 'web_app', label: 'Web Application / SaaS' },
      { id: 'branding', label: 'Branding / Brand Identity' },
      { id: 'ecommerce', label: 'E-commerce Platform' },
    ],
    saveKey: 'projectCategory',
  },
  {
    id: 'Q2.4',
    stage: 2,
    text: 'What is the primary goal of this project?',
    type: 'text_input',
    saveKey: 'primaryGoal',
    hint: 'e.g., Increase conversion, improve UX, launch product',
  },
  {
    id: 'Q2.5',
    stage: 2,
    text: 'Who is your target audience?',
    type: 'text_input',
    saveKey: 'targetAudience',
    hint: 'e.g., Small business owners aged 25-45',
  },
  {
    id: 'Q2.6',
    stage: 2,
    text: 'What problems need to be solved? (list them)',
    type: 'textarea',
    saveKey: 'painPoints',
    hint: 'List 2-3 main problems',
  },
  {
    id: 'Q2.7',
    stage: 2,
    text: 'What is your timeline? (when do you need results)',
    type: 'text_input',
    saveKey: 'timeline',
    hint: 'e.g., 2 weeks, by April 15',
  },
  {
    id: 'Q2.8',
    stage: 2,
    text: 'What is your budget?',
    type: 'single_select',
    options: [
      { id: 'low', label: '$500-2000' },
      { id: 'medium', label: '$2000-5000' },
      { id: 'high', label: '$5000-15000' },
      { id: 'premium', label: '$15000+' },
    ],
    saveKey: 'budget',
  },
  {
    id: 'Q3.1',
    stage: 3,
    text: 'What is the primary industry / sector?',
    type: 'text_input',
    saveKey: 'industry',
    hint: 'e.g., FinTech, SaaS, E-commerce, Healthcare',
  },
  {
    id: 'Q3.2',
    stage: 3,
    text: 'What are the main colors in your brand palette?',
    type: 'textarea',
    saveKey: 'colorPalette',
    hint: 'e.g., Primary: #8D35FF, Secondary: #FF6B35',
  },
  {
    id: 'Q4.1',
    stage: 4,
    text: 'What are the main deliverables needed?',
    type: 'textarea',
    saveKey: 'deliverables',
    hint: 'e.g., UI Design, Wireframes, Prototype, Code',
  },
  {
    id: 'Q5.1',
    stage: 5,
    text: 'What are the technical requirements?',
    type: 'textarea',
    saveKey: 'technicalRequirements',
    hint: 'e.g., Responsive, SEO-optimized, WCAG 2.1 AA',
  },
]

// ── Data ──
const stats = ref({ totalProjects: 0, totalSpent: 0, activeWebsites: 0 })
const briefs = ref<any[]>([])
const projects = ref<any[]>([])
const fileInput = ref<HTMLInputElement | null>(null)
const userFiles = ref<any[]>([])
const uploading = ref(false)
const uploadProgress = ref(0)
const selectedBriefId = ref<string | null>(null)
const additionalFileInput = ref<HTMLInputElement | null>(null)
const filterAgent = ref('')

// ── Computed ──
const totalBriefs = computed(() => briefs.value.length)
const activeBriefs = computed(() => briefs.value.filter(b => b.status === 'draft').length)
const recentBriefs = computed(() => briefs.value.slice(0, 4))
const filteredBriefs = computed(() => {
  if (!filterAgent.value) return briefs.value
  return briefs.value.filter(b => b.agent_type === filterAgent.value)
})
const totalFileSize = computed(() => {
  const total = userFiles.value.reduce((sum, f) => sum + (f.size || 0), 0)
  return formatFileSize(total)
})

// ── Helper Functions ──
const formatDate = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

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

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const getFileIcon = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase()
  const icons: Record<string, string> = {
    pdf: '📄',
    doc: '📝',
    docx: '📝',
    txt: '📋',
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    zip: '📦',
  }
  return icons[ext || ''] || '📎'
}

const markdownToHtml = (markdown: string): string => {
  let html = markdown
    .replace(/^### (.*?)$/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    .replace(/^- (.*?)$/gm, '<li class="ml-4">$1</li>')
    .replace(/\n\n/g, '</p><p>')
  return html
}

// ── Brief Wizard Functions ──
const openBriefWizard = () => {
  showBriefWizard.value = true
  wizardStage.value = 1
  wizardFiles.value = []
  chatHistory.value = []
  userMessage.value = ''
  briefName.value = ''
  isGenerating.value = false
  currentQuestionIndex.value = 0
  
  briefData.value = {
    projectName: '',
    projectDescription: '',
    projectType: '',
    projectCategory: '',
    industry: '',
    primaryGoal: '',
    targetAudience: '',
    painPoints: [],
    colorPalette: [],
    timeline: '',
    budget: '',
    deliverables: [],
    technicalRequirements: [],
  }
}

const closeBriefWizard = () => {
  showBriefWizard.value = false
}

const getCurrentQuestion = () => {
  return questionTree[currentQuestionIndex.value]
}

const sendMessage = () => {
  if (!userMessage.value.trim()) return

  const currentQuestion = getCurrentQuestion()
  chatHistory.value.push({ role: 'user', content: userMessage.value })
  
  const saveKey = currentQuestion.saveKey
  if (currentQuestion.type === 'textarea' && saveKey === 'painPoints') {
    briefData.value[saveKey] = userMessage.value.split('\n').filter(s => s.trim())
  } else {
    briefData.value[saveKey] = userMessage.value
  }
  
  userMessage.value = ''
  
  setTimeout(() => {
    const agentResponses: Record<string, string> = {
      projectName: `✓ Got it! The project is called "${briefData.value.projectName}".`,
      projectDescription: `Understood! So we're working on: "${briefData.value.projectDescription.substring(0, 50)}..."`,
      projectCategory: `Perfect! ${briefData.value.projectCategory}.`,
      primaryGoal: `I see, the main goal is — ${briefData.value.primaryGoal}.`,
      targetAudience: `Thanks! Target audience — ${briefData.value.targetAudience}.`,
      painPoints: `Got the problems. Moving forward!`,
      timeline: `Timeline: ${briefData.value.timeline}. Understood!`,
      budget: `Budget: ${briefData.value.budget}. Great!`,
    }
    
    const response = agentResponses[saveKey] || 'Thanks for the information!'
    chatHistory.value.push({ role: 'assistant', content: response })
    
    currentQuestionIndex.value++
    if (currentQuestionIndex.value >= questionTree.length) {
      setTimeout(async () => {
        wizardStage.value = 3
        isGenerating.value = true
        await generateBriefWithGemini()
      }, 500)
    }
  }, 500)
}

const generateBriefWithGemini = async () => {
  try {
    isGenerating.value = true
    briefChatHistory.value = []
    
    // Upload files if they haven't been uploaded yet
    if (wizardFiles.value.length > 0 && brevityData.value.uploadedFileIds.length === 0) {
      await uploadWizardFiles()
    }
    
    const response = await fetch('/api/brief/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        briefData: briefData.value,
        uploadedFiles: brevityData.value.uploadedFileIds,
        userMessage: null,
      }),
    })
    
    if (!response.ok) throw new Error('Failed to generate brief')
    
    const data = await response.json()
    if (data.success) {
      generatedBrief.value = data.content
      briefChatHistory.value.push({
        role: 'assistant',
        content: '✓ Brief generated successfully! You can now ask me to modify, expand, or clarify any section.',
      })
    } else {
      throw new Error(data.error)
    }
  } catch (error) {
    console.error('Error generating brief:', error)
    briefChatHistory.value.push({
      role: 'assistant',
      content: `Error: ${error instanceof Error ? error.message : 'Failed to generate brief'}`,
    })
  } finally {
    isGenerating.value = false
  }
}

const askBriefQuestion = async () => {
  if (!briefQuestion.value.trim()) return
  
  try {
    briefChatHistory.value.push({
      role: 'user',
      content: briefQuestion.value,
    })
    
    const userMsg = briefQuestion.value
    briefQuestion.value = ''
    isGenerating.value = true
    
    const response = await fetch('/api/brief/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        briefData: briefData.value,
        uploadedFiles: brevityData.value.uploadedFileIds,
        userMessage: userMsg,
        currentBrief: generatedBrief.value,
      }),
    })
    
    if (!response.ok) throw new Error('Failed to get response')
    
    const data = await response.json()
    if (data.success) {
      briefChatHistory.value.push({
        role: 'assistant',
        content: data.content,
      })
      
      if (userMsg.toLowerCase().includes('update') || userMsg.toLowerCase().includes('change')) {
        generatedBrief.value = data.content
      }
    }
  } catch (error) {
    console.error('Error asking question:', error)
    briefChatHistory.value.push({
      role: 'assistant',
      content: `Error: ${error instanceof Error ? error.message : 'Something went wrong'}`,
    })
  } finally {
    isGenerating.value = false
  }
}

const uploadWizardFiles = async () => {
  if (wizardFiles.value.length === 0) return

  try {
    isGenerating.value = true
    const formData = new FormData()
    
    wizardFiles.value.forEach(file => {
      formData.append('files', file)
    })
    
    const response = await fetch('/api/brief/upload-files', {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) throw new Error('Failed to upload files')
    
    const data = await response.json()
    if (data.success) {
      brevityData.value.uploadedFileIds = data.files?.map((f: any) => f.id) || []
      if (data.folderId) brevityData.value.uploadedFolderIds.push(data.folderId)
      
      chatHistory.value.push({
        role: 'assistant',
        content: `✓ Files uploaded! I'll analyze these ${data.files?.length || 0} file(s) as I generate your brief.`,
      })
    }
  } catch (error) {
    console.error('Error uploading files:', error)
    chatHistory.value.push({
      role: 'assistant',
      content: `Error uploading files: ${error instanceof Error ? error.message : 'Unknown error'}`,
    })
  } finally {
    isGenerating.value = false
  }
}

const nextWizardStage = async () => {
  if (wizardStage.value === 1) {
    if (wizardFiles.value.length > 0) {
      await uploadWizardFiles()
    }
    wizardStage.value = 2
    currentQuestionIndex.value = 0
  } else if (wizardStage.value === 3) {
    wizardStage.value = 4
  } else if (wizardStage.value === 4) {
    wizardStage.value = 5
  }
}

const handleWizardFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    wizardFiles.value.push(...Array.from(input.files))
    input.value = ''
  }
}

const saveBrief = () => {
  if (!briefName.value.trim()) {
    alert('Please enter a brief name')
    return
  }
  
  const newBrief = {
    id: Date.now(),
    name: briefName.value,
    brief_data: briefData.value,
    content: generatedBrief.value,
    status: 'approved',
    createdAt: new Date().toISOString(),
  }
  
  briefs.value.push(newBrief)
  console.log('Brief saved:', newBrief)
  closeBriefWizard()
  alert(`✓ Brief "${briefName.value}" saved successfully!`)
}

const viewBrief = (brief: any) => {
  selectedBriefId.value = brief.id
}

const deleteBrief = async (brief: any) => {
  if (confirm('Delete this brief?')) {
    briefs.value = briefs.value.filter(b => b.id !== brief.id)
  }
}

// ── File Management ──
const handleFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    await uploadFiles(Array.from(input.files))
    input.value = ''
  }
}

const handleFileDrop = async (event: DragEvent) => {
  dragActive.value = false
  if (event.dataTransfer?.files) {
    await uploadFiles(Array.from(event.dataTransfer.files))
  }
}

const uploadFiles = async (files: File[]) => {
  if (files.length === 0) return

  uploading.value = true
  uploadProgress.value = 0

  try {
    for (let i = 0; i < files.length; i++) {
      uploadProgress.value = Math.round(((i + 1) / files.length) * 100)
    }
    await loadUserFiles()
  } catch (error) {
    console.error('Upload error:', error)
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}

const deleteFile = async (fileId: string) => {
  if (confirm('Delete this file?')) {
    console.log('Deleting file:', fileId)
    await loadUserFiles()
  }
}

const loadBriefs = async () => {
  try {
    const response = await fetch('/api/briefs')
    if (response.ok) {
      const data = await response.json()
      briefs.value = data.data || []
    }
  } catch (error) {
    console.error('Error loading briefs:', error)
  }
}

const loadUserFiles = async () => {
  try {
    const response = await fetch('/api/files', {
      headers: { 'x-user-email': userEmail.value },
    })
    if (response.ok) {
      const data = await response.json()
      userFiles.value = data.data || []
    }
  } catch (error) {
    console.error('Error loading files:', error)
  }
}

const handleLogout = async () => {
  await logout()
  navigateTo('/login')
}

const downloadBrief = (brief: any) => {
  console.log('Downloading brief:', brief.id)
}

const handleAdditionalFiles = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files) return
  
  try {
    isGenerating.value = true
    const formData = new FormData()
    
    Array.from(input.files).forEach(file => {
      formData.append('files', file)
    })
    
    const response = await fetch('/api/brief/upload-files', {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) throw new Error('Failed to upload files')
    
    const data = await response.json()
    if (data.success) {
      brevityData.value.uploadedFileIds.push(...(data.files?.map((f: any) => f.id) || []))
      if (data.folderId) brevityData.value.uploadedFolderIds.push(data.folderId)
      
      briefChatHistory.value.push({
        role: 'assistant',
        content: `✓ Files uploaded! I can now see ${data.files?.length || 0} new file(s). Ask me to incorporate them into the brief.`,
      })
    }
  } catch (error) {
    console.error('Error uploading files:', error)
    briefChatHistory.value.push({
      role: 'assistant',
      content: `Error uploading files: ${error instanceof Error ? error.message : 'Unknown error'}`,
    })
  } finally {
    isGenerating.value = false
    if (input) input.value = ''
  }
}

const exportBrief = (format: 'markdown' | 'pdf') => {
  let content = ''
  
  if (format === 'markdown') {
    content = `# ${briefData.value.projectName}

## Project Overview

**Description:** ${briefData.value.projectDescription}

**Category:** ${briefData.value.projectCategory}

**Industry:** ${briefData.value.industry}

## Goals & Audience

**Primary Goal:** ${briefData.value.primaryGoal}

**Target Audience:** ${briefData.value.targetAudience}

## Pain Points

${briefData.value.painPoints.map(p => `- ${p}`).join('\n')}

## Branding

**Color Palette:** ${briefData.value.colorPalette || 'Not specified'}

## Deliverables

${briefData.value.deliverables.map(d => `- ${d}`).join('\n') || 'None specified'}

## Timeline & Budget

**Timeline:** ${briefData.value.timeline}

**Budget:** ${briefData.value.budget}

## Technical Requirements

${briefData.value.technicalRequirements.map(r => `- ${r}`).join('\n') || 'None specified'}

---

*Generated by SiteSynth Brief Agent*
`
    
    // Download markdown
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${briefName.value || 'brief'}.md`
    a.click()
  } else if (format === 'pdf') {
    // For PDF, we'd need a library like pdfkit
    alert('PDF export coming soon! For now, you can export as Markdown and convert to PDF.')
  }
}

onMounted(async () => {
  const user = getCurrentUser()
  if (!user) {
    navigateTo('/login')
    return
  }

  userEmail.value = user.email
  await loadBriefs()
  await loadUserFiles()
  
  stats.value.totalProjects = 3
  stats.value.activeWebsites = 1
})

useSeoMeta({
  title: 'Cabinet | SiteSynth',
  description: 'Manage your SiteSynth projects and briefs.',
  ogTitle: 'Cabinet | SiteSynth',
  ogDescription: 'Your personal SiteSynth dashboard.',
  ogImage: `${siteUrl}/assets/shareimage.png`,
})
</script>
