<template>
    <HeaderSection />
    <HeroGeneric backgroundImage="/assets/hero-scoresynth-bg.png" backgroundPosition="bg-right-bottom" :logo="{ src: '/assets/ScoreSynth.svg', alt: 'ScoreSynth Logo', class: 'h-20 w-auto' }"
        paddingClasses="pt-[16rem] pb-[10rem]" :content="[
            { tag: 'h1', text: 'ScoreSynth', margin: 'mb-6' },
            { tag: 'h2', text: 'Turn ideas into full scores. In minutes.', margin: 'mb-8' },
            { tag: 'p', text: 'ScoreSynth is an AI-powered tool that transcribes, arranges, and scores music into professional orchestral sheet music — from just audio or MIDI input.', margin: 'mb-0' }
        ]" />
    <TwoColumnsDesign glowEffect="GlowRed" sectionBgColor="bg-[#161616]" leftColumnBgColor="bg-[#161616]" rightColumnBgColor="bg-[#161616]">
        <template #left>
            <h3 class="text-white text-lg mb-2">Scoring Music is Hard. And That’s Holding People Back.</h3>
            <p class="text-[#999999] text-normal font-light mb-4">Before founding SiteSynth, I was a musician. I studied at the
                conservatory, spent years immersed in orchestras, and worked closely with composers, arrangers, and
                ensembles of all shapes and sizes. And while I eventually moved into technology and development, my
                passion for music never left.</p>
            <h3 class="text-white text-normal mb-2">How complex, technical, and time-consuming it is to produce orchestral scores.
            </h3>
            <p class="text-[#999999] text-normal font-light mb-4">Whether you’re a professional composer or an educator leading an
                amateur orchestra, the process of writing, adapting, and arranging music for a specific group of
                musicians is often a massive barrier. You need a professional skill for that.</p>
        </template>

        <template #right>
            <img src="/assets/score-sytnh-img.png" alt="ScoreSynth Image" class="w-full h-auto rounded-lg" />
        </template>
    </TwoColumnsDesign>
    <HeroGeneric paddingClasses="pt-[6rem] pb-[6rem]" :content="[
        { tag: 'h2', text: 'How ScoreSynth Works', margin: 'mb-6' },
        { tag: 'h3', text: 'From sound to score — in just a few steps.', margin: 'mb-8' },
        { tag: 'p', text: 'Whether you’re humming a melody, exporting a MIDI, or uploading a full demo track, ScoreSynth transforms your input into a professionally arranged orchestral score. Heres how:', margin: 'mb-0' }
    ]" />
    <ProcessSection accentColor="text-[#AA3733]" imageSrc="/assets/why-1.png" imageClass="px-10 py-10" imageAlt="Synth"
        :images="[
            { src: '/assets/upload.png', alt: 'Discover - Business Goals Analysis' },
            { src: '/assets/ai-analize.png', alt: 'Define - Challenge Clarification' },
            { src: '/assets/symphony.png', alt: 'Design - Systems and Flows' },
            { src: '/assets/orchestration.png', alt: 'Deliver - Design Implementation' },
            { src: '/assets/output.png', alt: 'Deliver - Design Implementation' }
        ]" :sections="[
            { title: 'Upload your source', description: 'ScoreSynth accepts MP3, WAV, MIDI, MusicXML, or even scanned sheet music. You can also describe your request using a text prompt — or combine multiple songs for AI to arrange.' },
            { title: 'AI Analyzes & Separates the Music', description: 'With AI source separation (Demucs), we isolate key musical layers so the system understands what each instrument or voice is doing.' },
            { title: 'Transcription into digital notes', description: 'Our transcription engine (MT3) converts the input into structured digital notes, accurately reflecting melody, harmony, and timing.' },
            { title: 'Orchestration with intelligence', description: 'ScoreSynth assigns parts to real instruments using a custom orchestration model. Just pick the ensemble type and difficulty — or describe what you want.' },
            { title: 'Output: Ready-to-use sheet music', description: 'Get clean PDF and MusicXML files, ready for printing or editing. Every version includes AI playback so you can preview the arrangement.' }
        ]" />
    <Testimonial quoteColor="text-[#AA3733]" imageSrc="/assets/mayya.png" personName="Mayya Aprosina"
        personTitle="CEO & Business Designer" quoteTitle="A clear why shapes everything that follows."
        quoteText="Understanding why your brand exists — beyond products or features — gives every decision direction. It’s the foundation for building digital experiences that feel aligned, intentional, and real."
        ctaText="Get in touch" ctaLink="#" class="pb-[8rem] pt-[8rem]" glowEffect="GlowRed" />
    <ColumnsAndBackground title="Why Choose ScoreSynth?" background="/assets/orchestra-bg.png" :leftElements="[
        {
            title: '🎼 Composers & Arrangers',
            paragraph: 'From piano sketches to full orchestration — in minutes.'
        },
        {
            title: '🎓 Educators & Students',
            paragraph: 'Create ensemble-ready arrangements for any skill level.'
        },
        {
            title: '📝 Publishers & Copyists',
            paragraph: 'Save time preparing, cleaning, and formatting music.'
        }
    ]" :rightElements="[
        {
            title: '🎧 Producers & Creators',
            paragraph: 'Generate string sections, cinematic textures, or jazz combos on demand.'
        },
        {
            title: '🎻 Conductors & Ensembles',
            paragraph: 'Need parts for a non-standard group? SynthScore adapts to your setup.'
        },
        {
            title: '🧠  Curious Hobbyists',
            paragraph: 'Not a pro? No problem. Play with ideas, hear them instantly, and learn by doing — no steep learning curve.'
        }
    ]" />
    <WhiteSection class="pb-[8rem] pt-[8rem]" bgColor="bg-[#161616]" bgInside="bg-[#161616]" textColor="text-white"
        title="Get Started Today"
        description="We work with founders, product leads, and marketing teams to shape digital products that reflect who you are — and scale with who you’re becoming."
        primaryText="Start a Project" primaryLink="#" secondaryText="Book a Call" secondaryLink="#"
        glowEffect="GlowRed" />
    <FooterSection />
</template>