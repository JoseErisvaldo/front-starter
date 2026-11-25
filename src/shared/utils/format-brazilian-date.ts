const brazilianDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'America/Sao_Paulo',
})

const brazilianMonthLabelFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'short',
  year: '2-digit',
  timeZone: 'UTC',
})

const brazilianDayMonthLabelFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  timeZone: 'UTC',
})

export function formatBrazilianDate(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) {
    throw new RangeError('Data inválida para formatação.')
  }

  return brazilianDateFormatter.format(date)
}

export function formatBrazilianMonthLabel(value: string): string {
  const date = new Date(`${value}-01T00:00:00.000Z`)
  if (Number.isNaN(date.getTime())) {
    throw new RangeError('Mês inválido para formatação.')
  }

  return brazilianMonthLabelFormatter.format(date)
}

export function formatBrazilianDayMonthLabel(value: string): string {
  const date = new Date(`${value}T00:00:00.000Z`)
  if (Number.isNaN(date.getTime())) {
    throw new RangeError('Data inválida para formatação.')
  }

  return brazilianDayMonthLabelFormatter.format(date)
}
