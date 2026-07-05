import { ExplainSectionCard } from './ExplainSectionCard'

const SIMPLE_NOTES = `SITewire Interview Notes (simple version)
========================================

BIG PICTURE
This app shows a list of users from an API. For each user it also fetches their last login time and IP address. The API is flaky (sometimes fails), so the app handles loading, errors, and retries.

HOW TO DEMO (say this on the call)
1. Open Dashboard - table shows up first, login info loads row by row
2. Point at the banner - shows how many users, and login loading progress
3. Show a row that says "Failed to load" if you see one - one user failing does not break the whole page
4. Open Load log - shows step by step what the app is doing
5. Switch to Core + Bonus tab - shows extra features (friendly dates, country, inactive users)

START HERE WHEN THEY ASK ABOUT CODE
hooks/useEnrichedUsers.ts - this is the brain. It loads users, then loads logins in batches.

FILE BY FILE
(see app Interview prep tab for full details)

index.html - empty webpage with a div called "root"
main.tsx - puts the React app into that div
App.tsx - the whole screen with tabs
api/client.ts - fetch with retry when API fails
api/users.ts - calls to get users and logins
api/geo.ts - turns IP address into country name
hooks/useEnrichedUsers.ts - loads everything
hooks/useEventLog.ts - writes the Load log timeline
utils/login.ts - finds most recent login, formats dates
types.ts - describes what user data looks like
components/ - all the visual pieces (table, rows, banners)
`

