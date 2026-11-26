export const subscriptionTierLabels = {
  BASIC: 'Básico',
  INTERMEDIATE: 'Intermediário',
  ADVANCED: 'Avançado',
} as const

export const subscriptionTiers = [
  { value: 'BASIC', label: subscriptionTierLabels.BASIC },
  { value: 'INTERMEDIATE', label: subscriptionTierLabels.INTERMEDIATE },
  { value: 'ADVANCED', label: subscriptionTierLabels.ADVANCED },
] as const

export const subscriptionRecurrenceLabels = {
  WEEKLY: 'Semanal',
  MONTHLY: 'Mensal',
  QUARTERLY: 'Trimestral',
  YEARLY: 'Anual',
} as const

export const subscriptionRecurrences = [
  { value: 'WEEKLY', label: subscriptionRecurrenceLabels.WEEKLY },
  { value: 'MONTHLY', label: subscriptionRecurrenceLabels.MONTHLY },
  { value: 'QUARTERLY', label: subscriptionRecurrenceLabels.QUARTERLY },
  { value: 'YEARLY', label: subscriptionRecurrenceLabels.YEARLY },
] as const
