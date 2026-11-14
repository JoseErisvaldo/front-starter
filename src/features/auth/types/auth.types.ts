import type { z } from 'zod'
import type { authResponseSchema, loginInputSchema, registerInputSchema, userSchema } from '../schema/auth.schema'

export type User = z.infer<typeof userSchema>
export type AuthResponse = z.infer<typeof authResponseSchema>
export type LoginInput = z.infer<typeof loginInputSchema>
export type RegisterInput = z.infer<typeof registerInputSchema>
