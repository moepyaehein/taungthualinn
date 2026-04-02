'use client';

import { useState, useEffect, useCallback } from 'react';

async function parseApiResponse(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    const normalized = text.replace(/\s+/g, ' ').trim();
    const preview = normalized.slice(0, 120);
    return {
      error: preview.startsWith('<')
        ? 'The server returned an HTML error page instead of JSON. Please wait a moment and try again.'
        : preview,
    };
  }
}

/** Generic hook for GET requests */
export function useApi<T>(url: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!url) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url);
      const payload = await parseApiResponse(res);

      if (!res.ok) {
        const err = (payload || {}) as { error?: string };
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const json = payload as { data?: T } | T;
      if (
        typeof json === 'object' &&
        json !== null &&
        'data' in json &&
        (json as { data?: T }).data !== undefined
      ) {
        setData((json as { data?: T }).data ?? null);
      } else {
        setData(json as T);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/** POST helper */
export async function apiPost<T = unknown>(url: string, body: unknown): Promise<{ data?: T; error?: string }> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const payload = (await parseApiResponse(res)) as { data?: T; error?: string };
    if (!res.ok) return { error: payload.error || `HTTP ${res.status}` };
    return { data: payload.data };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Network error' };
  }
}

/** PATCH helper */
export async function apiPatch<T = unknown>(url: string, body: unknown): Promise<{ data?: T; error?: string }> {
  try {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const payload = (await parseApiResponse(res)) as { data?: T; error?: string };
    if (!res.ok) return { error: payload.error || `HTTP ${res.status}` };
    return { data: payload.data };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Network error' };
  }
}

/** DELETE helper */
export async function apiDelete(url: string): Promise<{ error?: string }> {
  try {
    const res = await fetch(url, { method: 'DELETE' });
    const payload = (await parseApiResponse(res)) as { error?: string };
    if (!res.ok) {
      return { error: payload.error || `HTTP ${res.status}` };
    }
    return {};
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Network error' };
  }
}
