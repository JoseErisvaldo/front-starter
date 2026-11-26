import type { ComponentProps } from 'react'
import { Alert, Box, CircularProgress, DialogContent, DialogTitle, Drawer, IconButton, Paper, Stack, Typography } from '@mui/material'
import { CardPayment } from '@mercadopago/sdk-react'
import { formatCurrency } from '../../../../../../shared/lib/format-currency'
import { formatBrazilianDate } from '../../../../../../shared/utils/format-brazilian-date'
import { getApiErrorMessage } from '../../../../../../shared/lib/api-error'
import { subscriptionRecurrenceLabels } from '../../../../../subscriptions/constants/subscription-options'
import type { PublicSubscriptionPlan } from '../../../../../subscriptions/schema/subscriptions.schema'
import type { CheckoutState } from '../../types/subscription-plans.types'
import { CheckoutFeedback } from './checkout-feedback'

type CardPaymentSubmit = NonNullable<ComponentProps<typeof CardPayment>['onSubmit']>

export function SubscriptionCheckoutDrawer({
  selectedPlan,
  publicKey,
  isCreating,
  checkoutState,
  checkoutError,
  checkoutRetry,
  nextPaymentDate,
  userQuery,
  onSubmit,
  onError,
  onRetry,
  onClose,
}: {
  selectedPlan: PublicSubscriptionPlan | null
  publicKey: string | undefined
  isCreating: boolean
  checkoutState: CheckoutState | null
  checkoutError: string
  checkoutRetry: number
  nextPaymentDate: string | null
  userQuery: {
    data?: { email: string }
    isLoading: boolean
    isError: boolean
    error: Error | null
  }
  onSubmit: CardPaymentSubmit
  onError: (error: unknown) => void
  onRetry: () => void
  onClose: () => void
}) {
  return (
    <Drawer
      anchor="right"
      open={Boolean(selectedPlan)}
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
      {selectedPlan && (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <DialogTitle sx={{ pr: 7, borderBottom: 1, borderColor: 'divider' }}>
            <Typography component="span" variant="h6">Assinar plano</Typography>
            <IconButton
              aria-label="Fechar checkout"
              onClick={onClose}
              disabled={isCreating}
              sx={{ position: 'absolute', right: 12, top: 12 }}
            >
              <span aria-hidden="true">×</span>
            </IconButton>
          </DialogTitle>
          <DialogContent
            dividers
            sx={{
              flex: 1,
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
              p: isCreating || checkoutState ? 0 : { xs: 2, sm: 3 },
            }}
          >
            {isCreating ? (
              <CheckoutFeedback state="pending" message="Processando sua assinatura…" />
            ) : checkoutState ? (
              <CheckoutFeedback
                state={checkoutState}
                message={
                  checkoutState === 'success'
                    ? `Assinatura autorizada com sucesso.${nextPaymentDate ? ` Próxima cobrança: ${formatBrazilianDate(nextPaymentDate)}.` : ''}`
                    : checkoutState === 'error'
                      ? checkoutError || 'Não foi possível concluir a assinatura.'
                      : 'Aguardando confirmação do Mercado Pago…'
                }
                onRetry={checkoutState === 'error' ? onRetry : undefined}
                onClose={onClose}
              />
            ) : (
              <Stack spacing={3}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Stack spacing={1}>
                    <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
                      Resumo da assinatura
                    </Typography>
                    <Typography variant="h6">{selectedPlan.name}</Typography>
                    <Typography color="text.secondary">
                      Cobrança {subscriptionRecurrenceLabels[selectedPlan.recurrence].toLowerCase()}
                    </Typography>
                    <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 700 }}>
                      {formatCurrency(selectedPlan.amount, selectedPlan.currency)}
                    </Typography>
                  </Stack>
                </Paper>
                {!publicKey && <Alert severity="error">Configure a Public Key do Mercado Pago para habilitar o pagamento.</Alert>}
                {!userQuery.data && userQuery.isLoading && <CircularProgress size={24} aria-label="Carregando dados da conta" />}
                {userQuery.isError && <Alert severity="error">{getApiErrorMessage(userQuery.error)}</Alert>}
                {userQuery.data && publicKey && (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      O cartão é tokenizado pelo Mercado Pago. Os dados do cartão não são armazenados pela aplicação.
                    </Typography>
                    <Paper variant="outlined" sx={{ p: { xs: 1.5, sm: 2 }, borderColor: 'divider' }}>
                      <CardPayment
                        key={checkoutRetry}
                        initialization={{ amount: selectedPlan.amount, payer: { email: userQuery.data.email } }}
                        onSubmit={onSubmit}
                        onError={onError}
                        locale="pt-BR"
                      />
                    </Paper>
                  </>
                )}
              </Stack>
            )}
          </DialogContent>
        </Box>
      )}
    </Drawer>
  )
}
