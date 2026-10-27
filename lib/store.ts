'use client';
import { useCallback, useSyncExternalStore } from 'react';

// Device-local persistence. Everything lives in this browser until a database is connected
// (see Settings → Data). Reads are cached per raw string so snapshots stay referentially stable.
const PREFIX = 'kos:v1:';
const listeners = new Set<() => void>();
const cache = new Map<string, { raw: string | null; value: unknown }>();

let version = 0;
function emit() {
  version++;
  listeners.forEach((l) => l());
}

// Bumps on any write, for views that depend on the whole store (e.g. the size meter).
export function useStoreVersion() {
  return useSyncExternalStore(subscribe, () => version, () => 0);
}

export function readKey<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(PREFIX + key);
  } catch {
    return fallback;
  }
  const hit = cache.get(key);
  if (hit && hit.raw === raw) return hit.value as T;
  let value: unknown = fallback;
  if (raw !== null) {
    try {
      value = JSON.parse(raw);
    } catch {
      value = fallback;
    }
  }
  cache.set(key, { raw, value });
  return value as T;
}

export function writeKey<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    alert('Could not save: this device storage is full or blocked. Export a backup in Settings → Data.');
    return;
  }
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key?.startsWith(PREFIX)) cb();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener('storage', onStorage);
  };
}

export function useStore<T>(key: string, fallback: T): [T, (v: T | ((p: T) => T)) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => readKey(key, fallback),
    () => fallback,
  );
  const set = useCallback(
    (v: T | ((p: T) => T)) => {
      const next = typeof v === 'function' ? (v as (p: T) => T)(readKey(key, fallback)) : v;
      writeKey(key, next);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );
  return [value, set];
}

const EMPTY: never[] = [];

export function uid() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export type Row = { id: string; createdAt: string };

export function useCollection<T extends Row = Row>(key: string) {
  const [items, setItems] = useStore<T[]>(key, EMPTY as unknown as T[]);
  const add = useCallback(
    (data: Omit<T, 'id' | 'createdAt'>) => {
      const row = { ...data, id: uid(), createdAt: new Date().toISOString() } as unknown as T;
      setItems((p) => [row, ...p]);
      return row;
    },
    [setItems],
  );
  const update = useCallback(
    (id: string, patch: Partial<T>) => setItems((p) => p.map((r) => (r.id === id ? { ...r, ...patch } : r))),
    [setItems],
  );
  const remove = useCallback((id: string) => setItems((p) => p.filter((r) => r.id !== id)), [setItems]);
  return { items, add, update, remove, setItems };
}

export type Activity = { id: string; createdAt: string; text: string; href?: string; kind: string };

export function logActivity(text: string, kind = 'update', href?: string) {
  const list = readKey<Activity[]>('activity', []);
  const next: Activity[] = [{ id: uid(), createdAt: new Date().toISOString(), text, kind, href }, ...list].slice(0, 300);
  writeKey('activity', next);
}

export function allKeys(): string[] {
  if (typeof window === 'undefined') return [];
  const out: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (k?.startsWith(PREFIX)) out.push(k.slice(PREFIX.length));
  }
  return out;
}

export function exportAll(): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  allKeys().forEach((k) => (out[k] = readKey(k, null)));
  return out;
}

export function importAll(data: Record<string, unknown>) {
  Object.entries(data).forEach(([k, v]) => window.localStorage.setItem(PREFIX + k, JSON.stringify(v)));
  cache.clear();
  emit();
}

export function clearAll() {
  allKeys().forEach((k) => window.localStorage.removeItem(PREFIX + k));
  cache.clear();
  emit();
}

export function storageBytes(): number {
  if (typeof window === 'undefined') return 0;
  let n = 0;
  allKeys().forEach((k) => {
    const v = window.localStorage.getItem(PREFIX + k) ?? '';
    n += (k.length + v.length) * 2;
  });
  return n;
}
