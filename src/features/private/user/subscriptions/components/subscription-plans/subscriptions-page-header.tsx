import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import type { PublicSubscriptionPlan } from '../../../../../subscriptions/schema/subscriptions.schema'
import { subscriptionRecurrenceLabels } from '../../../../../subscriptions/constants/subscription-options'

export function SubscriptionsPageHeader({
  isMySubscriptionsPage,
  availableRecurrences,
  activeRecurrence,
  onRecurrenceChange,
}: {
  isMySubscriptionsPage: boolean
  availableRecurrences: PublicSubscriptionPlan['recurrence'][]
  activeRecurrence: PublicSubscriptionPlan['recurrence']
  onRecurrenceChange: (recurrence: PublicSubscriptionPlan['recurrence']) => void
}) {
  return (
    <Box
      sx={!isMySubscriptionsPage ? {
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 5, sm: 7, md: 9 },
        borderRadius: 3,
        bgcolor: '#e1f0e5',
        color: '#173d30',
        textAlign: 'center',
      } : undefined}
    >
      <Typography variant={isMySubscriptionsPage ? 'h4' : 'h3'} component="h1" sx={{ fontWeight: 750, letterSpacing: '-.04em' }}>
        {isMySubscriptionsPage ? 'Minhas assinaturas' : 'Planos de assinatura'}
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1.5, maxWidth: 560, mx: 'auto' }}>
        {isMySubscriptionsPage
          ? 'Acompanhe seus planos contratados, próximas cobranças e histórico.'
          : 'Escolha o plano ideal para você e acompanhe sua assinatura com facilidade.'}
      </Typography>
      {!isMySubscriptionsPage && availableRecurrences.length > 0 && (
        <ToggleButtonGroup
          exclusive
          value={activeRecurrence}
          onChange={(_event, value: PublicSubscriptionPlan['recurrence'] | null) => {
            if (value) onRecurrenceChange(value)
          }}
          aria-label="Filtrar planos por recorrência"
          sx={{
            mt: 3.5,
            p: 0.5,
            borderRadius: 2,
            bgcolor: '#edf2ee',
            '& .MuiToggleButtonGroup-grouped': { border: 0, borderRadius: '6px !important' },
          }}
        >
          {availableRecurrences.map((recurrence) => (
            <ToggleButton
              key={recurrence}
              value={recurrence}
              aria-label={`Planos com cobrança ${subscriptionRecurrenceLabels[recurrence].toLowerCase()}`}
              sx={{
                px: { xs: 1.5, sm: 2.5 },
                py: 1,
                color: 'text.secondary',
                textTransform: 'none',
                '&.Mui-selected': { color: '#fff', bgcolor: '#26714f' },
                '&.Mui-selected:hover': { bgcolor: '#1d6848' },
                '&:hover': { bgcolor: '#dce8df' },
              }}
            >
              {subscriptionRecurrenceLabels[recurrence]}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      )}
    </Box>
  )
}
