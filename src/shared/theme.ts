import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#28624d',
      light: '#4e806d',
      dark: '#1d4b3b',
      contrastText: '#ffffff',
    },
    background: { default: '#f6f5f1', paper: '#ffffff' },
    text: { primary: '#252821', secondary: '#686c65' },
    divider: '#e3e2dc',
    success: { main: '#347452' },
    warning: { main: '#9a681f' },
    error: { main: '#b34235' },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: { fontWeight: 650, letterSpacing: '-.02em' },
    h2: { fontWeight: 650, letterSpacing: '-.02em' },
    h4: { fontWeight: 650, letterSpacing: '-.02em' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600 },
        contained: { boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
      },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
  },
})
