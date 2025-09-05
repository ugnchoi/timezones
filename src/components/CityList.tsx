'use client';

import { CityRow } from './CityRow';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { City } from '@/types';

interface CityListProps {
  cities: City[];
  instant: Date;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onHover?: (id: string | null) => void;
  className?: string;
}

export function CityList({ cities, instant, onAdd, onRemove, onHover, className }: CityListProps) {
  return (
    <div className={className}>
      {cities.map((city) => (
        <CityRow
          key={city.id}
          city={city}
          instant={instant}
          onRemove={onRemove}
          onHover={onHover}
          data-city-id={city.id}
        />
      ))}
      
      {/* Add city button */}
      <div className="px-4 py-3">
        <Button
          variant="ghost"
          onClick={onAdd}
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          aria-label="Add a new city to the list"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add city
        </Button>
      </div>
    </div>
  );
}
