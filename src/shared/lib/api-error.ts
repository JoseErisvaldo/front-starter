import axios from 'axios'

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? 'Não foi possível conectar à API.'
  }
  if (error instanceof Error && error.message) {
    return error.message
  }
  return 'Ocorreu um erro inesperado.'
}
