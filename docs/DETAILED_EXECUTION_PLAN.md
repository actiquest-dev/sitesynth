# Детальный план внедрения — шаг за шагом

**Дата**: 2026-03-25
**Статус**: 85% готово, остаток 2.5 часа работы
**Приоритет**: Figma Track (build-from-contract.ts) — это недостающая ветка

---

## Phase 0: Quick Wins (Shared Schema + CSS new 2025) — 30 мин

### [0.1] Обновить Shared Contract Schema в artDirectorAgent

**Файл**: `server/agents/index.ts` lines 157-265

**Что сейчас** (ПРОБЛЕМЫ):
```javascript
// Lines 224-235: Вольные строки — любой LLM интерпретирует по-своему
"composition": "full-bleed-centered | split-image-text | grid-cards | stacked-editorial | ...",
"visual_weight": "heavy | medium | light",
"background_treatment": "gradient | solid | image | pattern",
"style": "floating-glass | sticky-solid | minimal-inline",
"icon_style": "emoji | svg-outline | filled-circle",
```

**Что нужно** (РЕШЕНИЕ):
Заменить все вольные описания на **структурированные JSON объекты** чтобы это было однозначно.

**Шаг 1.1 — Вставить в artDirectorAgent промпт (после line 162)**:

```javascript
// Добавить этот раздел сразу после "Never use vague phrases...":

## SHARED CONTRACT SCHEMA — Strict Structure, No Loose Descriptions

Your output MUST use exact structured objects, never loose strings.

### Section Blueprints Structure (REQUIRED)
Each section MUST have this exact structure:
{
  "id": "hero",
  "role": "hero | features | social_proof | pricing | cta | testimonials | footer",
  "headline": "Exact headline text here",
  "subheadline": "Exact subheadline or null",
  "composition": {
    "type": "full-bleed-centered | split-left-right | split-right-left | grid-3-cols | grid-2-cols | stacked | card-grid",
    "ratio": "60-40 | 50-50 | etc",
    "image_position": "left | right | top | bottom | background",
    "text_position": "left | right | top | bottom | center",
    "vertical_align": "top | center | bottom",
    "horizontal_align": "left | center | right",
    "gap": "clamp(...) or px value"
  },
  "visual_weight": 1-5,  // 1=light, 5=heavy (use number not string)
  "background_treatment": {
    "type": "solid | gradient | image | pattern",
    "color": "#hex if solid",
    "gradient": "linear-gradient(...) if gradient",
    "image_url": "url if image",
    "opacity": 0.0-1.0
  },
  "content_density": 1-5,  // 1=sparse, 5=dense (use number not string)
  "copy": {
    "headline": "Exact text from brief or product",
    "body": "Exact body copy, full sentences, not Lorem ipsum",
    "cta_label": "Call-to-action text or null",
    "supporting_items": ["Feature 1", "Feature 2", "Feature 3"]
  },
  "key_elements": ["element type 1", "element type 2"],
  "interactions": [
    {
      "target": "element selector or class",
      "trigger": "hover | scroll | click | focus",
      "action": "css class to apply | animation name",
      "effect": "description of visual change"
    }
  ]
}

### Component Recipes Structure (REQUIRED)
{
  "nav": {
    "type": "sticky-with-blur | fixed-solid | minimal-inline",
    "background": { "type": "solid", "color": "#hex", "opacity": 0.95 },
    "blur": "20px | null",
    "items": [
      { "label": "Home", "href": "#hero", "type": "link" },
      { "label": "Features", "href": "#features", "type": "link" },
      { "label": "CTA", "href": "#cta", "type": "button", "style": "primary" }
    ],
    "layout": "flex | grid",
    "padding": "16px 24px",
    "gap": "32px",
    "height": "64px"
  },
  "hero": {
    "layout_type": "centered-stack | split-left-right | split-right-left | full-bleed-video",
    "has_image": true | false,
    "image_treatment": "gradient-overlay | masked | floating | none",
    "image_position": "left | right | background",
    "min_height": "600px | 80vh",
    "padding": "clamp(20px, 5vw, 80px)"
  },
  "feature_card": {
    "style": "bordered | elevated | flat | ghosted",
    "border_width": 1,
    "border_color": "#hex",
    "icon": {
      "type": "emoji | svg-outline | svg-filled | illustration",
      "size": "48px | 64px | 80px"
    },
    "has_hover": true,
    "hover_effect": "lift | color-shift | scale | underline-slide",
    "padding": "24px",
    "gap": "16px"
  },
  "cta_button": {
    "style": "solid-primary | solid-secondary | outline | ghost | gradient",
    "padding": "12px 24px",
    "font_size": "16px",
    "font_weight": 600,
    "border_radius": "6px | 8px | 12px | full",
    "hover_effect": {
      "background": "#hex-darker",
      "transform": "translateY(-2px)",
      "box_shadow": "0 12px 24px rgba(0,0,0,0.15)"
    },
    "transition": "0.3s cubic-bezier(0.4, 0, 0.2, 1)"
  },
  "footer": {
    "style": "minimal-centered | multi-column | dark-branded",
    "columns": [
      { "title": "Company", "links": ["About", "Blog", "Careers"] },
      { "title": "Product", "links": ["Features", "Pricing", "Docs"] }
    ],
    "background": "#hex",
    "padding": "80px 40px 40px"
  }
}

### Interactions Structure (REQUIRED)
[
  {
    "id": "nav-blur-on-scroll",
    "target": "nav",
    "trigger": "scroll",
    "condition": "scrollY > 100",
    "css_new_feature": "scroll-state-queries | none",
    "action": {
      "apply_styles": {
        "backdrop_filter": "blur(20px)",
        "background": "rgba(10, 10, 15, 0.95)"
      },
      "animation": "fadeIn 0.3s"
    }
  },
  {
    "id": "card-stagger-animation",
    "target": ".feature-card",
    "trigger": "page-load",
    "css_new_feature": "sibling-index",
    "action": {
      "animation": "slideUp 0.5s ease-out",
      "animation_delay": "calc(sibling-index() * 0.1s)"
    }
  }
]

RULES:
- EVERY field must be a specific value or object, never a loose description
- Numbers not strings: use 1-5 scales, not "light | medium | heavy"
- Colors ALWAYS hex: "#0A0A0F", never "dark gray"
- Sizes ALWAYS CSS: "12px", "clamp(...)", "80vh", never "medium size"
- Positions ALWAYS specific: "left", "center", "right", never "somewhere"
- Text ALWAYS exact: Real product copy, not placeholders
- No guessing: Every field is deterministic input for demoBuilderAgent
```

