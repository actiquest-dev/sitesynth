<template>
    <div class="hidden md:flex items-center w-full space-x-8 text-white relative">
        <div v-for="(item, index) in navItems" :key="index" class="relative group">
            <template v-if="item.subItems">
                <!-- Dropdown Trigger -->
                <NuxtLink :href="item.link" :target="item.target"
                    class="font-medium transition-colors duration-1000 flex items-center space-x-1 group">
                    <span>{{ item.label }}</span>
                    <i
                        class="fas fa-chevron-down transform transition-transform duration-300 group-hover:rotate-180"></i>
                </NuxtLink>

                <!-- Dropdown Panel with Dynamic Width -->
                <div
                    :class="['absolute top-full left-0 mt-4 bg-[#1E1E1E] border border-[#333] shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50', item.dropdownWidth]">
                    <ul class="p-4 space-y-2">
                        <li v-for="(subItem, subIndex) in item.subItems" :key="subIndex" class="list-none">
                            <NuxtLink :href="subItem.link" :target="subItem.target"
                                class="flex items-center space-x-4 hover:bg-[#2A2A2A] p-4 rounded-lg transition-colors duration-300 group/item">
                                <img v-if="subItem.imageSrc" :src="subItem.imageSrc" alt="Icon"
                                    class="w-14 h-14 rounded object-cover transition-all duration-300 group-hover/item:brightness-0 group-hover/item:invert" />
                                <div>
                                    <h3 class="text-white text-base font-semibold mb-1">
                                        {{ subItem.label }}
                                    </h3>
                                    <p v-if="subItem.description" class="text-[#999999] text-sm">
                                        {{ subItem.description }}
                                    </p>
                                </div>
                            </NuxtLink>
                        </li>
                    </ul>

                </div>
            </template>

            <!-- Single Link -->
            <template v-else>
                <NuxtLink :href="item.link" :target="item.target" class="hover:text-[#8CB0FF] font-medium transition-colors duration-1000">
                    {{ item.label }}
                </NuxtLink>
            </template>
        </div>

        <!-- CTA Button -->
        <div class="flex-1 text-right">
            <NuxtLink :href="cta.link" :target="cta.target" class="border-[1px] border-white hover:bg-[#8D35FF] hover:text-white hover:border-[#8D35FF] bg-white text-[#161616] px-4 py-2 font-semibold transition-colors duration-[1000ms]">
                <span>{{ cta.text }}</span>
            </NuxtLink>
        </div>
    </div>
</template>


<script setup>
const navItems = [
    {
        label: "Product", 
        link: "#",
        dropdownWidth: "w-[500px]",
        subItems: [
            { imageSrc: "/assets/score-synth.svg", label: "ScoreSynth", link: "/scoresynth/" },
            { imageSrc: "/assets/membria.svg", label: "Membria", link: "https://membria.xyz/", target: "_blank" },
            { imageSrc: "/assets/ai-live-pod.svg", label: "AI Live Pod", link: "https://ailivepod.framer.website/", target: "_blank" },
        ]
    },
    {
        label: "Solutions",
        link: "#",
        dropdownWidth: "w-[500px]",
        subItems: [
            { imageSrc: "/assets/frame-1.svg", label: "Brand-Driven Product Strategy", description: "Align product design with your brand’s identity and goals.", link: "/brand-driven-product-strategy" },
            { imageSrc: "/assets/frame-2.svg", label: "UX & Design Systems", description: "Build consistent, scalable, and user-friendly interfaces.", link: "/ux-and-design-system" },
            { imageSrc: "/assets/frame-3.svg", label: "Development Support & Execution", description: "Turn designs into real, high-quality digital products.", link: "/full-stack-implementation" },
            { imageSrc: "/assets/frame-4.svg", label: "AI-Powered Workflows & Innovation", description: "Use smart tools to move faster and reduce cost.", link: "/ai-innovation" }
        ]
    },
    // {
    //     label: "Resources",
    //     link: "#",
    //     dropdownWidth: "w-auto min-w-[240px]",
    //     subItems: [
    //         { label: "Success Stories", link: "#" },
    //         { label: "Sync Blog", link: "#" }
    //     ]
    // },
    {
        label: "Company",
        link: "#",
        dropdownWidth: "w-auto min-w-[240px]",
        subItems: [
            { label: "About Us", link: "#" },
            { label: "Careers", link: "#" }
        ]
    },
];

const cta = { text: "Get started", link: "#" };
</script>
