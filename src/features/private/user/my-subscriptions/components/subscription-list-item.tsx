import { Button, Divider, Paper, Stack, Typography } from '@mui/material'
import { formatCurrency } from '../../../../../shared/lib/format-currency'
import { formatBrazilianDate } from '../../../../../shared/utils/format-brazilian-date'
import { SubscriptionStatusChip } from '../../../../subscriptions/components/subscription-status-chip'
import { subscriptionRecurrenceLabels } from '../../../../subscriptions/constants/subscription-options'
import type { MySubscription } from '../types/my-subscriptions.types'

export function SubscriptionListItem({
  subscription,
  onViewDetails,
}: {
  subscription: MySubscription
  onViewDetails: (id: string) => void
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 2,
        borderColor: '#dce8df',
        bgcolor: '#fff',
      }}
    >
      <Stack spacing={2}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}
        >
          <Stack spacing={0.75} sx={{ minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, overflowWrap: 'anywhere' }}>
              {subscription.plan.name}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography variant="body2" color="text.secondary">
                Cobrança {subscriptionRecurrenceLabels[subscription.plan.recurrence].toLowerCase()}
              </Typography>
              <SubscriptionStatusChip status={subscription.status} />
            </Stack>
          </Stack>
          <Button
            variant="outlined"
            onClick={() => onViewDetails(subscription.id)}
            sx={{ flexShrink: 0, alignSelf: { xs: 'flex-start', sm: 'center' } }}
          >
            Ver detalhes
          </Button>
        </Stack>
        <Divider />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1.5, sm: 5 }}>
          <Stack spacing={0.25}>
            <Typography variant="caption" color="text.secondary">VALOR POR COBRANÇA</Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {formatCurrency(subscription.plan.amount, subscription.plan.currency)}
            </Typography>
          </Stack>
          <Stack spacing={0.25}>
            <Typography variant="caption" color="text.secondary">PRÓXIMA COBRANÇA</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {subscription.nextPaymentDate
                ? formatBrazilianDate(subscription.nextPaymentDate)
                : 'Ainda não agendada'}
            </Typography>
            {subscription.nextPaymentCountdown && (
              <Typography variant="caption" color="text.secondary">
                {subscription.nextPaymentCountdown}
              </Typography>
            )}
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ alignSelf: { sm: 'center' } }}>
            {subscription.charges.length} {subscription.charges.length === 1 ? 'cobrança registrada' : 'cobranças registradas'}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  )
}
