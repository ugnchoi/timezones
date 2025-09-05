'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LocalTimeControlProps {
  hhmm: string;
  whatIfActive: boolean;
  onChangeHHmm: (hhmm: string) => void;
  onReset: () => void;
}

export function LocalTimeControl({ hhmm, whatIfActive, onChangeHHmm, onReset }: LocalTimeControlProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(hhmm);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Convert HH:MM to slider value (0-48 for 30-minute increments)
  const timeToSliderValue = (time: string) => {
    const [hh, mm] = time.split(':').map(Number);
    return hh * 2 + (mm >= 30 ? 1 : 0);
  };

  // Convert slider value to HH:MM
  const sliderValueToTime = (value: number) => {
    const hours = Math.floor(value / 2);
    const minutes = (value % 2) * 30;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleSliderChange = (value: number[]) => {
    const sliderValue = value[0];
    const newTime = sliderValueToTime(sliderValue);
    onChangeHHmm(newTime);
  };

  const handleClick = () => {
    setIsEditing(true);
    setInputValue(hhmm);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommit();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleCommit = () => {
    if (inputValue !== hhmm) {
      onChangeHHmm(inputValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setInputValue(hhmm);
    setIsEditing(false);
  };

  const handleBlur = () => {
    handleCommit();
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-4">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="font-mono tabular-nums text-4xl md:text-5xl font-semibold bg-transparent border-none outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded px-2 py-1 w-28 text-center"
          aria-label="Edit local time (HH:MM format)"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">00:00</span>
          <Slider
            min={0}
            max={48}
            value={[timeToSliderValue(inputValue)]}
            onValueChange={(value) => {
              const newTime = sliderValueToTime(value[0]);
              setInputValue(newTime);
            }}
            className="w-48"
            aria-label="Time slider (30-minute increments)"
          />
          <span className="text-sm text-muted-foreground">24:00</span>
        </div>
        {whatIfActive && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onReset}
            className="h-8 w-8"
            aria-label="Reset to current time"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handleClick}
        className={cn(
          "font-mono tabular-nums text-4xl md:text-5xl font-semibold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded transition-colors",
          whatIfActive && "text-accent-foreground"
        )}
        aria-label="My local time. Click to change local time"
        title="Click to change local time"
      >
        {hhmm}
      </button>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">00:00</span>
        <Slider
          min={0}
          max={48}
          value={[timeToSliderValue(hhmm)]}
          onValueChange={handleSliderChange}
          className="w-48"
          aria-label="Time slider (30-minute increments)"
        />
        <span className="text-sm text-muted-foreground">24:00</span>
      </div>
      {whatIfActive && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onReset}
          className="h-8 w-8"
          aria-label="Reset to current time"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
