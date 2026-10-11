import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CircleAlert, CircleCheck, Info, X } from 'lucide-react'
import { cn } from '@/lib/cn'

type ToastTone = 'success' | 'error' | 'info'

interface Toast {
  id: number
  tone: ToastTone
  title: string
  description?: string
}

interface ToastApi {
  show: (toast: Omit<Toast, 'id'> & { duration?: number }) => void
  dismiss: (id: number) => void
}

const ToastContext = createContext<ToastApi | null>(null)

const toneStyles: Record<ToastTone, { icon: typeof Info; className: string }> = {
  success: { icon: CircleCheck, className: 'text-accent' },
  error: { icon: CircleAlert, className: 'text-rose-500 dark:text-rose-400' },
  info: { icon: Info, className: 'text-muted' },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(1)

  const dismiss = useCallback((id: number) => setToasts((list) => list.filter((t) => t.id !== id)), [])

  const show = useCallback<ToastApi['show']>(
    ({ duration = 6000, ...toast }) => {
      const id = nextId.current++
      setToasts((list) => [...list.slice(-2), { ...toast, id }])
      window.setTimeout(() => dismiss(id), duration)
    },
    [dismiss],
  )

  const api = useMemo(() => ({ show, dismiss }), [show, dismiss])

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        aria-relevant="additions"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col items-end gap-3 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-96"
      >
        <AnimatePresence initial={false}>
          {toasts.map((toast) => {
            const { icon: ToneIcon, className } = toneStyles[toast.tone]
            return (
              <motion.div
                key={toast.id}
                layout
                role={toast.tone === 'error' ? 'alert' : 'status'}
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 24, transition: { duration: 0.2 } }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className="pointer-events-auto flex w-full gap-3 rounded-2xl border border-line-strong bg-surface/95 p-4 shadow-card backdrop-blur-xl"
              >
                <ToneIcon aria-hidden="true" className={cn('mt-0.5 size-5 shrink-0', className)} />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-fg">{toast.title}</p>
                  {toast.description && <p className="mt-1 text-sm text-muted">{toast.description}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(toast.id)}
                  className="-m-1 grid size-8 shrink-0 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-fg"
                  aria-label="Dismiss notification"
                >
                  <X aria-hidden="true" className="size-4" />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used inside <ToastProvider>')
  return context
}
