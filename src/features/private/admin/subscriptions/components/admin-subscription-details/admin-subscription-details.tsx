import { Chip, Divider, Link, Paper, Stack, Typography } from '@mui/material'
import { formatCurrency } from '../../../../../../shared/lib/format-currency'
import { formatBrazilianDate } from '../../../../../../shared/utils/format-brazilian-date'
import { translatePaymentStatus, translatePaymentStatusDetail } from '../../../../../../shared/i18n/payment'
import { SubscriptionStatusChip } from '../../../../../subscriptions/components/subscription-status-chip'
import type { SubscriptionRecord } from '../../types/admin-subscriptions.types'
import {
  subscriptionRecurrenceLabels,
  subscriptionTierLabels,
} from '../../../../../subscriptions/constants/subscription-options'

export function AdminSubscriptionDetails({ subscription }: { subscription: SubscriptionRecord }) {
  return (
    <Stack spacing={2.5} sx={{ minWidth: 0 }}>
      <Stack spacing={1}>
        <Typography variant="subtitle2" color="text.secondary">Status da assinatura</Typography>
        <SubscriptionStatusChip status={subscription.status} />
      </Stack>

      <Divider />
      <Stack spacing={0.75}>
        <Typography variant="subtitle2" color="text.secondary">Cliente</Typography>
        <Typography sx={{ fontWeight: 600 }}>{subscription.user?.name ?? '—'}</Typography>
        <Typography color="text.secondary">{subscription.user?.email ?? '—'}</Typography>
      </Stack>

      <Divider />
      <Stack spacing={0.75}>
        <Typography variant="subtitle2" color="text.secondary">Plano contratado</Typography>
        <Typography sx={{ fontWeight: 600 }}>{subscription.plan.name}</Typography>
        <Typography color="text.secondary">
          {subscriptionTierLabels[subscription.plan.tier]} · {subscriptionRecurrenceLabels[subscription.plan.recurrence]}
        </Typography>
        <Typography color="text.secondary">
          {formatCurrency(subscription.plan.amount, subscription.plan.currency)} por cobrança
        </Typography>
      </Stack>

      <Divider />
      <Stack spacing={0.75}>
        <Typography variant="subtitle2" color="text.secondary">Datas</Typography>
        <Typography variant="body2">Criada em: {formatBrazilianDate(subscription.createdAt)}</Typography>
        <Typography variant="body2">Atualizada em: {formatBrazilianDate(subscription.updatedAt)}</Typography>
        <Typography variant="body2">
          Próxima cobrança: {subscription.nextPaymentDate ? formatBrazilianDate(subscription.nextPaymentDate) : 'Ainda não agendada'}
        </Typography>
        {subscription.nextPaymentCountdown && (
          <Typography variant="body2" color="text.secondary">{subscription.nextPaymentCountdown}</Typography>
        )}
      </Stack>

      <Divider />
      <Stack spacing={1.25}>
        <Typography variant="subtitle2" color="text.secondary">Cobranças recentes</Typography>
        {subscription.charges.length > 0 ? subscription.charges.map((charge) => (
          <Paper key={charge.id} variant="outlined" sx={{ p: 1.5 }}>
            <Stack spacing={0.75}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
                <Typography sx={{ fontWeight: 600 }}>
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
                Referência Mercado Pago: {charge.providerPaymentId}
              </Typography>
            </Stack>
          </Paper>
        )) : <Typography variant="body2" color="text.secondary">Nenhuma cobrança registrada.</Typography>}
      </Stack>

      <Divider />
      <Stack spacing={0.75}>
        <Typography variant="subtitle2" color="text.secondary">Referências</Typography>
        <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>ID local: {subscription.id}</Typography>
        {subscription.externalReference && (
          <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>Referência externa: {subscription.externalReference}</Typography>
        )}
        {subscription.providerSubscriptionId && (
          <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>ID Mercado Pago: {subscription.providerSubscriptionId}</Typography>
        )}
        {subscription.plan.providerPlanId && (
          <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>ID do plano Mercado Pago: {subscription.plan.providerPlanId}</Typography>
        )}
        {subscription.plan.checkoutUrl && (
          <Link href={subscription.plan.checkoutUrl} target="_blank" rel="noreferrer" variant="body2">
            Abrir checkout do plano
          </Link>
        )}
      </Stack>
    </Stack>
  )
}
