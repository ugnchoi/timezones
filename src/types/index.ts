export type City = {
  id: string              // stable key (e.g., geocoding id or slug)
  name: string            // "London"
  country?: string        // "United Kingdom"
  lat: number
  lon: number
  tz: string              // IANA zone, e.g., "Europe/London"
  builtIn?: boolean       // default-seeded
}

export type DayPhase = 'sleep' | 'early' | 'day' | 'evening' | 'night'

export type CurrentWeather = {
  temperatureC: number    // °C
  precipMm?: number       // mm
  precipProbability?: number // %
  code?: number           // optional weather code (e.g., for future icon use)
  observedAtISO: string   // ISO 8601 timestamp from API
}

export type AppState = {
  cities: City[]
  myLocal: { tz: string }       // resolved from Intl at runtime
  nowOverrideISO?: string | null // "what-if" local datetime (ISO) or null for real now
}

// For search dialog
export type GeoSearchResult = {
  id: string       // from geocoder
  name: string     // "Paris"
  country?: string // "France"
  lat: number
  lon: number
  tz: string
}

// API Layer responses (normalized)
export type IpLocation = {
  city?: string
  lat: number
  lon: number
  tz: string
}

export type FetchState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }
