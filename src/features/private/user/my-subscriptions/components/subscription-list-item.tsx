import { Button, Paper, Stack, Typography } from '@mui/material'
import { formatCurrency } from '../../../../../shared/lib/format-currency'
import { formatBrazilianDate } from '../../../../../shared/utils/format-brazilian-date'
import { translatePaymentStatus } from '../../../../../shared/i18n/payment'
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
    <Paper variant="outlined" sx={{ p: 2.5 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}>
        <Stack>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="h6">
              {subscription.plan.name} · {subscriptionRecurrenceLabels[subscription.plan.recurrence]}
            </Typography>
            <SubscriptionStatusChip status={subscription.status} />
          </Stack>
          <Typography color="text.secondary">
            {formatCurrency(subscription.plan.amount, subscription.plan.currency)} por cobrança
          </Typography>
          {subscription.nextPaymentDate && (
            <>
              <Typography variant="body2" color="text.secondary">
                Próxima cobrança: {formatBrazilianDate(subscription.nextPaymentDate)}
              </Typography>
              {subscription.nextPaymentCountdown && (
                <Typography variant="body2" color="text.secondary">{subscription.nextPaymentCountdown}</Typography>
              )}
            </>
          )}
        </Stack>
        <Button variant="outlined" onClick={() => onViewDetails(subscription.id)}>
          Ver detalhes
        </Button>
      </Stack>
      {subscription.charges.length > 0 && (
        <Stack spacing={1} sx={{ mt: 2 }}>
          <Typography variant="subtitle2">Cobranças</Typography>
          {subscription.charges.map((charge) => (
            <Typography key={charge.id} variant="body2" color="text.secondary">
              {charge.paidAt ? formatBrazilianDate(charge.paidAt) : formatBrazilianDate(charge.createdAt)} ·{' '}
              {charge.amount === null ? '—' : formatCurrency(charge.amount, charge.currency ?? subscription.plan.currency)} ·{' '}
              {translatePaymentStatus(charge.status)}
            </Typography>
          ))}
        </Stack>
      )}
    </Paper>
  )
}
