import { useState } from 'react'
import type { ResponsiveImageSource } from '@/types/content'
import { cn } from '@/lib/cn'

interface ResponsiveImageProps {
  image: ResponsiveImageSource
  className?: string
  imgClassName?: string
  /** Set for above-the-fold images (LCP candidates). */
  priority?: boolean
  sizes?: string
}

/**
 * <picture> with AVIF → WebP → JPG/PNG sources, explicit dimensions (no layout
 * shift), lazy loading and a soft fade-in once decoded.
 */
export function ResponsiveImage({ image, className, imgClassName, priority = false, sizes = '100vw' }: ResponsiveImageProps) {
  const [loaded, setLoaded] = useState(false)
  return (
    <picture className={cn('block', className)}>
      {image.avif && <source srcSet={image.avif} type="image/avif" sizes={sizes} />}
      {image.webp && <source srcSet={image.webp} type="image/webp" sizes={sizes} />}
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        {...{ fetchpriority: priority ? 'high' : 'auto' }}
        onLoad={() => setLoaded(true)}
        className={cn('h-full w-full object-cover transition-opacity duration-700', loaded || priority ? 'opacity-100' : 'opacity-0', imgClassName)}
      />
    </picture>
  )
}
