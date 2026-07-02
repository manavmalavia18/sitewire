import { ExplainSectionCard } from './ExplainSectionCard'

type BonusTaskExplainProps = {
  inactiveCount: number
  countriesLoaded: number
}

export function BonusTaskExplain({ inactiveCount, countriesLoaded }: BonusTaskExplainProps) {
  return (
    <div className="explain-section-content">
      <ExplainSectionCard title="Bonus 1 — Humanized login time">
        <p className="explain-text">
          Relative times like <em>"3 months ago"</em> instead of raw timestamps. Hover for the
          exact date. Built with <code>date-fns</code>.
        </p>
      </ExplainSectionCard>

      <ExplainSectionCard title="Bonus 2 — Country from IP">
        <p className="explain-text">
          After each login IP is fetched, we look up the country via <code>ipapi.co</code>. IPs
          are cached so duplicates are not re-fetched.
        </p>
      </ExplainSectionCard>

      <ExplainSectionCard title="Bonus 3 — Inactive users">
        <p className="explain-text">
          Users with no login in the last month get a highlighted row and an{' '}
          <span className="inactive-badge">Inactive</span> badge.
        </p>
      </ExplainSectionCard>

      <ExplainSectionCard title="Live status">
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
  )
}
