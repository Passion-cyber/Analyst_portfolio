import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import { profile } from './src/content/profile'
import { projects } from './src/content/projects'

/**
 * Fills the SEO placeholders in index.html from src/content/profile.ts and
 * emits sitemap.xml + robots.txt at build time, so SEO stays in sync with
 * content without a server.
 */
function seoPlugin(siteUrl: string): Plugin {
  const title = `${profile.name} · ${profile.role} — Data into decisions`
  const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.role,
    description: profile.seoDescription,
    url: siteUrl,
    image: `${siteUrl}${profile.photo.src}`,
    email: `mailto:${profile.email}`,
    address: { '@type': 'PostalAddress', addressLocality: profile.location.split('·')[0].trim() },
    sameAs: [profile.socials.linkedin, profile.socials.github],
    knowsAbout: profile.knowsAbout,
  }

  return {
    name: 'portfolio-seo',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const filled = html
          .replaceAll('{{SITE_URL}}', siteUrl)
          .replaceAll('{{TITLE}}', escape(title))
          .replaceAll('{{DESCRIPTION}}', escape(profile.seoDescription))
          .replaceAll('{{AUTHOR}}', escape(profile.name))
          .replace('{{JSON_LD}}', JSON.stringify(personJsonLd).replace(/</g, '\\u003c'))

        // Preload the Latin subsets of the two fonts visible above the fold, so text
        // renders in its final font straight away (no swap → no layout shift).
        const fonts = Object.keys(ctx.bundle ?? {}).filter((file) =>
          /(inter|space-grotesk)-latin-wght-normal-[\w-]+\.woff2$/.test(file),
        )
        return {
          html: filled,
          tags: fonts.map((file) => ({
            tag: 'link',
            attrs: { rel: 'preload', href: `/${file}`, as: 'font', type: 'font/woff2', crossorigin: '' },
            injectTo: 'head-prepend' as const,
          })),
        }
      },
    },
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10)
      const urls = [
        { loc: `${siteUrl}/`, priority: '1.0' },
        ...projects.map((p) => ({ loc: `${siteUrl}/projects/${p.slug}`, priority: '0.8' })),
      ]
      const sitemap =
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        urls
          .map((u) => `  <url><loc>${u.loc}</loc><lastmod>${today}</lastmod><priority>${u.priority}</priority></url>`)
          .join('\n') +
        `\n</urlset>\n`
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap })
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      })
    },
  }
}

export default defineConfig(({ mode, isSsrBuild }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.VITE_SITE_URL || 'https://toochukwu.vercel.app').replace(/\/$/, '')

  return {
    // The SSR build (used only for pre-rendering) needs neither the HTML/SEO plugin nor chunking.
    plugins: [react(), tailwindcss(), ...(isSsrBuild ? [] : [seoPlugin(siteUrl)])],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    build: {
      target: 'es2022',
      cssCodeSplit: true,
      chunkSizeWarningLimit: 900,
      rollupOptions: isSsrBuild ? {} : {
        output: {
          // Only the always-needed React runtime is grouped by hand. Three.js and
          // Recharts are split automatically along their lazy() boundaries, so
          // shared helper packages never drag one heavy library into another's page.
          manualChunks(id) {
            // Shared runtime helpers must sit in an always-loaded chunk, otherwise Rollup may
            // co-locate them with a lazy library and force it to preload on every page.
            if (id.includes('vite/preload-helper') || id.includes('commonjsHelpers')) return 'react'
            if (/node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom|@remix-run[\\/]router)[\\/]/.test(id)) return 'react'
          },
        },
      },
    },
  }
})
