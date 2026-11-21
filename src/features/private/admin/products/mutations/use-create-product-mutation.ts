import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createProductService } from '../services/create-product.service'
import { invalidateProductQueries } from './invalidate-product-queries'

export function useCreateProductMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProductService,
    onSuccess: () => invalidateProductQueries(queryClient),
  })
}
