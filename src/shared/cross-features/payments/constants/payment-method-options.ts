export const paymentMethodOptions = [
  {
    value: "pix",
    title: "Pix",
    description: "QR Code ou Pix copia e cola",
  },
  {
    value: "card",
    title: "Cartão",
    description: "Crédito ou débito",
  },
] as const;

export type PaymentMethod = (typeof paymentMethodOptions)[number]["value"];
