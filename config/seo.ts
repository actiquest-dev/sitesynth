// Centralized SEO configuration
// Pages can import these configs and override specific values as needed

export const seoConfig = {
    // Home page
    home: {
        title: "No silos. Just synthesis | Where Product, Brand & Tech Align - SiteSynth",
        description: "Where product, brand, and tech finally align. We help companies bridge strategy, design, and engineering to create digital products that scale.",
        keywords: "strategic design, product development, brand strategy, full-stack development, design systems, AI innovation, UX design, web development, no silos synthesis",
        get ogTitle() { return this.title },
        get ogDescription() { return this.description },
        get twitterTitle() { return this.title },
        get twitterDescription() { return this.description },
    },

    // About page
    about: {
        title: "About Us | Meet Our Strategic Design & Development Team - SiteSynth",
        description: "Meet the team behind SiteSynth. Based in Sint-Amands, Belgium, we are designers, strategists, and developers working in sync to deliver integrated digital solutions.",
        keywords: "about sitesynth, team, belgium design agency, strategic design team, mayya aprosina, miguel aprossine, marco maffei, design and development team",
        get ogTitle() { return this.title },
        get ogDescription() { return this.description },
        get twitterTitle() { return this.title },
        get twitterDescription() { return this.description },
        twitterImage: "/assets/twitter-card-about.jpg",
    },

    // Contact page
    contact: {
        title: "Contact Us | Let's build something meaningful - SiteSynth",
        description: "Get in touch with SiteSynth to start a project, explore partnerships, or join our team. We're based in Belgium and work globally.",
        keywords: "contact, sitesynth, get in touch, hire, partnership, careers, contact us",
        get ogTitle() { return this.title },
        get ogDescription() { return this.description },
        get twitterTitle() { return this.title },
        get twitterDescription() { return this.description },
    },

    // AI Innovation page
    aiInnovation: {
        title: "AI Innovation & R&D | AI-Powered Product Strategy - SiteSynth",
        description: "We help teams discover high-impact AI use cases, prototype quickly, and integrate AI responsibly into products and workflows.",
        keywords: "ai strategy, ai innovation, rapid prototyping, r&d, llms, vector search, rag, ai product",
        get ogTitle() { return this.title },
        get ogDescription() { return this.description },
        get twitterTitle() { return this.title },
        get twitterDescription() { return this.description },
    },

    // Brand Strategy page
    brandStrategy: {
        title: "Brand-Driven Product Strategy | Align Brand & Product - SiteSynth",
        description: "Align your brand with product strategy: we translate brand voice, values, and purpose into product experiences that feel intentional and drive results.",
        keywords: "brand strategy, product strategy, brand-driven product, messaging framework, design strategy, cross-team alignment",
        get ogTitle() { return this.title },
        get ogDescription() { return this.description },
        get twitterTitle() { return this.title },
        get twitterDescription() { return this.description },
    },

    // UX Design page
    uxDesign: {
        title: "UX & Design Systems | Scalable Design Systems & UX Architecture - SiteSynth",
        description: "We build scalable design systems and UX architecture that let teams move faster, stay consistent, and hand off clearly to engineering.",
        keywords: "design systems, ux architecture, figma, design tokens, component libraries, design handoff, zeroheight, storybook",
        get ogTitle() { return this.title },
        get ogDescription() { return this.description },
        get twitterTitle() { return this.title },
        get twitterDescription() { return this.description },
    },

    // Full Stack page
    fullStack: {
        title: "Full-Stack Implementation | Production-Ready Engineering - SiteSynth",
        description: "Production-ready engineering: front-end, back-end, and integrated developer collaboration to ship reliable, scalable digital products.",
        keywords: "full-stack engineering, implementation support, production-ready, backend, frontend, APIs, dev collaboration",
        get ogTitle() { return this.title },
        get ogDescription() { return this.description },
        get twitterTitle() { return this.title },
        get twitterDescription() { return this.description },
    },

    // Careers page
    careers: {
        title: "Careers | Join Our Team - SiteSynth",
        description: "Join our team of designers, strategists, and developers. Work on meaningful projects in a collaborative environment.",
        keywords: "careers, jobs, design jobs, developer jobs, sitesynth careers",
        get ogTitle() { return this.title },
        get ogDescription() { return this.description },
        get twitterTitle() { return this.title },
        get twitterDescription() { return this.description },
    },

    // ScoreSynth page
    scoresynth: {
        title: "ScoreSynth | AI Music Scoring - SiteSynth",
        description: "ScoreSynth transforms audio or MIDI into professional orchestral sheet music using AI-powered transcription, orchestration, and export to MusicXML/PDF.",
        keywords: "scoresynth, music transcription, ai music, orchestration, musicxml, sheet music, audio to score",
        get ogTitle() { return this.title },
        get ogDescription() { return this.description },
        get twitterTitle() { return this.title },
        get twitterDescription() { return this.description },
    },

    // Privacy Policy page
    privacyPolicy: {
        title: "Privacy Policy & Terms of Service - SiteSynth",
        description: "Read our privacy policy and terms of service. Learn how we collect, use, and protect your data, and understand your rights as a user of our website.",
        keywords: "privacy policy, terms of service, data protection, cookies, GDPR, user rights, terms and conditions, legal",
        get ogTitle() { return this.title },
        get ogDescription() { return this.description },
        get twitterTitle() { return this.title },
        get twitterDescription() { return this.description },
    },
}

// Structured data templates for different page types
export const structuredData = {
    aboutPage: (siteUrl: string) => ({
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "About SiteSynth",
        description: "Learn about SiteSynth, our team, and our approach to strategic design and development.",
        url: `${siteUrl}/about-us`,
        mainEntity: {
            "@type": "Organization",
            name: "SiteSynth",
            foundingDate: "2025",
            foundingLocation: { "@type": "Place", name: "Puurs-Sint-Amands", },
            employees: [
                {
                    "@type": "Person",
                    name: "Mayya Aprosina",
                    jobTitle: "CEO & Business Designer",
                },
                {
                    "@type": "Person",
                    name: "Miguel Aprossine",
                    jobTitle: "Creative Director",
                },
                {
                    "@type": "Person",
                    name: "Marco Maffei",
                    jobTitle: "Lead Full-Stack Developer",
                },
            ],
        },
    }),

    contactPage: (siteUrl: string) => ({
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: "Contact SiteSynth",
        description: "Contact SiteSynth to start a project, explore partnerships, or join our team.",
        url: `${siteUrl}/contact-us`,
    }),

    service: (siteUrl: string, serviceName: string, description: string, url: string) => ({
        "@context": "https://schema.org",
        "@type": "Service",
        name: serviceName,
        description: description,
        url: `${siteUrl}${url}`,
        provider: {
            "@type": "Organization",
            name: "SiteSynth",
            url: siteUrl,
        },
        serviceType: "Design and Development Services",
        areaServed: "Worldwide",
    }),

    jobPosting: (siteUrl: string, job: any) => ({
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: job.title,
        description: job.description,
        datePosted: job.datePosted,
        hiringOrganization: {
            "@type": "Organization",
            name: "SiteSynth",
            sameAs: siteUrl,
        },
        jobLocation: {
            "@type": "Place",
            address: {
                "@type": "PostalAddress",
                addressLocality: "Sint-Amands",
                addressCountry: "Belgium",
            },
        },
        employmentType: job.employmentType || "FULL_TIME",
    }),
}
