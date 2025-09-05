import {
  QueryClient,
} from '@tanstack/react-query'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // All queries are stale by default; override per-query below
        staleTime: 0,
        gcTime: 30 * 60 * 1000, // 30m in cache before GC
        refetchOnWindowFocus: true, // will only fire if stale
        retry: 2,
        retryDelay: (attempt) => Math.min(2000 * 2 ** attempt, 10000),
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new client
    return makeQueryClient()
  }
  // Client: reuse across renders
  return (browserQueryClient ??= makeQueryClient())
}
