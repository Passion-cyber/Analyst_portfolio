/**
 * Build-time renderer used by scripts/prerender.mjs (never shipped to browsers).
 * Renders each route to static HTML so pages paint before any JavaScript runs
 * and crawlers / link previews get real content and per-page meta tags.
 */
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { AppProviders, AppRoutes } from './AppRoutes'
import HomePage from './pages/HomePage'
import ProjectPage from './pages/ProjectPage'
import NotFoundPage from './pages/NotFoundPage'
import { projects } from './content/projects'
import { homeMeta, notFoundMeta, projectMeta, type PageMeta } from './lib/seo'

const pages = { Home: HomePage, Project: ProjectPage, NotFound: NotFoundPage }

export function render(url: string): string {
  return renderToString(
    <AppProviders>
      <StaticRouter location={url}>
        <AppRoutes pages={pages} />
      </StaticRouter>
    </AppProviders>,
  )
}

export interface PrerenderRoute {
  url: string
  /** Output file relative to dist/. */
  file: string
  meta: PageMeta
}

export function getPrerenderRoutes(siteUrl: string): PrerenderRoute[] {
  return [
    { url: '/', file: 'index.html', meta: homeMeta() },
    ...projects.map((p) => ({ url: `/projects/${p.slug}`, file: `projects/${p.slug}/index.html`, meta: projectMeta(p, siteUrl) })),
    { url: '/404', file: '404.html', meta: notFoundMeta() },
  ]
}
