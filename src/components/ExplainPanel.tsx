import { useState, type ReactNode } from 'react'
import { isInactiveOverOneMonth } from '../utils/login'
import type { LoadEvent } from '../types/events'
import type { EnrichedUser, UsersLoadStatus } from '../types'

type ExplainSection = 'core' | 'bonus' | 'load'

type ExplainPanelProps = {
  users: EnrichedUser[]
  events: LoadEvent[]
  usersStatus: UsersLoadStatus
  userCount: number
  loginsLoaded: number
  loginsTotal: number
  loginsLoading: boolean
  loginSuccessCount: number
  loginErrorCount: number
  onCopy: () => void
  onClear: () => void
}

function ExplainSectionCard({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="explain-section-card">
      <h3>{title}</h3>
      {children}
    </section>
  )
}

export function ExplainPanel({
  users,
  events,
  usersStatus,
  userCount,
  loginsLoaded,
  loginsTotal,
  loginsLoading,
  loginSuccessCount,
  loginErrorCount,
  onCopy,
  onClear,
}: ExplainPanelProps) {
  const [section, setSection] = useState<ExplainSection>('core')
  const latest = events[events.length - 1]
  const progressPct = loginsTotal ? Math.round((loginsLoaded / loginsTotal) * 100) : 0

  const inactiveCount = users.filter(
    (user) =>
      user.loginStatus === 'success' &&
      user.lastLoginTime !== null &&
      isInactiveOverOneMonth(user.lastLoginTime),
  ).length

  const countriesLoaded = users.filter((user) => user.lastLoginCountry).length

  return (
    <div className="explain-panel">
      <p className="explain-panel__intro">
        Walk through the challenge in sections. Switch to Dashboard to see the live table.
      </p>

      <div className="explain-section-tabs" role="tablist" aria-label="Explain sections">
        <button
          type="button"
          role="tab"
          aria-selected={section === 'core'}
          className={section === 'core' ? 'explain-section-tabs__btn explain-section-tabs__btn--active' : 'explain-section-tabs__btn'}
          onClick={() => setSection('core')}
        >
          Core task
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={section === 'bonus'}
          className={section === 'bonus' ? 'explain-section-tabs__btn explain-section-tabs__btn--active' : 'explain-section-tabs__btn'}
          onClick={() => setSection('bonus')}
        >
          Bonus
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={section === 'load'}
          className={section === 'load' ? 'explain-section-tabs__btn explain-section-tabs__btn--active' : 'explain-section-tabs__btn'}
          onClick={() => setSection('load')}
        >
          Load log
        </button>
      </div>

      {section === 'core' && (
        <div role="tabpanel" className="explain-section-content">
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
                <strong>Retry logic</strong> — up to 3 retries on 500 errors (`fetchWithRetry`)
              </li>
              <li>
                <strong>Batching</strong> — 15 login requests at a time (not all 1000 at once)
              </li>
              <li>
                <strong>Per-row status</strong> — each user row: loading → success or error
              </li>
              <li>
                <strong>Progressive UI</strong> — table appears first, login data fills in batch by batch
              </li>
              <li>
                <strong>Most recent login</strong> — login arrays are unsorted; we compare dates
              </li>
            </ul>
          </ExplainSectionCard>

          <ExplainSectionCard title="Live status (core)">
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
      )}

      {section === 'bonus' && (
        <div role="tabpanel" className="explain-section-content">
          <ExplainSectionCard title="Bonus 1 — Humanized login time">
            <p className="explain-text">
              Instead of raw timestamps, the table shows relative times like{' '}
              <em>"3 months ago"</em>. Hover a cell to see the exact date.
            </p>
            <p className="explain-text">
              Built with <code>date-fns</code> <code>formatDistanceToNow</code>.
            </p>
          </ExplainSectionCard>

          <ExplainSectionCard title="Bonus 2 — Country from IP">
            <p className="explain-text">
              After fetching each user's last login IP, we look up the country via{' '}
              <code>ipapi.co</code>. Results are cached so duplicate IPs are not re-fetched.
            </p>
            <p className="explain-text">
              In production I'd proxy this through a backend to avoid rate limits.
            </p>
          </ExplainSectionCard>

          <ExplainSectionCard title="Bonus 3 — Inactive users">
            <p className="explain-text">
              Users who haven't logged in for at least one month get a highlighted row and an{' '}
              <span className="inactive-badge">Inactive</span> badge next to their name.
            </p>
          </ExplainSectionCard>

          <ExplainSectionCard title="Live status (bonus)">
            <div className="explain-panel__stats">
              <div className="explain-stat">
                <span className="explain-stat__label">Countries resolved</span>
                <strong>{countriesLoaded}</strong>
              </div>
              <div className="explain-stat">
                <span className="explain-stat__label">Inactive users</span>
                <strong>{inactiveCount}</strong>
              </div>
              <div className="explain-stat">
                <span className="explain-stat__label">Humanized dates</span>
                <strong>On</strong>
              </div>
            </div>
          </ExplainSectionCard>
        </div>
      )}

      {section === 'load' && (
        <div role="tabpanel" className="explain-section-content">
          <ExplainSectionCard title="Right now">
            <p className="explain-text explain-text--strong">{latest?.title ?? 'Waiting…'}</p>
            <p className="explain-text">
              {latest?.detail ?? 'Refresh the page to start a new recording.'}
            </p>
          </ExplainSectionCard>

          <ExplainSectionCard title="Progress">
            <div className="explain-panel__progress">
              <div className="explain-panel__progress-labels">
                <span>Login fetch</span>
                <span>
                  {progressPct}% · {loginsLoading ? 'Loading' : loginsTotal > 0 ? 'Done' : '—'}
                </span>
              </div>
              <div className="explain-panel__progress-track">
                <div
                  className="explain-panel__progress-fill"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </ExplainSectionCard>

          <div className="explain-panel__actions">
            <button type="button" onClick={onCopy} disabled={events.length === 0}>
              Copy notes
            </button>
            <button type="button" onClick={onClear}>
              Clear log
            </button>
          </div>

          <ExplainSectionCard title="Event log">
            {events.length === 0 ? (
              <p className="muted">No events yet. Refresh the page to record.</p>
            ) : (
              <ol className="explain-log">
                {events.map((event) => (
                  <li key={event.id} className="explain-log__item">
                    <div className="explain-log__time">{event.elapsedLabel}</div>
                    <div className="explain-log__body">
                      <strong>{event.title}</strong>
                      <p>{event.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </ExplainSectionCard>
        </div>
      )}
    </div>
  )
}
