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
          exact date.
        </p>
        <ul className="explain-list">
          <li>
            <code>formatDistanceToNow</code> from <code>date-fns</code> in{' '}
            <code>utils/login.ts</code>
          </li>
          <li>
            <code>title</code> attribute on the cell shows <code>formatLoginTimeExact()</code> on
            hover
          </li>
          <li>Core tab shows raw timestamps; Bonus tab shows humanized</li>
        </ul>
      </ExplainSectionCard>

      <ExplainSectionCard title="Bonus 2 — Country from IP">
        <p className="explain-text">
          After each login IP is fetched, we look up the country via <code>ipwho.is</code>.
        </p>
        <ul className="explain-list">
          <li>
            <code>api/geo.ts</code> — <code>getCountryForIp(ip)</code>
          </li>
          <li>In-memory <code>Map</code> cache — duplicate IPs skip the network call</li>
          <li>Cache cleared on each full reload</li>
          <li>Geo failure is silent — row shows "—" instead of breaking the load</li>
        </ul>
      </ExplainSectionCard>

      <ExplainSectionCard title="Bonus 3 — Inactive users">
        <p className="explain-text">
          Users with no login in the last month get a highlighted row and an{' '}
          <span className="inactive-badge">Inactive</span> badge.
        </p>
        <ul className="explain-list">
          <li>
            <code>isInactiveOverOneMonth()</code> — <code>differenceInCalendarMonths &gt;= 1</code>
          </li>
          <li>Only applies when login loaded successfully and has a timestamp</li>
          <li>
            <code>UserRow.tsx</code> adds <code>row--inactive</code> class + badge
          </li>
        </ul>
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
