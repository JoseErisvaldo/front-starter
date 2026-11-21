import { httpClient } from '../../../../../shared/services/http-client'
import { logError } from '../../../../../shared/lib/log-error'
import {
  adminProductsResponseSchema,
  type AdminProductsQuery,
} from '../schema/admin-products.schema'

export async function getAdminProductsService(query: AdminProductsQuery) {
  try {
    const response = await httpClient.get('/products/manage', { params: query })
    return adminProductsResponseSchema.parse(response.data)
  } catch (error) {
    logError('getAdminProductsService', error)
    throw error
  }
}
