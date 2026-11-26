import { Box, Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material'
import { formatCurrency } from '../../../../../../shared/lib/format-currency'
import { subscriptionRecurrenceLabels, subscriptionTierLabels } from '../../../../../subscriptions/constants/subscription-options'
import type { PublicSubscriptionPlan } from '../../../../../subscriptions/schema/subscriptions.schema'

export function SubscriptionPlanCard({
  plan,
  selected,
  enabled,
  actionLabel,
  onSelect,
}: {
  plan: PublicSubscriptionPlan
  selected: boolean
  enabled: boolean
  actionLabel: string
  onSelect: (plan: PublicSubscriptionPlan) => void
}) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        borderColor: selected ? 'primary.main' : 'divider',
        borderRadius: 2,
        '&:hover': { borderColor: 'primary.main' },
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Stack spacing={2} sx={{ height: '100%' }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
            <Typography variant="h6" sx={{ minWidth: 0, fontWeight: 700, overflowWrap: 'anywhere' }}>
              {plan.name}
            </Typography>
            <Chip
              label={subscriptionTierLabels[plan.tier]}
              color="primary"
              size="small"
              sx={{ flexShrink: 0, fontWeight: 700 }}
            />
          </Stack>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, mt: 'auto !important' }}>
            <Typography variant="h3" sx={{ fontWeight: 750, letterSpacing: '-.04em', color: '#173d30' }}>
              {formatCurrency(plan.amount, plan.currency)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              / {subscriptionRecurrenceLabels[plan.recurrence].toLowerCase()}
            </Typography>
          </Box>
          <Button fullWidth variant="contained" disabled={!enabled} onClick={() => onSelect(plan)} sx={{ py: 1.1, fontWeight: 700 }}>
            {actionLabel}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}
