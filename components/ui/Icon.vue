<template>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    :class="[props.className]"
  >
    <!-- Sparkles -->
    <template v-if="name === 'sparkles'">
      <path d="M12 3v6m0 0v6M3 12h6m0 0h6M5.64 5.64l4.24 4.24m0 0l4.24 4.24M5.64 18.36l4.24-4.24m0 0l4.24-4.24" />
    </template>

    <!-- Arrow Right -->
    <template v-if="name === 'arrow-right'">
      <path d="M5 12h14m-7-7l7 7-7 7" />
    </template>

    <!-- Plus -->
    <template v-if="name === 'plus'">
      <path d="M12 5v14m-7-7h14" />
    </template>

    <!-- Download -->
    <template v-if="name === 'download'">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m7-8l-4 4m0 0l4 4m-4-4h12" />
    </template>

    <!-- Trash -->
    <template v-if="name === 'trash'">
      <path d="M3 6h18m0 0v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-6 5v6m4-6v6" />
    </template>

    <!-- Upload -->
    <template v-if="name === 'upload'">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m17-8l-5-5m0 0l-5 5m5-5v12" />
    </template>

    <!-- Folder -->
    <template v-if="name === 'folder'">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </template>

    <!-- Arrow Left -->
    <template v-if="name === 'arrow-left'">
      <path d="M19 12H5m7-7l-7 7 7 7" />
    </template>

    <!-- Comments -->
    <template v-if="name === 'comments'">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2zM3 9h2m-2 3h2m17-6h-2m2 3h-2m-8-9h2m-2 3h2" />
    </template>

    <!-- Wand Magic Sparkles -->
    <template v-if="name === 'wand-magic'">
      <path d="M15 4V2m0 2a13 13 0 0 1 8.5 4.5M15 4a13 13 0 0 0-8.5 4.5m0 0L5 3M7.5 8.5L4 5m0 0v6m0 0h6m10 0v6m0 0h6m-6-6V8.5m0 0l3.5 3.5" />
    </template>

    <!-- Eye -->
    <template v-if="name === 'eye'">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </template>

    <!-- Save -->
    <template v-if="name === 'save'">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zm-3-8h-6m0 0v6m0-6l-5-5m5 5v6" />
    </template>

    <!-- File Markdown -->
    <template v-if="name === 'file-markdown'">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <polyline points="13 2 13 9 20 9" />
      <path d="M8 15h1m1 0h1M9 13h1m1 0h1M8 17h1m1 0h1" />
    </template>

    <!-- File PDF -->
    <template v-if="name === 'file-pdf'">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <polyline points="13 2 13 9 20 9" />
      <text x="9" y="18" font-size="6" fill="currentColor">PDF</text>
    </template>

    <!-- Key -->
    <template v-if="name === 'key'">
      <path d="M21 2l-9.6 9.6a6 6 0 1 0 3 3L21 5m-9 13.4A5.98 5.98 0 0 0 17 13" />
    </template>

    <!-- Lightbulb -->
    <template v-if="name === 'lightbulb'">
      <path d="M9 18.5c0 .83.67 1.5 1.5 1.5h3c.83 0 1.5-.67 1.5-1.5v-1H9v1zM6 12c0 3.31 2.69 6 6 6s6-2.69 6-6M12 2c-5.33 4.55-8 7.64-8 10v1h16v-1c0-2.36-2.67-5.45-8-10z" />
    </template>

    <!-- Times/Close -->
    <template v-if="name === 'times'">
      <path d="M18 6L6 18M6 6l12 12" />
    </template>

    <!-- Check -->
    <template v-if="name === 'check'">
      <path d="M20 6L9 17l-5-5" />
    </template>

    <!-- User -->
    <template v-if="name === 'user'">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </template>

    <!-- Settings -->
    <template v-if="name === 'settings'">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6m-14.78 7.78l4.24-4.24m5.08-5.08l4.24-4.24" />
    </template>

    <!-- Dashboard -->
    <template v-if="name === 'dashboard'">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </template>

    <!-- Briefcase -->
    <template v-if="name === 'briefcase'">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </template>

    <!-- Default fallback -->
    <template v-if="!isValidIcon">
      <circle cx="12" cy="12" r="10" />
    </template>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  name: string
  size?: number
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  className: ''
})

const validIcons = [
  'sparkles', 'arrow-right', 'plus', 'download', 'trash', 'upload',
  'folder', 'arrow-left', 'comments', 'wand-magic', 'eye', 'save',
  'file-markdown', 'file-pdf', 'key', 'lightbulb', 'times', 'check',
  'user', 'settings', 'dashboard', 'briefcase'
]

const isValidIcon = computed(() => validIcons.includes(props.name))
</script>
