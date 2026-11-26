import type { LayoutAdminAction } from '../../../../../shared/layout/layout-admin'
import {
  AdminSubscriptionPlanFiltersForm,
  AdminSubscriptionsFiltersForm,
} from '../components/admin-subscription-filters'
import { AdminSubscriptionDetails } from '../components/admin-subscription-details/admin-subscription-details'
import { SubscriptionPlanForm } from '../components/subscription-plan-form'
import type {
  AdminPlanFilters,
  AdminSubscriptionFilters,
  SubscriptionPlan,
  SubscriptionRecord,
} from '../types/admin-subscriptions.types'
import { subscriptionRecurrenceLabels } from '../../../../subscriptions/constants/subscription-options'

type Props = {
  isSubscribersPage: boolean
  selectedSubscription: SubscriptionRecord | null
  editingPlan: SubscriptionPlan | null
  planFilters: AdminPlanFilters
  applyPlanFilters: (filters: AdminPlanFilters) => void
  subscriptionFilters: AdminSubscriptionFilters
  applySubscriptionFilters: (filters: AdminSubscriptionFilters) => void
}

export const getAdminSubscriptionsActions = ({
  isSubscribersPage,
  selectedSubscription,
  editingPlan,
  planFilters,
  applyPlanFilters,
  subscriptionFilters,
  applySubscriptionFilters,
}: Props): LayoutAdminAction[] => {
  const actions: LayoutAdminAction[] = [
    {
      id: 'subscription-details',
      title: 'Detalhes da assinatura',
      subtitle: selectedSubscription
        ? `${selectedSubscription.user?.name ?? 'Cliente'} · ${selectedSubscription.plan.name}`
        : undefined,
      content: selectedSubscription
        ? <AdminSubscriptionDetails subscription={selectedSubscription} />
        : null,
    },
    {
      id: 'subscription-plan-filters',
      title: 'Filtrar opções de plano',
      subtitle: 'Refine os planos por nome, nível, recorrência ou status.',
      content: ({ close }) => (
        <AdminSubscriptionPlanFiltersForm
          key={JSON.stringify(planFilters)}
          filters={planFilters}
          onApply={applyPlanFilters}
          onClose={close}
        />
      ),
    },
    {
      id: 'customer-subscription-filters',
      title: 'Filtrar assinaturas',
      subtitle: 'Refine as assinaturas por cliente, plano, nível, recorrência ou status.',
      content: ({ close }) => (
        <AdminSubscriptionsFiltersForm
          key={JSON.stringify(subscriptionFilters)}
          filters={subscriptionFilters}
          onApply={applySubscriptionFilters}
          onClose={close}
        />
      ),
    },
    {
      id: 'create-subscription-plan',
      label: 'Nova opção',
      title: 'Criar opção de plano',
      subtitle: 'Escolha o nível, a recorrência e o valor da cobrança.',
      content: ({ close }) => <SubscriptionPlanForm onSaved={close} />,
    },
    {
      id: 'edit-subscription-plan',
      title: 'Editar opção de plano',
      subtitle: editingPlan
        ? `${editingPlan.name} · ${subscriptionRecurrenceLabels[editingPlan.recurrence]}`
        : undefined,
      content: ({ close }) => editingPlan
        ? <SubscriptionPlanForm
            key={editingPlan.id}
            plan={editingPlan}
            onSaved={close}
          />
        : null,
    },
  ]

  return actions.filter(({ id }) => isSubscribersPage
    ? id === 'subscription-details' || id === 'customer-subscription-filters'
    : id !== 'subscription-details' && id !== 'customer-subscription-filters')
}
