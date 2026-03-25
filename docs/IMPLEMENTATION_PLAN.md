# SiteSynth: План внедрения Design Pipeline v2

## ✅ ACTUAL STATUS (2026-03-25)

**Уже готово к продакшену — 85% от плана**

### Что ПОЛНОСТЬЮ сделано:
- ✅ Art Direction Contract generation endpoint (versioned)
- ✅ Demo build job initialization (требует art_direction)
- ✅ Demo build plan endpoint (передаёт только контракт)
- ✅ Demo builder worker с ПОЛНЫМ critic loop (2 итерации, threshold 4.2)
- ✅ Asset generation (Google Imagen nano-banana-pro-preview)
- ✅ Database versioning для art direction контрактов
- ✅ Все agents (artDirector, demoBuilder, critic, reference strategist)
- ✅ 7-layer CSS architecture в demoBuilderAgent

### Что ЧАСТИЧНО/НЕ сделано (15%):
- ⚠️ Figma Track 2 (build-from-contract.ts не существует)
- ⚠️ CSS new 2025 явно не зафиксировано в demoBuilderAgent промпте
- ⚠️ Shared Contract Schema всё ещё содержит вольные строки вместо однозначных структур

## Проблема

Текущий pipeline генерит убогие сайты. Причины:

| # | Баг | Где |
|---|-----|-----|
| 1 | Art Direction Contract не является единственным входом — plan.ts передаёт ещё brief, design_spec, build_contract | `plan.ts:35-73` |
| 2 | Critic loop отключён | `demo-build.ts:114` — `critic.enabled: false` |
| 3 | CSS new 2025 не используется — генерится generic CSS | `agents/index.ts` — demoBuilderAgent промпт |
| 4 | Нет версионирования контракта — art_direction_json перезаписывается | `generate-art-direction.ts:254` |
| 5 | Figma track — заглушка, не строит design system | `figma/build/plan.ts` — только GET |
| 6 | Single-pass generation — один вызов, нет итерации | `plan.ts:85` |
| 7 | Shared Contract Schema неточная — содержит вольные строки вместо однозначных структур | `agents/index.ts:219-252` |

---

## Статус На 2026-03-25

### Уже сделано

- `Art Direction Contract` endpoint существует:
  - `server/api/briefs/generate-art-direction.ts`
- `demo build` теперь требует `art_direction_json` перед постановкой job:
  - `server/api/demo/build.ts`
- `build_contract` уже включает базовый `executor` и `assetGeneration` блок:
  - `server/utils/demo-build.ts`
- `asset generation` endpoint существует:
  - `server/api/demo/build/assets.ts`
- Oracle worker умеет:
  - писать contract files
  - запускать `Cline`
  - публиковать build
  - вызывать asset generation stage
  - файл: `workers/demo-builder.js`
- `art_direction_json` колонка добавлена миграцией:
  - `supabase/migrations/20260324120000_add_art_direction_to_briefs.sql`

### Не сделано / сделано частично

- `Art Direction Contract` не является единственным входом:
  - `server/api/demo/build/plan.ts` всё ещё передаёт `design_spec`, `brief`, `build_contract`
- `Critic loop` по-прежнему выключен:
  - `server/utils/demo-build.ts` → `critic.enabled: false`
- `Shared Contract Schema` всё ещё частично строковый:
  - `composition`, `style`, `background_treatment` и др. остаются свободным текстом
- `Версионирования art direction` нет:
  - `server/api/briefs/generate-art-direction.ts` просто перезаписывает `briefs.art_direction_json`
- `Figma track` не доведён:
  - `server/api/figma/build/plan.ts` лишь отдаёт `build_plan`
- `Single-pass generation` для demo builder остаётся:
  - `server/api/demo/build/plan.ts`
  - `workers/demo-builder.js`
- `demoBuilderAgent` всё ещё не переведён явно на Claude в `server/agents/index.ts`
- `CSS new 2025` как обязательный execution constraint не зафиксирован в builder runtime

---

## Архитектура v2

