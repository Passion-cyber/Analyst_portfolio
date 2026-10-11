import type { TimelineEntry } from '@/types/content'

/** ✏️ PLACEHOLDER CONTENT — roles, certifications and education, newest first. */
export const timeline: TimelineEntry[] = [
  {
    kind: 'role',
    title: 'Senior Data Analyst (Contract)',
    organization: 'Northwind Retail Group',
    start: 'Mar 2024',
    location: 'Remote',
    description:
      'Own the commercial analytics stack for a 60-store retail chain: sales, margin and inventory reporting for the leadership team.',
    highlights: [
      'Replaced 14 manual Excel reports with one Power BI command center',
      'Identified $420K in slow-moving inventory in the first quarter',
    ],
  },
  {
    kind: 'certification',
    title: 'Microsoft Certified: Power BI Data Analyst Associate (PL-300)',
    organization: 'Microsoft',
    start: '2024',
    description: 'Data modelling, DAX, report design and deployment in the Power BI service.',
    credentialUrl: 'https://learn.microsoft.com/', // ✏️ link to your credential
  },
  {
    kind: 'role',
    title: 'Data Analyst',
    organization: 'Kudi Finance',
    start: 'Jan 2022',
    end: 'Feb 2024',
    location: 'Lagos, Nigeria',
    description:
      'Built credit-risk and customer analytics for a digital lending product serving 300K+ borrowers.',
    highlights: [
      'Shipped a default-risk model that cut 90-day defaults by 22%',
      'Designed the churn early-warning dashboard used by the CX team daily',
    ],
  },
  {
    kind: 'certification',
    title: 'Google Data Analytics Professional Certificate',
    organization: 'Google · Coursera',
    start: '2022',
    description: 'Data cleaning, SQL, R and Tableau across the full analysis process.',
    credentialUrl: 'https://www.coursera.org/', // ✏️
  },
  {
    kind: 'role',
    title: 'Junior Data Analyst',
    organization: 'HealthBridge NGO',
    start: 'Jun 2020',
    end: 'Dec 2021',
    location: 'Abuja, Nigeria',
    description: 'Cleaned and analysed field survey and patient-record data for maternal health programmes across 6 states.',
    highlights: ['Cut monthly survey processing from 40 hours to 2 with an automated pipeline'],
  },
  {
    kind: 'education',
    title: 'B.Sc. Statistics',
    organization: 'University of Nigeria, Nsukka',
    start: '2015',
    end: '2019',
    description: 'Second Class Upper. Final-year project on forecasting agricultural commodity prices.',
  },
]
