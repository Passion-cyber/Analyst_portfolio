import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'motion/react'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

interface CounterProps {
  value: number
  prefix?: string
  suffix?: string
  /** Seconds. */
  duration?: number
  className?: string
}

/** Counts up from 0 to `value` the first time it scrolls into view. */
export function Counter({ value, prefix = '', suffix = '', duration = 2, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reducedMotion = usePrefersReducedMotion()
  const [display, setDisplay] = useState(reducedMotion ? value : 0)

  useEffect(() => {
    if (!inView) return
    if (reducedMotion) {
      setDisplay(value)
      return
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    })
    return () => controls.stop()
  }, [inView, value, duration, reducedMotion])

  return (
    <span ref={ref} className={className}>
      {/* Screen readers get the final value immediately, not every frame. */}
      <span className="sr-only">
        {prefix}
        {value}
        {suffix}
      </span>
      <span aria-hidden="true" className="tabular">
        {prefix}
        {display.toLocaleString('en-US')}
        {suffix}
      </span>
    </span>
  )
}
