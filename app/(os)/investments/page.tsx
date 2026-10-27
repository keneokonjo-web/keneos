'use client';
import { useState } from 'react';
import { Collection } from '@/components/Collection';
import { Empty, PageHead, Tabs } from '@/components/ui';
import { useCollection } from '@/lib/store';
import { CURRENCIES, convert, money } from '@/lib/finance';
import { useSettings } from '@/lib/settings';
import { useRates } from '@/lib/useRates';
import { fmtDate } from '@/lib/dates';

type H = { id: string; createdAt: string; symbol: string; name?: string; type?: string; units?: number; buy?: number; price?: number; asof?: string; currency?: string };

export default function Investments() {
  const [tab, setTab] = useState('portfolio');
  const [s] = useSettings();
  const { rates } = useRates();
  const { items } = useCollection<H>('invest:holdings');
  const base = s.baseCurrency;
  const rows = items.map((h) => {
    const cur = h.currency ?? 'USD';
    const value = (h.units ?? 0) * (h.price ?? h.buy ?? 0);
    const cost = (h.units ?? 0) * (h.buy ?? 0);
    return { h, cur, value, cost, vB: convert(value, cur, base, rates), cB: convert(cost, cur, base, rates) };
  });
  const ok = rows.length > 0 && rows.every((r) => r.vB !== null && r.cB !== null);
  const tv = ok ? rows.reduce((a, r) => a + (r.vB as number), 0) : null;
  const tc = ok ? rows.reduce((a, r) => a + (r.cB as number), 0) : null;
  const byType = new Map<string, number>();
  if (ok) rows.forEach((r) => byType.set(r.h.type ?? 'Other', (byType.get(r.h.type ?? 'Other') ?? 0) + (r.vB as number)));
  return (
    <div className="page">
      <PageHead eyebrow="Investments" title="Portfolio" sub="Holdings and prices are entered by you, so every figure is as accurate as your last update. Live price feeds are a later phase." />
      <Tabs value={tab} onChange={setTab} items={[{ id: 'portfolio', label: 'Portfolio' }, { id: 'holdings', label: 'Holdings' }, { id: 'capital', label: 'Business capital' }]} />
      <div style={{ marginTop: 20 }}>
        {tab === 'portfolio' && (items.length === 0 ? <Empty title="No holdings yet">Add stocks, funds, savings or other holdings in the Holdings tab.</Empty> : (
          <div className="stack" style={{ gap: 16 }}>
            <div className="grid g4">
              <div className="card"><div className="eyebrow">Value ({base})</div><div className="big-num tnum">{tv === null ? '—' : money(tv, base, 0)}</div></div>
              <div className="card"><div className="eyebrow">Cost basis</div><div className="big-num tnum">{tc === null ? '—' : money(tc, base, 0)}</div></div>
              <div className="card"><div className="eyebrow">Gain / loss</div><div className="big-num tnum" style={{ color: tv !== null && tc !== null ? (tv - tc >= 0 ? 'var(--pos)' : 'var(--neg)') : undefined }}>{tv === null || tc === null ? '—' : money(tv - tc, base, 0)}</div></div>
              <div className="card"><div className="eyebrow">Holdings</div><div className="big-num tnum">{items.length}</div></div>
            </div>
            <div className="grid g2" style={{ alignItems: 'start' }}>
              <section className="card">
                <div className="card-h"><h3>Allocation</h3></div>
                {byType.size === 0 ? <Empty title="Allocation unavailable">Rates are needed to combine currencies.</Empty> : [...byType.entries()].sort((a, b) => b[1] - a[1]).map(([t, v]) => <div key={t} style={{ marginBottom: 10 }}><div className="row between small"><span>{t}</span><span className="tnum">{((v / (tv ?? 1)) * 100).toFixed(1)}%</span></div><div className="progress" style={{ marginTop: 4 }}><i style={{ width: `${(v / (tv ?? 1)) * 100}%` }} /></div></div>)}
              </section>
              <section className="card">
                <div className="card-h"><h3>Valuation</h3></div>
                <div className="table-wrap"><table className="table"><thead><tr><th>Holding</th><th>Value</th><th>Gain</th><th>Price as of</th></tr></thead><tbody>
                  {rows.map(({ h, cur, value, cost }) => <tr key={h.id}><td><b style={{ fontWeight: 500 }}>{h.symbol}</b><div className="small muted">{h.name}</div></td><td className="tnum">{money(value, cur)}</td><td className="tnum" style={{ color: value - cost >= 0 ? 'var(--pos)' : 'var(--neg)' }}>{money(value - cost, cur)}</td><td className="small muted">{h.asof ? fmtDate(h.asof) : 'Not set'}</td></tr>)}
                </tbody></table></div>
              </section>
            </div>
          </div>
        ))}
        {tab === 'holdings' && <Collection storeKey="invest:holdings" title="Holdings" noun="holding" activityHref="/investments"
          fields={[{ key: 'symbol', label: 'Symbol / name', required: true }, { key: 'name', label: 'Description' }, { key: 'type', label: 'Type', type: 'select', options: ['Stock', 'Fund / ETF', 'Savings', 'Fixed income', 'Crypto', 'Other'] }, { key: 'units', label: 'Units', type: 'number' }, { key: 'buy', label: 'Buy price', type: 'number' }, { key: 'price', label: 'Current price', type: 'number' }, { key: 'asof', label: 'Price as of', type: 'date' }, { key: 'currency', label: 'Currency', type: 'select', options: CURRENCIES, defaultValue: 'USD', required: true }]}
          emptyTitle="No holdings" emptyHint="Enter units, what you paid and the latest price you know." />}
        {tab === 'capital' && <><p className="muted" style={{ marginTop: 0 }}>Money you have put into your own ventures. This is invested capital, not profit.</p><Collection storeKey="invest:capital" title="Capital invested in ventures" noun="investment" activityHref="/investments"
          fields={[{ key: 'venture', label: 'Venture', type: 'select', options: ['WAYKON Holdings', 'Plot42', 'Fieldwork', 'WAYKON Media'], required: true }, { key: 'amount', label: 'Amount', type: 'number', required: true }, { key: 'currency', label: 'Currency', type: 'select', options: CURRENCIES, defaultValue: 'NGN', required: true }, { key: 'date', label: 'Date', type: 'date' }, { key: 'note', label: 'Note' }]} emptyTitle="No capital recorded" /></>}
      </div>
    </div>
  );
}
