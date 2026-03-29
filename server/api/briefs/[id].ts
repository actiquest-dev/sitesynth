import { defineEventHandler, getRouterParam, getHeader, readBody } from 'h3'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const urlPattern = /\bhttps?:\/\/[^\s)<>"']+/gi
function extractUrls(text: string) {
  const matches = text?.match(urlPattern) || []
  return Array.from(new Set(matches.map((url) => url.replace(/[.,]$/, ''))))
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const userEmail = getHeader(event, 'x-user-email')

  if (!id || !userEmail) {
    return { success: false, error: 'Missing id or user email' }
  }

  if (event.method === 'GET') {
    // Get brief by ID
    try {
      const { data, error } = await supabase
        .from('briefs')
        .select('*')
        .eq('id', id)
        .eq('user_email', userEmail)
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('[Briefs] Error fetching brief:', error)
      return { success: false, error: 'Failed to fetch brief' }
    }
  }

  if (event.method === 'PUT') {
    // Update brief
    try {
      const body = await readBody(event)
      const { content, name, description, briefData } = body

      const { data: currentBrief, error: currentBriefError } = await supabase
        .from('briefs')
        .select('*')
        .eq('id', id)
        .eq('user_email', userEmail)
        .single()

      if (currentBriefError || !currentBrief) throw currentBriefError || new Error('Brief not found')

      // Map to correct DB columns
      const updates: any = { updated_at: new Date().toISOString() }
      if (content !== undefined) updates.markdown_content = content
      if (name !== undefined) updates.name = name
      if (briefData !== undefined) updates.brief_data = briefData

      const currentReferenceLinks = Array.isArray(currentBrief?.brief_data?.referenceLinks)
        ? currentBrief.brief_data.referenceLinks
        : []
      const contentUrls = typeof content === 'string' ? extractUrls(content) : []
      const briefUrls = Array.isArray(briefData?.referenceLinks) ? briefData.referenceLinks : []
      const mergedReferenceLinks = Array.from(new Set([
        ...briefUrls,
        ...contentUrls,
        ...currentReferenceLinks,
      ].filter(Boolean)))
      if (mergedReferenceLinks.length > 0) {
        updates.brief_data = {
          ...(currentBrief.brief_data || {}),
          ...(briefData || {}),
          referenceLinks: mergedReferenceLinks,
        }
      }

      const { data, error } = await supabase
        .from('briefs')
        .update(updates)
        .eq('id', id)
        .eq('user_email', userEmail)
        .select()
        .single()

      if (error) throw error

      const { data: latestVersion } = await supabase
        .from('brief_versions')
        .select('version')
        .eq('brief_id', id)
        .eq('user_email', userEmail)
        .order('version', { ascending: false })
        .limit(1)
        .maybeSingle()

      const nextVersion = (latestVersion?.version || 0) + 1

      await supabase
        .from('brief_versions')
        .insert([{
          brief_id: id,
          user_email: userEmail,
          name: data.name || currentBrief.name || null,
          brief_data: data.brief_data || currentBrief.brief_data || {},
          markdown_content: data.markdown_content || currentBrief.markdown_content || '',
          version: nextVersion,
          source: body?.source || 'user-save',
          created_at: new Date().toISOString(),
        }])

      // Update conversation title if name provided
      if (name && data?.conversation_id) {
        await supabase
          .from('conversations')
          .update({ title: name })
          .eq('id', data.conversation_id)
      }

      // Map DB fields to frontend expectations
      const mapped = { ...data, content: data.markdown_content }

      console.log(`[Briefs] Brief updated: ${id}`)
      return { success: true, data: mapped }
    } catch (error) {
      console.error('[Briefs] Error updating brief:', error)
      return { success: false, error: 'Failed to update brief' }
    }
  }

  if (event.method === 'DELETE') {
    // Delete brief
    try {
      const { error } = await supabase
        .from('briefs')
        .delete()
        .eq('id', id)
        .eq('user_email', userEmail)

      if (error) throw error
      console.log(`[Briefs] Brief deleted: ${id}`)
      return { success: true }
    } catch (error) {
      console.error('[Briefs] Error deleting brief:', error)
      return { success: false, error: 'Failed to delete brief' }
    }
  }

  return { success: false, error: 'Method not allowed' }
})
