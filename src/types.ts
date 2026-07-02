export interface User {
  id: number
  first_name: string
  last_name: string
  email: string
}

export interface Login {
  login_time: string
  ip_v4: string
}

export interface UserLogins {
  user_id: number
  logins: Login[]
}

export type LoginStatus = 'loading' | 'success' | 'error'

export interface EnrichedUser extends User {
  lastLoginTime: string | null
  lastLoginIp: string | null
  loginStatus: LoginStatus
}

export type UsersLoadStatus = 'loading' | 'error' | 'success'
