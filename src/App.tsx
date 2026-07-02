import { useState } from 'react'
import './App.css'
import { ExplainPanel } from './components/ExplainPanel'
import { StatusBanner } from './components/StatusBanner'
import { UserTable } from './components/UserTable'
import { useEnrichedUsers } from './hooks/useEnrichedUsers'
import { useEventLog } from './hooks/useEventLog'

type Tab = 'core' | 'bonus' | 'explain'

function App() {
  const [tab, setTab] = useState<Tab>('core')
  const { events, beginRecording, recordEvent, clearEvents, copyNotes } = useEventLog()

  const {
    users,
    usersStatus,
    usersError,
    loginsLoaded,
    loginsTotal,
    loginsLoading,
    loginSuccessCount,
    loginErrorCount,
    reload,
  } = useEnrichedUsers({
    onLoadStart: beginRecording,
    onEvent: recordEvent,
  })

  function handleReload() {
    beginRecording()
    reload()
  }

  const statusBanner = (
    <StatusBanner
      usersStatus={usersStatus}
      usersError={usersError}
      userCount={users.length}
      loginsLoaded={loginsLoaded}
      loginsTotal={loginsTotal}
      loginsLoading={loginsLoading}
      onRetry={handleReload}
    />
  )

  return (
    <main className="app">
      <header>
        <h1>Users Dashboard</h1>
        <p className="subtitle">Sitewire coding challenge</p>
      </header>

      <div className="tabs" role="tablist" aria-label="Dashboard views">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'core'}
          className={tab === 'core' ? 'tabs__btn tabs__btn--active' : 'tabs__btn'}
          onClick={() => setTab('core')}
        >
          Core task
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'bonus'}
          className={tab === 'bonus' ? 'tabs__btn tabs__btn--active' : 'tabs__btn'}
          onClick={() => setTab('bonus')}
        >
          Bonus
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'explain'}
          className={tab === 'explain' ? 'tabs__btn tabs__btn--active' : 'tabs__btn'}
          onClick={() => setTab('explain')}
        >
          Explain this load
        </button>
      </div>

      {tab === 'core' && (
        <div role="tabpanel">
          <p className="tab-intro">
            Core challenge — user ID, name, email, last login time, last login IP, and total user
            count. Handles flaky API with retries, batching, and per-row states.
          </p>
          {statusBanner}
          {usersStatus === 'success' && <UserTable users={users} variant="core" />}
        </div>
      )}

      {tab === 'bonus' && (
        <div role="tabpanel">
          <p className="tab-intro">
            Bonus features — humanized login times, country from IP, and inactive user highlighting.
          </p>
          {statusBanner}
          {usersStatus === 'success' && <UserTable users={users} variant="bonus" />}
        </div>
      )}

      {tab === 'explain' && (
        <div role="tabpanel">
          <ExplainPanel
            users={users}
            events={events}
            usersStatus={usersStatus}
            userCount={users.length}
            loginsLoaded={loginsLoaded}
            loginsTotal={loginsTotal}
            loginsLoading={loginsLoading}
            loginSuccessCount={loginSuccessCount}
            loginErrorCount={loginErrorCount}
            onCopy={copyNotes}
            onClear={clearEvents}
          />
        </div>
      )}
    </main>
  )
}

export default App
