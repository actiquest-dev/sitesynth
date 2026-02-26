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

// Convenience function for Payment Confirmation
export async function sendPaymentConfirmation(paymentData: {
  email: string
  fullName: string
  orderNumber: string
  amount: number
  currency: string
  paymentMethod: string
  projectStartDate: string
}) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #0033ff; margin: 0;">Payment Confirmation</h1>
        <p style="color: #666; margin: 10px 0 0 0;">Your order has been successfully processed</p>
      </div>

      <!-- Success Message -->
      <div style="background-color: #f0f9ff; border-left: 4px solid #00cc44; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
        <p style="color: #00cc44; font-weight: bold; margin: 0;">✓ Payment Confirmed</p>
        <p style="color: #666; margin: 10px 0 0 0;">Thank you for your purchase, ${paymentData.fullName}!</p>
      </div>

      <!-- Order Details -->
      <div style="background-color: #f5f5f5; padding: 20px; margin-bottom: 30px; border-radius: 8px;">
        <h2 style="color: #333; margin-top: 0; font-size: 16px;">Order Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; color: #666; border-bottom: 1px solid #ddd;">Order Number:</td>
            <td style="padding: 10px 0; color: #333; font-weight: bold; border-bottom: 1px solid #ddd; text-align: right;">${paymentData.orderNumber}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #666; border-bottom: 1px solid #ddd;">Amount:</td>
            <td style="padding: 10px 0; color: #333; font-weight: bold; border-bottom: 1px solid #ddd; text-align: right;">${paymentData.currency} ${(paymentData.amount / 100).toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #666; border-bottom: 1px solid #ddd;">Payment Method:</td>
            <td style="padding: 10px 0; color: #333; font-weight: bold; border-bottom: 1px solid #ddd; text-align: right;">${paymentData.paymentMethod}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #666;">Project Start Date:</td>
            <td style="padding: 10px 0; color: #333; font-weight: bold; text-align: right;">${paymentData.projectStartDate}</td>
          </tr>
        </table>
      </div>

      <!-- Next Steps -->
      <div style="background-color: #fff; border: 1px solid #ddd; padding: 20px; margin-bottom: 30px; border-radius: 8px;">
        <h2 style="color: #333; margin-top: 0; font-size: 16px;">What's Next?</h2>
        <ol style="color: #666; line-height: 1.8;">
          <li style="margin-bottom: 10px;">Our team will review your project requirements</li>
          <li style="margin-bottom: 10px;">We'll send you a project kickoff email on ${paymentData.projectStartDate}</li>
          <li style="margin-bottom: 10px;">Development will begin immediately</li>
          <li>You'll receive regular updates on your project progress</li>
        </ol>
      </div>

      <!-- Contact Info -->
      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #ddd;">
        <p style="color: #666; margin: 0;">Questions? Contact us at <strong>hello@sitesynth.com</strong></p>
        <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">© 2026 SiteSynth. All rights reserved.</p>
      </div>
    </div>
  `

  return await sendBrevoEmail({
    to: [{ email: paymentData.email, name: paymentData.fullName }],
    subject: `Payment Confirmation - Order ${paymentData.orderNumber}`,
    htmlContent,
  })
}

