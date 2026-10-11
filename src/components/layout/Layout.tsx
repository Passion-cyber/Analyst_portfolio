import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

/**
 * Route changes: scroll to the #hash target if there is one (retrying while
 * lazy sections mount), otherwise to the top.
 */
function ScrollManager() {
  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
      return
    }
    let attempts = 0
    let frame = 0
    const tryScroll = () => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (target) target.scrollIntoView({ block: 'start' })
      else if (attempts++ < 60) frame = requestAnimationFrame(tryScroll)
    }
    tryScroll()
    return () => cancelAnimationFrame(frame)
    // `key` changes on every navigation, so re-clicking a link to the same #hash still scrolls.
  }, [pathname, hash, key])

  return null
}

function PageFallback() {
  return <div className="min-h-screen" aria-busy="true" />
}

export function Layout() {
  return (
    <div id="top" className="relative flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only z-[200] rounded-full bg-accent px-4 py-2 font-medium text-accent-fg focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Skip to content
      </a>
      <ScrollManager />
      <Navbar />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
