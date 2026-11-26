import { Alert, Paper, Skeleton, Stack, Typography } from '@mui/material'
import { getApiErrorMessage } from '../../../../../shared/lib/api-error'
import type { MySubscription } from '../types/my-subscriptions.types'
import { SubscriptionListItem } from './subscription-list-item'

export function MySubscriptionsList({
  subscriptions,
  isLoading,
  isError,
  error,
  cancellationError,
  onViewDetails,
}: {
  subscriptions?: MySubscription[]
  isLoading: boolean
  isError: boolean
  error: Error | null
  cancellationError?: string
  onViewDetails: (id: string) => void
}) {
  return (
    <>
      {cancellationError && <Alert severity="error">{cancellationError}</Alert>}
      <Stack spacing={2}>
        <Stack spacing={1}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 750, letterSpacing: '-.04em' }}>
            Minhas assinaturas
          </Typography>
          <Typography color="text.secondary">
            Acompanhe seus planos, próximas cobranças e histórico de pagamentos.
          </Typography>
        </Stack>
        {isError && <Alert severity="error">{error ? getApiErrorMessage(error) : 'Não foi possível carregar as assinaturas.'}</Alert>}
        {isLoading && Array.from({ length: 2 }, (_, index) => (
          <Paper key={`subscription-skeleton-${index}`} variant="outlined" sx={{ p: 2.5 }}>
            <Stack spacing={1.5}>
              <Skeleton variant="text" width="55%" height={32} />
              <Skeleton variant="text" width="70%" />
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="rounded" width={140} height={36} />
            </Stack>
          </Paper>
        ))}
        {!isLoading && subscriptions?.map((subscription) => (
          <SubscriptionListItem
            key={subscription.id}
            subscription={subscription}
            onViewDetails={onViewDetails}
          />
        ))}
        {subscriptions?.length === 0 && !isLoading && (
          <Alert severity="info">Você ainda não possui assinaturas.</Alert>
        )}
      </Stack>
    </>
  )
}
