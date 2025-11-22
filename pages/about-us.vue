<template>
  <HeaderSection />
  <AboutHero
    glowEffect="GlowBlue"
    :content="[
      {
        tag: 'h1',
        text: 'We started small — on <br/> purpose.',
        margin: 'mb-8',
        html: true,
      },
      {
        tag: 'p',
        text: 'Meet the people guiding our vision and driving our work forward.',
        margin: 'mb-0',
      },
    ]"
  />
<!-- Блок WHY WE EXIST? -> внутрь TwoColumnsDesign -->
  <TwoColumnsDesign
    glowEffect="GlowBlue"
    id="info-ai"
    sectionBgColor="bg-[#DDDDDD]"
    leftColumnBgColor="bg-[#DDDDDD]"
    rightColumnBgColor="bg-[#161616]"
    textColorleft="text-[#161616]"
    textColorRight="text-white"
  >
    <template #left>
      <div class="py-24 md:border-r border-[#636363] bg-[#DDDDDD]">
        <div class="max-w-[600px] ml-auto px-6 md:px-0 md:pr-16">
          <h3 class="text-lg mb-2">WHY WE EXIST?</h3>
          <h2 class="text-4xl font-bold mb-4">
            — we’re a strategic bridge between brand, design, and engineering.
          </h2>
        </div>
      </div>
    </template>

    <template #right>
      <div class="bg-[#161616] flex items-center justify-center">
        <div class="max-w-[600px] mr-auto px-6 md:px-0 md:pl-16">
          <p class="text-white font-bold mb-4">
            Rooted in effectiveness, openness, and craftsmanship. We're a small
            but dedicated team—designers, strategists, and full-stack
            developers—working in sync to deliver integrated solutions that
            break down silos and drive lasting impact.
          </p>
        </div>
      </div>
    </template>
  </TwoColumnsDesign>

  <TwoColumnsDesign
    glowEffect="GlowBlue"
    sectionBgColor="bg-[#161616]"
    leftColumnBgColor="bg-[#161616]"
    rightColumnBgColor="bg-[#161616]"
  >
    <template #left>
      <div class="py-24 md:border-r border-[#636363] bg-[#161616]">
        <div class="max-w-[600px] ml-auto px-6 md:px-0 md:pr-16">
          <h2 class="text-white text-3xl sm:text-4xl mb-6">About Us</h2>
          <p class="text-[#999999] text-normal font-light mb-4">
            We’re based in Sint‑Amands, Belgium, in a small office within a
            beautifully restored historical building by the Schelde river. It’s
            not flashy—but it's meaningful: rooted, quiet, and real.
          </p>
          <h3 class="text-white text-2xl mt-[3rem] mb-[3rem]">
            Easy reach of partners, clients, and collaborators across Europe.
          </h3>
          <p class="text-[#999999] text-normal font-light">
            Strategically located between Antwerp, Brussels, and Ghent, we
            remain deeply connected to Europe’s major economic hubs—while
            keeping focus where it matters most. This little town gives us
            clarity and calm—and the flexibility to move quickly when clients
            need us.
          </p>
        </div>
      </div>
    </template>

    <template #right>
      <div>
        <img
          src="/assets/new-assets/company-page/about-us/about us photo of office.png"
          alt="ScoreSynth Image"
          class="h-full w-full object-cover"
        />
      </div>
    </template>
  </TwoColumnsDesign>
  <TwoColumnsDesign
    glowEffect="GlowBlue"
    id="info-ai"
    sectionBgColor="bg-[#DDDDDD]"
    leftColumnBgColor="bg-[#DDDDDD]"
    rightColumnBgColor="bg-[#161616]"
    textColorleft="text-[#161616]"
    textColorRight="text-white"
  >
  </TwoColumnsDesign>

