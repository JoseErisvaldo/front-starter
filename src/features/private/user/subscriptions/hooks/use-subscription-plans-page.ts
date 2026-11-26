import { useEffect, useState, type ComponentProps } from 'react'
import { CardPayment } from '@mercadopago/sdk-react'
import { useSearchParams } from 'react-router-dom'
import { useMeQuery } from '../../../../public/auth/queries/use-me-query'
import { useLogout } from '../../../../public/auth/hooks/use-logout'
import { getApiErrorMessage } from '../../../../../shared/lib/api-error'
import { logError } from '../../../../../shared/lib/log-error'
import type { PublicSubscriptionPlan } from '../../../../subscriptions/schema/subscriptions.schema'
import type { CheckoutState } from '../types/subscription-plans.types'
import { useSubscriptionPlansQuery } from '../queries/use-subscription-plans-query'
import { useMySubscriptionsQuery } from '../../my-subscriptions/queries/use-my-subscriptions-query'
import { useCreateSubscriptionMutation } from '../mutations/use-create-subscription-mutation'
import { mercadoPagoPublicKey } from '../constants/mercado-pago'

type CardPaymentSubmit = NonNullable<ComponentProps<typeof CardPayment>['onSubmit']>

const mercadoPagoReturnMessage =
  'Retorno do Mercado Pago recebido. O status da assinatura será atualizado após a confirmação.'

export function useSubscriptionPlansPage() {
  const logout = useLogout()
  const userQuery = useMeQuery()
  const [searchParams] = useSearchParams()
  const [selectedPlan, setSelectedPlan] = useState<PublicSubscriptionPlan | null>(null)
  const [selectedRecurrence, setSelectedRecurrence] =
    useState<PublicSubscriptionPlan['recurrence']>('MONTHLY')
  const [checkoutState, setCheckoutState] = useState<CheckoutState | null>(null)
  const [checkoutError, setCheckoutError] = useState('')
  const [checkoutRetry, setCheckoutRetry] = useState(0)
  const [monitorSubscriptionId, setMonitorSubscriptionId] = useState<string | null>(null)
  const [nextPaymentDate, setNextPaymentDate] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState(
    searchParams.get('retorno') === 'mercadopago' ? mercadoPagoReturnMessage : '',
  )

  const plans = useSubscriptionPlansQuery(true)
  const subscriptions = useMySubscriptionsQuery(
    checkoutState === 'pending',
    checkoutState === 'pending',
  )
  const createSubscription = useCreateSubscriptionMutation((subscription) => {
    setMonitorSubscriptionId(subscription.id)
    setNextPaymentDate(subscription.nextPaymentDate)
    const status = subscription.status.toLowerCase()
    if (status === 'pending' && subscription.initPoint) {
      window.location.assign(subscription.initPoint)
    } else if (['authorized', 'active'].includes(status)) {
      setCheckoutState('success')
    } else if (status === 'pending') {
      setCheckoutState('pending')
    } else {
      setCheckoutError(`O Mercado Pago retornou o status "${subscription.status}".`)
      setCheckoutState('error')
    }
  })

  const monitoredSubscription = subscriptions.data?.find(({ id }) => id === monitorSubscriptionId)
  const availableRecurrences = [...new Set(plans.data?.map((plan) => plan.recurrence) ?? [])]
  const activeRecurrence = availableRecurrences.includes(selectedRecurrence)
    ? selectedRecurrence
    : availableRecurrences[0] ?? selectedRecurrence
  const visiblePlans = plans.data?.filter((plan) => plan.recurrence === activeRecurrence) ?? []

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

  function startCheckout(plan: PublicSubscriptionPlan) {
    setSuccessMessage('')
    setCheckoutState(null)
    setCheckoutError('')
    setMonitorSubscriptionId(null)
    setNextPaymentDate(null)
    createSubscription.reset()
    setSelectedPlan(plan)
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

  function handleCardPaymentError(error: unknown) {
    logError('mercadoPagoSubscriptionCardBrick', error)
    setCheckoutError((current) => current || 'Não foi possível carregar ou processar o cartão. Tente novamente.')
    setCheckoutState((current) => current === 'error' ? current : 'error')
  }

  return {
    logout,
    userQuery,
    plans,
    availableRecurrences,
    activeRecurrence,
    visiblePlans,
    selectedRecurrence,
    setSelectedRecurrence,
    selectedPlan,
    startCheckout,
    successMessage,
    publicKey: mercadoPagoPublicKey,
    createSubscription,
    checkoutState,
    checkoutError,
    checkoutRetry,
    nextPaymentDate,
    submitCard,
    closeCheckout,
    retryCheckout,
    handleCardPaymentError,
  }
}
