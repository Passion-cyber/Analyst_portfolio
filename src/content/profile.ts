import type { HeroKpi, NavLink, Profile } from '@/types/content'

/**
 * ✏️ PLACEHOLDER CONTENT — replace with real details.
 * Personal details, contact handles and links used across the site, the
 * <head> meta tags and the Person structured data (JSON-LD).
 */
export const profile: Profile = {
  name: 'Toochukwu', // ✏️ add surname, e.g. 'Toochukwu Okafor'
  firstName: 'Toochukwu',
  role: 'Data Analyst',
  headline: 'I turn *messy data* into clear business decisions.',
  valueProposition:
    'Dashboards, SQL analysis and predictive models that show leaders exactly where the money is made, lost and waiting.',
  seoDescription:
    'Toochukwu is a Data Analyst who turns messy data into clear business decisions with Power BI, Tableau, SQL and Python. View case studies and hire him for your next project.',
  location: 'Lagos, Nigeria · Remote worldwide', // ✏️
  availability: 'Available for freelance & full-time roles', // ✏️
  bio: [
    // ✏️
    "I'm a data analyst who sits between the spreadsheet and the boardroom. My job is to take the data a business already has, usually scattered, duplicated and half-trusted, and turn it into answers people can act on the same day.",
    'Over the past four years I have built executive dashboards, untangled million-row SQL databases and shipped churn and risk models for teams in retail, fintech, healthcare and the non-profit sector. I care less about fancy charts and more about the decision each chart makes easier.',
    "When I'm not modelling, I mentor early-career analysts and write about practical analytics for growing businesses.",
  ],
  photo: {
    avif: '/images/portrait.avif',
    webp: '/images/portrait.webp',
    src: '/images/portrait.jpg',
    alt: 'Portrait of Toochukwu, Data Analyst',
    width: 470,
    height: 587,
  },
  cvUrl: '/cv/John-Tochukwu-Emmanuel-Data-Analyst-CV.pdf',
  email: 'tochukwujohn14@gmail.com',
  whatsapp: '2347061552180', // digits only, with country code
  socials: {
    linkedin: 'https://www.linkedin.com/in/john-tochukwu-76230519b',
    github: 'https://github.com/Emifresh1',
  },
  knowsAbout: [
    'Data Analysis',
    'SQL',
    'Python',
    'Power BI',
    'Tableau',
    'Microsoft Excel',
    'Data Visualization',
    'Statistics',
    'Machine Learning',
    'Business Intelligence',
  ],
}

/** ✏️ The two glass KPI cards floating over the hero chart (desktop/tablet). */
export const heroKpis: HeroKpi[] = [
  { label: 'Gross margin', value: '+3.1 pts', trend: 'up' },
  { label: 'Churn rate', value: '−17%', trend: 'down' },
]

/** Navbar + footer links. `id` must match a section id on the home page. */
export const navLinks: NavLink[] = [
  { label: 'About', id: 'about' },
  { label: 'Skills', id: 'skills' },
  { label: 'Projects', id: 'projects' },
  { label: 'Services', id: 'services' },
  { label: 'Experience', id: 'experience' },
  { label: 'Contact', id: 'contact' },
]
