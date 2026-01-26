<template>
  <HeroGeneric
    glowEffect="GlowRed"
    backgroundImage="/assets/hero-scoresynth-bg.webp"
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
  >
    <template #media>
      <div class="w-full max-w-[880px]">
        <img
          src="/assets/new-assets/products-page/product/score-synth/how-works/UiOverPattern.webp"
          alt="ScoreSynth UI overview"
          class="max-w-full h-auto"
          loading="lazy"
        />
      </div>
    </template>
  </HeroGeneric>

  <ScoreSynthSection
    id="how-scoresynth-works"
    title="How ScoreSynth Works"
    h3="From sound to score — in just a few steps."
    description="Whether you’re humming a melody, exporting a MIDI, or uploading a full demo track, ScoreSynth transforms your input into a professionally arranged orchestral score."
  />

  <ProcessSection
    accentColor="text-[#AA3733]"
    imageClass="px-10 py-10"
    imageAlt="ScoreSynth process"
    :images="[
      { src: '/assets/new-assets/products-page/product/score-synth/accordion/upload-your-source.webp' },
      { src: '/assets/new-assets/products-page/product/score-synth/accordion/ai-analyzes-separates-the-music.webp' },
      { src: '/assets/new-assets/products-page/product/score-synth/accordion/transcription-into-digital-notes.webp' },
      { src: '/assets/new-assets/products-page/product/score-synth/accordion/orchestration-with-intelligence.webp' },
      { src: '/assets/new-assets/products-page/product/score-synth/accordion/ready-out-put.webp' },
    ]"
    :sections="[
      {
        title: 'Upload your source',
        description: 'MP3, WAV, MIDI, MusicXML, scanned sheet music, or text prompts.',
      },
      {
        title: 'AI analyzes & separates',
        description: 'Source separation isolates musical layers.',
      },
      {
        title: 'Transcription',
        description: 'Audio and MIDI are converted into structured digital notation.',
      },
      {
        title: 'Orchestration',
        description: 'Parts are assigned to real instruments with musical intent.',
      },
      {
        title: 'Output',
        description: 'Clean PDF and MusicXML, ready to play or edit.',
      },
    ]"
  />

  <TestimonialScoreSynth
    hoverbg="hover:bg-[#AA3733]"
    hoverborder="hover:border-[#AA3733]"
    quoteColor="text-[#AA3733]"
    imageSrc="/assets/new-assets/people-for-CTA/oval-mayya-red.png"
    personName="Mayya Aprosina"
    personTitle="CEO & Product Owner"
    quoteTitle="Bridging two worlds — music and technology."
    quoteText="ScoreSynth brings musical ideas into clear, playable sheet music."
    ctaText="Get in touch"
    ctaLink="/contact-us"
    class="pb-[8rem] pt-[8rem]"
    glowEffect="GlowRed"
  />

  <TwoColumnsDesign
    glowEffect="GlowRed"
    sectionBgColor="bg-[#161616]"
    leftColumnBgColor="bg-[#161616]"
    rightColumnBgColor="bg-[#161616]"
  >
    <template #left>
      <div class="py-24 md:border-r border-[#636363] bg-[#161616]">
        <div class="max-w-[600px] ml-auto px-6 md:pr-16">
          <h2 class="text-white text-3xl sm:text-4xl mb-6">
            From Musician to Builder.
          </h2>
          <p class="text-[#999999] mb-4">
            Before founding SiteSynth, I was a musician.
          </p>
          <p class="text-[#999999]">
            Conservatory training, orchestras, composers, arrangers — then
            technology. ScoreSynth reconnects those worlds.
          </p>
        </div>
      </div>
    </template>

    <template #right>
      <img
        src="/assets/new-assets/products-page/product/score-synth/about.webp"
        alt="ScoreSynth background"
        class="h-full w-full object-cover"
      />
    </template>
  </TwoColumnsDesign>

  <ColumnsAndBackground
    id="who-scoresynth-is-for"
    title="Who ScoreSynth Is For"
    sectionClass="bg-[#161616] py-20"
    backgroundImage="/assets/new-assets/products-page/product/score-synth/harmonie-van-bornem.webp"
    :overlay="true"
    :overlayOpacity="0.35"
    :cards="[
      { title: 'Composers & Arrangers', description: 'From sketches to full scores.' },
      { title: 'Producers & Creators', description: 'Generate orchestral textures.' },
      { title: 'Educators & Students', description: 'Ensemble-ready arrangements.' },
      { title: 'Ensembles', description: 'Adapt scores to real performers.' },
    ]"
  />

  <WhiteSection
    hover="#AA3733"
    class="pb-[8rem] pt-[8rem]"
    bgColor="bg-[#161616]"
    bgInside="bg-[#161616]"
    textColor="text-white"
    title="Get Started Today"
    description="Turn musical ideas into readable, playable scores."
    primaryText="Start a Project"
    primaryLink="/contact-us"
    secondaryText="Book a Call"
    secondaryLink="/contact-us"
    glowEffect="GlowRed"
    gradientImage="/assets/gradients/gradient-for-banner-section-red.svg"
  />

  <FooterSection />
</template>

<script setup>
import { seoConfig, structuredData } from "~/config/seo";

const siteUrl = useRuntimeConfig().public?.siteUrl;
const seo = seoConfig.scoresynth;

useSeoMeta({
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,

  ogTitle: seo.ogTitle,
  ogDescription: seo.ogDescription,
  ogImage: `${siteUrl}/assets/shareimage.png`,
  ogImageAlt: "ScoreSynth - AI Music Scoring",

  twitterTitle: seo.twitterTitle,
  twitterDescription: seo.twitterDescription,
  twitterImage: `${siteUrl}/assets/shareimage.png`,
});

useHead({
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify(structuredData.scoreSynthPage(siteUrl)),
    },
  ],
});
</script>
