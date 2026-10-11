import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { navLinks, profile } from '@/content/profile'
import { useActiveSection } from '@/hooks/useActiveSection'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { Magnetic } from '@/components/ui/Magnetic'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { GitHubIcon, LinkedInIcon } from '@/components/ui/BrandIcons'
import { Logo } from './Logo'

const sectionIds = navLinks.map((link) => link.id)

interface NavAnchorProps {
  id: string
  isHome: boolean
  current?: boolean
  className: string
  onNavigate?: () => void
  children: ReactNode
}

/** On the home page, plain hash links scroll natively; elsewhere route back home first. */
function NavAnchor({ id, isHome, current, className, onNavigate, children }: NavAnchorProps) {
  return isHome ? (
    <a href={`#${id}`} className={className} aria-current={current ? 'location' : undefined} onClick={onNavigate}>
      {children}
    </a>
  ) : (
    <Link to={`/#${id}`} className={className} onClick={onNavigate}>
      {children}
    </Link>
  )
}

export function Navbar() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const active = useActiveSection(isHome ? sectionIds : [])
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock scroll + close on Escape while the mobile menu is open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  useEffect(() => setOpen(false), [pathname])

  const hrefFor = (id: string) => (isHome ? `#${id}` : `/#${id}`)

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          'border-b transition-[background-color,border-color,backdrop-filter] duration-500',
          scrolled || open ? 'border-line bg-bg/70 backdrop-blur-xl backdrop-saturate-150' : 'border-transparent bg-transparent',
        )}
      >
        <nav aria-label="Primary" className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-[4.5rem] sm:px-6 lg:px-8">
          <Logo onClick={() => setOpen(false)} />

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <li key={link.id} className="relative">
                <NavAnchor
                  id={link.id}
                  isHome={isHome}
                  current={active === link.id}
                  className={cn(
                    'relative block rounded-full px-3.5 py-2 text-sm transition-colors',
                    active === link.id ? 'text-fg' : 'text-muted hover:text-fg',
                  )}
                >
                  {active === link.id && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-full bg-surface-2"
                      transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                    />
                  )}
                  {link.label}
                </NavAnchor>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {/* Hidden on the narrowest phones, where it lives in the menu instead. */}
            <div className="hidden min-[400px]:block">
              <Magnetic>
                <Button href={hrefFor('contact')} size="sm" trailingIcon={<ArrowUpRight aria-hidden="true" className="size-4" />}>
                  Hire Me
                </Button>
              </Magnetic>
            </div>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="grid size-10 place-items-center rounded-full border border-line text-fg lg:hidden"
            >
              {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
            </button>
          </div>
        </nav>
        {/* Page progress: CSS scroll-driven animation (.scroll-progress in index.css). */}
        <div aria-hidden="true" className="scroll-progress h-px bg-accent/80" />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-16 bottom-0 overflow-y-auto border-t border-line bg-bg/95 backdrop-blur-xl sm:top-[4.5rem] lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-4 pt-6 sm:px-6">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i + 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <NavAnchor
                    id={link.id}
                    isHome={isHome}
                    onNavigate={() => setOpen(false)}
                    className="flex items-baseline gap-4 rounded-xl px-2 py-3 font-display text-3xl font-medium text-fg hover:text-accent"
                  >
                    <span className="font-mono text-xs text-subtle tabular">0{i + 1}</span>
                    {link.label}
                  </NavAnchor>
                </motion.li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-6 border-t border-line px-6 py-8">
              <Button href={hrefFor('contact')} size="lg" className="w-full" onClick={() => setOpen(false)}>
                Hire Me
              </Button>
              <div className="flex items-center justify-center gap-6 text-muted">
                <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" className="hover:text-fg">
                  <LinkedInIcon size={22} />
                </a>
                <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" className="hover:text-fg">
                  <GitHubIcon size={22} />
                </a>
                <a href={`mailto:${profile.email}`} className="text-sm hover:text-fg">
                  {profile.email}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
