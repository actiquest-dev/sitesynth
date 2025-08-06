<template>
  <HeaderSection />
  <HeroGeneric
    backgroundImage=""
    backgroundPosition="bg-right-bottom"
    paddingClasses="pt-[16rem] h-[100vh]"
    glowEffect="GlowBlue"
    :content="[
      {
        tag: 'h1',
        text: 'Join an elite team of people <br> who love what they do.',
        margin: 'mb-8',
        html: true,
      },
      {
        tag: 'p',
        text: 'SiteSynth was born from a simple idea: tech, design, and strategy work better when they actually talk to each other.',
        margin: 'mb-0',
      },
    ]"
  />
  <TwoColumnsDesign
    glowEffect="GlowBlue"
    sectionBgColor="bg-[#161616]"
    leftColumnBgColor="bg-[#161616]"
    rightColumnBgColor="bg-[#161616]"
  >
    <template #right>
      <div
        class="px-6 py-24 md:pl-[10rem] md:pr-6 md:border-r border-[#636363] bg-[#161616]"
      >
        <h2 class="text-white text-3xl sm:text-4xl mb-6">
          Build what matters. From the inside out.
        </h2>
        <p class="text-[#999999] text-normal font-light mb-4">
          We’re a small, senior team building thoughtful digital products — for
          clients and for ourselves. We care about clarity, craft, and making
          things that last.
        </p>
        <p class="text-[#999999] text-normal font-light mb-4">
          We're not just consultants. We're makers, designers, and engineers
          building our own tools too. That means every project we take on is
          intentional — and every teammate is trusted from day one.
        </p>
        <h3 class="text-white text-2xl mt-[3rem] mb-[3rem]">
          Build what matters. From the inside out.
        </h3>
        <p class="text-[#999999] text-normal font-light">
          It’s not just software — it’s a bridge. A way to unify creativity and
          accessibility. Whether you're a professional composer or a hobbyist
          with a melody in your head, SynthScore helps turn that spark into
          something performable — fast.
        </p>
      </div>
    </template>

    <template #left>
      <div>
        <img
          src="/assets/contact-us.png"
          alt="ScoreSynth Image"
          class="h-full w-full object-cover"
        />
      </div>
    </template>
  </TwoColumnsDesign>

  <BannerSection text="Our Positions" />

  <BannerSection text="Our Culture, Your Benefits" />
  <Column
    id="what-you-get"
    class="pb-20"
    :columns="[
      {
        icon: '🌍',
        title: 'Work From Anywhere',
        headerTag: 'h3',
        description:
          'Remote-first with real flexibility. We collaborate across time zones — no commuting required.',
      },
      {
        icon: '🧠',
        title: 'Do Meaningful Work',
        headerTag: 'h3',
        description:
          'We work on things we believe in — from AI tools to design systems. No filler projects, no meaningless features.',
      },
      {
        icon: '🎯',
        title: 'Small Team, Big Ownership',
        headerTag: 'h3',
        description:
          'You’ll own your work, shape decisions, and see your impact. No middle layers, no silos.',
      },
    ]"
  />
  <Column
    id="design-system"
    class="pb-20"
    :columns="[
      {
        icon: '🤝',
        title: 'Trusted Partnerships',
        headerTag: 'h3',
        description:
          'No outsourcing loops. We work closely and directly — with teammates and with clients.',
      },
      {
        icon: '🎵',
        title: 'Side Projects Welcome',
        headerTag: 'h3',
        description:
          'Building your own thing? We get it — we’re doing the same. We support makers, not just employees.',
      },
    ]"
  />
  <FooterSection />
</template>
