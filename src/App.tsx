import { useState } from 'react'
import './App.css'
import { BonusTaskExplain } from './components/BonusTaskExplain'
import { CoreTaskExplain } from './components/CoreTaskExplain'
import { InterviewPrep } from './components/InterviewPrep'
import { LoadLogPanel } from './components/LoadLogPanel'
import { StatusBanner } from './components/StatusBanner'
import { UserTable } from './components/UserTable'
import { useEnrichedUsers } from './hooks/useEnrichedUsers'
import { useEventLog } from './hooks/useEventLog'
import { isInactiveOverOneMonth } from './utils/login'

type Mode = 'core' | 'bonus'
type View = 'explain' | 'dashboard' | 'load' | 'prep'

function App() {
  const [mode, setMode] = useState<Mode>('core')
  const [view, setView] = useState<View>('explain')
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

  function switchMode(next: Mode) {
    setMode(next)
    setView('explain')
  }

  const inactiveCount = users.filter(
    (user) =>
      user.loginStatus === 'success' &&
      user.lastLoginTime !== null &&
      isInactiveOverOneMonth(user.lastLoginTime),
  ).length

  const countriesLoaded = users.filter((user) => user.lastLoginCountry).length

  return (
    <main className="app">
      <header>
        <h1>Users Dashboard</h1>
        <p className="subtitle">Sitewire coding challenge</p>
      </header>

      <div className="tabs" role="tablist" aria-label="Task mode">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'core'}
          className={mode === 'core' ? 'tabs__btn tabs__btn--active' : 'tabs__btn'}
          onClick={() => switchMode('core')}
        >
          Core task
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'bonus'}
          className={mode === 'bonus' ? 'tabs__btn tabs__btn--active' : 'tabs__btn'}
          onClick={() => switchMode('bonus')}
        >
          Core task + Bonus
        </button>
      </div>

      <div className="task-panel">
        <div className="sub-tabs" role="tablist" aria-label="Task views">
          <button
            type="button"
            role="tab"
            aria-selected={view === 'explain'}
            className={view === 'explain' ? 'sub-tabs__btn sub-tabs__btn--active' : 'sub-tabs__btn'}
            onClick={() => setView('explain')}
          >
            Explain
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === 'dashboard'}
            className={
              view === 'dashboard' ? 'sub-tabs__btn sub-tabs__btn--active' : 'sub-tabs__btn'
            }
            onClick={() => setView('dashboard')}
          >
            Dashboard
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === 'load'}
            className={view === 'load' ? 'sub-tabs__btn sub-tabs__btn--active' : 'sub-tabs__btn'}
            onClick={() => setView('load')}
          >
            Load log
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === 'prep'}
            className={view === 'prep' ? 'sub-tabs__btn sub-tabs__btn--active' : 'sub-tabs__btn'}
            onClick={() => setView('prep')}
          >
            Interview prep
          </button>
        </div>

        {view === 'explain' && (
          <div role="tabpanel">
            {mode === 'core' ? (
              <CoreTaskExplain
                usersStatus={usersStatus}
                userCount={users.length}
                loginsLoaded={loginsLoaded}
                loginsTotal={loginsTotal}
                loginSuccessCount={loginSuccessCount}
                loginErrorCount={loginErrorCount}
              />
            ) : (
              <BonusTaskExplain
                inactiveCount={inactiveCount}
                countriesLoaded={countriesLoaded}
              />
            )}
          </div>
        )}

        {view === 'dashboard' && (
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
            {usersStatus === 'success' && (
              <UserTable users={users} variant={mode === 'core' ? 'core' : 'bonus'} />
            )}
          </div>
        )}

        {view === 'prep' && (
          <div role="tabpanel">
            <InterviewPrep />
          </div>
        )}

        {view === 'load' && (
          <div role="tabpanel">
            <LoadLogPanel
              events={events}
              loginsLoaded={loginsLoaded}
              loginsTotal={loginsTotal}
              loginsLoading={loginsLoading}
              onCopy={copyNotes}
              onClear={clearEvents}
            />
          </div>
        )}
      </div>
    </main>
  )
}

export default App
