import { getStats, localContent } from '@/services/content'
import { useResource } from '@/hooks/useResource'
import { Counter } from '@/components/ui/Counter'
import { Container } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { LoadingRegion, Skeleton } from '@/components/ui/Skeleton'

/** Animated impact counters, styled as a KPI strip from a dashboard. */
export function Stats() {
  const { status, data: stats } = useResource('stats', getStats, localContent.stats)

  return (
    <section id="stats" aria-label="Impact in numbers" className="relative py-12 sm:py-16">
      <Container>
        {status === 'loading' && !stats ? (
          <LoadingRegion label="Loading impact numbers" className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="bg-surface p-6 sm:p-8">
                <Skeleton className="h-12 w-24" />
                <Skeleton className="mt-4 h-4 w-32" />
              </div>
            ))}
          </LoadingRegion>
        ) : (
          <Reveal
            as="ul"
            stagger={0.08}
            className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line shadow-card lg:grid-cols-4"
          >
            {stats?.map((stat, i) => (
              <Reveal.Item as="li" key={stat.label} className="group relative bg-surface p-6 sm:p-8">
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-6 h-px w-10 bg-accent transition-all duration-500 group-hover:w-20 sm:left-8"
                />
                <p className="font-mono text-[0.65rem] tracking-[0.2em] text-subtle uppercase">
                  KPI · 0{i + 1}
                </p>
                <Counter
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  className="mt-3 block font-mono text-4xl font-semibold tracking-tight text-fg sm:text-5xl"
                />
                <p className="mt-3 font-medium text-fg">{stat.label}</p>
                <p className="mt-1 text-sm leading-snug text-muted">{stat.description}</p>
              </Reveal.Item>
            ))}
          </Reveal>
        )}
      </Container>
    </section>
  )
}
