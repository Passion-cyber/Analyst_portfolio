import type { ChartValueFormat } from '@/types/content'

/** Formats chart values consistently for axes and tooltips. */
export function formatValue(value: number, format: ChartValueFormat = 'number', currency = 'USD', compactAxis = false) {
  switch (format) {
    case 'percent':
      return `${Number.isInteger(value) ? value : value.toFixed(1)}%`
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        notation: compactAxis || Math.abs(value) >= 100_000 ? 'compact' : 'standard',
        maximumFractionDigits: compactAxis ? 1 : 2,
      }).format(value)
    case 'compact':
      return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
    default:
      return new Intl.NumberFormat('en-US').format(value)
  }
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}
