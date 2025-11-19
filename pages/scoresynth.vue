<template>
  <HeaderSection
    hoverbg="hover:bg-[#AA3733]"
    hoverborder="hover:border-[#AA3733]"
  />
  <HeroGeneric
    glowEffect="GlowRed"
    backgroundImage="/assets/hero-scoresynth-bg.png"
    backgroundPosition="bg-right-bottom"
    :logo="{
      src: '/assets/ScoreSynth.svg',
      alt: 'ScoreSynth Logo',
      class: 'h-20 w-auto',
    }"
    paddingClasses="flex items-center justify-center h-[100vh]"
    :content="[
      { tag: 'h1', text: 'ScoreSynth', margin: 'mb-6' },
      {
        tag: 'h2',
        text: 'Turn ideas into full scores. In minutes.',
        margin: 'mb-8',
      },
      {
        tag: 'p',
        text: 'ScoreSynth is an AI-powered tool that transcribes, arranges, and scores music into professional orchestral sheet music — from just audio or MIDI input.',
        margin: 'mb-0',
      },
    ]"
  />
  <TwoColumnsDesign
    glowEffect="GlowRed"
    sectionBgColor="bg-[#161616]"
    leftColumnBgColor="bg-[#161616]"
    rightColumnBgColor="bg-[#161616]"
  >
    <template #left>
      <div class="py-24 md:border-r border-[#636363] bg-[#161616]">
        <div class="max-w-[600px] ml-auto px-6 md:px-0 md:pr-16">
          <h2 class="text-white text-3xl sm:text-4xl mb-6">
            From Musician to Builder.
          </h2>
          <p class="text-[#999999] text-normal font-light mb-4">
            Before founding SiteSynth, I was a musician.
          </p>
          <p class="text-[#999999]">
            I studied at the conservatory, spent years immersed in orchestras,
            and worked closely with composers, arrangers, and ensembles of all
            shapes and sizes. And while I eventually moved into technology and
            development, my passion for music never left.
          </p>
          <h3 class="text-white text-2xl mt-4 mb-4">
            With SynthScore, we’re removing that barrier.
          </h3>
          <p class="text-[#999999] text-normal font-light">
            It’s not just software — it’s a bridge. A way to unify creativity
            and accessibility. Whether you're a professional composer or a
            hobbyist with a melody in your head, SynthScore helps turn that
            spark into something performable — fast.
          </p>
        </div>
      </div>
    </template>

    <template #right>
      <div>
        <img
          src="/assets/new-assets/products-page/product/score-synth/about.png"
          alt="ScoreSynth Image"
          class="h-full w-full object-cover"
        />
      </div>
    </template>
  </TwoColumnsDesign>
  <HeroGeneric
    glowEffect="GlowRed"
    paddingClasses="pt-[6rem] pb-[6rem]"
    :content="[
      { tag: 'h2', text: 'How ScoreSynth Works', margin: 'mb-6' },
      {
        tag: 'h3',
        text: 'From sound to score — in just a few steps.',
        margin: 'mb-8',
      },
      {
        tag: 'p',
        text: 'Whether you’re humming a melody, exporting a MIDI, or uploading a full demo track, ScoreSynth transforms your input into a professionally arranged orchestral score. Heres how:',
        margin: 'mb-0',
      },
    ]"
  />

  <OneColumnImage
    glowEffect="GlowRed"
    centerImg="/assets/new-assets/products-page/product/score-synth/how-works/UiOverPattern.png"
    centerImgAlt="ScoreSynth UI Interface"
  />

  <ProcessSection
    accentColor="text-[#AA3733]"
    imageClass="px-10 py-10"
    imageAlt="Synth"
    :images="[
      {
        src: '/assets/new-assets/products-page/product/score-synth/accordion/upload-your-source.png',
        alt: 'Discover - Business Goals Analysis',
      },
      {
        src: '/assets/new-assets/products-page/product/score-synth/accordion/ai-analyzes-separates-the-music.png',
        alt: 'Define - Challenge Clarification',
      },
      {
        src: '/assets/new-assets/products-page/product/score-synth/accordion/transcription-into-digital-notes.png',
        alt: 'Design - Systems and Flows',
      },
      {
        src: '/assets/new-assets/products-page/product/score-synth/accordion/orchestration-with-intelligence.png',
        alt: 'Deliver - Design Implementation',
      },
      {
        src: '/assets/new-assets/products-page/product/score-synth/accordion/ready-out-put.png',
        alt: 'Deliver - Design Implementation',
      },
    ]"
    :sections="[
      {
        title: 'Upload your source',
        description:
          'ScoreSynth accepts MP3, WAV, MIDI, MusicXML, or even scanned sheet music. You can also describe your request using a text prompt — or combine multiple songs for AI to arrange.',
      },
      {
        title: 'AI Analyzes & Separates the Music',
        description:
          'With AI source separation (Demucs), we isolate key musical layers so the system understands what each instrument or voice is doing.',
      },
      {
        title: 'Transcription into digital notes',
        description:
          'Our transcription engine (MT3) converts the input into structured digital notes, accurately reflecting melody, harmony, and timing.',
      },
      {
        title: 'Orchestration with intelligence',
        description:
          'ScoreSynth assigns parts to real instruments using a custom orchestration model. Just pick the ensemble type and difficulty — or describe what you want.',
      },
      {
        title: 'Output: Ready-to-use sheet music',
        description:
          'Get clean PDF and MusicXML files, ready for printing or editing. Every version includes AI playback so you can preview the arrangement.',
      },
    ]"
  />
  <Testimonial
    hoverbg="hover:bg-[#AA3733]"
    hoverborder="hover:border-[#AA3733]"
    quoteColor="text-[#AA3733]"
    imageSrc="/assets/mayya.png"
    personName="Mayya Aprosina"
    personTitle="CEO & Business Designer"
    quoteTitle="A clear why shapes everything that follows."
    quoteText="Understanding why your brand exists — beyond products or features — gives every decision direction. It’s the foundation for building digital experiences that feel aligned, intentional, and real."
    ctaText="Get in touch"
    ctaLink="contact-us"
    class="pb-[8rem] pt-[8rem]"
    glowEffect="GlowRed"
  />
  <ColumnsAndBackground
    title="Why Choose ScoreSynth?"
    background="/assets/orchestra-bg.png"
    :leftElements="[
      {
        title: '🎼 Composers & Arrangers',
        paragraph: 'From piano sketches to full orchestration — in minutes.',
      },
      {
        title: '🎓 Educators & Students',
        paragraph: 'Create ensemble-ready arrangements for any skill level.',
      },
      {
        title: '📝 Publishers & Copyists',
        paragraph: 'Save time preparing, cleaning, and formatting music.',
      },
    ]"
    :rightElements="[
      {
        title: '🎧 Producers & Creators',
        paragraph:
          'Generate string sections, cinematic textures, or jazz combos on demand.',
      },
      {
        title: '🎻 Conductors & Ensembles',
        paragraph:
          'Need parts for a non-standard group? SynthScore adapts to your setup.',
      },
      {
        title: '🧠  Curious Hobbyists',
        paragraph:
          'Not a pro? No problem. Play with ideas, hear them instantly, and learn by doing — no steep learning curve.',
      },
    ]"
  />
  <WhiteSection
    hover="#AA3733"
    class="pb-[8rem] pt-[8rem]"
    bgColor="bg-[#161616]"
    bgInside="bg-[#161616]"
    textColor="text-white"
    title="Get Started Today"
    description="We work with founders, product leads, and marketing teams to shape digital products that reflect who you are — and scale with who you’re becoming."
    primaryText="Start a Project"
    primaryLink="#"
    secondaryText="Book a Call"
    secondaryLink="#"
    glowEffect="GlowRed"
  />
  <FooterSection />
