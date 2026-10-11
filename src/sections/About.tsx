import { ArrowRight, Briefcase, Download, MapPin, Target } from 'lucide-react'
import { profile } from '@/content/profile'
import { stats } from '@/content/stats'
import { Button } from '@/components/ui/Button'
import { Magnetic } from '@/components/ui/Magnetic'
import { ResponsiveImage } from '@/components/ui/ResponsiveImage'
import { Reveal } from '@/components/ui/Reveal'
import { Section, SectionHeading } from '@/components/ui/Section'

const years = stats.find((s) => /year/i.test(s.label))

const facts = [
  { icon: MapPin, label: 'Based in', value: profile.location },
  { icon: Briefcase, label: 'Status', value: profile.availability },
  { icon: Target, label: 'Focus', value: 'Revenue, retention & operational efficiency' },
]

export function About() {
  return (
    <Section id="about">
      <div className="grid items-start gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        {/* Photo slot */}
        <Reveal className="relative mx-auto w-full max-w-sm lg:sticky lg:top-28 lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-line bg-surface-2 shadow-card">
            <ResponsiveImage image={profile.photo} sizes="(min-width: 1024px) 34vw, 384px" className="h-full w-full" />
          </div>
          {/* Corner brackets — a "viewfinder" nod to focusing on what matters in the data */}
          <span aria-hidden="true" className="absolute -top-3 -left-3 size-10 rounded-tl-2xl border-t-2 border-l-2 border-accent" />
          <span aria-hidden="true" className="absolute -right-3 -bottom-3 size-10 rounded-br-2xl border-r-2 border-b-2 border-accent" />
          <div className="absolute -right-4 bottom-10 rounded-2xl border border-line-strong bg-surface/90 px-4 py-3 shadow-card backdrop-blur-xl sm:-right-8">
            <p className="font-mono text-3xl font-semibold text-accent tabular">
              {years ? `${years.value}${years.suffix ?? ''}` : '—'}
            </p>
            <p className="text-xs text-muted">years turning data
              <br />into decisions</p>
          </div>
        </Reveal>

        <div>
          <SectionHeading
            id="about-title"
            index="01"
            eyebrow="About"
            title={
              <>
                The analyst between your <span className="text-accent">spreadsheets</span> and your strategy.
              </>
            }
            className="mb-8 sm:mb-10"
          />

          <Reveal stagger={0.1} className="space-y-5 text-lg leading-relaxed text-muted">
            {profile.bio.map((paragraph, i) => (
              <Reveal.Item as="p" key={i} className={i === 0 ? 'text-fg' : undefined}>
                {paragraph}
              </Reveal.Item>
            ))}
          </Reveal>

          <Reveal as="ul" stagger={0.08} delay={0.1} className="mt-10 grid gap-3 sm:grid-cols-3">
            {facts.map(({ icon: FactIcon, label, value }) => (
              <Reveal.Item as="li" key={label} className="rounded-2xl border border-line bg-surface/60 p-4">
                <FactIcon aria-hidden="true" className="size-5 text-accent" />
                <p className="mt-3 font-mono text-[0.65rem] tracking-[0.2em] text-subtle uppercase">{label}</p>
                <p className="mt-1 text-sm leading-snug text-fg">{value}</p>
              </Reveal.Item>
            ))}
          </Reveal>

          <Reveal delay={0.15} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Magnetic>
              <Button
                href={profile.cvUrl}
                download
                size="lg"
                className="w-full sm:w-auto"
                leadingIcon={<Download aria-hidden="true" className="size-4" />}
              >
                Download CV
              </Button>
            </Magnetic>
            <Button href="#contact" variant="ghost" size="lg" trailingIcon={<ArrowRight aria-hidden="true" className="size-4" />}>
              Start a conversation
            </Button>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
