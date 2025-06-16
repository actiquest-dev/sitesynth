<template>
    <div class="hidden md:flex items-center w-full space-x-8 text-white relative">
        <div v-for="(item, index) in navItems" :key="index" class="relative group">
            <template v-if="item.subItems">
                <!-- Dropdown Trigger -->
                <a :href="item.link"
                    class="hover:text-[#A620FF] font-medium transition-colors duration-1000 flex items-center space-x-1 group">
                    <span>{{ item.label }}</span>
                    <i class="fas fa-chevron-up transform transition-transform duration-300 group-hover:rotate-180"></i>
                </a>

                <!-- Dropdown Panel with Dynamic Width -->
                <div
                    :class="['absolute top-full left-0 mt-4 bg-[#1E1E1E] border border-[#333] shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50', item.dropdownWidth]">
                    <ul class="p-4 space-y-2">
                        <li v-for="(subItem, subIndex) in item.subItems" :key="subIndex"
                            class="flex items-start space-x-4 hover:bg-[#2A2A2A] p-4 rounded-lg transition-colors duration-300">
                            <img v-if="subItem.imageSrc" :src="subItem.imageSrc" alt="Icon"
                                class="w-14 h-14 rounded object-cover" />
                            <div>
                                <h3 class="text-white text-base font-semibold mb-1">
                                    <a :href="subItem.link"
                                        class="hover:text-[#A620FF] transition-colors duration-300">{{ subItem.label
                                        }}</a>
                                </h3>
                                <p v-if="subItem.description" class="text-gray-300 text-sm">{{ subItem.description }}
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
            </template>

            <!-- Single Link -->
            <template v-else>
                <a :href="item.link" class="hover:text-[#A620FF] font-medium transition-colors duration-1000">
                    {{ item.label }}
                </a>
            </template>
        </div>

        <!-- CTA Button -->
        <div class="flex-1 text-right">
            <a :href="cta.link" class="button btn-2 px-4 py-2 text-white font-semibold">
                <span>{{ cta.text }}</span>
            </a>
        </div>
    </div>
</template>


<script setup>
const navItems = [
    { label: "Product", link: "#" },
    {
        label: "Solutions",
        link: "/solution",
        dropdownWidth: "w-[720px]",
        subItems: [
            { imageSrc: "/assets/frame-1.svg", label: "Brand-Driven Product Strategy", description: "Align product design with your brand’s identity and goals.", link: "#" },
            { imageSrc: "/assets/frame-2.svg", label: "UX & Design Systems", description: "Build consistent, scalable, and user-friendly interfaces.", link: "#" },
            { imageSrc: "/assets/frame-3.svg", label: "Development Support & Execution", description: "Turn designs into real, high-quality digital products.", link: "#" },
            { imageSrc: "/assets/frame-4.svg", label: "AI-Powered Workflows & Innovation", description: "Use smart tools to move faster and reduce cost.", link: "#" }
        ]
    },
    {
        label: "Resources",
        link: "/resources",
        dropdownWidth: "w-auto min-w-[240px]",
        subItems: [
            { label: "Success Stories", link: "/success-stories" },
            { label: "Sync Blog", link: "/blog" }
        ]
    },
    {
        label: "Company",
        link: "/company",
        dropdownWidth: "w-auto min-w-[240px]",
        subItems: [
            { label: "About Us", link: "/about" },
            { label: "Careers", link: "/careers" }
        ]
    },
    { label: "Pricing", link: "#" }
];

const cta = { text: "Get started", link: "#" };
</script>
