import * as React from 'react'

const KEY = 'timeweather:baselineISO'

export function useBaselineInstant() {
  const [overrideISO, setOverrideISO] = React.useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(KEY)
  })

  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (overrideISO) localStorage.setItem(KEY, overrideISO)
    else localStorage.removeItem(KEY)
  }, [overrideISO])

  const instant = React.useMemo(() => {
    // Use a consistent initial time to avoid hydration mismatch
    if (!mounted) {
      return new Date('2024-01-01T12:00:00.000Z') // Fixed time for SSR
    }
    return overrideISO ? new Date(overrideISO) : new Date()
  }, [overrideISO, mounted])

  const setByLocalTimeHHmm = (hhmm: string) => {
    const [hh, mm] = hhmm.split(':').map(Number)
    const d = new Date()
    d.setHours(hh, mm, 0, 0)
    setOverrideISO(d.toISOString())
  }

  const reset = () => setOverrideISO(null)

  return { instant, overrideISO, setOverrideISO, setByLocalTimeHHmm, reset }
}
