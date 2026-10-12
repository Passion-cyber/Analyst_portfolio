import type { IconName, SkillGroup } from '@/types/content'

/**
 * Skills grouped by category, from the CV.
 * `level` is 0–100 and drives the proficiency bar. Be honest; recruiters probe.
 */
export const skillGroups: SkillGroup[] = [
  {
    category: 'Data Analysis Tools',
    icon: 'database',
    description: 'Collecting, cleaning and querying data to answer business questions.',
    skills: [
      { name: 'Excel & Power Query', level: 88, icon: 'excel' },
      { name: 'SQL', level: 80, icon: 'sql' },
      { name: 'Python', level: 60, icon: 'python' },
    ],
  },
  {
    category: 'Data Visualization',
    icon: 'dashboard',
    description: 'Dashboards and charts that make KPIs easy to track.',
    skills: [
      { name: 'Power BI dashboards', level: 85, icon: 'powerbi' },
      { name: 'Excel charts', level: 85, icon: 'visualization' },
      { name: 'Dashboard development', level: 80, icon: 'dashboard' },
    ],
  },
  {
    category: 'Databases & Programming',
    icon: 'workflow',
    description: 'Storing, structuring and presenting data.',
    skills: [
      { name: 'MySQL', level: 75, icon: 'database' },
      { name: 'PostgreSQL', level: 70, icon: 'database' },
      { name: 'HTML & CSS', level: 65, icon: 'workflow' },
    ],
  },
  {
    category: 'Analysis & Problem Solving',
    icon: 'statistics',
    description: 'Finding the trend, the inefficiency and the next step.',
    skills: [
      { name: 'Data cleaning & validation', level: 85, icon: 'cleaning' },
      { name: 'Statistical analysis', level: 70, icon: 'statistics' },
      { name: 'Process optimisation', level: 75, icon: 'reporting' },
    ],
  },
]

/** Tools that orbit the skills visual. Order controls position on the rings. */
export const orbitTools: { name: string; icon: IconName }[] = [
  { name: 'Excel', icon: 'excel' },
  { name: 'SQL', icon: 'sql' },
  { name: 'Power BI', icon: 'powerbi' },
  { name: 'Python', icon: 'python' },
  { name: 'Power Query', icon: 'workflow' },
  { name: 'PostgreSQL', icon: 'database' },
  { name: 'Statistics', icon: 'statistics' },
  { name: 'Dataviz', icon: 'visualization' },
]
