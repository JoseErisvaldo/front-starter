import { AppBar, Button, Container, Toolbar, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

type Props = {
  title: string
  links: { label: string; to: string }[]
  redirectTo: string
}

export function PublicHeader({ title, links, redirectTo }: Props) {
  return (
    <AppBar position="sticky" color="inherit" elevation={0}>
      <Toolbar component={Container} maxWidth="lg" sx={{ gap: { xs: 0.5, sm: 2 } }}>
        <Typography
          component={RouterLink}
          to="/produtos"
          variant="h6"
          sx={{
            flexGrow: 1,
            minWidth: 0,
            color: 'text.primary',
            textDecoration: 'none',
            fontWeight: 700,
          }}
        >
          {title}
        </Typography>
        {links.map(({ label, to }) => (
          <Button
            key={to}
            component={RouterLink}
            to={to}
            sx={{
              color: '#26714f',
              bgcolor: '#eaf3ed',
              fontWeight: 700,
              '&:hover': { bgcolor: '#dcebe1' },
            }}
          >
            {label}
          </Button>
        ))}
        <Button
          component={RouterLink}
          to="/register"
          state={{ from: redirectTo }}
          color="inherit"
        >
          Criar conta
        </Button>
        <Button
          component={RouterLink}
          to="/login"
          state={{ from: redirectTo }}
          variant="contained"
        >
          Entrar
        </Button>
      </Toolbar>
    </AppBar>
  )
}
