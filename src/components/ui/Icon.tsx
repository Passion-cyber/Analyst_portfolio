import {
  Award,
  BrainCircuit,
  Briefcase,
  ChartColumnBig,
  ChartPie,
  ChartScatter,
  Cloud,
  Database,
  FileChartColumn,
  FileCode2,
  GraduationCap,
  LayoutDashboard,
  Sheet,
  Sigma,
  Sparkles,
  Table2,
  TrendingUp,
  Workflow,
  type LucideIcon,
  type LucideProps,
} from 'lucide-react'
import type { IconName } from '@/types/content'

const icons: Record<IconName, LucideIcon> = {
  python: FileCode2,
  sql: Database,
  excel: Sheet,
  powerbi: ChartColumnBig,
  tableau: ChartScatter,
  pandas: Table2,
  statistics: Sigma,
  visualization: ChartPie,
  dashboard: LayoutDashboard,
  cleaning: Sparkles,
  reporting: FileChartColumn,
  prediction: TrendingUp,
  'machine-learning': BrainCircuit,
  database: Database,
  cloud: Cloud,
  workflow: Workflow,
  certificate: Award,
  briefcase: Briefcase,
  education: GraduationCap,
}

interface IconProps extends LucideProps {
  name: IconName
}

/** Renders a content-driven icon by name, so content files stay plain JSON. */
export function Icon({ name, ...props }: IconProps) {
  const Component = icons[name] ?? Sparkles
  return <Component aria-hidden="true" strokeWidth={1.75} {...props} />
}
