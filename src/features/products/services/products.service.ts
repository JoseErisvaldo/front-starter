import { httpClient } from '../../../shared/services/http-client'
import { logError } from '../../../shared/lib/log-error'
import { productsResponseSchema } from '../schema/product.schema'

export async function getProductsService() {
  try {
    const response = await httpClient.get('/products')
    return productsResponseSchema.parse(response.data).products
  } catch (error) {
    logError('getProductsService', error)
    throw error
  }
}
