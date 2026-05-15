import { generateText } from 'ai'
import { geminiModel } from '~~/server/utils/gemini-model'
import {
  BRIEF_GENERATION_SKILL,
  type BriefData,
  type GeneratedBrief,
} from './brief-skill'

/**
 * Clean JSON response from markdown code blocks
 */
function cleanJsonResponse(text: string): string {
  let cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '')
  cleaned = cleaned.trim()
  return cleaned
}

/**
 * Extract structured brief data from conversation messages
 */
export async function extractBriefDataFromConversation(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<BriefData> {
  try {
    const conversationText = messages.map((m) => `${m.role}: ${m.content}`).join('\n\n')

    const { text } = await generateText({
      model: geminiModel('gemini-2.5-pro'),
      system: `Extract project brief information from this conversation. Return JSON only.
      
Extract these fields if mentioned:
- projectName, company, companyMission, businessGoal, scope
- targetAudience, budget, timeline, competitors, deliverables
- features (must-have), painPoints, existingAssets, referenceLinks

Return only valid JSON object.`,
      messages: [
        {
          role: 'user',
          content: `Extract brief data:\n\n${conversationText}`,
        },
      ],
    })

    const cleanedText = cleanJsonResponse(text)
    const briefData = JSON.parse(cleanedText)
    briefData.conversationSummary = conversationText

    console.log('[Brief] ✅ Data extracted successfully')
    return briefData as BriefData
  } catch (error) {
    console.error('[Brief] Error extracting data:', error)
    return { conversationSummary: messages.map((m) => `${m.role}: ${m.content}`).join('\n\n') }
  }
}

/**
 * Generate professional brief from extracted data
 */
export async function generateBriefFromData(
  briefData: BriefData,
  agentType: 'briefing' | 'presale' = 'briefing',
  userEmail?: string
): Promise<GeneratedBrief> {
  try {
    console.log('[Brief] Generating brief using 8-section Notion format...')

    // Fetch uploaded files if user email provided
    let fileContext = ''
    if (userEmail) {
      try {
        const supabaseUrl = process.env.SUPABASE_URL
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        if (supabaseUrl && supabaseKey) {
          const { createClient } = require('@supabase/supabase-js')
          const supabase = createClient(supabaseUrl, supabaseKey)
          
          const { data: files } = await supabase.storage
            .from('brief-files')
            .list(userEmail, { limit: 10 })

          if (files && files.length > 0) {
            fileContext = '\n\nUploaded Reference Files:\n'
            for (const file of files.slice(0, 5)) {
              try {
                const { data: content } = await supabase.storage
                  .from('brief-files')
                  .download(`${userEmail}/${file.name}`)
                
                if (content) {
                  const text = await content.text()
                  fileContext += `\n--- ${file.name} ---\n${text.substring(0, 2000)}\n`
                }
              } catch (err) {
                console.warn(`Could not read ${file.name}`)
              }
            }
          }
        }
      } catch (err) {
        console.warn('[Brief] Could not load files:', err)
      }
    }

    const dataContext = `
Client Data:
- Project: ${briefData.projectName || 'Not specified'}
- Company: ${briefData.company || 'Not specified'}
- Mission: ${briefData.companyMission || 'Not specified'}
- Business Goal: ${briefData.businessGoal || 'Not specified'}
- Scope: ${briefData.scope || 'Not specified'}
- Audience: ${briefData.targetAudience || 'Not specified'}
- Budget: ${briefData.budget || 'Not specified'}
- Timeline: ${briefData.timeline || 'Not specified'}
- Competitors: ${briefData.competitors || 'Not specified'}
- Deliverables: ${Array.isArray(briefData.deliverables) ? briefData.deliverables.join(', ') : 'Not specified'}
- Features: ${Array.isArray(briefData.features) ? briefData.features.join(', ') : 'Not specified'}
- Pain Points: ${Array.isArray(briefData.painPoints) ? briefData.painPoints.join(', ') : 'Not specified'}
- Assets: ${Array.isArray(briefData.existingAssets) ? briefData.existingAssets.join(', ') : 'None'}
- Refs: ${Array.isArray(briefData.referenceLinks) ? briefData.referenceLinks.join(', ') : 'None'}

Conversation:
${briefData.conversationSummary || 'No conversation data'}
${fileContext}
`

    const { text } = await generateText({
      model: geminiModel('gemini-2.5-pro'),
      system: BRIEF_GENERATION_SKILL,
      messages: [
        {
          role: 'user',
          content: `Generate professional 8-section brief from this data:\n\n${dataContext}\n\nReturn valid JSON only.`,
        },
      ],
      temperature: 0.7,
      maxTokens: 2500,
    })

    const cleanedText = cleanJsonResponse(text)
    const brief = JSON.parse(cleanedText)

    console.log('[Brief] ✅ Brief generated with 8-section structure')
    return brief as GeneratedBrief
  } catch (error) {
    console.error('[Brief] Error generating brief:', error)
    throw error
  }
}

/**
 * Format brief as markdown
 */
export function formatBriefAsMarkdown(brief: GeneratedBrief): string {
  const personas = brief.targetAudience.userPersonas
    .map((p) => `- **${p.name}** (${p.role}): ${p.painPoints.join(', ')}`)
    .join('\n')

  const competitors = brief.competitors.directCompetitors
    .map((c) => `- **${c.name}**: ${c.strength}`)
    .join('\n')

  const phases = brief.timelineAndBudget.phases
    .map((p) => `- **${p.name}** (${p.duration}): ${p.deliverables.join(', ')}`)
    .join('\n')

  return `# ${brief.projectName}

## 🏢 Company Introduction

**Organization:** ${brief.companyIntroduction.companyName}
**Mission:** ${brief.companyIntroduction.mission}

**Current Products:**
${brief.companyIntroduction.currentProducts.map((p) => `- ${p}`).join('\n')}

**Problem We Solve:** ${brief.companyIntroduction.problemSolved}
**Target Users:** ${brief.companyIntroduction.targetUsers}

---

## ✅ Scope & Acceptance Criteria

**Main Objective:** ${brief.scopeAndAcceptanceCriteria.mainObjective}

**Deliverables:**
${brief.scopeAndAcceptanceCriteria.deliverables.map((d) => `- ${d}`).join('\n')}

**Must-Have Features:**
${brief.scopeAndAcceptanceCriteria.mustHaveFeatures.map((f) => `- ${f}`).join('\n')}

**Acceptance Criteria:**
${brief.scopeAndAcceptanceCriteria.acceptanceCriteria.map((c) => `- ${c}`).join('\n')}

---

## 🎯 Goals & Objectives

**Business Goals:**
${brief.goalsAndObjectives.businessGoals.map((g) => `- ${g}`).join('\n')}

**Success Metrics:**
${brief.goalsAndObjectives.successMetrics.map((m) => `- ${m}`).join('\n')}

**Key Results:**
${brief.goalsAndObjectives.keyResults.map((r) => `- ${r}`).join('\n')}

---

## 👥 Competitors

**Direct Competitors:**
${competitors}

**Competitive Advantage:** ${brief.competitors.competitiveAdvantage}

---

## 👫 Target Audience

**User Personas:**
${personas}

**User Needs:**
${brief.targetAudience.userNeeds.map((n) => `- ${n}`).join('\n')}

---

## 📄 What's Been Done So Far

**Existing Assets:**
${brief.whatHasBeenDone.existingAssets.map((a) => `- ${a}`).join('\n')}

**Completed Research:**
${brief.whatHasBeenDone.completedResearch.map((r) => `- ${r}`).join('\n')}

**Existing Data:** ${brief.whatHasBeenDone.existingData}

---

## ⌛️ Timeline & Budget

**Budget:** ${brief.timelineAndBudget.totalBudget}
**Timeline:** ${brief.timelineAndBudget.startDate} → ${brief.timelineAndBudget.deadline}

**Project Phases:**
${phases}

---

## 👣 Next Steps

**Immediate Actions:**
${brief.nextSteps.immediateActions.map((a) => `- ${a}`).join('\n')}

**Questions:**
${brief.nextSteps.questionsForClarification.map((q) => `- ${q}`).join('\n')}

**Decisions Needed:**
${brief.nextSteps.requiredDecisions.map((d) => `- ${d}`).join('\n')}
`
}