**Шаг 1.2 — Обновить schema definition** (lines 238-252):

Добавить в `section_blueprints` Zod schema:

```javascript
composition: z.object({
  type: z.enum(['full-bleed-centered', 'split-left-right', 'split-right-left', 'grid-3-cols', 'grid-2-cols', 'stacked', 'card-grid']),
  ratio: z.string().optional(),
  image_position: z.enum(['left', 'right', 'top', 'bottom', 'background']).optional(),
  text_position: z.enum(['left', 'right', 'top', 'bottom', 'center']).optional(),
  vertical_align: z.enum(['top', 'center', 'bottom']).optional(),
  horizontal_align: z.enum(['left', 'center', 'right']).optional(),
  gap: z.string().optional(),
}),
visual_weight: z.number().min(1).max(5),
background_treatment: z.object({
  type: z.enum(['solid', 'gradient', 'image', 'pattern']),
  color: z.string().optional(),
  gradient: z.string().optional(),
  opacity: z.number().optional(),
}),
content_density: z.number().min(1).max(5),
interactions: z.array(z.object({
  target: z.string(),
  trigger: z.enum(['hover', 'scroll', 'click', 'focus']),
  action: z.string(),
  effect: z.string(),
})).optional(),
```

**Шаг 1.3 — Обновить component_recipes schema** (lines 238-243):

