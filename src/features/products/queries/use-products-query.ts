import { useQuery } from '@tanstack/react-query'
import { getProductsService } from '../services/products.service'
import { productsQueryKeys } from '../endpoints-keys/products.keys'

export function useProductsQuery() {
  return useQuery({
    queryKey: productsQueryKeys.lists(),
    queryFn: getProductsService,
    staleTime: 5 * 60_000,
  })
}
