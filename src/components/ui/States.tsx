import { CircleAlert, RotateCw } from 'lucide-react'
import type { ReactNode } from 'react'
import type { DataSource } from '@/services/api'
import { cn } from '@/lib/cn'
import { Button } from './Button'

interface ErrorStateProps {
  title?: string
  message?: ReactNode
  onRetry?: () => void
  className?: string
  children?: ReactNode
}

/** Full error panel for when content could not be loaded at all. */
export function ErrorState({
  title = 'Something went wrong',
  message = 'This content could not be loaded. Check your connection and try again.',
  onRetry,
  className,
  children,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn('flex flex-col items-center rounded-2xl border border-line bg-surface/70 px-6 py-12 text-center', className)}
    >
      <span className="mb-4 grid size-12 place-items-center rounded-full bg-accent/10 text-accent">
        <CircleAlert aria-hidden="true" className="size-6" />
      </span>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-muted">{message}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {onRetry && (
          <Button variant="secondary" size="sm" onClick={onRetry} leadingIcon={<RotateCw aria-hidden="true" className="size-4" />}>
            Try again
          </Button>
        )}
        {children}
      </div>
    </div>
  )
}

/**
 * Small inline notice shown when the API failed and local content is displayed
 * instead. Non-blocking: visitors still see the full section.
 */
export function FallbackNotice({ source, onRetry }: { source?: DataSource; onRetry: () => void }) {
  if (source !== 'fallback') return null
  return (
    <div
      role="status"
      className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-line bg-surface-2/60 px-4 py-3 text-sm text-muted"
    >
      <CircleAlert aria-hidden="true" className="size-4 text-accent" />
      <span>Live data is unavailable right now. Showing the latest saved version.</span>
      <button
        type="button"
        onClick={onRetry}
        className="ml-auto inline-flex items-center gap-1.5 font-medium text-fg underline-offset-4 hover:underline"
      >
        <RotateCw aria-hidden="true" className="size-3.5" /> Retry
      </button>
    </div>
  )
}
