import { Alert, Chip, CircularProgress, Divider, Stack, Typography } from '@mui/material'
import { getApiErrorMessage } from '../../../../../shared/lib/api-error'
import { formatCurrency } from '../../../../../shared/lib/format-currency'
import { formatBrazilianDate } from '../../../../../shared/utils/format-brazilian-date'
import {
  translatePaymentMethod,
  translatePaymentStatus,
  translatePaymentStatusDetail,
} from '../../../../../shared/i18n/payment'
import { useAdminOrderDetailsQuery } from '../queries/use-admin-order-details-query'

type Props = {
  paymentId: string
}

function getStatusColor(status: string): 'success' | 'warning' | 'error' {
  switch (status.toLowerCase()) {
    case 'processed':
    case 'approved':
    case 'accredited':
      return 'success'
    case 'cancelled':
    case 'canceled':
    case 'expired':
    case 'failed':
    case 'rejected':
    case 'declined':
    case 'error':
    case 'processing_error':
      return 'error'
    default:
      return 'warning'
  }
}

export function AdminOrderDetails({ paymentId }: Props) {
  const orderQuery = useAdminOrderDetailsQuery(paymentId)
  const order = orderQuery.data

  if (orderQuery.isLoading) return <CircularProgress size={24} />
  if (orderQuery.error) {
    return (
      <Alert severity="error">
        Não foi possível carregar os detalhes: {getApiErrorMessage(orderQuery.error)}
      </Alert>
    )
  }
  if (!order) return <Alert severity="warning">Pedido não encontrado.</Alert>

  return (
    <Stack spacing={2.5} sx={{ minWidth: 0 }}>
      <Stack spacing={1}>
        <Typography variant="subtitle2" color="text.secondary">Status do pedido</Typography>
        <Chip
          label={translatePaymentStatus(order.status)}
          color={getStatusColor(order.status)}
          size="small"
          sx={{ alignSelf: 'flex-start' }}
        />
      </Stack>

      <Divider />
      <Stack spacing={0.75}>
        <Typography variant="subtitle2" color="text.secondary">Cliente</Typography>
        <Typography sx={{ fontWeight: 600 }}>{order.customer.name}</Typography>
        <Typography color="text.secondary">{order.customer.email}</Typography>
      </Stack>

      <Divider />
      <Stack spacing={1.25}>
        <Typography variant="subtitle2" color="text.secondary">Itens do pedido</Typography>
        {order.items.map((item, index) => (
          <Stack key={`${item.productName}-${index}`} spacing={0.5}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
              <Typography sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
                {item.productName} × {item.quantity}
              </Typography>
              <Typography sx={{ minWidth: 0, fontWeight: 600, textAlign: 'right', overflowWrap: 'anywhere' }}>
                {formatCurrency(item.lineTotal, item.currency)}
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {formatCurrency(item.unitPrice, item.currency)} por unidade
            </Typography>
          </Stack>
        ))}
        <Divider />
        <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
          <Typography sx={{ fontWeight: 700 }}>Total</Typography>
          <Typography sx={{ fontWeight: 700 }}>{formatCurrency(order.amount, 'BRL')}</Typography>
        </Stack>
      </Stack>

      <Divider />
      <Stack spacing={1}>
        <Typography variant="subtitle2" color="text.secondary">Pagamento</Typography>
        <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
          <Typography color="text.secondary">Método</Typography>
          <Typography sx={{ textAlign: 'right' }}>
            {translatePaymentMethod(order.paymentMethod)}
          </Typography>
        </Stack>
        {order.statusDetail && (
          <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
            <Typography color="text.secondary">Detalhe do status</Typography>
            <Typography sx={{ textAlign: 'right' }}>
              {translatePaymentStatusDetail(order.statusDetail) ?? order.statusDetail}
            </Typography>
          </Stack>
        )}
        {order.providerOrderId && (
          <Stack spacing={0.5}>
            <Typography color="text.secondary">Código do provedor</Typography>
            <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>
              {order.providerOrderId}
            </Typography>
          </Stack>
        )}
      </Stack>

      <Divider />
      <Stack spacing={1}>
        <Typography variant="subtitle2" color="text.secondary">Identificação</Typography>
        <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>
          Pedido: {order.id}
        </Typography>
        <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>
          Referência: {order.externalReference}
        </Typography>
        <Typography variant="body2">
          Criado em: {formatBrazilianDate(order.createdAt)}
        </Typography>
      </Stack>
    </Stack>
  )
}
