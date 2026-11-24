import { isAxiosError } from 'axios'
import type { CreatePaymentInput } from '../types/payment.types'

const STORAGE_KEY = 'vitrine-payment-idempotency'

type IdempotencyRecord = {
  fingerprint: string
  key: string
}

function isIdempotencyRecord(value: unknown): value is IdempotencyRecord {
  return (
    typeof value === 'object' &&
    value !== null &&
    'fingerprint' in value &&
    typeof value.fingerprint === 'string' &&
    'key' in value &&
    typeof value.key === 'string'
  )
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

function readRecords(): IdempotencyRecord[] {
  const stored = sessionStorage.getItem(STORAGE_KEY)
  if (!stored) return []

  const parsed: unknown = JSON.parse(stored)
  if (isIdempotencyRecord(parsed)) {
    return [parsed]
  }
  if (Array.isArray(parsed) && parsed.every(isIdempotencyRecord)) {
    return parsed
  }
  throw new TypeError('Chave de idempotência de pagamento inválida.')
}

function getOrCreateKey(fingerprint: string) {
  const records = readRecords()
  const current = records.find((record) => record.fingerprint === fingerprint)
  if (current) return current.key

  const key = crypto.randomUUID()
  sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([...records, { fingerprint, key }]),
  )
  return key
}

function clearKey(fingerprint: string, key: string) {
  const remaining = readRecords().filter(
    (record) => record.fingerprint !== fingerprint || record.key !== key,
  )
  if (remaining.length === 0) {
    sessionStorage.removeItem(STORAGE_KEY)
  } else {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(remaining))
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
    if (
      isAxiosError(error) &&
      [409, 422].includes(error.response?.status ?? 0)
    ) {
      clearKey(fingerprint, key)
    }
    throw error
  }
}
