import { Alert, Box, Button, Chip, DialogContent, DialogTitle, Divider, Drawer, IconButton, Paper, Stack, Typography } from '@mui/material'
import { formatCurrency } from '../../../../../../shared/lib/format-currency'
import { formatBrazilianDate } from '../../../../../../shared/utils/format-brazilian-date'
import { translatePaymentStatus, translatePaymentStatusDetail } from '../../../../../../shared/i18n/payment'
import { SubscriptionStatusChip } from '../../../../../subscriptions/components/subscription-status-chip'
import { subscriptionRecurrenceLabels, subscriptionTierLabels } from '../../../../../subscriptions/constants/subscription-options'
import type { MySubscription } from '../../types/my-subscriptions.types'
import { DetailRow } from './detail-row'

export function SubscriptionDetailsDrawer({
  subscription,
  isCancelPending,
  cancelError,
  onClose,
  onRequestCancellation,
}: {
  subscription?: MySubscription
  isCancelPending: boolean
  cancelError?: string
  onClose: () => void
  onRequestCancellation: (id: string) => void
}) {
  const canCancel = subscription
    && !['canceled', 'cancelled', 'error'].includes(subscription.status.toLowerCase())

  return (
    <Drawer
      anchor="right"
      open={Boolean(subscription)}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '100%', sm: 560 },
            maxWidth: '100vw',
            display: 'flex',
            flexDirection: 'column',
          },
        },
      }}
    >
      {subscription && (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <DialogTitle sx={{ pr: 7, borderBottom: 1, borderColor: 'divider' }}>
            <Typography component="span" variant="h6">Detalhes da assinatura</Typography>
            <IconButton aria-label="Fechar detalhes" onClick={onClose} sx={{ position: 'absolute', right: 12, top: 12 }}>
              <span aria-hidden="true">×</span>
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ flex: 1, minHeight: 0, p: { xs: 2, sm: 3 } }}>
            <Stack spacing={2.5}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                <SubscriptionStatusChip status={subscription.status} size="medium" />
                <Typography variant="h6">{subscription.plan.name}</Typography>
              </Stack>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Stack spacing={1}>
                  <Typography variant="subtitle2">Plano contratado</Typography>
                  <DetailRow label="Nível" value={subscriptionTierLabels[subscription.plan.tier]} />
                  <DetailRow label="Recorrência" value={subscriptionRecurrenceLabels[subscription.plan.recurrence]} />
                  <DetailRow label="Valor por cobrança" value={formatCurrency(subscription.plan.amount, subscription.plan.currency)} />
                </Stack>
              </Paper>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Stack spacing={1}>
                  <Typography variant="subtitle2">Datas</Typography>
                  <DetailRow label="Assinatura criada em" value={formatBrazilianDate(subscription.createdAt)} />
                  <DetailRow label="Última atualização" value={formatBrazilianDate(subscription.updatedAt)} />
                  <DetailRow
                    label="Próxima cobrança"
                    value={subscription.nextPaymentDate ? formatBrazilianDate(subscription.nextPaymentDate) : 'Ainda não agendada'}
                  />
                  {subscription.nextPaymentCountdown && (
                    <Typography variant="body2" color="text.secondary">{subscription.nextPaymentCountdown}</Typography>
                  )}
                </Stack>
              </Paper>
              <Divider />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Histórico de cobranças</Typography>
              {subscription.charges.length > 0 ? (
                <Stack spacing={1.5}>
                  {subscription.charges.map((charge) => (
                    <Paper key={charge.id} variant="outlined" sx={{ p: 2 }}>
                      <Stack spacing={1}>
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                          <Typography variant="subtitle2">
                            {charge.amount === null
                              ? 'Valor indisponível'
                              : formatCurrency(charge.amount, charge.currency ?? subscription.plan.currency)}
                          </Typography>
                          <Chip size="small" label={translatePaymentStatus(charge.status)} />
                        </Stack>
                        <DetailRow
                          label={charge.paidAt ? 'Data do pagamento' : 'Data do registro'}
                          value={formatBrazilianDate(charge.paidAt ?? charge.createdAt)}
                        />
                        {charge.statusDetail && (
                          <DetailRow
                            label="Detalhe do status"
                            value={translatePaymentStatusDetail(charge.statusDetail) ?? 'Indisponível'}
                          />
                        )}
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Alert severity="info">Ainda não há cobranças registradas para esta assinatura.</Alert>
              )}
              <Alert severity="info">Por segurança, os dados do cartão não são armazenados nem exibidos nesta tela.</Alert>
              {cancelError && <Alert severity="error">{cancelError}</Alert>}
              {canCancel && (
                <Button
                  color="error"
                  variant="outlined"
                  disabled={isCancelPending}
                  onClick={() => onRequestCancellation(subscription.id)}
                >
                  Cancelar assinatura
                </Button>
              )}
            </Stack>
          </DialogContent>
        </Box>
      )}
    </Drawer>
  )
}
