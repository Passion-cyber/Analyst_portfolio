import { env } from '@/lib/env'

/**
 * Contact form delivery without a custom backend.
 * Pick a provider with VITE_FORM_PROVIDER (web3forms | formspree | emailjs)
 * and set its keys in .env — see .env.example and the README.
 */

export const PROJECT_TYPES = [
  'Dashboard Development',
  'Data Cleaning & Preparation',
  'Business Reporting',
  'Predictive Analysis',
  'Full-time / contract role',
  'Something else',
] as const

export const BUDGET_RANGES = ['Under $500', '$500 – $1,500', '$1,500 – $5,000', '$5,000+', 'Not sure yet'] as const

export interface ContactMessage {
  name: string
  email: string
  projectType: string
  budget: string
  message: string
  /** Honeypot — must stay empty. Bots tend to fill every field. */
  company?: string
}

export class ContactError extends Error {
  constructor(
    message: string,
    public readonly kind: 'config' | 'network' | 'provider',
  ) {
    super(message)
    this.name = 'ContactError'
  }
}

export function isContactConfigured() {
  const { provider, web3formsKey, formspreeId, emailjs } = env.form
  if (provider === 'formspree') return Boolean(formspreeId)
  if (provider === 'emailjs') return Boolean(emailjs.serviceId && emailjs.templateId && emailjs.publicKey)
  return Boolean(web3formsKey)
}

async function post(url: string, body: unknown) {
  let response: Response
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new ContactError('Network error — check your connection and try again.', 'network')
  }
  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new ContactError(`The message could not be delivered (${response.status}). ${detail.slice(0, 120)}`.trim(), 'provider')
  }
}

export async function sendContactMessage(data: ContactMessage): Promise<{ simulated: boolean }> {
  // Silently "succeed" for bots so they don't retry.
  if (data.company) return { simulated: true }

  const subject = `Portfolio enquiry: ${data.projectType} from ${data.name}`
  const { provider, web3formsKey, formspreeId, emailjs } = env.form

  if (!isContactConfigured()) {
    if (import.meta.env.DEV) {
      console.info('[contact] No form provider configured — simulating a successful send.', data)
      await new Promise((r) => setTimeout(r, 900))
      return { simulated: true }
    }
    throw new ContactError('The contact form is not configured yet. Please email directly instead.', 'config')
  }

  const fields = {
    name: data.name,
    email: data.email,
    project_type: data.projectType,
    budget: data.budget,
    message: data.message,
  }

  switch (provider) {
    case 'formspree':
      await post(`https://formspree.io/f/${formspreeId}`, { ...fields, _subject: subject, _replyto: data.email })
      break
    case 'emailjs':
      await post('https://api.emailjs.com/api/v1.0/email/send', {
        service_id: emailjs.serviceId,
        template_id: emailjs.templateId,
        user_id: emailjs.publicKey,
        template_params: { ...fields, subject, reply_to: data.email },
      })
      break
    default:
      await post('https://api.web3forms.com/submit', {
        access_key: web3formsKey,
        subject,
        from_name: data.name,
        replyto: data.email,
        ...fields,
      })
  }
  return { simulated: false }
}
