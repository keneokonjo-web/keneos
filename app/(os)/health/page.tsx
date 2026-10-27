'use client';
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Collection } from '@/components/Collection';
import { BarChart } from '@/components/BarChart';
import { Empty, PageHead, Tabs } from '@/components/ui';
import { useCollection, useStore, logActivity } from '@/lib/store';
import { addDays, fmtDate, isoToday, startOfWeek } from '@/lib/dates';
import type { Habit } from '@/lib/types';

type Tab = 'dashboard' | 'habits' | 'sleep' | 'exercise' | 'food' | 'energy' | 'care';
const TABS: { id: Tab; label: string }[] = [{ id: 'dashboard', label: 'Dashboard' }, { id: 'habits', label: 'Habits' }, { id: 'sleep', label: 'Sleep' }, { id: 'exercise', label: 'Exercise' }, { id: 'food', label: 'Food' }, { id: 'energy', label: 'Energy' }, { id: 'care', label: 'Personal care' }];

export default function Health() {
  const [tab, setTab] = useState<Tab>('dashboard');
  return (
    <div className="page">
      <PageHead eyebrow="Health and routine" title="Body, food and habits" sub="A dashboard first. Open any section to log or plan in detail." />
      <Tabs value={tab} onChange={setTab} items={TABS} />
      <div style={{ marginTop: 20 }}>
        {tab === 'dashboard' && <Dashboard go={setTab} />}
        {tab === 'habits' && <Habits />}
        {tab === 'sleep' && <Sleep />}
        {tab === 'exercise' && <Exercise />}
        {tab === 'food' && <Food />}
        {tab === 'energy' && <Energy />}
        {tab === 'care' && <Care />}
      </div>
    </div>
  );
}

type Sl = { id: string; createdAt: string; date?: string; hours?: number; quality?: number };
type Wk = { id: string; createdAt: string; date?: string; workout?: string; minutes?: number };
type En = { id: string; createdAt: string; date?: string; energy?: number; mood?: number };
type Meal = { id: string; createdAt: string; day?: string; meal?: string; dish?: string; prep?: string };

function Dashboard({ go }: { go: (t: Tab) => void }) {
  const [habits] = useStore<Habit[]>('habits', []);
  const { items: sleep } = useCollection<Sl>('health:sleep');
  const { items: wk } = useCollection<Wk>('health:workouts');
  const { items: en } = useCollection<En>('health:energy');
  const { items: meals } = useCollection<Meal>('health:meals');
  const t = isoToday();
  const last = [...sleep].sort((a, b) => String(b.date).localeCompare(String(a.date)))[0];
  const week = wk.filter((w) => (w.date ?? '') >= startOfWeek()).length;
  const e = [...en].sort((a, b) => String(b.date).localeCompare(String(a.date)))[0];
  const dow = new Date().toLocaleDateString('en-GB', { weekday: 'long' });
  const todayMeals = meals.filter((m) => m.day === dow);
  const done = habits.filter((h) => h.days.includes(t)).length;
  const card = (title: string, tab: Tab, body: React.ReactNode) => <button className="card" style={{ textAlign: 'left' }} onClick={() => go(tab)}><div className="eyebrow">{title}</div><div style={{ marginTop: 8 }}>{body}</div></button>;
  return (
    <div className="grid g3">
      {card('Habits today', 'habits', habits.length ? <div className="big-num tnum">{done}/{habits.length}</div> : <span className="muted">No habits yet</span>)}
      {card('Last sleep', 'sleep', last ? <><div className="big-num tnum">{last.hours}h</div><div className="small muted">{fmtDate(last.date, { day: 'numeric', month: 'short' })}</div></> : <span className="muted">Nothing logged</span>)}
      {card('Workouts this week', 'exercise', <div className="big-num tnum">{week}</div>)}
      {card(`Meals planned for ${dow}`, 'food', todayMeals.length ? todayMeals.map((m) => <div key={m.id} className="small">{m.meal}: {m.dish}</div>) : <span className="muted">No meal plan</span>)}
      {card('Latest energy', 'energy', e ? <div className="big-num tnum">{e.energy}/5</div> : <span className="muted">No check-in</span>)}
    </div>
  );
}

