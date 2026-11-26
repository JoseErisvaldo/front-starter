import type { z } from 'zod'
import type {
  adminProductSchema,
  adminProductsQuerySchema,
  adminProductsResponseSchema,
} from '../schema/admin-products.schema'

export type AdminProduct = z.infer<typeof adminProductSchema>
export type AdminProductsQuery = z.infer<typeof adminProductsQuerySchema>
export type AdminProductsResponse = z.infer<typeof adminProductsResponseSchema>
