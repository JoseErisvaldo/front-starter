import { useQuery } from '@tanstack/react-query'
import { getPaymentService } from '../services/get-payment.service'
import { paymentQueryKeys } from '../endpoints-keys/payment.keys'
import { isPaymentFinal } from '../utils/payment-status'

export function usePaymentStatusQuery(id: string | null, enabled: boolean) {
  return useQuery({
    queryKey: paymentQueryKeys.detail(id ?? ''),
    queryFn: () => {
      if (!id) throw new Error('ID do pagamento não informado')
      return getPaymentService(id)
    },
    enabled: Boolean(id) && enabled,
    refetchInterval: (query) => {
      const payment = query.state.data?.payment
      return payment &&
        isPaymentFinal(
          payment.status,
          payment.statusDetail,
          payment.expiresAt,
        )
        ? false
        : 15_000
    },
  })
}
