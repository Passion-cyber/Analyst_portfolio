import { Link } from 'react-router-dom'
import { ArrowRight, Check, MessageCircle } from 'lucide-react'
import { profile } from '@/content/profile'
import { getServices, localContent } from '@/services/content'
import { useResource } from '@/hooks/useResource'
import type { Service } from '@/types/content'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Magnetic } from '@/components/ui/Magnetic'
import { Reveal } from '@/components/ui/Reveal'
import { Section, SectionHeading } from '@/components/ui/Section'
import { LoadingRegion, Skeleton } from '@/components/ui/Skeleton'
import { FallbackNotice } from '@/components/ui/States'

/** Contact form reads ?service= to preselect the project type. */
const contactHref = (service: string) => `/?service=${encodeURIComponent(service)}#contact`

function ServiceCard({ service, index }: { service: Service; index: number }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface p-7 transition-all duration-500 hover:-translate-y-1 hover:border-accent/50 hover:shadow-card sm:p-8">
      <div className="flex items-center justify-between">
        <span className="grid size-12 place-items-center rounded-2xl border border-line bg-surface-2 text-accent transition-colors duration-500 group-hover:border-accent/40">
          <Icon name={service.icon} className="size-6" />
        </span>
        <span className="font-mono text-xs text-subtle tabular">0{index + 1}</span>
      </div>
      <h3 className="mt-6 text-2xl font-semibold">{service.title}</h3>
      <p className="mt-3 leading-relaxed text-muted">{service.description}</p>
      <ul className="mt-6 mb-8 space-y-2.5">
        {service.deliverables.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-fg">
            <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" />
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex items-center justify-between gap-4 border-t border-line pt-6">
        <p className="font-mono text-sm text-fg">{service.pricing}</p>
        <Link
          to={contactHref(service.title)}
          className="group/cta inline-flex items-center gap-1.5 text-sm font-medium text-accent"
        >
          Get started
          <span className="sr-only"> with {service.title}</span>
          <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
        </Link>
      </div>
    </article>
  )
}

export function Services() {
  const { status, data: services, source, retry } = useResource('services', getServices, localContent.services)

  return (
    <Section id="services">
      <SectionHeading
        id="services-title"
        index="04"
        eyebrow="Services"
        title="How I can help your team."
        description="Fixed-scope packages for common needs, or a custom engagement when the problem is bigger. Every project ends with documentation and a handover, so you are never locked in."
      />

      <FallbackNotice source={source} onRetry={retry} />

      {status === 'loading' && !services ? (
        <LoadingRegion label="Loading services" className="grid gap-5 md:grid-cols-2">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-96 rounded-3xl" />
          ))}
        </LoadingRegion>
      ) : (
        <Reveal stagger={0.08} className="grid gap-5 md:grid-cols-2">
          {services?.map((service, i) => (
            <Reveal.Item key={service.title} className="h-full">
              <ServiceCard service={service} index={i} />
            </Reveal.Item>
          ))}
        </Reveal>
      )}

      {/* Conversion banner */}
      <Reveal className="relative mt-10 overflow-hidden rounded-3xl border border-accent/30 bg-surface p-8 sm:p-10">
        <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <h3 className="text-2xl font-semibold sm:text-3xl">Not sure where to start?</h3>
            <p className="mt-2 text-muted">
              Book a free 20-minute data audit call. Bring your messiest spreadsheet; leave with three quick wins.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Magnetic>
              <Button href="#contact" size="lg" className="w-full sm:w-auto" trailingIcon={<ArrowRight aria-hidden="true" className="size-4" />}>
                Book a free audit
              </Button>
            </Magnetic>
            <Button
              href={`https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(`Hi ${profile.firstName}, I'd like to book a free data audit call.`)}`}
              external
              variant="secondary"
              size="lg"
              leadingIcon={<MessageCircle aria-hidden="true" className="size-4" />}
            >
              Chat on WhatsApp
            </Button>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
