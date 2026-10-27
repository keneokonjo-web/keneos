'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { EmptyTasks, TaskRow, isPriority, useTasks } from '@/components/TaskList';
import { Empty, Field, Modal, PageHead, Tabs, openQuickAdd } from '@/components/ui';
import { useCollection, logActivity } from '@/lib/store';
import { addDays, fmtDate, isoToday, startOfWeek } from '@/lib/dates';
import { AREAS, areaLabel } from '@/lib/themes';
import type { CalEvent } from '@/lib/types';

type Tab = 'today' | 'week' | 'tasks' | 'calendar';

export default function Plan() {
  const [tab, setTab] = useState<Tab>('today');
  return (
    <div className="page">
      <PageHead eyebrow="Plan" title="Plan the day and the week" sub="One task system across business, school, health and personal. Everything with a date also shows on the calendar."
        actions={<button className="btn btn-primary" onClick={() => openQuickAdd('task')}><Plus size={16} /> Add task</button>} />
      <Tabs value={tab} onChange={setTab} items={[{ id: 'today', label: 'Today' }, { id: 'week', label: 'Week' }, { id: 'tasks', label: 'All tasks' }, { id: 'calendar', label: 'Calendar' }]} />
      <div style={{ marginTop: 20 }}>
        {tab === 'today' && <Today />}
        {tab === 'week' && <Week />}
        {tab === 'tasks' && <AllTasks />}
        {tab === 'calendar' && <MonthCalendar />}
      </div>
    </div>
  );
}

function Today() {
  const { items, toggle, update, remove } = useTasks();
  const { add: addJournal } = useCollection('journal');
  const [reflect, setReflect] = useState('');
  const pri = items.filter(isPriority);
  const backlog = items.filter((t) => !t.done && !isPriority(t));
  const doneToday = items.filter((t) => t.done && t.doneAt?.slice(0, 10) === isoToday());
  return (
    <div className="grid g2">
      <section className="card">
        <div className="card-h"><h3>Priorities for today</h3><span className="chip">{pri.length} open</span></div>
        {pri.length === 0 ? <EmptyTasks text="Pick up to three things that make the day a success from the list on the right." /> : pri.map((t) => <TaskRow key={t.id} t={t} toggle={toggle} remove={remove} />)}
        {doneToday.length > 0 && <><hr className="sep" /><div className="eyebrow" style={{ marginBottom: 6 }}>Done today</div>{doneToday.map((t) => <TaskRow key={t.id} t={t} toggle={toggle} />)}</>}
      </section>
      <div className="stack" style={{ gap: 16 }}>
        <section className="card">
          <div className="card-h"><h3>Plan the day</h3></div>
          {backlog.length === 0 ? <EmptyTasks text="No other open tasks. Add some with Quick add." /> : backlog.slice(0, 12).map((t) => (
            <div key={t.id} className="row between" style={{ padding: '8px 0', borderTop: '1px solid var(--line)' }}>
              <div><div>{t.title}</div><div className="small muted">{areaLabel(t.area)}{t.due ? ` · due ${fmtDate(t.due, { day: 'numeric', month: 'short' })}` : ''}</div></div>
              <button className="btn btn-sm" onClick={() => update(t.id, { today: true })}>Add to today</button>
            </div>
          ))}
        </section>
        <section className="card">
          <div className="card-h"><h3>End-of-day shutdown</h3></div>
          <textarea className="textarea" value={reflect} onChange={(e) => setReflect(e.target.value)} placeholder="What went well, what didn’t, and tomorrow’s top three?" />
          <div className="row" style={{ justifyContent: 'flex-end', marginTop: 10 }}>
            <button className="btn btn-primary btn-sm" disabled={!reflect.trim()} onClick={() => { addJournal({ text: reflect.trim(), kind: 'Daily review', date: isoToday() } as never); logActivity('Saved a daily review', 'review', '/reviews'); setReflect(''); }}>Save to journal</button>
          </div>
        </section>
      </div>
    </div>
  );
}

