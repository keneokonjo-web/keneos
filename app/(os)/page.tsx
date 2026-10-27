'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Calendar, Eye, EyeOff, Inbox, Target, Wallet, HeartPulse, Briefcase, Hourglass, Sparkles } from 'lucide-react';
import { JarvisPanel } from '@/components/JarvisPanel';
import { QuickTaskInput, TaskRow, isPriority, useTasks } from '@/components/TaskList';
import { Empty, openQuickAdd } from '@/components/ui';
import { useStore } from '@/lib/store';
import { useSettings } from '@/lib/settings';
import { addDays, daysUntil, fmtDate, isoToday } from '@/lib/dates';
import { VENTURES } from '@/lib/themes';
import { convert, money } from '@/lib/finance';
import { useRates } from '@/lib/useRates';
import { useNotices } from '@/lib/notify';
import type { Account, CalEvent, Goal, Habit, SavingsGoal, Waiting } from '@/lib/types';

function Card({ title, icon, href, children }: { title: string; icon: React.ReactNode; href?: string; children: React.ReactNode }) {
  return (
    <section className="card">
      <div className="card-h">
        <h3><span className="icotile">{icon}</span>{title}</h3>
        {href && <Link href={href} className="iconbtn" aria-label={`Open ${title}`} style={{ width: 30, height: 30 }}><ArrowUpRight size={14} /></Link>}
      </div>
      {children}
    </section>
  );
}

