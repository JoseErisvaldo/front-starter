const brazilianLongDateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' })

export function formatBrazilianLongDate(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) {
    throw new RangeError('Data inválida para formatação.')
  }

  return brazilianLongDateFormatter.format(date)
}
