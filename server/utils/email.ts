interface EmailOptions {
  to: { email: string; name: string }[]
  subject: string
  htmlContent: string
  sender?: { name: string; email: string }
}

export async function sendBrevoEmail(options: EmailOptions) {
  const brevoApiKey = process.env.BREVO_API_KEY;
  if (!brevoApiKey) {
    throw new Error('Brevo API key not configured');
  }

  // Always use SiteSynth sender
  const sender = {
    name: 'SiteSynth',
    email: 'hello@sitesynth.com',
  };

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'api-key': brevoApiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender,
      to: options.to,
      subject: options.subject,
      htmlContent: options.htmlContent,
    }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to send email');
  }
  return await response.json();
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