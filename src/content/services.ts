import type { Service } from '@/types/content'

/** ✏️ PLACEHOLDER CONTENT — what clients can hire Toochukwu for. */
export const services: Service[] = [
  {
    title: 'Dashboard Development',
    icon: 'dashboard',
    description:
      'Interactive Power BI or Tableau dashboards that put your KPIs on one screen, refresh automatically and answer the follow-up question before it is asked.',
    deliverables: ['KPI & metric design workshop', 'Automated data refresh', 'Role-based views', 'Handover training'],
    pricing: 'From $600',
  },
  {
    title: 'Data Cleaning & Preparation',
    icon: 'cleaning',
    description:
      'Duplicates, typos, missing values and five versions of the same customer — fixed, documented and turned into a repeatable pipeline.',
    deliverables: ['Data quality audit report', 'Reusable cleaning scripts', 'Validation rules', 'Clean, analysis-ready tables'],
    pricing: 'From $350',
  },
  {
    title: 'Business Reporting',
    icon: 'reporting',
    description:
      'Weekly or monthly reports that replace copy-paste spreadsheets with a trusted source of truth and plain-English commentary.',
    deliverables: ['Automated report templates', 'Executive summaries', 'Variance & trend analysis', 'Scheduled delivery'],
    pricing: 'From $400 / month',
  },
  {
    title: 'Predictive Analysis',
    icon: 'prediction',
    description:
      'Forecast demand, flag customers likely to churn and score risk with models that are explained, validated and tied to a business action.',
    deliverables: ['Feature & data assessment', 'Validated ML model', 'Explainability report', 'Deployment-ready scoring'],
    pricing: 'Custom quote',
  },
]
