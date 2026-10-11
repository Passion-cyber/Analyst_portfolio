import { useEffect } from 'react'
import { env } from '@/lib/env'
import type { PageMeta } from '@/lib/seo'

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }
  tag.content = content
}

/**
 * Keeps <head> in sync on client-side navigation. The first load already has
 * the right tags: every route is pre-rendered with them (scripts/prerender.mjs).
 */
export function Seo({ title, description, path, image = '/og-image.png', type = 'website', jsonLd, noindex }: PageMeta) {
  useEffect(() => {
    const url = `${env.siteUrl}${path}`
    const imageUrl = image.startsWith('http') ? image : `${env.siteUrl}${image}`
    document.title = title

    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:image', imageUrl)
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', imageUrl)

    const robots = document.head.querySelector('meta[name="robots"]')
    if (noindex) setMeta('name', 'robots', 'noindex')
    else robots?.remove()

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url

    // Replace any route-specific structured data (including the pre-rendered one).
    document.head.querySelectorAll('script[data-route-jsonld]').forEach((el) => el.remove())
    let script: HTMLScriptElement | undefined
    if (jsonLd) {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-route-jsonld', '')
      script.textContent = JSON.stringify(jsonLd)
      document.head.appendChild(script)
    }
    return () => script?.remove()
  }, [title, description, path, image, type, jsonLd, noindex])

  return null
}
