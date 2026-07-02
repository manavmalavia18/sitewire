import type { Login } from '../types'

export function getMostRecentLogin(logins: Login[]): Login | null {
  if (logins.length === 0) return null

  return logins.reduce((latest, current) =>
    new Date(current.login_time) > new Date(latest.login_time) ? current : latest,
  )
}

export function formatLoginTime(iso: string): string {
  return new Date(iso).toLocaleString()
}
