import { ExplainSectionCard } from './ExplainSectionCard'
import type { LoadEvent } from '../types/events'

type LoadLogPanelProps = {
  events: LoadEvent[]
  loginsLoaded: number
  loginsTotal: number
  loginsLoading: boolean
  onCopy: () => void
  onClear: () => void
}

export function LoadLogPanel({
  events,
  loginsLoaded,
  loginsTotal,
  loginsLoading,
  onCopy,
  onClear,
}: LoadLogPanelProps) {
  const latest = events[events.length - 1]
  const progressPct = loginsTotal ? Math.round((loginsLoaded / loginsTotal) * 100) : 0

  return (
    <div className="explain-section-content">
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
            <div className="explain-panel__progress-fill" style={{ width: `${progressPct}%` }} />
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
  )
}
