import { fetchWithRetry } from './client'
import type { User, UserLogins } from '../types'

export function getUsers(): Promise<User[]> {
  return fetchWithRetry<User[]>('/users')
}

export function getUserLogins(userId: number): Promise<UserLogins> {
  return fetchWithRetry<UserLogins>(`/users/${userId}/relationships/logins`)
}
