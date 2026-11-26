const adminAccountDateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' })

export function formatAdminAccountDate(value: string) {
  return adminAccountDateFormatter.format(new Date(value))
}
