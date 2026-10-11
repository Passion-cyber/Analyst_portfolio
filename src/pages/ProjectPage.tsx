import { lazy, Suspense, useMemo, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight, ChartColumnBig, Lightbulb } from 'lucide-react'
import { findLocalProject, getProject, getProjects, localContent } from '@/services/content'
import { useResource } from '@/hooks/useResource'
import { env } from '@/lib/env'
import { projectMeta, projectNotFoundMeta } from '@/lib/seo'
import type { Project } from '@/types/content'
import { Button } from '@/components/ui/Button'
import { GitHubIcon } from '@/components/ui/BrandIcons'
import { Magnetic } from '@/components/ui/Magnetic'
import { Reveal } from '@/components/ui/Reveal'
import { Container } from '@/components/ui/Section'
import { Seo } from '@/components/ui/Seo'
import { LoadingRegion, Skeleton } from '@/components/ui/Skeleton'
import { ErrorState, FallbackNotice } from '@/components/ui/States'

// Recharts is only downloaded on case-study pages.
const ResultsChart = lazy(() => import('@/components/projects/ResultsChart'))

const chapters = [
  { id: 'problem', label: 'The problem' },
  { id: 'dataset', label: 'The dataset' },
  { id: 'approach', label: 'Approach' },
  { id: 'results', label: 'Results' },
  { id: 'insights', label: 'Key insights' },
  { id: 'impact', label: 'Business impact' },
]

function Chapter({ id, index, title, children }: { id: string; index: number; title: string; children: ReactNode }) {
  return (
    <Reveal as="section" id={id} className="scroll-mt-28">
      <h2 className="flex items-baseline gap-4 text-2xl font-semibold sm:text-3xl">
        <span className="font-mono text-sm font-normal text-accent tabular">0{index}</span>
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </Reveal>
  )
}

function CaseStudySkeleton() {
  return (
    <LoadingRegion label="Loading case study" className="pt-32 pb-24">
      <Container>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-8 h-14 w-3/4" />
        <Skeleton className="mt-4 h-6 w-1/2" />
        <div className="mt-12 grid gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
        <Skeleton className="mt-12 h-96 rounded-3xl" />
      </Container>
    </LoadingRegion>
  )
}

