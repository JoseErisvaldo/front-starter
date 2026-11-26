import { Box, Stack } from '@mui/material'
import { LayoutUser } from '../../../../../shared/layout/layout-user'
import { getApiErrorMessage } from '../../../../../shared/lib/api-error'
import { CancelSubscriptionDialog } from '../components/cancel-subscription-dialog'
import { MySubscriptionsList } from '../components/my-subscriptions-list'
import { SubscriptionDetailsDrawer } from '../components/subscription-details/subscription-details-drawer'
import { useMySubscriptionsPage } from '../hooks/use-my-subscriptions-page'

export function MySubscriptionsView() {
  const page = useMySubscriptionsPage()
  const cancelError = page.cancelSubscription.error
    ? getApiErrorMessage(page.cancelSubscription.error)
    : undefined

  return (
    <LayoutUser onLogout={page.logout}>
      <Box sx={{ maxWidth: 1180, mx: 'auto', p: { xs: 2, sm: 3, md: 5 } }}>
        <Stack spacing={4}>
          <MySubscriptionsList
            subscriptions={page.subscriptions.data}
            isLoading={page.subscriptions.isLoading}
            isError={page.subscriptions.isError}
            error={page.subscriptions.error}
            cancellationError={page.cancelSubscription.isError ? cancelError : undefined}
            onViewDetails={page.setDetailsSubscriptionId}
          />
          <SubscriptionDetailsDrawer
            subscription={page.detailsSubscription}
            isCancelPending={page.cancelSubscription.isPending}
            cancelError={cancelError}
            onClose={() => page.setDetailsSubscriptionId(null)}
            onRequestCancellation={page.requestCancellation}
          />
          <CancelSubscriptionDialog
            subscription={page.cancelConfirmationSubscription}
            isPending={page.cancelSubscription.isPending}
            error={cancelError}
            onClose={page.closeCancellationConfirmation}
            onConfirm={page.confirmCancellation}
          />
        </Stack>
      </Box>
    </LayoutUser>
  )
}