function Habits() {
  const [habits, setHabits] = useStore<Habit[]>('habits', []);
  const days = Array.from({ length: 7 }, (_, i) => addDays(isoToday(), i - 6));
  const toggle = (id: string, d: string) => setHabits((p) => p.map((h) => (h.id === id ? { ...h, days: h.days.includes(d) ? h.days.filter((x) => x !== d) : [...h.days, d] } : h)));
  const streak = (h: Habit) => { let n = 0; for (let i = 0; i < 365; i++) { if (h.days.includes(addDays(isoToday(), -i))) n++; else if (i > 0) break; else continue; } return n; };
  return (
    <section className="card">
      <div className="card-h"><h3>Habits</h3>
        <form className="row" onSubmit={(e) => { e.preventDefault(); const el = e.currentTarget.elements.namedItem('h') as HTMLInputElement; const name = el.value.trim(); if (!name) return; setHabits((p) => [{ id: crypto.randomUUID(), createdAt: new Date().toISOString(), name, days: [] }, ...p]); logActivity(`Added habit: ${name}`, 'add', '/health'); el.value = ''; }}>
          <input className="input" name="h" placeholder="New habit" aria-label="New habit" style={{ width: 200 }} /><button className="btn btn-primary btn-sm"><Plus size={14} /> Add</button></form></div>
      {habits.length === 0 ? <Empty title="No habits yet" /> : (
        <div className="table-wrap"><table className="table"><thead><tr><th>Habit</th>{days.map((d) => <th key={d} style={{ textAlign: 'center' }}>{fmtDate(d, { weekday: 'short' }).slice(0, 2)}<div>{d.slice(8)}</div></th>)}<th>Streak</th><th aria-label="Actions" /></tr></thead><tbody>
          {habits.map((h) => <tr key={h.id}><td>{h.name}</td>{days.map((d) => <td key={d} style={{ textAlign: 'center' }}><input type="checkbox" className="check" checked={h.days.includes(d)} onChange={() => toggle(h.id, d)} aria-label={`${h.name} on ${d}`} /></td>)}<td className="tnum">{streak(h)}d</td><td><button className="btn btn-ghost btn-sm btn-danger" onClick={() => confirm('Delete this habit and its history?') && setHabits((p) => p.filter((x) => x.id !== h.id))} aria-label="Delete habit"><Trash2 size={13} /></button></td></tr>)}
        </tbody></table></div>
      )}
    </section>
  );
}

function Sleep() {
  const { items } = useCollection<Sl>('health:sleep');
  const data = [...items].sort((a, b) => String(a.date).localeCompare(String(b.date))).slice(-14).map((s) => ({ label: (s.date ?? '').slice(8), value: s.hours ?? 0 }));
  return (<div className="stack" style={{ gap: 16 }}>
    {data.length > 0 && <section className="card"><div className="card-h"><h3>Hours slept, last nights</h3></div><BarChart data={data} format={(n) => `${n}h`} /></section>}
    <Collection storeKey="health:sleep" title="Sleep log" noun="night" activityHref="/health" sort={(a, b) => String(b.date ?? '').localeCompare(String(a.date ?? ''))} fields={[{ key: 'date', label: 'Date', type: 'date', defaultValue: isoToday(), required: true }, { key: 'bed', label: 'Bedtime' }, { key: 'wake', label: 'Woke' }, { key: 'hours', label: 'Hours', type: 'number', required: true }, { key: 'quality', label: 'Quality', type: 'rating' }]} emptyTitle="No sleep logged" /></div>);
}

function Exercise() {
  return (<div className="stack" style={{ gap: 20 }}>
    <Collection storeKey="health:plan" title="Workout plan" noun="session" activityHref="/health" fields={[{ key: 'day', label: 'Day', type: 'select', options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], required: true }, { key: 'workout', label: 'Workout', required: true }, { key: 'exercises', label: 'Exercises', type: 'textarea' }]} emptyTitle="No plan yet" emptyHint="Set what you do on each day." />
    <Collection storeKey="health:workouts" title="Workout log" noun="workout" activityHref="/health" sort={(a, b) => String(b.date ?? '').localeCompare(String(a.date ?? ''))} fields={[{ key: 'date', label: 'Date', type: 'date', defaultValue: isoToday(), required: true }, { key: 'workout', label: 'Workout', required: true }, { key: 'minutes', label: 'Minutes', type: 'number' }, { key: 'notes', label: 'Notes', type: 'textarea' }]} emptyTitle="No workouts logged" />
    <Collection storeKey="health:lifts" title="Strength progress" noun="lift" activityHref="/health" sort={(a, b) => String(b.date ?? '').localeCompare(String(a.date ?? ''))} fields={[{ key: 'exercise', label: 'Exercise', required: true }, { key: 'weight', label: 'Weight (kg)', type: 'number' }, { key: 'reps', label: 'Reps', type: 'number' }, { key: 'date', label: 'Date', type: 'date', defaultValue: isoToday() }]} emptyTitle="No lifts logged" />
  </div>);
}

