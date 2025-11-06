'use client';

import { Button } from '@/components/ui/button';
import { Minus } from 'lucide-react';
import { TimeCell } from './TimeCell';
import { WeatherCell } from './WeatherCell';
import { cn } from '@/lib/utils';
import { isBusinessHours, isEarlyMorning, isEvening } from '@/lib/time-utils';
import type { City } from '@/types';

interface CityRowProps {
  city: City;
  instant: Date;
  onRemove?: (id: string) => void;
  onHover?: (id: string | null) => void;
  className?: string;
  'data-city-id'?: string;
}

export function CityRow({ city, instant, onRemove, onHover, className, 'data-city-id': dataCityId }: CityRowProps) {
  const isBusinessTime = isBusinessHours(instant, city.tz);
  const isEarlyMorningTime = isEarlyMorning(instant, city.tz);
  const isEveningTime = isEvening(instant, city.tz);
  
  return (
    <div
      className={cn(
        'group grid grid-cols-[minmax(0,1fr)_minmax(96px,1fr)_40px] sm:grid-cols-[minmax(0,1fr)_minmax(96px,1fr)_minmax(140px,1fr)_40px] md:grid-cols-[minmax(0,1fr)_120px_180px_40px] items-center',
        'gap-2 px-2 py-4 sm:py-0 sm:h-30',
        'bg-background/50 hover:bg-muted/40 transition-colors',
        isBusinessTime && 'bg-accent/65',
        isEarlyMorningTime && 'bg-muted/50',
        isEveningTime && 'bg-muted/50',
        className
      )}
      role="row"
      data-city-id={dataCityId}
      onMouseEnter={() => onHover?.(city.id)}
      onMouseLeave={() => onHover?.(null)}
    >
                   {/* City */}
             <div role="cell" className="truncate">
               <h2 className={cn(
                 "text-xl sm:text-2xl font-semibold truncate",
                 isBusinessTime && "text-accent-foreground"
               )} title={city.name}>
                 {city.name}
               </h2>
        {city.country && (
          <div className="mt-0.5 text-xs sm:text-sm text-muted-foreground truncate">
            {city.country}
          </div>
        )}
      </div>

      {/* Time (center-aligned, icon gap) */}
      <div role="cell" className="justify-self-center text-center">
                       <TimeCell
                 tz={city.tz}
                 instant={instant}
                timeClassName="font-mono tabular-nums leading-none text-xl sm:text-2xl font-semibold"
                 iconClassName="h-4 w-4 sm:h-5 sm:w-5 -mt-px"
                 isBusinessTime={isBusinessTime}
               />
      </div>

      {/* Weather (right-aligned) */}
      <div role="cell" className="hidden justify-self-end sm:block">
        <WeatherCell 
          lat={city.lat} 
          lon={city.lon} 
          className="text-sm sm:text-base md:text-lg" 
        />
      </div>

      {/* Remove button (center-aligned in ghost column) */}
      <div role="cell" className="justify-self-center">
        <Button
          variant="ghost" 
          size="icon" 
          aria-label={`Remove ${city.name}`}
          className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 transition-opacity h-8 w-8"
          onClick={() => onRemove?.(city.id)}
        >
          <Minus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
