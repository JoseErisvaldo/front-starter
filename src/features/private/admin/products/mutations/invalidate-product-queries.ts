import type { QueryClient } from '@tanstack/react-query'
import { productsQueryKeys } from '../../../../public/products/endpoints-keys/products.keys'
import { adminProductsQueryKeys } from '../endpoints-keys/admin-products.keys'

export async function invalidateProductQueries(queryClient: QueryClient) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: productsQueryKeys.all }),
    queryClient.invalidateQueries({ queryKey: adminProductsQueryKeys.all }),
  ])
}