export function InterviewPrep() {
  async function copyAllNotes() {
    await navigator.clipboard.writeText(SIMPLE_NOTES)
  }

  return (
    <div className="explain-section-content">
      <ExplainSectionCard title="Start here — what does this app do?">
        <p className="explain-text">
          Imagine a spreadsheet of users. This app builds that spreadsheet by talking to a website
          (an API) that gives user info and login history.
        </p>
        <p className="explain-text">
          The API is <strong>unreliable</strong> — about 1 in 4 requests fail, and some are slow.
          So the app shows <strong>loading</strong>, <strong>success</strong>, and{' '}
          <strong>error</strong> states clearly. That is what Sitewire cares about.
        </p>
        <p className="explain-text">
          <strong>Core task:</strong> show ID, name, email, last login time, last login IP, and
          total user count.
        </p>
        <p className="explain-text">
          <strong>Bonus:</strong> friendly dates ("3 months ago"), country from IP, highlight inactive
          users.
        </p>
      </ExplainSectionCard>

      <ExplainSectionCard title="How to demo on the call">
        <ol className="explain-list explain-list--ordered">
          <li>
            <strong>Dashboard</strong> — table appears first. Login columns say "Loading…" then fill
            in.
          </li>
          <li>
            <strong>Status banner</strong> — says "100 users" and "Loading login data… (30/100)".
          </li>
          <li>
            If a row says <strong>"Failed to load"</strong> — explain: one user failed, others still
            work.
          </li>
          <li>
            <strong>Load log</strong> — step-by-step timeline of what happened.
          </li>
          <li>
            <strong>Core + Bonus</strong> tab → Dashboard — show the 3 bonus features.
          </li>
          <li>
            If they ask about code → open <code>hooks/useEnrichedUsers.ts</code> first.
          </li>
        </ol>
      </ExplainSectionCard>

      <ExplainSectionCard title="The story of one page load (simple)">
        <ol className="explain-list explain-list--ordered">
          <li>App opens → <code>useEnrichedUsers</code> runs automatically.</li>
          <li>It asks the API: "give me all users." If that fails → show error + Retry button.</li>
          <li>If users arrive → show the table right away (names, emails). Login cells say "Loading…".</li>
          <li>Then it fetches logins for 15 users at a time (not all 100 at once).</li>
          <li>For each user: get logins → pick the newest one → (bonus) look up country → update that row.</li>
          <li>Repeat until all users are done.</li>
        </ol>
      </ExplainSectionCard>

      <ExplainSectionCard title="index.html — the empty page">
        <p className="explain-text">
          This is the basic HTML page your browser opens. It has almost nothing in it — just a{' '}
          <code>&lt;div id="root"&gt;</code> where React will draw the whole app.
        </p>
        <p className="explain-text">
          It also loads <code>main.tsx</code> as a script. Think of it as the empty picture frame;
          React paints the picture inside.
        </p>
      </ExplainSectionCard>

      <ExplainSectionCard title="src/main.tsx — starts React">
        <p className="explain-text">
          This is the <strong>entry point</strong> — the first JavaScript file that runs.
        </p>
        <ul className="explain-list">
          <li>Finds the <code>root</code> div from index.html</li>
          <li>Puts the <code>App</code> component inside it</li>
          <li>
            <code>StrictMode</code> is a React helper that catches mistakes during development
          </li>
        </ul>
        <p className="explain-text">
          <strong>Say in interview:</strong> "main.tsx bootstraps the app — it mounts App into the
          DOM."
        </p>
      </ExplainSectionCard>

      <ExplainSectionCard title="src/App.tsx — the main screen">
        <p className="explain-text">
          This is the <strong>boss component</strong>. It controls the tabs and wires everything
          together.
        </p>
        <ul className="explain-list">
          <li>
            <strong>Core task / Core + Bonus</strong> — switches which features the table shows
          </li>
          <li>
            <strong>Explain / Dashboard / Load log / Interview prep</strong> — switches which panel
            you see
          </li>
          <li>
            Calls <code>useEnrichedUsers()</code> to load data — this hook does the real work
          </li>
          <li>
            Calls <code>useEventLog()</code> to record events for the Load log tab
          </li>
          <li>
            Counts inactive users and countries loaded (for the bonus Explain tab)
          </li>
        </ul>
        <p className="explain-text">
          <strong>Say in interview:</strong> "App.tsx is mostly layout and tabs. The data loading
          logic lives in the hook, not here."
        </p>
      </ExplainSectionCard>

      <ExplainSectionCard title="src/types.ts — what does the data look like?">
        <p className="explain-text">
          TypeScript <strong>types</strong> describe the shape of data — like a contract. They help
          catch mistakes.
        </p>
        <ul className="explain-list">
          <li>
            <code>User</code> — id, first_name, last_name, email (from /users API)
          </li>
          <li>
            <code>Login</code> — login_time and ip_v4 (one login record)
          </li>
          <li>
            <code>UserLogins</code> — user_id + array of logins
          </li>
          <li>
            <code>LoginStatus</code> — <code>"loading"</code>, <code>"success"</code>, or{' '}
            <code>"error"</code> for each row
          </li>
          <li>
            <code>EnrichedUser</code> — a User plus login fields and loginStatus. This is what each
            table row uses.
          </li>
        </ul>
        <p className="explain-text">
          <strong>Say in interview:</strong> "EnrichedUser is User plus the login info we fetch and
          add ourselves."
        </p>
      </ExplainSectionCard>

      <ExplainSectionCard title="src/types/events.ts — Load log event types">
        <p className="explain-text">
          Defines the events written to the Load log tab — things like "users loaded", "batch
          started", "batch completed".
        </p>
        <p className="explain-text">
          Each event has a title, detail text, stats, and a timestamp. Used only for the demo
          walkthrough, not for core functionality.
        </p>
      </ExplainSectionCard>

      <ExplainSectionCard title="src/api/client.ts — fetch with retry">
        <p className="explain-text">
          All API calls go through <code>fetchWithRetry</code>. This is how we handle the flaky API.
        </p>
        <ul className="explain-list">
          <li>
            Sends a request to <code>https://fake-users-api.vercel.app</code> + the path
          </li>
          <li>If it gets a 500 error → wait 500ms → try again (up to 3 retries)</li>
          <li>If the network fails → also retry</li>
          <li>If it is a different error (like 404) → fail immediately, no retry</li>
        </ul>
        <p className="explain-text">
          <strong>Say in interview:</strong> "I wrapped fetch in retry logic because the challenge
          says ~25% of requests fail with 500."
        </p>
      </ExplainSectionCard>

      <ExplainSectionCard title="src/api/users.ts — get users and logins">
        <p className="explain-text">Two simple functions that call the API:</p>
        <ul className="explain-list">
          <li>
            <code>getUsers()</code> → <code>GET /users</code> → returns list of users
          </li>
          <li>
            <code>getUserLogins(id)</code> → <code>GET /users/:id/relationships/logins</code> →
            returns that user's login history
          </li>
        </ul>
        <p className="explain-text">
          Both use <code>fetchWithRetry</code> from client.ts. This file is thin on purpose — just
          API endpoints.
        </p>
      </ExplainSectionCard>

      <ExplainSectionCard title="src/api/geo.ts — IP to country (bonus)">
        <p className="explain-text">
          After we have an IP address, this looks up the country using <code>ipwho.is</code>.
        </p>
        <ul className="explain-list">
          <li>
            <code>getCountryForIp(ip)</code> — calls the geo API, returns country name or null
          </li>
          <li>
            Uses a <code>Map</code> cache — if two users have the same IP, we only look it up once
          </li>
          <li>
            <code>clearCountryCache()</code> — clears cache on reload so data stays fresh
          </li>
          <li>If geo lookup fails → returns null, row shows "—". Does not break anything.</li>
        </ul>
      </ExplainSectionCard>

      <ExplainSectionCard title="src/hooks/useEnrichedUsers.ts — THE BRAIN">
        <p className="explain-text">
          <strong>This is the most important file.</strong> Open this when they ask "walk me through
          the code."
        </p>
        <p className="explain-text">What it does, step by step:</p>
        <ol className="explain-list explain-list--ordered">
          <li>
            <code>load()</code> runs on page load (and when you click Retry)
          </li>
          <li>Resets state — clears users, sets status to "loading"</li>
          <li>
            Calls <code>getUsers()</code> — if it fails, set status to "error" and stop
          </li>
          <li>
            Maps each user to an <code>EnrichedUser</code> with empty login fields and{' '}
            <code>loginStatus: "loading"</code>
          </li>
          <li>
            Sets status to "success" — table can now render
          </li>
          <li>
            Loops in <strong>batches of 15</strong> — for each batch, runs 15 login fetches in
            parallel
          </li>
          <li>
            Per user: <code>getUserLogins</code> → <code>getMostRecentLogin</code> →{' '}
            <code>getCountryForIp</code> → update that row
          </li>
          <li>If one user's login fails → that row gets <code>loginStatus: "error"</code></li>
          <li>
            <code>fetchIdRef</code> — a number that goes up each reload. Old requests check this
            and ignore themselves if you clicked Retry mid-load.
          </li>
        </ol>
        <p className="explain-text">
          <strong>Key numbers:</strong> batch size = 15, retries = 3, retry delay = 500ms.
        </p>
      </ExplainSectionCard>

      <ExplainSectionCard title="src/hooks/useEventLog.ts — the Load log">
        <p className="explain-text">
          Records a timeline of events while data loads. Powers the <strong>Load log</strong> tab
          for your demo.
        </p>
        <ul className="explain-list">
          <li>
            <code>beginRecording()</code> — starts fresh when page loads or Retry is clicked
          </li>
          <li>
            <code>recordEvent()</code> — adds one line to the log with a timestamp
          </li>
          <li>
            <code>copyNotes()</code> — copies the log to clipboard
          </li>
        </ul>
        <p className="explain-text">
          <code>useEnrichedUsers</code> calls <code>recordEvent</code> at each step (users fetched,
          batch started, batch done, etc.).
        </p>
      </ExplainSectionCard>

      <ExplainSectionCard title="src/utils/login.ts — small helpers">
        <p className="explain-text">Pure functions — no API calls, just data processing:</p>
        <ul className="explain-list">
          <li>
            <code>getMostRecentLogin(logins)</code> — loops through logins, returns the one with the
            newest date. API does <strong>not</strong> sort them for you.
          </li>
          <li>
            <code>formatLoginTimeHumanized</code> — "3 months ago" (bonus, uses date-fns)
          </li>
          <li>
            <code>formatLoginTimeExact</code> — full date like "7/5/2026, 12:00:00 PM"
          </li>
          <li>
            <code>isInactiveOverOneMonth</code> — true if last login was 1+ calendar months ago
          </li>
        </ul>
      </ExplainSectionCard>

      <ExplainSectionCard title="src/components/StatusBanner.tsx">
        <p className="explain-text">The box above the table. Shows one of three states:</p>
        <ul className="explain-list">
          <li>
            <strong>Loading</strong> — "Loading users…" (waiting for /users)
          </li>
          <li>
            <strong>Error</strong> — "Failed to load users" + Retry button
          </li>
          <li>
            <strong>Success</strong> — "100 users" + login progress "Loading login data… (45/100)"
          </li>
        </ul>
      </ExplainSectionCard>

      <ExplainSectionCard title="src/components/UserTable.tsx">
        <p className="explain-text">
          Draws the HTML table — headers and one <code>UserRow</code> per user.
        </p>
        <ul className="explain-list">
          <li>
            <code>variant="core"</code> — basic columns only
          </li>
          <li>
            <code>variant="bonus"</code> — adds Country column + legend for inactive users
          </li>
        </ul>
      </ExplainSectionCard>

      <ExplainSectionCard title="src/components/UserRow.tsx">
        <p className="explain-text">One row in the table. Shows different things based on status:</p>
        <ul className="explain-list">
          <li>
            <code>loading</code> → "Loading…" in login columns
          </li>
          <li>
            <code>error</code> → "Failed to load" in red
          </li>
          <li>
            <code>success</code> → actual login time and IP (or "No logins" if empty)
          </li>
          <li>Bonus: humanized date with exact date on hover, country column, inactive badge</li>
        </ul>
      </ExplainSectionCard>

      <ExplainSectionCard title="src/components/LoadLogPanel.tsx">
        <p className="explain-text">
          The Load log tab. Shows progress bar, latest event, full event list, Copy and Clear
          buttons.
        </p>
      </ExplainSectionCard>

      <ExplainSectionCard title="src/components/CoreTaskExplain.tsx & BonusTaskExplain.tsx">
        <p className="explain-text">
          The Explain tab content. Summarizes requirements and how the app solves them, plus live
          stats (user count, logins loaded, etc.).
        </p>
      </ExplainSectionCard>

      <ExplainSectionCard title="src/components/ExplainSectionCard.tsx">
        <p className="explain-text">
          A small reusable box with a title — used by all the Explain/Interview panels. Just UI
          wrapper, no logic.
        </p>
      </ExplainSectionCard>

      <ExplainSectionCard title="src/App.css & src/index.css — styling">
        <p className="explain-text">
          <code>index.css</code> — global colors, fonts, dark mode. <code>App.css</code> — layout
          for tabs, table, status banner, explain panels.
        </p>
        <p className="explain-text">
          Sitewire said don't focus on visual polish — these just make it readable.
        </p>
      </ExplainSectionCard>

      <ExplainSectionCard title="Simple Q&A — if they ask…">
        <dl className="explain-qa">
          <dt>Why load logins in batches of 15?</dt>
          <dd>
            If we fired 100 requests at once, the slow flaky API would struggle and you'd see nothing
            until all finish. Batches let rows fill in gradually.
          </dd>
          <dt>What if /users fails vs one login fails?</dt>
          <dd>
            /users fail = whole page error, no table. One login fail = just that row shows "Failed to
            load".
          </dd>
          <dt>How do you find the most recent login?</dt>
          <dd>
            Loop through the array and compare dates. The API sends logins in random order.
          </dd>
          <dt>What is a hook?</dt>
          <dd>
            A React function that holds state and logic. useEnrichedUsers holds users, loading status,
            and the load function.
          </dd>
          <dt>Why not use a library like React Query?</dt>
          <dd>
            For this small app I wanted the retry and batch logic visible in my code. In a real job
            I'd probably use a data-fetching library.
          </dd>
          <dt>What is fetchIdRef?</dt>
          <dd>
            A counter. Each reload bumps it. Old network responses check "am I still the latest
            reload?" and bail if not.
          </dd>
        </dl>
      </ExplainSectionCard>

      <div className="explain-panel__actions">
        <button type="button" onClick={() => void copyAllNotes()}>
          Copy short notes
        </button>
      </div>
    </div>
  )
}
