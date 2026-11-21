import { Box, Card, CardContent, Chip, Container, Stack, Typography } from '@mui/material'
import type { User } from '../../../../public/auth/types/auth.types'
import { SIDEBAR_WIDTH, Sidebar } from '../../../../../shared/layout/sidebar/sidebar'
import { translateUserRole } from '../../../../../shared/i18n/user-role'

type Props = {
  user: User
  onLogout: () => void
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(value))
}

export function AdminAccountView({ user, onLogout }: Props) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f2f6f3' }}>
      <Sidebar onLogout={onLogout} />
      <Box
        component="main"
        sx={{
          ml: { xs: `${SIDEBAR_WIDTH.xs}px`, sm: `${SIDEBAR_WIDTH.sm}px` },
          minHeight: '100vh',
          py: { xs: 3, md: 5 },
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={1} sx={{ mb: 4 }}>
            <Typography variant="overline" sx={{ color: '#26714f', fontWeight: 700, letterSpacing: '.12em' }}>
              ÁREA ADMINISTRATIVA
            </Typography>
            <Typography variant="h4" component="h1" sx={{ color: '#173d30', fontWeight: 700 }}>
              Minha conta
            </Typography>
            <Typography color="text.secondary">
              Gerencie e consulte os dados do seu perfil administrativo.
            </Typography>
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
