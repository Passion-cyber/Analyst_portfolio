import { profile } from '@/content/profile'
import { projects } from '@/content/projects'
import { skillGroups } from '@/content/skills'
import { services } from '@/content/services'
import { stats } from '@/content/stats'
import { timeline } from '@/content/experience'
import { testimonials } from '@/content/testimonials'
import type { Profile, Project, Service, SkillGroup, Stat, Testimonial, TimelineEntry } from '@/types/content'
import { loadWithFallback } from './api'

/**
 * Content service — the ONLY place components get data from.
 *
 * Today every getter resolves with the files in src/content. Set
 * VITE_API_BASE_URL and the same getters call your API instead:
 *
 *   GET {BASE}/profile        → Profile
 *   GET {BASE}/projects       → Project[]
 *   GET {BASE}/projects/:slug → Project
 *   GET {BASE}/skills         → SkillGroup[]
 *   GET {BASE}/services       → Service[]
 *   GET {BASE}/stats          → Stat[]
 *   GET {BASE}/experience     → TimelineEntry[]
 *   GET {BASE}/testimonials   → Testimonial[]
 */

/** Local content, used for instant first paint and as the fallback. */
export const localContent = { profile, projects, skillGroups, services, stats, timeline, testimonials }

// Light-weight shape guards — enough to reject an HTML error page or a wrong endpoint.
const isArrayOf =
  <T>(requiredKey: string) =>
  (value: unknown): value is T[] =>
    Array.isArray(value) && value.every((item) => typeof item === 'object' && item !== null && requiredKey in item)
const isObjectWith =
  <T>(requiredKey: string) =>
  (value: unknown): value is T =>
    typeof value === 'object' && value !== null && requiredKey in value

export const getProfile = () => loadWithFallback<Profile>('/profile', profile, isObjectWith<Profile>('name'))
export const getProjects = () => loadWithFallback('/projects', projects, isArrayOf<Project>('slug'))
export const getSkills = () => loadWithFallback('/skills', skillGroups, isArrayOf<SkillGroup>('skills'))
export const getServices = () => loadWithFallback('/services', services, isArrayOf<Service>('title'))
export const getStats = () => loadWithFallback('/stats', stats, isArrayOf<Stat>('value'))
export const getExperience = () => loadWithFallback('/experience', timeline, isArrayOf<TimelineEntry>('title'))
export const getTestimonials = () => loadWithFallback('/testimonials', testimonials, isArrayOf<Testimonial>('quote'))

export const findLocalProject = (slug: string) => projects.find((p) => p.slug === slug) ?? null

export const getProject = (slug: string) =>
  loadWithFallback<Project | null>(
    `/projects/${encodeURIComponent(slug)}`,
    findLocalProject(slug),
    (value): value is Project | null => value === null || isObjectWith<Project>('slug')(value),
  )
