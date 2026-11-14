import { useState } from 'react'
import { getApiErrorMessage } from '../../../shared/lib/api-error'
import { usePaymentsQuery } from '../../payments/queries/use-payments-query'

export function useHome(enabled = true) {
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null)
  const [paymentsPage, setPaymentsPage] = useState(0)
  const paymentsPageSize = 10
  const paymentsQuery = usePaymentsQuery(
    paymentsPage + 1,
    paymentsPageSize,
    enabled,
  )

  function openPaymentDetails(paymentId: string) {
    setSelectedPaymentId(paymentId)
  }

  function closePaymentDetails() {
    setSelectedPaymentId(null)
  }

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
    onViewPaymentDetails: openPaymentDetails,
    onClosePaymentDetails: closePaymentDetails,
    onPaymentsPageChange: handlePaymentsPageChange,
    onPaymentsRefresh: () => void paymentsQuery.refetch(),
  }
}
