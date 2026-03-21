/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    // Safelist hover colors to ensure Tailwind generates the classes
    "text-[#d4d4d4]",
    "hover:bg-[#0033ff]",
    "hover:border-[#0033ff]",
    "border-[#0033ff]",
    "hover:bg-[#AA3733]",
    "hover:border-[#AA3733]",
    "border-[#AA3733]",
    "hover:bg-[#8D35FF]",
    "hover:border-[#8D35FF]",
    "border-[#8D35FF]",
  ],
};
