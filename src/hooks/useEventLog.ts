import { useCallback, useRef, useState } from 'react'
import type { LoadEvent, LoadEventInput } from '../types/events'

function formatElapsed(ms: number): string {
  const rounded = Math.max(0, Math.round(ms))
  if (rounded < 1000) return `${rounded}ms`
  const sec = rounded / 1000
  if (sec < 60) return `${sec.toFixed(1)}s`
  const minutes = Math.floor(sec / 60)
  const seconds = Math.round(sec % 60)
  return `${minutes}m ${seconds}s`
}

export function useEventLog() {
  const [events, setEvents] = useState<LoadEvent[]>([])
  const loadStartRef = useRef<number | null>(null)
  const eventCounter = useRef(0)

  const beginRecording = useCallback(() => {
    loadStartRef.current = performance.now()
    eventCounter.current = 0
    setEvents([])
  }, [])

  const recordEvent = useCallback((input: Omit<LoadEventInput, 'elapsedMs'> & { elapsedMs?: number }) => {
    if (loadStartRef.current === null) {
      loadStartRef.current = performance.now()
    }

    const elapsedMs = input.elapsedMs ?? performance.now() - loadStartRef.current
    const event: LoadEvent = {
      id: `${++eventCounter.current}`,
      type: input.type,
      elapsedMs,
      elapsedLabel: formatElapsed(elapsedMs),
      title: input.title,
      detail: input.detail,
      stats: input.stats,
    }

    setEvents((prev) => [...prev, event])
  }, [])

  const clearEvents = useCallback(() => {
    setEvents([])
    loadStartRef.current = null
    eventCounter.current = 0
  }, [])

  const copyNotes = useCallback(async () => {
    const text = events
      .map(
        (event) =>
          `[${event.elapsedLabel}] ${event.title}\n  ${event.detail}\n  Stats: ${event.stats}`,
      )
      .join('\n\n')

    await navigator.clipboard.writeText(
      `Sitewire Users Dashboard — load recording\n${'='.repeat(40)}\n\n${text}`,
    )
  }, [events])

  return {
    events,
    beginRecording,
    recordEvent,
    clearEvents,
    copyNotes,
  }
}