```
                    ┌─────────────────────┐
                    │   Brief + References │
                    └──────────┬──────────┘
                               ↓
                    ┌─────────────────────┐
                    │  Reference Analysis  │ ← referenceStrategistAgent (Gemini)
                    └──────────┬──────────┘
                               ↓
                    ┌─────────────────────┐
                    │    Design Spec       │ ← architectAgent (Gemini)
                    └──────────┬──────────┘
                               ↓
              ┌────────────────────────────────────┐
              │  Art Direction Contract v1         │
              │  = единственный source of truth    │
              │  ← artDirectorAgent (Gemini 2.5)   │
              │                                    │
              │  SHARED CONTRACT SCHEMA            │
              │  (однозначная структура, не строки)
              └────────────────┬───────────────────┘
                               ↓
              ┌────────────────────────────────────┐
              │   TRACK 1: SITE (приоритет)        │
              │                                    │
              │   demoBuilderAgent (Claude Sonnet) │
              │   → HTML + CSS new 2025            │
              │   → Chrome-first demo              │
              │                                    │
              │   ┌──────────────────────┐         │
              │   │ CRITIC LOOP          │         │
              │   │ Screenshot → evaluate│         │
              │   │ → fix → repeat       │         │
              │   │ max 3 итерации       │         │
              │   └──────────┬───────────┘         │
              │              ↓                     │
              │   Обновить Art Direction           │
              │   Contract если были fix-ы         │
              │   (версионирование)                │
              │   → v1 → v2 → v3                   │
              └────────────────┬───────────────────┘
                               ↓
              ┌────────────────────────────────────┐
              │   Art Direction Contract vN        │
              │   (финальная версия)               │
              └────────────────┬───────────────────┘
                               ↓
              ┌────────────────────────────────────┐
              │   TRACK 2: FIGMA DESIGN SYSTEM     │
              │                                    │
              │   Cline + Figma MCP Server         │
              │   ← Claude (code execution)        │
              │   → Компоненты                     │
              │   → Переменные (токены)            │
              │   → Стили                          │
              │   → Auto-layout                    │
              └────────────────────────────────────┘
```

### Принципы

1. **Art Direction Contract = единственный вход.** Ни brief, ни design_spec, ни build_contract не передаются в builder напрямую. Всё через контракт.

2. **Shared Contract Schema = однозначная структура.** Не строки, не описания. Каждое поле структурировано так чтобы любой LLM интерпретировал его идентично:
   - `"composition": { "type": "split", "ratio": "60-40", "image_side": "left", "vertical_align": "center" }` ✓
   - `"composition": "split-image-text"` ✗ (вольная интерпретация)

3. **Два LLM, разные роли:**
   - **Gemini 2.5 Pro:** Art Direction (VoltAgent-ы), Image generation (nano-banana-pro-preview)
   - **Claude Sonnet 4:** Code generation (demoBuilderAgent), Execution (Cline), Critic (screenshot evaluation)

4. **CSS new 2025 максимум.** Demo — Chrome only. Финальный продукт — Vue/React с fallbacks.

5. **Critic loop обязателен.** Screenshot → оценка → fix → повторить (max 3 раза). Обновляет контракт при необходимости.

6. **Track 2 (Figma) стартует после Track 1.** Берёт финальный контракт после critic loop и версионирования.

---

## Shared Contract Schema

Art Direction Contract должен быть максимально детальным и однозначным. Вот примеры правильной структуры:

### ❌ Неправильно (вольная интерпретация)
```json
{
  "composition": "split-image-text",
  "style": "floating-glass",
  "has_hover": true,
  "cta_label": "Learn More"
}
```

