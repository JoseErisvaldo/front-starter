import { useMutation } from '@tanstack/react-query'
import { createPaymentService } from '../services/create-payment.service'

export function useCreatePaymentMutation() {
  return useMutation({ mutationFn: createPaymentService })
}
