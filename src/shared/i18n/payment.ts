const paymentStatusLabels: Record<string, string> = {
  action_required: 'Aguardando pagamento',
  accredited: 'Pago',
  approved: 'Pago',
  cancelled: 'Cancelado',
  canceled: 'Cancelado',
  created: 'Criado',
  declined: 'Recusado',
  error: 'Erro',
  expired: 'Expirado',
  failed: 'Falhou',
  pending: 'Pendente',
  processed: 'Pago',
  processing: 'Em processamento',
  processing_error: 'Erro no processamento',
  rejected: 'Recusado',
  refunded: 'Reembolsado',
  charged_back: 'Contestado',
}

const paymentStatusDetailLabels: Record<string, string> = {
  accredited: 'Pagamento aprovado',
  action_required: 'Ação necessária',
  processing_error: 'Erro no processamento',
  waiting_transfer: 'Aguardando transferência',
}

const paymentMethodLabels: Record<string, string> = {
  bank_transfer: 'Transferência bancária',
  card: 'Cartão',
  credit_card: 'Cartão de crédito',
  debit_card: 'Cartão de débito',
  pix: 'Pix',
  prepaid_card: 'Cartão pré-pago',
}

function getLabel(labels: Record<string, string>, value: string | null | undefined) {
  if (!value) return null
  const normalized = value.trim().toLowerCase()
  return labels[normalized] ?? normalized.replaceAll('_', ' ')
}

export function translatePaymentStatus(status: string | null | undefined): string {
  return getLabel(paymentStatusLabels, status) ?? 'Indisponível'
}

export function translatePaymentStatusDetail(
  statusDetail: string | null | undefined,
): string | null {
  return getLabel(paymentStatusDetailLabels, statusDetail)
}

export function translatePaymentMethod(method: string | null | undefined): string {
  return getLabel(paymentMethodLabels, method) ?? 'Outro'
}
