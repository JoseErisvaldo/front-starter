import { Box, Container, Stack, Typography } from '@mui/material'
import type { User } from '../../../../public/auth/types/auth.types'
import { MobileSidebarBar, SIDEBAR_WIDTH, Sidebar } from '../../../../../shared/layout/sidebar/sidebar'
import { AdminAccountProfileCard } from '../components/admin-account-details/admin-account-profile-card'
import { AdminAccountAccessCard } from '../components/admin-account-details/admin-account-access-card'
import { useAdminAccountPage } from '../hooks/use-admin-account-page'

type Props = {
  user: User
  onLogout: () => void
}

export function AdminAccountView({ user, onLogout }: Props) {
  const {
    isMobile,
    sidebarExpanded,
    toggleSidebar,
    mobileSidebarOpen,
    openMobileSidebar,
    closeMobileSidebar,
  } = useAdminAccountPage()
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f2f6f3' }}>
      {isMobile && <MobileSidebarBar onOpen={openMobileSidebar} />}
      <Sidebar
        onLogout={onLogout}
        expanded={sidebarExpanded}
        mobileOpen={mobileSidebarOpen}
        onToggle={toggleSidebar}
        onClose={closeMobileSidebar}
      />
      <Box
        component="main"
        sx={{
          ml: isMobile ? 0 : sidebarExpanded ? `${SIDEBAR_WIDTH.expanded}px` : `${SIDEBAR_WIDTH.collapsed}px`,
          minHeight: '100vh',
          py: { xs: 3, md: 5 },
          pt: { xs: 9, md: 5 },
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={1} sx={{ mb: 4 }}>
            <Stack
              direction={isMobile ? 'column' : 'row'}
              spacing={1}
              sx={{ alignItems: 'flex-start' }}
            >
              <Box>
                <Typography variant="overline" sx={{ color: '#26714f', fontWeight: 700, letterSpacing: '.12em' }}>
                  ÁREA ADMINISTRATIVA
                </Typography>
                <Typography variant="h4" component="h1" sx={{ color: '#173d30', fontWeight: 700 }}>
                  Minha conta
                </Typography>
                <Typography color="text.secondary">
                  Gerencie e consulte os dados do seu perfil administrativo.
                </Typography>
              </Box>
            </Stack>
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.4fr) minmax(260px, .8fr)' },
              gap: 2.5,
              alignItems: 'start',
            }}
          >
            <AdminAccountProfileCard user={user} />
            <AdminAccountAccessCard user={user} />
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