function Week() {
  const { items } = useTasks();
  const { items: events } = useCollection<CalEvent>('events');
  const start = startOfWeek();
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  const overdue = items.filter((t) => !t.done && t.due && t.due < isoToday());
  return (
    <div className="stack" style={{ gap: 16 }}>
      {overdue.length > 0 && <section className="card" style={{ borderColor: 'rgba(210,122,110,.4)' }}><div className="card-h"><h3>Overdue ({overdue.length})</h3></div>{overdue.map((t) => <div key={t.id} className="row between" style={{ padding: '6px 0' }}><span>{t.title}</span><span className="chip chip-neg">{fmtDate(t.due, { day: 'numeric', month: 'short' })}</span></div>)}</section>}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))' }}>
        {days.map((d) => {
          const t = items.filter((x) => x.due === d);
          const e = events.filter((x) => x.date === d);
          return (
            <section key={d} className="card" style={d === isoToday() ? { borderColor: 'var(--line-strong)' } : undefined}>
              <div className="eyebrow">{fmtDate(d, { weekday: 'short' })}</div>
              <div style={{ fontSize: 22, margin: '2px 0 10px' }}>{fmtDate(d, { day: 'numeric', month: 'short' })}</div>
              {e.length + t.length === 0 && <span className="muted small">Free</span>}
              {e.map((x) => <div key={x.id} className="small" style={{ padding: '3px 0' }}>{x.time && <span className="muted">{x.time} </span>}{x.title}</div>)}
              {t.map((x) => <div key={x.id} className="small" style={{ padding: '3px 0', color: x.done ? 'var(--muted)' : 'var(--ink-2)', textDecoration: x.done ? 'line-through' : 'none' }}>• {x.title}</div>)}
            </section>
          );
        })}
      </div>
    </div>
  );
}

function AllTasks() {
  const { items, toggle, remove } = useTasks();
  const [area, setArea] = useState('all');
  const [show, setShow] = useState<'open' | 'done' | 'all'>('open');
  const list = items.filter((t) => (area === 'all' || t.area === area) && (show === 'all' || (show === 'open' ? !t.done : t.done)));
  const order = { high: 0, normal: 1, low: 2 } as const;
  list.sort((a, b) => Number(a.done) - Number(b.done) || (a.due ?? '9999').localeCompare(b.due ?? '9999') || order[a.priority] - order[b.priority]);
  return (
    <section className="card">
      <div className="row wrap" style={{ marginBottom: 12 }}>
        <select className="select" style={{ width: 200 }} value={area} onChange={(e) => setArea(e.target.value)} aria-label="Filter by area"><option value="all">All areas</option>{AREAS.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}</select>
        <Tabs value={show} onChange={setShow} items={[{ id: 'open', label: 'Open' }, { id: 'done', label: 'Done' }, { id: 'all', label: 'All' }]} />
      </div>
      {list.length === 0 ? <EmptyTasks text="No tasks match. Use Add task to create one." /> : list.map((t) => <TaskRow key={t.id} t={t} toggle={toggle} remove={remove} />)}
    </section>
  );
}

