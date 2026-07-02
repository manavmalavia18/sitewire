import { isInactiveOverOneMonth } from '../utils/login'
import { UserRow } from './UserRow'
import type { EnrichedUser } from '../types'

export type TableVariant = 'core' | 'bonus'

type UserTableProps = {
  users: EnrichedUser[]
  variant: TableVariant
}

export function UserTable({ users, variant }: UserTableProps) {
  const inactiveCount = users.filter(
    (user) =>
      user.loginStatus === 'success' &&
      user.lastLoginTime !== null &&
      isInactiveOverOneMonth(user.lastLoginTime),
  ).length

  const countriesLoaded = users.filter((user) => user.lastLoginCountry).length

  return (
    <div>
      {variant === 'bonus' && inactiveCount > 0 && (
        <p className="table-legend">
          <span className="inactive-badge">Inactive</span> = no login in the last month (
          {inactiveCount} users)
        </p>
      )}
      {variant === 'bonus' && (
        <p className="table-legend table-legend--bonus">
          Bonus extras: humanized dates · country from IP ({countriesLoaded} resolved) · inactive
          highlighting
        </p>
      )}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Full name</th>
              <th>Email</th>
              <th>Last login</th>
              <th>Last login IP</th>
              {variant === 'bonus' && <th>Country</th>}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <UserRow key={user.id} user={user} variant={variant} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
