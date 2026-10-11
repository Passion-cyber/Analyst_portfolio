import { forwardRef, type ComponentPropsWithoutRef, type ReactNode, type Ref } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface CommonProps {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
  /** Icon rendered after the label, nudged on hover. */
  trailingIcon?: ReactNode
  leadingIcon?: ReactNode
}

type ButtonAsButton = CommonProps & Omit<ComponentPropsWithoutRef<'button'>, keyof CommonProps> & { href?: undefined }
type ButtonAsLink = CommonProps &
  Omit<ComponentPropsWithoutRef<'a'>, keyof CommonProps> & {
    href: string
    /** Treat as external link: opens in a new tab with rel=noopener. */
    external?: boolean
  }

export type ButtonProps = ButtonAsButton | ButtonAsLink

const variants: Record<Variant, string> = {
  primary:
    'bg-accent text-accent-fg shadow-[0_0_0_1px_var(--accent),0_10px_30px_-10px_var(--accent-glow)] hover:bg-accent-strong hover:shadow-[0_0_0_1px_var(--accent-strong),0_16px_40px_-12px_var(--accent-glow)]',
  secondary:
    'border border-line-strong bg-surface/60 text-fg backdrop-blur hover:border-accent/60 hover:bg-surface-2/80',
  ghost: 'text-muted hover:text-fg hover:bg-surface-2/70',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm gap-1.5',
  md: 'h-11 px-5 text-[0.9375rem] gap-2',
  lg: 'h-13 px-7 text-base gap-2.5',
}

/**
 * One button for every call to action. Renders a <button>, a router <Link>
 * (internal paths) or an <a> (hashes, mailto, external) based on `href`.
 */
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(function Button(props, ref) {
  const { variant = 'primary', size = 'md', className, children, trailingIcon, leadingIcon, ...rest } = props
  const classes = cn(
    'group/btn relative inline-flex shrink-0 items-center justify-center rounded-full font-medium whitespace-nowrap',
    'transition-[background-color,border-color,box-shadow,color,transform] duration-300 ease-out-expo active:scale-[0.98]',
    'disabled:pointer-events-none disabled:opacity-60',
    variants[variant],
    sizes[size],
    className,
  )
  const content = (
    <>
      {leadingIcon}
      <span>{children}</span>
      {trailingIcon && (
        <span className="transition-transform duration-300 ease-out-expo group-hover/btn:translate-x-0.5">
          {trailingIcon}
        </span>
      )}
    </>
  )

  if (rest.href !== undefined) {
    const { href, external, ...anchorProps } = rest as ButtonAsLink
    const isInternalRoute = href.startsWith('/') && !external && !/\.[a-z0-9]+$/i.test(href)
    if (isInternalRoute) {
      return (
        <Link ref={ref as Ref<HTMLAnchorElement>} to={href} className={classes} {...anchorProps}>
          {content}
        </Link>
      )
    }
    return (
      <a
        ref={ref as Ref<HTMLAnchorElement>}
        href={href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...anchorProps}
      >
        {content}
      </a>
    )
  }

  const { type = 'button', ...buttonProps } = rest as ButtonAsButton
  return (
    <button ref={ref as Ref<HTMLButtonElement>} type={type} className={classes} {...buttonProps}>
      {content}
    </button>
  )
})
