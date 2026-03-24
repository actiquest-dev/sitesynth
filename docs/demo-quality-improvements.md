# Demo Site Quality Improvements — Complete Implementation Guide

**Status:** Implementation in progress
**Goal:** Transform demo sites from mediocre (убогие) to professional-grade
**Timeline:** 2-week implementation

---

## The Problem (Diagnosed)

Demo sites at demo.sitesynth.com look mediocre because the build pipeline is missing the **Art Direction Contract** layer.

### Current Pipeline (Broken)
```
Brief → Design Spec → Demo Build (Cline)
```

**Problem:** Design spec alone is insufficient. It's high-level requirements, not specific visual direction.
- No exact colors (only color names)
- No specific fonts or sizes
- No section-by-section copy
- No component recipes
- No anti-patterns to avoid
- No reference translations

**Result:** Agent has to guess or use defaults → generic designs

### Improved Pipeline (This Implementation)
```
Brief → Design Spec → Reference Analysis
  ↓
Art Direction Contract (NEW)
  ├─ Exact colors (#hex values)
  ├─ Typography scale (Google Fonts + clamp sizes)
  ├─ Section blueprints (exact copy + layout)
  ├─ Component recipes (nav, hero, cards, footer)
  ├─ Anti-patterns (explicit "don't do this")
  └─ Reference translations (what to adopt/avoid)
  ↓
Demo Build (Cline with detailed direction)
```

**Result:** Agent has clear, specific instruction → professional designs

---

## Changes Made

### 1. New Endpoint: `/api/briefs/generate-art-direction.ts`

**Purpose:** Generate comprehensive Art Direction Contract from design spec + reference analysis

**Input:**
- Brief markdown
- Design spec JSON
- Reference analysis
- Brief data

**Output:**
```json
{
  "style_manifesto": "2-3 sentences exact visual identity",
  "mood": ["editorial", "minimal", "tech-luxe"],
  "color_system": {
    "background": "#0A0A0F",
    "surface": "#1A1A20",
    "text_primary": "#F5F5F7",
    "accent": "#8D5FFF",
    ...
  },
  "typography": {
    "heading_font": "Playfair Display",
    "body_font": "Inter",
    "scale": {
      "hero": { "size": "clamp(48px, 6vw, 80px)", "weight": 700, "line_height": 1.05 },
      "h1": { "size": "clamp(36px, 4vw, 56px)", "weight": 700, "line_height": 1.1 },
      ...
    }
  },
  "section_blueprints": [
    {
      "role": "hero",
      "headline": "Build Your Product Vision Into Reality",
      "composition": "split-image-text",
      "copy": {
        "headline": "Build Your Product Vision Into Reality",
        "body": "From strategy to launch, we guide your vision into a market-ready product.",
        "cta_label": "Start Your Project"
      },
      "interactions": ["smooth-scroll-fade", "image-parallax"]
    },
    ...
  ],
  "component_recipes": {
    "nav": { "style": "floating-glass", "items": ["Product", "Services", "Team", "Blog"] },
    "hero": { "layout": "split-visual", "has_image": true, "image_treatment": "gradient-overlay" },
    ...
  },
  "anti_patterns": [
    "Generic serif fonts without personality",
    "Uniform section heights with no visual rhythm",
    "White background everywhere",
    "Missing hover states on CTAs",
    "Placeholder text and lorem ipsum"
  ],
  "reference_translation": [
    {
      "reference": "Framer.com",
      "adopt": ["floating-glass navigation", "gradient accents", "smooth scroll animations"],
      "avoid": ["over-use of floating elements", "motion sickness-inducing effects"]
    }
  ]
}
```

**Schema:** TypeScript Zod schema in the endpoint validates output

**Database:** Saved to `briefs.art_direction_json` (new column)

---

### 2. Updated Demo Build Endpoint: `/api/demo/build.ts`

**Changes:**
- Now requires `art_direction_json` before allowing build
- Returns error: "Art direction not found. Generate it first." if missing
- Passes art direction to build contract (in `spec_snapshot`)

**Flow:**
1. User generates brief
2. Design spec auto-generates
3. User must click "Generate Art Direction" (new button)
4. Art direction is created (uses artDirectorAgent context)
5. Now demo build button is enabled
6. Demo build queues job with art direction included

---

### 3. Updated Demo Plan Endpoint: `/api/demo/build/plan.ts`