```javascript
component_recipes: z.object({
  nav: z.object({
    type: z.enum(['sticky-with-blur', 'fixed-solid', 'minimal-inline']),
    background: z.object({
      type: z.literal('solid'),
      color: z.string(),
      opacity: z.number().optional(),
    }),
    blur: z.string().optional(),
    items: z.array(z.object({
      label: z.string(),
      href: z.string(),
      type: z.enum(['link', 'button']),
      style: z.enum(['primary', 'secondary', 'ghost']).optional(),
    })),
    layout: z.enum(['flex', 'grid']),
    padding: z.string(),
    gap: z.string(),
    height: z.string(),
  }),
  // ... аналогично для hero, feature_card, cta_button, footer
}).optional(),
```

**Время**: 15 минут
**Проверка**: При генерации art direction должны видеть структурированные объекты, не строки.

---

### [0.2] Добавить CSS new 2025 в demoBuilderAgent

**Файл**: `server/agents/index.ts` lines 267-361

**Что сейчас** (есть):
- 7-layer CSS architecture (lines 282-315)
- Responsive design с clamp()
- Semantic HTML
- Visual quality rules

**Что добавить**:
Раздел с CSS new 2025 фичами (Chrome 131+).

**Шаг 2.1 — Добавить раздел в промпт** (после line 350, перед "JSON only"):

```javascript
## CSS NEW 2025 FEATURES (Chrome 131+)

If Art Direction Contract specifies css_new_features array, IMPLEMENT each one:

### 1. scroll-state-queries (@container scroll-state)
For sticky nav, blur on scroll:
@container scroll-state(stuck: top) {
  nav {
    backdrop-filter: blur(20px);
    background: rgba(10, 10, 15, 0.95);
  }
}

### 2. sibling-index() (staggered animations)
For card animation delays:
.feature-card {
  animation: slideUp 0.5s ease-out;
  animation-delay: calc(sibling-index() * 0.1s);
}

### 3. invoker-commands (no onclick needed)
For modal triggers, button-dialog interaction:
<button commandfor="modal-id" command="show-modal">
  Open Modal
</button>
<dialog id="modal-id">
  <form method="dialog">
    <!-- content -->
  </form>
</dialog>

### 4. customizable-select (styled dropdown)
For select elements with custom styling:
<select>
  <option><span class="icon">🚀</span> Option 1</option>
  <option><span class="icon">⭐</span> Option 2</option>
</select>

select::picker(select) {
  background: var(--surface);
  color: var(--text-primary);
}

select::backdrop {
  background: rgba(0, 0, 0, 0.3);
}

### 5. corner-shape (squircle, notch, scoop)
For organic rounded corners:
.button {
  corner-shape: squircle;
  border-radius: 12px;  /* fallback for older browsers */
}

### 6. shape() (complex clipping)
For hero section with custom clip path:
.hero-image {
  clip-path: shape(from 0 0, line to 100% 0, curve to 100% 80% via 50% 100%, line to 0 80%);
}

### 7. popover=hint (tooltips without JS)
For help text, info tooltips:
<button popovertarget="info-tip">
  Help?
</button>
<div id="info-tip" popover="hint">
  This is helpful information
</div>

### 8. stretch keyword (width: stretch)
Instead of width: 100%, use stretch:
.container {
  width: stretch;  /* respects margins unlike 100% */
  max-width: 1200px;
}

### 9. text-box (optical text centering)
For perfect text alignment:
h1 {
  text-box: trim-both cap alphabetic;
}

### 10. CSS if() (conditional styling)
For dynamic styling based on context:
.card {
  background: if(style(--theme: dark), var(--surface), white);
  color: if(style(--high-contrast: true), black, var(--text-primary));
}

IMPLEMENTATION RULES:
- Check Art Direction Contract.css_new_features array
- For EACH feature in the array, MUST implement it exactly as specified
- Use feature EXACTLY where specified in the contract (e.g., "nav sticky effect" → scroll-state-queries on nav)
- Include fallbacks for older browsers (e.g., border-radius alongside corner-shape)
- Minimum 5 CSS new features per site if available in contract
- Do NOT use CSS new features not specified in the contract
- All features MUST work in Chrome 131+, Safari 17.2+, Firefox 129+
```

**Шаг 2.2 — Обновить вывод** (lines 273-279):

