<template>
  <div v-if="isClient" class="rich-text-editor">
    <div class="editor-toolbar mb-3 flex gap-2 flex-wrap">
      <button
        @click="() => editor?.chain().focus().toggleBold().run()"
        :disabled="!editor?.can().chain().focus().toggleBold().run()"
        :class="editor?.isActive('bold') ? 'bg-[#8D35FF] text-white' : 'bg-[#1a1a1a] text-[#999]'"
        class="px-3 py-1.5 rounded-none border border-[#333] text-sm hover:bg-[#333] transition"
        title="Bold (Ctrl+B)"
      >
        <strong>B</strong>
      </button>

      <button
        @click="() => editor?.chain().focus().toggleItalic().run()"
        :disabled="!editor?.can().chain().focus().toggleItalic().run()"
        :class="editor?.isActive('italic') ? 'bg-[#8D35FF] text-white' : 'bg-[#1a1a1a] text-[#999]'"
        class="px-3 py-1.5 rounded-none border border-[#333] text-sm hover:bg-[#333] transition"
        title="Italic (Ctrl+I)"
      >
        <em>I</em>
      </button>

      <button
        @click="() => editor?.chain().focus().toggleUnderline().run()"
        :disabled="!editor?.can().chain().focus().toggleUnderline().run()"
        :class="editor?.isActive('underline') ? 'bg-[#8D35FF] text-white' : 'bg-[#1a1a1a] text-[#999]'"
        class="px-3 py-1.5 rounded-none border border-[#333] text-sm hover:bg-[#333] transition"
        title="Underline (Ctrl+U)"
      >
        <u>U</u>
      </button>

      <div class="w-px bg-[#333]"></div>

      <button
        @click="() => editor?.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="editor?.isActive('heading', { level: 1 }) ? 'bg-[#8D35FF] text-white' : 'bg-[#1a1a1a] text-[#999]'"
        class="px-3 py-1.5 rounded-none border border-[#333] text-sm hover:bg-[#333] transition"
        title="Heading 1"
      >
        H1
      </button>

      <button
        @click="() => editor?.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="editor?.isActive('heading', { level: 2 }) ? 'bg-[#8D35FF] text-white' : 'bg-[#1a1a1a] text-[#999]'"
        class="px-3 py-1.5 rounded-none border border-[#333] text-sm hover:bg-[#333] transition"
        title="Heading 2"
      >
        H2
      </button>

      <button
        @click="() => editor?.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="editor?.isActive('heading', { level: 3 }) ? 'bg-[#8D35FF] text-white' : 'bg-[#1a1a1a] text-[#999]'"
        class="px-3 py-1.5 rounded-none border border-[#333] text-sm hover:bg-[#333] transition"
        title="Heading 3"
      >
        H3
      </button>

      <div class="w-px bg-[#333]"></div>

      <button
        @click="() => editor?.chain().focus().toggleBulletList().run()"
        :class="editor?.isActive('bulletList') ? 'bg-[#8D35FF] text-white' : 'bg-[#1a1a1a] text-[#999]'"
        class="px-3 py-1.5 rounded-none border border-[#333] text-sm hover:bg-[#333] transition"
        title="Bullet List"
      >
        • List
      </button>

      <button
        @click="() => editor?.chain().focus().toggleOrderedList().run()"
        :class="editor?.isActive('orderedList') ? 'bg-[#8D35FF] text-white' : 'bg-[#1a1a1a] text-[#999]'"
        class="px-3 py-1.5 rounded-none border border-[#333] text-sm hover:bg-[#333] transition"
        title="Ordered List"
      >
        1. List
      </button>

      <button
        @click="() => editor?.chain().focus().toggleCodeBlock().run()"
        :class="editor?.isActive('codeBlock') ? 'bg-[#8D35FF] text-white' : 'bg-[#1a1a1a] text-[#999]'"
        class="px-3 py-1.5 rounded-none border border-[#333] text-sm hover:bg-[#333] transition"
        title="Code Block"
      >
        { } Code
      </button>

      <button
        @click="() => editor?.chain().focus().toggleBlockquote().run()"
        :class="editor?.isActive('blockquote') ? 'bg-[#8D35FF] text-white' : 'bg-[#1a1a1a] text-[#999]'"
        class="px-3 py-1.5 rounded-none border border-[#333] text-sm hover:bg-[#333] transition"
        title="Block Quote"
      >
        " Quote
      </button>

      <div class="w-px bg-[#333]"></div>

      <button
        @click="() => editor?.chain().focus().undo().run()"
        :disabled="!editor?.can().chain().focus().undo().run()"
        class="px-3 py-1.5 rounded-none border border-[#333] bg-[#1a1a1a] text-[#999] text-sm hover:bg-[#333] transition disabled:opacity-50"
        title="Undo (Ctrl+Z)"
      >
        ↶
      </button>

      <button
        @click="() => editor?.chain().focus().redo().run()"
        :disabled="!editor?.can().chain().focus().redo().run()"
        class="px-3 py-1.5 rounded-none border border-[#333] bg-[#1a1a1a] text-[#999] text-sm hover:bg-[#333] transition disabled:opacity-50"
        title="Redo (Ctrl+Y)"
      >
        ↷
      </button>
    </div>

    <EditorContent :editor="editor" />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { watch, onBeforeUnmount, onMounted, ref } from 'vue'

