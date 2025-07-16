interface EmailOptions {
  to: { email: string; name: string }[]
  subject: string
  htmlContent: string
  sender?: { name: string; email: string }
}

export async function sendBrevoEmail(options: EmailOptions) {
  const brevoApiKey = process.env.BREVO_API_KEY
  
  if (!brevoApiKey) {
    throw new Error('Brevo API key not configured')
  }

  const defaultSender = {
    name: 'Tech Paw',
    email: 'marco@tech-paw.com',
  }

  return await $fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'api-key': brevoApiKey,
      'Content-Type': 'application/json',
    },
    body: {
      sender: options.sender || defaultSender,
      to: options.to,
      subject: options.subject,
      htmlContent: options.htmlContent,
    },
  })
}

// Convenience function for link submissions
export async function sendLinkSubmission(link: string) {
  return await sendBrevoEmail({
    to: [{ email: 'marco@tech-paw.com', name: 'Marco Maffei' }],
    subject: 'New Link Submission',
    htmlContent: `<p><strong>Link:</strong> ${link}</p>`,
  })
}