function CaseStudy({ project, all }: { project: Project; all: Project[] }) {
  const { caseStudy: cs } = project
  const position = all.findIndex((p) => p.slug === project.slug)
  const next = all.length > 1 ? all[(position + 1) % all.length] : null

  const pageMeta = useMemo(() => projectMeta(project, env.siteUrl), [project])

  const meta = [
    { label: 'Client', value: project.client },
    { label: 'Role', value: project.role },
    { label: 'Timeline', value: `${project.duration} · ${project.year}` },
    { label: 'Category', value: project.category },
  ]

  return (
    <article>
      <Seo {...pageMeta} />

      {/* Header */}
      <header className="relative border-b border-line bg-surface pt-28 pb-16 sm:pt-36 sm:pb-20">
        <Container>
          {/* Above the fold: CSS-only entrance so the title paints before JS (fast LCP). */}
          <div className="animate-nudge-up">
            <Link
              to="/#projects"
              className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
            >
              <ArrowLeft aria-hidden="true" className="size-4 transition-transform group-hover:-translate-x-0.5" />
              All projects
            </Link>
            <p className="mt-10 font-mono text-xs tracking-[0.2em] text-accent uppercase">Case study · {project.category}</p>
            <h1 className="mt-4 max-w-4xl text-4xl leading-[1.05] font-semibold sm:text-6xl">{project.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">{project.summary}</p>
          </div>

          <div className="mt-12 grid animate-fade-up gap-6 lg:grid-cols-[1fr_auto] lg:items-end" style={{ animationDelay: '0.15s' }}>
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
              {meta.map((m) => (
                <div key={m.label} className="bg-surface px-5 py-4">
                  <dt className="font-mono text-[0.65rem] tracking-[0.2em] text-subtle uppercase">{m.label}</dt>
                  <dd className="mt-1.5 text-sm text-fg">{m.value}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-wrap gap-3">
              {project.links.live && (
                <Magnetic>
                  <Button href={project.links.live} external leadingIcon={<ChartColumnBig aria-hidden="true" className="size-4" />}>
                    Live dashboard
                  </Button>
                </Magnetic>
              )}
              {project.links.github && (
                <Button href={project.links.github} external variant="secondary" leadingIcon={<GitHubIcon size={16} />}>
                  View code
                </Button>
              )}
            </div>
          </div>
        </Container>
      </header>

      {/* Body */}
      <Container className="grid gap-12 py-16 sm:py-24 lg:grid-cols-[13rem_1fr] lg:gap-16">
        <nav aria-label="Case study sections" className="hidden lg:block">
          <ol className="sticky top-28 space-y-1 border-l border-line">
            {chapters.map((c, i) => (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  className="-ml-px flex gap-3 border-l border-transparent py-1.5 pl-4 text-sm text-muted transition-colors hover:border-accent hover:text-fg"
                >
                  <span className="font-mono text-xs text-subtle tabular">0{i + 1}</span>
                  {c.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="min-w-0 space-y-20">
          {/* Headline result */}
          <Reveal className="relative overflow-hidden rounded-3xl border border-accent/30 bg-surface p-8 sm:p-10">
            <p className="font-mono text-xs tracking-[0.2em] text-subtle uppercase">Headline result</p>
            <p className="mt-3 font-mono text-5xl font-semibold text-accent tabular sm:text-7xl">{project.keyMetric.value}</p>
            <p className="mt-2 text-lg text-fg">{project.keyMetric.label}</p>
          </Reveal>

          <Chapter id="problem" index={1} title="The problem">
            <p className="max-w-3xl text-lg leading-relaxed text-muted">{cs.problem}</p>
          </Chapter>

          <Chapter id="dataset" index={2} title="The dataset">
            <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
              <h3 className="text-lg font-semibold">{cs.dataset.name}</h3>
              <p className="mt-2 text-muted">{cs.dataset.description}</p>
              <dl className="mt-6 grid gap-4 border-t border-line pt-6 sm:grid-cols-3">
                {[
                  ['Source', cs.dataset.source],
                  ['Size', cs.dataset.size],
                  ['Timeframe', cs.dataset.timeframe],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="font-mono text-[0.65rem] tracking-[0.2em] text-subtle uppercase">{label}</dt>
                    <dd className="mt-1 font-mono text-sm text-fg">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Chapter>

          <Chapter id="approach" index={3} title="Approach">
            <ol className="relative space-y-4">
              {cs.approach.map((step, i) => (
                <li key={step.title} className="flex gap-5 rounded-2xl border border-line bg-surface/60 p-5 sm:p-6">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent/10 font-mono text-sm font-semibold text-accent tabular">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="mt-1 text-muted">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-6">
              <p className="mb-3 font-mono text-xs tracking-[0.2em] text-subtle uppercase">Tools</p>
              <ul className="flex flex-wrap gap-2">
                {project.tools.map((tool) => (
                  <li key={tool} className="rounded-full border border-line px-3 py-1.5 text-sm text-fg">
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          </Chapter>

          <Chapter id="results" index={4} title="Results">
            <Suspense fallback={<Skeleton className="h-[440px] rounded-3xl" />}>
              <ResultsChart chart={cs.chart} />
            </Suspense>
          </Chapter>

          <Chapter id="insights" index={5} title="Key insights">
            <ul className="grid gap-4 md:grid-cols-2">
              {cs.insights.map((insight) => (
                <li key={insight} className="flex gap-4 rounded-2xl border border-line bg-surface/60 p-5">
                  <Lightbulb aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent" />
                  <p className="text-fg">{insight}</p>
                </li>
              ))}
            </ul>
          </Chapter>

          <Chapter id="impact" index={6} title="Business impact">
            <ul className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-3">
              {cs.impact.map((m) => (
                <li key={m.label} className="bg-surface p-6 sm:p-8">
                  <p className="font-mono text-3xl font-semibold text-fg tabular sm:text-4xl">{m.value}</p>
                  <p className="mt-2 text-sm text-muted">{m.label}</p>
                </li>
              ))}
            </ul>
          </Chapter>

          {/* Conversion + next project */}
          <Reveal className="grid gap-5 md:grid-cols-2">
            <div className="flex flex-col justify-between rounded-3xl border border-line bg-surface p-8">
              <div>
                <h2 className="text-2xl font-semibold">Facing a similar problem?</h2>
                <p className="mt-2 text-muted">Let's look at your data together and find the fastest path to an answer.</p>
              </div>
              <Button href="/#contact" className="mt-8 self-start" trailingIcon={<ArrowRight aria-hidden="true" className="size-4" />}>
                Let's work together
              </Button>
            </div>
            {next && (
              <Link
                to={`/projects/${next.slug}`}
                className="group flex flex-col justify-between rounded-3xl border border-line bg-surface p-8 transition-colors hover:border-accent/50"
              >
                <p className="font-mono text-xs tracking-[0.2em] text-subtle uppercase">Next case study</p>
                <div className="mt-6">
                  <p className="text-2xl font-semibold transition-colors group-hover:text-accent">{next.title}</p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-muted">
                    <span className="font-mono text-accent">{next.keyMetric.value}</span> {next.keyMetric.label}
                    <ArrowUpRight aria-hidden="true" className="ml-auto size-5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </p>
                </div>
              </Link>
            )}
          </Reveal>
        </div>
      </Container>
    </article>
  )
}

export default function ProjectPage() {
  const { slug = '' } = useParams()
  const project = useResource(`project:${slug}`, () => getProject(slug), findLocalProject(slug))
  const list = useResource('projects', getProjects, localContent.projects)

  if (project.status === 'loading' && !project.data) return <CaseStudySkeleton />

  if (project.status === 'error' || !project.data) {
    return (
      <Container className="pt-36 pb-24">
        <Seo {...projectNotFoundMeta(slug)} />
        <ErrorState
          title={project.status === 'error' ? "This case study couldn't load" : 'Case study not found'}
          message={
            project.status === 'error'
              ? project.error?.message
              : "This project doesn't exist or may have been renamed. Browse all projects instead."
          }
          onRetry={project.status === 'error' ? project.retry : undefined}
        >
          <Button href="/#projects" variant="secondary" size="sm" leadingIcon={<ArrowLeft aria-hidden="true" className="size-4" />}>
            All projects
          </Button>
        </ErrorState>
      </Container>
    )
  }

  return (
    <>
      {project.source === 'fallback' && (
        <Container className="pt-24">
          <FallbackNotice source={project.source} onRetry={project.retry} />
        </Container>
      )}
      <CaseStudy key={project.data.slug} project={project.data} all={list.data ?? localContent.projects} />
    </>
  )
}
