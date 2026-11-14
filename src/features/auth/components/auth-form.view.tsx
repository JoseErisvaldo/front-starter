import { useState, type FormEvent } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Alert, Box, Button, Link, Paper, Stack, TextField, Typography } from '@mui/material'
import { loginInputSchema, registerInputSchema } from '../schema/auth.schema'
import { useAuthForm } from '../hooks/use-auth-form'

type Props = { mode: 'login' | 'register' }

export function AuthFormView({ mode }: Props) {
  const isRegister = mode === 'register'
  const { onSubmit, isPending, errorMessage } = useAuthForm(mode)
  const [formError, setFormError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')
    const formData = new FormData(event.currentTarget)
    const input = isRegister
      ? registerInputSchema.safeParse({
          name: formData.get('name'),
          email: formData.get('email'),
          password: formData.get('password'),
        })
      : loginInputSchema.safeParse({
          email: formData.get('email'),
          password: formData.get('password'),
        })

    if (!input.success) {
      setFormError(input.error.issues[0]?.message ?? 'Confira os dados informados.')
      return
    }
    onSubmit(input.data)
  }

  return (
    <Box component="main" sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 2 }}>
      <Paper
        component="section"
        elevation={0}
        sx={{ width: '100%', maxWidth: 440, p: { xs: 3, sm: 5 }, border: 1, borderColor: 'divider' }}
      >
        <Stack spacing={2.5}>
          <Box
            aria-hidden="true"
            sx={{ display: 'grid', placeItems: 'center', width: 44, height: 44, borderRadius: 2, bgcolor: 'primary.main', fontWeight: 800 }}
          >
            A
          </Box>
          <Box>
            <Typography variant="overline" color="primary.light" sx={{ letterSpacing: '.16em' }}>AUTH STARTER</Typography>
            <Typography variant="h4" component="h1" sx={{ mt: 0.5 }}>
              {isRegister ? 'Crie sua conta' : 'Bem-vindo de volta'}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {isRegister ? 'Comece criando seu acesso.' : 'Entre para continuar.'}
            </Typography>
          </Box>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
          {isRegister && (
                <TextField name="name" label="Nome" autoComplete="name" placeholder="Seu nome" required fullWidth />
          )}
              <TextField name="email" label="E-mail" type="email" autoComplete="email" placeholder="voce@exemplo.com" required fullWidth />
              <TextField
                name="password"
                label="Senha"
                type="password"
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                placeholder={isRegister ? 'Mínimo de 8 caracteres' : 'Sua senha'}
                required
                fullWidth
              />
              {(formError || errorMessage) && <Alert severity="error" role="alert">{formError || errorMessage}</Alert>}
              <Button type="submit" variant="contained" size="large" disabled={isPending} fullWidth>
                {isPending ? 'Aguarde...' : isRegister ? 'Criar conta' : 'Entrar'}
              </Button>
            </Stack>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            {isRegister ? 'Já tem uma conta?' : 'Ainda não tem conta?'}{' '}
            <Link component={RouterLink} to={isRegister ? '/login' : '/register'} underline="hover">
              {isRegister ? 'Entrar' : 'Criar conta'}
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  )
}