Добавить в JSON output:
```javascript
const buildSchema = z.object({
  title: z.string(),
  slug: z.string().optional(),
  html: z.string(),
  css: z.string(),
  notes: z.array(z.string()).optional(),
  css_new_features_used: z.array(z.string()).optional(),  // ← ДОБАВИТЬ
})
```

**Шаг 2.3 — Обновить финальный вывод** (lines 88-99):

```javascript
// Перед return, добавить:
if (output?.css_new_features_used?.length === 0) {
  console.warn('Warning: No CSS new 2025 features used. Check contract.css_new_features array.')
}

return {
  success: true,
  data: {
    ...finalOutput,
    css_new_features_used: output?.css_new_features_used || [],  // ← ДОБАВИТЬ
  },
}
```

**Время**: 15 минут
**Проверка**: При генерации сайта должны видеть CSS new 2025 фичи (scroll-state-queries, sibling-index, etc.) в выводе.

---

## Phase 1: Figma Track 2 (Build Design System) — 2 часа 10 минут

Это **главное** что осталось. Demo track готов, но без Figma дизайн-системы.

### [1.1] Создать `server/api/figma/build-from-contract.ts` — 60 минут

**Файл**: Создать новый `/Users/miguelaprossine/synth/sitesynth/server/api/figma/build-from-contract.ts`

**Логика**:
1. POST request с { briefId, token }
2. Fetch финальный art_direction из briefs
3. Fetch demo build artifacts (HTML/CSS для reference)
4. Через Cline запустить Figma MCP построение Design System
5. Сохранить figma_file_url в briefs
6. Return { success, figmaUrl, components, variables, styles }

**Шаг 1.1.1 — Создать базовую структуру**:

