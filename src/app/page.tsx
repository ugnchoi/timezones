import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/queryClient'
import { weatherQuery } from '@/queries'
import HomeClient from './home-client'

const DEFAULTS = [
  { lat: 37.7749, lon: -122.4194 },      // San Francisco
  { lat: 9.9281, lon: -84.0907 },        // San José, Costa Rica
  { lat: 40.7128, lon: -74.0060 },       // New York
  { lat: 51.5074, lon: -0.1278 },        // London
  { lat: 28.6139, lon: 77.2090 },        // Delhi
  { lat: 37.5665, lon: 126.9780 },       // Seoul
  { lat: -33.8688, lon: 151.2093 },      // Sydney, Australia
]

export default async function Page() {
  const qc = getQueryClient()
  
  // Prefetch weather data for default cities on the server
  await Promise.all(
    DEFAULTS.map(({ lat, lon }) => 
      qc.prefetchQuery(weatherQuery(lat, lon))
    )
  )
  
  const state = dehydrate(qc)
  
  return (
    <HydrationBoundary state={state}>
      <HomeClient />
    </HydrationBoundary>
  )
}