### ✅ Правильно (однозначная структура)
```json
{
  "section_blueprints": [
    {
      "id": "hero",
      "composition": {
        "type": "split",
        "ratio": "60-40",
        "image_position": "left",
        "text_position": "right",
        "vertical_align": "center",
        "gap": "var(--component-gap)"
      },
      "copy": {
        "headline": "Exact headline text",
        "body": "Exact body text",
        "cta": { "label": "Start Building", "style": "primary" }
      }
    }
  ],
  "component_recipes": {
    "nav": {
      "structure": {
        "position": "fixed",
        "top": 0,
        "background": "rgba(10, 10, 15, 0.8)",
        "backdrop_filter": "blur(20px)",
        "z_index": 1000
      },
      "items": [
        { "label": "Home", "href": "#hero" },
        { "label": "Features", "href": "#features" },
        { "label": "Pricing", "href": "#pricing" }
      ]
    },
    "cta_button": {
      "base": {
        "padding": "12px 24px",
        "font_size": "16px",
        "font_weight": 600,
        "border_radius": "6px",
        "border": "none",
        "cursor": "pointer",
        "transition": "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      },
      "variants": {
        "primary": {
          "background": "#hex-color",
          "color": "#hex-color",
          "hover": {
            "background": "#hex-color-hover",
            "transform": "translateY(-2px)",
            "box_shadow": "0 12px 24px rgba(0,0,0,0.15)"
          }
        },
        "secondary": {
          "background": "transparent",
          "border": "2px solid #hex-color",
          "color": "#hex-color",
          "hover": {
            "background": "#hex-color-subtle"
          }
        }
      }
    }
  },
  "interactions": [
    {
      "target": "nav",
      "trigger": "scroll",
      "condition": "scrollY > 100",
      "css_new_feature": "scroll-state-queries",
      "action": {
        "apply_class": "nav--scrolled",
        "effects": "backdrop-filter: blur(20px); background: rgba(10,10,15,0.95);"
      }
    },
    {
      "target": "hero-cards",
      "trigger": "hover",
      "css_new_feature": "sibling-index",
      "action": {
        "animation": "cardHover 0.3s ease-out",
        "animation_delay": "calc(sibling-index() * 0.1s)"
      }
    }
  ],
  "css_new_features": [
    {
      "feature": "scroll-state-queries",
      "where": "nav sticky effect",
      "why": "blur without JS",
      "example": "@container scroll-state(stuck: top) { ... }"
    },
    {
      "feature": "sibling-index",
      "where": "staggered card animations",
      "why": "stagger without nth-child",
      "example": "animation-delay: calc(sibling-index() * 0.1s)"
    },
    {
      "feature": "invoker-commands",
      "where": "modal triggers",
      "why": "no onclick handlers",
      "example": "<button commandfor='modal' command='show-modal'>"
    },
    {
      "feature": "customizable-select",
      "where": "pricing plan selector",
      "why": "styled dropdown without JS",
      "example": "select::picker(select) { ... }"
    },
    {
      "feature": "corner-shape",
      "where": "CTA button radius",
      "value": "squircle",
      "why": "organic rounded corners",
      "example": "corner-shape: squircle; border-radius: 8px;"
    }
  ]
}
```

**Ключевые принципы Shared Contract Schema:**

- Все значения либо **hex цвета**, либо **CSS значения** (px, clamp, var), либо **перечисления** (primary, secondary)
- Никаких описаний типа "modern", "clean" — только конкретные параметры
- Каждое взаимодействие (hover, scroll) описано явно с CSS/HTML примерами
- CSS new 2025 фичи перечислены с точными местами применения
- Copy — точная строка, не placeholder

---

## Изменения по файлам

## Execution Checklist

### Phase 1. Contract Hardening

- [x] Добавить `art_direction_json` в `briefs`
  - `supabase/migrations/20260324120000_add_art_direction_to_briefs.sql`
- [x] Сделать endpoint генерации art direction
  - `server/api/briefs/generate-art-direction.ts`
- [ ] Ввести версионирование art direction
  - новый `brief_art_direction_versions` table
  - write path из `server/api/briefs/generate-art-direction.ts`
- [ ] Убрать свободные строки из Shared Contract Schema
  - `server/agents/index.ts`
  - `server/api/briefs/generate-art-direction.ts`
- [ ] Сделать `art_direction_json` единственным входом для demo builder
  - убрать передачу `brief`, `design_spec`, `build_contract` как primary context
  - файл: `server/api/demo/build/plan.ts`

### Phase 2. Demo Track Quality

- [x] Требовать `art_direction_json` до постановки demo build job
  - `server/api/demo/build.ts`
- [x] Подключить `Cline` executor в Oracle worker
  - `workers/demo-builder.js`
- [x] Добавить asset generation stage
  - `server/api/demo/build/assets.ts`
  - `workers/demo-builder.js`
