const BASE_URL = 'https://fake-users-api.vercel.app'

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function fetchWithRetry<T>(
  path: string,
  maxRetries = 3,
  retryDelayMs = 500,
): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(`${BASE_URL}${path}`)

      if (response.ok) {
        return (await response.json()) as T
      }

      if (response.status === 500 && attempt < maxRetries) {
        await sleep(retryDelayMs)
        continue
      }

      throw new Error(`Request failed with status ${response.status}`)
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error')

      if (attempt < maxRetries) {
        await sleep(retryDelayMs)
        continue
      }
    }
  }

  throw lastError ?? new Error('Request failed')
}
