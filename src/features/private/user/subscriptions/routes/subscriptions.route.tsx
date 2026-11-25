import { useState, type ComponentProps } from 'react'
import { Alert, Box, Button, Card, CardContent, Chip, CircularProgress, Grid, Paper, Stack, Typography } from '@mui/material'
import { CardPayment, initMercadoPago } from '@mercadopago/sdk-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { useMeQuery } from '../../../../public/auth/queries/use-me-query'
import { useLogout } from '../../../../public/auth/hooks/use-logout'
import { LayoutUser } from '../../../../../shared/layout/layout-user'
import { formatCurrency } from '../../../../../shared/lib/format-currency'
import { formatBrazilianDate } from '../../../../../shared/utils/format-brazilian-date'
import { getApiErrorMessage } from '../../../../../shared/lib/api-error'
import { logError } from '../../../../../shared/lib/log-error'
import {
  cancelSubscriptionService,
  createSubscriptionService,
  getMySubscriptionsService,
  getSubscriptionPlansService,
} from '../services/subscriptions.service'
import type { PublicSubscriptionPlan } from '../../../../subscriptions/schema/subscriptions.schema'

const publicKey =
  import.meta.env.VITE_MP_SUBSCRIPTIONS_PUBLIC_KEY ?? import.meta.env.VITE_MP_PUBLIC_KEY
if (publicKey) initMercadoPago(publicKey, { locale: 'pt-BR' })

const tierNames = { BASIC: 'Básico', SIMPLE: 'Simples', PRO: 'Pro' } as const
const recurrenceNames = { WEEKLY: 'Semanal', MONTHLY: 'Mensal', QUARTERLY: 'Trimestral', YEARLY: 'Anual' } as const
const subscriptionStatusNames: Record<string, string> = {
  authorized: 'Ativa',
  pending: 'Pendente',
  paused: 'Pausada',
  canceled: 'Cancelada',
  cancelled: 'Cancelada',
  error: 'Erro na criação',
}
const queryKeys = {
  plans: ['subscription-plans'] as const,
  mine: ['my-subscriptions'] as const,
}
type CardPaymentSubmit = NonNullable<ComponentProps<typeof CardPayment>['onSubmit']>

