import { z } from 'zod'
import { httpClient } from '../../../../../shared/services/http-client'
import { logError } from '../../../../../shared/lib/log-error'
import { adminProductSchema } from '../schema/admin-products.schema'
import type { AdminProduct } from '../types/admin-products.types'

const responseSchema = z.object({ product: adminProductSchema })

export async function setProductActiveService({
  productId,
  active,
}: {
  productId: string
  active: boolean
}): Promise<AdminProduct> {
  try {
    const response = await httpClient.patch(
      `/products/${encodeURIComponent(productId)}/status`,
      { active },
    )
    return responseSchema.parse(response.data).product
  } catch (error) {
    logError('setProductActiveService', error)
    throw error
  }
}
