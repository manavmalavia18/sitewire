import { ExplainSectionCard } from './ExplainSectionCard'

type BonusTaskExplainProps = {
  inactiveCount: number
  countriesLoaded: number
}

export function BonusTaskExplain({ inactiveCount, countriesLoaded }: BonusTaskExplainProps) {
  return (
    <div className="explain-section-content">
      <ExplainSectionCard title="Bonus 1 — Friendly login time">
        <p className="explain-text">
          Instead of <code>2026-03-15T10:30:00Z</code> we show <em>"3 months ago"</em>.
        </p>
        <p className="explain-text">
          Hover (or tap and hold on phone) to see the exact date. Uses a library called{' '}
          <code>date-fns</code>.
        </p>
      </ExplainSectionCard>

      <ExplainSectionCard title="Bonus 2 — Country from IP">
        <p className="explain-text">
          After we get the login IP, we ask <code>ipwho.is</code> what country it is in.
        </p>
        <p className="explain-text">
          If two users have the same IP, we only look it up once (cached in memory).
        </p>
      </ExplainSectionCard>

      <ExplainSectionCard title="Bonus 3 — Inactive users">
        <p className="explain-text">
          If someone has not logged in for at least 1 month, their row turns light red and gets an{' '}
          <span className="inactive-badge">Inactive</span> badge.
        </p>
      </ExplainSectionCard>

      <ExplainSectionCard title="Live status">
        <div className="explain-panel__stats">
          <div className="explain-stat">
            <span className="explain-stat__label">Countries found</span>
            <strong>{countriesLoaded}</strong>
          </div>
          <div className="explain-stat">
            <span className="explain-stat__label">Inactive users</span>
            <strong>{inactiveCount}</strong>
          </div>
        </div>
      </ExplainSectionCard>
    </div>
  )
}
