import type { ComponentType, ReactNode } from 'react'
import { Route, Routes } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import { Layout } from '@/components/layout/Layout'
import { ToastProvider } from '@/components/ui/Toast'

export interface PageComponents {
  Home: ComponentType
  Project: ComponentType
  NotFound: ComponentType
}

/** Providers shared by the browser app and the build-time prerender. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    // "user" = honour the OS reduced-motion setting for every motion component.
    <MotionConfig reducedMotion="user">
      <ToastProvider>{children}</ToastProvider>
    </MotionConfig>
  )
}

/**
 * The route table. The browser passes lazy (code-split) pages; the prerender
 * passes the same pages eagerly so it can render them to HTML.
 */
export function AppRoutes({ pages }: { pages: PageComponents }) {
  const { Home, Project, NotFound } = pages
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="projects/:slug" element={<Project />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
