import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { PaymentResponse } from '../../../private/user/payments/types/payment.types'
import type { CartItem } from '../../cart/stores/cart.store'
import { useCartStore } from '../../cart/stores/cart.store'
import { CartDrawer } from '../../cart/components/cart-drawer.view'
import { useMeQuery } from '../../auth/queries/use-me-query'
import { CatalogView } from '../views/catalog.view'
import { useProductsQuery } from '../queries/use-products-query'
import { PaymentCheckoutView } from '../../../private/user/payments/components/payment-checkout.view'
import { paymentQueryKeys } from '../../../private/user/payments/endpoints-keys/payment.keys'
import { getApiErrorMessage } from '../../../../shared/lib/api-error'
import { useLogout } from '../../auth/hooks/use-logout'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export function CatalogRoute() {
  const { data: user, isLoading: isAuthLoading } = useMeQuery()
  const productsQuery = useProductsQuery()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const cartItems = useCartStore((state) => state.items)
  const addItem = useCartStore((state) => state.addItem)
  const clearCart = useCartStore((state) => state.clear)
  const [paymentResult, setPaymentResult] = useState<
    PaymentResponse['payment'] | null
  >(null)
  const openCartFromRedirect = searchParams.get('carrinho')
  const logout = useLogout()

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
    toast.success(
      existing
        ? 'Quantidade aumentada no carrinho.'
        : 'Produto adicionado ao carrinho.',
    )
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

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <CatalogView
        user={user ?? null}
        isAuthLoading={isAuthLoading}
        products={productsQuery.data ?? []}
        isLoading={productsQuery.isLoading}
        error={productsQuery.error ? getApiErrorMessage(productsQuery.error) : ''}
        onLogout={logout}
        onAddToCart={handleAddToCart}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
      />
      <CartDrawer
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
      />
      {user && (
        <PaymentCheckoutView
          items={checkoutItems}
          user={user}
          result={paymentResult}
          onClose={() => setCheckoutItems([])}
          onViewOrders={() => {
            setCheckoutItems([])
            navigate('/pedidos')
          }}
          onResult={handlePaymentResult}
        />
      )}
    </>
  )
}
