export type LoadEventType =
  | 'refresh_started'
  | 'users_fetching'
  | 'users_loaded'
  | 'batch_started'
  | 'batch_completed'
  | 'all_completed'
  | 'users_failed'

export interface LoadEvent {
  id: string
  type: LoadEventType
  elapsedMs: number
  elapsedLabel: string
  title: string
  detail: string
  stats: string
}

export type LoadEventInput = Omit<LoadEvent, 'id' | 'elapsedLabel'> & {
  elapsedMs: number
}
