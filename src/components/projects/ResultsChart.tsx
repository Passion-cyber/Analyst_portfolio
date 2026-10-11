import { useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from 'recharts'
import { ChartColumn, Table2 } from 'lucide-react'
import type { ChartSeries, ProjectChart } from '@/types/content'
import { useThemeColors } from '@/hooks/useThemeColors'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { formatValue } from '@/lib/format'
import { cn } from '@/lib/cn'

/** Primary series → validated chart-1, comparison/baseline → chart-2 (see index.css). */
const toneOf = (s: ChartSeries, i: number) => s.tone ?? (i === 0 ? 'primary' : 'secondary')

function ChartTooltip({
  active,
  payload,
  label,
  chart,
}: TooltipProps<number, string> & { chart: ProjectChart }) {
  if (!active || !payload?.length) return null
  return (
    <div className="min-w-40 rounded-xl border border-line-strong bg-surface/95 px-3.5 py-3 text-sm shadow-card backdrop-blur-xl">
      <p className="mb-2 font-mono text-xs text-subtle">{label}</p>
      <ul className="space-y-1.5">
        {payload.map((entry) => (
          <li key={entry.dataKey as string} className="flex items-center justify-between gap-6">
            <span className="flex items-center gap-2 text-muted">
              <span aria-hidden="true" className="size-2.5 rounded-full" style={{ background: entry.color }} />
              {entry.name}
            </span>
            <span className="font-mono font-medium text-fg tabular">
              {formatValue(Number(entry.value), chart.valueFormat, chart.currency)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Interactive Recharts visual for a case study, with a legend and an accessible table view. */
export default function ResultsChart({ chart }: { chart: ProjectChart }) {
  const colors = useThemeColors()
  const reducedMotion = usePrefersReducedMotion()
  const [view, setView] = useState<'chart' | 'table'>('chart')
  const colorFor = (s: ChartSeries, i: number) => (toneOf(s, i) === 'primary' ? colors['chart-1'] : colors['chart-2'])

  const axisProps = {
    stroke: colors.line,
    tick: { fill: colors.muted, fontSize: 12, fontFamily: 'var(--font-mono)' },
    tickLine: false,
    axisLine: false,
  }
  const yAxis = (
    // Bars and areas encode magnitude from zero; lines show change, so they may zoom in.
    <YAxis {...axisProps} width={64} domain={chart.type === 'line' ? ['auto', 'auto'] : [0, 'auto']} tickFormatter={(v: number) => formatValue(v, chart.valueFormat, chart.currency, true)} />
  )
  const grid = <CartesianGrid vertical={false} stroke={colors.line} strokeDasharray="0" />
  const tooltip = (
    <Tooltip
      content={<ChartTooltip chart={chart} />}
      cursor={chart.type === 'bar' ? { fill: colors.line } : { stroke: colors['line-strong'], strokeWidth: 1 }}
    />
  )
  const common = { data: chart.data, margin: { top: 8, right: 8, bottom: 0, left: 0 } }
  const animate = !reducedMotion

  let plot
  if (chart.type === 'bar') {
    plot = (
      <BarChart {...common} barGap={2} barCategoryGap="22%">
        {grid}
        <XAxis dataKey={chart.xKey} {...axisProps} />
        {yAxis}
        {tooltip}
        {chart.series.map((s, i) => (
          <Bar key={s.key} dataKey={s.key} name={s.label} fill={colorFor(s, i)} radius={[4, 4, 0, 0]} maxBarSize={40} isAnimationActive={animate} />
        ))}
      </BarChart>
    )
  } else if (chart.type === 'area') {
    plot = (
      <AreaChart {...common}>
        {grid}
        <XAxis dataKey={chart.xKey} {...axisProps} />
        {yAxis}
        {tooltip}
        {chart.series.map((s, i) => {
          const primary = toneOf(s, i) === 'primary'
          return (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={colorFor(s, i)}
              strokeWidth={2}
              strokeDasharray={primary ? undefined : '6 5'}
              fill={primary ? colors['chart-1'] : 'transparent'}
              fillOpacity={primary ? 0.14 : 0}
              activeDot={{ r: 5, strokeWidth: 2, stroke: colors.surface }}
              isAnimationActive={animate}
            />
          )
        })}
      </AreaChart>
    )
  } else {
    plot = (
      <LineChart {...common}>
        {grid}
        <XAxis dataKey={chart.xKey} {...axisProps} />
        {yAxis}
        {tooltip}
        {chart.series.map((s, i) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={colorFor(s, i)}
            strokeWidth={2}
            strokeDasharray={toneOf(s, i) === 'primary' ? undefined : '6 5'}
            dot={false}
            activeDot={{ r: 5, strokeWidth: 2, stroke: colors.surface }}
            isAnimationActive={animate}
          />
        ))}
      </LineChart>
    )
  }

  return (
    <figure className="rounded-3xl border border-line bg-surface p-5 shadow-card sm:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">{chart.title}</h3>
          {/* Legend: line style + colour, so identity never relies on colour alone. */}
          {chart.series.length > 1 && (
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted" aria-label="Legend">
              {chart.series.map((s, i) => (
                <li key={s.key} className="flex items-center gap-2">
                  <svg width="22" height="10" aria-hidden="true">
                    {chart.type === 'bar' ? (
                      <rect x="5" y="0" width="12" height="10" rx="2" fill={colorFor(s, i)} />
                    ) : (
                      <line x1="1" y1="5" x2="21" y2="5" stroke={colorFor(s, i)} strokeWidth="2.5" strokeDasharray={toneOf(s, i) === 'primary' ? undefined : '5 4'} />
                    )}
                  </svg>
                  {s.label}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="inline-flex shrink-0 self-start rounded-full border border-line p-1" role="group" aria-label="Choose view">
          {(['chart', 'table'] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors',
                view === v ? 'bg-surface-2 text-fg' : 'text-muted hover:text-fg',
              )}
            >
              {v === 'chart' ? <ChartColumn aria-hidden="true" className="size-3.5" /> : <Table2 aria-hidden="true" className="size-3.5" />}
              {v}
            </button>
          ))}
        </div>
      </div>

      {view === 'chart' ? (
        <div className="h-[300px] w-full sm:h-[360px]" role="img" aria-label={`${chart.title}. Switch to table view for the exact values.`}>
          <ResponsiveContainer width="100%" height="100%">
            {plot}
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="max-h-[360px] overflow-auto rounded-xl border border-line">
          <table className="w-full text-sm">
            <caption className="sr-only">{chart.title}</caption>
            <thead className="sticky top-0 bg-surface-2 text-left">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium text-muted">
                  {chart.xKey.charAt(0).toUpperCase() + chart.xKey.slice(1)}
                </th>
                {chart.series.map((s) => (
                  <th key={s.key} scope="col" className="px-4 py-3 text-right font-medium text-muted">
                    {s.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chart.data.map((row) => (
                <tr key={String(row[chart.xKey])} className="border-t border-line">
                  <th scope="row" className="px-4 py-2.5 text-left font-mono font-normal text-fg">
                    {row[chart.xKey]}
                  </th>
                  {chart.series.map((s) => (
                    <td key={s.key} className="px-4 py-2.5 text-right font-mono text-fg tabular">
                      {formatValue(Number(row[s.key]), chart.valueFormat, chart.currency)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {chart.caption && <figcaption className="mt-5 text-sm text-muted">{chart.caption}</figcaption>}
    </figure>
  )
}
