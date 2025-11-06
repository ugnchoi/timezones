export class HttpError extends Error {
  constructor(
    message: string,
    public status: number,
    public url: string,
    public body?: unknown
  ) {
    super(message)
  }
}

export async function getJSON<T>(
  url: string,
  opts?: { signal?: AbortSignal }
): Promise<T> {
  const res = await fetch(url, { signal: opts?.signal })
  if (!res.ok) {
    let body: unknown = undefined
    try { body = await res.json() } catch { /* ignore */ }
    throw new HttpError(`GET ${url} failed`, res.status, url, body)
  }
  return res.json() as Promise<T>
}
