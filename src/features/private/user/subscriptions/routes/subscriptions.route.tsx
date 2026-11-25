import { useEffect, useState, type ComponentProps } from 'react'
import { Alert, Box, Button, Card, CardContent, Chip, CircularProgress, DialogContent, DialogTitle, Divider, Drawer, Grid, IconButton, Paper, Stack, SvgIcon, Typography } from '@mui/material'
import { CardPayment, initMercadoPago } from '@mercadopago/sdk-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { useMeQuery } from '../../../../public/auth/queries/use-me-query'
import { useLogout } from '../../../../public/auth/hooks/use-logout'
import { LayoutUser } from '../../../../../shared/layout/layout-user'
import { formatCurrency } from '../../../../../shared/lib/format-currency'
import { formatBrazilianDate } from '../../../../../shared/utils/format-brazilian-date'
import { translatePaymentStatus, translatePaymentStatusDetail } from '../../../../../shared/i18n/payment'
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

const recurrenceNames = { WEEKLY: 'Semanal', MONTHLY: 'Mensal', QUARTERLY: 'Trimestral', YEARLY: 'Anual' } as const
const tierNames = { BASIC: 'Básico', SIMPLE: 'Simples', PRO: 'Pro' } as const
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
const subscriptionStatusColors: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
  authorized: 'success',
  active: 'success',
  pending: 'warning',
  paused: 'warning',
  canceled: 'default',
  cancelled: 'default',
  error: 'error',
}
type CardPaymentSubmit = NonNullable<ComponentProps<typeof CardPayment>['onSubmit']>
type CheckoutState = 'success' | 'error' | 'pending'

function CheckoutFeedback({
  state,
  message,
  onRetry,
  onClose,
}: {
  state: CheckoutState
  message: string
  onRetry?: () => void
  onClose?: () => void
}) {
  const isPending = state === 'pending'
  const isSuccess = state === 'success'

  return (
    <Stack
      role="status"
      aria-live="polite"
      spacing={2.5}
      sx={{ flex: 1, minHeight: 320, p: 3, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
    >
      {isPending ? (
        <CircularProgress size={48} />
      ) : (
        <Box
          sx={{
            width: 112,
            height: 112,
            display: 'grid',
            placeItems: 'center',
            borderRadius: '50%',
            bgcolor: isSuccess ? 'success.main' : 'error.main',
            color: 'common.white',
            boxShadow: (theme) => `0 0 0 10px ${isSuccess ? theme.palette.success.light : theme.palette.error.light}`,
          }}
        >
          <SvgIcon sx={{ fontSize: 72 }} viewBox="0 0 24 24">
            {isSuccess
              ? <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              : <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />}
          </SvgIcon>
        </Box>
      )}
      <Typography variant="h6" component="p" sx={{ fontWeight: 700 }}>
        {message}
      </Typography>
      {onRetry && <Button variant="contained" onClick={onRetry}>Tentar novamente</Button>}
      {onClose && <Button variant={isSuccess ? 'contained' : 'text'} onClick={onClose}>Fechar</Button>}
    </Stack>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'right', overflowWrap: 'anywhere' }}>{value}</Typography>
    </Stack>
  )
}