</template>

<script setup>
// SEO Configuration for ScoreSynth product page
const siteUrl = useRuntimeConfig().public?.siteUrl;
useSeoMeta({
  title: "ScoreSynth - AI Music Scoring by SiteSynth",
  description:
    "ScoreSynth transforms audio or MIDI into professional orchestral sheet music using AI-powered transcription, orchestration, and export to MusicXML/PDF.",
  keywords:
    "scoresynth, music transcription, ai music, orchestration, musicxml, sheet music, audio to score",

  ogTitle: "ScoreSynth - Turn ideas into full scores",
  ogDescription:
    "AI-powered tool to transcribe, arrange, and score music into professional orchestral sheet music from audio or MIDI.",
  ogImage: `${siteUrl}/assets/og-scoresynth.jpg`,
  ogImageAlt: "ScoreSynth - AI Music Scoring",
  ogUrl: `${siteUrl}/scoresynth`,

  twitterTitle: "ScoreSynth - AI Music Scoring",
  twitterDescription:
    "Turn audio or MIDI into professionally arranged scores with ScoreSynth — fast, accurate, and ready for performance.",
  twitterImage: `${siteUrl}/assets/twitter-card-home.jpg`,

  canonical: `${siteUrl}/scoresynth`,
});

useHead({
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "ScoreSynth - AI Music Scoring",
        description:
          "ScoreSynth transforms audio or MIDI into professional orchestral sheet music using AI-powered transcription and orchestration.",
        url: `${siteUrl}/scoresynth`,
      }),
    },
  ],
});
</script>
