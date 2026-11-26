import { Box, Button, CircularProgress, Stack, SvgIcon, Typography } from '@mui/material'
import type { CheckoutState } from '../../types/subscription-plans.types'

export function CheckoutFeedback({
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
      <Typography variant="h6" component="p" sx={{ fontWeight: 700 }}>{message}</Typography>
      {onRetry && <Button variant="contained" onClick={onRetry}>Tentar novamente</Button>}
      {onClose && <Button variant={isSuccess ? 'contained' : 'text'} onClick={onClose}>Fechar</Button>}
    </Stack>
  )
}
