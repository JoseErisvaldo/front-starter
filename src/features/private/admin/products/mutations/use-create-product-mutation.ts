import { useMutation, useQueryClient } from '@tanstack/react-query'
import { productsQueryKeys } from '../../../../public/products/endpoints-keys/products.keys'
import { adminProductsQueryKeys } from '../endpoints-keys/admin-products.keys'
import { createProductService } from '../services/create-product.service'

export function useCreateProductMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProductService,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: productsQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: adminProductsQueryKeys.all }),
      ])
    },
  })
}
