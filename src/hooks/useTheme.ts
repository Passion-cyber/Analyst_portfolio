import { useCallback, useSyncExternalStore } from 'react'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'theme'
const listeners = new Set<() => void>()

const read = (): Theme => (document.documentElement.classList.contains('dark') ? 'dark' : 'light')

function apply(theme: Theme) {
  const root = document.documentElement
  // Suppress transitions for one frame so the whole page switches at once.
  root.classList.add('[&_*]:!transition-none')
  root.classList.toggle('dark', theme === 'dark')
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    /* private mode — the choice simply won't persist */
  }
  requestAnimationFrame(() => root.classList.remove('[&_*]:!transition-none'))
  listeners.forEach((notify) => notify())
}

const subscribe = (notify: () => void) => {
  listeners.add(notify)
  return () => listeners.delete(notify)
}

/** Current theme + toggle. The initial class is set by an inline script in index.html. */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, read, () => 'dark' as Theme)
  const toggle = useCallback(() => apply(read() === 'dark' ? 'light' : 'dark'), [])
  return { theme, toggle, setTheme: apply }
}
