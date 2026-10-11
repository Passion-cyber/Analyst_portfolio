import {
  Children,
  cloneElement,
  createElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/cn'

type Tag = 'div' | 'section' | 'li' | 'ul' | 'ol' | 'article' | 'header' | 'p' | 'span'

// One observer per threshold shared by every <Reveal> on the page.
const observers = new Map<number, IntersectionObserver>()
const callbacks = new WeakMap<Element, () => void>()

function observeOnce(element: Element, amount: number, onEnter: () => void) {
  if (typeof IntersectionObserver === 'undefined') {
    onEnter()
    return () => {}
  }
  let observer = observers.get(amount)
  if (!observer) {
    observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          callbacks.get(entry.target)?.()
          callbacks.delete(entry.target)
          obs.unobserve(entry.target)
        }
      },
      { threshold: amount, rootMargin: '0px 0px -5% 0px' },
    )
    observers.set(amount, observer)
  }
  callbacks.set(element, onEnter)
  observer.observe(element)
  return () => {
    callbacks.delete(element)
    observer.unobserve(element)
  }
}

interface RevealProps {
  children: ReactNode
  as?: Tag
  className?: string
  /** Seconds before the reveal starts. */
  delay?: number
  /** Starting vertical offset in px. */
  y?: number
  /** Reveal direct <Reveal.Item> children one after another, this many seconds apart. */
  stagger?: number
  /** Fraction of the element that must be visible to trigger. */
  amount?: number
  id?: string
}

/**
 * Fades + lifts content into view once, when it enters the viewport.
 * Pure CSS transitions (see `.reveal` in index.css); honours reduced motion
 * through the global CSS guard and shows everything when JS is off.
 */
export function Reveal({ children, as = 'div', className, delay = 0, y = 24, stagger, amount = 0.15, id }: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    return observeOnce(ref.current, amount, () => setRevealed(true))
  }, [amount])

  const style = {
    '--reveal-delay': `${delay}s`,
    '--reveal-y': `${y}px`,
    ...(stagger ? { '--reveal-stagger': `${stagger}s` } : {}),
  } as CSSProperties

  // Give each staggered child its index so CSS can compute its delay.
  const content = stagger
    ? Children.map(children, (child, i) =>
        isValidElement(child) ? cloneElement(child as ReactElement<{ index?: number }>, { index: i }) : child,
      )
    : children

  return createElement(
    as,
    {
      ref,
      id,
      style,
      className: cn(stagger ? 'reveal-group' : 'reveal', className),
      'data-revealed': revealed ? '' : undefined,
    },
    content,
  )
}

interface RevealItemProps {
  children: ReactNode
  as?: Tag
  className?: string
  /** Injected by the parent <Reveal stagger>. */
  index?: number
}

/** Child of a staggered <Reveal>. Revealed together with its parent, offset by its index. */
function RevealItem({ children, as = 'div', className, index = 0 }: RevealItemProps) {
  return createElement(as, { className: cn('reveal-item', className), style: { '--reveal-i': index } as CSSProperties }, children)
}

Reveal.Item = RevealItem
