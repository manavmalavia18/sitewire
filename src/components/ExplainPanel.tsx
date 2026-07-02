import type { LoadEvent } from '../types/events'
import type { UsersLoadStatus } from '../types'

type ExplainPanelProps = {
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

export function ExplainPanel({
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
  const latest = events[events.length - 1]
  const progressPct = loginsTotal ? Math.round((loginsLoaded / loginsTotal) * 100) : 0

  return (
    <div className="explain-panel">
      <p className="explain-panel__intro">
        This tab records what the app is doing in real time. Switch to Dashboard to see the table.
      </p>

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

      <div className="explain-panel__now">
        <span className="explain-panel__now-label">Right now</span>
        <p>{latest?.title ?? 'Waiting…'}</p>
        <p className="explain-panel__now-detail">
          {latest?.detail ?? 'Refresh the page to start recording.'}
        </p>
      </div>

      <div className="explain-panel__progress">
        <div className="explain-panel__progress-labels">
          <span>Progress</span>
          <span>
            {progressPct}% · {loginsLoading ? 'Loading' : loginsTotal > 0 ? 'Done' : '—'}
          </span>
        </div>
        <div className="explain-panel__progress-track">
          <div className="explain-panel__progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <div className="explain-panel__actions">
        <button type="button" onClick={onCopy} disabled={events.length === 0}>
          Copy notes
        </button>
        <button type="button" onClick={onClear}>
          Clear log
        </button>
      </div>

      <div className="explain-panel__log">
        <h3>Event log</h3>
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
      </div>
    </div>
  )
}
