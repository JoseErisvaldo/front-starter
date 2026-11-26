import { Box, Stack } from '@mui/material'
import { LayoutUser } from '../../../../../shared/layout/layout-user'
import { SubscriptionCheckoutDrawer } from '../components/checkout/subscription-checkout-drawer'
import { SubscriptionPlansGrid } from '../components/subscription-plans/subscription-plans-grid'
import { SubscriptionsPageHeader } from '../components/subscription-plans/subscriptions-page-header'
import { useSubscriptionPlansPage } from '../hooks/use-subscription-plans-page'

export function SubscriptionPlansView() {
  const page = useSubscriptionPlansPage()

  return (
    <LayoutUser onLogout={page.logout}>
      <Box sx={{ maxWidth: 1180, mx: 'auto', p: { xs: 2, sm: 3, md: 5 } }}>
        <Stack spacing={4}>
          <SubscriptionsPageHeader
            isMySubscriptionsPage={false}
            availableRecurrences={page.availableRecurrences}
            activeRecurrence={page.activeRecurrence}
            onRecurrenceChange={page.setSelectedRecurrence}
          />
          <SubscriptionPlansGrid
            plans={page.plans}
            visiblePlans={page.visiblePlans}
            selectedPlanId={page.selectedPlan?.id}
            publicKey={page.publicKey}
            successMessage={page.successMessage}
            onSelectPlan={page.startCheckout}
          />
          <SubscriptionCheckoutDrawer
            selectedPlan={page.selectedPlan}
            publicKey={page.publicKey}
            isCreating={page.createSubscription.isPending}
            checkoutState={page.checkoutState}
            checkoutError={page.checkoutError}
            checkoutRetry={page.checkoutRetry}
            nextPaymentDate={page.nextPaymentDate}
            userQuery={page.userQuery}
            onSubmit={page.submitCard}
            onError={page.handleCardPaymentError}
            onRetry={page.retryCheckout}
            onClose={page.closeCheckout}
          />
        </Stack>
      </Box>
    </LayoutUser>
  )
}
