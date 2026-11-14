import type { User } from '../../auth/types/auth.types'
import { AppBar, Avatar, Box, Button, Chip, Container, Paper, Stack, Toolbar, Typography } from '@mui/material'

type Props = { user: User; onLogout: () => void }

export function HomeView({ user, onLogout }: Props) {
  return (
    <Box component="main" sx={{ minHeight: '100vh' }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, letterSpacing: '.1em' }}>AUTH STARTER</Typography>
          <Button variant="outlined" color="inherit" onClick={onLogout}>Sair</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ py: { xs: 8, md: 14 } }}>
        <Paper
          component="section"
          elevation={0}
          sx={{ p: { xs: 3, sm: 6 }, border: 1, borderColor: 'divider', background: 'linear-gradient(145deg, #161f34, #111827)' }}
        >
          <Stack spacing={2}>
            <Typography variant="overline" color="primary.light" sx={{ letterSpacing: '.16em' }}>
              ÁREA AUTENTICADA
            </Typography>
            <Typography variant="h2" component="h1" sx={{ fontSize: { xs: '2.5rem', sm: '3.5rem' } }}>
              Olá, {user.name}.
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 520 }}>
              Sua conta está ativa. Este é o ponto de partida da sua aplicação.
            </Typography>
            <Box>
              <Chip
                avatar={<Avatar>{user.name.slice(0, 1).toUpperCase()}</Avatar>}
                label={user.email}
                variant="outlined"
                sx={{ mt: 2, py: 2.5 }}
              />
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}
