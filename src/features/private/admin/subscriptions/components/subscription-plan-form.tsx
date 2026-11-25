import { useState, type FormEvent } from 'react'
import { Alert, Button, Checkbox, FormControlLabel, MenuItem, Stack, TextField } from '@mui/material'
import { CurrencyInput, formatCurrencyInput, parseCurrencyInput } from '../../../../../shared/components/currency-input'
import { getApiErrorMessage } from '../../../../../shared/lib/api-error'
import { saveSubscriptionPlanService } from '../services/subscriptions.service'
import type { PlanInput, SubscriptionPlan } from '../../../../subscriptions/schema/subscriptions.schema'

const tiers = [
  { value: 'BASIC', label: 'Básico' },
  { value: 'SIMPLE', label: 'Simples' },
  { value: 'PRO', label: 'Pro' },
] as const
const recurrences = [
  { value: 'WEEKLY', label: 'Semanal' },
  { value: 'MONTHLY', label: 'Mensal' },
  { value: 'QUARTERLY', label: 'Trimestral' },
  { value: 'YEARLY', label: 'Anual' },
] as const

type Props = {
  plan?: SubscriptionPlan
  onSaved: () => void
}

export function SubscriptionPlanForm({ plan, onSaved }: Props) {
  const [name, setName] = useState(plan?.name ?? '')
  const [tier, setTier] = useState<PlanInput['tier']>(plan?.tier ?? 'BASIC')
  const [recurrence, setRecurrence] = useState<PlanInput['recurrence']>(plan?.recurrence ?? 'MONTHLY')
  const [amount, setAmount] = useState(plan?.amount ? formatCurrencyInput(String(Math.round(plan.amount * 100))) : '')
  const [active, setActive] = useState(plan?.active ?? true)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const parsedAmount = parseCurrencyInput(amount)
    if (parsedAmount === undefined || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError('Informe um valor válido.')
      return
    }
    const trimmedName = name.trim()
    if (!trimmedName) {
      setError('Informe o nome do plano.')
      return
    }
    const payload = { name: trimmedName, tier, recurrence, amount: parsedAmount, active }
    setPending(true)
    try {
      await saveSubscriptionPlanService({ ...(plan ? { id: plan.id } : {}), plan: payload })
      onSaved()
    } catch (submitError) {
      setError(getApiErrorMessage(submitError))
    } finally {
      setPending(false)
    }
  }

  return (
    <Stack component="form" spacing={2.5} onSubmit={(event) => void submit(event)}>
      <TextField
        label="Nome do plano"
        value={name}
        onChange={(event) => setName(event.target.value)}
        slotProps={{ htmlInput: { maxLength: 100 } }}
        required
        fullWidth
      />
      <TextField select label="Plano" value={tier} onChange={(event) => setTier(event.target.value as PlanInput['tier'])} fullWidth>
        {tiers.map((option) => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
      </TextField>
      <TextField select label="Recorrência" value={recurrence} onChange={(event) => setRecurrence(event.target.value as PlanInput['recurrence'])} fullWidth>
        {recurrences.map((option) => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
      </TextField>
      <CurrencyInput
        label="Valor por cobrança"
        value={amount}
        onValueChange={setAmount}
        required
        fullWidth
      />
      <FormControlLabel control={<Checkbox checked={active} onChange={(event) => setActive(event.target.checked)} />} label="Disponível para contratação" />
      {plan?.providerPlanId && (
        <Alert severity="info">
          Alterações de preço ou recorrência criam uma nova configuração no Mercado Pago. Assinaturas existentes mantêm os termos originais.
        </Alert>
      )}
      {error && <Alert severity="error" role="alert">{error}</Alert>}
      <Button type="submit" variant="contained" disabled={pending}>
        {pending ? 'Salvando...' : plan ? 'Salvar alterações' : 'Criar opção de plano'}
      </Button>
    </Stack>
  )
}
