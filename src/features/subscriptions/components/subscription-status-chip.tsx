import { Chip } from '@mui/material'
import { translatePaymentStatus } from '../../../shared/i18n/payment'

const statusNames: Record<string, string> = {
  authorized: 'Ativa',
  active: 'Ativa',
  pending: 'Pendente',
  paused: 'Pausada',
  canceled: 'Cancelada',
  cancelled: 'Cancelada',
  error: 'Erro na criação',
  rejected: 'Recusada',
}

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
  authorized: 'success',
  active: 'success',
  pending: 'warning',
  paused: 'warning',
  canceled: 'default',
  cancelled: 'default',
  error: 'error',
  rejected: 'error',
}

export function SubscriptionStatusChip({
  status,
  size = 'small',
}: {
  status: string
  size?: 'small' | 'medium'
}) {
  const normalizedStatus = status.toLowerCase()

  return (
    <Chip
      label={statusNames[normalizedStatus] ?? translatePaymentStatus(normalizedStatus)}
      color={statusColors[normalizedStatus] ?? 'default'}
      size={size}
    />
  )
}
