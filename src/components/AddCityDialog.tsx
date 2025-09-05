import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { City, GeoSearchResult } from '@/types'
import { useGeoSearch, usePrefetchWeather } from '@/queries'

export type AddCityDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (city: City) => void
  existingCities: City[] // For deduplication
}

// Constants
const COORDINATE_TOLERANCE = 0.01; // Degrees for coordinate comparison
const TOAST_DURATION = 3000; // milliseconds
const HIGHLIGHT_DURATION = 1200; // milliseconds

export function AddCityDialog({ open, onOpenChange, onSelect, existingCities }: AddCityDialogProps) {
  const [q, setQ] = React.useState('')
  const [activeIndex, setActiveIndex] = React.useState(0)
  const { data: results, isPending: loading } = useGeoSearch(q)
  const prefetchWeather = usePrefetchWeather()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const resultsRef = React.useRef<HTMLDivElement>(null)

  // Reset state when dialog opens/closes
  React.useEffect(() => {
    if (open) {
      setQ('')
      setActiveIndex(0)
      // Focus input after render
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [open])

  // Check if city already exists
  const isDuplicate = React.useCallback((city: GeoSearchResult): boolean => {
    return existingCities.some(existing => 
      existing.id === city.id || 
      (existing.name === city.name && 
       Math.abs(existing.lat - city.lat) < COORDINATE_TOLERANCE && 
       Math.abs(existing.lon - city.lon) < COORDINATE_TOLERANCE)
    )
  }, [existingCities])

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (!results || results.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex(prev => (prev + 1) % results.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex(prev => (prev - 1 + results.length) % results.length)
        break
      case 'Home':
        e.preventDefault()
        setActiveIndex(0)
        break
      case 'End':
        e.preventDefault()
        setActiveIndex(results.length - 1)
        break
      case 'Enter':
        e.preventDefault()
        if (results[activeIndex]) {
          handleSelect(results[activeIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        onOpenChange(false)
        break
    }
  }, [results, activeIndex, onOpenChange])

  const handleSelect = React.useCallback(async (result: GeoSearchResult) => {
    const city: City = {
      id: result.id,
      name: result.name,
      country: result.country,
      lat: result.lat,
      lon: result.lon,
      tz: result.tz,
    }

    // Check for duplicates
    if (isDuplicate(result)) {
      // Close dialog and trigger dedupe behavior
      onOpenChange(false)
      
      // Find existing city row and highlight it
      setTimeout(() => {
        const existingRow = document.querySelector(`[data-city-id="${city.id}"]`) as HTMLElement
        if (existingRow) {
          // Check if user prefers reduced motion
          const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
          
          existingRow.scrollIntoView({ 
            block: 'center', 
            behavior: prefersReducedMotion ? 'auto' : 'smooth' 
          })
          
          // Highlight the existing row
          existingRow.classList.add('bg-amber-50', 'dark:bg-amber-950/20')
          setTimeout(() => {
            existingRow.classList.remove('bg-amber-50', 'dark:bg-amber-950/20')
          }, HIGHLIGHT_DURATION)
          
          // Show dedupe toast
          showDedupeToast(city.name)
        }
      }, 100)
      return
    }

    // Prefetch weather data for instant rendering
    await prefetchWeather(city.lat, city.lon)
    
    onSelect(city)
    onOpenChange(false)
    setQ('')
    setActiveIndex(0)
  }, [isDuplicate, onOpenChange, onSelect, prefetchWeather])

  const showDedupeToast = React.useCallback((cityName: string) => {
    // Create a simple toast notification
    const toast = document.createElement('div')
    toast.setAttribute('role', 'status')
    toast.setAttribute('aria-live', 'polite')
    toast.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-background border border-border rounded-lg shadow-lg px-4 py-3 text-sm animate-in slide-in-from-bottom-2 duration-200'
    toast.textContent = `${cityName} is already in your list.`
    
    document.body.appendChild(toast)
    const timeoutId = setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast)
      }
    }, TOAST_DURATION)
    
    // Cleanup function to remove timeout if component unmounts
    return () => clearTimeout(timeoutId)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQ(e.target.value)
    setActiveIndex(0) // Reset active index when query changes
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-modal="true">
        <DialogHeader>
          <DialogTitle id="dialog-title">Add a city</DialogTitle>
        </DialogHeader>
        
        <Input
          ref={inputRef}
          placeholder="Search city…"
          value={q}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          aria-labelledby="dialog-title"
          aria-describedby="search-description"
        />
        
        <div id="search-description" className="sr-only">
          Type to search for cities. Use arrow keys to navigate results and Enter to select.
        </div>
        
        <div 
          ref={resultsRef}
          className="max-h-64 overflow-auto"
          role="listbox"
          aria-label="Search results"
        >
          {loading && (
            <div className="p-3 text-sm text-neutral-500" role="status">
              Searching…
            </div>
          )}
          
          {!loading && results && results.length > 0 && (
            <>
              {results.map((result, index) => (
                <button
                  key={result.id}
                  role="option"
                  aria-selected={index === activeIndex}
                  onClick={() => handleSelect(result)}
                  className={`w-full text-left px-3 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded focus:outline-none focus:bg-neutral-50 dark:focus:bg-neutral-800 ${
                    index === activeIndex ? 'bg-neutral-100 dark:bg-neutral-700' : ''
                  }`}
                >
                  <div className="font-medium">{result.name}</div>
                  <div className="text-xs text-neutral-500">
                    {result.country} · {result.tz}
                  </div>
                </button>
              ))}
            </>
          )}
          
          {!loading && results && results.length === 0 && q && (
            <div className="p-3 text-sm text-neutral-500" role="status">
              No results
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
