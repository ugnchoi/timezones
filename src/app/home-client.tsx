'use client';

import * as React from 'react';
import type { City } from '@/types';
import { CityList } from '@/components/CityList';
import { AddCityDialog } from '@/components/AddCityDialog';
import { LocalTimeControl } from '@/components/LocalTimeControl';
import { RadialView } from '@/components/RadialView';
import { MapBackground } from '@/components/MapBackground';
import { useCityStore } from '@/state/cityStore';
import { useBaselineInstant } from '@/state/baseline';
import { Separator } from '@/components/ui/separator';
import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';

const DEFAULTS: City[] = [
  { id: 'sfo', name: 'San Francisco', country: 'United States',  lat: 37.7749, lon: -122.4194, tz: 'America/Los_Angeles', builtIn: true },
  { id: 'sjo', name: 'San José',      country: 'Costa Rica',     lat: 9.9281, lon: -84.0907,   tz: 'America/Costa_Rica',  builtIn: true },
  { id: 'nyc', name: 'New York',      country: 'United States',  lat: 40.7128, lon: -74.0060, tz: 'America/New_York',     builtIn: true },
  { id: 'ldn', name: 'London',        country: 'United Kingdom', lat: 51.5074, lon: -0.1278, tz: 'Europe/London',         builtIn: true },
  { id: 'del', name: 'Delhi',         country: 'India',          lat: 28.6139, lon: 77.2090,   tz: 'Asia/Kolkata',        builtIn: true },
  { id: 'sel', name: 'Seoul',         country: 'South Korea',    lat: 37.5665, lon: 126.9780,  tz: 'Asia/Seoul',          builtIn: true },
  { id: 'syd', name: 'Sydney',        country: 'Australia',      lat: -33.8688, lon: 151.2093, tz: 'Australia/Sydney',     builtIn: true },
];

type TabType = 'timezones' | 'test' | 'map-test';

export default function HomeClient() {
  const { cities, addCity, removeCity } = useCityStore(DEFAULTS);
  const { instant, setByLocalTimeHHmm, reset, overrideISO } = useBaselineInstant();
  const [openAdd, setOpenAdd] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<TabType>('timezones');
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  const localHHmm = new Intl.DateTimeFormat(undefined, { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false 
  }).format(instant);

  
  return (
    <div className="min-h-screen relative">
      <MapBackground cities={cities} hoveredId={hoveredId} dim={0.3} />
      <main className="relative z-10 container max-w-2xl mx-auto px-6 py-6 md:py-6 my-8 md:my-6 space-y-8 md:space-y-6">
      {/* Tab Navigation */}
      <nav className="flex justify-center">
        <div className="inline-flex items-center rounded-lg bg-muted p-1">
          <Button
            variant={activeTab === 'timezones' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('timezones')}
            className="px-4"
          >
            Timezones
          </Button>
          <Button
            variant={activeTab === 'test' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('test')}
            className="px-4"
          >
            Radial View
          </Button>
             </div>
      </nav>

      {/* Header */}
      <header className="flex items-start justify-between gap-6">
        <div className="space-y-1.5">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">My local time</div>
          <LocalTimeControl
            hhmm={localHHmm}
            whatIfActive={!!overrideISO}
            onChangeHHmm={setByLocalTimeHHmm}
            onReset={reset}
          />
        </div>
      </header>

      {/* Tab Content */}
      {activeTab === 'timezones' && (
        <>
          {/* Optional Info banner for IP failures (render conditionally) */}
          {/* <aside className="rounded-md border bg-muted p-3 text-sm flex items-start gap-2">
            <Info className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <span>We couldn't determine your location by IP. You can still add cities manually.</span>
          </aside> */}

          {/* Table header */}
          <section>
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(96px,1fr)_minmax(140px,1fr)_40px] md:grid-cols-[minmax(0,1fr)_120px_180px_40px] gap-2 px-2">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">City</div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground text-center">Time</div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground text-right">Weather</div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground text-center"></div>
            </div>
            <Separator className="mt-2" />

            {/* Rows or Empty State */}
            {cities.length === 0 ? (
              <EmptyState onAdd={() => setOpenAdd(true)} />
            ) : (
              <CityList
                cities={cities}
                instant={instant}
                onAdd={() => setOpenAdd(true)}
                onRemove={removeCity}
                onHover={setHoveredId}
                className="rounded-xl shadow-sm"
              />
            )}
          </section>
        </>
      )}

      {activeTab === 'test' && (
        <RadialView cities={cities} instant={instant} />
      )}


      {/* Add dialog */}
      <AddCityDialog open={openAdd} onOpenChange={setOpenAdd} onSelect={addCity} existingCities={cities} />
      </main>
    </div>
  );
}
