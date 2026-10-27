'use client';
import { Check, Plus, Trash2 } from 'lucide-react';
import { Empty, PageHead, openQuickAdd } from '@/components/ui';
import { useCollection, logActivity } from '@/lib/store';
import { daysUntil, fmtDate, isoToday } from '@/lib/dates';
import { areaLabel } from '@/lib/themes';
import type { Waiting } from '@/lib/types';

export default function WaitingRoom() {
  const { items, update, remove } = useCollection<Waiting>('waiting');
  const open = items.filter((w) => !w.resolved).sort((a, b) => (a.expected ?? '9999').localeCompare(b.expected ?? '9999'));
  const done = items.filter((w) => w.resolved);
  const waited = (w: Waiting) => Math.max(0, -(daysUntil(w.asked) ?? 0));
  return (
    <div className="page">
      <PageHead eyebrow="Waiting room" title="Waiting on others" sub="Replies, quotes, payments and approvals you have asked for and not yet received. Late items nudge you." actions={<button className="btn btn-primary" onClick={() => openQuickAdd('waiting')}><Plus size={15} /> Add</button>} />
      <section className="card">
        <div className="card-h"><h3>Still waiting</h3><span className="chip">{open.length}</span></div>
        {open.length === 0 ? <Empty title="Not waiting on anyone">Add anything you are chasing so it cannot slip.</Empty> : (
          <div className="table-wrap"><table className="table"><thead><tr><th>What</th><th>From</th><th>Asked</th><th>Expected</th><th>Area</th><th aria-label="Actions" /></tr></thead><tbody>
            {open.map((w) => { const late = w.expected && (daysUntil(w.expected) ?? 0) < 0; return <tr key={w.id}><td style={{ fontWeight: 500 }}>{w.what}</td><td>{w.who}</td><td>{fmtDate(w.asked, { day: 'numeric', month: 'short' })} <span className="muted small">({waited(w)}d)</span></td><td>{w.expected ? <>{fmtDate(w.expected, { day: 'numeric', month: 'short' })} {late && <span className="chip chip-neg">Late</span>}</> : <span className="muted">—</span>}</td><td>{areaLabel(w.area)}</td>
              <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}><button className="btn btn-sm" onClick={() => { update(w.id, { resolved: true }); logActivity(`Received: ${w.what} from ${w.who}`, 'waiting', '/waiting'); }}><Check size={13} /> Received</button> <button className="btn btn-ghost btn-sm btn-danger" onClick={() => confirm('Delete this item?') && remove(w.id)} aria-label="Delete"><Trash2 size={13} /></button></td></tr>; })}
          </tbody></table></div>
        )}
      </section>
      {done.length > 0 && <section className="card" style={{ marginTop: 16 }}><div className="card-h"><h3>Received</h3></div>{done.slice(0, 15).map((w) => <div key={w.id} className="row between" style={{ padding: '8px 0', borderTop: '1px solid var(--line)' }}><span className="muted">{w.what} · {w.who}</span><button className="btn btn-ghost btn-sm" onClick={() => update(w.id, { resolved: false, asked: isoToday() })}>Reopen</button></div>)}</section>}
    </div>
  );
}
