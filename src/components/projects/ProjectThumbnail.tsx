import { memo, type ReactNode } from 'react'
import type { Project } from '@/types/content'

const W = 400
const H = 250
const PAD_X = 28
const TOP = 96
const BOTTOM = 222

const seriesColor = (tone: 'primary' | 'secondary' | undefined, index: number) =>
  (tone ?? (index === 0 ? 'primary' : 'secondary')) === 'primary' ? 'var(--chart-1)' : 'var(--chart-2)'

/**
 * Generated "dashboard tile" drawn from the project's own chart data — so every
 * card has a unique, on-brand thumbnail without shipping screenshots.
 * Decorative: the card's text carries all the information.
 */
export const ProjectThumbnail = memo(function ProjectThumbnail({ project }: { project: Project }) {
  const { chart } = project.caseStudy
  const series = chart.series.slice(0, 2)
  const values = chart.data.flatMap((row) => series.map((s) => Number(row[s.key]) || 0))
  const max = Math.max(...values, 1)
  const n = chart.data.length
  const plotW = W - PAD_X * 2
  const y = (v: number) => BOTTOM - (v / max) * (BOTTOM - TOP)
  const x = (i: number) => PAD_X + (n === 1 ? plotW / 2 : (i / (n - 1)) * plotW)

  let marks: ReactNode
  if (chart.type === 'bar') {
    const slot = plotW / n
    const barW = Math.max(4, (slot - 8) / series.length - 2)
    marks = chart.data.map((row, i) =>
      series.map((s, j) => {
        const v = Number(row[s.key]) || 0
        const h = Math.max(2, BOTTOM - y(v))
        return (
          <rect
            key={`${i}-${s.key}`}
            x={PAD_X + i * slot + 4 + j * (barW + 2)}
            y={BOTTOM - h}
            width={barW}
            height={h}
            rx={Math.min(4, barW / 2)}
            style={{ fill: seriesColor(s.tone, j) }}
          />
        )
      }),
    )
  } else {
    marks = series.map((s, j) => {
      const points = chart.data.map((row, i) => `${x(i)},${y(Number(row[s.key]) || 0)}`)
      const color = seriesColor(s.tone, j)
      return (
        <g key={s.key}>
          {chart.type === 'area' && j === 0 && (
            <path d={`M${points.join(' L')} L${x(n - 1)},${BOTTOM} L${x(0)},${BOTTOM} Z`} style={{ fill: 'var(--chart-1)' }} fillOpacity={0.16} />
          )}
          <polyline
            points={points.join(' ')}
            fill="none"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={j === 1 ? '6 5' : undefined}
            style={{ stroke: color }}
          />
          {j === 0 && <circle cx={x(n - 1)} cy={y(Number(chart.data[n - 1][s.key]) || 0)} r={5} style={{ fill: color, stroke: 'var(--surface)' }} strokeWidth={2} />}
        </g>
      )
    })
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <rect width={W} height={H} style={{ fill: 'var(--surface-2)' }} />
      {/* Window chrome */}
      <g style={{ fill: 'var(--line-strong)' }}>
        <circle cx="22" cy="20" r="4" />
        <circle cx="36" cy="20" r="4" />
        <circle cx="50" cy="20" r="4" />
      </g>
      <rect x="300" y="13" width="78" height="14" rx="7" style={{ fill: 'var(--line)' }} />
      {/* KPI tile */}
      <text x={PAD_X} y="58" fontFamily="var(--font-mono)" fontSize="24" fontWeight="600" style={{ fill: 'var(--fg)' }}>
        {project.keyMetric.value}
      </text>
      <rect x={PAD_X} y="70" width="120" height="6" rx="3" style={{ fill: 'var(--line-strong)' }} />
      <rect x={PAD_X + 130} y="70" width="60" height="6" rx="3" style={{ fill: 'var(--line)' }} />
      {/* Gridlines */}
      <g style={{ stroke: 'var(--line)' }} strokeWidth="1">
        {[0, 1, 2, 3].map((k) => (
          <line key={k} x1={PAD_X} x2={W - PAD_X} y1={TOP + (k * (BOTTOM - TOP)) / 3} y2={TOP + (k * (BOTTOM - TOP)) / 3} />
        ))}
      </g>
      {marks}
    </svg>
  )
})
