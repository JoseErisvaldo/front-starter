import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import type { MySubscription } from '../types/my-subscriptions.types'

export function CancelSubscriptionDialog({
  subscription,
  isPending,
  error,
  onClose,
  onConfirm,
}: {
  subscription?: MySubscription
  isPending: boolean
  error?: string
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <Dialog
      open={Boolean(subscription)}
      onClose={onClose}
      aria-labelledby="cancel-subscription-title"
      aria-describedby="cancel-subscription-description"
    >
      <DialogTitle id="cancel-subscription-title">Confirmar cancelamento</DialogTitle>
      <DialogContent>
        <Typography id="cancel-subscription-description">
          {subscription
            ? `Deseja realmente cancelar a assinatura do plano "${subscription.plan.name}"?`
            : 'Deseja realmente cancelar esta assinatura?'}
        </Typography>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isPending}>Não, manter assinatura</Button>
        <Button color="error" variant="contained" disabled={isPending || !subscription} onClick={onConfirm}>
          {isPending ? 'Cancelando…' : 'Sim, cancelar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
