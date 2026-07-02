const countryCache = new Map<string, string | null>()

type IpWhoResponse = {
  success?: boolean
  country?: string
}

export async function getCountryForIp(ip: string): Promise<string | null> {
  const cached = countryCache.get(ip)
  if (cached !== undefined) return cached

  try {
    const response = await fetch(`https://ipwho.is/${ip}`)

    if (!response.ok) {
      countryCache.set(ip, null)
      return null
    }

    const data = (await response.json()) as IpWhoResponse
    const country = data.success && data.country ? data.country : null
    countryCache.set(ip, country)
    return country
  } catch {
    countryCache.set(ip, null)
    return null
  }
}

export function clearCountryCache() {
  countryCache.clear()
}
