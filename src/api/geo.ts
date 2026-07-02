const countryCache = new Map<string, string | null>()

export async function getCountryForIp(ip: string): Promise<string | null> {
  const cached = countryCache.get(ip)
  if (cached !== undefined) return cached

  try {
    const response = await fetch(`https://ipapi.co/${ip}/country_name/`)

    if (!response.ok) {
      countryCache.set(ip, null)
      return null
    }

    const country = (await response.text()).trim()
    const value = country.length > 0 ? country : null
    countryCache.set(ip, value)
    return value
  } catch {
    countryCache.set(ip, null)
    return null
  }
}

export function clearCountryCache() {
  countryCache.clear()
}
