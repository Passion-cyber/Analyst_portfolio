import type { HeroKpi, NavLink, Profile } from '@/types/content'

/**
 * ✏️ PLACEHOLDER CONTENT — replace with real details.
 * Personal details, contact handles and links used across the site, the
 * <head> meta tags and the Person structured data (JSON-LD).
 */
export const profile: Profile = {
  name: 'John Tochukwu Emmanuel',
  firstName: 'Tochukwu',
  role: 'Data Analyst',
  headline: 'I turn *messy data* into clear business decisions.',
  valueProposition:
    'Clean data, solid SQL and Power BI dashboards that show leaders exactly where the money is made, lost and waiting.',
  seoDescription:
    'John Tochukwu Emmanuel is a Data Analyst in Lagos, Nigeria who turns messy data into clear business decisions with Excel, SQL, Power BI and Python. View his projects and get in touch.',
  location: 'Lagos, Nigeria · Remote worldwide', // ✏️
  availability: 'Available for freelance & full-time roles', // ✏️
  bio: [
    "I'm a Chemical Engineering graduate turned data analyst. I take the data a business already has, clean it up, and turn it into dashboards, reports and insights people can act on.",
    'As a Data Analyst Intern at Quantum Analytics I collected, cleaned and analysed operational data with Excel and SQL, built dashboards to track KPIs, and presented findings to management. I have also built a portfolio of 15 data projects, including 10 Power BI dashboards and 5 Excel reports.',
    'My engineering training gave me strong problem-solving, research and process optimisation habits. I am a member of the Society of Petroleum Engineers and the Nigerian Society of Engineers, and I am looking for a Data Analyst role where I can put these skills to work.',
  ],
  photo: {
    avif: '/images/portrait.avif',
    webp: '/images/portrait.webp',
    src: '/images/portrait.jpg',
    alt: 'Portrait of John Tochukwu Emmanuel, Data Analyst',
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
    'Microsoft Excel',
    'Power Query',
    'SQL',
    'MySQL',
    'PostgreSQL',
    'Power BI',
    'Python',
    'Data Visualization',
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
