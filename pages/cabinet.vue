<template>
  <HeaderSection />

  <section class="relative bg-[#161616] min-h-screen pt-20 md:pt-32 pb-16 md:pb-24 overflow-hidden">
    <!-- Background Effects -->
    <GlowBlue />
    <ParticleEffect />

    <!-- Gradient Background -->
    <div class="absolute inset-0 pointer-events-none opacity-70">
      <div class="absolute top-0 left-1/2 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl transform -translate-x-1/2"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/3 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"></div>
    </div>

    <ClientOnly>
      <div class="relative max-w-6xl w-full mx-auto px-6 md:px-12">
        <!-- Header with Welcome and Logout -->
        <div class="flex items-center justify-between mb-12">
          <div>
            <h1 class="text-5xl font-bold text-white mb-2">Your Cabinet</h1>
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

        <!-- TAB NAVIGATION -->
        <div class="flex items-center gap-2 mb-12 pb-6 border-b border-[#333] overflow-x-auto">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap flex items-center gap-2',
              activeTab === tab.id
                ? 'bg-[#8D35FF] text-white'
                : 'text-[#999999] hover:text-white border border-transparent hover:border-[#333]'
            ]"
          >
            <Icon :name="tab.icon" size="20" />
            {{ tab.label }}
          </button>
        </div>

        <!-- TAB: DASHBOARD -->
        <div v-if="activeTab === 'dashboard'" class="space-y-8">
          <!-- Quick Stats -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-8 hover:border-[#8D35FF] transition">
              <p class="text-[#999999] text-sm mb-2">Total Briefs</p>
              <p class="text-4xl font-bold text-white">{{ totalBriefs }}</p>
              <p class="text-[#999999] text-xs mt-2">{{ activeBriefs }} in progress</p>
            </div>

            <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-8 hover:border-[#8D35FF] transition">
              <p class="text-[#999999] text-sm mb-2">Files Uploaded</p>
              <p class="text-4xl font-bold text-white">{{ userFiles.length }}</p>
              <p class="text-[#999999] text-xs mt-2">{{ totalFileSize }}</p>
            </div>

            <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-8 hover:border-[#8D35FF] transition">
              <p class="text-[#999999] text-sm mb-2">Active Projects</p>
              <p class="text-4xl font-bold text-[#8D35FF]">{{ stats.activeWebsites }}</p>
              <p class="text-[#999999] text-xs mt-2">{{ stats.totalProjects }} total</p>
            </div>
          </div>

          <!-- Primary Action: Create New Brief -->
          <div class="bg-gradient-to-r from-[#8D35FF]/20 to-[#8D35FF]/20 border border-[#333] rounded-lg p-12 text-center">
            <h2 class="text-3xl font-bold text-white mb-4"><Icon name="sparkles" class="mr-2 inline" />Ready to Create a Brief?</h2>
            <p class="text-[#999999] mb-8 max-w-xl mx-auto">
              Start a guided conversation with our AI to generate a professional 8-section project brief
            </p>
            <button
              @click="openBriefWizard"
              class="px-8 py-4 bg-[#8D35FF] text-white rounded-lg font-semibold hover:bg-purple-700 transition transform hover:scale-105 flex items-center justify-center gap-2 mx-auto"
            >
              Create New Brief <Icon name="arrow-right" size="20" />
            </button>
          </div>

          <!-- Recent Briefs -->
          <div v-if="recentBriefs.length > 0">
            <h3 class="text-2xl font-bold text-white mb-6">Recent Briefs</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                v-for="brief in recentBriefs.slice(0, 4)"
                :key="brief.id"
                class="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 hover:border-[#8D35FF] transition cursor-pointer"
                @click="() => { activeTab = 'briefs'; selectedBriefId = brief.id }"
              >
                <div class="flex items-start justify-between mb-3">
                  <h4 class="text-white font-bold flex-1">{{ brief.brief_data?.projectName || 'Untitled' }}</h4>
                  <span :class="[
                    'px-3 py-1 rounded text-xs font-semibold whitespace-nowrap ml-2',
                    brief.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                  ]">
                    {{ brief.status }}
                  </span>
                </div>
                <p class="text-[#999999] text-sm mb-4">{{ formatDate(brief.created_at) }}</p>
                <div class="flex items-center gap-2 text-xs text-[#777]">
                  <span class="px-2 py-1 bg-[#333] rounded">{{ brief.agent_type }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB: BRIEFS -->
        <div v-if="activeTab === 'briefs'" class="space-y-8">
          <!-- Action Bar -->
          <div class="flex items-center gap-4">
            <select
              v-model="filterAgent"
              class="px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white hover:border-[#8D35FF] transition"
            >
              <option value="">All Agent Types</option>
              <option value="briefing">Briefing</option>
              <option value="presale">Presale</option>
            </select>

            <button
              @click="openBriefWizard"
              class="ml-auto px-6 py-2 bg-[#8D35FF] text-white rounded-lg font-semibold hover:bg-purple-700 transition flex items-center gap-2"
            >
              <Icon name="plus" size="20" /> New Brief
            </button>
          </div>

          <!-- Briefs List -->
          <div v-if="filteredBriefs.length === 0" class="bg-[#1a1a1a] border border-[#333] rounded-lg p-12 text-center">
            <p class="text-[#999999] mb-6">No briefs yet</p>
              <Button size="md" variant="secondary" @click="openBriefWizard">
              <template #icon>
                <Icon name="plus" size="20" />
              </template>
              Create Your First Brief
            </Button>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="brief in filteredBriefs"
              :key="brief.id"
              class="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 cursor-pointer hover:border-[#0033ff] transition"
              @click="viewBrief(brief)"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h3 class="text-xl font-bold text-white mb-2">
                    {{ brief.brief_data?.projectName || 'Untitled Brief' }}
                  </h3>
                  <p class="text-[#999999] text-sm mb-4">
                    {{ brief.brief_data?.companyIntroduction?.mission || 'No description' }}
                  </p>
                  <div class="flex items-center gap-4 text-xs text-[#777]">
                    <span class="px-2 py-1 bg-[#333] rounded">{{ brief.agent_type }}</span>
                    <span>{{ formatDate(brief.created_at) }}</span>
                  </div>
                </div>
                <div class="flex items-center gap-3 ml-4">
                  <button
                    @click.stop="downloadBrief(brief)"
                    class="p-2 bg-[#333] hover:bg-[#444] rounded-lg transition"
                    title="Download as PDF"
                  >
                    <Icon name="download" size="20" />
                  </button>
                  <button
                    @click.stop="deleteBrief(brief)"
                    class="p-2 bg-red-900/30 hover:bg-red-900/50 rounded-lg transition"
                    title="Delete"
                  >
                    <Icon name="trash" size="20" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB: CONVERSATIONS -->
        <div v-if="activeTab === 'conversations'" class="space-y-8">
          <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-12 text-center">
            <p class="text-[#999999] mb-4"><Icon name="comments" size="28" class="inline mr-2" />Chat history coming soon</p>
            <p class="text-[#666] text-sm">Review and restart conversations that led to your briefs</p>
          </div>
        </div>

        <!-- TAB: FILES -->
        <div v-if="activeTab === 'files'" class="space-y-8">
          <p class="text-[#999999] text-sm mb-6">
            Upload reference files, brand guidelines, design assets, or documents. These will be analyzed by the AI agent when preparing your project brief.
          </p>

          <!-- Upload Area -->
          <div
            @dragover.prevent="dragActive = true"
            @dragleave="dragActive = false"
            @drop.prevent="handleFileDrop"
            :class="{
              'border-[#8D35FF] bg-[#8D35FF]/5': dragActive,
              'border-[#333]': !dragActive,
            }"
            class="border-2 border-dashed rounded-lg p-8 mb-8 transition cursor-pointer hover:border-[#0033ff]/50"
          >
            <input
              ref="fileInput"
              type="file"
              multiple
              @change="handleFileSelect"
              class="hidden"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.zip"
            />
            <div @click="fileInput?.click()" class="text-center">
              <p class="text-[#999999] mb-2"><Icon name="upload" class="mr-2 inline" />Drop files here or click to browse</p>
              <p class="text-[#666] text-sm">Supported: PDF, DOC, DOCX, TXT, JPG, PNG, ZIP</p>
            </div>
          </div>

          <!-- Upload Progress -->
          <div v-if="uploading" class="mb-8 p-4 bg-[#0f0f0f] border border-[#333] rounded-lg">
            <div class="flex items-center justify-between mb-2">
              <p class="text-white text-sm">Uploading files...</p>
              <p class="text-[#999999] text-sm">{{ uploadProgress }}%</p>
            </div>
            <div class="w-full bg-[#1a1a1a] rounded-full h-2">
                <div class="bg-[#8D35FF] h-2 rounded-full transition-all" :style="{ width: `${uploadProgress}%` }"></div>
            </div>
          </div>

          <!-- Files List -->
          <div v-if="userFiles.length === 0 && !uploading" class="text-center py-12">
            <p class="text-[#999999] mb-4"><Icon name="folder" size="32" class="inline" /></p>
            <p class="text-[#666] text-sm">Start by uploading some reference files</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="file in userFiles"
              :key="file.id"
              class="bg-[#0f0f0f] border border-[#333] rounded-lg p-4 flex items-center justify-between hover:border-[#8D35FF] transition"
            >
              <div class="flex items-center gap-4 flex-1 min-w-0">
                <i :class="getFileIconClass(file.name)" class="text-xl"></i>
                <div class="flex-1 min-w-0">
                  <p class="text-white font-semibold truncate">{{ file.name }}</p>
                  <p class="text-[#999999] text-sm">{{ formatFileSize(file.size) }} • {{ formatDate(file.uploadedAt) }}</p>
                </div>
              </div>
              <button
                @click.stop="deleteFile(file.id)"
                class="p-2 text-[#999999] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition ml-4"
                title="Delete file"
              >
                <Icon name="trash" size="20" />
              </button>
            </div>
          </div>
        </div>

        <!-- TAB: SETTINGS -->
        <div v-if="activeTab === 'settings'" class="space-y-8">
          <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-8">
            <h3 class="text-2xl font-bold text-white mb-8">Account Settings</h3>

            <div class="space-y-6">
              <div class="pb-6 border-b border-[#333]">
                <p class="text-white font-semibold mb-2">Email Address</p>
                <p class="text-[#999999]">{{ userEmail }}</p>
              </div>

              <div class="pb-6 border-b border-[#333]">
                <p class="text-white font-semibold mb-4">Password</p>
                <Button size="md" variant="ghost">
                  <template #icon>
                    <Icon name="key" size="20" />
                  </template>
                  Change Password
                </Button>
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
      </div>
    </ClientOnly>

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

              <!-- Upload Area in Modal -->
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

              <!-- Next Button -->
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
                <h3 class="text-xl font-bold text-white mb-2"><Icon name="wand-magic" class="mr-2 inline" />Generate & Refine Brief</h3>
                <p class="text-[#999999] text-sm mb-6">
                  Gemini is analyzing your information. You can ask questions or request changes to your brief.
                </p>
              </div>

              <div v-if="isGenerating && !generatedBrief" class="space-y-6">
                <!-- Initial Loading -->
                <div class="flex justify-center py-8">
                  <div class="relative w-16 h-16">
                    <div class="absolute inset-0 border-2 border-[#333] rounded-full"></div>
                    <div class="absolute inset-0 border-2 border-transparent border-t-[#8D35FF] rounded-full animate-spin"></div>
                  </div>
                </div>
                <p class="text-center text-[#999999]">Generating your professional brief with Gemini AI...</p>
              </div>

              <div v-else-if="generatedBrief" class="space-y-4">
                <!-- Generated Brief Preview -->
                <div class="bg-[#0f0f0f] border border-[#333] rounded-lg p-6 max-h-96 overflow-y-auto">
                  <div class="prose prose-invert max-w-none text-sm">
                    <div v-html="markdownToHtml(generatedBrief)" class="text-[#999999]"></div>
                  </div>
                </div>

                <!-- Chat with Assistant -->
                <div class="space-y-4">
                  <p class="text-white text-sm font-semibold"><Icon name="comments" class="mr-2 inline" />Refine Brief with AI Assistant</p>
                  
                  <!-- Chat History -->
                  <div class="bg-[#0f0f0f] border border-[#333] rounded-lg p-4 max-h-64 overflow-y-auto space-y-3">
                    <div v-for="(msg, idx) in briefChatHistory" :key="idx" :class="[
                      'p-3 rounded-lg text-sm',
                      msg.role === 'assistant' ? 'bg-[#1a1a1a] border border-[#333]' : 'bg-[#8D35FF]/20 border border-[#8D35FF]/50'
                    ]">
                      <p :class="msg.role === 'assistant' ? 'text-white' : 'text-[#8D35FF]'" class="font-semibold mb-1">
                        {{ msg.role === 'assistant' ? 'Gemini:' : 'You:' }}
                      </p>
                      <p class="text-[#999999]">{{ msg.content }}</p>
                    </div>
                  </div>

                  <!-- Input -->
                  <div class="flex gap-2">
                    <input
                      v-model="briefQuestion"
                      @keyup.enter="askBriefQuestion"
                      type="text"
                      placeholder="Ask to modify, clarify, or expand the brief..."
                      class="flex-1 px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-[#666] focus:border-[#8D35FF] focus:outline-none text-sm"
                    />
                    <button
                      @click="askBriefQuestion"
                      :disabled="isGenerating"
                      class="px-4 py-2 bg-[#8D35FF] text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 transition text-sm"
                    >
                      Send
                    </button>
                  </div>

                  <!-- File Upload for Additional Context -->
                  <div class="text-center">
                    <input
                      ref="additionalFileInput"
                      type="file"
                      multiple
                      @change="handleAdditionalFiles"
                      class="hidden"
                    />
                    <button
                      @click="additionalFileInput?.click()"
                      class="text-[#999999] hover:text-[#8D35FF] text-xs flex items-center justify-center gap-1 mx-auto"
                    >
                      <Icon name="upload" size="14" />Add files for context
                    </button>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-3 pt-4">
                  <button
                    @click="wizardStage = 2"
                    class="flex-1 px-4 py-3 border border-[#333] text-[#999999] rounded-lg font-semibold hover:border-white hover:text-white transition"
                  >
                    Back
                  </button>
                  <button
                    @click="nextWizardStage"
                    class="flex-1 px-4 py-3 bg-[#8D35FF] text-white rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
                  >
                    Review Brief <Icon name="arrow-right" size="20" />
                  </button>
                </div>
              </div>
            </div>

            <!-- STAGE 4: REVIEW & EDIT -->
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

                <!-- Goals & Audience -->
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

                <!-- Pain Points -->
                <div v-if="briefData.painPoints.length > 0" class="border-b border-[#333] pb-4">
                  <h4 class="text-white font-bold mb-3 text-lg">❌ Pain Points</h4>
                  <ul class="space-y-2">
                    <li v-for="(point, idx) in briefData.painPoints" :key="idx" class="text-[#999999] text-sm flex items-start gap-2">
                      <span class="text-[#8D35FF] mt-1">•</span>
                      <span>{{ point }}</span>
                    </li>
                  </ul>
                </div>

                <!-- Branding -->
                <div v-if="briefData.colorPalette" class="border-b border-[#333] pb-4">
                  <h4 class="text-white font-bold mb-3 text-lg">🎨 Branding</h4>
                  <p class="text-[#999999] text-sm">{{ briefData.colorPalette || 'Not specified' }}</p>
                </div>

                <!-- Deliverables -->
                <div v-if="briefData.deliverables.length > 0" class="border-b border-[#333] pb-4">
                  <h4 class="text-white font-bold mb-3 text-lg">📦 Deliverables</h4>
                  <ul class="space-y-2">
                    <li v-for="(item, idx) in briefData.deliverables" :key="idx" class="text-[#999999] text-sm flex items-center gap-2">
                      <Icon name="check" size="16" class="text-green-400" />
                      <span>{{ item }}</span>
                    </li>
                  </ul>
                </div>

                <!-- Timeline & Budget -->
                <div class="pb-4">
                  <h4 class="text-white font-bold mb-3 text-lg">⏱️ Timeline & Budget</h4>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <p class="text-[#666] text-xs uppercase tracking-wider">Timeline</p>
                      <p class="text-white">{{ briefData.timeline || 'N/A' }}</p>
                    </div>
                    <div>
                      <p class="text-[#666] text-xs uppercase tracking-wider">Budget</p>
                      <p class="text-white">{{ briefData.budget || 'N/A' }}</p>
                    </div>
                  </div>
                </div>

                <!-- Technical Requirements -->
                <div v-if="briefData.technicalRequirements.length > 0">
                  <h4 class="text-white font-bold mb-3 text-lg">⚙️ Technical Requirements</h4>
                  <ul class="space-y-2">
                    <li v-for="(req, idx) in briefData.technicalRequirements" :key="idx" class="text-[#999999] text-sm flex items-start gap-2">
                      <span class="text-[#8D35FF] mt-1">▸</span>
                      <span>{{ req }}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="flex gap-3">
                <button
                  @click="wizardStage = 3"
                  class="flex-1 px-4 py-3 border border-[#333] text-[#999999] rounded-lg font-semibold hover:border-white hover:text-white transition flex items-center justify-center gap-2"
                >
                  <Icon name="arrow-left" size="20" />Edit Answers
                </button>
                <button
                  @click="nextWizardStage"
                  class="flex-1 px-4 py-3 bg-[#8D35FF] text-white rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
                >
                  Save Brief <Icon name="arrow-right" size="20" />
                </button>
              </div>
            </div>

            <!-- STAGE 5: SAVE & EXPORT -->
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

                <div class="bg-[#0f0f0f] border border-[#333] rounded-lg p-6">
                  <p class="text-[#999999] text-sm mb-4">Export Format:</p>
                  <div class="grid grid-cols-2 gap-3">
                    <button
                      @click="exportBrief('markdown')"
                      class="px-4 py-3 border border-[#333] text-[#999999] rounded-lg font-semibold hover:border-[#8D35FF] hover:text-[#8D35FF] transition flex items-center justify-center gap-2"
                    >
                      <Icon name="file-markdown" size="20" />Markdown
                    </button>
                    <button
                      @click="exportBrief('pdf')"
                      class="px-4 py-3 border border-[#333] text-[#999999] rounded-lg font-semibold hover:border-[#8D35FF] hover:text-[#8D35FF] transition flex items-center justify-center gap-2"
                    >
                      <Icon name="file-pdf" size="20" />PDF
                    </button>
                  </div>
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

          <!-- Modal Footer: Navigation Buttons -->
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
  </section>

  <FooterSection />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import ParticleEffect from '@/components/effects/ParticleEffect.vue'
import GlowBlue from '@/components/effects/GlowBlue.vue'
import FormDataDisplay from '@/components/FormDataDisplay.vue'
import Icon from '@/components/ui/Icon.vue'
import { useGoogleAuth } from '@/composables/useGoogleAuth'

const { logout, getCurrentUser, getToken } = useGoogleAuth()

const userEmail = ref('')
const activeTab = ref('dashboard')
const filterAgent = ref('')
const selectedBriefId = ref<string | null>(null)

// Brief Wizard State
const showBriefWizard = ref(false)
const wizardStage = ref(1)
const wizardFiles = ref<File[]>([])
const wizardFileInput = ref<HTMLInputElement | null>(null)
const chatHistory = ref<Array<{ role: string; content: string }>>([])
const userMessage = ref('')
const briefName = ref('')
const isGenerating = ref(false)

// Stage 3: Generate & Refine
const generatedBrief = ref('')
const briefChatHistory = ref<Array<{ role: string; content: string }>>([])
const briefQuestion = ref('')
const additionalFileInput = ref<HTMLInputElement | null>(null)

const brevityData = ref({
  uploadedFileIds: [] as string[],
  uploadedFolderIds: [] as string[],
})

// Brief Data Structure (Stage 2: Questions)
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

// Question Tree & Navigation
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

// Data
const stats = ref({ totalProjects: 0, totalSpent: 0, activeWebsites: 0 })
const briefs = ref<any[]>([])
const projects = ref<any[]>([])
const userFiles = ref<any[]>([])

// File Upload
const fileInput = ref<HTMLInputElement | null>(null)
const dragActive = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'briefs', label: 'Briefs', icon: 'briefcase' },
  { id: 'conversations', label: 'Conversations', icon: 'comments' },
  { id: 'files', label: 'Files', icon: 'folder' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
]

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

