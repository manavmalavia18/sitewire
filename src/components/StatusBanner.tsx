import type { UsersLoadStatus } from '../types'

type StatusBannerProps = {
  usersStatus: UsersLoadStatus
  usersError: string | null
  userCount: number
  loginsLoaded: number
  loginsTotal: number
  loginsLoading: boolean
  onRetry: () => void
}

export function StatusBanner({
  usersStatus,
  usersError,
  userCount,
  loginsLoaded,
  loginsTotal,
  loginsLoading,
  onRetry,
}: StatusBannerProps) {
  if (usersStatus === 'loading') {
    return <p className="status status--loading">Loading users…</p>
  }

  if (usersStatus === 'error') {
    return (
      <div className="status status--error">
        <p>Failed to load users: {usersError}</p>
        <button type="button" onClick={onRetry}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="status status--success">
      <p>
        <strong>{userCount}</strong> users
      </p>
      {loginsLoading && (
        <p className="status__progress">
          Loading login data… ({loginsLoaded}/{loginsTotal})
        </p>
      )}
      {!loginsLoading && loginsTotal > 0 && <p>All login data loaded.</p>}
    </div>
  )
}
