import { initMercadoPago } from '@mercadopago/sdk-react'

export const mercadoPagoPublicKey =
  import.meta.env.VITE_MP_SUBSCRIPTIONS_PUBLIC_KEY ?? import.meta.env.VITE_MP_PUBLIC_KEY

if (mercadoPagoPublicKey) initMercadoPago(mercadoPagoPublicKey, { locale: 'pt-BR' })
