/** Typed, normalised access to VITE_* environment variables. */
const trimSlash = (value?: string) => (value ?? '').trim().replace(/\/+$/, '')

export const env = {
  siteUrl: trimSlash(import.meta.env.VITE_SITE_URL) || (typeof window !== 'undefined' ? window.location.origin : ''),
  apiBaseUrl: trimSlash(import.meta.env.VITE_API_BASE_URL),
  apiTimeoutMs: Number(import.meta.env.VITE_API_TIMEOUT_MS) || 6000,
  form: {
    provider: import.meta.env.VITE_FORM_PROVIDER ?? 'web3forms',
    web3formsKey: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ?? '',
    formspreeId: import.meta.env.VITE_FORMSPREE_FORM_ID ?? '',
    emailjs: {
      serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID ?? '',
      templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? '',
      publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? '',
    },
  },
} as const
