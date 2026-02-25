<template>
  <svg
    width="527"
    height="527"
    viewBox="0 0 527 527"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#orb-blur)">
      <circle cx="350" cy="180" r="150" fill="url(#orb-grad-a)" />
      <circle cx="220" cy="290" r="120" fill="url(#orb-grad-b)" />
    </g>
    <defs>
      <radialGradient id="orb-grad-a" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(350 180) rotate(130) scale(210)">
        <stop offset="0" stop-color="#A51FFF" stop-opacity="0.95" />
        <stop offset="0.55" stop-color="#3C2DFF" stop-opacity="0.6" />
        <stop offset="1" stop-color="#0033FF" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="orb-grad-b" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(220 290) rotate(320) scale(170)">
        <stop offset="0" stop-color="#0033FF" stop-opacity="0.45" />
        <stop offset="0.6" stop-color="#A51FFF" stop-opacity="0.35" />
        <stop offset="1" stop-color="#A51FFF" stop-opacity="0" />
      </radialGradient>
      <filter id="orb-blur" x="0" y="0" width="527" height="527" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur stdDeviation="54" result="effect1_foregroundBlur" />
      </filter>
    </defs>
  </svg>
</template>
