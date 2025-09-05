import { getJSON } from '@/lib/http'
import type { CurrentWeather, GeoSearchResult, IpLocation } from '@/types'


// --- Fetchers (can be swapped or proxied) ---

export async function fetchIpLocation(signal?: AbortSignal): Promise<IpLocation> {
  const j = await getJSON<{
    city?: string
    latitude: number
    longitude: number
    timezone: string
  }>('https://ipapi.co/json/', { signal })
  return {
    city: j.city,
    lat: Number(j.latitude),
    lon: Number(j.longitude),
    tz: String(j.timezone),
  }
}

export async function searchCitiesByName(query: string, signal?: AbortSignal): Promise<GeoSearchResult[]> {
  if (!query?.trim()) return []
  const url = new URL('https://geocoding-api.open-meteo.com/v1/search')
  url.searchParams.set('name', query)
  url.searchParams.set('count', '5')
  url.searchParams.set('language', 'en')
  const j = await getJSON<any>(url.toString(), { signal })
  return (j.results ?? []).map((r: any) => ({
    id: String(r.id ?? `${r.name}-${r.country_code}-${r.latitude}-${r.longitude}`),
    name: r.name,
    country: r.country,
    lat: r.latitude,
    lon: r.longitude,
    tz: r.timezone, // provided by Open-Meteo geocoder
  }))
}

export async function fetchCurrentWeather(lat: number, lon: number, signal?: AbortSignal): Promise<CurrentWeather> {
  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.set('latitude', String(lat))
  url.searchParams.set('longitude', String(lon))
  url.searchParams.set('current', 'temperature_2m,precipitation,precipitation_probability,weather_code')
  url.searchParams.set('temperature_unit', 'celsius')
  url.searchParams.set('precipitation_unit', 'mm')
  url.searchParams.set('timezone', 'auto')
  const j = await getJSON<any>(url.toString(), { signal })
  const c = j.current ?? {}
  return {
    temperatureC: Number(c.temperature_2m ?? NaN),
    precipMm: c.precipitation != null ? Number(c.precipitation) : undefined,
    precipProbability: c.precipitation_probability != null ? Number(c.precipitation_probability) : undefined,
    code: c.weather_code != null ? Number(c.weather_code) : undefined,
    observedAtISO: String(c.time ?? new Date().toISOString()),
  }
}
