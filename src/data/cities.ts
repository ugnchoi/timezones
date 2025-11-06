import { City } from '@/types'

export const defaultCities: City[] = [
  {
    id: "my-location",
    name: "My Location",
    country: "Local",
    lat: 0, // Will be updated with actual coordinates
    lon: 0, // Will be updated with actual coordinates
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    builtIn: true,
  },
  {
    id: "london-gb",
    name: "London",
    country: "United Kingdom",
    lat: 51.5074,
    lon: -0.1278,
    tz: "Europe/London",
    builtIn: true,
  },
  {
    id: "new-york-us",
    name: "New York",
    country: "United States",
    lat: 40.7128,
    lon: -74.0060,
    tz: "America/New_York",
    builtIn: true,
  },
  {
    id: "san-francisco-us",
    name: "San Francisco",
    country: "United States",
    lat: 37.7749,
    lon: -122.4194,
    tz: "America/Los_Angeles",
    builtIn: true,
  },
  {
    id: "delhi-in",
    name: "Delhi",
    country: "India",
    lat: 28.6139,
    lon: 77.2090,
    tz: "Asia/Kolkata",
    builtIn: true,
  },
  {
    id: "seoul-kr",
    name: "Seoul",
    country: "South Korea",
    lat: 37.5665,
    lon: 126.9780,
    tz: "Asia/Seoul",
    builtIn: true,
  },
]

// Helper function to get user's local timezone
export function getUserLocalTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}
