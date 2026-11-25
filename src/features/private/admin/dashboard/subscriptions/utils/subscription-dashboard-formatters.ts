import { formatBrazilianCurrency } from '../../../../../../shared/utils/format-brazilian-currency'

export function getSubscriptionStatusLabel(status: string) {
  const labels: Record<string, string> = {
    authorized: 'Ativa',
    active: 'Ativa',
    pending: 'Pendente',
    paused: 'Pausada',
    canceled: 'Cancelada',
    cancelled: 'Cancelada',
    error: 'Erro na criação',
    rejected: 'Recusada',
    creating: 'Criando',
  }
  return labels[status] ?? status.replace(/[_-]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export function getSubscriptionStatusColor(status: string, index: number) {
  if (['error', 'rejected'].includes(status)) return '#d32f2f'
  if (['authorized', 'active'].includes(status)) return '#31845c'
  if (['canceled', 'cancelled'].includes(status)) return '#7b8580'
  if (['pending', 'creating', 'paused'].includes(status)) return '#e3a23b'
  return ['#568bb8', '#8a6bb8', '#6b8793', '#89a84f'][index % 4]
}

export function formatSubscriptionChartCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

export { formatBrazilianCurrency }
