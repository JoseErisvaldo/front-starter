import { Alert, Card, CardContent, Grid, Skeleton, Stack, Typography } from '@mui/material'
import { getApiErrorMessage } from '../../../../../../shared/lib/api-error'
import type { PublicSubscriptionPlan } from '../../../../../subscriptions/schema/subscriptions.schema'
import { SubscriptionPlanCard } from './subscription-plan-card'

export function SubscriptionPlansGrid({
  plans,
  visiblePlans,
  selectedPlanId,
  publicKey,
  successMessage,
  onSelectPlan,
  isAuthenticated,
}: {
  plans: {
    data?: PublicSubscriptionPlan[]
    isLoading: boolean
    isError: boolean
    error: Error | null
  }
  visiblePlans: PublicSubscriptionPlan[]
  selectedPlanId?: string
  publicKey: string | undefined
  successMessage: string
  onSelectPlan: (plan: PublicSubscriptionPlan) => void
  isAuthenticated: boolean
}) {
  return (
    <>
      {plans.isError && <Alert severity="error">{getApiErrorMessage(plans.error)}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {!publicKey && <Alert severity="error">Configure VITE_MP_PUBLIC_KEY no frontend para habilitar a tokenização segura do cartão.</Alert>}
      <Grid container spacing={2.5} sx={{ mt: { xs: -1, md: -1.5 } }}>
        {plans.isLoading && Array.from({ length: 3 }, (_, index) => (
          <Grid key={`plan-skeleton-${index}`} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Stack spacing={1.5}>
                  <Skeleton variant="rounded" width="70%" height={32} />
                  <Skeleton variant="text" width="55%" height={52} />
                  <Skeleton variant="text" width="75%" />
                  <Skeleton variant="rounded" width="100%" height={36} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {!plans.isLoading && visiblePlans.map((plan) => (
          <Grid key={plan.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <SubscriptionPlanCard
              plan={plan}
              selected={selectedPlanId === plan.id}
              enabled={!isAuthenticated || Boolean(publicKey)}
              actionLabel={isAuthenticated ? 'Assinar' : 'Entrar para assinar'}
              onSelect={onSelectPlan}
            />
          </Grid>
        ))}
      </Grid>
      {!plans.isLoading && plans.data?.length === 0 && (
        <Typography align="center" sx={{ color: 'text.secondary' }}>Ainda não há planos disponíveis.</Typography>
      )}
      {!plans.isLoading && (plans.data?.length ?? 0) > 0 && visiblePlans.length === 0 && (
        <Typography align="center" sx={{ color: 'text.secondary' }}>Nenhum plano disponível para esta recorrência.</Typography>
      )}
    </>
  )
}
