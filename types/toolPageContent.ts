/**
 * Types for ToolPageContent component
 * Requirements: 3.1, 3.2, 3.3, 3.4
 */

import type { HowToStep } from '~/composables/useHowToSchema'

export interface ComparisonItem {
  feature: string
  ourTool: string | boolean
  competitor1?: string | boolean
  competitor2?: string | boolean
  competitor3?: string | boolean
}

export interface UsageStats {
  totalUsers?: string
  filesProcessed?: string
  avgRating?: string
}

export interface ToolPageContentProps {
  /** Name of the tool for HowTo schema */
  toolName: string
  /** Array of HowTo steps */
  steps: HowToStep[]
  /** Comparison table items */
  comparisons?: ComparisonItem[]
  /** Names of competitors for comparison table headers */
  competitorNames?: string[]
  /** Usage statistics */
  stats?: UsageStats
  /** Whether to generate HowTo structured data (default: true) */
  generateSchema?: boolean
}

export type { HowToStep }
