import { useMemo } from 'react'
import { useTheme } from './useTheme'

const TOKENS = ['accent', 'fg', 'muted', 'subtle', 'line', 'line-strong', 'surface', 'surface-2', 'chart-1', 'chart-2'] as const
type Token = (typeof TOKENS)[number]

/**
 * Resolved theme colours for libraries that need literal colour strings
 * (Recharts, canvas). Re-reads the CSS variables whenever the theme flips.
 */
export function useThemeColors(): Record<Token, string> {
  const { theme } = useTheme()
  return useMemo(() => {
    const styles = getComputedStyle(document.documentElement)
    return Object.fromEntries(TOKENS.map((t) => [t, styles.getPropertyValue(`--${t}`).trim()])) as Record<Token, string>
    // `theme` is the trigger: the CSS variables change when it does.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme])
}
