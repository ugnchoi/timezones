"use client"

import { CityTimeRadialChart } from "@/components/CityTimeRadialChart"
import type { City } from "@/types"

interface RadialViewProps {
  cities: City[]
  instant: Date
}

export function RadialView({ cities, instant }: RadialViewProps) {
  return (
    <div className="space-y-6">
 
      <CityTimeRadialChart cities={cities} instant={instant} />
    </div>
  )
}