export function SubscriptionsRoute() {
  const client = useQueryClient()
  const logout = useLogout()
  const userQuery = useMeQuery()
  const [searchParams] = useSearchParams()
  const [detailsSubscriptionId, setDetailsSubscriptionId] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<PublicSubscriptionPlan | null>(null)
  const [checkoutState, setCheckoutState] = useState<CheckoutState | null>(null)
  const [checkoutError, setCheckoutError] = useState('')
  const [checkoutRetry, setCheckoutRetry] = useState(0)
  const [monitorSubscriptionId, setMonitorSubscriptionId] = useState<string | null>(null)
  const [nextPaymentDate, setNextPaymentDate] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState(
    searchParams.get('retorno') === 'mercadopago'
      ? 'Retorno do Mercado Pago recebido. O status da assinatura será atualizado após a confirmação.'
      : '',
  )
  const plans = useQuery({ queryKey: queryKeys.plans, queryFn: getSubscriptionPlansService })
  const subscriptions = useQuery({
    queryKey: queryKeys.mine,
    queryFn: getMySubscriptionsService,
    refetchInterval: checkoutState === 'pending' ? 2500 : false,
  })
  const createSubscription = useMutation({
    mutationFn: createSubscriptionService,
    onSuccess: async (subscription) => {
      await client.invalidateQueries({ queryKey: queryKeys.mine })
      setMonitorSubscriptionId(subscription.id)
      setNextPaymentDate(subscription.nextPaymentDate)
      if (subscription.status.toLowerCase() === 'pending' && subscription.initPoint) {
        window.location.assign(subscription.initPoint)
        return
      }
      if (['authorized', 'active'].includes(subscription.status.toLowerCase())) {
        setCheckoutState('success')
        return
      }
      if (subscription.status.toLowerCase() === 'pending') {
        setCheckoutState('pending')
        return
      }
      setCheckoutError(`O Mercado Pago retornou o status "${subscription.status}".`)
      setCheckoutState('error')
    },
  })
  const cancelSubscription = useMutation({
    mutationFn: cancelSubscriptionService,
    onSuccess: () => void client.invalidateQueries({ queryKey: queryKeys.mine }),
  })

  const monitoredSubscription = subscriptions.data?.find(({ id }) => id === monitorSubscriptionId)
  const detailsSubscription = subscriptions.data?.find(({ id }) => id === detailsSubscriptionId)
  useEffect(() => {
    if (!monitoredSubscription || checkoutState !== 'pending') return
    const status = monitoredSubscription.status.toLowerCase()
    if (['authorized', 'active'].includes(status)) {
      setNextPaymentDate(monitoredSubscription.nextPaymentDate)
      setCheckoutState('success')
    } else if (['error', 'rejected', 'canceled', 'cancelled'].includes(status)) {
      setCheckoutError('O Mercado Pago não autorizou a assinatura.')
      setCheckoutState('error')
    }
  }, [checkoutState, monitoredSubscription])

  const submitCard: CardPaymentSubmit = async (formData) => {
    if (!selectedPlan) throw new Error('Selecione uma opção de plano')
    setCheckoutError('')
    try {
      await createSubscription.mutateAsync({ planId: selectedPlan.id, cardToken: formData.token })
    } catch (error) {
      setCheckoutError(getApiErrorMessage(error))
      setCheckoutState('error')
      throw error
    }
  }

  function closeCheckout() {
    if (createSubscription.isPending) return
    setSelectedPlan(null)
    setCheckoutState(null)
    setCheckoutError('')
    setMonitorSubscriptionId(null)
    setNextPaymentDate(null)
  }

  function retryCheckout() {
    createSubscription.reset()
    setCheckoutState(null)
    setCheckoutError('')
    setMonitorSubscriptionId(null)
    setCheckoutRetry((attempt) => attempt + 1)
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

          <Grid container spacing={2}>
            {plans.data?.map((plan) => (
              <Grid key={plan.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card variant="outlined" sx={{ height: '100%', borderColor: selectedPlan?.id === plan.id ? 'primary.main' : 'divider' }}>
                  <CardContent>
                    <Stack spacing={1.5}>
                      <Chip label={`${plan.name} · ${recurrenceNames[plan.recurrence]}`} sx={{ alignSelf: 'flex-start' }} />
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>{formatCurrency(plan.amount, plan.currency)}</Typography>
                      <Typography color="text.secondary">por cobrança {recurrenceNames[plan.recurrence].toLowerCase()}</Typography>
                      <Button variant={selectedPlan?.id === plan.id ? 'contained' : 'outlined'} disabled={!publicKey} onClick={() => {
                        setSuccessMessage('')
                        setCheckoutState(null)
                        setCheckoutError('')
                        setMonitorSubscriptionId(null)
                        setNextPaymentDate(null)
                        createSubscription.reset()
                        setSelectedPlan(plan)
                      }}>
                        Assinar
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          {plans.data?.length === 0 && !plans.isLoading && <Alert severity="info">Ainda não há planos disponíveis.</Alert>}

          <Drawer
            anchor="right"
            open={Boolean(selectedPlan)}
            onClose={closeCheckout}
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
                    onClick={closeCheckout}
                    disabled={createSubscription.isPending}
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
                    p: createSubscription.isPending || checkoutState ? 0 : { xs: 2, sm: 3 },
                  }}
                >
                  {createSubscription.isPending ? (
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
                      onRetry={checkoutState === 'error' ? retryCheckout : undefined}
                      onClose={closeCheckout}
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
                            Cobrança {recurrenceNames[selectedPlan.recurrence].toLowerCase()}
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
                              onSubmit={submitCard}
                              onError={(error) => {
                                logError('mercadoPagoSubscriptionCardBrick', error)
                                setCheckoutError((current) => current || 'Não foi possível carregar ou processar o cartão. Tente novamente.')
                                setCheckoutState((current) => current === 'error' ? current : 'error')
                              }}
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

          <Stack spacing={2}>
            <Typography variant="h5" component="h2">Minhas assinaturas</Typography>
            {subscriptions.isError && <Alert severity="error">{getApiErrorMessage(subscriptions.error)}</Alert>}
            {subscriptions.data?.map((subscription) => {
              const isCanceled = ['canceled', 'cancelled'].includes(subscription.status.toLowerCase())
              return (
                <Paper key={subscription.id} variant="outlined" sx={{ p: 2.5 }}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}>
                    <Box>
                      <Typography variant="h6">{subscription.plan.name} · {recurrenceNames[subscription.plan.recurrence]}</Typography>
                      <Typography color="text.secondary">
                        {formatCurrency(subscription.plan.amount, subscription.plan.currency)} por cobrança · Status: {subscriptionStatusNames[subscription.status.toLowerCase()] ?? subscription.status}
                      </Typography>
                      {subscription.nextPaymentDate && <Typography variant="body2" color="text.secondary">Próxima cobrança: {formatBrazilianDate(subscription.nextPaymentDate)}</Typography>}
                    </Box>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                      <Button variant="outlined" onClick={() => setDetailsSubscriptionId(subscription.id)}>
                        Ver detalhes
                      </Button>
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
                  </Stack>
                  {subscription.charges.length > 0 && (
                    <Stack spacing={1} sx={{ mt: 2 }}>
                      <Typography variant="subtitle2">Cobranças</Typography>
                      {subscription.charges.map((charge) => (
                        <Typography key={charge.id} variant="body2" color="text.secondary">
                          {charge.paidAt ? formatBrazilianDate(charge.paidAt) : formatBrazilianDate(charge.createdAt)} · {charge.amount === null ? '—' : formatCurrency(charge.amount, charge.currency ?? subscription.plan.currency)} · {translatePaymentStatus(charge.status)}
                        </Typography>
                      ))}
                    </Stack>
                  )}
                </Paper>
              )
            })}
            {subscriptions.data?.length === 0 && !subscriptions.isLoading && <Alert severity="info">Você ainda não possui assinaturas.</Alert>}
          </Stack>

          <Drawer
            anchor="right"
            open={Boolean(detailsSubscription)}
            onClose={() => setDetailsSubscriptionId(null)}
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
            {detailsSubscription && (
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <DialogTitle sx={{ pr: 7, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography component="span" variant="h6">Detalhes da assinatura</Typography>
                  <IconButton
                    aria-label="Fechar detalhes"
                    onClick={() => setDetailsSubscriptionId(null)}
                    sx={{ position: 'absolute', right: 12, top: 12 }}
                  >
                    <span aria-hidden="true">×</span>
                  </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ flex: 1, minHeight: 0, p: { xs: 2, sm: 3 } }}>
                  <Stack spacing={2.5}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                      <Chip
                        label={subscriptionStatusNames[detailsSubscription.status.toLowerCase()] ?? detailsSubscription.status}
                        color={subscriptionStatusColors[detailsSubscription.status.toLowerCase()] ?? 'default'}
                      />
                      <Typography variant="h6">{detailsSubscription.plan.name}</Typography>
                    </Stack>

                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle2">Plano contratado</Typography>
                        <DetailRow label="Nível" value={tierNames[detailsSubscription.plan.tier]} />
                        <DetailRow label="Recorrência" value={recurrenceNames[detailsSubscription.plan.recurrence]} />
                        <DetailRow label="Valor por cobrança" value={formatCurrency(detailsSubscription.plan.amount, detailsSubscription.plan.currency)} />
                      </Stack>
                    </Paper>

                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle2">Datas</Typography>
                        <DetailRow label="Assinatura criada em" value={formatBrazilianDate(detailsSubscription.createdAt)} />
                        <DetailRow label="Última atualização" value={formatBrazilianDate(detailsSubscription.updatedAt)} />
                        <DetailRow
                          label="Próxima cobrança"
                          value={detailsSubscription.nextPaymentDate ? formatBrazilianDate(detailsSubscription.nextPaymentDate) : 'Ainda não agendada'}
                        />
                      </Stack>
                    </Paper>

                    <Divider />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Histórico de cobranças</Typography>
                    {detailsSubscription.charges.length > 0 ? (
                      <Stack spacing={1.5}>
                        {detailsSubscription.charges.map((charge) => (
                          <Paper key={charge.id} variant="outlined" sx={{ p: 2 }}>
                            <Stack spacing={1}>
                              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                <Typography variant="subtitle2">
                                  {charge.amount === null ? 'Valor indisponível' : formatCurrency(charge.amount, charge.currency ?? detailsSubscription.plan.currency)}
                                </Typography>
                                <Chip size="small" label={translatePaymentStatus(charge.status)} />
                              </Stack>
                              <DetailRow
                                label={charge.paidAt ? 'Data do pagamento' : 'Data do registro'}
                                value={formatBrazilianDate(charge.paidAt ?? charge.createdAt)}
                              />
                              {charge.statusDetail && (
                                <DetailRow label="Detalhe do status" value={translatePaymentStatusDetail(charge.statusDetail) ?? 'Indisponível'} />
                              )}
                            </Stack>
                          </Paper>
                        ))}
                      </Stack>
                    ) : (
                      <Alert severity="info">Ainda não há cobranças registradas para esta assinatura.</Alert>
                    )}
                    <Alert severity="info">Por segurança, os dados do cartão não são armazenados nem exibidos nesta tela.</Alert>
                  </Stack>
                </DialogContent>
              </Box>
            )}
          </Drawer>
        </Stack>
      </Box>
    </LayoutUser>
  )
}
