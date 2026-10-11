import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowUpRight, Check, Copy, LoaderCircle, Mail, Send } from 'lucide-react'
import { profile } from '@/content/profile'
import {
  BUDGET_RANGES,
  PROJECT_TYPES,
  ContactError,
  sendContactMessage,
  type ContactMessage,
} from '@/services/contact'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { GitHubIcon, LinkedInIcon, WhatsAppIcon } from '@/components/ui/BrandIcons'
import { Magnetic } from '@/components/ui/Magnetic'
import { Reveal } from '@/components/ui/Reveal'
import { Section, SectionHeading } from '@/components/ui/Section'
import { useToast } from '@/components/ui/Toast'

type FieldName = 'name' | 'email' | 'projectType' | 'budget' | 'message'
type Errors = Partial<Record<FieldName, string>>

const EMPTY: ContactMessage = { name: '', email: '', projectType: '', budget: '', message: '', company: '' }
const MESSAGE_MIN = 20
const MESSAGE_MAX = 2000
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(values: ContactMessage): Errors {
  const errors: Errors = {}
  const name = values.name.trim()
  if (!name) errors.name = 'Please tell me your name.'
  else if (name.length < 2) errors.name = 'That name looks a little short.'
  if (!values.email.trim()) errors.email = 'An email address is needed so I can reply.'
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Please enter a valid email, e.g. you@company.com.'
  if (!values.projectType) errors.projectType = 'Choose the closest match.'
  if (!values.budget) errors.budget = 'Pick a range — "Not sure yet" is fine.'
  const message = values.message.trim()
  if (!message) errors.message = 'Tell me a little about the project.'
  else if (message.length < MESSAGE_MIN) errors.message = `A bit more detail please (at least ${MESSAGE_MIN} characters).`
  else if (message.length > MESSAGE_MAX) errors.message = `Please keep it under ${MESSAGE_MAX} characters.`
  return errors
}

const FIELD_ORDER: FieldName[] = ['name', 'email', 'projectType', 'budget', 'message']

