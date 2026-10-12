/**
 * Generates the static brand assets in /public from SVG templates:
 *   favicon.svg, favicon-32.png, apple-touch-icon.png, icon-192/512.png,
 *   site.webmanifest, og-image.png (1200×630), portrait placeholder
 *   (AVIF/WebP/JPG) and a placeholder CV PDF.
 *
 * Run:  npm run assets
 * Re-run after changing NAME / TAGLINE below. Existing real photos/CVs are
 * never overwritten (pass --force to regenerate everything).
 */
import sharp from 'sharp'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pub = (...p) => join(root, 'public', ...p)
const force = process.argv.includes('--force')

const NAME = 'Toochukwu' // ✏️
const ROLE = 'Data Analyst'
const TAGLINE = 'I turn messy data into clear business decisions.'
const URL_TEXT = 'toochukwu.vercel.app' // ✏️
const CV_FILE = 'John-Tochukwu-Emmanuel-Data-Analyst-CV.pdf'

const BG = '#050b1f'
const ACCENT = '#4f8cff'
const FG = '#e8eefc'
const MUTED = '#a3b2d1'

mkdirSync(pub('images'), { recursive: true })
mkdirSync(pub('cv'), { recursive: true })

const write = (file, data) => {
  writeFileSync(file, data)
  console.log('  ✓', file.replace(root, '').replaceAll('\\', '/'))
}

// ── Logo mark (same geometry as src/components/layout/Logo.tsx) ──────────────
const mark = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="9" fill="${BG}"/>
  <rect x="8" y="17" width="4" height="7" rx="1.5" fill="${FG}" opacity="0.55"/>
  <rect x="14" y="12.5" width="4" height="11.5" rx="1.5" fill="${FG}" opacity="0.85"/>
  <rect x="20" y="8" width="4" height="16" rx="1.5" fill="${ACCENT}"/>
</svg>`

write(pub('favicon.svg'), mark(32).trim())
write(pub('favicon-32.png'), await sharp(Buffer.from(mark(32)), { density: 300 }).resize(32, 32).png().toBuffer())
write(pub('apple-touch-icon.png'), await sharp(Buffer.from(mark(180)), { density: 300 }).resize(180, 180).png().toBuffer())
write(pub('icon-192.png'), await sharp(Buffer.from(mark(192)), { density: 300 }).resize(192, 192).png().toBuffer())
write(pub('icon-512.png'), await sharp(Buffer.from(mark(512)), { density: 300 }).resize(512, 512).png().toBuffer())
write(
  pub('site.webmanifest'),
  JSON.stringify(
    {
      name: `${NAME} · ${ROLE}`,
      short_name: NAME,
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      theme_color: BG,
      background_color: BG,
      display: 'standalone',
      start_url: '/',
    },
    null,
    2,
  ),
)

// ── Open Graph image ─────────────────────────────────────────────────────────
const bars = Array.from({ length: 14 }, (_, i) => {
  const h = 60 + i * 18 + Math.sin(i * 1.3) * 28
  const x = 640 + i * 38
  const opacity = (0.25 + (i / 14) * 0.75).toFixed(2)
  return `<rect x="${x}" y="${560 - h}" width="26" height="${h}" rx="5" fill="${ACCENT}" opacity="${opacity}"/>`
}).join('')

const grid = Array.from({ length: 22 }, (_, i) => `<line x1="${i * 56}" y1="0" x2="${i * 56}" y2="630" />`).join('') +
  Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="${i * 56}" x2="1200" y2="${i * 56}" />`).join('')

const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${BG}"/>
  <g stroke="#94a3b8" stroke-opacity="0.07">${grid}</g>
  ${bars}
  <g transform="translate(72 66) scale(1.75)">
    <rect width="32" height="32" rx="9" fill="${FG}"/>
    <rect x="8" y="17" width="4" height="7" rx="1.5" fill="${BG}" opacity="0.55"/>
    <rect x="14" y="12.5" width="4" height="11.5" rx="1.5" fill="${BG}" opacity="0.85"/>
    <rect x="20" y="8" width="4" height="16" rx="1.5" fill="${ACCENT}"/>
  </g>
  <text x="140" y="104" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="28" font-weight="600" fill="${FG}">${NAME}<tspan fill="${ACCENT}">.</tspan></text>
  <text x="72" y="250" font-family="Consolas, Menlo, monospace" font-size="22" letter-spacing="4" fill="${ACCENT}">${ROLE.toUpperCase()}</text>
  <text font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="64" font-weight="700" fill="${FG}" letter-spacing="-1.5">
    <tspan x="72" y="330">I turn <tspan fill="${ACCENT}">messy data</tspan></tspan>
    <tspan x="72" y="406">into clear business</tspan>
    <tspan x="72" y="482">decisions.</tspan>
  </text>
  <text x="72" y="560" font-family="Consolas, Menlo, monospace" font-size="22" fill="${MUTED}">${URL_TEXT}</text>
</svg>`
write(pub('og-image.png'), await sharp(Buffer.from(og)).png({ compressionLevel: 9 }).toBuffer())

// ── Portrait placeholder (replace with a real photo — see README) ────────────
if (force || !existsSync(pub('images', 'portrait.jpg'))) {
  const portrait = `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
  <rect width="800" height="1000" fill="#0a1430"/>
  <circle cx="400" cy="390" r="150" fill="#13234d"/>
  <path d="M130 1000c0-170 120-300 270-300s270 130 270 300z" fill="#13234d"/>
  <text x="400" y="430" text-anchor="middle" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="120" font-weight="700" fill="${ACCENT}">${NAME[0]}</text>
  <text x="400" y="920" text-anchor="middle" font-family="Consolas, Menlo, monospace" font-size="26" letter-spacing="4" fill="${MUTED}">YOUR PHOTO HERE</text>
</svg>`
  const base = sharp(Buffer.from(portrait))
  write(pub('images', 'portrait.jpg'), await base.clone().jpeg({ quality: 80, mozjpeg: true }).toBuffer())
  write(pub('images', 'portrait.webp'), await base.clone().webp({ quality: 78 }).toBuffer())
  write(pub('images', 'portrait.avif'), await base.clone().avif({ quality: 55 }).toBuffer())
}

// ── Placeholder CV (a tiny valid one-page PDF) ───────────────────────────────
if (force || !existsSync(pub('cv', CV_FILE))) {
  const lines = [
    [24, `${NAME} - ${ROLE}`],
    [12, 'PLACEHOLDER CV - replace public/cv/' + CV_FILE + ' with your real CV.'],
    [12, TAGLINE],
  ]
  const stream = lines
    .map(([size, text], i) => `BT /F1 ${size} Tf 72 ${740 - i * 36} Td (${text.replace(/[()\\]/g, '\\$&')}) Tj ET`)
    .join('\n')
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
  ]
  let pdf = '%PDF-1.4\n'
  const offsets = []
  objects.forEach((body, i) => {
    offsets.push(Buffer.byteLength(pdf))
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`
  })
  const xref = Buffer.byteLength(pdf)
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  pdf += offsets.map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('')
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`
  write(pub('cv', CV_FILE), pdf)
}

console.log('\nAssets ready.')
