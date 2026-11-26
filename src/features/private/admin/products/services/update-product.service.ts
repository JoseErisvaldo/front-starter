import { z } from 'zod'
import { httpClient } from '../../../../../shared/services/http-client'
import { logError } from '../../../../../shared/lib/log-error'
import { adminProductSchema } from '../schema/admin-products.schema'
import type { AdminProduct } from '../types/admin-products.types'
import type { CreateProductInput } from '../schema/create-product.schema'

const responseSchema = z.object({ product: adminProductSchema })

export async function updateProductService({
  productId,
  ...input
}: CreateProductInput & { productId: string }): Promise<AdminProduct> {
  try {
    const response = await httpClient.patch(`/products/${encodeURIComponent(productId)}`, input)
    return responseSchema.parse(response.data).product
  } catch (error) {
    logError('updateProductService', error)
    throw error
  }
}