function MonthCalendar() {
  const [cursor, setCursor] = useState(() => isoToday().slice(0, 7));
  const [sel, setSel] = useState(isoToday());
  const [adding, setAdding] = useState(false);
  const { items: events, add, remove } = useCollection<CalEvent>('events');
  const { items: tasks } = useTasks();
  const [y, m] = cursor.split('-').map(Number);
  const first = new Date(y, m - 1, 1);
  const lead = (first.getDay() + 6) % 7;
  const total = new Date(y, m, 0).getDate();
  const cells = Array.from({ length: Math.ceil((lead + total) / 7) * 7 }, (_, i) => { const d = i - lead + 1; return d >= 1 && d <= total ? `${cursor}-${String(d).padStart(2, '0')}` : null; });
  const shift = (n: number) => { const d = new Date(y, m - 1 + n, 1); setCursor(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`); };
  const dayEvents = events.filter((e) => e.date === sel);
  const dayTasks = tasks.filter((t) => t.due === sel);
  return (
    <div className="grid" style={{ gridTemplateColumns: 'minmax(0,2fr) minmax(280px,1fr)' }}>
      <section className="card">
        <div className="card-h">
          <h3>{first.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</h3>
          <div className="row" style={{ gap: 6 }}><button className="iconbtn" onClick={() => shift(-1)} aria-label="Previous month"><ChevronLeft size={16} /></button><button className="btn btn-sm" onClick={() => { setCursor(isoToday().slice(0, 7)); setSel(isoToday()); }}>Today</button><button className="iconbtn" onClick={() => shift(1)} aria-label="Next month"><ChevronRight size={16} /></button></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => <div key={d} className="eyebrow" style={{ textAlign: 'center', padding: 4 }}>{d}</div>)}
          {cells.map((d, i) => {
            if (!d) return <div key={i} />;
            const n = events.filter((e) => e.date === d).length + tasks.filter((t) => !t.done && t.due === d).length;
            return (
              <button key={d} onClick={() => setSel(d)} aria-label={fmtDate(d)} style={{ minHeight: 64, textAlign: 'left', padding: 8, borderRadius: 10, border: `1px solid ${sel === d ? 'var(--ink)' : 'var(--line)'}`, background: d === isoToday() ? 'var(--surface-3)' : 'transparent' }}>
                <div className="small">{Number(d.slice(8))}</div>
                {n > 0 && <div className="chip" style={{ marginTop: 6, height: 18, padding: '0 6px' }}>{n}</div>}
              </button>
            );
          })}
        </div>
        <p className="small muted" style={{ marginBottom: 0 }}>Google Calendar is not connected yet, so this shows events you add here plus task due dates.</p>
      </section>
      <section className="card">
        <div className="card-h"><h3>{fmtDate(sel, { weekday: 'long', day: 'numeric', month: 'long' })}</h3><button className="btn btn-sm btn-primary" onClick={() => setAdding(true)}><Plus size={14} /> Event</button></div>
        {dayEvents.length + dayTasks.length === 0 && <Empty title="Nothing on this day" />}
        {dayEvents.map((e) => <div key={e.id} className="row between" style={{ padding: '8px 0', borderTop: '1px solid var(--line)' }}><div><div>{e.title}</div><div className="small muted">{e.time || 'All day'}{e.area ? ` · ${areaLabel(e.area)}` : ''}</div></div><button className="btn btn-ghost btn-sm btn-danger" onClick={() => confirm('Delete this event?') && remove(e.id)} aria-label="Delete event"><Trash2 size={14} /></button></div>)}
        {dayTasks.map((t) => <div key={t.id} className="small" style={{ padding: '8px 0', borderTop: '1px solid var(--line)' }}>Task due: {t.title}</div>)}
      </section>
      {adding && (
        <Modal title="Add event" onClose={() => setAdding(false)}>
          <form className="stack" onSubmit={(e) => { e.preventDefault(); const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>; if (!f.title.trim()) return; add({ title: f.title.trim(), date: f.date, time: f.time || undefined, area: f.area } as never); logActivity(`Added event: ${f.title.trim()}`, 'event', '/plan'); setAdding(false); }}>
            <Field label="Title"><input className="input" name="title" autoFocus /></Field>
            <div className="formgrid"><Field label="Date"><input className="input" type="date" name="date" defaultValue={sel} required /></Field><Field label="Time"><input className="input" type="time" name="time" /></Field><Field label="Area"><select className="select" name="area">{AREAS.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}</select></Field></div>
            <div className="row" style={{ justifyContent: 'flex-end' }}><button type="button" className="btn" onClick={() => setAdding(false)}>Cancel</button><button className="btn btn-primary">Add</button></div>
          </form>
        </Modal>
      )}
    </div>
  );
}
