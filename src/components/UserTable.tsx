import { UserRow } from './UserRow'
import type { EnrichedUser } from '../types'

type UserTableProps = {
  users: EnrichedUser[]
}

export function UserTable({ users }: UserTableProps) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Full name</th>
            <th>Email</th>
            <th>Last login</th>
            <th>Last login IP</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserRow key={user.id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
