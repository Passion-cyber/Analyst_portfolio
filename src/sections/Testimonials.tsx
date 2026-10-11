import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, type PanInfo } from 'motion/react'
import { ChevronLeft, ChevronRight, Pause, Play, Quote } from 'lucide-react'
import { getTestimonials, localContent } from '@/services/content'
import { useResource } from '@/hooks/useResource'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { initials } from '@/lib/format'
import { cn } from '@/lib/cn'
import { Reveal } from '@/components/ui/Reveal'
import { Section, SectionHeading } from '@/components/ui/Section'
import { LoadingRegion, Skeleton } from '@/components/ui/Skeleton'
import { FallbackNotice } from '@/components/ui/States'

const AUTOPLAY_MS = 7000

export function Testimonials() {
  const { status, data: testimonials, source, retry } = useResource('testimonials', getTestimonials, localContent.testimonials)
  const reducedMotion = usePrefersReducedMotion()
  const [[index, direction], setSlide] = useState<[number, number]>([0, 0])
  const [paused, setPaused] = useState(false) // hover/focus pause
  const [stopped, setStopped] = useState(false) // user pressed pause
  const count = testimonials?.length ?? 0

  const go = useCallback(
    (delta: number) => setSlide(([i]) => [(i + delta + count) % count, delta]),
    [count],
  )

  const autoplay = count > 1 && !paused && !stopped && !reducedMotion
  useEffect(() => {
    if (!autoplay) return
    const id = window.setInterval(() => go(1), AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [autoplay, go])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60 || info.velocity.x < -400) go(1)
    else if (info.offset.x > 60 || info.velocity.x > 400) go(-1)
  }

  const current = testimonials?.[index]

  return (
    <Section id="testimonials" className="overflow-clip">
      <SectionHeading
        id="testimonials-title"
        index="06"
        eyebrow="Testimonials"
        title="What clients say."
        align="center"
      />
      <FallbackNotice source={source} onRetry={retry} />

      {status === 'loading' && !testimonials ? (
        <LoadingRegion label="Loading testimonials">
          <Skeleton className="mx-auto h-80 max-w-4xl rounded-[2rem]" />
        </LoadingRegion>
      ) : current ? (
        <Reveal className="mx-auto max-w-4xl">
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label="Client testimonials"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') go(1)
              if (e.key === 'ArrowLeft') go(-1)
            }}
          >
            <div
              className="relative overflow-hidden rounded-[2rem] border border-line bg-surface p-8 shadow-card sm:p-12"
              aria-live={autoplay ? 'off' : 'polite'}
            >
              <Quote aria-hidden="true" className="absolute top-8 right-8 size-16 text-accent/15 sm:size-24" />
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.div
                  key={index}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${count}`}
                  custom={direction}
                  variants={{
                    enter: (d: number) => ({ opacity: 0, x: reducedMotion ? 0 : d * 40 }),
                    center: { opacity: 1, x: 0 },
                    exit: (d: number) => ({ opacity: 0, x: reducedMotion ? 0 : d * -40 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  drag={count > 1 ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={onDragEnd}
                  className="relative cursor-grab active:cursor-grabbing"
                >
                  <figure>
                    <blockquote className="font-display text-xl leading-relaxed text-fg sm:text-2xl lg:text-[1.75rem] lg:leading-[1.45]">
                      “{current.quote}”
                    </blockquote>
                    <figcaption className="mt-10 flex items-center gap-4">
                      {current.avatar ? (
                        <img src={current.avatar} alt="" width={56} height={56} loading="lazy" className="size-14 rounded-full object-cover" />
                      ) : (
                        <span aria-hidden="true" className="grid size-14 place-items-center rounded-full bg-accent/15 font-display text-lg font-semibold text-accent">
                          {initials(current.name)}
                        </span>
                      )}
                      <div>
                        <p className="font-semibold text-fg">{current.name}</p>
                        <p className="text-sm text-muted">
                          {current.role}, {current.company}
                        </p>
                      </div>
                    </figcaption>
                  </figure>
                </motion.div>
              </AnimatePresence>
            </div>

            {count > 1 && (
              <div className="mt-8 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2" role="group" aria-label="Choose testimonial">
                  {testimonials?.map((t, i) => (
                    <button
                      key={t.name}
                      type="button"
                      onClick={() => setSlide([i, i > index ? 1 : -1])}
                      aria-label={`Show testimonial from ${t.name}`}
                      aria-current={i === index ? 'true' : undefined}
                      className="grid h-6 place-items-center"
                    >
                      <span
                        className={cn(
                          'block h-1.5 rounded-full transition-all duration-500',
                          i === index ? 'w-8 bg-accent' : 'w-1.5 bg-line-strong hover:bg-subtle',
                        )}
                      />
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  {!reducedMotion && (
                    <button
                      type="button"
                      onClick={() => setStopped((s) => !s)}
                      aria-label={stopped ? 'Start automatic rotation' : 'Stop automatic rotation'}
                      className="grid size-11 place-items-center rounded-full text-muted transition-colors hover:text-fg"
                    >
                      {stopped ? <Play aria-hidden="true" className="size-4" /> : <Pause aria-hidden="true" className="size-4" />}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Previous testimonial"
                    className="grid size-11 place-items-center rounded-full border border-line text-fg transition-colors hover:border-accent/60 hover:text-accent"
                  >
                    <ChevronLeft aria-hidden="true" className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Next testimonial"
                    className="grid size-11 place-items-center rounded-full border border-line text-fg transition-colors hover:border-accent/60 hover:text-accent"
                  >
                    <ChevronRight aria-hidden="true" className="size-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </Reveal>
      ) : null}
    </Section>
  )
}
