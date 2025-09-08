"use client"

import { Clock } from "lucide-react"
import { LabelList, PolarGrid, RadialBar, RadialBarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { formatHHmm, isBusinessHours, isEarlyMorning, isEvening } from "@/lib/time-utils"
import type { City } from "@/types"

interface CityTimeRadialChartProps {
  cities: City[]
  instant: Date
}

export function CityTimeRadialChart({ cities, instant }: CityTimeRadialChartProps) {
  // Convert time to percentage of day (0-100)
  const timeToPercentage = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes
    return (totalMinutes / (24 * 60)) * 100
  }

  // Get bar color based on time of day
  const getBarColor = (instant: Date, tz: string): string => {
    if (isBusinessHours(instant, tz)) {
      return "var(--chart-1)" // Working time - primary
    } else if (isEarlyMorning(instant, tz) || isEvening(instant, tz)) {
      return "var(--muted-foreground)" // Early morning or evening - muted foreground
    } else {
      return "var(--muted)" // Night time - muted
    }
  }

  // Generate chart data with cities first, then reference bar at the end
  const chartData = [
    // Actual city data - sorted by time in ascending order (00:00 to 23:59)
    ...cities
      .map((city) => {
        const time = formatHHmm(instant, city.tz)
        const percentage = timeToPercentage(time)
        const barColor = getBarColor(instant, city.tz)
        
        
        return {
          city: city.name,
          time: percentage,
          fill: barColor, // Dynamic color based on time of day
          actualTime: time,
          country: city.country,
          label: `${city.name}: ${time}`, // Pre-formatted label
          sortKey: percentage, // For sorting by time
        }
      })
      .sort((a, b) => a.sortKey - b.sortKey) // Sort by time percentage (00:00 to 23:59)
      .map((item) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { sortKey, ...cityData } = item
        return cityData
      }), // Remove sortKey from final data
    // Single reference bar (completely transparent) - moved to the end
    {
      city: "", // Empty string so no label shows
      time: 100,
      fill: "transparent", // Completely transparent
      actualTime: "24:00",
      country: "",
      label: "", // Empty label for reference bar
    },
  ]


  // Chart configuration
  const chartConfig = {
    time: {
      label: "Time",
    },
    reference: {
      label: "Reference",
      color: "transparent",
    },
    primary: {
      label: "Working Hours",
      color: "var(--primary)",
    },
    "muted-foreground": {
      label: "Early Morning / Evening",
      color: "var(--muted-foreground)",
    },
    muted: {
      label: "Night Time",
      color: "var(--muted)",
    },
  } satisfies ChartConfig

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-1">
        <CardTitle>City Times - Radial View</CardTitle>
        <CardDescription>Current time across all cities</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[400px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={-90}
            endAngle={270}
            innerRadius={80}
            outerRadius={180}
          >
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent 
                  hideLabel 
                  nameKey="city"
                  formatter={(value: number, name: string, item: unknown) => {
                    if (!item || typeof item !== 'object' || !('payload' in item)) return null
                    const data = (item as { payload: { city: string; country: string; actualTime: string } }).payload
                    return (
                      <div className="flex flex-col gap-1">
                        <div className="font-medium">{data.city}</div>
                        <div className="text-muted-foreground text-xs">
                          {data.country}
                        </div>
                        <div className="font-mono text-sm">
                          {data.actualTime}
                        </div>
                      </div>
                    )
                  }}
                />
              }
            />
            <PolarGrid gridType="circle" />
            <RadialBar dataKey="time">
              <LabelList
                position="insideStart"
                dataKey="label"
                className="fill-white capitalize mix-blend-luminosity"
                fontSize={10}
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardContent className="flex-col gap-2 text-sm pt-1 pb-2">
        <div className="flex items-center gap-2 leading-none font-medium">
          <Clock className="h-4 w-4" />
          Time visualization from 00:00 to 23:59
        </div>
        <div className="text-muted-foreground leading-none">
          Each bar shows the absolute time of day: 00:00 = 0%, 23:59 = 100%
        </div>
      </CardContent>
    </Card>
  )
}
