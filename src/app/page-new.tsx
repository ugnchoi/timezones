import * as React from 'react'
import type { City } from '@/types'
import { useCityStore } from '@/state/cityStore'
import { useBaselineInstant } from '@/state/baseline'
import { CityList } from '@/components/CityList'
import { AddCityDialog } from '@/components/AddCityDialog'
import { LocalTimeControl } from '@/components/LocalTimeControl'

const DEFAULTS: City[] = [
  { id: 'ldn', name: 'London',       lat: 51.5074, lon: -0.1278, tz: 'Europe/London',           builtIn: true },
  { id: 'nyc', name: 'New York',     lat: 40.7128, lon: -74.0060, tz: 'America/New_York',       builtIn: true },
  { id: 'sfo', name: 'San Francisco',lat: 37.7749, lon: -122.4194, tz: 'America/Los_Angeles',   builtIn: true },
  { id: 'del', name: 'Delhi',        lat: 28.6139, lon: 77.2090,   tz: 'Asia/Kolkata',          builtIn: true },
  { id: 'sel', name: 'Seoul',        lat: 37.5665, lon: 126.9780,  tz: 'Asia/Seoul',            builtIn: true },
]

export default function Home() {
  const { cities, addCity, removeCity } = useCityStore(DEFAULTS)
  const { instant, setByLocalTimeHHmm, reset, overrideISO } = useBaselineInstant()
  const [openAdd, setOpenAdd] = React.useState(false)

  const localHHmm = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(instant)

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <div className="text-sm uppercase tracking-wide text-neutral-500">My local time</div>
          <LocalTimeControl
            hhmm={localHHmm}
            whatIfActive={!!overrideISO}
            onChangeHHmm={(hhmm) => setByLocalTimeHHmm(hhmm)}
            onReset={reset}
          />
        </div>
      </header>

      <section>
        <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-3 pb-1 text-xs uppercase tracking-wide text-neutral-500">
          <div>City</div><div>Time</div><div>Weather</div>
        </div>
        <CityList
          cities={cities}
          instant={instant}
          onAdd={() => setOpenAdd(true)}
          onRemove={removeCity}
        />
      </section>

      <AddCityDialog
        open={openAdd}
        onOpenChange={setOpenAdd}
        onSelect={(city) => addCity(city)}
        existingCities={cities}
      />
    </main>
  )
}
