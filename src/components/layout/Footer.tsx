import { Link, useLocation } from 'react-router-dom'
import { ArrowUp, ArrowUpRight, Mail } from 'lucide-react'
import { navLinks, profile } from '@/content/profile'
import { Container } from '@/components/ui/Section'
import { GitHubIcon, LinkedInIcon, WhatsAppIcon } from '@/components/ui/BrandIcons'
import { Logo } from './Logo'

export function Footer() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const year = new Date().getFullYear()

  const socials = [
    { label: 'LinkedIn', href: profile.socials.linkedin, icon: <LinkedInIcon size={18} /> },
    { label: 'GitHub', href: profile.socials.github, icon: <GitHubIcon size={18} /> },
    { label: 'WhatsApp', href: `https://wa.me/${profile.whatsapp}`, icon: <WhatsAppIcon size={18} /> },
    { label: 'Email', href: `mailto:${profile.email}`, icon: <Mail aria-hidden="true" className="size-[18px]" /> },
  ]

  return (
    <footer className="relative overflow-hidden border-t border-line">
      <Container className="relative">
        <div className="grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:py-20">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 leading-relaxed text-muted">
              Turning messy data into clear business decisions. Dashboards, SQL analysis and clean, trusted data for teams
              that want answers, not more spreadsheets.
            </p>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm text-muted">
              <span className="size-2 animate-pulse-dot rounded-full bg-accent" aria-hidden="true" />
              {profile.availability}
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="font-mono text-xs tracking-[0.2em] text-subtle uppercase">Quick links</h2>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-1">
              {navLinks.map((link) => (
                <li key={link.id}>
                  {isHome ? (
                    <a href={`#${link.id}`} className="text-muted transition-colors hover:text-fg">
                      {link.label}
                    </a>
                  ) : (
                    <Link to={`/#${link.id}`} className="text-muted transition-colors hover:text-fg">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-mono text-xs tracking-[0.2em] text-subtle uppercase">Connect</h2>
            <ul className="mt-5 space-y-3">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    {...(social.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="group inline-flex items-center gap-3 text-muted transition-colors hover:text-fg"
                  >
                    <span className="grid size-9 place-items-center rounded-full border border-line transition-colors group-hover:border-accent/60 group-hover:text-accent">
                      {social.icon}
                    </span>
                    {social.label}
                    <ArrowUpRight aria-hidden="true" className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col-reverse items-start justify-between gap-4 border-t border-line py-6 text-sm text-subtle sm:flex-row sm:items-center">
          <p>
            © {year} {profile.name}. All rights reserved.
          </p>
          <a href="#top" className="inline-flex items-center gap-2 transition-colors hover:text-fg">
            Back to top <ArrowUp aria-hidden="true" className="size-4" />
          </a>
        </div>
      </Container>
    </footer>
  )
}
