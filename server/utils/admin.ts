export const resolveAdminEmail = () => process.env.ADMIN_EMAIL || 'hello@sitesynth.com'

export const isAdminEmail = (email?: string | null) => {
  if (!email) return false
  return email.toLowerCase() === resolveAdminEmail().toLowerCase()
}
