import { ExplainSectionCard } from './ExplainSectionCard'
import type { UsersLoadStatus } from '../types'

type CoreTaskExplainProps = {
  usersStatus: UsersLoadStatus
  userCount: number
  loginsLoaded: number
  loginsTotal: number
  loginSuccessCount: number
  loginErrorCount: number
}

export function CoreTaskExplain({
  usersStatus,
  userCount,
  loginsLoaded,
  loginsTotal,
  loginSuccessCount,
  loginErrorCount,
}: CoreTaskExplainProps) {
  return (
    <div className="explain-section-content">
      <ExplainSectionCard title="What Sitewire asked for">
        <ul className="explain-list">
          <li>Show user ID, full name, email</li>
          <li>Show last login time and IP (the most recent one)</li>
          <li>Show total number of users</li>
          <li>Handle a flaky API that fails ~25% of the time</li>
          <li>Show loading, error, and partial-success clearly</li>
        </ul>
      </ExplainSectionCard>

      <ExplainSectionCard title="How we solve it (simple)">
        <ul className="explain-list">
          <li>
            <strong>Retry</strong> — if API returns 500, try again up to 3 times
          </li>
          <li>
            <strong>Batches of 15</strong> — load logins 15 users at a time, not all at once
          </li>
          <li>
            <strong>Table shows first</strong> — names appear right away, logins fill in after
          </li>
          <li>
            <strong>Each row has its own status</strong> — loading, success, or failed
          </li>
          <li>
            <strong>Pick newest login</strong> — API sends logins in random order, we compare dates
          </li>
        </ul>
      </ExplainSectionCard>

      <ExplainSectionCard title="Live status right now">
        <div className="explain-panel__stats">
          <div className="explain-stat">
            <span className="explain-stat__label">Status</span>
            <strong>{usersStatus}</strong>
          </div>
          <div className="explain-stat">
            <span className="explain-stat__label">Users</span>
            <strong>{userCount}</strong>
          </div>
          <div className="explain-stat">
            <span className="explain-stat__label">Logins loaded</span>
            <strong>
              {loginsLoaded}/{loginsTotal}
            </strong>
          </div>
          <div className="explain-stat">
            <span className="explain-stat__label">Rows</span>
            <strong>
              {loginSuccessCount} ok · {loginErrorCount} failed
            </strong>
          </div>
        </div>
      </ExplainSectionCard>
    </div>
  )
}
