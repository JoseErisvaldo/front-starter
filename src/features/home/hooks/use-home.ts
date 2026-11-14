import { useState } from 'react'
import { getApiErrorMessage } from '../../../shared/lib/api-error'
import { useProductsQuery } from '../../products/queries/use-products-query'
import type { Product } from '../../products/types/product.types'
import type { PaymentResponse } from '../../payments/types/payment.types'

export function useHome() {
  const productsQuery = useProductsQuery()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [paymentResult, setPaymentResult] = useState<PaymentResponse['payment'] | null>(null)

  function selectProduct(product: Product) {
    setPaymentResult(null)
    setSelectedProduct(product)
  }

  function closeCheckout() {
    setSelectedProduct(null)
  }

  return {
    products: productsQuery.data ?? [],
    isProductsLoading: productsQuery.isLoading,
    productsError: productsQuery.error ? getApiErrorMessage(productsQuery.error) : '',
    selectedProduct,
    paymentResult,
    onSelectProduct: selectProduct,
    onCloseCheckout: closeCheckout,
    onPaymentResult: (payment: PaymentResponse['payment']) => setPaymentResult(payment),
  }
}
