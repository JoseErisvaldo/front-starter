const brazilianCurrencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function formatBrazilianCurrency(amount: number): string {
  return brazilianCurrencyFormatter.format(amount)
}
