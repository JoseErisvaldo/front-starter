import { Box, Container, Stack, Typography } from '@mui/material'
import { LayoutUser } from '../../../../../shared/layout/layout-user'
import { AccountDetailsCard } from '../components/account-details/account-details-card'
import { useAccountPage } from '../hooks/use-account-page'

export function AccountView() {
  const { user, logout } = useAccountPage()

  return (
    <LayoutUser onLogout={logout}>
      <Box component="main" sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" component="h1">Minha conta</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Consulte os dados associados à sua conta.
              </Typography>
            </Box>
            <AccountDetailsCard user={user} />
          </Stack>
        </Container>
      </Box>
    </LayoutUser>
  )
}
