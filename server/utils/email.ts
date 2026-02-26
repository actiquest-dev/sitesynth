import nodemailer from 'nodemailer'

interface EmailOptions {
  to: { email: string; name: string }[]
  subject: string
  htmlContent: string
  sender?: { name: string; email: string }
}

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: '9443c0001@smtp-brevo.com',
    pass: process.env.BREVO_SMTP_PASSWORD || '',
  },
})

export async function sendBrevoEmail(options: EmailOptions) {
  const defaultSender = {
    name: 'SiteSynth',
    email: 'hello@sitesynth.com',
  }

  const sender = options.sender || defaultSender

  try {
    const info = await transporter.sendMail({
      from: `${sender.name} <${sender.email}>`,
      to: options.to.map((r) => `${r.name} <${r.email}>`).join(', '),
      subject: options.subject,
      html: options.htmlContent,
    })

    console.log('✅ Email sent:', info.messageId)
    return { message: 'Email sent', messageId: info.messageId }
  } catch (error: any) {
    console.error('❌ Failed to send email:', error.message)
    throw new Error(error.message || 'Failed to send email')
  }
}

// Convenience function for link submissions
export async function sendLinkSubmission(link: string) {
  return await sendBrevoEmail({
    to: [{ email: 'hello@sitesynth.com', name: 'SiteSynth Team' }],
    subject: 'New Link Submission',
    htmlContent: `<p><strong>Link:</strong> ${link}</p>`,
  })
}

// Convenience function for contact form submissions
export async function sendContactSubmission(formData: {
  fullName: string
  company?: string
  email: string
  phone: string
  topic: string
  message: string
  consent: boolean
}) {
  const htmlContent = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Full Name:</strong> ${formData.fullName}</p>
    <p><strong>Email:</strong> ${formData.email}</p>
    <p><strong>Phone:</strong> ${formData.phone}</p>
    ${formData.company ? `<p><strong>Company:</strong> ${formData.company}</p>` : ''}
    <p><strong>Topic:</strong> ${formData.topic}</p>
    <p><strong>Message:</strong></p>
    <p>${formData.message.replace(/\n/g, '<br>')}</p>
    <p><strong>Data Processing Consent:</strong> ${formData.consent ? 'Yes' : 'No'}</p>
  `

  return await sendBrevoEmail({
    to: [{ email: 'hello@sitesynth.com', name: 'SiteSynth Team' }],
    subject: `New Contact Form Submission from ${formData.fullName}`,
    htmlContent,
  })
}

// Convenience function for Magic Link
export async function sendMagicLinkCode(email: string, code: string) {
  const htmlContent = `
    <h2>Your Verification Code</h2>
    <p>Use this code to access your SiteSynth project:</p>
    <div style="margin: 30px 0; padding: 20px; background-color: #f5f5f5; border-radius: 8px; text-align: center;">
      <p style="font-size: 36px; font-weight: bold; letter-spacing: 5px; margin: 0; color: #0033ff;">${code}</p>
    </div>
    <p style="color: #999;">This code expires in 15 minutes.</p>
    <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
  `

  return await sendBrevoEmail({
    to: [{ email, name: 'User' }],
    subject: 'Your SiteSynth Verification Code',
    htmlContent,
  })
}

