import { differenceInCalendarMonths, formatDistanceToNow } from 'date-fns'
import type { Login } from '../types'

export function getMostRecentLogin(logins: Login[]): Login | null {
  if (logins.length === 0) return null

  return logins.reduce((latest, current) =>
    new Date(current.login_time) > new Date(latest.login_time) ? current : latest,
  )
}

export function formatLoginTimeHumanized(iso: string): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true })
}

export function formatLoginTimeExact(iso: string): string {
  return new Date(iso).toLocaleString()
}

export function isInactiveOverOneMonth(iso: string): boolean {
  return differenceInCalendarMonths(new Date(), new Date(iso)) >= 1
}
