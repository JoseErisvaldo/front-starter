import { Box, CircularProgress, Typography } from '@mui/material'

export function AuthRedirectView() {
  return (
    <Box
      component="main"
      role="status"
      aria-live="polite"
      sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', gap: 2 }}
    >
      <Box sx={{ display: 'grid', justifyItems: 'center', gap: 2 }}>
        <CircularProgress size={28} />
        <Typography color="text.secondary">Validando acesso...</Typography>
      </Box>
    </Box>
  )
}
