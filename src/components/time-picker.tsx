"use client"

import { useState, useEffect } from "react"
import { Clock, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TimePickerProps {
  currentTime: Date
  onTimeChange: (newTime: Date) => void
  onReset: () => void
  isEditing: boolean
  onToggleEdit: () => void
}

export function TimePicker({ currentTime, onTimeChange, onReset, isEditing, onToggleEdit }: TimePickerProps) {
  const [hours, setHours] = useState(currentTime.getHours().toString().padStart(2, '0'))
  const [minutes, setMinutes] = useState(currentTime.getMinutes().toString().padStart(2, '0'))

  useEffect(() => {
    if (isEditing) {
      setHours(currentTime.getHours().toString().padStart(2, '0'))
      setMinutes(currentTime.getMinutes().toString().padStart(2, '0'))
    }
  }, [currentTime, isEditing])

  const handleSave = () => {
    const newTime = new Date()
    newTime.setHours(parseInt(hours))
    newTime.setMinutes(parseInt(minutes))
    newTime.setSeconds(0)
    newTime.setMilliseconds(0)
    onTimeChange(newTime)
    onToggleEdit()
  }

  const handleCancel = () => {
    setHours(currentTime.getHours().toString().padStart(2, '0'))
    setMinutes(currentTime.getMinutes().toString().padStart(2, '0'))
    onToggleEdit()
  }

  if (!isEditing) {
    return (
      <div className="flex items-center space-x-3">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <button
          onClick={onToggleEdit}
          className="font-mono text-3xl font-bold text-foreground hover:text-primary transition-colors cursor-pointer"
        >
          {currentTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          })}
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-3">
      <Clock className="h-5 w-5 text-muted-foreground" />
      <div className="flex items-center space-x-2">
        <input
          type="number"
          min="0"
          max="23"
          value={hours}
          onChange={(e) => setHours(e.target.value.padStart(2, '0'))}
          className="font-mono text-3xl font-bold text-foreground bg-transparent border-b-2 border-primary focus:outline-none w-16 text-center"
        />
        <span className="font-mono text-3xl font-bold text-foreground">:</span>
        <input
          type="number"
          min="0"
          max="59"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value.padStart(2, '0'))}
          className="font-mono text-3xl font-bold text-foreground bg-transparent border-b-2 border-primary focus:outline-none w-16 text-center"
        />
      </div>
      <div className="flex space-x-2">
        <Button size="sm" onClick={handleSave} className="h-8 px-3">
          Save
        </Button>
        <Button size="sm" variant="outline" onClick={handleCancel} className="h-8 px-3">
          Cancel
        </Button>
      </div>
    </div>
  )
}