**Changes:**
- Prompt now includes art direction contract as PRIMARY SOURCE OF TRUTH
- Sections the prompt clearly:
  1. 🎨 Art Direction (first, highest priority)
  2. 📋 Build Contract
  3. 📊 Design Spec
  4. 📝 Brief
  5. 🔍 Context

**Prompt Instructions:**
```
USE THE ART DIRECTION CONTRACT AS YOUR PRIMARY SOURCE:
- Extract exact colors from color_system (use these hex values, not variations)
- Use typography scale verbatim (sizes, weights, line-heights, fonts)
- Follow section_blueprints: these define exact copy and layout
- Implement component_recipes exactly as specified
- EXPLICITLY AVOID all anti_patterns listed
```

**Impact:** Cline receives crystal-clear direction and specific values to use

---

### 4. Database Migration: `migrations/add_art_direction_to_briefs.sql`

**Adds:**
- `art_direction_json` column to briefs table
- GIN index for fast queries
- Comment explaining the column

**SQL:**
```sql
ALTER TABLE briefs
ADD COLUMN IF NOT EXISTS art_direction_json jsonb DEFAULT NULL;

CREATE INDEX idx_briefs_art_direction_json
ON briefs USING GIN (art_direction_json);
```

**Must be applied before running new code**

---

## Implementation Checklist

### Phase 1: Database & Infrastructure (Day 1)

- [ ] **Apply migration** to add `art_direction_json` column
  - [ ] Run SQL: `migrations/add_art_direction_to_briefs.sql`
  - [ ] Verify column exists in Supabase UI
  - [ ] Verify index created

- [ ] **Deploy updated code**
  - [ ] `/api/briefs/generate-art-direction.ts` (new)
  - [ ] `/api/demo/build.ts` (updated)
  - [ ] `/api/demo/build/plan.ts` (updated)
  - [ ] Git commit: "feat: add art direction generation to demo pipeline"
  - [ ] Push to Vercel

### Phase 2: Frontend Integration (Day 1-2)

- [ ] **Add button to Cabinet.vue (Brief Review page)**
  - Label: "Generate Art Direction"
  - Calls: POST `/api/briefs/generate-art-direction` with briefId
  - Shows loading state
  - On success: disables button, shows art direction summary
  - On error: shows error message with retry
  - After success: enables "Build Demo Site" button

- [ ] **Conditional button states**
  ```
  Design Spec generated? → Show "Generate Art Direction" button
  Art Direction generating? → Show "Generating..." (disabled)
  Art Direction ready? → Hide button, show checkmark
  Build Demo enabled → "Build Demo Site" button is active
  ```

### Phase 3: Testing & Iteration (Day 2-3)

**Test Cases:**

1. **Happy Path**
   - Generate brief
   - Design spec auto-generates
   - Click "Generate Art Direction"
   - Wait for generation
   - See summary (mood, colors, fonts, sections)
   - Click "Build Demo Site"
   - See generated site
   - ✓ Check: Site uses exact colors, fonts, copy from art direction

2. **Quality Check**
   - Open demo site
   - Compare to art direction contract:
     - [ ] Colors match exactly (use color picker)
     - [ ] Fonts are correct (use DevTools inspector)
     - [ ] Section copy is exact (not paraphrased)
     - [ ] Component recipes followed (nav style, hero layout, etc.)
     - [ ] Anti-patterns avoided (no generic fonts, proper spacing, etc.)
   - ✓ Check: All items match

3. **Error Handling**
   - Try building before generating art direction
   - Should show: "Art direction not found. Generate it first."
   - ✓ Check: Helpful error message

4. **Multiple Projects**
   - Generate 3-5 different projects with different briefs
   - Each should have unique art direction
   - Each should result in different-looking sites
   - ✓ Check: Variety is high, quality is consistent

---

## Expected Improvements

### Before This Change
- Sites look "убогие" (generic, mediocre)
- All sites similar (same colors, fonts, layouts)
- Placeholder text or missing copy
- No visual hierarchy
- Generic design patterns
- Low perceived quality

### After This Change
- Sites look professional, unique to each brand
- Exact colors, fonts, spacing match brief
- Real copy from art direction contract
- Clear visual hierarchy and rhythm
- Specific, thoughtful design patterns
- High perceived quality (agency-grade)

### Metrics to Track
```
Quality Score (1-5):
  Before: 2.0-2.5 (generic)
  Target: 4.0-4.5 (professional)

Design Uniqueness:
  Before: 60% similarity between projects
  Target: 95% unique per project

Copy/Content:
  Before: 30% exact from brief
  Target: 100% exact from art direction

Visual Hierarchy:
  Before: Flat, uniform spacing
  Target: Clear section rhythm, varied heights
```

