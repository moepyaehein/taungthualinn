'use client';

import { useState, useEffect, useCallback } from 'react';

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
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const json = await res.json();
      setData(json.data !== undefined ? json.data : json);
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
    const json = await res.json();
    if (!res.ok) return { error: json.error || `HTTP ${res.status}` };
    return { data: json.data };
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
    const json = await res.json();
    if (!res.ok) return { error: json.error || `HTTP ${res.status}` };
    return { data: json.data };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Network error' };
  }
}

/** DELETE helper */
export async function apiDelete(url: string): Promise<{ error?: string }> {
  try {
    const res = await fetch(url, { method: 'DELETE' });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      return { error: json.error || `HTTP ${res.status}` };
    }
    return {};
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Network error' };
  }
}
