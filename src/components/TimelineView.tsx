"use client"

import { formatHHmm } from "@/lib/time-utils"
import type { City } from "@/types"

interface TimelineViewProps {
  cities: City[]
  instant: Date
}

const MINUTES_IN_DAY = 24 * 60

const minutesToPercent = (minutes: number): number => {
  if (minutes <= 0) return 0
  if (minutes >= MINUTES_IN_DAY) return 100
  return (minutes / MINUTES_IN_DAY) * 100
}

const getLocalMinutes = (instant: Date, tz: string): number => {
  const time = formatHHmm(instant, tz)
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

export function TimelineView({ cities, instant }: TimelineViewProps) {
  const rows = cities
    .map((city) => {
      const currentMinutes = getLocalMinutes(instant, city.tz)
      const currentPercent = minutesToPercent(currentMinutes)

      // Working hours band (09:00 - 18:00) in local time
      const workStartMinutes = 9 * 60
      const workEndMinutes = 18 * 60
      const workStartPercent = minutesToPercent(workStartMinutes)
      const workWidthPercent = minutesToPercent(workEndMinutes) - workStartPercent

      return {
        city,
        currentHHmm: formatHHmm(instant, city.tz),
        currentPercent,
        workStartPercent,
        workWidthPercent,
      }
    })
    // Keep the simple, readable ordering: by city name
    .sort((a, b) => a.city.name.localeCompare(b.city.name))

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="text-center">
        <h2 className="mb-2 text-lg font-semibold text-foreground sm:text-xl">Working Hours Band</h2>
        <p className="text-xs text-muted-foreground sm:text-sm">
          Each row shows the local time marker and working-hours band (09:00–18:00)
        </p>
      </div>

      {/* Simple 24h scale */}
      <div className="px-1.5 sm:px-2">
        <div className="relative h-5 select-none sm:h-6">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-border" />
          <div className="absolute left-0 -translate-x-1/2 -top-1 text-[10px] text-muted-foreground">00</div>
          <div className="absolute left-[25%] -translate-x-1/2 -top-1 text-[10px] text-muted-foreground">06</div>
          <div className="absolute left-1/2 -translate-x-1/2 -top-1 text-[10px] text-muted-foreground">12</div>
          <div className="absolute left-[75%] -translate-x-1/2 -top-1 text-[10px] text-muted-foreground">18</div>
          <div className="absolute right-0 translate-x-1/2 -top-1 text-[10px] text-muted-foreground">24</div>
        </div>
      </div>

      <div className="space-y-3">
        {rows.map(({ city, currentHHmm, currentPercent, workStartPercent, workWidthPercent }) => (
          <div
            key={city.name}
            className="rounded-lg border border-border bg-card p-3 sm:p-4"
            role="group"
            aria-label={`${city.name} timeline`}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-base font-medium text-foreground sm:text-lg">{city.name}</div>
                <div className="text-[11px] text-muted-foreground sm:text-xs">{city.country}</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-lg font-bold text-foreground sm:text-xl" aria-label="Current local time">
                  {currentHHmm}
                </div>
                <div className="text-[11px] text-muted-foreground sm:text-xs">
                  Local time now
                </div>
              </div>
            </div>

            {/* Track */}
            <div className="relative h-6 sm:h-8">
              {/* Base track */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 rounded-full bg-muted" />

              {/* Working band (09:00 - 18:00) */}
              <div
                className="absolute top-1/2 -translate-y-1/2 h-2 rounded-full bg-primary/25"
                style={{ left: `${workStartPercent}%`, width: `${workWidthPercent}%` }}
                aria-label="Working hours band"
              />

              {/* Current time marker */}
              <div
                className="absolute top-0 bottom-0 w-[2px] bg-primary"
                style={{ left: `${currentPercent}%` }}
                aria-label="Current time marker"
              />
            </div>
          </div>
        ))}
      </div>

      {cities.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🌍</div>
          <p className="text-muted-foreground">Add some cities to see the working-hours band</p>
        </div>
      )}
    </div>
  )
}
