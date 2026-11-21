import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { TOKEN_STORAGE_KEY } from '../../../../shared/services/http-client'

export function useLogout() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    queryClient.clear()
    navigate('/produtos', { replace: true })
  }
}