export default function Home() {
  const [s] = useSettings();
  const { items: tasks, toggle } = useTasks();
  const [hello, setHello] = useState('');
  const [today, setToday] = useState('');
  const notices = useNotices();
  useEffect(() => {
    const h = new Date().getHours();
    setHello(h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening');
    setToday(new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }));
  }, []);
  const show = (k: string) => s.home[k] !== false;

  return (
    <div className="page home">
      <style>{css}</style>
      <div className="home-grid">
        <div className="col l">
          {show('brief') && <Brief hello={hello} today={today} name={s.ownerName} counts={{ overdue: tasks.filter((t) => !t.done && t.due && t.due < isoToday()).length, dueToday: tasks.filter((t) => !t.done && t.due === isoToday()).length, urgent: notices.filter((n) => n.severity !== 'info').length }} />}
          {show('priorities') && <Priorities tasks={tasks} toggle={toggle} />}
          {show('goals') && <GoalsCard />}
        </div>
        <div className="col c"><JarvisPanel /></div>
        <div className="col r">
          {show('calendar') && <CalendarCard />}
          {show('inbox') && (
            <Card title="Important inbox" icon={<Inbox size={16} />} href="/settings#integrations">
              <Empty title="Gmail is not connected">Important mail will appear here once Gmail is linked. <Link href="/settings#integrations" className="hl">See integrations</Link></Empty>
            </Card>
          )}
          {show('waiting') && <WaitingCard />}
        </div>
      </div>
      <div className="grid g4" style={{ marginTop: 16 }}>
        {show('business') && <BusinessCard />}
        {show('money') && <MoneyCard hide={s.hideBalances} base={s.baseCurrency} />}
        {show('health') && <HealthCard />}
        {show('quick') && (
          <Card title="Quick actions" icon={<Sparkles size={16} />}>
            <div className="stack" style={{ gap: 8 }}>
              {[['task', 'Add task'], ['expense', 'Log expense'], ['note', 'Add note'], ['idea', 'Capture content idea'], ['waiting', 'Add to waiting room']].map(([t, l]) => (
                <button key={t} className="btn" style={{ justifyContent: 'flex-start' }} onClick={() => openQuickAdd(t)}>{l}</button>
              ))}
              <Link href="/reviews" className="btn" style={{ justifyContent: 'flex-start' }}>Start weekly review</Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

function Brief({ hello, today, name, counts }: { hello: string; today: string; name: string; counts: { overdue: number; dueToday: number; urgent: number } }) {
  const [events] = useStore<CalEvent[]>('events', []);
  const next = [...events].filter((e) => e.date >= isoToday()).sort((a, b) => (a.date + (a.time ?? '')).localeCompare(b.date + (b.time ?? '')))[0];
  const lines: string[] = [];
  if (counts.overdue) lines.push(`${counts.overdue} overdue task${counts.overdue > 1 ? 's' : ''}`);
  if (counts.dueToday) lines.push(`${counts.dueToday} due today`);
  if (next) lines.push(`Next: ${next.title}, ${fmtDate(next.date, { day: 'numeric', month: 'short' })}${next.time ? ' ' + next.time : ''}`);
  return (
    <section className="card">
      <div className="eyebrow">{today || ' '}</div>
      <h2 className="display" style={{ fontSize: 30, margin: '8px 0 12px', lineHeight: 1.1 }}>{hello || 'Hello'}, {name}.</h2>
      {lines.length ? (
        <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--ink-2)' }}>{lines.map((l) => <li key={l}>{l}</li>)}</ul>
      ) : (
        <p className="muted" style={{ margin: 0 }}>Nothing is scheduled or overdue. Add tasks or priorities to shape the day.</p>
      )}
      {counts.urgent > 0 && <Link href="/activity" className="chip chip-neg" style={{ marginTop: 12 }}>{counts.urgent} item{counts.urgent > 1 ? 's' : ''} need attention</Link>}
    </section>
  );
}

function Priorities({ tasks, toggle }: { tasks: ReturnType<typeof useTasks>['items']; toggle: ReturnType<typeof useTasks>['toggle'] }) {
  const [f, setF] = useState('all');
  const doneToday = tasks.filter((t) => t.done && t.doneAt?.slice(0, 10) === isoToday());
  const pri = [...tasks.filter(isPriority), ...doneToday].filter((t) => f === 'all' || (f === 'business' ? t.area.startsWith('business') : t.area === f));
  return (
    <section className="card">
      <div className="card-h">
        <h3><span className="icotile"><Target size={16} /></span>Today&apos;s priorities</h3>
        <span className="chip">{doneToday.length} done</span>
      </div>
      <div className="row wrap" style={{ gap: 6, marginBottom: 6 }}>
        {[['all', 'All'], ['business', 'Business'], ['school', 'School'], ['personal', 'Personal'], ['health', 'Health']].map(([k, l]) => (
          <button key={k} className={`chip ${f === k ? 'chip-solid' : ''}`} onClick={() => setF(k)}>{l}</button>
        ))}
      </div>
      {pri.length === 0 ? <Empty title="No priorities set">Mark tasks for today, or add one below.</Empty> : pri.slice(0, 8).map((t) => <TaskRow key={t.id} t={t} toggle={toggle} />)}
      <QuickTaskInput />
    </section>
  );
}

function GoalsCard() {
  const [goals] = useStore<Goal[]>('goals', []);
  const list = goals.filter((g) => g.horizon !== 'long').slice(0, 4);
  return (
    <Card title="Goal progress" icon={<Target size={16} />} href="/goals">
      {list.length === 0 ? <Empty title="No goals yet">Set an annual or 90-day goal.</Empty> : (
        <div className="stack" style={{ gap: 14 }}>
          {list.map((g) => (
            <div key={g.id}>
              <div className="row between small"><span>{g.title}</span><span className="tnum muted">{g.progress}%</span></div>
              <div className="progress" style={{ marginTop: 6 }}><i style={{ width: `${g.progress}%` }} /></div>
              {g.next && <div className="small muted" style={{ marginTop: 4 }}>Next: {g.next}</div>}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function CalendarCard() {
  const [events] = useStore<CalEvent[]>('events', []);
  const { items: tasks } = useTasks();
  const days = [0, 1, 2, 3].map((n) => addDays(isoToday(), n));
  const rows = days.map((d) => ({
    d,
    items: [
      ...events.filter((e) => e.date === d).map((e) => ({ k: 'e' + e.id, t: e.title, time: e.time })),
      ...tasks.filter((t) => !t.done && t.due === d).map((t) => ({ k: 't' + t.id, t: t.title, time: 'Due' })),
    ],
  }));
  const any = rows.some((r) => r.items.length);
  return (
    <Card title="Calendar" icon={<Calendar size={16} />} href="/plan">
      {!any ? <Empty title="Nothing in the next 4 days">Add events in Plan. Google Calendar is not connected yet.</Empty> : (
        <div className="stack" style={{ gap: 10 }}>
          {rows.filter((r) => r.items.length).map((r) => (
            <div key={r.d}>
              <div className="eyebrow">{r.d === isoToday() ? 'Today' : fmtDate(r.d, { weekday: 'short', day: 'numeric', month: 'short' })}</div>
              {r.items.map((i) => <div key={i.k} className="row between" style={{ padding: '5px 0' }}><span>{i.t}</span><span className="muted small">{i.time}</span></div>)}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function WaitingCard() {
  const [w] = useStore<Waiting[]>('waiting', []);
  const open = w.filter((x) => !x.resolved).slice(0, 4);
  return (
    <Card title="Waiting room" icon={<Hourglass size={16} />} href="/waiting">
      {open.length === 0 ? <Empty title="Not waiting on anyone" /> : open.map((x) => {
        const late = x.expected && (daysUntil(x.expected) ?? 0) < 0;
        return <div key={x.id} className="row between" style={{ padding: '7px 0', borderTop: '1px solid var(--line)' }}><div><div>{x.what}</div><div className="small muted">{x.who}</div></div>{late && <span className="chip chip-neg">Late</span>}</div>;
      })}
    </Card>
  );
}

function BusinessCard() {
  const [events] = useStore<{ id: string; name: string; date?: string }[]>('biz:plot42:events', []);
  const nextEvent = [...events].filter((e) => e.date && e.date >= isoToday()).sort((a, b) => a.date!.localeCompare(b.date!))[0];
  return (
    <Card title="Business pulse" icon={<Briefcase size={16} />} href="/businesses">
      <div className="stack" style={{ gap: 0 }}>
        {VENTURES.map((v) => (
          <Link key={v.slug} href={`/businesses/${v.slug}`} style={{ padding: '9px 0', borderTop: '1px solid var(--line)' }}>
            <div className="row between"><b style={{ fontWeight: 500 }}>{v.name}</b><ArrowUpRight size={13} className="muted" /></div>
            <div className="small muted">{v.slug === 'plot42' && nextEvent ? `${nextEvent.name}: ${daysUntil(nextEvent.date)} days to go` : v.status}</div>
          </Link>
        ))}
      </div>
    </Card>
  );
}

function MoneyCard({ hide: hideDefault, base }: { hide: boolean; base: string }) {
  const [accounts] = useStore<Account[]>('accounts', []);
  const [savings] = useStore<SavingsGoal[]>('savings', []);
  const { rates } = useRates();
  const [hide, setHide] = useState(hideDefault);
  const personal = accounts.filter((a) => a.scope !== 'business');
  const conv = personal.map((a) => convert(a.balance, a.currency, base, rates));
  const ok = conv.every((c) => c !== null);
  const total = ok ? (conv as number[]).reduce((x, y) => x + y, 0) : null;
  const mask = (v: string) => (hide ? '••••••' : v);
  const saved = savings.map((g) => convert(g.saved, g.currency, base, rates));
  const savedTotal = saved.every((c) => c !== null) ? (saved as number[]).reduce((x, y) => x + y, 0) : null;
  return (
    <Card title="Money" icon={<Wallet size={16} />} href="/finance">
      {accounts.length === 0 ? <Empty title="No accounts yet">Add your accounts and wallets in Personal finance.</Empty> : (
        <>
          <div className="row between"><span className="eyebrow">Balance ({base})</span><button className="iconbtn" style={{ width: 28, height: 28 }} onClick={() => setHide(!hide)} aria-label={hide ? 'Show balances' : 'Hide balances'}>{hide ? <EyeOff size={14} /> : <Eye size={14} />}</button></div>
          <div className="big-num tnum">{total === null ? 'Rates unavailable' : mask(money(total, base, 0))}</div>
          <div className="small muted">Manual balances across {personal.length} account{personal.length === 1 ? '' : 's'}</div>
          {savings.length > 0 && <><hr className="sep" /><div className="row between small"><span className="muted">Total saved</span><b className="tnum">{savedTotal === null ? '—' : mask(money(savedTotal, base, 0))}</b></div></>}
        </>
      )}
    </Card>
  );
}

function HealthCard() {
  const [habits, setHabits] = useStore<Habit[]>('habits', []);
  const t = isoToday();
  const toggle = (id: string) => setHabits((p) => p.map((h) => (h.id === id ? { ...h, days: h.days.includes(t) ? h.days.filter((d) => d !== t) : [...h.days, t] } : h)));
  return (
    <Card title="Health and routine" icon={<HeartPulse size={16} />} href="/health">
      {habits.length === 0 ? <Empty title="No habits yet">Add the habits you want to track in Health and routine.</Empty> : habits.slice(0, 6).map((h) => (
        <label key={h.id} className="row" style={{ padding: '6px 0' }}><input type="checkbox" className="check" checked={h.days.includes(t)} onChange={() => toggle(h.id)} /> <span>{h.name}</span></label>
      ))}
    </Card>
  );
}

const css = `
.home{max-width:1560px}
.home-grid{display:grid;grid-template-columns:minmax(300px,360px) minmax(0,1fr) minmax(300px,360px);gap:16px;align-items:start}
.home-grid .col{display:flex;flex-direction:column;gap:16px;min-width:0}
@media(max-width:1180px){.home-grid{grid-template-columns:1fr 1fr}.home-grid .c{grid-column:1 / -1;order:-1}}
@media(max-width:720px){.home-grid{grid-template-columns:1fr}}
`;
