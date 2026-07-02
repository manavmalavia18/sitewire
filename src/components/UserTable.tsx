import { isInactiveOverOneMonth } from '../utils/login'
import { UserRow } from './UserRow'
import type { EnrichedUser } from '../types'

type UserTableProps = {
  users: EnrichedUser[]
}

export function UserTable({ users }: UserTableProps) {
  const inactiveCount = users.filter(
    (user) =>
      user.loginStatus === 'success' &&
      user.lastLoginTime !== null &&
      isInactiveOverOneMonth(user.lastLoginTime),
  ).length

  return (
    <div>
      {inactiveCount > 0 && (
        <p className="table-legend">
          <span className="inactive-badge">Inactive</span> = no login in the last month (
          {inactiveCount} users)
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
              <th>Country</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
