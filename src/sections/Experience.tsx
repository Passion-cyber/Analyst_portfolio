import { ArrowUpRight, Award, Briefcase, GraduationCap } from 'lucide-react'
import { getExperience, localContent } from '@/services/content'
import { useResource } from '@/hooks/useResource'
import type { TimelineEntry, TimelineKind } from '@/types/content'
import { cn } from '@/lib/cn'
import { Reveal } from '@/components/ui/Reveal'
import { Section, SectionHeading } from '@/components/ui/Section'
import { LoadingRegion, Skeleton } from '@/components/ui/Skeleton'
import { FallbackNotice } from '@/components/ui/States'

const kindMeta: Record<TimelineKind, { label: string; icon: typeof Briefcase }> = {
  role: { label: 'Role', icon: Briefcase },
  certification: { label: 'Certification', icon: Award },
  education: { label: 'Education', icon: GraduationCap },
}

function TimelineItem({ entry }: { entry: TimelineEntry }) {
  const { icon: KindIcon, label } = kindMeta[entry.kind]
  const current = entry.kind === 'role' && !entry.end
  const period = !entry.start ? undefined : entry.end ? `${entry.start} — ${entry.end}` : entry.kind === 'role' ? `${entry.start} — Present` : entry.start

  return (
    <Reveal as="li" className="relative grid gap-3 pl-12 md:grid-cols-[11rem_1fr] md:gap-10 md:pl-0">
      {/* Date column (desktop) */}
      <div className="hidden pt-5 text-right md:block">
        {period && <p className="font-mono text-sm text-fg tabular">{period}</p>}
        {entry.location && <p className="mt-1 text-sm text-subtle">{entry.location}</p>}
      </div>

      {/* Node on the line */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute top-5 left-0 grid size-9 place-items-center rounded-full border bg-bg md:left-[calc(11rem+1.25rem)] md:-translate-x-1/2',
          current ? 'border-accent text-accent shadow-[0_0_0_6px_var(--accent-glow)]' : 'border-line-strong text-muted',
        )}
      >
        <KindIcon className="size-4" />
      </span>

      <article className="rounded-3xl border border-line bg-surface/70 p-6 transition-colors duration-500 hover:border-line-strong md:ml-10 md:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-accent/10 px-2.5 py-0.5 font-mono text-[0.65rem] tracking-wider text-accent uppercase">
            {label}
          </span>
          {current && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">
              <span className="size-1.5 animate-pulse-dot rounded-full bg-accent" aria-hidden="true" /> Current
            </span>
          )}
          {period && <span className="font-mono text-xs text-subtle md:hidden">{period}</span>}
        </div>
        <h3 className="mt-3 text-xl font-semibold">{entry.title}</h3>
        <p className="mt-1 text-muted">
          {entry.organization}
          {entry.location && <span className="md:hidden"> · {entry.location}</span>}
        </p>
        <p className="mt-4 leading-relaxed text-muted">{entry.description}</p>
        {entry.highlights && entry.highlights.length > 0 && (
          <ul className="mt-4 space-y-2">
            {entry.highlights.map((h) => (
              <li key={h} className="flex gap-3 text-sm text-fg">
                <span aria-hidden="true" className="mt-2 h-px w-3 shrink-0 bg-accent" />
                {h}
              </li>
            ))}
          </ul>
        )}
        {entry.credentialUrl && (
          <a
            href={entry.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
          >
            View credential <ArrowUpRight aria-hidden="true" className="size-3.5" />
            <span className="sr-only">for {entry.title}</span>
          </a>
        )}
      </article>
    </Reveal>
  )
}

export function Experience() {
  const { status, data: timeline, source, retry } = useResource('experience', getExperience, localContent.timeline)

  return (
    <Section id="experience">
      <SectionHeading
        id="experience-title"
        index="05"
        eyebrow="Experience"
        title="Where I've been turning data into decisions."
        description="Roles, certifications and education, most recent first."
      />

      <FallbackNotice source={source} onRetry={retry} />

      {status === 'loading' && !timeline ? (
        <LoadingRegion label="Loading experience" className="space-y-6">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-48 rounded-3xl md:ml-[13.5rem]" />
          ))}
        </LoadingRegion>
      ) : (
        <div className="relative">
          {/* Track + scroll-linked progress line */}
          <div aria-hidden="true" className="absolute top-0 bottom-0 left-[1.125rem] w-px bg-line md:left-[calc(11rem+1.25rem)]" />
          <div
            aria-hidden="true"
            className="timeline-progress absolute top-0 bottom-0 left-[1.125rem] w-px bg-accent md:left-[calc(11rem+1.25rem)]"
          />
          <ol className="relative space-y-8 md:space-y-10">
            {timeline?.map((entry) => (
              <TimelineItem key={`${entry.title}-${entry.organization}`} entry={entry} />
            ))}
          </ol>
        </div>
      )}
    </Section>
  )
}
