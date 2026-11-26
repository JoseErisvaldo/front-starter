import { useState } from 'react'
import { useLogout } from '../../../../public/auth/hooks/use-logout'
import { getApiErrorMessage } from '../../../../../shared/lib/api-error'
// TODO Ajuste ta importando outra features
import { usePaymentsQuery } from '../../payments/queries/use-payments-query'

export function useOrdersPage() {
  const logout = useLogout()
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null)
  const [paymentsPage, setPaymentsPage] = useState(0)
  const paymentsPageSize = 10
  const paymentsQuery = usePaymentsQuery(paymentsPage + 1, paymentsPageSize, true)

  function handlePaymentsPageChange(_event: unknown, page: number) {
    setPaymentsPage(page)
  }

  return {
    payments: paymentsQuery.data?.payments ?? [],
    paymentsPage,
    paymentsPageSize,
    paymentsTotal: paymentsQuery.data?.pagination.total ?? 0,
    isPaymentsLoading: paymentsQuery.isLoading,
    isPaymentsFetching: paymentsQuery.isFetching,
    paymentsError: paymentsQuery.error ? getApiErrorMessage(paymentsQuery.error) : '',
    selectedPaymentId,
    onLogout: logout,
    onViewPaymentDetails: setSelectedPaymentId,
    onClosePaymentDetails: () => setSelectedPaymentId(null),
    onPaymentsPageChange: handlePaymentsPageChange,
    onPaymentsRefresh: () => void paymentsQuery.refetch(),
  }
}
