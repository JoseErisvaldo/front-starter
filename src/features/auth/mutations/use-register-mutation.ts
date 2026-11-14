import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authQueryKeys } from '../endpoints-keys/auth.keys'
import { registerService } from '../services/auth.service'
import { TOKEN_STORAGE_KEY } from '../../../shared/services/http-client'

export function useRegisterMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: registerService,
    onSuccess: async ({ token, user }) => {
      localStorage.setItem(TOKEN_STORAGE_KEY, token)
      queryClient.setQueryData(authQueryKeys.me(), user)
      await queryClient.invalidateQueries({ queryKey: authQueryKeys.all })
    },
  })
}
