import { useCallback, useEffect, useRef, useState } from 'react'
import { getUsers, getUserLogins } from '../api/users'
import { getMostRecentLogin } from '../utils/login'
import type { EnrichedUser, LoginStatus, UsersLoadStatus } from '../types'
import type { LoadEventInput } from '../types/events'

const BATCH_SIZE = 15

type LoginFetchResult = {
  userId: number
  loginStatus: LoginStatus
  lastLoginTime: string | null
  lastLoginIp: string | null
}

type UseEnrichedUsersOptions = {
  onEvent?: (event: Omit<LoadEventInput, 'elapsedMs'> & { elapsedMs?: number }) => void
  onLoadStart?: () => void
}

export function useEnrichedUsers(options: UseEnrichedUsersOptions = {}) {
  const { onEvent, onLoadStart } = options
  const [usersStatus, setUsersStatus] = useState<UsersLoadStatus>('loading')
  const [users, setUsers] = useState<EnrichedUser[]>([])
  const [usersError, setUsersError] = useState<string | null>(null)
  const [loginsLoaded, setLoginsLoaded] = useState(0)
  const [loginsTotal, setLoginsTotal] = useState(0)
  const fetchIdRef = useRef(0)
  const loadStartRef = useRef(0)

  const emit = useCallback(
    (event: Omit<LoadEventInput, 'elapsedMs'> & { elapsedMs?: number }) => {
      onEvent?.({
        ...event,
        elapsedMs: event.elapsedMs ?? performance.now() - loadStartRef.current,
      })
    },
    [onEvent],
  )

  const load = useCallback(async () => {
    const fetchId = ++fetchIdRef.current
    loadStartRef.current = performance.now()
    onLoadStart?.()

    setUsersStatus('loading')
    setUsersError(null)
    setUsers([])
    setLoginsLoaded(0)
    setLoginsTotal(0)

    emit({
      type: 'refresh_started',
      title: 'Page load / refresh started',
      detail: 'useEnrichedUsers called load(). State reset to loading.',
      stats: 'usersStatus=loading · users=[] · loginsLoaded=0',
    })

    emit({
      type: 'users_fetching',
      title: 'Fetching all users',
      detail: 'GET /users — single request with up to 3 retries on 500 errors.',
      stats: '1 API call in flight',
    })

    try {
      const rawUsers = await getUsers()
      if (fetchId !== fetchIdRef.current) return

      const enriched: EnrichedUser[] = rawUsers.map((user) => ({
        ...user,
        lastLoginTime: null,
        lastLoginIp: null,
        loginStatus: 'loading',
      }))

      setUsers(enriched)
      setUsersStatus('success')
      setLoginsTotal(enriched.length)

      emit({
        type: 'users_loaded',
        title: `${enriched.length} users loaded — table visible`,
        detail:
          'Users list is on screen. Login columns show "Loading…". Batched login fetch begins next.',
        stats: `usersStatus=success · users.length=${enriched.length} · loginsLoaded=0/${enriched.length}`,
      })

      const totalBatches = Math.ceil(enriched.length / BATCH_SIZE)

      for (let i = 0; i < enriched.length; i += BATCH_SIZE) {
        if (fetchId !== fetchIdRef.current) return

        const batch = enriched.slice(i, i + BATCH_SIZE)
        const batchNumber = Math.floor(i / BATCH_SIZE) + 1
        const batchStart = batch[0]?.id ?? i + 1
        const batchEnd = batch[batch.length - 1]?.id ?? i + batch.length

        emit({
          type: 'batch_started',
          title: `Batch ${batchNumber}/${totalBatches} started`,
          detail: `Fetching logins for users ${batchStart}–${batchEnd} (${BATCH_SIZE} parallel requests).`,
          stats: `${BATCH_SIZE} concurrent GET /users/:id/relationships/logins`,
        })

        const results: LoginFetchResult[] = await Promise.all(
          batch.map(async (user) => {
            try {
              const data = await getUserLogins(user.id)
              const latest = getMostRecentLogin(data.logins)

              return {
                userId: user.id,
                loginStatus: 'success',
                lastLoginTime: latest?.login_time ?? null,
                lastLoginIp: latest?.ip_v4 ?? null,
              }
            } catch {
              return {
                userId: user.id,
                loginStatus: 'error',
                lastLoginTime: null,
                lastLoginIp: null,
              }
            }
          }),
        )

        if (fetchId !== fetchIdRef.current) return

        const batchSuccess = results.filter((result) => result.loginStatus === 'success').length
        const batchErrors = results.length - batchSuccess
        const nextLoaded = Math.min(i + batch.length, enriched.length)

        const resultsByUserId = new Map(results.map((result) => [result.userId, result]))

        setUsers((prev) =>
          prev.map((user) => {
            const result = resultsByUserId.get(user.id)
            if (!result) return user

            return {
              ...user,
              loginStatus: result.loginStatus,
              lastLoginTime: result.lastLoginTime,
              lastLoginIp: result.lastLoginIp,
            }
          }),
        )

        setLoginsLoaded(nextLoaded)

        emit({
          type: 'batch_completed',
          title: `Batch ${batchNumber}/${totalBatches} complete`,
          detail: `Updated rows ${batchStart}–${batchEnd}. ${batchSuccess} succeeded, ${batchErrors} failed this batch.`,
          stats: `loginsLoaded=${nextLoaded}/${enriched.length}`,
        })
      }

      if (fetchId !== fetchIdRef.current) return

      emit({
        type: 'all_completed',
        title: 'All login batches finished',
        detail: 'Every user row is now success or error. No more login requests in flight.',
        stats: `loginsLoaded=${enriched.length}/${enriched.length}`,
      })
    } catch (error) {
      if (fetchId !== fetchIdRef.current) return

      const message = error instanceof Error ? error.message : 'Failed to load users'
      setUsersStatus('error')
      setUsersError(message)

      emit({
        type: 'users_failed',
        title: 'Failed to load users',
        detail: message,
        stats: 'usersStatus=error · table hidden · Retry available',
      })
    }
  }, [emit, onLoadStart])

  useEffect(() => {
    void load()
  }, [load])

  const loginsLoading = usersStatus === 'success' && loginsLoaded < loginsTotal
  const loginSuccessCount = users.filter((user) => user.loginStatus === 'success').length
  const loginErrorCount = users.filter((user) => user.loginStatus === 'error').length

  return {
    users,
    usersStatus,
    usersError,
    loginsLoaded,
    loginsTotal,
    loginsLoading,
    loginSuccessCount,
    loginErrorCount,
    reload: load,
  }
}
