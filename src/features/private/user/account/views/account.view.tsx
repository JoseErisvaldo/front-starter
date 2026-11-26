import { Box } from '@mui/material'
import { LayoutUser } from '../../../../../shared/layout/layout-user'
import { UserProfileCard } from '../../../../../shared/components/user-profile-card'
import { useAccountPage } from '../hooks/use-account-page'

export function AccountView() {
  const { user, logout } = useAccountPage()

  return (
    <LayoutUser onLogout={logout}>
      <Box component="main" sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Box sx={{ maxWidth: 1180, mx: 'auto', p: { xs: 2, sm: 3, md: 5 } }}>
          <UserProfileCard user={user} eyebrow="Meu perfil" />
        </Box>
      </Box>
    </LayoutUser>
  )
}
