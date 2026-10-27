'use client';
import { useEffect, useState } from 'react';
import type { Rates } from './finance';

let memo: Rates | undefined;
export function useRates(): { rates: Rates; error: boolean; loading: boolean } {
  const [rates, setRates] = useState<Rates>(memo ?? null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(memo === undefined);
  useEffect(() => {
    if (memo !== undefined) return;
    let off = false;
    fetch('/api/fx')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => { memo = d as Rates; if (!off) { setRates(memo); setLoading(false); } })
      .catch(() => { if (!off) { setError(true); setLoading(false); } });
    return () => { off = true; };
  }, []);
  return { rates, error, loading };
}
