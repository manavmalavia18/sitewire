import { ExplainSectionCard } from './ExplainSectionCard'

const INTERVIEW_NOTES_TEXT = `SITewire Users Dashboard — Interview Notes
==========================================

DEMO SCRIPT (~5 min)
1. Dashboard tab — show table appearing first, login columns fill in batch by batch
2. Status banner — user count + "Loading login data… (X/Y)" progress
3. Point out per-row states: Loading… → success or "Failed to load"
4. Load log tab — event timeline with timestamps (great for explaining async flow)
5. Core task + Bonus tab → Dashboard — humanized dates, country column, inactive rows
6. Explain tab — quick summary of requirements vs solution

CHALLENGE RECAP
- API: https://fake-users-api.vercel.app
- ~25% random 500 failures, random latency (10ms–3s)
- GET /users → User[]
- GET /users/:id/relationships/logins → { user_id, logins[] }
- Login arrays are UNSORTED — must find most recent by comparing dates
- Display: ID, full name, email, last login time, last login IP, total user count
- Focus on loading/error/partial-success states, not visual polish

TECH STACK
- React 19 + TypeScript + Vite
- date-fns — humanized dates + inactive check
- ipwho.is — free IP → country lookup
- No router, no Redux/React Query — custom hooks only

FILE MAP
src/api/client.ts      — fetchWithRetry (3 retries, 500ms delay on 500/network errors)
src/api/users.ts       — getUsers(), getUserLogins(id)
src/api/geo.ts         — getCountryForIp() with in-memory cache
src/hooks/useEnrichedUsers.ts — main orchestration: users → batched logins → enrich rows
src/hooks/useEventLog.ts      — records load events for demo walkthrough
src/utils/login.ts     — getMostRecentLogin, formatLoginTime*, isInactiveOverOneMonth
src/components/        — UserTable, UserRow, StatusBanner, Explain panels
src/types.ts           — User, Login, EnrichedUser, LoginStatus

DATA FLOW (say this out loud)
1. App mounts → useEnrichedUsers.load() runs
2. GET /users (with retry) — if this fails entirely, show error + Retry button
3. On success: render table immediately; every row loginStatus = "loading"
4. Loop batches of 15 users → Promise.all 15 parallel GET /users/:id/relationships/logins
5. Per user: retry login fetch → pick most recent login → optional geo lookup → update that row
6. After each batch: setLoginsLoaded increments → progress bar updates
7. Failed login fetches become per-row "Failed to load" — other rows still succeed

KEY DECISIONS (and why)
- Retry (3×, 500ms): handles flaky API without blocking UI forever
- Batching (15): limits concurrency so browser/API isn't overwhelmed; enables progressive UI
- Per-row errors: one bad user doesn't fail the whole page (partial success)
- fetchIdRef: if user hits Retry mid-load, stale responses are ignored
- EnrichedUser type: extends User with login fields + loginStatus state machine
- Country cache: many users share IPs; avoids duplicate geo API calls
- Core vs Bonus variant: same data hook, UI toggles bonus columns/formatting

BONUS FEATURES
1. Humanized time — formatDistanceToNow ("3 months ago"); hover shows exact timestamp
2. Country from IP — ipwho.is after login IP fetched; cached per IP
3. Inactive users — differenceInCalendarMonths >= 1 → red row + "Inactive" badge

LIKELY QUESTIONS
Q: Why batch size 15?
A: Balance between speed and not hammering a flaky API. Small enough for progressive updates, large enough for parallelism. Would tune with real metrics.

Q: Why not fetch all logins at once?
A: 100+ parallel requests on a 25%-failure API creates thundering herd + poor UX. Batching gives incremental feedback.

Q: Why not React Query / SWR?
A: Challenge is small; wanted to show I understand retry, batching, and state without hiding logic in a library. In production I'd use React Query with per-key retry + staleTime.

Q: What if /users fails vs one login fails?
A: /users failure = global error (can't show table). Single login failure = row-level error only.

Q: How do you find "most recent" login?
A: reduce() comparing Date(login_time) — API does not sort the array.

Q: What would you improve?
A: Exponential backoff, request deduplication, virtualized table for large lists, tests for retry/batch logic, error boundaries, accessibility audit.

API ENDPOINTS USED
GET https://fake-users-api.vercel.app/users
GET https://fake-users-api.vercel.app/users/:id/relationships/logins
GET https://ipwho.is/:ip (bonus only)
`