```typescript
// server/api/figma/build-from-contract.ts

import { defineEventHandler, readBody, getHeader } from 'h3'
import { z } from 'zod'
import { useDatabaseClient } from '~~/server/utils/supabase'
import { getFigmaBuildToken } from '~~/server/utils/figma-build-token'

/**
 * Build Figma Design System from finalized Art Direction Contract
 * POST /api/figma/build-from-contract
 *
 * After demo build completes with critic passed, this endpoint:
 * 1. Takes the final art_direction_json from briefs
 * 2. Uses Figma MCP Server (use_figma tool) to create Design System
 * 3. Creates:
 *    - Page: "Design System" with tokens, components, styles
 *    - Page: "Mockup" with full page layout
 * 4. Returns figma_file_url for client to view/edit
 */

export default defineEventHandler(async (event) => {
  // 1. AUTH
  const userEmail = getHeader(event, 'x-user-email')
  if (!userEmail) {
    return { success: false, error: 'Unauthorized: missing x-user-email' }
  }

  // 2. PARSE REQUEST
  const body = await readBody(event)
  const { briefId, token } = body

  if (!briefId || !token) {
    return { success: false, error: 'briefId and token required' }
  }

  // Verify token (optional but secure)
  // const expectedToken = getFigmaBuildToken()
  // if (token !== expectedToken) return { success: false, error: 'Invalid token' }

  try {
    const db = useDatabaseClient()

    // 3. FETCH BRIEF WITH ART DIRECTION
    const { data: brief, error: briefError } = await db
      .from('briefs')
      .select(`
        id,
        user_email,
        brief_data,
        art_direction_json,
        art_direction_version
      `)
      .eq('id', briefId)
      .eq('user_email', userEmail)
      .maybeSingle()

    if (briefError || !brief) {
      return { success: false, error: 'Brief not found or access denied' }
    }

    if (!brief.art_direction_json) {
      return { success: false, error: 'No art direction contract found. Run demo build first.' }
    }

    const artDirection = brief.art_direction_json

    // 4. FETCH DEMO BUILD ARTIFACTS (для reference)
    const { data: demoBuild } = await db
      .from('demo_build_jobs')
      .select('result_json, workspace_path, target_url')
      .eq('brief_id', briefId)
      .eq('current_stage', 'complete')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    // 5. BUILD FIGMA DESIGN SYSTEM
    // Логика:
    // - Через Cline + Figma MCP Server создаём Design System
    // - Используем artDirection как source of truth
    // - Результат: figma file с компонентами, переменными, стилями

    const figmaDesignSystem = await buildFigmaDesignSystem(
      artDirection,
      brief.brief_data,
      demoBuild?.result_json
    )

    if (!figmaDesignSystem.success) {
      return {
        success: false,
        error: `Figma build failed: ${figmaDesignSystem.error}`,
      }
    }

    // 6. SAVE FIGMA URL TO BRIEF
    const { error: updateError } = await db
      .from('briefs')
      .update({
        figma_file_url: figmaDesignSystem.figmaFileUrl,
        figma_design_system_json: figmaDesignSystem.designSystem,
        updated_at: new Date().toISOString(),
      })
      .eq('id', briefId)

    if (updateError) {
      console.error('Failed to save figma URL:', updateError)
      return { success: false, error: 'Failed to save figma URL to database' }
    }

    // 7. LOG EVENT
    await db.from('figma_build_events').insert({
      brief_id: briefId,
      level: 'info',
      stage: 'build-from-contract',
      message: 'Design System built from art direction contract',
      payload: {
        figmaFileUrl: figmaDesignSystem.figmaFileUrl,
        components: figmaDesignSystem.designSystem?.components?.length || 0,
        variables: figmaDesignSystem.designSystem?.variables?.length || 0,
      },
    })

    return {
      success: true,
      data: {
        briefId,
        figmaFileUrl: figmaDesignSystem.figmaFileUrl,
        designSystem: {
          components: figmaDesignSystem.designSystem?.components?.map(c => c.name) || [],
          variables: figmaDesignSystem.designSystem?.variables?.map(v => v.name) || [],
          styles: figmaDesignSystem.designSystem?.styles?.map(s => s.name) || [],
          pages: figmaDesignSystem.designSystem?.pages || [],
        },
        artDirectionVersion: brief.art_direction_version,
      },
    }
  } catch (error: any) {
    console.error('build-from-contract error:', error)
    return {
      success: false,
      error: error?.message || 'Unknown error',
    }
  }
})

// ============================================================================
// HELPER: Build Figma Design System
// ============================================================================

interface FigmaDesignSystemResult {
  success: boolean
  error?: string
  figmaFileUrl?: string
  designSystem?: {
    components: Array<{ name: string; id: string }>
    variables: Array<{ name: string; id: string }>
    styles: Array<{ name: string; id: string }>
    pages: string[]
  }
}

async function buildFigmaDesignSystem(
  artDirection: any,
  briefData: any,
  demoArtifacts?: any
): Promise<FigmaDesignSystemResult> {
  /**
   * This function orchestrates Figma MCP Server calls via Cline
   *
   * Steps:
   * 1. Create Figma file in team workspace
   * 2. Create "Design System" page
   * 3. Create Variables (colors, typography, spacing)
   * 4. Create Components (nav, hero, cards, buttons, footer)
   * 5. Create Styles (text styles, color styles, effects)
   * 6. Create "Mockup" page with full layout from section_blueprints
   * 7. Return figmaFileUrl
   */

  try {
    // For now: return placeholder
    // Will be implemented with actual Figma MCP calls

    const projectName = briefData?.project_name || 'Design System'
    const figmaFileName = `${projectName} - Design System`

    // Placeholder: In reality, this calls Figma MCP Server use_figma tool
    const figmaFileUrl = `https://figma.com/design/YOUR_FILE_ID/${figmaFileName}`

    return {
      success: true,
      figmaFileUrl,
      designSystem: {
        components: [
          { name: 'Nav', id: 'comp-nav' },
          { name: 'Hero', id: 'comp-hero' },
          { name: 'FeatureCard', id: 'comp-feature-card' },
          { name: 'CTAButton', id: 'comp-cta-button' },
          { name: 'Footer', id: 'comp-footer' },
        ],
        variables: [
          { name: 'Colors/Background', id: 'var-bg' },
          { name: 'Colors/Text', id: 'var-text' },
          { name: 'Typography/Heading', id: 'var-heading' },
          { name: 'Spacing/Section', id: 'var-spacing' },
        ],
        styles: [
          { name: 'Text/Heading', id: 'style-heading' },
          { name: 'Color/Accent', id: 'style-accent' },
        ],
        pages: ['Design System', 'Mockup'],
      },
    }
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Failed to build Figma design system',
    }
  }
}
```

**Шаг 1.1.2 — Добавить миграцию для figma_build_events** (если её нет):

Проверить есть ли таблица:
```sql
-- supabase/migrations/20260325_figma_build_events.sql
CREATE TABLE IF NOT EXISTS figma_build_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brief_id uuid REFERENCES briefs(id) ON DELETE CASCADE,
  level text,
  stage text,
  message text,
  payload jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_figma_build_events_brief ON figma_build_events(brief_id);