type Ing = { id: string; createdAt: string; name: string; category?: string; qty?: string; store?: string; stock?: string };
type Groc = { id: string; createdAt: string; item: string; done: boolean };
function Food() {
  const [sub, setSub] = useState<'meals' | 'ingredients' | 'grocery'>('meals');
  const { items: ing } = useCollection<Ing>('health:ingredients');
  const { items: groc, add, update, remove } = useCollection<Groc>('health:grocery');
  const low = ing.filter((i) => (i.stock === 'Low' || i.stock === 'Out') && !groc.some((g) => g.item === i.name && !g.done));
  return (
    <div className="stack" style={{ gap: 16 }}>
      <Tabs value={sub} onChange={setSub} items={[{ id: 'meals', label: 'Meal prep' }, { id: 'ingredients', label: 'Ingredients I buy' }, { id: 'grocery', label: 'Grocery list' }]} />
      {sub === 'meals' && <Collection storeKey="health:meals" title="Weekly meal plan" noun="meal" activityHref="/health" fields={[{ key: 'day', label: 'Day', type: 'select', options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], required: true }, { key: 'meal', label: 'Meal', type: 'select', options: ['Breakfast', 'Lunch', 'Dinner', 'Snack'], required: true }, { key: 'dish', label: 'Dish', required: true }, { key: 'prep', label: 'Prep status', type: 'select', options: ['To prep', 'Prepped', 'Eaten'], defaultValue: 'To prep' }, { key: 'notes', label: 'Recipe / notes', type: 'textarea', hideInTable: true }]} inlineSelect={['prep']} emptyTitle="No meals planned" emptyHint="Plan the week’s meals, then generate a grocery list from your ingredients." />}
      {sub === 'ingredients' && <Collection storeKey="health:ingredients" title="Ingredients" noun="ingredient" activityHref="/health" fields={[{ key: 'name', label: 'Ingredient', required: true }, { key: 'category', label: 'Category', type: 'select', options: ['Protein', 'Carbs', 'Vegetables', 'Fruit', 'Dairy', 'Pantry', 'Drinks', 'Other'] }, { key: 'qty', label: 'Usual quantity' }, { key: 'store', label: 'Where I buy it' }, { key: 'stock', label: 'In stock', type: 'select', options: ['Yes', 'Low', 'Out'], defaultValue: 'Yes' }]} inlineSelect={['stock']} emptyTitle="No ingredients" emptyHint="List what you normally buy, and mark stock as Low or Out when it runs down." />}
      {sub === 'grocery' && (
        <section className="card">
          <div className="card-h"><h3>Grocery list</h3><div className="row">
            <button className="btn btn-sm" disabled={low.length === 0} onClick={() => low.forEach((i) => add({ item: `${i.name}${i.qty ? ` (${i.qty})` : ''}`, done: false } as never))}>Add {low.length} low-stock item{low.length === 1 ? '' : 's'}</button></div></div>
          <form className="row" onSubmit={(e) => { e.preventDefault(); const el = e.currentTarget.elements.namedItem('g') as HTMLInputElement; if (!el.value.trim()) return; add({ item: el.value.trim(), done: false } as never); el.value = ''; }}><input className="input" name="g" placeholder="Add an item" aria-label="Add grocery item" /></form>
          {groc.length === 0 ? <div style={{ marginTop: 12 }}><Empty title="List is empty" /></div> : groc.map((g) => <div key={g.id} className="row between" style={{ padding: '9px 0', borderTop: '1px solid var(--line)', marginTop: 0 }}><label className="row"><input type="checkbox" className="check" checked={g.done} onChange={() => update(g.id, { done: !g.done })} /><span style={{ textDecoration: g.done ? 'line-through' : 'none', color: g.done ? 'var(--muted)' : undefined }}>{g.item}</span></label><button className="btn btn-ghost btn-sm btn-danger" onClick={() => remove(g.id)} aria-label="Remove item"><Trash2 size={13} /></button></div>)}
        </section>
      )}
    </div>
  );
}

function Energy() {
  const { items } = useCollection<En>('health:energy');
  const data = [...items].sort((a, b) => String(a.date).localeCompare(String(b.date))).slice(-14).map((s) => ({ label: (s.date ?? '').slice(8), value: s.energy ?? 0 }));
  return (<div className="stack" style={{ gap: 16 }}>
    {data.length > 0 && <section className="card"><div className="card-h"><h3>Energy, recent days</h3></div><BarChart data={data} format={(n) => `${n} / 5`} /></section>}
    <Collection storeKey="health:energy" title="Daily check-in" noun="check-in" activityHref="/health" sort={(a, b) => String(b.date ?? '').localeCompare(String(a.date ?? ''))} fields={[{ key: 'date', label: 'Date', type: 'date', defaultValue: isoToday(), required: true }, { key: 'energy', label: 'Energy', type: 'rating' }, { key: 'mood', label: 'Mood', type: 'rating' }, { key: 'note', label: 'Note' }]} emptyTitle="No check-ins" /></div>);
}

function Care() {
  return (<div className="stack" style={{ gap: 20 }}>
    <Collection storeKey="health:care" title="Routines" noun="routine" activityHref="/health" fields={[{ key: 'routine', label: 'Routine', required: true }, { key: 'when', label: 'When', type: 'select', options: ['Morning', 'Evening', 'Weekly', 'Monthly'] }, { key: 'steps', label: 'Steps', type: 'textarea' }]} emptyTitle="No routines" emptyHint="Skincare, grooming, hair: write the steps once." />
    <Collection storeKey="health:products" title="Products" noun="product" activityHref="/health" sort={(a, b) => String(a.restock ?? '9999').localeCompare(String(b.restock ?? '9999'))} fields={[{ key: 'name', label: 'Product', required: true }, { key: 'type', label: 'Used for' }, { key: 'restock', label: 'Restock by', type: 'date', warn: true }, { key: 'notes', label: 'Notes' }]} emptyTitle="No products" />
  </div>);
}
