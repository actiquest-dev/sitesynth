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
        text: 'UX/UI Designer',
        margin: 'mb-8',
        html: false,
      },
      {
        tag: 'p',
        text: 'Join our team and lead design on cutting-edge digital products, creating exceptional user experiences from research to polished interfaces.',
        margin: 'mb-0',
      },
    ]"
  />
  <ThoughPost
    id="ux-ui-designer-details"
    glowEffect="GlowBlue"
    sectionBgColor="bg-[#DDDDDD]"
  >
    <template #content>
      <div class="text-[#161616]">
        <!-- What you'll do section -->
        <div class="mb-12">
          <h2 class="text-3xl font-bold mb-8 text-[#161616]">What you'll do</h2>
          <ul class="space-y-4 text-lg leading-relaxed text-[#161616]">
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              Lead design on digital products — from research and wireframes to
              polished UIs.
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              Work across web and product interfaces, primarily B2B and internal
              tools.
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              Create clear, scalable design systems and documentation in Figma.
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              Collaborate with developers to ensure designs are implementable
              and responsive.
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              Facilitate feedback loops with users, clients, and team members.
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              Create interaction prototypes and support usability testing.
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              Contribute to shaping SiteSynth's own product and brand
              experiences.
            </li>
          </ul>
        </div>

        <!-- What we're looking for section -->
        <div class="mb-12">
          <h2 class="text-3xl font-bold mb-8 text-[#161616]">
            What we're looking for
          </h2>
          <ul class="space-y-4 text-lg leading-relaxed text-[#161616]">
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              3+ years experience in UI/UX design for web or SaaS products.
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              Proficiency in Figma (auto layout, variants, components,
              prototyping).
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              A strong portfolio showcasing functional, aesthetic, and
              thoughtful design work.
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              Solid understanding of responsive design and accessibility
              principles.
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              Ability to explain design decisions clearly and collaborate
              cross-functionally.
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              Self-driven, detail-oriented, and comfortable in fast-moving
              environments.
            </li>
          </ul>
        </div>

        <div class="mb-12">
          <h2 class="text-3xl font-bold mb-8 text-[#161616]">Nice to have</h2>
          <ul class="space-y-4 text-lg leading-relaxed text-[#161616]">
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              Experience designing for developer tools, dashboards, or
              enterprise software.
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              Familiarity with design handoff tools and workflows (Figma →
              React/Vue).
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              Interest in motion design, storytelling, or AI-enhanced tools.
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              Experience with HTML/CSS or frontend basics.
            </li>
          </ul>
        </div>
        <div class="mb-12">
          <h2 class="text-3xl font-bold mb-8 text-[#161616]">What we offer</h2>
          <ul class="space-y-4 text-lg leading-relaxed text-[#161616]">
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              Competitive full-time compensation (based on experience and
              location)
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              Flexible working hours and remote setup
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              Personal learning & tools budget
            </li>
          </ul>
        </div>

        <div class="mb-12">
          <h2 class="text-3xl font-bold mb-8 text-[#161616]">
            Ready to apply?
          </h2>
          <p class="mb-4">
            Send us your portfolio and a short note on why this role speaks to
            you. Tell us about a recent design you’re proud of, or a system you
            helped shape.
          </p>
          <p class="mb-4">
            <a href="mailto:hello@sitesynth.com">Email: hello@sitesynth.com</a>
          </p>
        </div>
      </div>
    </template>
  </ThoughPost>
  <FooterSection />
</template>

<script setup>
// SEO Meta
useHead({
  title: "UX/UI Designer - Join SiteSynth",
  meta: [
    {
      name: "description",
      content:
        "Join SiteSynth as a UX/UI Designer and lead design on cutting-edge digital products. Create exceptional user experiences from research to polished interfaces.",
    },
  ],
});
</script>