```

**Шаг 1.1.3 — Добавить колонки в briefs**:

Проверить что есть:
```sql
-- supabase/migrations/20260325_figma_urls_in_briefs.sql
ALTER TABLE briefs
  ADD COLUMN IF NOT EXISTS figma_file_url text,
  ADD COLUMN IF NOT EXISTS figma_design_system_json jsonb;
```

**Время**: 60 минут (большая часть — это интеграция с Figma MCP, которая будет в Phase 1.3)

**Статус после этого шага**: Endpoint существует и может быть вызван, но логика создания компонентов в Figma будет реализована в следующем шаге через figma-builder.js.

---

### [1.2] Обновить figma build инициализацию — 10 минут

**Файл**: `server/api/figma/build.ts`

**Что изменить** (добавить проверки):

```typescript
// В конце build.ts, перед вставкой в БД (lines ~65-75):

// Проверить что demo build завершился и critic passed
const { data: demoBuild } = await db
  .from('demo_build_jobs')
  .select('id, current_stage, critic_passed')
  .eq('brief_id', briefId)
  .order('created_at', { ascending: false })
  .limit(1)
  .maybeSingle()

if (!demoBuild) {
  return { success: false, error: 'No demo build found. Build demo site first.' }
}

if (demoBuild.current_stage !== 'complete') {
  return { success: false, error: `Demo build not complete. Current stage: ${demoBuild.current_stage}` }
}

if (!demoBuild.critic_passed) {
  return { success: false, error: 'Demo build did not pass critic review. Cannot proceed to Figma.' }
}

// Добавить в spec_snapshot финальный art_direction
const specSnapshot = {
  ...build_contract.spec_snapshot,
  art_direction_json: brief.art_direction_json,
  art_direction_version: brief.art_direction_version,
  demo_build_url: demoBuild.target_url,  // reference to built site
  demo_artifacts: demoBuild.result_json,  // HTML/CSS for reference
}

// Вставить job
const { data: job, error } = await db
  .from('figma_build_jobs')
  .insert({
    // ... existing fields ...
    spec_snapshot: specSnapshot,  // ← updated
    stage: 'figma-build-from-contract',
  })
```

**Время**: 10 минут

---

### [1.3] Обновить figma-builder.js для Figma MCP — 45 минут

**Файл**: `workers/figma-builder.js`

**Текущее состояние** (lines 1-282): Вызывает `/figma/build/plan`, но это плацебо.

**Что нужно**: Реально создавать Design System в Figma через MCP.

**Шаг 1.3.1 — Добавить Figma MCP логику**:

```javascript
// workers/figma-builder.js

// В начало файла добавить:
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// ============================================================================
// FIGMA MCP EXECUTION
// ============================================================================

/**
 * Execute Figma MCP commands to build Design System
 * Uses Cline + Figma MCP Server (use_figma tool)
 */
