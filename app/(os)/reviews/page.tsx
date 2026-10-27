'use client';
import { useState } from 'react';
import { Printer } from 'lucide-react';
import { Empty, Field, PageHead, Tabs } from '@/components/ui';
import { useCollection, useStore, logActivity } from '@/lib/store';
import { fmtDate, isoToday, startOfWeek, addDays } from '@/lib/dates';
import { money, convert } from '@/lib/finance';
import { useRates } from '@/lib/useRates';
import { useSettings } from '@/lib/settings';
import type { Habit, Journal, Task, Txn } from '@/lib/types';

type Review = { id: string; createdAt: string; date: string; kind: string; wins?: string; lessons?: string; next?: string };

export default function Reviews() {
  const [tab, setTab] = useState<'weekly' | 'monthly' | 'history'>('weekly');
  const { items: reviews, add, remove } = useCollection<Review>('reviews');
  const [saved, setSaved] = useState(false);
  const [s] = useSettings();
  const { rates } = useRates();
  const { items: tasks } = useCollection<Task>('tasks');
  const [habits] = useStore<Habit[]>('habits', []);
  const { items: txns } = useCollection<Txn>('txns');
  const { items: journal } = useCollection<Journal>('journal');
  const { items: sessions } = useCollection<{ id: string; createdAt: string; date?: string; minutes?: number }>('edu:sessions');
  const { items: workouts } = useCollection<{ id: string; createdAt: string; date?: string }>('health:workouts');
  const monthly = tab === 'monthly';
  const from = monthly ? isoToday().slice(0, 7) + '-01' : startOfWeek();
  const to = monthly ? '9999' : addDays(from, 6);
  const inRange = (d?: string) => !!d && d >= from && d <= to;
  const done = tasks.filter((t) => t.done && t.doneAt && inRange(t.doneAt.slice(0, 10)));
  const overdue = tasks.filter((t) => !t.done && t.due && t.due < isoToday());
  const days = monthly ? new Date().getDate() : 7;
  const habitTotal = habits.length * days;
  const habitDone = habits.reduce((n, h) => n + h.days.filter(inRange).length, 0);
  const mins = sessions.filter((x) => inRange(x.date)).reduce((a, x) => a + (x.minutes ?? 0), 0);
  const flow = (type: 'income' | 'expense') => { const rows = txns.filter((t) => t.type === type && t.scope === 'personal' && inRange(t.date)); const c = rows.map((t) => convert(t.amount, t.currency, s.baseCurrency, rates)); return c.every((x) => x !== null) ? (c as number[]).reduce((a, b) => a + b, 0) : null; };
  const inc = flow('income'), exp = flow('expense');
  const rows: [string, string, string][] = [
    ['Tasks completed', String(done.length), done.length ? done.slice(0, 6).map((t) => t.title).join(', ') : 'None completed in this period.'],
    ['Overdue now', String(overdue.length), overdue.length ? overdue.slice(0, 5).map((t) => t.title).join(', ') : 'Nothing overdue.'],
    ['Habits', habitTotal ? `${Math.round((habitDone / habitTotal) * 100)}%` : '—', habitTotal ? `${habitDone} of ${habitTotal} check-ins` : 'No habits tracked.'],
    ['Study time', `${Math.floor(mins / 60)}h ${mins % 60}m`, mins ? 'From logged revision sessions.' : 'No sessions logged.'],
    ['Workouts', String(workouts.filter((w) => inRange(w.date)).length), 'From the workout log.'],
    ['Personal money in / out', inc === null || exp === null ? '—' : `${money(inc, s.baseCurrency, 0)} / ${money(exp, s.baseCurrency, 0)}`, 'Actual, logged transactions only. Transfers excluded.'],
    ['Journal entries', String(journal.filter((j) => inRange(j.date)).length), ''],
  ];
  return (
    <div className="page">
      <PageHead eyebrow="Reviews and reports" title="Review" sub="The numbers come only from what you have logged. Missing data shows as empty, never as a guess." actions={<button className="btn" onClick={() => window.print()}><Printer size={15} /> Print / save PDF</button>} />
      <Tabs value={tab} onChange={setTab} items={[{ id: 'weekly', label: 'This week' }, { id: 'monthly', label: 'This month' }, { id: 'history', label: 'Past reviews' }]} />
      {tab !== 'history' && (
        <div className="grid g2" style={{ marginTop: 20, alignItems: 'start' }}>
          <section className="card">
            <div className="card-h"><h3>{monthly ? 'Month so far' : `Week of ${fmtDate(from, { day: 'numeric', month: 'short' })}`}</h3></div>
            {rows.map(([l, v, n]) => <div key={l} style={{ padding: '10px 0', borderTop: '1px solid var(--line)' }}><div className="row between"><span>{l}</span><b className="tnum" style={{ fontWeight: 500 }}>{v}</b></div>{n && <div className="small muted">{n}</div>}</div>)}
          </section>
          <section className="card">
            <div className="card-h"><h3>Reflect and plan</h3></div>
            <form className="stack" key={tab + String(saved)} onSubmit={(e) => { e.preventDefault(); const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>; add({ date: isoToday(), kind: monthly ? 'Monthly review' : 'Weekly review', wins: f.wins, lessons: f.lessons, next: f.next } as never); logActivity(`Saved a ${monthly ? 'monthly' : 'weekly'} review`, 'review', '/reviews'); setSaved(!saved); }}>
              <Field label="What went well"><textarea className="textarea" name="wins" /></Field>
              <Field label="What didn’t, and why"><textarea className="textarea" name="lessons" /></Field>
              <Field label={monthly ? 'Focus for next month' : 'Top three for next week'}><textarea className="textarea" name="next" /></Field>
              <div><button className="btn btn-primary">Save review</button></div>
            </form>
          </section>
        </div>
      )}
      {tab === 'history' && (
        <section className="card" style={{ marginTop: 20 }}>
          {reviews.length === 0 ? <Empty title="No reviews saved yet" /> : reviews.map((r) => <div key={r.id} style={{ padding: '14px 0', borderTop: '1px solid var(--line)' }}><div className="row between"><b style={{ fontWeight: 500 }}>{r.kind} <span className="muted small">{fmtDate(r.date)}</span></b><button className="btn btn-ghost btn-sm btn-danger" onClick={() => confirm('Delete this review?') && remove(r.id)}>Delete</button></div>{r.wins && <p className="small" style={{ margin: '6px 0 0' }}><b>Went well:</b> {r.wins}</p>}{r.lessons && <p className="small" style={{ margin: '4px 0 0' }}><b>Didn’t:</b> {r.lessons}</p>}{r.next && <p className="small" style={{ margin: '4px 0 0' }}><b>Next:</b> {r.next}</p>}</div>)}
        </section>
      )}
    </div>
  );
}