const formatDate = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
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

const openBriefWizard = () => {
  showBriefWizard.value = true
  wizardStage.value = 1
  wizardFiles.value = []
  chatHistory.value = []
  userMessage.value = ''
  briefName.value = ''
  isGenerating.value = false
  currentQuestionIndex.value = 0
  
  // Reset brief data
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
  
  // Add user message to chat
  chatHistory.value.push({ role: 'user', content: userMessage.value })
  
  // Save answer to briefData
  const saveKey = currentQuestion.saveKey
  if (currentQuestion.type === 'textarea' && saveKey === 'painPoints') {
    // Split by newlines or commas
    briefData.value[saveKey] = userMessage.value.split('\n').filter(s => s.trim())
  } else {
    briefData.value[saveKey] = userMessage.value
  }
  
  userMessage.value = ''
  
  // Show agent confirmation
  setTimeout(() => {
    const agentResponses = {
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
    
    // Move to next question or finish
    currentQuestionIndex.value++
    if (currentQuestionIndex.value >= questionTree.length) {
      // All questions answered - move to Stage 3
      setTimeout(async () => {
        wizardStage.value = 3
        isGenerating.value = true
        // Call Gemini to generate brief
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
        userMessage: null, // First call generates the brief
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
    // Add user message to history
    briefChatHistory.value.push({
      role: 'user',
      content: briefQuestion.value,
    })
    
    const userMsg = briefQuestion.value
    briefQuestion.value = ''
    isGenerating.value = true
    
    // Ask Gemini to modify/answer about brief
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
      
      // If user asked to update brief, update it
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

const markdownToHtml = (markdown: string): string => {
  // Simple markdown to HTML converter
  let html = markdown
    .replace(/^### (.*?)$/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    .replace(/^- (.*?)$/gm, '<li class="ml-4">$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<)/gm, '<p>')
    .replace(/$/gm, '</p>')
  
  return html
}

const nextWizardStage = async () => {
  if (wizardStage.value === 1) {
    // Upload files first, then move to Stage 2
    if (wizardFiles.value.length > 0) {
      await uploadWizardFiles()
    }
    wizardStage.value = 2
    currentQuestionIndex.value = 0
    // Don't clear chat history - it has the file upload confirmation
  }
  } else if (wizardStage.value === 2) {
    // This is handled in sendMessage when all questions are answered
  }
  else if (wizardStage.value === 3) {
    // Move to Stage 4 - review
    wizardStage.value = 4
  } else if (wizardStage.value === 4) {
    // Move to Stage 5 - save
    wizardStage.value = 5
  }
}

const getNextQuestion = () => {
  return questionTree[currentQuestionIndex.value]
}

const handleWizardFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    wizardFiles.value.push(...Array.from(input.files))
    input.value = ''
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
      
      // Show success message in chat
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

const viewBrief = (brief: any) => {
  selectedBriefId.value = brief.id
  // Would navigate to brief detail view
}

const downloadBrief = (brief: any) => {
  console.log('Downloading brief:', brief.id)
}

const deleteBrief = async (brief: any) => {
  if (confirm('Delete this brief?')) {
    console.log('Deleting brief:', brief.id)
    await loadBriefs()
  }
}

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
      const file = files[i]
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

onMounted(async () => {
  const user = getCurrentUser()
  if (!user) {
    navigateTo('/login')
    return
  }

  userEmail.value = user.email

  await loadBriefs()
  await loadUserFiles()
})

const saveBrief = () => {
  if (!briefName.value.trim()) {
    alert('Please enter a brief name')
    return
  }
  
  const newBrief = {
    id: Date.now(),
    name: briefName.value,
    data: briefData.value,
    createdAt: new Date().toISOString(),
  }
  
  briefs.value.push(newBrief)
  console.log('Brief saved:', newBrief)
  
  // Close wizard
  closeBriefWizard()
  
  // Show success message
  alert(`✓ Brief "${briefName.value}" saved successfully!`)
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

const siteUrl = useRuntimeConfig().public?.siteUrl

useSeoMeta({
  title: 'Cabinet | SiteSynth',
  description: 'Manage your SiteSynth projects and briefs.',
  ogTitle: 'Cabinet | SiteSynth',
  ogDescription: 'Your personal SiteSynth dashboard.',
  ogImage: `${siteUrl}/assets/shareimage.png`,
})
</script>
