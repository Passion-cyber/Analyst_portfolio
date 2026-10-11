import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from './useMediaQuery'

interface NavigatorWithHints extends Navigator {
  deviceMemory?: number
  connection?: { saveData?: boolean; effectiveType?: string }
}

/**
 * Cheap checks only. Creating a WebGL context just to inspect the GPU costs
 * hundreds of milliseconds, so GPU quality is left to the 3D canvas itself:
 * it asks for `failIfMajorPerformanceCaveat` and falls back to the static SVG
 * when the browser would render WebGL in software.
 */
function isLowPower() {
  const nav = navigator as NavigatorWithHints
  const cores = nav.hardwareConcurrency ?? 8
  const memory = nav.deviceMemory ?? 8
  const saveData = Boolean(nav.connection?.saveData) || /(^|-)2g$/.test(nav.connection?.effectiveType ?? '')
  return cores <= 2 || memory <= 2 || saveData || typeof WebGLRenderingContext === 'undefined'
}

/**
 * Decides whether heavy 3D may render: not with reduced motion, Save-Data,
 * ≤2 cores / ≤2 GB RAM, or without WebGL. SSR-safe: reports "no 3D" until mounted.
 */
export function useDeviceCapability() {
  const reducedMotion = usePrefersReducedMotion()
  const [lowPower, setLowPower] = useState<boolean | null>(null)

  useEffect(() => setLowPower(isLowPower()), [])

  return { reducedMotion, lowPower, canRender3D: lowPower === false && !reducedMotion }
}
