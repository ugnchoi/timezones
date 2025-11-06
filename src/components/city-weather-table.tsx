"use client"

import { Clock, Cloud, CloudRain, Sun, CloudSnow, Moon, Coffee, Sunset, LucideIcon, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { City, CurrentWeather, DayPhase } from "@/types"
import { classifyPhase, formatTimeInTimezone, isWeekend } from "@/lib/time-utils"
import { getMockWeather } from "@/data/mock-weather"
import { Button } from "@/components/ui/button"

interface CityWeatherTableProps {
  cities: City[]
  nowOverride?: Date | null
  onDeleteCity?: (cityId: string) => void
}

const weatherIcons: Record<number, LucideIcon> = {
  800: Sun,      // Clear sky
  300: Cloud,    // Light drizzle
  500: CloudRain, // Light rain
  600: CloudSnow, // Snow
}

const dayPhaseIcons = {
  sleep: Moon,
  early: Coffee,
  day: Sun,
  evening: Sunset,
  night: Moon,
}

const dayPhaseColors = {
  sleep: "text-blue-400",
  early: "text-orange-400",
  day: "text-yellow-500",
  evening: "text-orange-500",
  night: "text-indigo-400",
}

const dayPhaseLabels = {
  sleep: "Sleeping",
  early: "Early Morning",
  day: "Day",
  evening: "Evening",
  night: "Night",
}

export function CityWeatherTable({ cities, nowOverride, onDeleteCity }: CityWeatherTableProps) {
  const [currentTimes, setCurrentTimes] = useState<Record<string, { time: string, date: Date, phase: DayPhase }>>({})
  const [weatherData, setWeatherData] = useState<Record<string, CurrentWeather>>({})
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  useEffect(() => {
    const updateTimes = () => {
      const times: Record<string, { time: string, date: Date, phase: DayPhase }> = {}
      const now = nowOverride || new Date()
      
      cities.forEach((city) => {
        const cityTime = new Date(now.toLocaleString("en-US", { timeZone: city.tz }))
        const timeString = formatTimeInTimezone(now, city.tz)
        const phase = classifyPhase(cityTime)
        
        times[city.id] = { 
          time: timeString, 
          date: cityTime, 
          phase 
        }
      })
      setCurrentTimes(times)
    }

    updateTimes()
    const interval = setInterval(updateTimes, 1000)
    return () => clearInterval(interval)
  }, [cities, nowOverride])

  useEffect(() => {
    // Load mock weather data
    const weather: Record<string, CurrentWeather> = {}
    cities.forEach(city => {
      const cityWeather = getMockWeather(city.id)
      if (cityWeather) {
        weather[city.id] = cityWeather
      }
    })
    setWeatherData(weather)
  }, [cities])

  const handleDelete = (cityId: string) => {
    if (onDeleteCity) {
      onDeleteCity(cityId)
    }
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left p-6 text-xl font-semibold text-foreground">
              City
            </th>
            <th className="text-center p-6 text-xl font-semibold text-foreground">
              Time
            </th>
            <th className="text-center p-6 text-xl font-semibold text-foreground">
              Weather
            </th>
            <th className="w-16"></th> {/* Actions column */}
          </tr>
        </thead>
        <tbody>
          {cities.map((city) => {
            const currentTimeData = currentTimes[city.id]
            const currentTime = currentTimeData?.time || "--:--"
            const cityDate = currentTimeData?.date
            const dayPhase = currentTimeData?.phase
            const weather = weatherData[city.id]
            
            // Get time of day indicator
            let timeOfDayIcon = null
            if (dayPhase) {
              const IconComponent = dayPhaseIcons[dayPhase]
              timeOfDayIcon = {
                icon: IconComponent,
                label: dayPhaseLabels[dayPhase],
                color: dayPhaseColors[dayPhase]
              }
            }
            
            // Check if it's weekend
            const isWeekendDay = cityDate ? isWeekend(cityDate) : false
            const isHovered = hoveredRow === city.id
            
            return (
              <tr 
                key={city.id}
                className={`border-b border-border hover:bg-muted/50 transition-colors ${
                  city.id === "my-location" ? "bg-primary/5" : ""
                }`}
                onMouseEnter={() => setHoveredRow(city.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                {/* City Column */}
                <td className="p-6">
                  <div className="flex items-center space-x-3">
                    <h3 className={`text-xl font-semibold ${
                      city.id === "my-location" ? "text-primary" : "text-foreground"
                    }`}>
                      {city.name}
                    </h3>
                    {city.country && city.id !== "my-location" && (
                      <span className="text-sm text-muted-foreground">
                        {city.country}
                      </span>
                    )}
                    {city.id === "my-location" && (
                      <span className="text-sm text-primary bg-primary/10 px-2 py-1 rounded-full">
                        Current
                      </span>
                    )}
                    {isWeekendDay && (
                      <span className="text-sm text-purple-500 bg-purple-100 dark:bg-purple-900/20 px-2 py-1 rounded-full">
                        Weekend
                      </span>
                    )}
                  </div>
                </td>
                
                {/* Time Column */}
                <td className="p-6 text-center">
                  <div className="flex items-center justify-center space-x-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span className="font-mono text-3xl font-bold text-foreground">
                      {currentTime}
                    </span>
                    {timeOfDayIcon && (
                      <div className="flex flex-col items-center space-y-1">
                        <timeOfDayIcon.icon className={`h-6 w-6 ${timeOfDayIcon.color}`} />
                        <span className="text-xs text-muted-foreground text-center leading-tight">
                          {timeOfDayIcon.label}
                        </span>
                      </div>
                    )}
                  </div>
                </td>
                
                {/* Weather Column */}
                <td className="p-6 text-center">
                  {weather ? (
                    <div className="flex items-center justify-center space-x-4">
                      <div className="flex items-center space-x-3">
                        {(() => {
                          const WeatherIcon = weatherIcons[weather.code || 800] || Sun
                          return <WeatherIcon className="h-8 w-8 text-muted-foreground" />
                        })()}
                        <div className="text-left">
                          <div className="text-2xl font-bold text-foreground">
                            {weather.temperatureC}°C
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {weather.precipMm ? `${weather.precipMm}mm` : 'No rain'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-left border-l border-border pl-4">
                        <div className="text-sm text-muted-foreground">Precipitation</div>
                        <div className="text-lg font-semibold text-foreground">
                          {weather.precipProbability || 0}%
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">Loading...</div>
                  )}
                </td>

                {/* Actions Column */}
                <td className="p-6 text-center">
                  {city.id !== "my-location" && (isHovered || document.activeElement?.closest('tr') === document.querySelector(`tr[data-city-id="${city.id}"]`)) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(city.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      aria-label={`Delete ${city.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
