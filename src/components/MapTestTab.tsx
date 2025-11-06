"use client"

import React from 'react'
import { MapBackground } from '@/components/MapBackground'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { City } from '@/types'

// Test cities with known coordinates
const TEST_CITIES: City[] = [
  { id: 'london', name: 'London', country: 'UK', lat: 51.5074, lon: -0.1278, tz: 'Europe/London', builtIn: true },
  { id: 'nyc', name: 'New York', country: 'USA', lat: 40.7128, lon: -74.0060, tz: 'America/New_York', builtIn: true },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503, tz: 'Asia/Tokyo', builtIn: true },
  { id: 'sydney', name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093, tz: 'Australia/Sydney', builtIn: true },
]

export function MapTestTab() {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Map Background Test</CardTitle>
          <CardDescription>
            Testing the MapLibre GL topographic background with city dots
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>Expected behavior:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Topographic hillshade background from AWS Terrain Tiles</li>
              <li>City dots at London, New York, Tokyo, and Sydney</li>
              <li>Dots should highlight when hovering over city names below</li>
              <li>Map should auto-fit to show all cities</li>
            </ul>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {TEST_CITIES.map((city) => (
              <button
                key={city.id}
                className={`p-2 rounded text-left transition-colors ${
                  hoveredId === city.id 
                    ? 'bg-accent text-accent-foreground' 
                    : 'bg-muted hover:bg-muted/80'
                }`}
                onMouseEnter={() => setHoveredId(city.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="font-medium">{city.name}</div>
                <div className="text-xs text-muted-foreground">
                  {city.lat.toFixed(4)}, {city.lon.toFixed(4)}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Map Container</CardTitle>
          <CardDescription>
            The map should render in the area below with city dots
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative h-96 w-full border rounded-lg overflow-hidden">
            <MapBackground 
              cities={TEST_CITIES} 
              hoveredId={hoveredId} 
              dim={0.7}
            />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-2 rounded text-sm">
                Map Test Area
              </div>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <p><strong>Expected:</strong> Subtle topographic hillshades with blue city dots</p>
            <p><strong>Check:</strong> Browser console for debug messages</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