function ContactForm() {
  const toast = useToast()
  const [searchParams] = useSearchParams()
  const [values, setValues] = useState<ContactMessage>(EMPTY)
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  // "Get started" on a service card links here with ?service=<title>.
  const requested = searchParams.get('service')
  useEffect(() => {
    if (!requested) return
    const match = PROJECT_TYPES.find((t) => t.toLowerCase() === requested.toLowerCase())
    if (match) setValues((v) => ({ ...v, projectType: match }))
  }, [requested])

  const errors = validate(values)
  const visibleError = (field: FieldName) => (submitted || touched[field] ? errors[field] : undefined)

  const update = (field: keyof ContactMessage) => (e: { target: { value: string } }) =>
    setValues((v) => ({ ...v, [field]: e.target.value }))
  const blur = (field: FieldName) => () => setTouched((t) => ({ ...t, [field]: true }))

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
    const firstInvalid = FIELD_ORDER.find((f) => errors[f])
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`#contact-${firstInvalid}`)?.focus()
      return
    }
    setSending(true)
    try {
      const { simulated } = await sendContactMessage({ ...values, name: values.name.trim(), email: values.email.trim(), message: values.message.trim() })
      toast.show({
        tone: 'success',
        title: 'Message sent — thank you!',
        description: simulated && import.meta.env.DEV
          ? 'Dev mode: no form provider configured, so nothing was actually sent.'
          : `I'll reply to ${values.email.trim()} within one business day.`,
      })
      setValues(EMPTY)
      setTouched({})
      setSubmitted(false)
    } catch (error) {
      toast.show({
        tone: 'error',
        title: "Your message didn't go through",
        description:
          error instanceof ContactError ? `${error.message} You can also email ${profile.email}.` : `Please try again or email ${profile.email}.`,
        duration: 9000,
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-x-5 gap-y-3 sm:grid-cols-2" aria-describedby="contact-required-note">
      <FormField id="contact-name" label="Name" required error={visibleError('name')}>
        {(aria) => <input {...aria} name="name" autoComplete="name" placeholder="Jane Doe" value={values.name} onChange={update('name')} onBlur={blur('name')} />}
      </FormField>
      <FormField id="contact-email" label="Email" required error={visibleError('email')}>
        {(aria) => (
          <input {...aria} type="email" name="email" autoComplete="email" inputMode="email" placeholder="jane@company.com" value={values.email} onChange={update('email')} onBlur={blur('email')} />
        )}
      </FormField>
      <FormField id="contact-projectType" label="Project type" required error={visibleError('projectType')}>
        {(aria) => (
          <select {...aria} name="projectType" value={values.projectType} onChange={update('projectType')} onBlur={blur('projectType')}>
            <option value="" disabled>
              Select a project type
            </option>
            {PROJECT_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        )}
      </FormField>
      <FormField id="contact-budget" label="Budget range" required error={visibleError('budget')}>
        {(aria) => (
          <select {...aria} name="budget" value={values.budget} onChange={update('budget')} onBlur={blur('budget')}>
            <option value="" disabled>
              Select a budget
            </option>
            {BUDGET_RANGES.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        )}
      </FormField>
      <FormField
        id="contact-message"
        label="Message"
        required
        className="sm:col-span-2"
        error={visibleError('message')}
        hint={
          <span className="tabular">
            {values.message.trim().length}/{MESSAGE_MAX}
          </span>
        }
      >
        {(aria) => (
          <textarea
            {...aria}
            name="message"
            rows={5}
            maxLength={MESSAGE_MAX + 200}
            placeholder="What data do you have, what decision do you need to make, and by when?"
            value={values.message}
            onChange={update('message')}
            onBlur={blur('message')}
            className={`${aria.className} resize-y`}
          />
        )}
      </FormField>

      {/* Honeypot: hidden from people and assistive tech, tempting for bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 overflow-hidden">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={update('company')} />
      </div>

      <div className="mt-3 flex flex-col-reverse items-start gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p id="contact-required-note" className="text-xs text-subtle">
          <span className="text-accent">*</span> Required. Your details are only used to reply to you.
        </p>
        <Magnetic className="w-full sm:w-auto">
          <Button
            type="submit"
            size="lg"
            disabled={sending}
            aria-busy={sending}
            className="w-full sm:w-auto"
            trailingIcon={sending ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : <Send aria-hidden="true" className="size-4" />}
          >
            {sending ? 'Sending…' : 'Send message'}
          </Button>
        </Magnetic>
      </div>
    </form>
  )
}

function CopyEmail() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard blocked — the mailto link still works */
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? 'Email address copied' : 'Copy email address'}
      className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-muted transition-colors hover:border-accent/60 hover:text-fg"
    >
      {copied ? <Check aria-hidden="true" className="size-4 text-accent" /> : <Copy aria-hidden="true" className="size-4" />}
    </button>
  )
}

export function Contact() {
  const whatsappText = encodeURIComponent(`Hi ${profile.firstName}, I found your portfolio and would like to talk about a data project.`)
  const channels = [
    { label: 'LinkedIn', detail: 'Connect professionally', href: profile.socials.linkedin, icon: <LinkedInIcon size={20} /> },
    { label: 'GitHub', detail: 'Browse the code', href: profile.socials.github, icon: <GitHubIcon size={20} /> },
    { label: 'WhatsApp', detail: 'Chat instantly', href: `https://wa.me/${profile.whatsapp}?text=${whatsappText}`, icon: <WhatsAppIcon size={20} /> },
  ]

  return (
    <Section id="contact" className="pb-32">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <SectionHeading
            id="contact-title"
            index="07"
            eyebrow="Contact"
            title={
              <>
                Have data that needs a <span className="text-accent">clear answer</span>?
              </>
            }
            description="Tell me about the decision you're trying to make. I reply within one business day with next steps, a rough timeline and an honest view on whether I'm the right fit."
            className="mb-10"
          />

          <Reveal stagger={0.08} className="space-y-3">
            <Reveal.Item className="flex items-center gap-4 rounded-2xl border border-line bg-surface/70 p-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                <Mail aria-hidden="true" className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-subtle">Email</p>
                <a href={`mailto:${profile.email}`} className="block truncate font-medium text-fg hover:text-accent">
                  {profile.email}
                </a>
              </div>
              <CopyEmail />
            </Reveal.Item>
            {channels.map((channel) => (
              <Reveal.Item key={channel.label}>
                <a
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border border-line bg-surface/70 p-4 transition-colors hover:border-line-strong"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface-2 text-fg transition-colors group-hover:text-accent">
                    {channel.icon}
                  </span>
                  <span className="flex-1">
                    <span className="block font-medium text-fg">{channel.label}</span>
                    <span className="block text-sm text-muted">{channel.detail}</span>
                  </span>
                  <ArrowUpRight aria-hidden="true" className="size-5 text-subtle transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                </a>
              </Reveal.Item>
            ))}
          </Reveal>
        </div>

        <Reveal delay={0.1} className="relative rounded-[2rem] border border-line bg-surface p-6 shadow-card sm:p-10">
          <h3 className="text-2xl font-semibold">Start a project</h3>
          <p className="mt-2 mb-8 text-muted">Takes about a minute. No sales call required.</p>
          <ContactForm />
        </Reveal>
      </div>
    </Section>
  )
}