---

## Detailed User Flow

### Step 1: Brief Review Page
```
┌─────────────────────────────┐
│ Brief Title: "TechFlow"      │
│ Status: 📋 Design Spec Ready │
│                              │
│ [Generate Art Direction] ←   │ NEW BUTTON
│ (Active after design spec)   │
└─────────────────────────────┘
```

### Step 2: Generating Art Direction
```
┌─────────────────────────────┐
│ Generating Art Direction... │
│ ⏳ This may take 30-60 sec  │
│                              │
│ [Generating...] (disabled)   │
└─────────────────────────────┘
```

### Step 3: Art Direction Ready
```
┌─────────────────────────────┐
│ Brief Title: "TechFlow"      │
│ Status: ✅ Art Direction Ready
│                              │
│ 🎨 Summary:                  │
│ Mood: editorial, minimal     │
│ Colors: Dark + gold accents  │
│ Fonts: Playfair, Inter       │
│ Sections: 8 pages            │
│                              │
│ [Build Demo Site] ←          │ NOW ACTIVE
│ (Active, site is built)      │
└─────────────────────────────┘
```

### Step 4: Demo Site Built
```
┌─────────────────────────────┐
│ Demo Site: TechFlow          │
│ Status: ✅ Published         │
│ URL: demo.sitesynth.com/... │
│                              │
│ [View Site]                  │
│ [Refine Art Direction]       │ Can run again
└─────────────────────────────┘
```

---

## Code Examples

### Calling the Art Direction Endpoint (Vue)
```typescript
const generateArtDirection = async () => {
  isGenerating.value = true
  try {
    const response = await fetch('/api/briefs/generate-art-direction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ briefId: brief.value.id }),
    })
    const result = await response.json()
    if (result.success) {
      artDirectionSummary.value = result.data.summary
      showArtDirectionReady.value = true
    } else {
      showError.value = result.error
    }
  } finally {
    isGenerating.value = false
  }
}
```

### Checking Art Direction in Demo Build (API)
```typescript
if (!brief.art_direction_json) {
  return {
    success: false,
    error: 'Art direction not found. Generate it first.'
  }
}

// Pass to build contract
const specSnapshot = {
  art_direction: brief.art_direction_json,
  design_spec: brief.design_spec_json,
  // ...
}
```

---

## Troubleshooting

### Problem: "Art direction not found"
**Solution:** Generate design spec first, then click "Generate Art Direction"

### Problem: Art direction generation takes >2 minutes
**Cause:** Gemini API slow or large brief
**Solution:** Break brief into smaller projects, or try again later

### Problem: Generated site doesn't match art direction colors
**Cause:** Cline not following art direction priority in prompt
**Solution:**
1. Check if art direction is in spec_snapshot
2. Verify prompt includes art direction section
3. Check Gemini response for any errors

### Problem: All sites look the same
**Cause:** Weak art direction contracts
**Solution:**
1. Review artDirectorAgent prompt in agents/index.ts
2. Ensure reference analysis is comprehensive
3. Run multiple iterations, review, iterate

---

## Next Steps (After Implementation)

### Immediate (Week 2)
1. Test with 5-10 real projects
2. Collect feedback from clients
3. Iterate on artDirectorAgent prompt if needed
4. Monitor demo build success rate

### Short-term (Week 3-4)
1. Investigate Figma MCP vs plugin (see `docs/figma-plugin-vs-mcp-analysis.md`)
2. Potentially migrate to Figma MCP for design-to-code roundtrip
3. Add critic loop (screenshot → AI review → fixes)

### Long-term (Month 2-3)
1. Migrate from Figma plugin to Figma MCP + Cline
2. Enable self-healing loop (build → screenshot → critique → auto-fix)
3. Add design system reuse (find and use existing components)
4. Implement variable-driven responsive design (design tokens in CSS)

---

## Summary

This implementation adds the missing **Art Direction Contract** layer to the demo pipeline. By providing agents with specific, opinionated visual direction instead of generic specs, we transform mediocre sites into professional-grade designs.

**Key principle:** Be specific. Tell the agent *exactly* what colors to use, what fonts to use, what copy to write. Remove guessing.

**Expected result:** 🎨 Professional sites that look like agency work, not generic templates.
