import { memo, useMemo, type CSSProperties } from 'react'
import { cn } from '@/lib/cn'
import { barHeight } from './terrain'

const N = 8 // smaller grid than the 3D scene keeps the pre-rendered HTML light
const CELL_W = 28 // half-width of a cell's top rhombus
const CELL_H = 16 // half-height of a cell's top rhombus
const UNIT = 36 // px per unit of bar height

const r = Math.round

/**
 * Isometric SVG version of the hero bar chart. Shown on low-power devices,
 * with prefers-reduced-motion, without WebGL, and as the placeholder while the
 * 3D scene downloads. Face colours come from `.iso-*` in index.css, driven by
 * one `--m` (accent mix %) per bar, so the markup stays small.
 */
export const StaticHeroVisual = memo(function StaticHeroVisual({ className }: { className?: string }) {
  const bars = useMemo(() => {
    const list: { key: string; top: string; left: string; right: string; mix: number }[] = []
    // Paint back-to-front so nearer bars overlap farther ones.
    for (let sum = 0; sum <= 2 * (N - 1); sum++) {
      for (let x = 0; x < N; x++) {
        const z = sum - x
        if (z < 0 || z >= N) continue
        const h = barHeight(x * 1.75, z * 1.75, 1.2) * UNIT
        const cx = (x - z) * CELL_W
        const cy = (x + z) * CELL_H - h
        const w = CELL_W * 0.78
        const d = CELL_H * 0.78
        list.push({
          key: `${x}-${z}`,
          top: `${r(cx)},${r(cy - d)} ${r(cx + w)},${r(cy)} ${r(cx)},${r(cy + d)} ${r(cx - w)},${r(cy)}`,
          left: `${r(cx - w)},${r(cy)} ${r(cx)},${r(cy + d)} ${r(cx)},${r(cy + d + h)} ${r(cx - w)},${r(cy + h)}`,
          right: `${r(cx + w)},${r(cy)} ${r(cx)},${r(cy + d)} ${r(cx)},${r(cy + d + h)} ${r(cx + w)},${r(cy + h)}`,
          mix: r(20 + Math.min(1, h / (UNIT * 4)) * 75),
        })
      }
    }
    return list
  }, [])

  const width = CELL_W * 2 * N + 40
  const minY = -CELL_H - UNIT * 5
  const height = CELL_H * 2 * N + UNIT * 5 + 40

  return (
    <svg
      viewBox={`${-width / 2} ${minY} ${width} ${height}`}
      className={cn('h-full w-full', className)}
      role="img"
      aria-label="Isometric bar chart illustration rising toward the back corner"
      preserveAspectRatio="xMidYMid meet"
    >
      {bars.map((bar) => (
        <g key={bar.key} style={{ '--m': `${bar.mix}%` } as CSSProperties}>
          <polygon className="iso-l" points={bar.left} />
          <polygon className="iso-r" points={bar.right} />
          <polygon className="iso-t" points={bar.top} />
        </g>
      ))}
    </svg>
  )
})
