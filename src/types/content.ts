/**
 * Content model for the whole site.
 *
 * Everything rendered on the page is described by these types. The local
 * files in `src/content` implement them, and an external API (configured via
 * VITE_API_BASE_URL) must return JSON in exactly the same shape.
 *
 * All fields are plain JSON (no functions / React nodes) so content can move
 * to a CMS or OpenAPI service without touching components.
 */

/** Keys understood by <Icon />. Add new ones in src/components/ui/Icon.tsx. */
export type IconName =
  | 'python'
  | 'sql'
  | 'excel'
  | 'powerbi'
  | 'tableau'
  | 'pandas'
  | 'statistics'
  | 'visualization'
  | 'dashboard'
  | 'cleaning'
  | 'reporting'
  | 'prediction'
  | 'machine-learning'
  | 'database'
  | 'cloud'
  | 'workflow'
  | 'certificate'
  | 'briefcase'
  | 'education'

/** Image that ships in modern formats with a universal fallback. Paths are relative to /public. */
export interface ResponsiveImageSource {
  avif?: string
  webp?: string
  /** JPG/PNG fallback — always required. */
  src: string
  alt: string
  width: number
  height: number
}

export interface Profile {
  name: string
  firstName: string
  role: string
  /** Hero headline. Wrap the words to highlight in *asterisks*. */
  headline: string
  /** One-line value proposition under the headline. */
  valueProposition: string
  /** Short summary used for SEO meta description. */
  seoDescription: string
  location: string
  availability: string
  bio: string[]
  photo: ResponsiveImageSource
  cvUrl: string
  email: string
  /** International format, digits only, e.g. 2348012345678 — used for WhatsApp click-to-chat. */
  whatsapp: string
  socials: {
    linkedin: string
    github: string
  }
  /** Skills listed in the Person structured data (schema.org knowsAbout). */
  knowsAbout: string[]
}

/** Floating KPI card over the hero chart. */
export interface HeroKpi {
  label: string
  value: string
  trend: 'up' | 'down'
}

export interface Stat {
  label: string
  value: number
  prefix?: string
  suffix?: string
  description: string
}

export interface Skill {
  name: string
  /** 0–100 proficiency. */
  level: number
  icon?: IconName
}

export interface SkillGroup {
  category: string
  icon: IconName
  description: string
  skills: Skill[]
}

export const PROJECT_CATEGORIES = ['Dashboards', 'Machine Learning', 'SQL Analysis', 'Data Cleaning'] as const
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number]

export interface KeyMetric {
  /** Display value, e.g. "+23%", "$1.2M", "4.1×". */
  value: string
  label: string
}

export type ChartValueFormat = 'number' | 'compact' | 'percent' | 'currency'

export interface ChartSeries {
  key: string
  label: string
  /** 'primary' uses the accent colour; 'secondary' a muted tone for baselines/comparisons. */
  tone?: 'primary' | 'secondary'
}

export interface ProjectChart {
  type: 'bar' | 'line' | 'area'
  title: string
  caption?: string
  xKey: string
  series: ChartSeries[]
  data: Array<Record<string, string | number>>
  valueFormat?: ChartValueFormat
  /** Currency code for valueFormat 'currency'. Defaults to USD. */
  currency?: string
}

export interface ProjectDataset {
  name: string
  description: string
  source: string
  /** Human readable size, e.g. "1.4M rows". */
  size: string
  timeframe: string
}

export interface CaseStudy {
  problem: string
  dataset: ProjectDataset
  approach: { title: string; detail: string }[]
  insights: string[]
  impact: KeyMetric[]
  chart: ProjectChart
}

export interface Project {
  slug: string
  title: string
  category: ProjectCategory
  summary: string
  year: number
  client: string
  role: string
  duration: string
  tools: string[]
  keyMetric: KeyMetric
  featured?: boolean
  /** Optional real screenshot. When omitted a generated data-viz thumbnail is drawn. */
  thumbnail?: ResponsiveImageSource
  links: {
    github?: string
    live?: string
  }
  caseStudy: CaseStudy
}

export interface Service {
  title: string
  icon: IconName
  description: string
  deliverables: string[]
  /** e.g. "From $450" or "Custom quote". */
  pricing: string
}

export type TimelineKind = 'role' | 'certification' | 'education'

export interface TimelineEntry {
  kind: TimelineKind
  title: string
  organization: string
  /** Free text so you can write "Jan 2023" or "2021". Omit when undated. */
  start?: string
  /** Omit for current roles. */
  end?: string
  location?: string
  description: string
  highlights?: string[]
  credentialUrl?: string
}

export interface Testimonial {
  name: string
  role: string
  company: string
  quote: string
  /** Optional image path in /public; initials are shown otherwise. */
  avatar?: string
}

export interface NavLink {
  label: string
  /** Section id on the home page, without '#'. */
  id: string
}
