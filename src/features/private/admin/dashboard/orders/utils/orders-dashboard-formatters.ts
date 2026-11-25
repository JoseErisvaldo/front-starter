import { formatBrazilianCurrency } from '../../../../../../shared/utils/format-brazilian-currency'

export function formatOrdersChartCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

export function getOrderStatusLabel(status: string) {
  const labels: Record<string, string> = {
    approved: 'Aprovado',
    accredited: 'Creditado',
    processed: 'Processado',
    pending: 'Pendente',
    created: 'Criado',
    processing: 'Em processamento',
    action_required: 'Ação necessária',
    failed: 'Falhou',
    rejected: 'Recusado',
    declined: 'Recusado',
    error: 'Erro',
    processing_error: 'Erro no processamento',
    cancelled: 'Cancelado',
    canceled: 'Cancelado',
    expired: 'Expirado',
  }
  return labels[status] ?? status.replace(/[_-]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export function getOrderStatusColor(status: string, index: number) {
  if (['failed', 'rejected', 'declined', 'error', 'processing_error'].includes(status)) {
    return '#d32f2f'
  }
  return ['#31845c', '#568bb8', '#e3a23b', '#8a6bb8', '#6b8793', '#89a84f'][index % 6]
}

export function getPaymentMethodLabel(paymentMethod: string) {
  const labels: Record<string, string> = {
    pix: 'Pix',
    card: 'Cartão',
    credit_card: 'Cartão de crédito',
    debit_card: 'Cartão de débito',
    account_money: 'Saldo da conta',
    ticket: 'Boleto',
  }
  return labels[paymentMethod]
    ?? paymentMethod.replace(/[_-]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export { formatBrazilianCurrency }