- [ ] Сделать builder двухпроходным:
  - `plan/build`
  - `critic/fix`
  - `workers/demo-builder.js`
- [ ] Включить screenshot-based critic loop
  - Oracle screenshot capture
  - `criticAgent`
  - max 3 iterations
- [ ] Обновлять `art_direction_json` или version snapshot после fix pass

### Phase 3. Model Split

- [ ] Зафиксировать роли моделей в коде
  - Gemini: references / art direction / assets
  - Claude: demo build / critic / Cline execution
- [ ] Явно хранить `provider/model` в `build_contract.executor`
  - `server/utils/demo-build.ts`
- [ ] Прокинуть dynamic model selection в worker
  - `workers/demo-builder.js`

### Phase 4. Figma Track

- [ ] Не стартовать Figma track до финального art direction version
- [ ] Заменить current placeholder flow на реальный Cline + Figma MCP execution
  - `server/api/figma/build/plan.ts`
  - `workers/figma-builder.js`
- [ ] Писать Design System tokens/components из финального контракта

### Phase 5. Cabinet / UX

- [ ] Добавить кнопку `Generate Art Direction`
  - `pages/cabinet.vue`
- [ ] Показать current art direction status/version
  - `pages/cabinet.vue`
- [ ] Показать demo pipeline stages:
  - `references`
  - `design spec`
  - `art direction`
  - `assets`
  - `build`
  - `critic`
  - `publish`

### Phase 6. Verification

- [ ] Smoke test: `generate-art-direction` → success
- [ ] Smoke test: asset generation with `nano-banana-pro-preview`
- [ ] Smoke test: new demo build uses generated assets
- [ ] Visual check: second-pass critic materially improves first pass
- [ ] Figma track consumes final contract, not raw brief/spec

### 1. `server/agents/index.ts` — Gemini для VoltAgent-ов, Claude для code

**Что менять:**

Оставить как есть:
```typescript
// Gemini остаётся для VoltAgent-ов (art direction, critic, references)
artDirectorAgent: google('gemini-2.5-pro')
criticAgent: google('gemini-2.5-pro')
referenceStrategistAgent: google('gemini-2.5-pro')
architectAgent: google('gemini-2.5-pro')

// Claude только для code
demoBuilderAgent: anthropic('claude-sonnet-4-20250514')
```

**artDirectorAgent** — обновить промпт, добавить Shared Contract Schema:

```javascript
// Добавить в промпт:
## SHARED CONTRACT SCHEMA

Your output MUST follow this exact structure. NO loose descriptions. ONLY exact values:

- color_system: каждый цвет = "#hex" (точное значение)
- typography.scale: каждый размер = "clamp(min, vw-based, max)" (точная функция)
- spacing: все значения = "clamp(...)" или "px" (точные значения)
- section_blueprints: каждый элемент = структурированный объект, НЕ строка
- component_recipes: каждый компонент = структура с base + variants
- interactions: каждое действие = { trigger, condition, css_new_feature, action }
- css_new_features: массив с { feature, where, why, example }

EXAMPLE (правильно):
{
  "section_blueprints": [{
    "composition": {
      "type": "split",
      "ratio": "60-40",
      "image_side": "left"
    }
  }]
}

EXAMPLE (неправильно):
{
  "section_blueprints": [{
    "composition": "split-image-text"
  }]
}

JSON only. Strict structure. No loose descriptions.
```

**demoBuilderAgent** — обновить промпт, добавить CSS new 2025:

```javascript
// Добавить в промпт:
## CSS NEW 2025 (Chrome 131+, REQUIRED)

From the Art Direction Contract, extract css_new_features array.
For EACH feature, implement it exactly as specified:

- scroll-state-queries: @container scroll-state(stuck: top) { ... }
- sibling-index: animation-delay: calc(sibling-index() * value)
- invoker-commands: <button commandfor="id" command="show-modal">
- customizable-select: <select>...</select> with CSS styling
- corner-shape: corner-shape: squircle; (with fallback border-radius)
- shape(): clip-path: shape(...)
- popover=hint: <div popover="hint">
- stretch keyword: width: stretch; (with fallback width: 100%)
- text-box: text-box: trim-both cap alphabetic;

RULE: Use EXACTLY the CSS value from contract, not approximation.
RULE: If contract specifies css_new_feature, MUST implement it.
RULE: Minimum 5 CSS new features per site (from css_new_features array).
RULE: Include fallbacks for older browsers (duplicate selectors with old syntax).
```

