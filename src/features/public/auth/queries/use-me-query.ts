import { useQuery } from '@tanstack/react-query'
import { getMeService } from '../services/auth.service'
import { authQueryKeys } from '../endpoints-keys/auth.keys'
import { TOKEN_STORAGE_KEY } from '../../../../shared/services/http-client'

export function useMeQuery() {
  return useQuery({
    queryKey: authQueryKeys.me(),
    queryFn: getMeService,
    enabled: Boolean(localStorage.getItem(TOKEN_STORAGE_KEY)),
    retry: false,
  })
}
