import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Reveal } from './Reveal'

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}>{children}</div>
}

interface SectionProps {
  id: string
  children: ReactNode
  className?: string
  /** Accessible name when the section has no visible heading id. */
  labelledBy?: string
}

/** Landing-page section with consistent vertical rhythm and an anchor id. */
export function Section({ id, children, className, labelledBy }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy ?? `${id}-title`} className={cn('relative py-24 sm:py-32', className)}>
      <Container>{children}</Container>
    </section>
  )
}

interface SectionHeadingProps {
  /** Must be `${sectionId}-title` so the section is labelled for screen readers. */
  id: string
  index: string
  eyebrow: string
  title?: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  className?: string
  action?: ReactNode
}

/** "03 — Projects" eyebrow, large display title and optional supporting copy. */
export function SectionHeading({ id, index, eyebrow, title, description, align = 'left', className, action }: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        'mb-12 flex flex-col gap-6 sm:mb-16 md:flex-row md:items-end md:justify-between',
        align === 'center' && 'items-center text-center md:flex-col md:items-center',
        className,
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        <p className="mb-4 inline-flex items-center gap-3 font-mono text-xs tracking-[0.2em] text-accent uppercase">
          <span className="tabular">{index}</span>
          <span aria-hidden="true" className="h-px w-8 bg-accent/60" />
          {eyebrow}
        </p>
        <h2 id={id} className="text-3xl leading-[1.05] font-semibold sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        {description && <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  )
}
