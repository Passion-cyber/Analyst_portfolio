import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { getProjects, localContent } from '@/services/content'
import { useResource } from '@/hooks/useResource'
import { PROJECT_CATEGORIES, type ProjectCategory } from '@/types/content'
import { cn } from '@/lib/cn'
import { Section, SectionHeading } from '@/components/ui/Section'
import { LoadingRegion } from '@/components/ui/Skeleton'
import { ErrorState, FallbackNotice } from '@/components/ui/States'
import { ProjectCard, ProjectCardSkeleton } from '@/components/projects/ProjectCard'

type Filter = 'All' | ProjectCategory

export function Projects() {
  const { status, data: projects, source, error, retry } = useResource('projects', getProjects, localContent.projects)
  const [filter, setFilter] = useState<Filter>('All')

  const counts = useMemo(() => {
    const map = new Map<Filter, number>([['All', projects?.length ?? 0]])
    PROJECT_CATEGORIES.forEach((c) => map.set(c, projects?.filter((p) => p.category === c).length ?? 0))
    return map
  }, [projects])

  const visible = useMemo(
    () =>
      (projects ?? [])
        .filter((p) => filter === 'All' || p.category === filter)
        // Featured first, then newest.
        .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || b.year - a.year),
    [projects, filter],
  )

  const filters: Filter[] = ['All', ...PROJECT_CATEGORIES.filter((c) => (counts.get(c) ?? 0) > 0)]

  return (
    <Section id="projects">
      <SectionHeading
        id="projects-title"
        index="03"
        eyebrow="Featured Projects"
        title={
          <>
            Real problems. Measurable <span className="text-accent">results</span>.
          </>
        }
        description="Every project starts with a business question and ends with a number that moved. Open any case study for the full story: data, approach, and impact."
      />

      <FallbackNotice source={source} onRetry={retry} />

      <div role="group" aria-label="Filter projects by category" className="-mx-4 mb-10 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        <div className="inline-flex gap-1 rounded-full border border-line bg-surface/70 p-1 backdrop-blur">
          {filters.map((item) => {
            const active = filter === item
            return (
              <button
                key={item}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(item)}
                className={cn(
                  'relative rounded-full px-4 py-2 text-sm whitespace-nowrap transition-colors duration-300',
                  active ? 'text-accent-fg' : 'text-muted hover:text-fg',
                )}
              >
                {active && (
                  <motion.span
                    layoutId="project-filter"
                    className="absolute inset-0 rounded-full bg-accent"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">
                  {item}
                  <span className={cn('ml-1.5 font-mono text-xs tabular', active ? 'opacity-80' : 'text-subtle')}>
                    {counts.get(item)}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {status === 'loading' && !projects ? (
        <LoadingRegion label="Loading projects" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </LoadingRegion>
      ) : status === 'error' ? (
        <ErrorState title="Projects couldn't load" message={error?.message} onRetry={retry} />
      ) : (
        <>
          <p className="sr-only" aria-live="polite">
            Showing {visible.length} {filter === 'All' ? '' : filter} project{visible.length === 1 ? '' : 's'}
          </p>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((project, i) => (
                <motion.li
                  key={project.slug}
                  layout
                  initial={{ opacity: 0, y: 24, scale: 0.97 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.15 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: (i % 3) * 0.08 }}
                >
                  <ProjectCard project={project} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </>
      )}
    </Section>
  )
}
