import { formatLoginTime } from '../utils/login'
import type { EnrichedUser } from '../types'

type UserRowProps = {
  user: EnrichedUser
}

export function UserRow({ user }: UserRowProps) {
  const fullName = `${user.first_name} ${user.last_name}`

  return (
    <tr>
      <td>{user.id}</td>
      <td>{fullName}</td>
      <td>{user.email}</td>
      <td>
        {user.loginStatus === 'loading' && <span className="muted">Loading…</span>}
        {user.loginStatus === 'error' && <span className="error-text">Failed to load</span>}
        {user.loginStatus === 'success' &&
          (user.lastLoginTime ? formatLoginTime(user.lastLoginTime) : 'No logins')}
      </td>
      <td>
        {user.loginStatus === 'loading' && <span className="muted">Loading…</span>}
        {user.loginStatus === 'error' && <span className="error-text">Failed to load</span>}
        {user.loginStatus === 'success' && (user.lastLoginIp ?? '—')}
      </td>
    </tr>
  )
}