export function InterviewPrep() {
  async function copyAllNotes() {
    await navigator.clipboard.writeText(INTERVIEW_NOTES_TEXT)
  }

  return (
    <div className="explain-section-content">
      <ExplainSectionCard title="📱 Demo script (say this on the call)">
        <ol className="explain-list explain-list--ordered">
          <li>
            Open <strong>Dashboard</strong> — table appears first; login columns say "Loading…"
          </li>
          <li>
            Watch rows fill in <strong>batch by batch</strong> (15 users at a time)
          </li>
          <li>
            Point to the <strong>status banner</strong>: user count + progress (X/Y logins)
          </li>
          <li>
            Show a <strong>failed row</strong> if any — per-row error, rest still work
          </li>
          <li>
            Switch to <strong>Load log</strong> — walk through the event timeline
          </li>
          <li>
            Switch to <strong>Core task + Bonus</strong> → Dashboard — humanized dates,
            country column, inactive highlighting
          </li>
        </ol>
      </ExplainSectionCard>

      <ExplainSectionCard title="Challenge recap">
        <ul className="explain-list">
          <li>
            API at <code>fake-users-api.vercel.app</code> — ~25% random 500s, 10ms–3s latency
          </li>
          <li>
            <code>GET /users</code> → list of users;{' '}
            <code>GET /users/:id/relationships/logins</code> → login history
          </li>
          <li>Login arrays are <strong>unsorted</strong> — must compute most recent</li>
          <li>
            Show: ID, full name, email, last login time, last login IP, <strong>total user
            count</strong>
          </li>
          <li>They care about <strong>states</strong> (loading, error, partial success), not polish</li>
        </ul>
      </ExplainSectionCard>

      <ExplainSectionCard title="Tech stack">
        <ul className="explain-list">
          <li>React 19 + TypeScript + Vite</li>
          <li>
            <code>date-fns</code> — relative dates + inactive-month check
          </li>
          <li>
            <code>ipwho.is</code> — IP → country (bonus)
          </li>
          <li>No router, no state library — custom hooks handle everything</li>
        </ul>
      </ExplainSectionCard>

      <ExplainSectionCard title="File map (where to click in code)">
        <ul className="explain-list explain-list--files">
          <li>
            <code>api/client.ts</code> — retry wrapper (3 tries, 500ms delay)
          </li>
          <li>
            <code>api/users.ts</code> — <code>getUsers()</code>, <code>getUserLogins()</code>
          </li>
          <li>
            <code>api/geo.ts</code> — country lookup + IP cache
          </li>
          <li>
            <code>hooks/useEnrichedUsers.ts</code> — <strong>start here</strong> — main load
            orchestration
          </li>
          <li>
            <code>hooks/useEventLog.ts</code> — event recording for Load log tab
          </li>
          <li>
            <code>utils/login.ts</code> — most-recent login, date formatting, inactive check
          </li>
          <li>
            <code>components/UserRow.tsx</code> — per-row loading/success/error UI
          </li>
          <li>
            <code>types.ts</code> — <code>EnrichedUser</code>, <code>LoginStatus</code>
          </li>
        </ul>
      </ExplainSectionCard>

      <ExplainSectionCard title="Data flow (explain this out loud)">
        <ol className="explain-list explain-list--ordered">
          <li>
            <code>useEnrichedUsers.load()</code> runs on mount (and on Retry)
          </li>
          <li>
            Fetch all users with retry → on failure: global error banner + Retry button
          </li>
          <li>
            On success: table renders immediately; every row <code>loginStatus = loading</code>
          </li>
          <li>
            Loop batches of 15 → <code>Promise.all</code> 15 parallel login requests
          </li>
          <li>
            Per user: fetch logins → <code>getMostRecentLogin()</code> → geo lookup (bonus) →
            update row
          </li>
          <li>
            After each batch: progress counter updates; UI re-renders those rows
          </li>
          <li>Failed login = row shows "Failed to load"; other rows unaffected</li>
        </ol>
      </ExplainSectionCard>

      <ExplainSectionCard title="Key decisions (and why)">
        <ul className="explain-list">
          <li>
            <strong>Retry (3×, 500ms)</strong> — handles ~25% failure rate without giving up
            immediately
          </li>
          <li>
            <strong>Batching (15)</strong> — limits concurrency; enables progressive "rows filling
            in" UX
          </li>
          <li>
            <strong>Per-row errors</strong> — partial success: one bad API call doesn't break the
            whole table
          </li>
          <li>
            <strong>fetchIdRef</strong> — ignores stale responses if user hits Retry mid-load
          </li>
          <li>
            <strong>EnrichedUser</strong> — extends <code>User</code> with login fields +
            status state machine (<code>loading → success | error</code>)
          </li>
          <li>
            <strong>Country cache</strong> — duplicate IPs skip extra geo API calls
          </li>
        </ul>
      </ExplainSectionCard>

      <ExplainSectionCard title="Retry logic (client.ts)">
        <ul className="explain-list">
          <li>Up to 3 retries (4 total attempts) per request</li>
          <li>500ms delay between attempts</li>
          <li>Retries on HTTP 500 and network errors</li>
          <li>Non-500 errors (e.g. 404) fail immediately — no pointless retries</li>
        </ul>
      </ExplainSectionCard>

      <ExplainSectionCard title="Bonus features — implementation">
        <ul className="explain-list">
          <li>
            <strong>Humanized time</strong> — <code>formatDistanceToNow</code> from date-fns;
            <code>title</code> attribute shows exact date on hover
          </li>
          <li>
            <strong>Country</strong> — after IP fetched, call <code>ipwho.is/{'{ip}'}</code>;
            result cached in a <code>Map</code>
          </li>
          <li>
            <strong>Inactive</strong> — <code>differenceInCalendarMonths(now, login) &gt;= 1</code>
            → red row background + badge
          </li>
        </ul>
      </ExplainSectionCard>

      <ExplainSectionCard title="Questions they might ask">
        <dl className="explain-qa">
          <dt>Why batch size 15?</dt>
          <dd>
            Balance speed vs. not overwhelming a flaky API. Enough parallelism for progress, small
            enough for incremental UI updates. Would tune with real metrics.
          </dd>
          <dt>Why not Promise.all for all users?</dt>
          <dd>
            100+ concurrent requests on a 25%-failure API = thundering herd + long wait with no
            feedback. Batching shows progress.
          </dd>
          <dt>Why not React Query?</dt>
          <dd>
            Small challenge — wanted to show I understand retry/batching/state without hiding it in
            a library. Production: React Query with per-key retry.
          </dd>
          <dt>/users fails vs. one login fails?</dt>
          <dd>
            /users = global error (no table). Single login = row-level "Failed to load" only.
          </dd>
          <dt>How find most recent login?</dt>
          <dd>
            <code>reduce()</code> comparing <code>Date(login_time)</code> — API doesn't sort.
          </dd>
          <dt>What would you improve?</dt>
          <dd>
            Exponential backoff, request dedup, virtualized table, unit tests for retry/batch logic,
            error boundaries.
          </dd>
        </dl>
      </ExplainSectionCard>

      <div className="explain-panel__actions">
        <button type="button" onClick={() => void copyAllNotes()}>
          Copy all notes
        </button>
      </div>
    </div>
  )
}
