import { useQuery } from '@tanstack/react-query'
import { getPaymentsService } from '../services/get-payments.service'
import { paymentQueryKeys } from '../endpoints-keys/payment.keys'
import { isPaymentFinal } from '../utils/payment-status'
import { TOKEN_STORAGE_KEY } from '../../../services/http-client'

export function usePaymentsQuery(
  page: number,
  pageSize: number,
  enabled = Boolean(localStorage.getItem(TOKEN_STORAGE_KEY)),
) {
  return useQuery({
    queryKey: paymentQueryKeys.list(page, pageSize),
    queryFn: () => getPaymentsService(page, pageSize),
    enabled,
    refetchInterval: (query) => {
      const payments = query.state.data?.payments ?? []
      return payments.some(
        (payment) =>
          !isPaymentFinal(
            payment.status,
            payment.statusDetail,
            payment.expiresAt,
          ),
      )
        ? 15_000
        : false
    },
  })
}
