import { CurrentWeather } from '@/types'

export const mockWeatherData: Record<string, CurrentWeather> = {
  "my-location": {
    temperatureC: 22,
    precipMm: 0.0,
    precipProbability: 10,
    code: 800, // Clear sky
    observedAtISO: new Date().toISOString(),
  },
  "london-gb": {
    temperatureC: 12,
    precipMm: 2.5,
    precipProbability: 45,
    code: 300, // Light drizzle
    observedAtISO: new Date().toISOString(),
  },
  "new-york-us": {
    temperatureC: 15,
    precipMm: 8.0,
    precipProbability: 80,
    code: 500, // Light rain
    observedAtISO: new Date().toISOString(),
  },
  "san-francisco-us": {
    temperatureC: 18,
    precipMm: 0.0,
    precipProbability: 25,
    code: 800, // Clear sky
    observedAtISO: new Date().toISOString(),
  },
  "delhi-in": {
    temperatureC: 32,
    precipMm: 0.0,
    precipProbability: 5,
    code: 800, // Clear sky
    observedAtISO: new Date().toISOString(),
  },
  "seoul-kr": {
    temperatureC: -5,
    precipMm: 15.0,
    precipProbability: 60,
    code: 600, // Snow
    observedAtISO: new Date().toISOString(),
  },
}

export function getMockWeather(cityId: string): CurrentWeather | null {
  return mockWeatherData[cityId] || null
}
