import { Link } from 'react-router-dom'
import { profile } from '@/content/profile'
// import { cn } from '@/lib/cn'

/** Monogram: three ascending bars — a tiny chart that reads as a "growth" mark. */
// export function LogoMark({ className }: { className?: string }) {
//   return (
//     <svg viewBox="0 0 32 32" aria-hidden="true" className={cn('size-8', className)}>
//       <rect width="32" height="32" rx="9" className="fill-fg" />
//       <rect x="8" y="17" width="4" height="7" rx="1.5" className="fill-bg" opacity="0.55" />
//       <rect x="14" y="12.5" width="4" height="11.5" rx="1.5" className="fill-bg" opacity="0.8" />
//       <rect x="20" y="8" width="4" height="16" rx="1.5" className="fill-accent" />
//     </svg>
//   )
// }

export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className="group flex items-center gap-2.5 rounded-lg font-display text-lg font-semibold tracking-tight"
      aria-label={`${profile.name}, ${profile.role} — home`}
    >
      {/* <LogoMark className="transition-transform duration-500 ease-out-expo group-hover:-rotate-6" /> */}
      <span>
        {profile.firstName}
        <span className="text-accent">.</span>
      </span>
    </Link>
  )
}
