import { useQuery } from '@tanstack/react-query'
import { getPaymentService } from '../services/get-payment.service'
import { paymentQueryKeys } from '../endpoints-keys/payment.keys'

const finalStatuses = new Set([
  'processed',
  'failed',
  'cancelled',
  'rejected',
  'expired',
  'refunded',
  'charged_back',
])

export function usePaymentStatusQuery(id: string | null, enabled: boolean) {
  return useQuery({
    queryKey: paymentQueryKeys.detail(id ?? ''),
    queryFn: () => {
      if (!id) throw new Error('ID do pagamento não informado')
      return getPaymentService(id)
    },
    enabled: Boolean(id) && enabled,
    refetchInterval: (query) => {
      const status = query.state.data?.payment.status
      return status && finalStatuses.has(status) ? false : 5_000
    },
  })
}
