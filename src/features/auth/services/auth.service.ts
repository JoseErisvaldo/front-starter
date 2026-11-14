import { httpClient } from '../../../shared/services/http-client'
import { logError } from '../../../shared/lib/log-error'
import { authResponseSchema, meResponseSchema } from '../schema/auth.schema'
import type { AuthResponse, LoginInput, RegisterInput, User } from '../types/auth.types'

export async function loginService(input: LoginInput): Promise<AuthResponse> {
  try {
    const response = await httpClient.post('/auth/login', input)
    return authResponseSchema.parse(response.data)
  } catch (error) {
    logError('loginService', error)
    throw error
  }
}

export async function registerService(input: RegisterInput): Promise<AuthResponse> {
  try {
    const response = await httpClient.post('/auth/register', input)
    return authResponseSchema.parse(response.data)
  } catch (error) {
    logError('registerService', error)
    throw error
  }
}

export async function getMeService(): Promise<User> {
  try {
    const response = await httpClient.get('/auth/me')
    return meResponseSchema.parse(response.data).user
  } catch (error) {
    logError('getMeService', error)
    throw error
  }
}
