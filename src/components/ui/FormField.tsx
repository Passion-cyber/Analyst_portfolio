import type { ReactNode } from 'react'
import { CircleAlert } from 'lucide-react'
import { cn } from '@/lib/cn'

export const inputClasses = cn(
  'w-full rounded-xl border bg-surface-2/50 px-4 py-3 text-fg placeholder:text-subtle',
  'transition-[border-color,box-shadow,background-color] duration-300',
  'focus:border-accent focus:bg-surface focus:shadow-[0_0_0_4px_var(--accent-glow)] focus:outline-none',
)

interface FormFieldProps {
  id: string
  label: string
  error?: string
  hint?: ReactNode
  required?: boolean
  className?: string
  /** Render prop gets the aria wiring to spread on the control. */
  children: (aria: { id: string; 'aria-invalid': boolean; 'aria-describedby'?: string; className: string }) => ReactNode
}

/** Label + control + hint/error, with ids wired for screen readers. */
export function FormField({ id, label, error, hint, required, className, children }: FormFieldProps) {
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(' ') || undefined
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-fg">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-accent">
            *
          </span>
        )}
      </label>
      {children({
        id,
        'aria-invalid': Boolean(error),
        'aria-describedby': describedBy,
        className: cn(inputClasses, error ? 'border-rose-500/70' : 'border-line'),
      })}
      <div className="mt-1.5 flex min-h-5 items-start justify-between gap-3 text-xs">
        {error ? (
          <p id={`${id}-error`} className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
            <CircleAlert aria-hidden="true" className="size-3.5 shrink-0" />
            {error}
          </p>
        ) : (
          <span />
        )}
        {hint && (
          <span id={`${id}-hint`} className="text-subtle">
            {hint}
          </span>
        )}
      </div>
    </div>
  )
}
