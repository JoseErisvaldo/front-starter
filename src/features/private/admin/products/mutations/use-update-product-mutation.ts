import { useMutation, useQueryClient } from '@tanstack/react-query'
import { invalidateProductQueries } from './invalidate-product-queries'
import { updateProductService } from '../services/update-product.service'

export function useUpdateProductMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateProductService,
    onSuccess: () => invalidateProductQueries(queryClient),
  })
}
