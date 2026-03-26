<template>
  <HeaderSection />

  <!-- CABINET SHOWCASE SECTION -->
  <section id="cabinet" class="relative bg-[#161616] text-white overflow-hidden pt-32 md:pt-40 pb-20 md:pb-28 border-b border-[#333] scroll-mt-24">
    <ParticleEffect />
    <div class="relative max-w-[1248px] mx-auto px-6 md:px-12">

      <!-- Heading -->
      <div class="text-center mb-14">
        <h2 class="text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight tracking-tight">
          Everything in <span class="glow-text">Your Cabinet</span>
        </h2>
        <p class="text-[#888] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          AI builds your site. You stay in control — brief, design spec, and delivery all in one place.
        </p>
      </div>

      <!-- Interactive Tab Buttons -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">

        <!-- Tab: Brief Wizard -->
        <button @click="activeCabinetTab = 'brief'" class="relative rounded-none text-left cursor-pointer border border-[#2a2a2a] transition-colors"
          :class="activeCabinetTab !== 'brief' && 'hover:border-[#444]'">
          <div v-if="activeCabinetTab === 'brief'" class="cabinet-tab-border absolute rounded-none pointer-events-none" style="inset:-1px;z-index:0;"></div>
          <div v-if="activeCabinetTab === 'brief'" class="absolute rounded-none bg-[#161616]" style="inset:1px;z-index:1;"></div>
          <div class="relative flex items-center gap-3 px-5 py-4" style="z-index:2;">
            <div class="w-8 h-8 rounded-none bg-[#8D35FF]/10 border border-[#8D35FF]/20 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 text-[#8D35FF]"><path d="M4 1h8a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V2a1 1 0 011-1zm1 3v1h6V4H5zm0 3v1h6V7H5zm0 3v1h4v-1H5z"/></svg>
            </div>
            <span class="text-white font-medium text-sm">AI Brief Wizard</span>
          </div>
        </button>

        <!-- Tab: Design Spec -->
        <button @click="activeCabinetTab = 'spec'" class="relative rounded-none text-left cursor-pointer border border-[#2a2a2a] transition-colors"
          :class="activeCabinetTab !== 'spec' && 'hover:border-[#444]'">
          <div v-if="activeCabinetTab === 'spec'" class="cabinet-tab-border absolute rounded-none pointer-events-none" style="inset:-1px;z-index:0;"></div>
          <div v-if="activeCabinetTab === 'spec'" class="absolute rounded-none bg-[#161616]" style="inset:1px;z-index:1;"></div>
          <div class="relative flex items-center gap-3 px-5 py-4" style="z-index:2;">
            <div class="w-8 h-8 rounded-none bg-[#8D35FF]/10 border border-[#8D35FF]/20 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 text-[#8D35FF]"><path d="M1 3a1 1 0 011-1h12a1 1 0 011 1v2H1V3zm0 4h5v6H2a1 1 0 01-1-1V7zm7 0h7v5a1 1 0 01-1 1H8V7z"/></svg>
            </div>
            <span class="text-white font-medium text-sm">Auto Design Spec</span>
          </div>
        </button>

        <!-- Tab: Live in Days -->
        <button @click="activeCabinetTab = 'delivery'" class="relative rounded-none text-left cursor-pointer border border-[#2a2a2a] transition-colors"
          :class="activeCabinetTab !== 'delivery' && 'hover:border-[#444]'">
          <div v-if="activeCabinetTab === 'delivery'" class="cabinet-tab-border absolute rounded-none pointer-events-none" style="inset:-1px;z-index:0;"></div>
          <div v-if="activeCabinetTab === 'delivery'" class="absolute rounded-none bg-[#161616]" style="inset:1px;z-index:1;"></div>
          <div class="relative flex items-center gap-3 px-5 py-4" style="z-index:2;">
            <div class="w-8 h-8 rounded-none bg-[#8D35FF]/10 border border-[#8D35FF]/20 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 text-[#8D35FF]"><path d="M5.52.359A.5.5 0 016 0h4a.5.5 0 01.474.658L8.694 6H12.5a.5.5 0 01.395.807l-7 9a.5.5 0 01-.873-.454L6.823 10H3.5a.5.5 0 01-.48-.641l2.5-9z"/></svg>
            </div>
            <span class="text-white font-medium text-sm">Live in Days</span>
          </div>
        </button>

      </div>

      <!-- Cabinet Mockup with hover glow -->
      <div class="rounded-none border overflow-hidden shadow-2xl shadow-black/60 transition-all duration-300"
           :class="activeCabinetTab === 'delivery' ? 'border-[#28c840]/20 hover:border-[#28c840]/35' : 'border-[#2a2a2a] hover:border-[#8D35FF]/25'">

        <!-- Window Chrome -->
        <div class="bg-[#1a1a1a] border-b border-[#2a2a2a] px-4 py-3 flex items-center gap-3">
          <div class="flex gap-1.5">
            <div class="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
            <div class="w-3 h-3 rounded-full bg-[#febc2e]"></div>
            <div class="w-3 h-3 rounded-full bg-[#28c840]"></div>
          </div>
          <div class="flex-1 bg-[#111] rounded-none px-3 py-1.5 text-[#444] text-xs text-center font-mono">
            sitesynth.com/cabinet
          </div>
        </div>

        <!-- App Layout -->
        <div class="flex h-[360px] md:h-[420px]">

          <!-- Sidebar -->
          <aside class="w-44 md:w-48 shrink-0 border-r border-[#333] flex flex-col" style="background: linear-gradient(180deg, #1a1a1a 0%, #161616 100%);">
            <div class="px-4 h-12 flex items-center border-b border-[#333] relative">
              <div class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#8D35FF] via-[#8D35FF]/40 to-transparent"></div>
              <span class="text-white text-sm font-bold tracking-wide">SiteSynth</span>
            </div>
            <nav class="flex-1 px-2 py-3 space-y-0.5">
              <div class="px-3 py-2 text-[#555] text-xs">Overview</div>
              <div class="relative px-3 py-2 text-xs transition-colors duration-200"
                   :class="activeCabinetTab === 'delivery' ? 'pl-3.5 text-[#8D35FF] bg-[#8D35FF]/10' : 'text-[#555]'">
                <span v-if="activeCabinetTab === 'delivery'" class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-[#8D35FF] rounded-r-full"></span>
                Projects
              </div>
              <div class="relative px-3 py-2 text-xs transition-colors duration-200"
                   :class="activeCabinetTab !== 'delivery' ? 'pl-3.5 text-[#8D35FF] bg-[#8D35FF]/10' : 'text-[#555]'">
                <span v-if="activeCabinetTab !== 'delivery'" class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-[#8D35FF] rounded-r-full"></span>
                Briefs
              </div>
              <div class="px-3 py-2 text-[#555] text-xs">Settings</div>
            </nav>
            <div class="px-3 pb-3 border-t border-[#333] pt-3">
              <div class="flex items-center gap-2 px-2 py-1.5">
                <div class="w-6 h-6 rounded-full bg-[#8D35FF]/20 flex items-center justify-center text-[10px] font-medium text-[#8D35FF] shrink-0">A</div>
                <span class="text-[#555] text-xs truncate">alex@studio.com</span>
              </div>
            </div>
          </aside>

          <!-- Main -->
          <div class="flex-1 bg-[#121212] flex flex-col overflow-hidden">
            <div class="h-12 border-b border-[#333] flex items-center justify-between px-5 shrink-0">
              <div class="flex items-center gap-2 text-xs text-[#555]">
                <span>Dashboard</span>
                <span class="text-[#333]">/</span>
                <span class="text-white font-medium">{{ activeCabinetTab === 'delivery' ? 'Projects' : 'Briefs' }}</span>
              </div>
              <div class="w-6 h-6 rounded-full bg-[#8D35FF]/20 flex items-center justify-center text-[10px] text-[#8D35FF] font-medium">A</div>
            </div>

            <Transition name="cabinet-fade" mode="out-in">
              <div v-if="activeCabinetTab === 'brief'" key="brief" class="flex-1 px-5 py-5 overflow-hidden">
                <p class="text-xs text-[#555] mb-4">Good morning, <span class="text-[#8D35FF]">Alex</span></p>
                <div class="flex items-center gap-1 mb-5 overflow-x-auto pb-1">
                  <template v-for="(step, i) in ['Upload', 'Describe', 'Questions', 'Generate', 'Review', 'Done']" :key="i">
                    <div class="flex items-center gap-1 shrink-0">
                      <div class="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold"
                           :class="i < 2 ? 'bg-[#8D35FF] text-white' : i === 2 ? 'border-2 border-[#8D35FF] text-[#8D35FF] bg-transparent' : 'bg-[#222] text-[#444]'">
                        <template v-if="i < 2">✓</template>
                        <template v-else>{{ i + 1 }}</template>
                      </div>
                      <span class="text-[9px] hidden sm:inline"
                            :class="i < 2 ? 'text-[#666]' : i === 2 ? 'text-white' : 'text-[#333]'">{{ step }}</span>
                    </div>
                    <div v-if="i < 5" class="w-4 h-px bg-[#333] shrink-0"></div>
                  </template>
                </div>
                <div class="border border-[#333] bg-[#1a1a1a] p-4 space-y-3">
                  <div class="flex gap-2">
                    <div class="w-5 h-5 rounded-full bg-[#8D35FF]/20 flex items-center justify-center text-[8px] text-[#8D35FF] shrink-0 mt-0.5 font-bold">AI</div>
                    <div class="bg-[#222] rounded-none px-3 py-2 text-[10px] text-[#ccc] max-w-xs">What type of website are you building?</div>
                  </div>
                  <div class="flex gap-2 justify-end">
                    <div class="bg-[#8D35FF]/15 border border-[#8D35FF]/20 rounded-none px-3 py-2 text-[10px] text-white max-w-xs">E-commerce, focused on fashion accessories</div>
                  </div>
                  <div class="flex gap-2">
                    <div class="w-5 h-5 rounded-full bg-[#8D35FF]/20 flex items-center justify-center text-[8px] text-[#8D35FF] shrink-0 mt-1 font-bold">AI</div>
                    <div class="bg-[#222] rounded-none px-3 py-2 flex items-center gap-1.5">
                      <div class="w-1.5 h-1.5 rounded-full bg-[#8D35FF] animate-bounce" style="animation-delay:0ms"></div>
                      <div class="w-1.5 h-1.5 rounded-full bg-[#8D35FF] animate-bounce" style="animation-delay:150ms"></div>
                      <div class="w-1.5 h-1.5 rounded-full bg-[#8D35FF] animate-bounce" style="animation-delay:300ms"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else-if="activeCabinetTab === 'spec'" key="spec" class="flex-1 px-5 py-5 overflow-hidden">
                <div class="flex items-center justify-between mb-4">
                  <p class="text-xs text-white font-medium">Design Specification</p>
                  <div class="flex items-center gap-1.5">
                    <div class="w-1.5 h-1.5 rounded-full bg-[#8D35FF] animate-bounce" style="animation-delay:0ms"></div>
                    <div class="w-1.5 h-1.5 rounded-full bg-[#8D35FF] animate-bounce" style="animation-delay:150ms"></div>
                    <div class="w-1.5 h-1.5 rounded-full bg-[#8D35FF] animate-bounce" style="animation-delay:300ms"></div>
                    <span class="text-[10px] text-[#555] ml-1">AI generating...</span>
                  </div>
                </div>
                <div class="space-y-2">
                  <div v-for="(page, i) in [{name:'Home',sections:['Hero','Features','Pricing CTA']},{name:'Products',sections:['Grid','Filters','Search']},{name:'Cart',sections:['Items','Summary','Checkout']},{name:'About',sections:['Story','Team']}]"
                       :key="i"
                       class="border px-4 py-2.5 flex items-center justify-between transition-colors"
                       :class="i === 0 ? 'border-[#8D35FF]/30 bg-[#8D35FF]/5' : i < 3 ? 'border-[#333] bg-[#1a1a1a]' : 'border-[#222] bg-[#161616]'">
                    <div class="flex items-center gap-2">
                      <div class="w-1.5 h-1.5 rounded-full" :class="i === 0 ? 'bg-[#8D35FF]' : i < 3 ? 'bg-[#444]' : 'bg-[#333]'"></div>
                      <span class="text-xs font-medium" :class="i === 0 ? 'text-[#8D35FF]' : i < 3 ? 'text-[#888]' : 'text-[#444]'">{{ page.name }}</span>
                    </div>
                    <div class="flex gap-1">
                      <span v-for="s in page.sections" :key="s" class="text-[9px] px-1.5 py-0.5 bg-[#222] text-[#555]">{{ s }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else key="delivery" class="flex-1 px-5 py-5 overflow-hidden">
                <p class="text-xs text-[#555] mb-4">Good morning, <span class="text-[#8D35FF]">Alex</span></p>
                <div class="border border-[#28c840]/20 bg-[#28c840]/5 p-4">
                  <div class="flex items-center justify-between mb-4">
                    <span class="text-white text-xs font-medium">E-commerce Website</span>
                    <span class="text-[10px] px-2 py-0.5 bg-[#28c840]/10 text-[#28c840] border border-[#28c840]/30">● Live</span>
                  </div>
                  <div class="space-y-2 mb-4">
                    <div v-for="item in ['Figma file delivered','Demo site published','Deployed to Vercel']" :key="item" class="flex items-center gap-2">
                      <svg viewBox="0 0 16 16" fill="currentColor" class="w-3 h-3 text-[#28c840] shrink-0">
                        <path d="M13.485 1.431a1.473 1.473 0 00-2.081 0l-5.903 5.903-2.071-2.071a1.473 1.473 0 00-2.083 2.083l3.112 3.112a1.473 1.473 0 002.083 0l6.943-6.943a1.473 1.473 0 000-2.084z"/>
                      </svg>
                      <span class="text-[10px] text-[#888]">{{ item }}</span>
                    </div>
                  </div>
                  <div class="pt-3 border-t border-[#28c840]/10 flex items-center gap-2">
                    <div class="bg-[#111] border border-[#333] px-2 py-1 text-[9px] text-[#555] font-mono truncate flex-1">demo.sitesynth.com/alex-store</div>
                    <div class="w-6 h-6 bg-[#28c840]/10 border border-[#28c840]/20 flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 16 16" fill="currentColor" class="w-3 h-3 text-[#28c840]">
                        <path d="M8.636 3.5a.5.5 0 00-.5-.5H1.5A1.5 1.5 0 000 4.5v10A1.5 1.5 0 001.5 16h10a1.5 1.5 0 001.5-1.5V7.864a.5.5 0 00-1 0V14.5a.5.5 0 01-.5.5h-10a.5.5 0 01-.5-.5v-10a.5.5 0 01.5-.5h6.636a.5.5 0 00.5-.5z"/><path d="M16 .5a.5.5 0 00-.5-.5h-5a.5.5 0 000 1h3.793L6.146 9.146a.5.5 0 10.708.708L15 1.707V5.5a.5.5 0 001 0v-5z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>

        </div>
      </div>

    </div>
  </section>

  <!-- HERO SECTION WITH EFFECTS -->
  <section id="pay-once-forever" class="relative bg-[#161616] text-white overflow-hidden py-12 sm:py-16 md:py-24 border-b border-[#333] scroll-mt-24">
    <!-- Glow Effects -->
    <GlowBlue />

    <div class="relative max-w-7xl mx-auto px-6 md:px-12">
      <div class="text-center mb-10 sm:mb-12">
        <h1 class="font-heading text-3xl sm:text-5xl font-extrabold leading-tight mb-6 sm:mb-8">
          Pay once.<br />
          Own it <span class="glow-text">forever.</span>
        </h1>
        <p class="font-body text-sm sm:text-lg text-[#d4d4d4] max-w-2xl mx-auto leading-relaxed">
          Choose the plan that fits your project. Scale up anytime as your
          needs grow.
        </p>
        <a
          href="#cabinet"
          class="text-[#8CB0FF] font-semibold text-[14px] mt-4 inline-flex items-center gap-2 relative group/link py-2 transition-colors duration-300"
        >
          <span>How it works?</span>
          <font-awesome
            :icon="['fas', 'chevron-up']"
            class="text-sm relative top-[1px] transition-transform duration-300 group-hover/link:-translate-y-0.5"
            aria-hidden="true"
          />
          <div class="absolute bottom-0 left-0 h-[2px] bg-[#8CB0FF] w-0 group-hover/link:w-full transition-all duration-300"></div>
        </a>
      </div>

      <!-- Trust Icons (replacing pills) -->
      <div
        class="mt-8 sm:mt-10 grid grid-cols-2 gap-x-6 gap-y-6 justify-items-center max-w-3xl mx-auto sm:max-w-[1200px] sm:flex sm:flex-nowrap sm:justify-center sm:gap-8 md:gap-12 lg:gap-16"
        style="font-family: 'Inter', sans-serif;"
      >
        <div class="flex items-center gap-3 w-full max-w-[220px] sm:max-w-[250px] md:max-w-[270px]">
          <div class="w-8 h-8 rounded-none bg-[#8D35FF]/10 border border-[#8D35FF]/20 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 text-[#8D35FF]"><path d="M8 1a2 2 0 012 2v4H6V3a2 2 0 012-2zm3 6V3a3 3 0 00-6 0v4a2 2 0 00-2 2v5a2 2 0 002 2h6a2 2 0 002-2V9a2 2 0 00-2-2z"/></svg>
          </div>
          <div class="text-left">
            <p class="text-white text-sm font-semibold leading-tight" style="font-family: 'Inter', sans-serif;">14-Day Guarantee</p>
            <p class="text-[#555] text-xs mt-1 leading-relaxed" style="font-family: 'Inter', sans-serif;">Full refund, no questions</p>
          </div>
        </div>
        <div class="flex items-center gap-3 w-full max-w-[220px] sm:max-w-[250px] md:max-w-[270px]">
          <div class="w-8 h-8 rounded-none bg-[#8D35FF]/10 border border-[#8D35FF]/20 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 text-[#8D35FF]"><path d="M1 3a1 1 0 011-1h12a1 1 0 011 1v2H1V3zm0 4h14v5a1 1 0 01-1 1H2a1 1 0 01-1-1V7zm5 3a1 1 0 100 2h4a1 1 0 100-2H6z"/></svg>
          </div>
          <div class="text-left">
            <p class="text-white text-sm font-semibold leading-tight" style="font-family: 'Inter', sans-serif;">No Hidden Fees</p>
            <p class="text-[#555] text-xs mt-1 leading-relaxed" style="font-family: 'Inter', sans-serif;">Price you see is final</p>
          </div>
        </div>
        <div class="flex items-center gap-3 w-full max-w-[220px] sm:max-w-[250px] md:max-w-[270px]">
          <div class="w-8 h-8 rounded-none bg-[#8D35FF]/10 border border-[#8D35FF]/20 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 text-[#8D35FF]"><path d="M5.52.359A.5.5 0 016 0h4a.5.5 0 01.474.658L8.694 6H12.5a.5.5 0 01.395.807l-7 9a.5.5 0 01-.873-.454L6.823 10H3.5a.5.5 0 01-.48-.641l2.5-9z"/></svg>
          </div>
          <div class="text-left">
            <p class="text-white text-sm font-semibold leading-tight" style="font-family: 'Inter', sans-serif;">Pay Once, Own It</p>
            <p class="text-[#555] text-xs mt-1 leading-relaxed" style="font-family: 'Inter', sans-serif;">No subscriptions required</p>
          </div>
        </div>
        <div class="flex items-center gap-3 w-full max-w-[220px] sm:max-w-[250px] md:max-w-[270px]">
          <div class="w-8 h-8 rounded-none bg-[#8D35FF]/10 border border-[#8D35FF]/20 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 text-[#8D35FF]"><path d="M8 3.5a.5.5 0 00-1 0V9a.5.5 0 00.252.434l3.5 2a.5.5 0 00.496-.868L8 8.71V3.5z"/><path d="M8 16A8 8 0 108 0a8 8 0 000 16zm7-8A7 7 0 111 8a7 7 0 0114 0z"/></svg>
          </div>
          <div class="text-left">
            <p class="text-white text-sm font-semibold leading-tight" style="font-family: 'Inter', sans-serif;">Quick Turnaround</p>
            <p class="text-[#555] text-xs mt-1 leading-relaxed" style="font-family: 'Inter', sans-serif;">Live in as few as 5 days</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- PRICING CARDS SECTION -->
  <section class="relative bg-[#161616] border-b border-[#333]">
    <div class="relative max-w-[1248px] mx-auto px-6">
      <div class="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <!-- Card Wrapper -->
        <div
          v-for="(card, index) in pricingCards"
          :key="card.id"
          :id="card.id"
          class="relative"
          :class="card.highlighted ? 'z-10' : 'z-0'"
        >
          <!-- Card -->
          <div
            class="group relative overflow-hidden bg-[#161616] hover:bg-white/5 transition-colors duration-300
                   px-8 py-8 md:px-6 md:py-9 h-full"
            :class="card.highlighted
              ? 'border border-[#8D35FF] shadow-[0_0_30px_rgba(141,53,255,0.25)]'
              : 'border-l border-r border-[#333] border-b border-[#333] first:border-t md:border-b-0 md:first:border-t-0'"
            style="z-index:2;"
          >
          <GlowBlue />

          <!-- Gradient Background -->
          <div
            class="absolute inset-0 opacity-100 transition-opacity duration-300 pointer-events-none"
            :style="getPricingGradientStyle(index)"
          ></div>

          <!-- Content -->
          <div class="relative z-10 flex flex-col h-full">
            <!-- Title & Price -->
            <div class="mb-6">
              <div class="mb-3 h-7 flex items-start">
                <span
                  v-if="card.badge"
                  :class="[
                    'inline-flex items-center rounded-full px-2.5 py-1 text-white text-xs leading-none font-semibold whitespace-nowrap',
                    card.badgeClass || 'bg-[#AA3733]',
                  ]"
                >
                  {{ card.badge }}
                </span>
                <span
                  v-else
                  class="inline-flex items-center rounded-full px-2.5 py-1 text-xs leading-none font-semibold whitespace-nowrap opacity-0 select-none"
                >
                  Badge
                </span>
              </div>
              <h3 class="text-2xl font-bold text-white mb-3">{{ card.title }}</h3>
              <div class="flex items-baseline gap-2">
                <span class="text-4xl font-extrabold text-white">{{
                  card.price
                }}</span>
                <span v-if="card.period" class="text-[#999999]">{{
                  card.period
                }}</span>
              </div>
            </div>

            <!-- Features -->
            <div class="space-y-3 mb-7 flex-grow">
              <div v-for="feature in card.features" :key="feature" class="flex items-start gap-3">
                <svg
                  class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="text-white text-sm">{{ feature }}</span>
              </div>
            </div>

            <!-- Divider & Delivery Time -->
            <div class="border-t border-[#333] py-3 mb-5">
              <p class="text-[#999999] text-sm">
                <span class="font-semibold text-white">{{ card.deliveryLabel }}:</span>
                {{ card.delivery }}
              </p>
            </div>

            <!-- CTA Button -->
            <NuxtLink
              :to="card.cta.href"
              :class="[
                'w-full px-6 py-3 text-center rounded-none font-semibold transition-all duration-300 transform group-hover:scale-105 cta-hover',
                card.cta.className,
              ]"
            >
              {{ card.cta.text }}
            </NuxtLink>
          </div>
          </div><!-- end card -->
        </div><!-- end card wrapper -->
      </div>
    </div>
  </section>


  <!-- FAQ SECTION -->
  <section class="relative bg-[#161616] py-16 md:py-24 border-b border-[#333]">
    <!-- Glow Effect -->
    <GlowRed />

    <div class="relative max-w-4xl mx-auto px-6 md:px-12">
      <h2 class="text-3xl sm:text-4xl font-bold text-white mb-10 text-center">
        Frequently Asked Questions
      </h2>

      <div class="space-y-4">
        <div
          v-for="(item, idx) in faqItems"
          :key="idx"
          class="group border border-[#333] overflow-hidden hover:border-[#8D35FF] transition-colors duration-300"
        >
          <button
            @click="toggleFAQ(idx)"
            class="w-full px-6 py-4 flex items-center justify-between bg-[#1a1a1a] hover:bg-[#202020] transition-colors text-left"
          >
            <span class="text-lg font-semibold text-white">{{ item.question }}</span>
            <svg
              :class="{
                'rotate-180': expandedFAQ === idx,
              }"
              class="w-5 h-5 text-[#8D35FF] transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <div
            :class="[
              'grid transition-all duration-300 ease-out',
              expandedFAQ === idx ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
            ]"
          >
            <div class="overflow-hidden">
              <div class="px-6 py-4 bg-[#161616] border-t border-[#333]">
                <p class="text-[#999999] text-base leading-relaxed">
                  {{ item.answer }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <FooterSection />
</template>

<script setup>
import { ref } from "vue";
import GlowBlue from "@/components/effects/GlowBlue.vue";
import GlowRed from "@/components/effects/GlowRed.vue";
import ParticleEffect from "@/components/effects/ParticleEffect.vue";

const expandedFAQ = ref(null);
const activeCabinetTab = ref('brief');

const pricingTags = [
  { label: "No Setup Fees" },
  { label: "Flexible Scope" },
  { label: "Pay Once" },
  { label: "Quick Turnaround" },
];

const pricingCards = [
  {
    id: "starter",
    title: "Starter",
    badge: "Best for your first launch",
    badgeClass: "bg-[#8D35FF]",
    price: "€500",
    period: null,
    deliveryLabel: "Delivery",
    delivery: "5 days",
    features: [
      "1 Page",
      "Mobile Adaptation",
      "SSL Certificate",
      "Vercel Deploy",
      "Contact Form",
      "Plausible Analytics",
      "Performance Optimized",
    ],
    cta: {
      text: "Get Started",
      href: "/intake/starter",
      className:
        "bg-[#8D35FF] text-white hover:bg-[#7B2EF0] group-hover:shadow-lg group-hover:shadow-[#8D35FF]/50",
    },
  },
  {
    id: "growth",
    title: "Growth",
    badge: "Most Popular",
    badgeClass: "bg-[#8D35FF]",
    highlighted: true,
    price: "€900",
    period: null,
    deliveryLabel: "Delivery",
    delivery: "7 days",
    features: [
      "Everything from Starter",
      "Up to 5 Pages",
      "Decap CMS Integration",
      "Blog-ready Structure",
      "Custom Domain Setup",
      "Priority Support",
      "+€85 per extra page",
    ],
    cta: {
      text: "Get Started",
      href: "/intake/growth",
      className:
        "bg-[#8D35FF] text-white hover:bg-[#7B2EF0] group-hover:shadow-lg group-hover:shadow-[#8D35FF]/50",
    },
  },
  {
    id: "enterprise",
    title: "Enterprise",
    price: "Custom",
    period: "Pricing",
    badge: "For large teams",
    badgeClass: "bg-[#AA3733]",
    deliveryLabel: "Timeline",
    delivery: "Custom",
    features: [
      "Custom Portal",
      "Webshop Integration",
      "Custom Plugins",
      "Dedicated Support",
      "SLA Agreement",
      "Ongoing Retainer Available",
    ],
    cta: {
      text: "Schedule a Call",
      href: "/intake/enterprise",
      className:
        "bg-[#AA3733] text-white hover:bg-red-700 group-hover:shadow-lg group-hover:shadow-red-500/50",
    },
  },
  {
    id: "addons",
    title: "Add-ons",
    price: "From",
    period: "€12/mo",
    deliveryLabel: "Type",
    delivery: "Optional",
    features: [
      "Maintenance & Support €99/mo",
      "Plausible Analytics €12/mo",
      "SEO Optimization from €49/mo",
      "Email Setup from €15/mo",
    ],
    cta: {
      text: "Add to Plan",
      href: "/addons",
      className:
        "border border-[#8D35FF] text-[#8D35FF] hover:bg-[#8D35FF] hover:text-white group-hover:shadow-lg group-hover:shadow-[#8D35FF]/50",
    },
  },
];

const getPricingGradientStyle = (index) => {
  const gradients = [
    "url(/assets/gradients/gradient-bottom-left.svg)",
    "url(/assets/gradients/gradient-top-left.svg)",
    "url(/assets/gradients/gradient-bottom-right.svg)",
    "url(/assets/gradients/gradient-top-right.svg)",
  ];

  return {
    backgroundImage: gradients[index % 4],
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  };
};

const toggleFAQ = (idx) => {
  expandedFAQ.value = expandedFAQ.value === idx ? null : idx;
};

const faqItems = [
  {
    question: "Can I change my plan later?",
    answer:
      "Yes, absolutely. You can upgrade or downgrade your plan at any time. If you upgrade, we'll prorate the costs. If you downgrade, the change takes effect at the end of your billing cycle.",
  },
  {
    question: "What if I need more pages?",
    answer:
      "Each additional page beyond your plan limit costs €85. You can add pages anytime, and we'll adjust your timeline accordingly. For bulk additions, contact us for custom pricing.",
  },
  {
    question: "Is hosting included?",
    answer:
      "Hosting is not included in the base plans. We recommend Vercel (which we integrate with) or another host. Maintenance plans include hosting options starting from €49/month.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We offer a 14-day satisfaction guarantee. If you're not happy with our work, we'll refund your payment minus any third-party costs incurred.",
  },
  {
    question: "What's your support policy?",
    answer:
      "Starter and Growth plans include email support. Enterprise plans include priority support with a dedicated contact. Response times vary by plan.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "You can cancel your plan anytime. For ongoing maintenance plans, you can cancel with 30 days notice. No long-term contracts required.",
  },
];

// SEO
const siteUrl = useRuntimeConfig().public?.siteUrl;

useSeoMeta({
  title: "Website Pricing | Pay once. Own it forever. - SiteSynth",
  description:
    "One-time pricing for website design and development. Choose Starter or Growth packages, or request a custom Enterprise quote.",
  keywords: "website pricing, web design pricing, web development pricing, one-time payment website, pay once own forever, SiteSynth pricing",
  ogTitle: "Website Pricing | SiteSynth",
  ogDescription:
    "One-time pricing for website design and development. Pay once. Own it forever.",
  ogImage: `${siteUrl}/assets/shareimage.png`,
  twitterTitle: "Website Pricing | SiteSynth",
  twitterDescription: "One-time pricing for website design and development. Pay once. Own it forever.",
});

// Pricing page structured data (helps search understand the packages)
useHead({
  meta: [
    {
      name: 'robots',
      content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Website Pricing',
        description:
          'One-time pricing for website design and development. Choose Starter or Growth packages, or request a custom Enterprise quote.',
        url: `${siteUrl}/pricing`,
        isPartOf: {
          '@type': 'WebSite',
          name: 'SiteSynth',
          url: siteUrl,
        },
        mainEntity: {
          '@type': 'OfferCatalog',
          name: 'SiteSynth Website Packages',
          itemListElement: [
            {
              '@type': 'Offer',
              name: 'Starter',
              url: `${siteUrl}/pricing#starter`,
              price: '500',
              priceCurrency: 'EUR',
              availability: 'https://schema.org/InStock',
            },
            {
              '@type': 'Offer',
              name: 'Growth',
              url: `${siteUrl}/pricing#growth`,
              price: '900',
              priceCurrency: 'EUR',
              availability: 'https://schema.org/InStock',
            },
            {
              '@type': 'Offer',
              name: 'Enterprise',
              url: `${siteUrl}/pricing#enterprise`,
              availability: 'https://schema.org/InStock',
            },
          ],
        },
      }),
    },
  ],
});
</script>

