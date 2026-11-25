import { Chip, Divider, Paper, Skeleton, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { formatCurrency } from '../../../../../shared/lib/format-currency'
import { formatBrazilianDate } from '../../../../../shared/utils/format-brazilian-date'
import { translatePaymentStatus, translatePaymentStatusDetail } from '../../../../../shared/i18n/payment'
import { SubscriptionStatusChip } from '../../../../subscriptions/components/subscription-status-chip'
import { getApiErrorMessage } from '../../../../../shared/lib/api-error'
import { getAdminCustomerDetailsService } from '../services/admin-customers.service'

const tierNames = { BASIC: 'Básico', INTERMEDIATE: 'Intermediário', ADVANCED: 'Avançado' } as const
const recurrenceNames = { WEEKLY: 'Semanal', MONTHLY: 'Mensal', QUARTERLY: 'Trimestral', YEARLY: 'Anual' } as const

export function AdminCustomerDetails({ customerId }: { customerId: string }) {
  const details = useQuery({
    queryKey: ['admin-customer-details', customerId],
    queryFn: () => getAdminCustomerDetailsService(customerId),
  })

  if (details.isLoading) {
    return (
      <Stack spacing={2}>
        <Skeleton variant="text" width="70%" height={36} />
        <Skeleton variant="text" width="55%" />
        <Skeleton variant="rounded" height={120} />
        <Skeleton variant="rounded" height={180} />
      </Stack>
    )
  }

  if (details.isError || !details.data) {
    return (
      <Typography role="alert" variant="body2" color="text.secondary">
        {details.error
          ? `Não foi possível carregar o histórico deste cliente: ${getApiErrorMessage(details.error)}`
          : 'Não foi possível carregar o histórico deste cliente.'}
      </Typography>
    )
  }

  const { customer, subscriptions } = details.data

  return (
    <Stack spacing={2.5}>
      <Stack spacing={0.5}>
        <Typography variant="h6">{customer.name}</Typography>
        <Typography color="text.secondary">{customer.email}</Typography>
        <Typography variant="body2" color="text.secondary">
          Cliente desde {formatBrazilianDate(customer.createdAt)}
        </Typography>
      </Stack>

      <Divider />
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
        Histórico de assinaturas ({subscriptions.length})
      </Typography>
      {subscriptions.length === 0 ? (
        <Typography variant="body2" color="text.secondary">Este cliente ainda não possui assinaturas.</Typography>
      ) : subscriptions.map((subscription) => (
        <Paper key={subscription.id} variant="outlined" sx={{ p: 2 }}>
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{subscription.plan.name}</Typography>
              <SubscriptionStatusChip status={subscription.status} />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {tierNames[subscription.plan.tier]} · {recurrenceNames[subscription.plan.recurrence]} · {formatCurrency(subscription.plan.amount, subscription.plan.currency)} por cobrança
            </Typography>
            <Typography variant="body2">Assinada em: {formatBrazilianDate(subscription.createdAt)}</Typography>
            <Typography variant="body2">
              Próxima cobrança: {subscription.nextPaymentDate ? formatBrazilianDate(subscription.nextPaymentDate) : 'Não agendada'}
            </Typography>
            {subscription.nextPaymentCountdown && (
              <Typography variant="body2" color="text.secondary">{subscription.nextPaymentCountdown}</Typography>
            )}

            <Divider />
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Histórico de cobranças</Typography>
            {subscription.charges.length === 0 ? (
              <Typography variant="body2" color="text.secondary">Nenhuma cobrança registrada.</Typography>
            ) : subscription.charges.map((charge) => (
              <Paper key={charge.id} variant="outlined" sx={{ p: 1.5 }}>
                <Stack spacing={0.75}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {charge.amount === null ? 'Valor indisponível' : formatCurrency(charge.amount, charge.currency ?? subscription.plan.currency)}
                    </Typography>
                    <Chip size="small" label={translatePaymentStatus(charge.status)} />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {charge.paidAt ? 'Pago em' : 'Registrado em'}: {formatBrazilianDate(charge.paidAt ?? charge.createdAt)}
                  </Typography>
                  {charge.statusDetail && (
                    <Typography variant="body2" color="text.secondary">
                      Detalhe: {translatePaymentStatusDetail(charge.statusDetail) ?? charge.statusDetail}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>
                    ID da cobrança: {charge.providerPaymentId}
                  </Typography>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Paper>
      ))}
    </Stack>
  )
}
