const brazilianDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'America/Sao_Paulo',
})

export function formatBrazilianDate(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) {
    throw new RangeError('Data inválida para formatação.')
  }

  return brazilianDateFormatter.format(date)
}
