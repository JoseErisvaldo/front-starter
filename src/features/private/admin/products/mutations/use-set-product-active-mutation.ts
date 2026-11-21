import { useMutation, useQueryClient } from '@tanstack/react-query'
import { invalidateProductQueries } from './invalidate-product-queries'
import { setProductActiveService } from '../services/set-product-active.service'

export function useSetProductActiveMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: setProductActiveService,
    onSuccess: () => invalidateProductQueries(queryClient),
  })
}