export function SubscriptionsRoute() {
  const client = useQueryClient()
  const logout = useLogout()
  const userQuery = useMeQuery()
  const [searchParams] = useSearchParams()
  const [selectedPlan, setSelectedPlan] = useState<PublicSubscriptionPlan | null>(null)
  const [formError, setFormError] = useState('')
  const [successMessage, setSuccessMessage] = useState(
    searchParams.get('retorno') === 'mercadopago'
      ? 'Retorno do Mercado Pago recebido. O status da assinatura será atualizado após a confirmação.'
      : '',
  )
  const plans = useQuery({ queryKey: queryKeys.plans, queryFn: getSubscriptionPlansService })
  const subscriptions = useQuery({ queryKey: queryKeys.mine, queryFn: getMySubscriptionsService })
  const createSubscription = useMutation({
    mutationFn: createSubscriptionService,
    onSuccess: async (subscription) => {
      await client.invalidateQueries({ queryKey: queryKeys.mine })
      if (subscription.status.toLowerCase() === 'pending' && subscription.initPoint) {
        window.location.assign(subscription.initPoint)
        return
      }
      setSuccessMessage('Solicitação enviada ao Mercado Pago. O status será atualizado assim que recebermos a confirmação.')
      setSelectedPlan(null)
    },
  })
  const cancelSubscription = useMutation({
    mutationFn: cancelSubscriptionService,
    onSuccess: () => void client.invalidateQueries({ queryKey: queryKeys.mine }),
  })

  const submitCard: CardPaymentSubmit = async (formData) => {
    if (!selectedPlan) throw new Error('Selecione uma opção de plano')
    setFormError('')
    try {
      await createSubscription.mutateAsync({ planId: selectedPlan.id, cardToken: formData.token })
    } catch (error) {
      setFormError(getApiErrorMessage(error))
      throw error
    }
  }

  return (
    <LayoutUser onLogout={logout}>
      <Box sx={{ maxWidth: 1180, mx: 'auto', p: { xs: 2, sm: 3, md: 5 } }}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>Planos de assinatura</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Escolha um nível e a frequência de cobrança. A assinatura é gerenciada pelo Mercado Pago.
            </Typography>
          </Box>

          {plans.isError && <Alert severity="error">{getApiErrorMessage(plans.error)}</Alert>}
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
          {cancelSubscription.isError && <Alert severity="error">{getApiErrorMessage(cancelSubscription.error)}</Alert>}
          {!publicKey && <Alert severity="error">Configure VITE_MP_PUBLIC_KEY no frontend para habilitar a tokenização segura do cartão.</Alert>}
          {formError && <Alert severity="error">{formError}</Alert>}

          <Grid container spacing={2}>
            {plans.data?.map((plan) => (
              <Grid key={plan.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card variant="outlined" sx={{ height: '100%', borderColor: selectedPlan?.id === plan.id ? 'primary.main' : 'divider' }}>
                  <CardContent>
                    <Stack spacing={1.5}>
                      <Chip label={`${tierNames[plan.tier]} · ${recurrenceNames[plan.recurrence]}`} sx={{ alignSelf: 'flex-start' }} />
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>{formatCurrency(plan.amount, plan.currency)}</Typography>
                      <Typography color="text.secondary">por cobrança {recurrenceNames[plan.recurrence].toLowerCase()}</Typography>
                      <Button variant={selectedPlan?.id === plan.id ? 'contained' : 'outlined'} disabled={!publicKey} onClick={() => {
                        setFormError('')
                        setSuccessMessage('')
                        setSelectedPlan(plan)
                      }}>
                        {selectedPlan?.id === plan.id ? 'Opção selecionada' : 'Assinar'}
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          {plans.data?.length === 0 && !plans.isLoading && <Alert severity="info">Ainda não há planos disponíveis.</Alert>}

          {selectedPlan && userQuery.data && publicKey && (
            <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
              <Stack spacing={2}>
                <Typography variant="h6">Autorizar cobrança recorrente</Typography>
                <Typography color="text.secondary">
                  {tierNames[selectedPlan.tier]} · {recurrenceNames[selectedPlan.recurrence]} · {formatCurrency(selectedPlan.amount, selectedPlan.currency)} por cobrança
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  O Mercado Pago validará o cartão. Não armazenamos os dados do cartão.
                </Typography>
                <Box sx={{ position: 'relative', pointerEvents: createSubscription.isPending ? 'none' : 'auto', opacity: createSubscription.isPending ? 0.6 : 1 }}>
                  <CardPayment
                    initialization={{ amount: selectedPlan.amount, payer: { email: userQuery.data.email } }}
                    onSubmit={submitCard}
                    onError={(error) => {
                      logError('mercadoPagoSubscriptionCardBrick', error)
                      setFormError('Não foi possível carregar o formulário do Mercado Pago. Tente novamente.')
                    }}
                    locale="pt-BR"
                  />
                </Box>
                {createSubscription.isPending && <CircularProgress size={24} aria-label="Criando assinatura" />}
              </Stack>
            </Paper>
          )}

          <Stack spacing={2}>
            <Typography variant="h5" component="h2">Minhas assinaturas</Typography>
            {subscriptions.isError && <Alert severity="error">{getApiErrorMessage(subscriptions.error)}</Alert>}
            {subscriptions.data?.map((subscription) => {
              const isCanceled = ['canceled', 'cancelled'].includes(subscription.status.toLowerCase())
              return (
                <Paper key={subscription.id} variant="outlined" sx={{ p: 2.5 }}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}>
                    <Box>
                      <Typography variant="h6">{tierNames[subscription.plan.tier]} · {recurrenceNames[subscription.plan.recurrence]}</Typography>
                      <Typography color="text.secondary">
                        {formatCurrency(subscription.plan.amount, subscription.plan.currency)} por cobrança · Status: {subscriptionStatusNames[subscription.status.toLowerCase()] ?? subscription.status}
                      </Typography>
                      {subscription.nextPaymentDate && <Typography variant="body2" color="text.secondary">Próxima cobrança: {formatBrazilianDate(subscription.nextPaymentDate)}</Typography>}
                    </Box>
                    {!isCanceled && subscription.status !== 'error' && (
                      <Button
                        color="error"
                        variant="outlined"
                        disabled={cancelSubscription.isPending}
                        onClick={() => cancelSubscription.mutate(subscription.id)}
                      >
                        Cancelar assinatura
                      </Button>
                    )}
                  </Stack>
                  {subscription.charges.length > 0 && (
                    <Stack spacing={1} sx={{ mt: 2 }}>
                      <Typography variant="subtitle2">Cobranças</Typography>
                      {subscription.charges.map((charge) => (
                        <Typography key={charge.id} variant="body2" color="text.secondary">
                          {charge.paidAt ? formatBrazilianDate(charge.paidAt) : formatBrazilianDate(charge.createdAt)} · {charge.amount === null ? '—' : formatCurrency(charge.amount, charge.currency ?? subscription.plan.currency)} · {charge.status}
                        </Typography>
                      ))}
                    </Stack>
                  )}
                </Paper>
              )
            })}
            {subscriptions.data?.length === 0 && !subscriptions.isLoading && <Alert severity="info">Você ainda não possui assinaturas.</Alert>}
          </Stack>
        </Stack>
      </Box>
    </LayoutUser>
  )
}
