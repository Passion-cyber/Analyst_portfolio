/**
 * Static pre-rendering (runs automatically in `npm run build`).
 *
 * 1. `vite build` produces the browser bundle and dist/index.html (template).
 * 2. `vite build --ssr src/entry-server.tsx` produces a Node renderer in dist-ssr/.
 * 3. This script renders every route to HTML, fills its <head> tags, and writes
 *    dist/index.html, dist/projects/<slug>/index.html and dist/404.html.
 *
 * The browser then hydrates the HTML instead of rendering from scratch, so the
 * hero paints before any JavaScript runs and every case study has its own
 * title / description / Open Graph tags for search engines and link previews.
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { loadEnv } from 'vite'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const ssrDir = join(root, 'dist-ssr')

const env = loadEnv('production', root, '')
const siteUrl = (env.VITE_SITE_URL || 'https://toochukwu.vercel.app').replace(/\/+$/, '')

const { render, getPrerenderRoutes } = await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href)

// Inline the stylesheet (~14 KB gzipped): saves a render-blocking round trip, so
// pre-rendered pages paint as soon as the HTML arrives. Asset URLs inside are absolute.
let template = await readFile(join(dist, 'index.html'), 'utf8')
const cssLink = template.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/)
if (cssLink) {
  const css = await readFile(join(dist, cssLink[1]), 'utf8')
  template = template.replace(cssLink[0], () => `<style>${css}</style>`)
}

const escapeAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const escapeText = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

/** Replaces the `content` of <meta {attr}="{key}"> in the template. */
function setMeta(html, attr, key, value) {
  const pattern = new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(")`)
  return html.replace(pattern, `$1${escapeAttr(value)}$2`)
}

function applyMeta(html, meta) {
  const url = `${siteUrl}${meta.path === '/' ? '/' : meta.path}`
  let out = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeText(meta.title)}</title>`)
  out = setMeta(out, 'name', 'description', meta.description)
  out = setMeta(out, 'property', 'og:title', meta.title)
  out = setMeta(out, 'property', 'og:description', meta.description)
  out = setMeta(out, 'property', 'og:url', url)
  out = setMeta(out, 'property', 'og:type', meta.type ?? 'website')
  out = setMeta(out, 'name', 'twitter:title', meta.title)
  out = setMeta(out, 'name', 'twitter:description', meta.description)
  out = out.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)

  const extraHead = []
  if (meta.noindex) extraHead.push('<meta name="robots" content="noindex" />')
  if (meta.jsonLd) {
    const json = JSON.stringify(meta.jsonLd).replace(/</g, '\\u003c')
    extraHead.push(`<script type="application/ld+json" data-route-jsonld>${json}</script>`)
  }
  return extraHead.length ? out.replace('</head>', `    ${extraHead.join('\n    ')}\n  </head>`) : out
}

const routes = getPrerenderRoutes(siteUrl)
for (const route of routes) {
  const appHtml = render(route.url)
  const page = applyMeta(template, route.meta).replace(
    '<div id="root"></div>',
    `<div id="root" data-path="${route.url}">${appHtml}</div>`,
  )
  const file = join(dist, route.file)
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, page)
  console.log(`  ✓ ${route.url.padEnd(44)} → dist/${route.file}`)
}

await rm(ssrDir, { recursive: true, force: true })
console.log(`\nPre-rendered ${routes.length} pages for ${siteUrl}`)
