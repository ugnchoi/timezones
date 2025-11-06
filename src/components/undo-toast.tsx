"use client"

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

export type UndoToastProps = {
  cityName: string
  onUndo: () => void
  onDismiss: () => void
  visible: boolean
}

export function UndoToast({ cityName, onUndo, onDismiss, visible }: UndoToastProps) {
  const [isVisible, setIsVisible] = React.useState(visible)
  const timeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined)

  React.useEffect(() => {
    if (visible) {
      setIsVisible(true)
      // Auto-dismiss after 5 seconds
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => onDismiss(), 150) // Wait for fade out animation
      }, 5000)
    } else {
      setIsVisible(false)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [visible, onDismiss])

  if (!isVisible) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div className="bg-background border border-border rounded-lg shadow-lg px-4 py-3 flex items-center gap-3 min-w-[300px] animate-in slide-in-from-bottom-2 duration-200">
        <div className="flex-1">
          <span className="text-sm text-foreground">
            Removed {cityName}.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (timeoutRef.current) clearTimeout(timeoutRef.current)
              onUndo()
            }}
            className="h-8 px-3"
          >
            Undo
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (timeoutRef.current) clearTimeout(timeoutRef.current)
              onDismiss()
            }}
            className="h-8 w-8 p-0"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
