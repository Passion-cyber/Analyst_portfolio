import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/space-grotesk/wght.css'
import '@fontsource-variable/inter/wght.css'
import '@fontsource-variable/jetbrains-mono/wght.css'
import './index.css'
import App, { preloadRoute } from './App'

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Production pages are pre-rendered (scripts/prerender.mjs) and carry the path
// they were rendered for. Hydrate when it matches; otherwise render from scratch
// (dev server, or a URL that fell through to 404.html, e.g. an API-only project).
const pathname = location.pathname.replace(/(.)\/+$/, '$1')
const prerendered = container.dataset.path
const matches =
  prerendered === pathname || (prerendered === '/404' && pathname !== '/' && !pathname.startsWith('/projects/'))

if (container.hasChildNodes() && matches) {
  preloadRoute(pathname).finally(() => hydrateRoot(container, app))
} else {
  container.textContent = ''
  createRoot(container).render(app)
}
