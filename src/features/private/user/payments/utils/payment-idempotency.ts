import { isAxiosError } from 'axios'
import type { CreatePaymentInput } from '../types/payment.types'

const STORAGE_KEY = 'vitrine-payment-idempotency'

type IdempotencyRecord = {
  fingerprint: string
  key: string
}

function createFingerprint(userId: string, input: CreatePaymentInput) {
  const items = input.items
    .map(({ productId, quantity }) => ({ productId, quantity }))
    .sort((left, right) => left.productId.localeCompare(right.productId))

  return JSON.stringify({
    userId,
    method: input.method,
    items,
    ...(input.method === 'card'
      ? {
          paymentTypeId: input.paymentTypeId,
          paymentMethodId: input.paymentMethodId,
          installments: input.installments,
        }
      : {}),
  })
}

function readRecord(): IdempotencyRecord | null {
  const stored = sessionStorage.getItem(STORAGE_KEY)
  if (!stored) return null

  const parsed: unknown = JSON.parse(stored)
  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !('fingerprint' in parsed) ||
    typeof parsed.fingerprint !== 'string' ||
    !('key' in parsed) ||
    typeof parsed.key !== 'string'
  ) {
    throw new TypeError('Chave de idempotência de pagamento inválida.')
  }
  return { fingerprint: parsed.fingerprint, key: parsed.key }
}

function getOrCreateKey(fingerprint: string) {
  const current = readRecord()
  if (current?.fingerprint === fingerprint) return current.key
  if (current) {
    throw new Error(
      'Há uma tentativa de pagamento anterior aguardando confirmação. Aguarde antes de iniciar outra.',
    )
  }

  const key = crypto.randomUUID()
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ fingerprint, key }))
  return key
}

function clearKey(fingerprint: string, key: string) {
  const current = readRecord()
  if (current?.fingerprint === fingerprint && current.key === key) {
    sessionStorage.removeItem(STORAGE_KEY)
  }
}

export async function submitIdempotentPayment<T>(
  userId: string,
  input: CreatePaymentInput,
  submit: (idempotencyKey: string) => Promise<T>,
): Promise<T> {
  const fingerprint = createFingerprint(userId, input)
  const key = getOrCreateKey(fingerprint)

  try {
    const result = await submit(key)
    clearKey(fingerprint, key)
    return result
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 409) {
      clearKey(fingerprint, key)
    }
    throw error
  }
}
