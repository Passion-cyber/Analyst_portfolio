// Relative imports (no "@/" alias) because the build-time prerender also loads this file.
import { profile } from '../content/profile'
import type { Project } from '../types/content'

/** Everything that goes into <head> for one route. Used at runtime (<Seo>) and when prerendering. */
export interface PageMeta {
  title: string
  description: string
  /** Route path, e.g. "/projects/foo". */
  path: string
  type?: 'website' | 'article'
  image?: string
  jsonLd?: Record<string, unknown>
  noindex?: boolean
}

export const homeMeta = (): PageMeta => ({
  title: `${profile.name} · ${profile.role} — Data into decisions`,
  description: profile.seoDescription,
  path: '/',
})

export const projectMeta = (project: Project, siteUrl: string): PageMeta => ({
  title: `${project.title} — Case study · ${profile.name}`,
  description: project.summary,
  path: `/projects/${project.slug}`,
  type: 'article',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    headline: project.title,
    description: project.summary,
    dateCreated: String(project.year),
    keywords: project.tools.join(', '),
    url: `${siteUrl}/projects/${project.slug}`,
    author: { '@type': 'Person', name: profile.name, jobTitle: profile.role, url: siteUrl },
  },
})

export const projectNotFoundMeta = (slug: string): PageMeta => ({
  title: `Case study not found · ${profile.name}`,
  description: 'This case study does not exist or has moved.',
  path: `/projects/${slug}`,
  noindex: true,
})

export const notFoundMeta = (): PageMeta => ({
  title: `Page not found · ${profile.name}`,
  description: 'The page you were looking for does not exist.',
  path: '/404',
  noindex: true,
})
