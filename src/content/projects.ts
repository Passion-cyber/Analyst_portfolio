import type { Project } from '@/types/content'

/**
 * ✏️ PLACEHOLDER CONTENT — portfolio projects.
 *
 * Each entry renders a card on the home page AND a full case study at
 * /projects/<slug>. The chart under `caseStudy.chart` is drawn with Recharts:
 * `xKey` names the x-axis field, every `series[].key` must exist in `data`.
 *
 * Add a real screenshot with `thumbnail` (see README → Images); otherwise a
 * generated data-viz thumbnail is drawn from the chart data.
 */
export const projects: Project[] = [
  {
    slug: 'retail-sales-command-center',
    title: 'Retail Sales Command Center',
    category: 'Dashboards',
    summary:
      'A single Power BI command center replacing 14 manual Excel reports for a 60-store retail chain, with drill-downs from region to SKU.',
    year: 2025,
    client: 'Northwind Retail Group',
    role: 'Lead analyst & BI developer',
    duration: '7 weeks',
    tools: ['Power BI', 'DAX', 'SQL Server', 'Power Query'],
    keyMetric: { value: '11 hrs', label: 'reporting time saved per week' },
    featured: true,
    links: {},
    caseStudy: {
      problem:
        'Leadership received 14 different Excel reports every Monday, each built by hand from a different extract. Numbers rarely matched, so meetings were spent debating data instead of decisions, and margin leaks went unnoticed for months.',
      dataset: {
        name: 'POS transactions, inventory snapshots & targets',
        description: 'Point-of-sale line items joined to product master, store hierarchy, daily inventory and monthly targets.',
        source: 'SQL Server ERP + finance targets workbook',
        size: '18.6M rows',
        timeframe: 'Jan 2023 – Dec 2024',
      },
      approach: [
        { title: 'Stakeholder KPI workshop', detail: 'Agreed on 12 core KPIs and one definition for each — the real unlock.' },
        { title: 'Star-schema model', detail: 'Built a fact/dimension model in SQL Server views to replace ad-hoc extracts.' },
        { title: 'DAX measures', detail: 'Time-intelligence, like-for-like store growth and margin waterfall measures.' },
        { title: 'Dashboard & rollout', detail: 'Executive, regional and store views with row-level security and scheduled refresh.' },
      ],
      insights: [
        'Six stores were discounting 2.3× more than the chain average with no lift in volume.',
        'Weekend stock-outs on the top 40 SKUs cost an estimated 4% of weekend revenue.',
        'Like-for-like growth was flat once two new store openings were excluded.',
      ],
      impact: [
        { value: '11 hrs', label: 'manual reporting removed weekly' },
        { value: '+3.1 pts', label: 'gross margin in two quarters' },
        { value: '14 → 1', label: 'reports consolidated' },
      ],
      chart: {
        type: 'area',
        title: 'Monthly revenue vs target (USD)',
        caption: 'Dashboard went live in June. Gap to target closed as discount policy changed.',
        xKey: 'month',
        valueFormat: 'currency',
        series: [
          { key: 'revenue', label: 'Revenue', tone: 'primary' },
          { key: 'target', label: 'Target', tone: 'secondary' },
        ],
        data: [
          { month: 'Jan', revenue: 1.62e6, target: 1.8e6 },
          { month: 'Feb', revenue: 1.58e6, target: 1.8e6 },
          { month: 'Mar', revenue: 1.71e6, target: 1.85e6 },
          { month: 'Apr', revenue: 1.69e6, target: 1.85e6 },
          { month: 'May', revenue: 1.74e6, target: 1.9e6 },
          { month: 'Jun', revenue: 1.86e6, target: 1.9e6 },
          { month: 'Jul', revenue: 1.95e6, target: 1.95e6 },
          { month: 'Aug', revenue: 2.04e6, target: 1.95e6 },
          { month: 'Sep', revenue: 2.08e6, target: 2.0e6 },
          { month: 'Oct', revenue: 2.17e6, target: 2.05e6 },
          { month: 'Nov', revenue: 2.41e6, target: 2.3e6 },
          { month: 'Dec', revenue: 2.63e6, target: 2.5e6 },
        ],
      },
    },
  },
  {
    slug: 'customer-churn-prediction',
    title: 'Customer Churn Early-Warning Model',
    category: 'Machine Learning',
    summary:
      'An XGBoost churn model that flags at-risk subscribers 30 days early, feeding a retention dashboard used daily by the CX team.',
    year: 2024,
    client: 'Kudi Finance',
    role: 'Data analyst & model owner',
    duration: '10 weeks',
    tools: ['Python', 'Pandas', 'scikit-learn', 'XGBoost', 'SHAP', 'Power BI'],
    keyMetric: { value: '−17%', label: 'monthly churn after rollout' },
    featured: true,
    links: {},
    caseStudy: {
      problem:
        'The customer experience team only learned a customer had left after they stopped transacting. Retention offers were sent to everyone, wasting budget on customers who were never going to leave.',
      dataset: {
        name: 'Customer activity & support history',
        description: 'Transactions, app sessions, support tickets and product holdings aggregated to a monthly customer snapshot.',
        source: 'PostgreSQL warehouse + Zendesk export',
        size: '312K customers · 4.2M events',
        timeframe: '24 months',
      },
      approach: [
        { title: 'Define churn properly', detail: 'Agreed a behavioural definition (no activity for 45 days) with product and CX.' },
        { title: 'Feature engineering', detail: '48 features: recency, frequency trends, failed transactions, ticket sentiment.' },
        { title: 'Model & validate', detail: 'Compared logistic regression, random forest and XGBoost with time-based validation.' },
        { title: 'Explain & act', detail: 'SHAP reasons per customer surfaced in Power BI so agents knew why someone was at risk.' },
      ],
      insights: [
        'Two failed transactions in a week tripled churn probability — a product bug, not a pricing issue.',
        'Customers who contacted support and got a reply within 4 hours churned 40% less.',
        'Top decile of risk scores captured 61% of all churners.',
      ],
      impact: [
        { value: '0.87', label: 'recall on held-out months' },
        { value: '−17%', label: 'monthly churn rate' },
        { value: '3.2×', label: 'retention campaign ROI' },
      ],
      chart: {
        type: 'line',
        title: 'Monthly churn rate (%)',
        caption: 'Model-driven retention campaigns started in month 7.',
        xKey: 'month',
        valueFormat: 'percent',
        series: [
          { key: 'churn', label: 'Actual churn', tone: 'primary' },
          { key: 'baseline', label: 'Forecast without model', tone: 'secondary' },
        ],
        data: [
          { month: 'M1', churn: 6.1, baseline: 6.1 },
          { month: 'M2', churn: 6.3, baseline: 6.3 },
          { month: 'M3', churn: 6.0, baseline: 6.2 },
          { month: 'M4', churn: 6.4, baseline: 6.4 },
          { month: 'M5', churn: 6.5, baseline: 6.5 },
          { month: 'M6', churn: 6.6, baseline: 6.6 },
          { month: 'M7', churn: 6.2, baseline: 6.7 },
          { month: 'M8', churn: 5.8, baseline: 6.7 },
          { month: 'M9', churn: 5.6, baseline: 6.8 },
          { month: 'M10', churn: 5.4, baseline: 6.8 },
          { month: 'M11', churn: 5.5, baseline: 6.9 },
          { month: 'M12', churn: 5.3, baseline: 6.9 },
        ],
      },
    },
  },
  {
    slug: 'inventory-supplier-sql-audit',
    title: 'Inventory & Supplier Performance Audit',
    category: 'SQL Analysis',
    summary:
      'A deep SQL audit of purchasing and stock data that uncovered $420K in slow-moving inventory and ranked every supplier on reliability.',
    year: 2025,
    client: 'Northwind Retail Group',
    role: 'Analyst',
    duration: '4 weeks',
    tools: ['PostgreSQL', 'SQL window functions', 'dbt', 'Excel'],
    keyMetric: { value: '$420K', label: 'excess inventory identified' },
    featured: true,
    links: {},
    caseStudy: {
      problem:
        'Warehouses were full yet stores reported stock-outs. Purchasing decisions were made on gut feel and nobody could say which suppliers were reliably late.',
      dataset: {
        name: 'Purchase orders, deliveries & stock movements',
        description: 'Every PO line, goods-received note and stock movement across 3 warehouses and 60 stores.',
        source: 'ERP PostgreSQL replica',
        size: '6.4M rows across 11 tables',
        timeframe: '18 months',
      },
      approach: [
        { title: 'Data profiling', detail: 'Mapped table relationships and fixed 3 broken join keys between POs and receipts.' },
        { title: 'Inventory ageing', detail: 'Window functions to compute days-on-hand and sell-through per SKU per location.' },
        { title: 'Supplier scorecard', detail: 'On-time-in-full, lead-time variance and fill rate per supplier in reusable dbt models.' },
        { title: 'Recommendations', detail: 'Prioritised clearance list and renegotiation shortlist delivered to purchasing.' },
      ],
      insights: [
        '9% of SKUs held 38% of inventory value but sold less than one unit per store per month.',
        'Three suppliers accounted for 64% of all late deliveries.',
        'Lead-time variance, not average lead time, drove most stock-outs.',
      ],
      impact: [
        { value: '$420K', label: 'slow-moving stock flagged' },
        { value: '−28%', label: 'late deliveries after renegotiation' },
        { value: '22', label: 'reusable dbt models handed over' },
      ],
      chart: {
        type: 'bar',
        title: 'Late delivery rate by supplier (%)',
        caption: 'Before vs after quarterly supplier reviews based on the scorecard.',
        xKey: 'supplier',
        valueFormat: 'percent',
        series: [
          { key: 'before', label: 'Before', tone: 'secondary' },
          { key: 'after', label: 'After', tone: 'primary' },
        ],
        data: [
          { supplier: 'Sup. A', before: 31, after: 14 },
          { supplier: 'Sup. B', before: 27, after: 17 },
          { supplier: 'Sup. C', before: 24, after: 12 },
          { supplier: 'Sup. D', before: 11, after: 9 },
          { supplier: 'Sup. E', before: 8, after: 7 },
          { supplier: 'Sup. F', before: 6, after: 5 },
        ],
      },
    },
  },
  {
    slug: 'patient-records-data-quality',
    title: 'Patient Records Data-Quality Overhaul',
    category: 'Data Cleaning',
    summary:
      'Cleaned and de-duplicated 410K patient records across 6 states and built a validation pipeline that keeps them clean.',
    year: 2021,
    client: 'HealthBridge NGO',
    role: 'Data analyst',
    duration: '6 weeks',
    tools: ['Python', 'Pandas', 'RapidFuzz', 'Great Expectations', 'Excel'],
    keyMetric: { value: '98.6%', label: 'record accuracy (from 71%)' },
    featured: true,
    links: {},
    caseStudy: {
      problem:
        'Field clinics captured patient data on paper and in four different spreadsheet templates. Duplicate patients, invalid dates and inconsistent facility names made programme reporting unreliable for donors.',
      dataset: {
        name: 'Maternal health patient visits',
        description: 'Visit-level records with demographics, facility, visit type and outcomes.',
        source: '4 spreadsheet templates + DHIS2 export',
        size: '410K records',
        timeframe: '2018 – 2021',
      },
      approach: [
        { title: 'Quality audit', detail: 'Profiled every column and quantified issues by type and by facility.' },
        { title: 'Standardise', detail: 'Unified schemas, date formats and a canonical facility list.' },
        { title: 'Fuzzy de-duplication', detail: 'Matched patients on name, DOB and phone with RapidFuzz and manual review queues.' },
        { title: 'Automated validation', detail: 'Great Expectations checks run on every new upload with a readable failure report.' },
      ],
      insights: [
        '1 in 7 records was a duplicate patient, inflating reported reach by 16%.',
        'Two facilities accounted for half of all invalid dates — a training issue, now fixed.',
        'Clean data showed antenatal visit completion was 9 pts lower than reported.',
      ],
      impact: [
        { value: '98.6%', label: 'record accuracy' },
        { value: '58K', label: 'duplicate records merged' },
        { value: '1 wk → 1 hr', label: 'monthly data prep' },
      ],
      chart: {
        type: 'bar',
        title: 'Records with issues, by issue type',
        caption: 'Count of affected records before and after the overhaul.',
        xKey: 'issue',
        valueFormat: 'compact',
        series: [
          { key: 'before', label: 'Before', tone: 'secondary' },
          { key: 'after', label: 'After', tone: 'primary' },
        ],
        data: [
          { issue: 'Duplicates', before: 58400, after: 610 },
          { issue: 'Invalid dates', before: 31200, after: 240 },
          { issue: 'Missing IDs', before: 22900, after: 1800 },
          { issue: 'Facility names', before: 17600, after: 0 },
          { issue: 'Out-of-range', before: 9300, after: 410 },
        ],
      },
    },
  },
  {
    slug: 'loan-default-risk-scoring',
    title: 'Loan Default Risk Scoring',
    category: 'Machine Learning',
    summary:
      'A transparent credit-risk score for a digital lender that cut 90-day defaults by 22% without shrinking approvals.',
    year: 2023,
    client: 'Kudi Finance',
    role: 'Data analyst',
    duration: '12 weeks',
    tools: ['Python', 'scikit-learn', 'LightGBM', 'SQL', 'Tableau'],
    keyMetric: { value: '−22%', label: '90-day default rate' },
    links: {},
    caseStudy: {
      problem:
        'The lender approved loans with a rules-based checklist. Defaults were rising, but tightening the rules would have rejected many good borrowers.',
      dataset: {
        name: 'Loan applications & repayment history',
        description: 'Application data, device signals, bureau summaries and full repayment schedules.',
        source: 'Lending platform database',
        size: '96K loans',
        timeframe: '2021 – 2023',
      },
      approach: [
        { title: 'Target & leakage review', detail: 'Defined default as 90+ days past due and removed post-approval features.' },
        { title: 'Modelling', detail: 'Monotonic-constrained LightGBM vs scorecard logistic regression.' },
        { title: 'Fairness & stability', detail: 'Checked PSI over time and approval parity across regions.' },
        { title: 'Policy simulation', detail: 'Simulated approval cut-offs to keep volume flat while lowering risk.' },
      ],
      insights: [
        'Repayment behaviour on the first small loan was the strongest predictor of all.',
        'The lowest-risk 3 deciles had been declined 12% of the time by the old rules.',
      ],
      impact: [
        { value: '−22%', label: '90-day defaults' },
        { value: '0.81', label: 'AUC on out-of-time test' },
        { value: '+6%', label: 'approval rate' },
      ],
      chart: {
        type: 'area',
        title: 'Default rate by risk decile (%)',
        caption: 'Decile 1 = lowest predicted risk. The model separates good and bad borrowers sharply.',
        xKey: 'decile',
        valueFormat: 'percent',
        series: [{ key: 'rate', label: 'Observed default rate', tone: 'primary' }],
        data: [
          { decile: 'D1', rate: 0.8 },
          { decile: 'D2', rate: 1.4 },
          { decile: 'D3', rate: 2.1 },
          { decile: 'D4', rate: 3.0 },
          { decile: 'D5', rate: 4.2 },
          { decile: 'D6', rate: 5.9 },
          { decile: 'D7', rate: 8.3 },
          { decile: 'D8', rate: 11.6 },
          { decile: 'D9', rate: 17.4 },
          { decile: 'D10', rate: 29.8 },
        ],
      },
    },
  },
  {
    slug: 'marketing-roas-dashboard',
    title: 'Marketing Spend & ROAS Dashboard',
    category: 'Dashboards',
    summary:
      'A Tableau dashboard unifying Meta, Google and TikTok ad data with Shopify revenue to show true return on ad spend by channel.',
    year: 2024,
    client: 'Shoplane',
    role: 'Freelance analyst',
    duration: '3 weeks',
    tools: ['Tableau', 'BigQuery', 'SQL', 'Supermetrics'],
    keyMetric: { value: '3.4×', label: 'blended ROAS (from 2.1×)' },
    links: {},
    caseStudy: {
      problem:
        'Each ad platform claimed credit for the same sales, so the founder could not tell which channel actually made money and kept scaling the wrong one.',
      dataset: {
        name: 'Ad spend & order data',
        description: 'Daily spend, clicks and conversions per campaign joined to Shopify orders via UTM tags.',
        source: 'Meta, Google Ads, TikTok APIs + Shopify',
        size: '1.1M rows',
        timeframe: '14 months',
      },
      approach: [
        { title: 'Unify sources', detail: 'Automated daily loads into BigQuery and standardised campaign naming.' },
        { title: 'Attribution model', detail: 'Position-based attribution on first-party order data instead of platform claims.' },
        { title: 'Dashboard', detail: 'Channel, campaign and creative views with spend pacing alerts.' },
      ],
      insights: [
        'TikTok drove cheap clicks but only 0.9× ROAS once returns were included.',
        'Branded Google search was being credited for sales already driven by email.',
      ],
      impact: [
        { value: '3.4×', label: 'blended ROAS' },
        { value: '−$18K', label: 'wasted monthly spend cut' },
      ],
      chart: {
        type: 'bar',
        title: 'Monthly spend vs attributed revenue by channel (USD)',
        xKey: 'channel',
        valueFormat: 'currency',
        series: [
          { key: 'spend', label: 'Spend', tone: 'secondary' },
          { key: 'revenue', label: 'Attributed revenue', tone: 'primary' },
        ],
        data: [
          { channel: 'Meta', spend: 24000, revenue: 91000 },
          { channel: 'Google', spend: 16000, revenue: 62000 },
          { channel: 'Email', spend: 2000, revenue: 38000 },
          { channel: 'TikTok', spend: 9000, revenue: 8100 },
          { channel: 'Affiliates', spend: 5000, revenue: 17500 },
        ],
      },
    },
  },
  {
    slug: 'ecommerce-cohort-retention',
    title: 'E-commerce Cohort Retention Analysis',
    category: 'SQL Analysis',
    summary:
      'Cohort analysis in BigQuery SQL showing which first purchases create loyal customers — and reshaping the welcome journey around them.',
    year: 2024,
    client: 'Shoplane',
    role: 'Freelance analyst',
    duration: '2 weeks',
    tools: ['BigQuery', 'SQL', 'Looker Studio', 'Python'],
    keyMetric: { value: '+9 pts', label: '90-day repeat purchase rate' },
    links: {},
    caseStudy: {
      problem:
        'Customer acquisition costs were rising and the team did not know whether new customers came back, or which products created repeat buyers.',
      dataset: {
        name: 'Orders & customers',
        description: 'Order headers and lines with customer IDs, products and discount codes.',
        source: 'Shopify → BigQuery',
        size: '540K orders',
        timeframe: '2 years',
      },
      approach: [
        { title: 'Cohort tables', detail: 'Monthly acquisition cohorts with retention by month since first order in SQL.' },
        { title: 'First-product analysis', detail: 'Compared retention by category of first purchase and by discount depth.' },
        { title: 'Recommendation', detail: 'Rebuilt the welcome email flow around the highest-retention starter products.' },
      ],
      insights: [
        'Customers whose first order was a refillable product were 2.4× more likely to return.',
        'Discounts above 30% on first order attracted one-time buyers.',
      ],
      impact: [
        { value: '+9 pts', label: '90-day repeat rate' },
        { value: '+14%', label: 'customer lifetime value' },
      ],
      chart: {
        type: 'line',
        title: 'Share of cohort still purchasing (%)',
        caption: 'Average of cohorts before vs after the new welcome journey.',
        xKey: 'month',
        valueFormat: 'percent',
        series: [
          { key: 'before', label: 'Before', tone: 'secondary' },
          { key: 'after', label: 'After', tone: 'primary' },
        ],
        data: [
          { month: 'M0', before: 100, after: 100 },
          { month: 'M1', before: 31, after: 38 },
          { month: 'M2', before: 22, after: 30 },
          { month: 'M3', before: 18, after: 27 },
          { month: 'M4', before: 15, after: 24 },
          { month: 'M5', before: 13, after: 22 },
          { month: 'M6', before: 12, after: 21 },
        ],
      },
    },
  },
  {
    slug: 'survey-data-pipeline',
    title: 'Automated Survey Data Pipeline',
    category: 'Data Cleaning',
    summary:
      'An Excel Power Query + Python pipeline that turned a 40-hour monthly survey clean-up into a 2-hour, one-click process.',
    year: 2021,
    client: 'HealthBridge NGO',
    role: 'Junior data analyst',
    duration: '5 weeks',
    tools: ['Excel', 'Power Query', 'Python', 'KoboToolbox'],
    keyMetric: { value: '40 → 2 hrs', label: 'monthly processing time' },
    links: {},
    caseStudy: {
      problem:
        'Monthly household surveys arrived from 120 enumerators in slightly different formats. Two staff spent a full week every month cleaning them by hand before any analysis could start.',
      dataset: {
        name: 'Household health surveys',
        description: 'Repeated monthly surveys with ~180 questions, skip logic and free-text fields.',
        source: 'KoboToolbox exports',
        size: '~9K responses / month',
        timeframe: '14 survey waves',
      },
      approach: [
        { title: 'Codebook', detail: 'Built a single codebook with valid ranges, skip logic and label mappings.' },
        { title: 'Power Query pipeline', detail: 'One-click refresh that standardises, validates and appends each wave.' },
        { title: 'Python checks', detail: 'Outlier and enumerator-level anomaly detection with an exceptions report.' },
      ],
      insights: [
        'Four enumerators produced 70% of inconsistent responses — targeted retraining fixed it.',
        'Standardised outputs allowed wave-on-wave trend reporting for the first time.',
      ],
      impact: [
        { value: '95%', label: 'less processing time' },
        { value: '14', label: 'waves processed without rework' },
      ],
      chart: {
        type: 'bar',
        title: 'Hours spent cleaning each survey wave',
        caption: 'Pipeline introduced at wave 5.',
        xKey: 'wave',
        valueFormat: 'number',
        series: [{ key: 'hours', label: 'Hours', tone: 'primary' }],
        data: [
          { wave: 'W1', hours: 41 },
          { wave: 'W2', hours: 38 },
          { wave: 'W3', hours: 43 },
          { wave: 'W4', hours: 40 },
          { wave: 'W5', hours: 12 },
          { wave: 'W6', hours: 5 },
          { wave: 'W7', hours: 3 },
          { wave: 'W8', hours: 2 },
          { wave: 'W9', hours: 2 },
          { wave: 'W10', hours: 2 },
        ],
      },
    },
  },
]
