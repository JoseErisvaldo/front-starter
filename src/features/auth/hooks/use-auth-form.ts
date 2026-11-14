import { useState } from 'react'
import { useLoginMutation } from '../mutations/use-login-mutation'
import { useRegisterMutation } from '../mutations/use-register-mutation'
import type { LoginInput, RegisterInput } from '../types/auth.types'
import { getApiErrorMessage } from '../../../shared/lib/api-error'

export function useAuthForm(mode: 'login' | 'register') {
  const login = useLoginMutation()
  const register = useRegisterMutation()
  const [errorMessage, setErrorMessage] = useState('')

  function submit(input: LoginInput | RegisterInput) {
    setErrorMessage('')
    const options = { onError: (error: Error) => setErrorMessage(getApiErrorMessage(error)) }
    if (mode === 'login') login.mutate(input as LoginInput, options)
    else register.mutate(input as RegisterInput, options)
  }

  return {
    onSubmit: submit,
    isPending: login.isPending || register.isPending,
    errorMessage,
  }
}
