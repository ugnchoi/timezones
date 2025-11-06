'use client';

import { useWeather } from '@/queries';
import { CloudRain, CloudSnow, Cloud, Coffee } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WeatherCellProps {
  lat: number;
  lon: number;
  className?: string;
}

export function WeatherCell({ lat, lon, className }: WeatherCellProps) {
  const { data: weather, isLoading, error } = useWeather(lat, lon);

  if (isLoading) {
    return <span className={cn("text-sm sm:text-base text-muted-foreground", className)}>—</span>;
  }

  if (error || !weather) {
    return (
      <span 
        className={cn("text-sm sm:text-base text-destructive", className)} 
        title="Failed to load weather data"
      >
        !
      </span>
    );
  }

  const { temperatureC, precipProbability, code } = weather;

  // Weather icon based on conditions
  const WeatherIcon = () => {
    if (code && code >= 51 && code <= 67) return <CloudRain className="h-4 w-4" />; // Rain
    if (code && code >= 71 && code <= 77) return <CloudSnow className="h-4 w-4" />; // Snow
    if (code && code >= 1 && code <= 3) return <Cloud className="h-4 w-4" />; // Partly cloudy
    return <Coffee className="h-4 w-4" />; // Default
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-sm font-medium sm:text-base">{temperatureC}°C</span>
      <span className="mx-1 text-muted-foreground sm:mx-2">·</span>
      <WeatherIcon />
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium sm:text-base">{precipProbability}%</span>
        
        
      </div>
    </div>
  );
}