<style scoped>
.glow-text {
  display: inline-block;
  color: #ffffff;
  text-shadow:
    0 0 6px rgba(200, 155, 255, 0.45),
    0 0 18px rgba(128, 0, 255, 0.55);
  animation: pulse-glow 2.8s ease-in-out infinite;
  will-change: text-shadow;
}

@keyframes pulse-glow {
  30%, 100% {
    text-shadow:
      0 0 6px rgba(200, 155, 255, 0.45),
      0 0 18px rgba(128, 0, 255, 0.55);
  }
  50% {
    text-shadow:
      0 0 14px rgba(200, 155, 255, 1),
      0 0 36px rgba(128, 0, 255, 1);
  }
}

.pill-wrap {
  opacity: 0;
  animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: calc(var(--i) * 70ms);
}

.pill-body {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  border-radius: 9999px;
  border: 1px solid #444444;
  background: transparent;
  padding: 0 16px;
  font-size: 0.75rem;
  line-height: 1;
  text-align: center;
  font-weight: 500;
  letter-spacing: 0.025em;
  color: #888888;
  white-space: nowrap;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.pill-wrap:hover .pill-body {
  color: #aaaaaa;
  border-color: #666666;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .pill-wrap { animation: none; opacity: 1; }
}

/* Cabinet tab spinning border */
@property --tab-border-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

@keyframes tab-border-spin {
  from { --tab-border-angle: 0deg; }
  to   { --tab-border-angle: 360deg; }
}

.cabinet-tab-border {
  background: conic-gradient(
    from var(--tab-border-angle),
    transparent 0%,
    transparent 55%,
    rgba(100, 0, 255, 0) 60%,
    rgba(165, 31, 255, 0.9) 68%,
    rgba(80, 160, 255, 1) 72%,
    rgba(165, 31, 255, 0.9) 76%,
    rgba(100, 0, 255, 0) 82%,
    transparent 87%,
    transparent 100%
  );
  animation: tab-border-spin 3s linear infinite;
}

/* Cabinet screen fade transition */
.cabinet-fade-enter-active,
.cabinet-fade-leave-active {
  transition: opacity 0.18s ease;
}
.cabinet-fade-enter-from,
.cabinet-fade-leave-to {
  opacity: 0;
}
</style>
