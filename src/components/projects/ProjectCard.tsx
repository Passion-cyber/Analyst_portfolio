import { useRef, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { ArrowUpRight, ChartColumnBig } from 'lucide-react'
import type { Project } from '@/types/content'
import { useMediaQuery, usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { GitHubIcon } from '@/components/ui/BrandIcons'
import { ResponsiveImage } from '@/components/ui/ResponsiveImage'
import { ProjectThumbnail } from './ProjectThumbnail'

/** Project card with a subtle 3D hover tilt toward the cursor. */
export function ProjectCard({ project }: { project: Project }) {
  const ref = useRef<HTMLElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const interactive = finePointer && !reducedMotion

  const rotateX = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 })

  const onMove = (event: PointerEvent<HTMLElement>) => {
    if (!interactive || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    rotateY.set((px - 0.5) * 7)
    rotateX.set((0.5 - py) * 7)
  }
  const onLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  const caseStudyHref = `/projects/${project.slug}`

  return (
    <motion.article
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={interactive ? { rotateX, rotateY, transformPerspective: 1100 } : undefined}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-card transition-colors duration-500 hover:border-accent/50"
    >
      <Link to={caseStudyHref} tabIndex={-1} aria-hidden="true" className="relative block aspect-[16/10] overflow-hidden border-b border-line">
        <div className="h-full w-full transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]">
          {project.thumbnail ? (
            <ResponsiveImage image={project.thumbnail} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
          ) : (
            <ProjectThumbnail project={project} />
          )}
        </div>
        <span className="absolute top-3 right-3 rounded-full border border-line-strong bg-surface/85 px-2.5 py-1 font-mono text-[0.65rem] tracking-wider text-fg uppercase backdrop-blur">
          {project.category}
        </span>
      </Link>

      <div className="relative z-20 flex flex-1 flex-col p-6">
        <p className="font-mono text-xs text-subtle">
          {project.client} · {project.year}
        </p>
        <h3 className="mt-2 text-xl leading-snug font-semibold">
          <Link to={caseStudyHref} className="transition-colors hover:text-accent">
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{project.summary}</p>

        <div className="mt-5 flex items-baseline gap-3 rounded-2xl border border-line bg-surface-2/60 px-4 py-3">
          <span className="font-mono text-2xl font-semibold text-accent tabular">{project.keyMetric.value}</span>
          <span className="text-sm leading-tight text-muted">{project.keyMetric.label}</span>
        </div>

        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Tools used">
          {project.tools.slice(0, 4).map((tool) => (
            <li key={tool} className="rounded-full border border-line px-2.5 py-1 text-xs text-muted">
              {tool}
            </li>
          ))}
          {project.tools.length > 4 && (
            <li className="rounded-full px-1.5 py-1 text-xs text-subtle">+{project.tools.length - 4} more</li>
          )}
        </ul>

        <div className="mt-auto flex items-center gap-2 pt-6">
          <Link
            to={caseStudyHref}
            className="group/link mr-auto inline-flex items-center gap-1.5 rounded-full text-sm font-medium text-fg"
          >
            Read case study
            <ArrowUpRight aria-hidden="true" className="size-4 text-accent transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
            <span className="sr-only">: {project.title}</span>
          </Link>
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} source code on GitHub`}
              className="grid size-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-accent/60 hover:text-fg"
            >
              <GitHubIcon size={16} />
            </a>
          )}
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} live dashboard`}
              className="grid size-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-accent/60 hover:text-fg"
            >
              <ChartColumnBig aria-hidden="true" className="size-4" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}

export function ProjectCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-surface">
      <div className="skeleton aspect-[16/10]" />
      <div className="space-y-3 p-6">
        <div className="skeleton h-3 w-28 rounded-full" />
        <div className="skeleton h-6 w-3/4 rounded-lg" />
        <div className="skeleton h-4 w-full rounded-lg" />
        <div className="skeleton h-4 w-5/6 rounded-lg" />
        <div className="skeleton mt-4 h-14 w-full rounded-2xl" />
      </div>
    </div>
  )
}
