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
      <ExplainSectionCard title="What was required">
        <ul className="explain-list">
          <li>Show user ID, full name, email</li>
          <li>Show last (most recent) login time and IP</li>
          <li>Show total user count</li>
          <li>Handle a flaky API (~25% failures, slow responses)</li>
          <li>Focus on loading, error, and partial-success states</li>
        </ul>
      </ExplainSectionCard>

      <ExplainSectionCard title="How this app solves it">
        <ul className="explain-list">
          <li>
            <strong>Retry logic</strong> — up to 3 retries on 500/network errors (500ms between
            tries) in <code>api/client.ts</code>
          </li>
          <li>
            <strong>Batching</strong> — 15 login requests at a time in{' '}
            <code>useEnrichedUsers.ts</code>
          </li>
          <li>
            <strong>Per-row status</strong> — <code>loginStatus</code>: loading → success or error
            per user
          </li>
          <li>
            <strong>Progressive UI</strong> — table first, login data fills in batch by batch
          </li>
          <li>
            <strong>Most recent login</strong> — login arrays are unsorted;{' '}
            <code>getMostRecentLogin()</code> compares dates
          </li>
          <li>
            <strong>Global vs row errors</strong> — <code>/users</code> failure hides table;
            single login failure only marks that row
          </li>
          <li>
            <strong>Stale-load guard</strong> — <code>fetchIdRef</code> ignores old responses if
            Retry is clicked mid-load
          </li>
        </ul>
      </ExplainSectionCard>

      <ExplainSectionCard title="Code entry points">
        <ul className="explain-list explain-list--files">
          <li>
            <code>hooks/useEnrichedUsers.ts</code> — main orchestration (start here)
          </li>
          <li>
            <code>api/client.ts</code> — <code>fetchWithRetry</code>
          </li>
          <li>
            <code>components/UserRow.tsx</code> — row-level loading/error display
          </li>
          <li>
            <code>components/StatusBanner.tsx</code> — user count + login progress
          </li>
        </ul>
      </ExplainSectionCard>

      <ExplainSectionCard title="Live status">
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
            <span className="explain-stat__label">Logins</span>
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
