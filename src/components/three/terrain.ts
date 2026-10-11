/**
 * Shared "data terrain" maths used by both the WebGL scene and the static SVG
 * fallback, so the two look like the same chart.
 */
export const GRID = 14

/** Deterministic pseudo-random in [0, 1) — stable "data noise" per bar. */
export function seeded(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

/**
 * Bar height for grid cell (x, z) at time t, with an optional bump at `focus`
 * (in grid units). Produces an upward trend toward the far corner plus rolling
 * waves — reads as "growth with seasonality".
 */
export function barHeight(x: number, z: number, t: number, focusX = Infinity, focusZ = Infinity) {
  // Rises toward the far corner (low x/z) so tall bars never hide the rest of the chart.
  const trend = ((2 * (GRID - 1) - x - z) / (2 * (GRID - 1))) * 1.6
  const wave = 0.32 * Math.sin(x * 0.55 + t * 0.9) * Math.cos(z * 0.42 - t * 0.6) + 0.18 * Math.sin((x - z) * 0.35 + t * 0.45)
  const noise = seeded(x * GRID + z) * 0.55
  const dx = x - focusX
  const dz = z - focusZ
  const bump = 2.1 * Math.exp(-(dx * dx + dz * dz) / 5)
  return Math.max(0.12, 0.35 + trend + wave + noise + bump)
}