async function buildDesignSystemViaFigmaMCP(job, artDirection, briefData) {
  const projectName = briefData?.project_name || 'Design System'
  const fileName = `${projectName} - Design System`

  // Build prompt for Cline to use Figma MCP
  const clinePrompt = `
You have access to Figma MCP Server with use_figma tool.

Build a comprehensive Design System in Figma:

Project: ${fileName}

Art Direction:
${JSON.stringify(artDirection, null, 2)}

STEPS:
1. Use use_figma to create a new Figma file named "${fileName}"
2. Create page "Design System":
   - Create variables (colors, typography, spacing) from color_system
   - Create text styles from typography.scale
   - Create components from component_recipes (nav, hero, cards, buttons, footer)
3. Create page "Mockup":
   - Build full page layout from section_blueprints
   - Use components created in Design System
4. Return the Figma file URL

Return JSON: { success: true, figmaFileUrl: "https://figma.com/...", components: [...], variables: [...] }
  `.trim()

  // Write prompt to temp file
  const promptFile = \`/tmp/figma-cline-prompt-\${job.id}.txt\`
  fs.writeFileSync(promptFile, clinePrompt)

  // Execute via Cline
  try {
    const { stdout, stderr } = await execPromise(
      \`cline --prompt-file "\${promptFile}" --timeout 600\`,
      { maxBuffer: 10 * 1024 * 1024 }
    )

    if (stderr) {
      console.error('[figma-builder] Cline stderr:', stderr)
    }

    const result = JSON.parse(stdout.trim())
    return result
  } catch (error) {
    console.error('[figma-builder] Cline execution failed:', error)
    throw error
  } finally {
    // Clean up
    try { fs.unlinkSync(promptFile) } catch (e) {}
  }
}

// ============================================================================
// MAIN LOOP (updated)
// ============================================================================

async function runLoop() {
  while (true) {
    try {
      // Claim next job
      const nextJob = await apiGet('/figma/build/next', {
        worker_id: WORKER_ID,
      })

      if (!nextJob.success || !nextJob.data) {
        await sleep(5000)
        continue
      }

      const job = nextJob.data
      console.log(\`[figma-builder] Claimed job \${job.id} (stage: \${job.current_stage})\`)

      // Load full job details
      const spec = job.spec_snapshot || {}
      const artDirection = spec.art_direction_json
      const briefData = spec.brief

      if (!artDirection) {
        await apiPost('/figma/build/event', {
          job_id: job.id,
          level: 'error',
          stage: 'build',
          message: 'Missing art_direction_json in spec_snapshot',
        })

        await apiPost('/figma/build/complete', {
          job_id: job.id,
          status: 'failed',
          error: 'Missing art direction',
        })
        continue
      }

      // BUILD DESIGN SYSTEM VIA FIGMA MCP
      try {
        const result = await buildDesignSystemViaFigmaMCP(job, artDirection, briefData)

        if (!result.success) {
          throw new Error(result.error || 'Figma build failed')
        }

        // Log success
        await apiPost('/figma/build/event', {
          job_id: job.id,
          level: 'info',
          stage: 'build',
          message: 'Design System created successfully',
          payload: {
            figmaFileUrl: result.figmaFileUrl,
            components: result.components?.length || 0,
            variables: result.variables?.length || 0,
          },
        })

        // Complete job
        await apiPost('/figma/build/complete', {
          job_id: job.id,
          status: 'published',
          figma_file_url: result.figmaFileUrl,
          result_json: {
            figmaFileUrl: result.figmaFileUrl,
            components: result.components || [],
            variables: result.variables || [],
            styles: result.styles || [],
          },
        })

        console.log(\`[figma-builder] ✓ Job \${job.id} completed: \${result.figmaFileUrl}\`)
      } catch (buildError) {
        console.error(\`[figma-builder] Build failed for job \${job.id}:\`, buildError)

        await apiPost('/figma/build/event', {
          job_id: job.id,
          level: 'error',
          stage: 'build',
          message: \`Build error: \${buildError.message}\`,
        })

        await apiPost('/figma/build/complete', {
          job_id: job.id,
          status: 'failed',
          error: buildError.message,
        })
      }

      // Small delay before next job
      await sleep(1000)
    } catch (error) {
      console.error('[figma-builder] Loop error:', error)
      await sleep(5000)
    }
  }
}

// Start the loop
runLoop().catch(console.error)
```

**Время**: 45 минут

---

### [1.4] Исправить import ошибки в figma endpoints — 5 минут

**Файлы** (4 файла):
1. `server/api/figma/build/next.ts` — добавить `import { setHeader } from 'h3'`
2. `server/api/figma/build/complete.ts` — добавить `import { setHeader } from 'h3'`
3. `server/api/figma/build/status.ts` — добавить `import { getHeader } from 'h3'`
4. `server/api/figma/build/event.ts` — добавить `import { setHeader } from 'h3'`

**Пример** (в каждом файле):

```typescript
// В начало файла:
- import { defineEventHandler, readBody } from 'h3'
+ import { defineEventHandler, readBody, setHeader, getHeader } from 'h3'
```

**Время**: 5 минут (простой find-replace)

---

## Phase 2: Polish + Testing — 20 минут

### [2.1] (Опционально) Обновить criticAgent — 10 минут

**Статус**: criticAgent уже используется в demo-builder.js с полным промптом (lines 232-265).

Если хотите обновить в agents/index.ts для консистентности:

```typescript
export const criticAgent = new Agent({
  name: 'Art Director - Critic',
  instructions: `
You are a Senior UI/UX designer evaluating a generated website.

EVALUATE against Art Direction Contract (0-5 scale per criterion):
1. COLOR_FIDELITY: Do colors match contract.color_system hex values?
2. TYPOGRAPHY_QUALITY: Do fonts, sizes, line-heights match contract.typography.scale?
3. SPACING_RHYTHM: Do sections breathe? Do gaps match clamp() values?
4. COMPONENT_QUALITY: Nav, hero, cards, buttons, footer match component_recipes?
5. VISUAL_HIERARCHY: Clear what's important?
6. HOVER_INTERACTIONS: Have hover effects from interactions array?
7. RESPONSIVE_FEEL: Works on 375px screens?
8. CSS_NEW_USAGE: Uses CSS new 2025 features specified in contract?
9. OVERALL_IMPRESSION: Looks like top agency work?
10. ANTI_PATTERN_CHECK: Free from contract.anti_patterns?

Return JSON: { score: 0-5, passed: boolean, issues: [...], fixInstructions: [...] }
  `.trim(),
  model: google('gemini-2.5-pro'),
})
```

**Время**: 10 минут

### [2.2] Smoke тесты — 10 минут

**Тест 1**: Generate art direction
```bash
curl -X POST http://localhost:3000/api/briefs/generate-art-direction \
  -H "Content-Type: application/json" \
  -H "x-user-email: test@example.com" \
  -d '{"briefId": "your-brief-id"}'
# ✓ Should return versioned art direction with structured schema
```

**Тест 2**: Queue demo build
```bash
curl -X POST http://localhost:3000/api/demo/build \
  -H "Content-Type: application/json" \
  -H "x-user-email: test@example.com" \
  -d '{"briefId": "your-brief-id"}'
# ✓ Should create job, wait for demo-builder.js to complete
```

**Тест 3**: Build from contract
```bash
curl -X POST http://localhost:3000/api/figma/build-from-contract \
  -H "Content-Type: application/json" \
  -H "x-user-email: test@example.com" \
  -d '{"briefId": "your-brief-id", "token": "your-token"}'
# ✓ Should return figma_file_url after Cline creates Design System
```

**Время**: 10 минут (или больше если есть ошибки)

---

## Summary Timeline

| Phase | Task | Time |
|-------|------|------|
| **0.1** | Shared Contract Schema (artDirector) | 15 min |
| **0.2** | CSS new 2025 (demoBuilder) | 15 min |
| **1.1** | build-from-contract.ts | 60 min |
| **1.2** | figma build.ts updates | 10 min |
| **1.3** | figma-builder.js MCP | 45 min |
| **1.4** | Import fixes (4 files) | 5 min |
| **2.1** | criticAgent polish | 10 min |
| **2.2** | Smoke тесты | 10 min |
| **TOTAL** | | **170 min = 2h 50min** |

**Рекомендуемый порядок**:
1. Phase 0 (30 min) — quick wins, улучшают качество контрактов
2. Phase 1 (120 min) — главное, Figma track, делай параллельно где можно
3. Phase 2 (20 min) — polish + проверка

**Начинать**:
- [0.1] и [0.2] можно делать одновременно
- [1.1] создать структуру
- [1.2] добавить проверки
- [1.3] добавить MCP логику
- [1.4] fix imports
- [2.1 + 2.2] финал
