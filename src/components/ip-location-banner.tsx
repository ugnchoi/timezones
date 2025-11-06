'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function IpLocationBanner() {
  const [isVisible, setIsVisible] = React.useState(false)
  const [isDismissed, setIsDismissed] = React.useState(false)

  React.useEffect(() => {
    // Check if we should show the banner
    const checkIpLocation = async () => {
      try {
        // Try to detect IP location
        const response = await fetch('https://ipapi.co/json/')
        if (!response.ok) {
          throw new Error('IP location service unavailable')
        }
        const data = await response.json()
        
        // If we get a response, don't show the banner
        if (data.latitude && data.longitude) {
          return
        }
        
        // Show banner if IP detection fails
        setIsVisible(true)
      } catch {
        // Show banner on any error
        setIsVisible(true)
      }
    }

    checkIpLocation()
  }, [])

  if (!isVisible || isDismissed) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            We couldn&apos;t determine your location by IP. You can still add cities manually.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsDismissed(true)}
          className="h-6 w-6 p-0 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
          aria-label="Dismiss location banner"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
