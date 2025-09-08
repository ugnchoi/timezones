"use client"

import { useState } from "react"
import { TimePicker } from "./time-picker"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"

interface LocalTimeHeaderProps {
  currentTime: Date
  onTimeChange: (newTime: Date) => void
  onReset: () => void
}

export function LocalTimeHeader({ currentTime, onTimeChange, onReset }: LocalTimeHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [nowOverride, setNowOverride] = useState<Date | null>(null)

  const handleTimeChange = (newTime: Date) => {
    setNowOverride(newTime)
    onTimeChange(newTime)
  }

  const handleReset = () => {
    setNowOverride(null)
    onReset()
  }

  const isWhatIfMode = nowOverride !== null

  return (
    <div className={`p-6 border-b border-border transition-colors ${
      isWhatIfMode ? 'bg-amber-50 dark:bg-amber-950/20' : ''
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Local Time
          </h2>
          <TimePicker
            currentTime={nowOverride || currentTime}
            onTimeChange={handleTimeChange}
            isEditing={isEditing}
            onToggleEdit={() => setIsEditing(!isEditing)}
          />
        </div>
        
        {isWhatIfMode && (
          <div className="flex items-center space-x-3">
            <span className="text-sm text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-3 py-1 rounded-full">
              What-if time active
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="flex items-center space-x-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset to now</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