**criticAgent** — обновить промпт для evaluation:

```javascript
// Заменить текущий промпт:
instructions: `
Ты — Senior UI/UX дизайнер. Оцениваешь скриншот сайта по Art Direction Contract.

ВХОД:
- Скриншот сайта (визуальный)
- Art Direction Contract (JSON)

ОЦЕНКА (0-10 по каждому):
1. COLOR_FIDELITY: цвета совпадают с color_system.hex?
2. TYPOGRAPHY_QUALITY: шрифты, размеры, line-height, letter-spacing = контракту?
3. SPACING_RHYTHM: отступы, padding, section_gap, component_gap = контракту?
4. COMPONENT_QUALITY: nav, hero, cards, buttons, footer = component_recipes?
5. VISUAL_HIERARCHY: видно что главное, что второстепенное?
6. HOVER_INTERACTIONS: есть ли hover-эффекты (из interactions)?
7. RESPONSIVE_FEEL: не ломается на узком экране (375px)?
8. CSS_NEW_USAGE: реализованы ли css_new_features (все или почти все)?
9. OVERALL_IMPRESSION: выглядит как работа top agency?
10. ANTI_PATTERN_CHECK: НЕТ ли anti_patterns из контракта?

ВЫХОД (JSON):
{
  "scores": { "color_fidelity": 8, "typography_quality": 7, ... },
  "total": 73,
  "pass": false,
  "critical_fixes": [
    {
      "issue": "Hero background should be #hex not #other",
      "fix": "Change --bg variable to exact hex from contract",
      "css_selector": ":root",
      "priority": "critical"
    }
  ],
  "contract_updates": [
    {
      "field": "color_system.accent",
      "reason": "Current hex looks muddy on screenshot, suggest this alternative",
      "suggested_value": "#newHex"
    }
  ]
}

RULES:
- Evaluate AGAINST the contract, not opinion
- If screenshot matches contract — give high score
- If screenshot differs — document exact difference
- total >= 75 = pass, < 75 = needs fixes
- Be specific: "missing hover" not "bad interaction"
`
```

### 2. `server/api/briefs/generate-art-direction.ts` — Версионирование

**Что НЕ менять:**
```typescript
// Gemini остаётся! Не трогаем:
model: google('gemini-2.5-pro')
```

**Что менять — версионирование:**

```typescript
// Перед генерацией новой версии — архивировать старую

const { data: currentBrief } = await db
  .from('briefs')
  .select('art_direction_json, art_direction_version')
  .eq('id', briefId)
  .maybeSingle()

const currentVersion = currentBrief?.art_direction_version || 0
const newVersion = currentVersion + 1

// Архивировать старую версию
if (currentBrief?.art_direction_json) {
  await db.from('art_direction_history').insert({
    brief_id: briefId,
    version: currentVersion,
    art_direction_json: currentBrief.art_direction_json,
    source: 'generation',
    created_at: new Date().toISOString(),
  })
}

// Сохранить новую версию
await db.from('briefs').update({
  art_direction_json: artDirection,
  art_direction_version: newVersion,
  updated_at: new Date().toISOString(),
}).eq('id', briefId)
```

### 3. `server/api/demo/build/plan.ts` — Только контракт + Critic loop

**Что менять — упрощение промпта:**

```typescript
// БЫЛО: 5 разных JSON-ов в промпте
// СТАЛО: только Art Direction Contract

const prompt = `
🎨 ART DIRECTION CONTRACT (единственный source of truth):
${JSON.stringify(job.spec_snapshot?.art_direction || {}, null, 2)}

═══════════════════════════════════════════════════════════════

🚀 TASK:
Generate production-grade static site (HTML + CSS).

