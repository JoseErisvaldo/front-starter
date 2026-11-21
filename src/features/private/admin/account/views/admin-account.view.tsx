import { Box, Card, CardContent, Chip, Container, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useState } from 'react'
import type { User } from '../../../../public/auth/types/auth.types'
import { MobileSidebarBar, SIDEBAR_WIDTH, Sidebar } from '../../../../../shared/layout/sidebar/sidebar'
import { useSidebarStore } from '../../../../../shared/layout/sidebar/sidebar.store'
import { translateUserRole } from '../../../../../shared/i18n/user-role'

type Props = {
  user: User
  onLogout: () => void
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(value))
}

export function AdminAccountView({ user, onLogout }: Props) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const sidebarExpanded = useSidebarStore((state) => state.expanded)
  const toggleSidebar = useSidebarStore((state) => state.toggle)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f2f6f3' }}>
      {isMobile && <MobileSidebarBar onOpen={() => setMobileSidebarOpen(true)} />}
      <Sidebar
        onLogout={onLogout}
        expanded={sidebarExpanded}
        mobileOpen={mobileSidebarOpen}
        onToggle={toggleSidebar}
        onClose={() => setMobileSidebarOpen(false)}
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
            <Card variant="outlined">
              <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                <Stack spacing={3}>
                  <Typography variant="h6" component="h2" sx={{ color: '#173d30' }}>
                    Dados do perfil
                  </Typography>
                  <Box>
                    <Typography variant="overline" color="text.secondary">Nome</Typography>
                    <Typography variant="body1">{user.name}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="overline" color="text.secondary">E-mail</Typography>
                    <Typography variant="body1">{user.email}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="overline" color="text.secondary">Conta criada em</Typography>
                    <Typography variant="body1">{formatDate(user.createdAt)}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                <Stack spacing={2}>
                  <Typography variant="h6" component="h2" sx={{ color: '#173d30' }}>
                    Acesso administrativo
                  </Typography>
                  <Chip
                    label={translateUserRole(user.role)}
                    sx={{
                      alignSelf: 'flex-start',
                      bgcolor: '#e1f0e5',
                      color: '#1d6848',
                      fontWeight: 700,
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Este perfil tem acesso à área administrativa conforme sua função.
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
