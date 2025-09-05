import {
  useQuery,
  useQueries,
  useQueryClient,
  queryOptions,
  type UseQueryResult,
} from '@tanstack/react-query'
import { qk } from '@/lib/queryKeys'
import { fetchIpLocation, searchCitiesByName, fetchCurrentWeather } from '@/lib/api'
import type { CurrentWeather, GeoSearchResult, IpLocation } from '@/types'

// ---- IP location (rarely changes) ----
export const ipLocationQuery = queryOptions({
  queryKey: qk.ipLocal,
  queryFn: ({ signal }) => fetchIpLocation(signal),
  staleTime: 12 * 60 * 60 * 1000, // 12h
  gcTime: 24 * 60 * 60 * 1000,    // 24h
})

export function useIpLocation() {
  return useQuery(ipLocationQuery)
}

// ---- City search (debounced input -> query enabled when q.length>1) ----
export const geoSearchQuery = (q: string) => queryOptions({
  queryKey: qk.geoSearch(q),
  queryFn: ({ signal }) => searchCitiesByName(q, signal),
  enabled: q.trim().length > 1,     // off for empty/short strings
  staleTime: 60 * 60 * 1000,        // 1h: city metadata is stable
  gcTime: 6 * 60 * 60 * 1000,       // 6h
  retry: 1,
})

export function useGeoSearch(q: string) {
  return useQuery(geoSearchQuery(q))
}

// ---- Weather per city (fresh enough, auto-refresh) ----
export const weatherQuery = (lat: number, lon: number) => queryOptions({
  queryKey: qk.weather(lat, lon),
  queryFn: ({ signal }) => fetchCurrentWeather(lat, lon, signal),
  staleTime: 5 * 60 * 1000,                 // 5m: "fresh window"
  gcTime: 30 * 60 * 1000,                   // 30m cached
  refetchOnWindowFocus: true,               // only if stale
  refetchInterval: 5 * 60 * 1000,           // gently refresh if user stays
  refetchIntervalInBackground: false,       // skip when tab not focused
  retry: 2,
  retryDelay: (attempt) => Math.min(1500 * 2 ** attempt, 8000),
})

// Hook for a single city
export function useWeather(lat: number, lon: number) {
  return useQuery(weatherQuery(lat, lon))
}

// Hook for many cities in parallel (optional alternative to per-row fetching)
export function useWeatherForCities(
  coords: Array<{ lat: number; lon: number }>
): UseQueryResult<CurrentWeather, Error>[] {
  return useQueries({
    queries: coords.map(({ lat, lon }) => weatherQuery(lat, lon)),
  })
}

// Prefetch helpers (for SSR or instant add-city UX)
export function usePrefetchWeather() {
  const qc = useQueryClient()
  return (lat: number, lon: number) => qc.prefetchQuery(weatherQuery(lat, lon))
}