CRITICAL:
1. Use EXACTLY the values from Art Direction Contract
2. Every color = hex from color_system
3. Every size = clamp() from typography.scale
4. Every section = section_blueprints structure
5. Every component = component_recipes definition
6. Every interaction = from interactions array
7. CSS new 2025 features = MUST implement all from css_new_features
8. Copy = EXACT text from section_blueprints.copy, no Lorem ipsum

Return STRICT JSON: { title, slug, html, css, css_new_features_used: [...] }
`.trim()
```

**Что добавить — Critic loop:**

Создать новый файл `server/api/demo/build/execute.ts`:

```typescript
/**
 * Full demo build execution with critic loop
 * POST /api/demo/build/execute
 */

import { defineEventHandler, readBody } from 'h3'
import { useDatabaseClient } from '~~/server/utils/supabase'
import { getDemoBuildToken } from '~~/server/utils/demo-build-token'
import { getAgent } from '~~/server/voltagent'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const token = body?.token
  if (token !== getDemoBuildToken()) {
    return { success: false, error: 'Unauthorized' }
  }

  const jobId = body?.jobId
  const db = useDatabaseClient()

  // 1. Загрузить job
  const { data: job } = await db
    .from('demo_build_jobs')
    .select('id, slug, spec_snapshot, build_contract')
    .eq('id', jobId)
    .maybeSingle()

  if (!job) return { success: false, error: 'Job not found' }

  const artDirection = job.spec_snapshot?.art_direction
  const demoBuilderAgent = getAgent('demoBuilderAgent')
  const criticAgent = getAgent('criticAgent')

  // 2. Critic loop
  const MAX_ITERATIONS = 3
  let currentOutput = null
  let currentScores = null
  let iteration = 0

  while (iteration < MAX_ITERATIONS) {
    // Generate site
    const buildSchema = z.object({
      title: z.string(),
      slug: z.string(),
      html: z.string(),
      css: z.string(),
      css_new_features_used: z.array(z.string()),
    })

    const buildPrompt = `
Art Direction Contract:
${JSON.stringify(artDirection, null, 2)}

Generate production-grade site with CSS new 2025 features.
${iteration > 0 ? `Previous iteration scores: ${JSON.stringify(currentScores)}. Fix the issues.` : ''}
    `.trim()

    const result = await demoBuilderAgent.generateObject(buildPrompt, buildSchema)
    currentOutput = result.object

    // Take screenshot (Chrome Preview MCP)
    const screenshotUrl = await takeScreenshot(currentOutput.html, currentOutput.css)

    // Evaluate
    const critiqueSchema = z.object({
      scores: z.record(z.number()),
      total: z.number(),
      pass: z.boolean(),
      critical_fixes: z.array(z.object({
        issue: z.string(),
        fix: z.string(),
        css_selector: z.string(),
        priority: z.string(),
      })),
      contract_updates: z.array(z.object({
        field: z.string(),
        reason: z.string(),
        suggested_value: z.string().optional(),
      })),
    })

    const critiquePrompt = `
Screenshot of generated site (data URL): ${screenshotUrl}

Art Direction Contract:
${JSON.stringify(artDirection, null, 2)}

Evaluate the screenshot against the contract.
    `.trim()

    const critique = await criticAgent.generateObject(critiquePrompt, critiqueSchema)
    currentScores = critique.object.scores
    currentScores.total = critique.object.total

    // Log iteration
    await db.from('demo_build_events').insert({
      job_id: job.id,
      level: 'info',
      stage: 'build',
      message: `Critic iteration ${iteration + 1}: score ${critique.object.total}/100`,
      payload: { scores: critique.object.scores, pass: critique.object.pass },
    })

    // If pass — exit loop
    if (critique.object.pass || iteration === MAX_ITERATIONS - 1) {
      // Save final output
      await db.from('demo_build_jobs').update({
        output: currentOutput,
        result_json: currentOutput,
        current_stage: 'complete',
        critique_scores: currentScores,
        critique_passed: critique.object.pass,
        critique_iteration: iteration + 1,
        updated_at: new Date().toISOString(),
      }).eq('id', jobId)

      return {
        success: true,
        data: {
          output: currentOutput,
          scores: currentScores,
          passed: critique.object.pass,
          iterations: iteration + 1,
        },
      }
    }

    // If not pass — fix and repeat
    if (critique.object.critical_fixes?.length > 0) {
      const fixPrompt = `
Current HTML:
${currentOutput.html}

Current CSS:
${currentOutput.css}

Fix these issues:
${JSON.stringify(critique.object.critical_fixes)}

Art Direction Contract:
${JSON.stringify(artDirection, null, 2)}

Return updated HTML and CSS.
      `.trim()

      const fixResult = await demoBuilderAgent.generateObject(fixPrompt, buildSchema)
      currentOutput = fixResult.object
    }

    // If contract updates suggested — apply them
    if (critique.object.contract_updates?.length > 0) {
      for (const update of critique.object.contract_updates) {
        // Deep merge update into artDirection
        setByPath(artDirection, update.field, update.suggested_value || update.field)
      }

      // Save updated contract version
      const newVersion = (job.spec_snapshot?.art_direction_version || 0) + 1
      await db.from('art_direction_history').insert({
        brief_id: job.spec_snapshot?.brief_id,
        version: newVersion - 1,
        art_direction_json: artDirection,
        source: 'critic_update',
      })

      await db.from('briefs').update({
        art_direction_json: artDirection,
        art_direction_version: newVersion,
      }).eq('id', job.spec_snapshot?.brief_id)
    }

    iteration++
  }
})
```

### 4. `server/utils/demo-build.ts` — Упрощение

```typescript
// Удалить inferAssetRequirements() полностью
// Asset direction теперь в Art Direction Contract

export const buildDemoContract = (brief: any, slug: string) => ({
  project: {
    name: brief?.brief_data?.project_name || 'Demo',
    slug,
    briefId: brief?.id,
    targetUrl: buildDemoTargetUrl(slug),
  },
  art_direction: brief?.art_direction_json,
  art_direction_version: brief?.art_direction_version || 0,
})
```

---

## Миграции БД

### `20260324130000_art_direction_versioning.sql`

```sql
ALTER TABLE briefs ADD COLUMN IF NOT EXISTS art_direction_version integer DEFAULT 0;

CREATE TABLE IF NOT EXISTS art_direction_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brief_id uuid REFERENCES briefs(id) ON DELETE CASCADE,
  version integer NOT NULL,
  art_direction_json jsonb NOT NULL,
  source text DEFAULT 'generation',  -- 'generation' | 'critic_update'
  created_at timestamptz DEFAULT now(),
  UNIQUE(brief_id, version)
);

CREATE INDEX idx_art_direction_history_brief ON art_direction_history(brief_id);
```

### `20260324130100_demo_build_critique.sql`

```sql
ALTER TABLE demo_build_jobs
  ADD COLUMN IF NOT EXISTS critique_scores jsonb DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS critique_passed boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS critique_iteration integer DEFAULT 0;
```

---

## Зависимости

```bash
npm install @ai-sdk/anthropic
```

Переменные окружения (уже установлены):
```
GOOGLE_API_KEY=...        # Gemini для VoltAgent-ов
ANTHROPIC_API_KEY=...    # Claude для code
```

---

## Execution Checklist (актуальный статус)

### Phase 0: Low-Hanging Fruit (Shared Schema Fixes) — 30 минут

**[0.1] Обновить artDirectorAgent промпт в `server/agents/index.ts:157-265`**
- Статус: ✓ Существует, но содержит вольные строки
- Проблема: `"composition": "split-image-text"` вместо структуры
- Решение: Заменить все вольные строки на однозначные структуры (см. примеры выше)
- Файл: `server/agents/index.ts` lines 157-265
- Время: 15 мин
- Блокер: нет

**[0.2] Добавить CSS new 2025 в demoBuilderAgent промпт `server/agents/index.ts:267-361`**
- Статус: ✓ Существует с 7-layer CSS, но без CSS new 2025
- Решение: Добавить раздел "CSS NEW 2025 (Chrome 131+, REQUIRED)" с 5+ примерами
- Файл: `server/agents/index.ts` lines 267-361
- Время: 15 мин
- Блокер: нет

### Phase 1: Figma Track (Track 2) — Главный приоритет!

**[1.0] ТЗ для Figma Track**

После demo build завершится с critic passed — нужно построить Design System в Figma.

