import { useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useMeQuery } from '../../auth/queries/use-me-query'
import { useLogout } from '../../auth/hooks/use-logout'
import type { CartItem } from '../../cart/stores/cart.store'
import { useCartStore } from '../../cart/stores/cart.store'
import { getApiErrorMessage } from '../../../../shared/lib/api-error'
import { paymentQueryKeys, type PaymentResponse } from '../../../../shared/cross-features/payments'
import { useProductsQuery } from '../queries/use-products-query'

export function useCatalogPage() {
  const { data: user, isLoading: isAuthLoading } = useMeQuery()
  const productsQuery = useProductsQuery()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [paymentResult, setPaymentResult] = useState<PaymentResponse['payment'] | null>(null)
  const [search, setSearch] = useState('')
  const cartItems = useCartStore((state) => state.items)
  const addItem = useCartStore((state) => state.addItem)
  const clearCart = useCartStore((state) => state.clear)
  const logout = useLogout()
  const openCartFromRedirect = searchParams.get('carrinho')
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const filteredProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('pt-BR')
    if (!query) return productsQuery.data ?? []
    return (productsQuery.data ?? []).filter((product) =>
      `${product.name} ${product.description}`.toLocaleLowerCase('pt-BR').includes(query),
    )
  }, [productsQuery.data, search])

  useEffect(() => {
    if (!user || !openCartFromRedirect) return
    setIsCartOpen(true)
    const nextSearchParams = new URLSearchParams(searchParams)
    nextSearchParams.delete('carrinho')
    setSearchParams(nextSearchParams, { replace: true })
  }, [openCartFromRedirect, searchParams, setSearchParams, user])

  function handleAddToCart(product: NonNullable<typeof productsQuery.data>[number]) {
    const existing = cartItems.find((item) => item.product.id === product.id)
    if (existing?.quantity === 99) {
      toast.info('Limite máximo de unidades atingido.')
      return
    }
    addItem(product)
    toast.success(existing ? 'Quantidade aumentada no carrinho.' : 'Produto adicionado ao carrinho.')
  }

  function handleCheckout(items: CartItem[]) {
    if (!user) {
      setIsCartOpen(false)
      navigate('/login', { state: { from: '/produtos?carrinho=1' } })
      return
    }
    setCheckoutItems(items)
    setPaymentResult(null)
    setIsCartOpen(false)
  }

  function handlePaymentResult(payment: PaymentResponse['payment']) {
    setPaymentResult(payment)
    clearCart()
    void queryClient.invalidateQueries({ queryKey: paymentQueryKeys.all })
  }

  return {
    user: user ?? null,
    isAuthLoading,
    products: filteredProducts,
    isProductsLoading: productsQuery.isLoading,
    productsError: productsQuery.error ? getApiErrorMessage(productsQuery.error) : '',
    onLogout: logout,
    search,
    setSearch,
    onAddToCart: handleAddToCart,
    cartCount,
    isCartOpen,
    setIsCartOpen,
    onCheckout: handleCheckout,
    checkoutItems,
    setCheckoutItems,
    paymentResult,
    setPaymentResult,
    onPaymentResult: handlePaymentResult,
    onViewOrders: () => {
      setCheckoutItems([])
      navigate('/pedidos')
    },
  }
}
