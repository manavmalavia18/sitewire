import { useState } from 'react'
import './App.css'
import { ExplainPanel } from './components/ExplainPanel'
import { StatusBanner } from './components/StatusBanner'
import { UserTable } from './components/UserTable'
import { useEnrichedUsers } from './hooks/useEnrichedUsers'
import { useEventLog } from './hooks/useEventLog'

type Tab = 'dashboard' | 'explain'

function App() {
  const [tab, setTab] = useState<Tab>('dashboard')
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
          aria-selected={tab === 'dashboard'}
          className={tab === 'dashboard' ? 'tabs__btn tabs__btn--active' : 'tabs__btn'}
          onClick={() => setTab('dashboard')}
        >
          Dashboard
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

      {tab === 'dashboard' && (
        <div role="tabpanel">
          <StatusBanner
            usersStatus={usersStatus}
            usersError={usersError}
            userCount={users.length}
            loginsLoaded={loginsLoaded}
            loginsTotal={loginsTotal}
            loginsLoading={loginsLoading}
            onRetry={handleReload}
          />
          {usersStatus === 'success' && <UserTable users={users} />}
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
