import { env } from '@/lib/env'

/**
 * Minimal HTTP layer for an optional content API (e.g. a Swagger/OpenAPI
 * service). Every call has a timeout and falls back to local content, so the
 * site never breaks because an API is slow or down.
 */

export const isApiEnabled = env.apiBaseUrl.length > 0

/** Where a piece of content came from. 'fallback' = API failed, local data shown. */
export type DataSource = 'local' | 'remote' | 'fallback'

export interface Loaded<T> {
  data: T
  source: DataSource
  /** Present when the remote request failed and local data was used instead. */
  error?: Error
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), env.apiTimeoutMs)
  try {
    const response = await fetch(`${env.apiBaseUrl}${path}`, {
      ...init,
      headers: { Accept: 'application/json', ...init?.headers },
      signal: controller.signal,
    })
    if (!response.ok) throw new ApiError(`Request to ${path} failed`, response.status)
    return (await response.json()) as T
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError(`Request to ${path} timed out after ${env.apiTimeoutMs}ms`)
    }
    throw error instanceof Error ? error : new ApiError(String(error))
  } finally {
    window.clearTimeout(timer)
  }
}

/**
 * Loads `path` from the API when one is configured, validating the response
 * shape; otherwise (or on any failure) resolves with the local data.
 */
export async function loadWithFallback<T>(
  path: string,
  local: T,
  isValid: (value: unknown) => value is T,
): Promise<Loaded<T>> {
  if (!isApiEnabled) return { data: local, source: 'local' }
  try {
    const remote = await fetchJson<unknown>(path)
    if (!isValid(remote)) throw new ApiError(`Unexpected response shape from ${path}`)
    return { data: remote, source: 'remote' }
  } catch (error) {
    if (import.meta.env.DEV) console.warn(`[content] ${path} → using local fallback`, error)
    return { data: local, source: 'fallback', error: error as Error }
  }
}