**[1.1] Создать `server/api/figma/build-from-contract.ts`**
- Статус: ✗ Не существует
- Что: POST /api/figma/build-from-contract { briefId, token }
- Логика:
  1. Fetch финальный art_direction_json из briefs
  2. Fetch demo build artifacts (HTML/CSS) для reference
  3. Через Cline + Figma MCP Server создать Design System:
     - Page: "Design System"
     - Переменные из color_system, typography, spacing
     - Компоненты из component_recipes
     - Стили (text, color, effects)
     - Page: "Mockup" — full page layout из section_blueprints
  4. Сохранить figma_file_url в briefs
- Файл: создать новый
- Время: 60 мин (сложный)
- Блокер: нет (independent)

**[1.2] Обновить figma build инициализацию `server/api/figma/build.ts`**
- Статус: ✓ Существует, но нужны изменения
- Добавить:
  - Проверка что demo_build finished и critic_passed=true
  - Копирование финального art_direction в figma job spec
  - Флаг что это Track 2 (после demo)
- Время: 10 мин
- Блокер: после #1.1

**[1.3] Обновить figma-builder.js для работы через Figma MCP**
- Статус: ✓ Существует (282 lines), но использует старую логику
- Решение: Добавить режим Figma MCP execution
  - Опция 1: Запускать Cline с Figma MCP контекстом + build prompt
  - Опция 2: Прямой вызов use_figma tool для создания системы
- Файл: `workers/figma-builder.js`
- Время: 45 мин
- Блокер: #1.1

**[1.4] Исправить imports в figma endpoints** (микро-баги)
- `server/api/figma/build/next.ts` — добавить `setHeader` из 'h3'
- `server/api/figma/build/complete.ts` — добавить `setHeader` из 'h3'
- `server/api/figma/build/status.ts` — добавить `getHeader` из 'h3'
- `server/api/figma/build/event.ts` — добавить `setHeader` из 'h3'
- Время: 5 мин
- Блокер: нет

### Phase 2: Polish (Опционально) — 20 минут

**[2.1] Обновить criticAgent промпт в `server/agents/index.ts:99-103`**
- Статус: ✓ Существует (3 строки), но базовый
- Замечание: demo-builder.js уже вызывает critic с полным prompts (lines 232-265)
- Решение: Можно оставить как есть (уже работает) или обновить для консистентности
- Время: 10 мин (опционально)

**[2.2] Smoke тесты**
- Test 1: Generate art direction → вернёт версионированный контракт
- Test 2: Queue demo build → требует art_direction, создаёт job
- Test 3: Demo build с critic → скоры >= 4.2 → published
- Test 4: Figma build from contract → Design System создан
- Время: 20 мин

### Итоговый порядок:

```
СЕЙЧАС (Phase 0 - 30 мин):
  [0.1] Shared Schema в artDirector (15 мин)
  [0.2] CSS new 2025 в demoBuilder (15 мин)

ПОТОМ (Phase 1 - Главное, 2 часа):
  [1.1] build-from-contract.ts (60 мин) ← основная работа
  [1.2] figma build.ts update (10 мин)
  [1.3] figma-builder.js MCP support (45 мин)
  [1.4] imports fixes (5 мин)

ФИНАЛ (Phase 2 - 20 мин):
  [2.1] criticAgent polish (опционально)
  [2.2] Smoke тесты
```

**Всего: ~2.5 часа на полный готовый pipeline**

---

## Проверка готовности

После внедрения, каждый сгенерированный сайт должен:

- [ ] Использовать цвета ТОЧНО из Art Direction Contract (hex match)
- [ ] Использовать шрифты и размеры из контракта (clamp() scale)
- [ ] Реализовать все CSS new 2025 фичи из контракта (минимум 5)
- [ ] Пройти critic loop с оценкой ≥ 75/100
- [ ] Иметь все hover-эффекты из interactions
- [ ] Иметь responsive layout (не ломаться на 375px)
- [ ] Не содержать ни одного anti-pattern из контракта
- [ ] Использовать точный copy из section_blueprints, не placeholder
- [ ] Все версии контракта сохранены в истории
- [ ] Скриншоты критика-цикла логированы для отладки
