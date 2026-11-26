const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000

export function getPreviousOrdersDashboardDateRange({
  dateFrom,
  dateTo,
}: {
  dateFrom: string
  dateTo: string
}) {
  const start = new Date(`${dateFrom}T00:00:00.000Z`)
  const end = new Date(`${dateTo}T00:00:00.000Z`)
  const dayCount = Math.round((end.getTime() - start.getTime()) / DAY_IN_MILLISECONDS) + 1
  const previousTo = new Date(start)
  previousTo.setUTCDate(previousTo.getUTCDate() - 1)
  const previousFrom = new Date(previousTo)
  previousFrom.setUTCDate(previousFrom.getUTCDate() - dayCount + 1)
  return {
    dateFrom: previousFrom.toISOString().slice(0, 10),
    dateTo: previousTo.toISOString().slice(0, 10),
  }
}
