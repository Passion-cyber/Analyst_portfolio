import { useRef, type PointerEvent, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { useMediaQuery, usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/cn'

interface MagneticProps {
  children: ReactNode
  /** How far (px) the element can travel toward the cursor. */
  strength?: number
  className?: string
}

/**
 * Wraps a button/link so it is gently pulled toward the cursor.
 * Disabled for touch devices and reduced-motion users.
 */
export function Magnetic({ children, strength = 10, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 })
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 })
  const enabled = finePointer && !reducedMotion

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!enabled || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const relX = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
    const relY = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
    x.set(relX * strength)
    y.set(relY * strength * 0.6)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={enabled ? { x, y } : undefined}
      className={cn('inline-flex', className)}
    >
      {children}
    </motion.div>
  )
}
