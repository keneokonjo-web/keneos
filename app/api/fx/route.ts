import { NextResponse } from 'next/server';

// Public exchange-rate feed (open.er-api.com, no key). Cached for an hour.
export async function GET() {
  try {
    const r = await fetch('https://open.er-api.com/v6/latest/USD', { next: { revalidate: 3600 } });
    if (!r.ok) throw new Error(String(r.status));
    const d = (await r.json()) as { rates: Record<string, number>; time_last_update_utc: string };
    return NextResponse.json({ base: 'USD', rates: d.rates, updated: d.time_last_update_utc });
  } catch {
    return NextResponse.json({ error: 'Exchange rates are unavailable right now.' }, { status: 502 });
  }
}
