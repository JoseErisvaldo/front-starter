import { httpClient } from '../../../../../shared/services/http-client'
import { logError } from '../../../../../shared/lib/log-error'
import {
  createProductResponseSchema,
  type CreateProductInput,
} from '../schema/create-product.schema'

export async function createProductService(input: CreateProductInput) {
  try {
    const response = await httpClient.post('/products', input)
    return createProductResponseSchema.parse(response.data).product
  } catch (error) {
    logError('createProductService', error)
    throw error
  }
}
