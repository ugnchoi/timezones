"use client"

import React from 'react'
import maplibregl from 'maplibre-gl'
import type { City } from '@/types'

interface MapBackgroundProps {
  cities: City[]
  hoveredId?: string | null
  dim?: number
}

export function MapBackground({ cities, hoveredId, dim = 1.0 }: MapBackgroundProps) {
  const mapRef = React.useRef<HTMLDivElement | null>(null)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (!mounted || !mapRef.current) return


    const map = new maplibregl.Map({
      container: mapRef.current,
      interactive: false,
      attributionControl: false,
      style: {
        version: 8,
        sources: {
          dem: {
            type: 'raster-dem',
            tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
            tileSize: 256,
            encoding: 'terrarium',
            maxzoom: 15
          },
          countries: {
            type: 'geojson',
            data: 'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson'
          },
          cities: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: cities
                .filter((c) => typeof c.lon === 'number' && typeof c.lat === 'number' &&
                  c.lon >= -180 && c.lon <= 180 && c.lat >= -90 && c.lat <= 90)
                .map((c) => ({
                  type: 'Feature' as const,
                  id: c.id,
                  properties: { name: c.name },
                  geometry: { type: 'Point' as const, coordinates: [c.lon, c.lat] as [number, number] },
                }))
            }
          }
        },
        layers: [
          { id: 'bg', type: 'background', paint: { 'background-color': 'rgba(0,0,0,1)' } },
          { id: 'countries-fill', type: 'fill', source: 'countries', paint: { 'fill-opacity': 0.05 } },
          { id: 'countries-stroke', type: 'line', source: 'countries', paint: {
              'line-color': '#6764a0',
              'line-width': 0.45
            }
          },
          { id: 'hillshade', type: 'hillshade', source: 'dem', paint: {
              'hillshade-exaggeration': 0.5,
              'hillshade-shadow-color': '#000000',
              'hillshade-highlight-color': '#968fff',
              'hillshade-accent-color': '#c0c0c0'
            }
          },
          { id: 'city-dots', type: 'circle', source: 'cities', paint: {
              'circle-radius': 3,
              'circle-color': ['case', ['boolean', ['feature-state', 'hover'], false], '#968fff', '#968fff'],
              'circle-stroke-width': 1,
              'circle-stroke-color': '#ffffff',
              'circle-opacity': 1
            }
          }
        ]
      },
      center: [20, 20],
      zoom: 1.5
    })

    map.on('error', (e) => {
      console.error('=== MapBackground: MapLibre GL Error ===', e)
    })

    map.on('load', () => {
      console.log('=== MapBackground: Map loaded successfully! ===')
    })

    map.on('sourcedata', (e) => {
      if (e.sourceId === 'osm-tiles') {
        if (e.isSourceLoaded) {
          console.log('=== MapBackground: Tiles loaded successfully! ===')
        } else {
          console.warn('=== MapBackground: Tiles failed to load ===')
        }
      }
    })

    return () => {
      map.remove()
    }
  }, [mounted, cities])

  // Highlight hovered city
  React.useEffect(() => {
    // This effect is disabled for now - hover functionality can be added later
  }, [hoveredId, cities])

  if (!mounted) {
    return (
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, rgba(17, 24, 39, 0.3) 100%)`,
          opacity: dim
        }}
        aria-hidden
      />
    )
  }

  return (
    <div
      ref={mapRef}
      style={{
        opacity: dim,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1
      }}
      className="pointer-events-none"
      aria-hidden
    />
  )
}