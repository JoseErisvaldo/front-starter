import { Box, Button, Card, CardContent, Container, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import type { User } from '../../../../public/auth/types/auth.types'
import { StoreHeader } from '../../../../../shared/components/store-header'
import { translateUserRole } from '../../../../../shared/i18n/user-role'

type Props = {
  user: User
  onLogout: () => void
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(value))
}

export function AccountView({ user, onLogout }: Props) {
  return (
    <Box component="main" sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <StoreHeader user={user} activePage="account" onLogout={onLogout} />
      <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" component="h1">
              Minha conta
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Consulte os dados associados à sua conta.
            </Typography>
          </Box>
          <Card variant="outlined">
            <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="overline" color="text.secondary">
                    Nome
                  </Typography>
                  <Typography variant="h6">{user.name}</Typography>
                </Box>
                <Box>
                  <Typography variant="overline" color="text.secondary">
                    E-mail
                  </Typography>
                  <Typography variant="body1">{user.email}</Typography>
                </Box>
                <Box>
                  <Typography variant="overline" color="text.secondary">
                    Tipo de conta
                  </Typography>
                  <Typography variant="body1">{translateUserRole(user.role)}</Typography>
                </Box>
                <Box>
                  <Typography variant="overline" color="text.secondary">
                    Conta criada em
                  </Typography>
                  <Typography variant="body1">{formatDate(user.createdAt)}</Typography>
                </Box>
                <Button component={RouterLink} to="/produtos" variant="outlined" sx={{ alignSelf: 'flex-start' }}>
                  Voltar para produtos
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  )
}