<template>
  <section
    :id="id || undefined"
    class="bg-[#161616] border-t border-b border-[#636363] py-20"
  >
    <div class="max-w-[1248px] mx-auto px-6">
      <!-- Заголовок -->
      <div class="text-center max-w-3xl mx-auto mb-14">
        <h2 class="text-white text-3xl sm:text-4xl font-bold mb-4">
          {{ title }}
        </h2>
        <p class="text-[#bbbbbb] text-sm sm:text-base leading-relaxed">
          {{ subtitle }}
        </p>
      </div>

      <!-- Карточки -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <article
          v-for="(leader, index) in leaders"
          :key="index"
          class="group relative overflow-hidden rounded-xl bg-[#101010]"
        >
          <!-- Фото -->
          <img
            :src="leader.image"
            :alt="leader.name"
            class="h-[420px] w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.03]"
          />

          <!-- Градиент внизу для имени/роли (всегда) -->
          <div
            class="pointer-events-none absolute inset-x-0 bottom-0 h-40
                   bg-gradient-to-t from-black/80 via-black/40 to-transparent"
          ></div>

          <!-- Имя + роль (всегда видно) -->
          <div
            class="absolute inset-x-0 bottom-0 z-10 p-6"
          >
            <h3 class="text-white text-lg font-semibold">
              {{ leader.name }}
            </h3>
            <p class="text-[#d0d0d0] text-sm mt-1">
              {{ leader.role }}
            </p>
          </div>

          <!-- Оверлей с описанием (появляется при hover) -->
          <div
            class="absolute inset-0 z-20 flex flex-col justify-between
                   bg-gradient-to-t from-black/90 via-black/80 to-black/10
                   opacity-0 translate-y-2
                   transition-all duration-400 ease-[cubic-bezier(0.22,0.61,0.36,1)]
                   group-hover:opacity-100 group-hover:translate-y-0"
          >
            <div class="p-6 pt-7 pr-7">
              <p class="text-[#f5f5f5] text-sm leading-relaxed">
                {{ leader.description }}
              </p>
            </div>

            <!-- Имя + роль повторно внизу, как на референсе -->
            <div class="p-6 pt-4">
              <h3 class="text-white text-lg font-semibold">
                {{ leader.name }}
              </h3>
              <p class="text-[#d0d0d0] text-sm mt-1">
                {{ leader.role }}
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  id: {
    type: String,
    default: ""
  },
  title: {
    type: String,
    default: "Our leaders"
  },
  subtitle: {
    type: String,
    default:
      "Creatives, Developers, Designers — meet the team that specializes in turning dreams into digital masterpieces."
  },
  leaders: {
    type: Array,
    required: true
    // [{ name, role, image, description }]
  }
});
</script>


  
  <BannerSection
    text="Our team"
    tag="h2"
    sectionClass="pt-20 pb-[2rem] bg-[#161616] text-white text-center"
  />
  <BannerSection
    text="Creatives, Developers, Designers — meet the team that specializes in <br> turning dreams into digital masterpieces."
    tag="p"
    sectionClass="bg-[#161616] text-white text-center"
    contentClass="mx-auto text-normal text-white"
  />
  <TeamsSection
    id="our-team"
    backgroundColor="bg-[#161616]"
    nameTextColor="text-white"
    positionTextColor="text-[#999999]"
    :teamMembers="[
      {
        imageSrc: '/assets/new-assets/company-page/about-us/our-team/koen.png',
        name: 'Koen Vergauwen',
        nameTag: 'h3',
        nameClass: '',
        position: 'Head of Growth',
      },
      {
        imageSrc: '/assets/new-assets/company-page/about-us/our-team/mayya.png',
        name: 'Mayya Aprosina',
        nameTag: 'h3',
        nameClass: '',
        position: 'CEO & Business Designer',
      },
      {
        imageSrc: '/assets/new-assets/company-page/about-us/our-team/marco.png',
        name: 'Marco Maffei',
        nameTag: 'h3',
        nameClass: '',
        position: 'Full-Stack Engineer',
      },
      {
        imageSrc: '/assets/new-assets/company-page/about-us/our-team/anna.png',
        name: 'Anna Gorbenko',
        nameTag: 'h3',
        nameClass: '',
        position: 'Content Manager',
      },
      {
        imageSrc:
          '/assets/new-assets/company-page/about-us/our-team/miguel.png',
        name: 'Miguel Aprossine',
        nameTag: 'h3',
        nameClass: '',
        position: 'AI & Web3 Visionary Partner',
      },
      {
        imageSrc:
          '/assets/new-assets/company-page/about-us/our-team/unknown.png',
        name: 'Wanna Join?',
        nameTag: 'h3',
        nameClass: '',
        position: 'Wanna Join?',
      },
    ]"
  />
  <WhiteSection
    hover="#0033ff"
    glowEffect="GlowBlue"
    id="get-started-today"
    class="pt-[8rem] pb-[8rem]"
    title="Get Started Today"
    description="We work with founders, product leads, and marketing teams to shape digital products that reflect who you are — and scale with who you’re becoming."
    primaryText="Start a Project"
    primaryLink="/contact-us"
    secondaryText="Book a Call"
    secondaryLink="/contact-us"
  />
  <FooterSection />
</template>

<script setup>
// SEO Configuration for About Us Page - Only override what's unique
const siteUrl = useRuntimeConfig().public?.siteUrl;
useSeoMeta({
  // Page-specific title
  title: "About Us - SiteSynth | Meet Our Strategic Design & Development Team",

  // Page-specific description
  description:
    "Meet the team behind SiteSynth. Based in Sint-Amands, Belgium, we are designers, strategists, and developers working in sync to deliver integrated digital solutions.",

  // Page-specific keywords
  keywords:
    "about sitesynth, team, belgium design agency, strategic design team, mayya aprosina, miguel aprossine, marco maffei, design and development team",

  // Open Graph - Only unique values
  ogTitle: "About SiteSynth - Meet Our Team",
  ogDescription:
    "Meet the team behind SiteSynth. Based in Sint-Amands, Belgium, we bridge strategy, design, and engineering.",
  ogImage: `${siteUrl}/assets/og-image-about.jpg`,
  ogImageAlt: "SiteSynth Team - Strategic Design & Development",
  ogUrl: `${siteUrl}/about-us`,

  // Twitter - Only unique values
  twitterTitle: "About SiteSynth - Meet Our Team",
  twitterDescription:
    "Meet the team behind SiteSynth. Based in Sint-Amands, Belgium, we bridge strategy, design, and engineering.",
  twitterImage: `${siteUrl}/assets/twitter-card-about.jpg`,

  // Page-specific canonical
  canonical: `${siteUrl}/about-us`,
});

// Structured data for About page
useHead({
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "About SiteSynth",
        description:
          "Learn about SiteSynth, our team, and our approach to strategic design and development.",
        url: `${siteUrl}/about-us`,
        mainEntity: {
          "@type": "Organization",
          name: "SiteSynth",
          foundingDate: "2020",
          foundingLocation: "Sint-Amands, Belgium",
          employees: [
            {
              "@type": "Person",
              name: "Mayya Aprosina",
              jobTitle: "CEO & Business Designer",
            },
            {
              "@type": "Person",
              name: "Miguel Aprossine",
              jobTitle: "AI & Web3 Visionary Partner",
            },
            {
              "@type": "Person",
              name: "Marco Maffei",
              jobTitle: "Full-Stack Engineer",
            },
          ],
        },
      }),
    },
  ],
});
</script>
