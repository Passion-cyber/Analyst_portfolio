import { lazy } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppProviders, AppRoutes, type PageComponents } from './AppRoutes'

// Each route is its own chunk (code splitting per route).
const loaders = {
  home: () => import('@/pages/HomePage'),
  project: () => import('@/pages/ProjectPage'),
  notFound: () => import('@/pages/NotFoundPage'),
}

const pages: PageComponents = {
  Home: lazy(loaders.home),
  Project: lazy(loaders.project),
  NotFound: lazy(loaders.notFound),
}

/** Downloads the chunk for `pathname` so a pre-rendered page can hydrate without waiting. */
export function preloadRoute(pathname: string) {
  if (pathname === '/') return loaders.home()
  if (/^\/projects\/[^/]+$/.test(pathname)) return loaders.project()
  return loaders.notFound()
}

export default function App() {
  return (
    <AppProviders>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRoutes pages={pages} />
      </BrowserRouter>
    </AppProviders>
  )
}
