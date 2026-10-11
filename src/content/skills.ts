import type { IconName, SkillGroup } from '@/types/content'

/**
 * ✏️ PLACEHOLDER CONTENT — skills grouped by category.
 * `level` is 0–100 and drives the proficiency bar. Be honest; recruiters probe.
 */
export const skillGroups: SkillGroup[] = [
  {
    category: 'Programming & Querying',
    icon: 'database',
    description: 'Extracting, joining and reshaping data at any scale.',
    skills: [
      { name: 'SQL (PostgreSQL, MySQL, BigQuery)', level: 92, icon: 'sql' },
      { name: 'Python', level: 85, icon: 'python' },
      { name: 'Pandas & NumPy', level: 88, icon: 'pandas' },
    ],
  },
  {
    category: 'Business Intelligence',
    icon: 'dashboard',
    description: 'Dashboards decision-makers actually open on Monday morning.',
    skills: [
      { name: 'Power BI & DAX', level: 93, icon: 'powerbi' },
      { name: 'Tableau', level: 84, icon: 'tableau' },
      { name: 'Excel & Power Query', level: 95, icon: 'excel' },
    ],
  },
  {
    category: 'Statistics & Modelling',
    icon: 'statistics',
    description: 'Separating real signal from noise before money moves.',
    skills: [
      { name: 'Statistical testing (A/B, regression)', level: 82, icon: 'statistics' },
      { name: 'Machine learning (scikit-learn, XGBoost)', level: 76, icon: 'machine-learning' },
      { name: 'Forecasting & time series', level: 74, icon: 'prediction' },
    ],
  },
  {
    category: 'Visualization & Storytelling',
    icon: 'visualization',
    description: 'Turning findings into a story a CFO can repeat.',
    skills: [
      { name: 'Data visualization design', level: 90, icon: 'visualization' },
      { name: 'Executive reporting', level: 88, icon: 'reporting' },
      { name: 'Data cleaning & validation', level: 94, icon: 'cleaning' },
    ],
  },
]

/** Tools that orbit the skills visual. Order controls position on the rings. */
export const orbitTools: { name: string; icon: IconName }[] = [
  { name: 'Python', icon: 'python' },
  { name: 'SQL', icon: 'sql' },
  { name: 'Power BI', icon: 'powerbi' },
  { name: 'Tableau', icon: 'tableau' },
  { name: 'Excel', icon: 'excel' },
  { name: 'Pandas', icon: 'pandas' },
  { name: 'Statistics', icon: 'statistics' },
  { name: 'Dataviz', icon: 'visualization' },
]
