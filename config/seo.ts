// Centralized SEO configuration
// Pages can import these configs and override specific values as needed

export const seoConfig = {
    // Home page
    home: {
        title: "Just synthesis | Where Product, Brand & Tech Align - SiteSynth",
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
        description: "Meet the team behind SiteSynth. Based in Sint-Amands, we are designers, strategists, and developers working to deliver integrated digital solutions.",
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
        title: "UX & Design Systems - SiteSynth",
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

    // Career Detail Pages
    fullStackDeveloper: {
        title: "Full-Stack Developer | Join Our Team - SiteSynth",
        description: "Join SiteSynth as a Full Stack Developer and contribute to building innovative digital products.",
        keywords: "full stack developer, developer jobs, react, vue, node.js, careers, remote work, belgium jobs",
        get ogTitle() { return this.title },
        get ogDescription() { return this.description },
        get twitterTitle() { return this.title },
        get twitterDescription() { return this.description },
    },

    marketingManager: {
        title: "Marketing Manager | Join Our Team - SiteSynth",
        description: "Join SiteSynth as a Marketing Manager and help shape and amplify our story.",
        keywords: "marketing manager, marketing jobs, digital marketing, content strategy, brand marketing, careers, belgium jobs",
        get ogTitle() { return this.title },
        get ogDescription() { return this.description },
        get twitterTitle() { return this.title },
        get twitterDescription() { return this.description },
    },

    uxUiDesigner: {
        title: "UX/UI Designer | Join Our Team - SiteSynth",
        description: "Join SiteSynth as a UX/UI Designer and lead design on cutting-edge digital products. Create exceptional user experiences from research to polished interfaces.",
        keywords: "ux designer, ui designer, design jobs, figma, design systems, user research, careers, belgium jobs",
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

    // Service pages (AI Innovation, Brand Strategy, UX Design, Full-Stack)
    aiInnovationPage: (siteUrl: string) => ({
        "@context": "https://schema.org",
        "@type": "Service",
        name: "AI Innovation & R&D",
        description: "We help teams identify high-impact AI opportunities, prototype rapidly, and integrate AI into products and operations with responsibility and speed.",
        url: `${siteUrl}/ai-innovation`,
        provider: {
            "@type": "Organization",
            name: "SiteSynth",
            url: siteUrl,
        },
        serviceType: "AI Innovation and R&D Services",
        areaServed: "Worldwide",
    }),

    brandStrategyPage: (siteUrl: string) => ({
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Brand-Driven Product Strategy",
        description: "Services to align brand and product strategy: discovery, UX translation, messaging frameworks, and cross-team alignment.",
        url: `${siteUrl}/brand-driven-product-strategy`,
        provider: {
            "@type": "Organization",
            name: "SiteSynth",
            url: siteUrl,
        },
        serviceType: "Brand Strategy Services",
        areaServed: "Worldwide",
    }),

    uxDesignPage: (siteUrl: string) => ({
        "@context": "https://schema.org",
        "@type": "Service",
        name: "UX & Design Systems",
        description: "We build scalable design systems and UX architecture that let teams move faster, stay consistent, and hand off clearly to engineering.",
        url: `${siteUrl}/ux-and-design-system`,
        provider: {
            "@type": "Organization",
            name: "SiteSynth",
            url: siteUrl,
        },
        serviceType: "UX and Design System Services",
        areaServed: "Worldwide",
    }),

    fullStackPage: (siteUrl: string) => ({
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Full-Stack Implementation",
        description: "Production-ready engineering: front-end, back-end, and integrated developer collaboration to ship reliable, scalable digital products.",
        url: `${siteUrl}/full-stack-implementation`,
        provider: {
            "@type": "Organization",
            name: "SiteSynth",
            url: siteUrl,
        },
        serviceType: "Full-Stack Development Services",
        areaServed: "Worldwide",
    }),

    // Product pages
    scoreSynthPage: (siteUrl: string) => ({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "ScoreSynth",
        description: "ScoreSynth transforms audio or MIDI into professional orchestral sheet music using AI-powered transcription, orchestration, and export to MusicXML/PDF.",
        url: `${siteUrl}/scoresynth`,
        applicationCategory: "MusicApplication",
        operatingSystem: "Web",
    }),

    // Career pages
    careersPage: (siteUrl: string) => ({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Careers at SiteSynth",
        description: "Join our team of designers, strategists, and developers. Work on meaningful projects in a collaborative environment.",
        url: `${siteUrl}/careers`,
    }),

    fullStackDeveloperJob: (siteUrl: string) => ({
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: "Full-Stack Developer",
        description: "Join SiteSynth as a Full Stack Developer and contribute to building innovative digital products. Work with modern technologies and collaborate with a dynamic team to create impactful solutions.",
        datePosted: "2025-01-01",
        hiringOrganization: {
            "@type": "Organization",
            name: "SiteSynth",
            sameAs: siteUrl,
            logo: `${siteUrl}/assets/logo.png`,
        },
        jobLocation: {
            "@type": "Place",
            address: {
                "@type": "PostalAddress",
                addressLocality: "Sint-Amands",
                addressCountry: "Belgium",
            },
        },
        employmentType: "FULL_TIME",
        url: `${siteUrl}/careers/full-stack-developer`,
    }),

    marketingManagerJob: (siteUrl: string) => ({
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: "Marketing Manager",
        description: "Join SiteSynth as a Marketing Manager and help shape and amplify our story. Develop and execute marketing strategies to grow brand visibility and generate qualified leads.",
        datePosted: "2025-01-01",
        hiringOrganization: {
            "@type": "Organization",
            name: "SiteSynth",
            sameAs: siteUrl,
            logo: `${siteUrl}/assets/logo.png`,
        },
        jobLocation: {
            "@type": "Place",
            address: {
                "@type": "PostalAddress",
                addressLocality: "Sint-Amands",
                addressCountry: "Belgium",
            },
        },
        employmentType: "FULL_TIME",
        url: `${siteUrl}/careers/marketing-manager`,
    }),

    uxUiDesignerJob: (siteUrl: string) => ({
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: "UX/UI Designer",
        description: "Join SiteSynth as a UX/UI Designer and lead design on cutting-edge digital products. Create exceptional user experiences from research to polished interfaces.",
        datePosted: "2025-01-01",
        hiringOrganization: {
            "@type": "Organization",
            name: "SiteSynth",
            sameAs: siteUrl,
            logo: `${siteUrl}/assets/logo.png`,
        },
        jobLocation: {
            "@type": "Place",
            address: {
                "@type": "PostalAddress",
                addressLocality: "Sint-Amands",
                addressCountry: "Belgium",
            },
        },
        employmentType: "FULL_TIME",
        url: `${siteUrl}/careers/ux-ui-designer`,
    }),

    // Privacy policy page
    privacyPolicyPage: (siteUrl: string) => ({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Privacy Policy & Terms of Service",
        description: "Read our privacy policy and terms of service. Learn how we collect, use, and protect your data.",
        url: `${siteUrl}/privacy-and-policy`,
    }),

    // Home page
    homePage: (siteUrl: string) => ({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "SiteSynth - Where Product, Brand & Tech Align",
        description: "Where product, brand, and tech finally align. We help companies bridge strategy, design, and engineering to create digital products that scale.",
        url: siteUrl,
        mainEntity: {
            "@type": "Organization",
            name: "SiteSynth",
            description: "Strategic design and development company that bridges product, brand, and tech to create scalable digital solutions.",
            url: siteUrl,
        },
    }),
}
