import { Box, Container } from '@mui/material'
import type { User } from '../../../../public/auth/types/auth.types'
import { MobileSidebarBar, SIDEBAR_WIDTH, Sidebar } from '../../../../../shared/layout/sidebar/sidebar'
import { UserProfileCard } from '../../../../../shared/components/user-profile-card'
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
          <Box sx={{ maxWidth: 1180, mx: 'auto' }}>
            <UserProfileCard user={user} eyebrow="Perfil administrativo" />
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
