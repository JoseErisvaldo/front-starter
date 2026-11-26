import { useState } from 'react'
import { useLogout } from '../../../../public/auth/hooks/use-logout'
import { useMySubscriptionsQuery } from '../queries/use-my-subscriptions-query'
import { useCancelSubscriptionMutation } from '../mutations/use-cancel-subscription-mutation'

export function useMySubscriptionsPage() {
  const logout = useLogout()
  const [detailsSubscriptionId, setDetailsSubscriptionId] = useState<string | null>(null)
  const [cancelConfirmationSubscriptionId, setCancelConfirmationSubscriptionId] = useState<string | null>(null)
  const subscriptions = useMySubscriptionsQuery(true, false)
  const cancelSubscription = useCancelSubscriptionMutation()

  const detailsSubscription = subscriptions.data?.find(({ id }) => id === detailsSubscriptionId)
  const cancelConfirmationSubscription = subscriptions.data?.find(
    ({ id }) => id === cancelConfirmationSubscriptionId,
  )

  function requestCancellation(subscriptionId: string) {
    cancelSubscription.reset()
    setCancelConfirmationSubscriptionId(subscriptionId)
  }

  function confirmCancellation() {
    if (!cancelConfirmationSubscriptionId) return
    cancelSubscription.mutate(cancelConfirmationSubscriptionId, {
      onSuccess: () => setCancelConfirmationSubscriptionId(null),
    })
  }

  function closeCancellationConfirmation() {
    if (!cancelSubscription.isPending) setCancelConfirmationSubscriptionId(null)
  }

  return {
    logout,
    subscriptions,
    detailsSubscription,
    setDetailsSubscriptionId,
    cancelConfirmationSubscription,
    cancelSubscription,
    requestCancellation,
    confirmCancellation,
    closeCancellationConfirmation,
  }
}
