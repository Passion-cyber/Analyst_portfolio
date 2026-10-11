import { useCallback, useEffect, useState } from 'react'
import { isApiEnabled, type DataSource, type Loaded } from '@/services/api'

export interface ResourceState<T> {
  status: 'loading' | 'success' | 'error'
  data: T | undefined
  source?: DataSource
  error?: Error
  retry: () => void
}

type Snapshot<T> = Omit<ResourceState<T>, 'retry'> & { key: string }

// Shared across components so sections using the same data, and route changes, don't refetch.
const cache = new Map<string, Loaded<unknown>>()
const inflight = new Map<string, Promise<Loaded<unknown>>>()

function load<T>(key: string, loader: () => Promise<Loaded<T>>): Promise<Loaded<T>> {
  let request = inflight.get(key) as Promise<Loaded<T>> | undefined
  if (!request) {
    request = loader().finally(() => inflight.delete(key))
    inflight.set(key, request)
  }
  return request
}

/**
 * Subscribes a component to a content getter from `@/services/content`.
 *
 * - No API configured → returns `local` synchronously (no skeleton flash).
 * - API configured    → 'loading' (render a skeleton), then the remote data —
 *                       or the local data with `source: 'fallback'` and `error`.
 */
export function useResource<T>(key: string, loader: () => Promise<Loaded<T>>, local: T): ResourceState<T> {
  const [snapshot, setSnapshot] = useState<Snapshot<T>>(() => initialSnapshot(key))
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!isApiEnabled) return
    const hit = cache.get(key) as Loaded<T> | undefined
    if (hit) {
      setSnapshot({ key, status: 'success', ...hit })
      return
    }

    let cancelled = false
    setSnapshot((prev) => (prev.key === key ? { ...prev, status: 'loading' } : { key, status: 'loading', data: undefined }))
    load(key, loader)
      .then((result) => {
        if (result.source === 'remote') cache.set(key, result)
        if (!cancelled) setSnapshot({ key, status: 'success', ...result })
      })
      .catch((error: Error) => {
        if (!cancelled) setSnapshot({ key, status: 'error', data: undefined, error })
      })
    return () => {
      cancelled = true
    }
    // `loader` is derived from `key`; depending on its identity would refetch every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, attempt])

  const retry = useCallback(() => {
    cache.delete(key)
    setAttempt((n) => n + 1)
  }, [key])

  if (!isApiEnabled) return { status: 'success', data: local, source: 'local', retry }
  // Never expose data that belongs to a previous key (e.g. the last project viewed).
  if (snapshot.key !== key) return { status: 'loading', data: undefined, retry }
  return { status: snapshot.status, data: snapshot.data, source: snapshot.source, error: snapshot.error, retry }
}

function initialSnapshot<T>(key: string): Snapshot<T> {
  const hit = cache.get(key) as Loaded<T> | undefined
  return hit ? { key, status: 'success', ...hit } : { key, status: 'loading', data: undefined }
}
