import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#6366f1', light: '#a5b4fc' },
    background: { default: '#0b1020', paper: '#111827' },
    divider: '#29334b',
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"DM Sans", sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-.04em' },
    h2: { fontWeight: 700, letterSpacing: '-.04em' },
    h4: { fontWeight: 700, letterSpacing: '-.03em' },
  },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 700 } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
  },
})
