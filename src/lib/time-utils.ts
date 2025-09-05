import type { DayPhase } from '@/types'

// Format a Date into HH:mm for a given time zone (24h)
export function formatHHmm(instant: Date, tz: string): string {
  return new Intl.DateTimeFormat(undefined, {
    timeZone: tz,
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  }).format(instant)
}

// Get minutes since midnight for a given zone at a specific instant.
export function minutesSinceMidnight(instant: Date, tz: string): number {
  const parts = new Intl.DateTimeFormat(undefined, {
    timeZone: tz,
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  }).formatToParts(instant)
  const hh = Number(parts.find(p => p.type === 'hour')?.value ?? '0')
  const mm = Number(parts.find(p => p.type === 'minute')?.value ?? '0')
  return hh * 60 + mm
}

// Your specified buckets with non-overlapping minute edges.
export function classifyPhaseAt(instant: Date, tz: string): DayPhase {
  const m = minutesSinceMidnight(instant, tz)
  if (m <= 7 * 60 + 59) return 'sleep'        // 00:00–07:59
  if (m <= 8 * 60 + 59) return 'early'        // 08:00–08:59
  if (m <= 17 * 60 + 59) return 'day'         // 09:00–17:59
  if (m <= 21 * 60 + 30) return 'evening'     // 18:00–21:30
  return 'night'                               // 21:31–23:59
}

// Build a "what-if" baseline instant in the USER'S local day from "HH:mm".
export function localBaselineFromHHmm(hhmm: string): Date {
  const [hh, mm] = hhmm.split(':').map(Number)
  const d = new Date()
  d.setHours(hh, mm, 0, 0) // This yields the correct absolute instant for user's local time
  return d
}

// Legacy function for backward compatibility
export function classifyPhase(d: Date): DayPhase {
  return classifyPhaseAt(d, Intl.DateTimeFormat().resolvedOptions().timeZone)
}

export function formatTimeInTimezone(date: Date, timezone: string): string {
  return formatHHmm(date, timezone)
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6 // Sunday = 0, Saturday = 6
}

// Check if a time is within business hours (09:00 - 18:00)
export function isBusinessHours(instant: Date, tz: string): boolean {
  const m = minutesSinceMidnight(instant, tz)
  return m >= 9 * 60 && m <= 18 * 60 // 09:00–18:00
}

// Check if a time is early morning (07:00 - 08:59)
export function isEarlyMorning(instant: Date, tz: string): boolean {
  const m = minutesSinceMidnight(instant, tz)
  return m >= 7 * 60 && m <= 8 * 60 + 59 // 07:00–08:59
}

// Check if a time is evening (18:00 - 21:30)
export function isEvening(instant: Date, tz: string): boolean {
  const m = minutesSinceMidnight(instant, tz)
  return m >= 18 * 60 && m <= 21 * 60 + 30 // 18:00–21:30
}
