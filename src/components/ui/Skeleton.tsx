import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Shimmering placeholder block shown while remote content loads. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn('skeleton rounded-xl', className)} />
}

/** Announces loading state once for assistive tech while skeletons are visible. */
export function LoadingRegion({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div role="status" aria-live="polite" aria-busy="true" className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  )
}
