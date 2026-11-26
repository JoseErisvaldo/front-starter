import { httpClient } from '../../../../../shared/services/http-client'
import { logError } from '../../../../../shared/lib/log-error'
import {
  adminProductsResponseSchema,
} from '../schema/admin-products.schema'
import type { AdminProductsQuery } from '../types/admin-products.types'

export async function getAdminProductsService(query: AdminProductsQuery) {
  try {
    const response = await httpClient.get('/products/manage', { params: query })
    return adminProductsResponseSchema.parse(response.data)
  } catch (error) {
    logError('getAdminProductsService', error)
    throw error
  }
}
