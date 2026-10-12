import type { TimelineEntry } from '@/types/content'

/** Roles, certifications and education from the CV, newest first. */
export const timeline: TimelineEntry[] = [
  {
    kind: 'role',
    title: 'Graduate Intern / Data Analyst Intern',
    organization: 'Quantum Analytics',
    start: 'Jan 2026',
    end: 'Jun 2026',
    location: 'Lagos, Nigeria',
    description: 'Collected, cleaned and analysed operational data using Excel and SQL.',
    highlights: [
      'Developed dashboards and reports to track key performance indicators (KPIs)',
      'Identified trends and process inefficiencies, contributing to improved operational performance',
      'Prepared data visualizations and presentations for management review',
      'Collaborated with cross-functional teams to support data-driven decision-making',
    ],
  },
  {
    kind: 'certification',
    title: 'Data Analysis Training',
    organization: 'Quantum Analytics',
    description: 'Hands-on training in data cleaning, analysis and visualization.',
  },
  {
    kind: 'certification',
    title: 'SQL for Data Analysis',
    organization: 'Coursera / Udemy',
    description: 'Querying, joining and aggregating data to answer business questions.',
  },
  {
    kind: 'certification',
    title: 'Microsoft Excel for Data Analysis',
    organization: 'Udemy',
    description: 'Data cleaning, formulas, pivot tables and charts in Excel.',
  },
  {
    kind: 'education',
    title: 'Higher National Diploma (HND)',
    organization: 'Institute of Management and Technology (IMT)',
    start: 'Jan 2023',
    end: 'Oct 2025',
    location: 'Enugu, Nigeria',
    description: 'Chemical Engineering.',
  },
  {
    kind: 'role',
    title: 'Industrial Training (SIWES)',
    organization: 'Starline Nigeria Limited',
    start: '2022',
    end: '2023',
    description: 'Monitored production and operational processes while recording performance data.',
    highlights: [
      'Assisted in preparing reports and analysing process parameters',
      'Maintained accurate documentation and supported process improvement initiatives',
      'Worked with engineers to identify and resolve operational issues',
    ],
  },
  {
    kind: 'education',
    title: 'National Diploma (ND)',
    organization: 'Institute of Management and Technology (IMT)',
    start: 'Jan 2020',
    end: 'Nov 2022',
    location: 'Enugu, Nigeria',
    description: 'Chemical Engineering.',
  },
]
