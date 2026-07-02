import {
  formatLoginTimeExact,
  formatLoginTimeHumanized,
  isInactiveOverOneMonth,
} from '../utils/login'
import type { TableVariant } from './UserTable'
import type { EnrichedUser } from '../types'

type UserRowProps = {
  user: EnrichedUser
  variant: TableVariant
}

export function UserRow({ user, variant }: UserRowProps) {
  const fullName = `${user.first_name} ${user.last_name}`
  const inactive =
    variant === 'bonus' &&
    user.loginStatus === 'success' &&
    user.lastLoginTime !== null &&
    isInactiveOverOneMonth(user.lastLoginTime)

  return (
    <tr className={inactive ? 'row--inactive' : undefined}>
      <td>{user.id}</td>
      <td>
        {fullName}
        {inactive && (
          <span className="inactive-badge" title="No login in the last month">
            Inactive
          </span>
        )}
      </td>
      <td>{user.email}</td>
      <td>
        {user.loginStatus === 'loading' && <span className="muted">Loading…</span>}
        {user.loginStatus === 'error' && <span className="error-text">Failed to load</span>}
        {user.loginStatus === 'success' &&
          (user.lastLoginTime ? (
            variant === 'bonus' ? (
              <span title={formatLoginTimeExact(user.lastLoginTime)}>
                {formatLoginTimeHumanized(user.lastLoginTime)}
              </span>
            ) : (
              formatLoginTimeExact(user.lastLoginTime)
            )
          ) : (
            'No logins'
          ))}
      </td>
      <td>
        {user.loginStatus === 'loading' && <span className="muted">Loading…</span>}
        {user.loginStatus === 'error' && <span className="error-text">Failed to load</span>}
        {user.loginStatus === 'success' && (user.lastLoginIp ?? '—')}
      </td>
      {variant === 'bonus' && (
        <td>
          {user.loginStatus === 'loading' && <span className="muted">Loading…</span>}
          {user.loginStatus === 'error' && <span className="error-text">Failed to load</span>}
          {user.loginStatus === 'success' && (user.lastLoginCountry ?? '—')}
        </td>
      )}
    </tr>
  )
}
