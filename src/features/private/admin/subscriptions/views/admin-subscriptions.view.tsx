import { Stack, Typography } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { LayoutAdmin } from '../../../../../shared/layout/layout-admin'
import { useLogout } from '../../../../public/auth/hooks/use-logout'
import {
  getActiveSubscriptionFilterCount,
  getActiveSubscriptionPlanFilterCount,
} from '../components/admin-subscription-filters'
import { AdminPlansTable } from '../components/admin-plans-table/admin-plans-table'
import { AdminSubscribersTable } from '../components/admin-subscribers-table/admin-subscribers-table'
import { useAdminSubscriptionsPage } from '../hooks/use-admin-subscriptions-page'
import { getAdminSubscriptionsActions } from '../constants/admin-subscriptions.actions'

export function AdminSubscriptionsView() {
  const isSubscribersPage = useLocation().pathname === '/admin/assinantes'
  const page = useAdminSubscriptionsPage(isSubscribersPage)
  const logout = useLogout()
  const actions = getAdminSubscriptionsActions({
    isSubscribersPage,
    selectedSubscription: page.selectedSubscription,
    editingPlan: page.editingPlan,
    planFilters: page.planFilters,
    applyPlanFilters: page.applyPlanFilters,
    subscriptionFilters: page.subscriptionFilters,
    applySubscriptionFilters: page.applySubscriptionFilters,
  })

  return (
    <LayoutAdmin
      title={isSubscribersPage ? 'Assinantes' : 'Assinaturas'}
      subtitle={isSubscribersPage
        ? 'Acompanhe as assinaturas dos clientes e suas próximas cobranças.'
        : 'Gerencie as opções de planos e suas recorrências.'}
      onLogout={logout}
      actions={actions}
    >
      {({ openAction }) => (
        <Stack spacing={4}>
          {!isSubscribersPage && (
            <Stack spacing={1.5}>
              <Typography variant="h5" component="h2">Opções de plano</Typography>
              <AdminPlansTable
                plans={page.plans.data?.plans ?? []}
                isLoading={page.plans.isLoading || page.plans.isFetching}
                isError={page.plans.isError}
                total={page.plans.data?.pagination.total ?? 0}
                paginationModel={page.planPaginationModel}
                onPaginationModelChange={page.setPlanPaginationModel}
                sortModel={page.planSortModel}
                onSortModelChange={page.changePlanSort}
                activeFilterCount={getActiveSubscriptionPlanFilterCount(page.planFilters)}
                isMutationPending={page.isPlanMutationPending}
                isMutationError={page.isPlanMutationError}
                onOpenFilters={() => openAction('subscription-plan-filters')}
                onEditPlan={(plan) => {
                  page.setEditingPlan(plan)
                  openAction('edit-subscription-plan')
                }}
                onTogglePlan={page.togglePlan}
              />
            </Stack>
          )}
          {isSubscribersPage && (
            <Stack spacing={1.5}>
              <Typography variant="h5" component="h2">Assinaturas de clientes</Typography>
              <AdminSubscribersTable
                subscriptions={page.subscriptions.data?.subscriptions ?? []}
                isLoading={page.subscriptions.isLoading || page.subscriptions.isFetching}
                isError={page.subscriptions.isError}
                total={page.subscriptions.data?.pagination.total ?? 0}
                paginationModel={page.subscriptionPaginationModel}
                onPaginationModelChange={page.setSubscriptionPaginationModel}
                sortModel={page.subscriptionSortModel}
                onSortModelChange={page.changeSubscriptionSort}
                activeFilterCount={getActiveSubscriptionFilterCount(page.subscriptionFilters)}
                onOpenFilters={() => openAction('customer-subscription-filters')}
                onViewDetails={(subscription) => {
                  page.setSelectedSubscription(subscription)
                  openAction('subscription-details')
                }}
              />
            </Stack>
          )}
        </Stack>
      )}
    </LayoutAdmin>
  )
}
