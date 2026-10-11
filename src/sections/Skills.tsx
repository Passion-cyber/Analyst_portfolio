import type { CSSProperties } from 'react'
import { orbitTools } from '@/content/skills'
import { getSkills, localContent } from '@/services/content'
import { useResource } from '@/hooks/useResource'
import type { Skill, SkillGroup } from '@/types/content'
import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import { Section, SectionHeading } from '@/components/ui/Section'
import { LoadingRegion, Skeleton } from '@/components/ui/Skeleton'
import { FallbackNotice } from '@/components/ui/States'
import { ToolOrbit } from '@/components/ui/ToolOrbit'

const levelLabel = (level: number) => (level >= 90 ? 'Expert' : level >= 80 ? 'Advanced' : level >= 65 ? 'Proficient' : 'Working')

function SkillBar({ skill, index }: { skill: Skill; index: number }) {
  return (
    <li>
      <div className="flex items-baseline justify-between gap-4 text-sm">
        <span className="flex items-center gap-2 text-fg">
          {skill.icon && <Icon name={skill.icon} className="size-4 shrink-0 text-subtle" />}
          {skill.name}
        </span>
        <span className="shrink-0 font-mono text-xs text-muted tabular">
          <span className="sr-only">Proficiency: </span>
          {levelLabel(skill.level)} · {skill.level}%
        </span>
      </div>
      <div
        className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-surface-2"
        role="meter"
        aria-label={`${skill.name} proficiency`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={skill.level}
      >
        {/* Grows when the parent card is revealed (`.skill-fill` in index.css). */}
        <div
          className="skill-fill h-full rounded-full bg-accent"
          style={{ width: `${skill.level}%`, '--fill-delay': `${0.3 + index * 0.08}s` } as CSSProperties}
        />
      </div>
    </li>
  )
}

function SkillCard({ group }: { group: SkillGroup }) {
  return (
    <article className="group h-full rounded-3xl border border-line bg-surface/70 p-6 transition-colors duration-500 hover:border-line-strong sm:p-7">
      <div className="flex items-start gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-accent/10 text-accent transition-transform duration-500 ease-out-expo group-hover:scale-110 group-hover:-rotate-6">
          <Icon name={group.icon} className="size-5" />
        </span>
        <div>
          <h3 className="text-lg font-semibold">{group.category}</h3>
          <p className="mt-1 text-sm text-muted">{group.description}</p>
        </div>
      </div>
      <ul className="mt-6 space-y-5">
        {group.skills.map((skill, i) => (
          <SkillBar key={skill.name} skill={skill} index={i} />
        ))}
      </ul>
    </article>
  )
}

export function Skills() {
  const { status, data: groups, source, retry } = useResource('skills', getSkills, localContent.skillGroups)

  return (
    <Section id="skills" className="overflow-clip">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            id="skills-title"
            index="02"
            eyebrow="Skills & Tools"
            title="A toolkit built for answers, not just analysis."
            description="From the first messy export to the final executive slide: querying, modelling, visualising and explaining."
            className="mb-10 sm:mb-12"
          />
          <Reveal delay={0.1} className="hidden sm:block">
            <ToolOrbit tools={orbitTools} />
          </Reveal>
        </div>

        <div>
          <FallbackNotice source={source} onRetry={retry} />
          {status === 'loading' && !groups ? (
            <LoadingRegion label="Loading skills" className="grid gap-5 md:grid-cols-2">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="h-72 rounded-3xl" />
              ))}
            </LoadingRegion>
          ) : (
            <Reveal stagger={0.1} className="grid gap-5 md:grid-cols-2">
              {groups?.map((group) => (
                <Reveal.Item key={group.category}>
                  <SkillCard group={group} />
                </Reveal.Item>
              ))}
            </Reveal>
          )}
        </div>
      </div>
    </Section>
  )
}
