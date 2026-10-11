import type { IconName } from '@/types/content'
import { cn } from '@/lib/cn'
import { Icon } from './Icon'
import { LogoMark } from '@/components/layout/Logo'

interface ToolOrbitProps {
  tools: { name: string; icon: IconName }[]
  className?: string
}

/**
 * Tool icons orbiting a central core on two counter-rotating rings.
 * Pure CSS transforms (GPU-composited) — far cheaper than a second WebGL
 * canvas — and the global reduced-motion rule stops it automatically.
 */
export function ToolOrbit({ tools, className }: ToolOrbitProps) {
  const inner = tools.filter((_, i) => i % 2 === 0)
  const outer = tools.filter((_, i) => i % 2 === 1)

  return (
    <div
      className={cn('relative mx-auto aspect-square w-full max-w-[26rem]', className)}
      role="img"
      aria-label={`Toolkit: ${tools.map((t) => t.name).join(', ')}`}
    >
      <Ring tools={outer} radius={44} seconds={70} />
      <Ring tools={inner} radius={27} seconds={50} reverse offset={45} />

      <div aria-hidden="true" className="absolute inset-[39%] grid place-items-center rounded-full border border-line-strong bg-surface shadow-card">
        <div className="absolute inset-0 animate-pulse-dot rounded-full" />
        <LogoMark className="size-9 sm:size-11" />
      </div>
    </div>
  )
}

interface RingProps {
  tools: { name: string; icon: IconName }[]
  /** Radius as % of the container width. */
  radius: number
  seconds: number
  reverse?: boolean
  offset?: number
}

function Ring({ tools, radius, seconds, reverse = false, offset = 0 }: RingProps) {
  const spin = `${reverse ? 'orbit-reverse' : 'orbit'} ${seconds}s linear infinite`
  // Same duration, opposite direction → icons stay upright while the ring turns.
  const counterSpin = `${reverse ? 'orbit' : 'orbit-reverse'} ${seconds}s linear infinite`

  return (
    <div aria-hidden="true" className="absolute inset-0">
      <div className="absolute rounded-full border border-dashed border-line-strong" style={{ inset: `${50 - radius}%` }} />
      <div className="absolute inset-0" style={{ animation: spin }}>
        {tools.map((tool, i) => {
          const angle = ((offset + (360 / tools.length) * i) * Math.PI) / 180
          return (
            <div
              key={tool.name}
              className="absolute size-11 -translate-x-1/2 -translate-y-1/2 sm:size-12"
              style={{ left: `${50 + radius * Math.cos(angle)}%`, top: `${50 + radius * Math.sin(angle)}%` }}
            >
              <div
                className="grid size-full place-items-center rounded-2xl border border-line-strong bg-surface shadow-card"
                style={{ animation: counterSpin }}
                title={tool.name}
              >
                <Icon name={tool.icon} className="size-5 text-accent" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
