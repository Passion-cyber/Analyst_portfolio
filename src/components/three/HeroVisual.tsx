import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useInView } from 'motion/react'
import { useDeviceCapability } from '@/hooks/useDeviceCapability'
import { cn } from '@/lib/cn'
import { StaticHeroVisual } from './StaticHeroVisual'
import { SceneErrorBoundary } from './SceneErrorBoundary'

// Three.js + R3F live in their own chunk, fetched only when the scene is needed.
const HeroScene = lazy(() => import('./HeroScene'))

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
  cancelIdleCallback?: (id: number) => void
}

const INTENT_EVENTS = ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll'] as const

/**
 * Decides between the WebGL scene and the static SVG:
 * 1. Capable device + motion allowed (see useDeviceCapability)
 * 2. Wait for the visitor's first interaction, then for browser idle, so the
 *    ~200 KB Three.js chunk never competes with first paint or hydration
 * 3. Load it only while the hero is near the viewport
 * 4. Cross-fade from the SVG once the first frame is drawn
 * 5. Pause the render loop whenever the hero scrolls out of view
 */
export function HeroVisual({ className }: { className?: string }) {
  const { canRender3D } = useDeviceCapability()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '120px 0px' })
  const [armed, setArmed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!canRender3D) return
    const w = window as IdleWindow
    let idleId: number | undefined
    const arm = () => {
      INTENT_EVENTS.forEach((e) => window.removeEventListener(e, arm))
      if (w.requestIdleCallback) idleId = w.requestIdleCallback(() => setArmed(true), { timeout: 1500 })
      else idleId = window.setTimeout(() => setArmed(true), 300)
    }
    INTENT_EVENTS.forEach((e) => window.addEventListener(e, arm, { passive: true, once: true }))
    return () => {
      INTENT_EVENTS.forEach((e) => window.removeEventListener(e, arm))
      if (idleId === undefined) return
      if (w.cancelIdleCallback) w.cancelIdleCallback(idleId)
      else window.clearTimeout(idleId)
    }
  }, [canRender3D])

  useEffect(() => {
    if (canRender3D && armed && inView) setMounted(true)
  }, [canRender3D, armed, inView])

  const onReady = useCallback(() => setReady(true), [])
  const show3D = canRender3D && mounted

  return (
    <div ref={ref} className={cn('relative h-full w-full', className)}>
      <StaticHeroVisual
        className={cn('absolute inset-0 transition-opacity duration-1000', show3D && ready ? 'opacity-0' : 'opacity-100')}
      />
      {show3D && (
        <div className={cn('absolute inset-0 transition-opacity duration-1000', ready ? 'opacity-100' : 'opacity-0')}>
          <SceneErrorBoundary>
            <Suspense fallback={null}>
              <HeroScene active={inView} onReady={onReady} />
            </Suspense>
          </SceneErrorBoundary>
        </div>
      )}
    </div>
  )
}
