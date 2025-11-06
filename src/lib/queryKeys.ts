export const qk = {
  ipLocal: ['ip', 'local'] as const,
  geoSearch: (q: string) => ['geo', 'search', q] as const,
  weather: (lat: number, lon: number) => ['weather', { lat, lon }] as const,
}