// Prevent SSR issues - only render on client
const isClient = ref(false)
onMounted(() => {
  isClient.value = true
})

interface Props {
  modelValue: string
  disabled?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editor = useEditor({
  extensions: [
    StarterKit.configure({
      paragraph: {
        HTMLAttributes: {
          class: 'mb-2',
        },
      },
      heading: {
        HTMLAttributes: {
          class: 'font-bold mb-2',
        },
      },
      bulletList: {
        HTMLAttributes: {
          class: 'list-disc ml-6 mb-2',
        },
      },
      orderedList: {
        HTMLAttributes: {
          class: 'list-decimal ml-6 mb-2',
        },
      },
      codeBlock: {
        HTMLAttributes: {
          class: 'bg-[#1a1a1a] p-4 rounded-none font-mono text-sm mb-2 border border-[#333]',
        },
      },
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-[#8D35FF] underline cursor-pointer',
      },
    }),
    Underline,
  ],
  editorProps: {
    attributes: {
      class: 'w-full px-4 py-3 bg-[#0f0f0f] border border-[#333] rounded-none text-white placeholder-[#666] focus:border-[#8D35FF] focus:outline-none resize-none font-sans text-sm leading-relaxed min-h-[400px]',
    },
  },
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

// Watch for prop changes
watch(() => {
  // Component will handle this in onMounted/onUpdate
}, { immediate: true })

// Cleanup
onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style scoped>
:deep(.ProseMirror) {
  outline: none;
}

:deep(.ProseMirror p) {
  margin-bottom: 0.5rem;
}

:deep(.ProseMirror h1) {
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  margin-top: 1rem;
  color: #ffffff;
}

:deep(.ProseMirror h2) {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  margin-top: 0.875rem;
  color: #ffffff;
}

:deep(.ProseMirror h3) {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  margin-top: 0.75rem;
  color: #ffffff;
}

:deep(.ProseMirror ul) {
  list-style: disc;
  margin-left: 1.5rem;
  margin-bottom: 0.5rem;
}

:deep(.ProseMirror ol) {
  list-style: decimal;
  margin-left: 1.5rem;
  margin-bottom: 0.5rem;
}

:deep(.ProseMirror li) {
  margin-bottom: 0.25rem;
}

:deep(.ProseMirror pre) {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 0;
  padding: 1rem;
  margin-bottom: 0.5rem;
  overflow-x: auto;
}

:deep(.ProseMirror code) {
  background: #1a1a1a;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-family: monospace;
  font-size: 0.875rem;
  color: #8d35ff;
}

:deep(.ProseMirror pre code) {
  background: none;
  padding: 0;
  color: #888;
}

:deep(.ProseMirror blockquote) {
  border-left: 4px solid #8d35ff;
  padding-left: 1rem;
  margin-left: 0;
  margin-bottom: 0.5rem;
  font-style: italic;
  color: #999;
}

:deep(.ProseMirror hr) {
  border: none;
  border-top: 1px solid #333;
  margin: 1rem 0;
}

:deep(.ProseMirror strong) {
  font-weight: 700;
}

:deep(.ProseMirror em) {
  font-style: italic;
}

:deep(.ProseMirror u) {
  text-decoration: underline;
}

:deep(.ProseMirror a) {
  color: #8d35ff;
  text-decoration: underline;
  cursor: pointer;
}
</style>
