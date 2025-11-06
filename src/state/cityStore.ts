import * as React from 'react'
import type { AppState, City } from '@/types'

const STORAGE_KEY = 'timeweather:v1'

function loadInitial(): Pick<AppState, 'cities'> {
  if (typeof window === 'undefined') return { cities: [] }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { cities: [] }
    const parsed = JSON.parse(raw)
    return { cities: Array.isArray(parsed.cities) ? parsed.cities : [] }
  } catch {
    return { cities: [] }
  }
}

export function useCityStore(seedDefaults?: City[]) {
  const [cities, setCities] = React.useState<City[]>(() => {
    // Always start with seedDefaults to ensure consistent SSR
    return seedDefaults ?? []
  })

  // Load from localStorage after mount to avoid hydration issues
  React.useEffect(() => {
    const { cities: storedCities } = loadInitial()
    if (storedCities.length > 0) {
      setCities(storedCities)
    }
  }, [])

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ cities }))
  }, [cities])

  const addCity = React.useCallback((c: City) => {
    setCities(prev => (prev.some(x => x.id === c.id) ? prev : [...prev, c]))
  }, [])

  const removeCity = React.useCallback((id: string) => {
    setCities(prev => prev.filter(c => c.id !== id))
  }, [])

  return { cities, setCities, addCity, removeCity }
}
