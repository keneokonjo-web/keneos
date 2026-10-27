'use client';
import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Empty, Field, Modal, PageHead, Tabs } from '@/components/ui';
import { useCollection, useStore, logActivity } from '@/lib/store';
import { fmtDate, isoToday } from '@/lib/dates';
import { AREAS, areaLabel } from '@/lib/themes';
import type { Goal, Journal } from '@/lib/types';

type Tab = 'direction' | 'goals' | 'journal' | 'reviews';
const HORIZON = { annual: 'Annual goals', '90day': '90-day plans', long: 'Long-term' } as const;

export default function Goals() {
  const [tab, setTab] = useState<Tab>('goals');
  return (
    <div className="page">
      <PageHead eyebrow="Goals and life plan" title="Where this is all going" sub="Direction first, then annual goals and 90-day plans, with a journal for your own comments and reviews." />
      <Tabs value={tab} onChange={setTab} items={[{ id: 'goals', label: 'Goals' }, { id: 'direction', label: 'Life direction' }, { id: 'journal', label: 'Journal' }, { id: 'reviews', label: 'Reviews' }]} />
      <div style={{ marginTop: 20 }}>
        {tab === 'goals' && <GoalsTab />}
        {tab === 'direction' && <Direction />}
        {tab === 'journal' && <JournalTab />}
        {tab === 'reviews' && <ReviewsTab />}
      </div>
    </div>
  );
}

function GoalsTab() {
  const { items, add, update, remove } = useCollection<Goal>('goals');
  const [edit, setEdit] = useState<Goal | 'new' | null>(null);
  const [err, setErr] = useState('');
  return (
    <div className="stack" style={{ gap: 16 }}>
      <div><button className="btn btn-primary btn-sm" onClick={() => { setErr(''); setEdit('new'); }}><Plus size={14} /> Add goal</button></div>
      {items.length === 0 && <Empty title="No goals yet">Add an annual goal or a 90-day plan, then move the progress slider as you go.</Empty>}
      {(['annual', '90day', 'long'] as const).map((h) => {
        const list = items.filter((g) => g.horizon === h);
        if (!list.length) return null;
        return (
          <section key={h} className="card">
            <div className="card-h"><h3>{HORIZON[h]}</h3></div>
            <div className="stack" style={{ gap: 18 }}>
              {list.map((g) => (
                <div key={g.id}>
                  <div className="row between"><div><b style={{ fontWeight: 500 }}>{g.title}</b><div className="small muted">{areaLabel(g.area)}{g.due ? ` · by ${fmtDate(g.due)}` : ''}</div></div>
                    <div className="row" style={{ gap: 4 }}><button className="btn btn-ghost btn-sm" onClick={() => { setErr(''); setEdit(g); }} aria-label="Edit goal"><Pencil size={14} /></button><button className="btn btn-ghost btn-sm btn-danger" onClick={() => confirm('Delete this goal?') && remove(g.id)} aria-label="Delete goal"><Trash2 size={14} /></button></div></div>
                  <div className="row" style={{ marginTop: 8 }}>
                    <input type="range" min={0} max={100} step={5} value={g.progress} onChange={(e) => update(g.id, { progress: Number(e.target.value) })} aria-label={`Progress for ${g.title}`} style={{ flex: 1, accentColor: '#f3f1ea' }} />
                    <span className="tnum small" style={{ width: 40, textAlign: 'right' }}>{g.progress}%</span>
                  </div>
                  {g.next && <div className="small muted">Next action: {g.next}</div>}
                </div>
              ))}
            </div>
          </section>
        );
      })}
      {edit && (
        <Modal title={edit === 'new' ? 'Add goal' : 'Edit goal'} onClose={() => setEdit(null)}>
          <form className="stack" onSubmit={(e) => {
            e.preventDefault();
            const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
            if (!f.title.trim()) return setErr('Give the goal a title.');
            const data = { title: f.title.trim(), horizon: f.horizon as Goal['horizon'], area: f.area, next: f.next.trim() || undefined, due: f.due || undefined };
            if (edit === 'new') { add({ ...data, progress: 0 } as never); logActivity(`Added goal: ${data.title}`, 'goal', '/goals'); } else update(edit.id, data);
            setEdit(null);
          }}>
            <Field label="Goal"><input className="input" name="title" defaultValue={edit === 'new' ? '' : edit.title} autoFocus /></Field>
            <div className="formgrid">
              <Field label="Horizon"><select className="select" name="horizon" defaultValue={edit === 'new' ? 'annual' : edit.horizon}><option value="annual">Annual</option><option value="90day">90-day</option><option value="long">Long-term</option></select></Field>
              <Field label="Area"><select className="select" name="area" defaultValue={edit === 'new' ? 'personal' : edit.area}>{AREAS.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}</select></Field>
              <Field label="Target date"><input className="input" type="date" name="due" defaultValue={edit === 'new' ? '' : edit.due ?? ''} /></Field>
            </div>
            <Field label="Next action"><input className="input" name="next" defaultValue={edit === 'new' ? '' : edit.next ?? ''} /></Field>
            {err && <p role="alert" style={{ color: 'var(--neg)', margin: 0 }}>{err}</p>}
            <div className="row" style={{ justifyContent: 'flex-end' }}><button type="button" className="btn" onClick={() => setEdit(null)}>Cancel</button><button className="btn btn-primary">Save</button></div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Direction() {
  const [d, setD] = useStore<Record<string, string>>('direction', {});
  const sections = [
    ['values', 'Values', 'What you refuse to compromise on.'],
    ['person', 'Who you are becoming', 'Character, habits, reputation.'],
    ['y5', 'Five years', 'What your life and work look like.'],
    ['y10', 'Ten years', ''],
    ['legacy', 'What this is all for', 'The larger ambition the businesses support.'],
  ];
  return (
    <div className="grid g2">
      {sections.map(([k, t, hint]) => (
        <section key={k} className="card">
          <div className="card-h"><h3>{t}</h3></div>
          <textarea className="textarea" style={{ minHeight: 140 }} value={d[k] ?? ''} onChange={(e) => setD((p) => ({ ...p, [k]: e.target.value }))} placeholder={hint || 'Write in your own words…'} aria-label={t} />
          <div className="small muted" style={{ marginTop: 6 }}>Saved as you type, on this device.</div>
        </section>
      ))}
    </div>
  );
}

function JournalTab() {
  const { items, add, remove } = useCollection<Journal>('journal');
  const [text, setText] = useState('');
  const [kind, setKind] = useState('Note');
  return (
    <div className="grid g2" style={{ alignItems: 'start' }}>
      <section className="card">
        <div className="card-h"><h3>New entry</h3></div>
        <div className="stack">
          <select className="select" value={kind} onChange={(e) => setKind(e.target.value)} aria-label="Entry type">{['Note', 'Reflection', 'Review', 'Comment'].map((k) => <option key={k}>{k}</option>)}</select>
          <textarea className="textarea" style={{ minHeight: 160 }} value={text} onChange={(e) => setText(e.target.value)} placeholder="Personal comments, reviews, what you noticed…" />
          <div><button className="btn btn-primary" disabled={!text.trim()} onClick={() => { add({ text: text.trim(), kind, date: isoToday() } as never); logActivity(`Added a journal ${kind.toLowerCase()}`, 'note', '/goals'); setText(''); }}>Save entry</button></div>
        </div>
      </section>
      <section className="card">
        <div className="card-h"><h3>Entries</h3></div>
        {items.length === 0 ? <Empty title="No entries yet" /> : items.map((j) => (
          <div key={j.id} style={{ padding: '12px 0', borderTop: '1px solid var(--line)' }}>
            <div className="row between"><span className="chip">{j.kind}</span><span className="row small muted" style={{ gap: 6 }}>{fmtDate(j.date)}<button className="btn btn-ghost btn-sm btn-danger" onClick={() => confirm('Delete this entry?') && remove(j.id)} aria-label="Delete entry"><Trash2 size={13} /></button></span></div>
            <p style={{ margin: '8px 0 0', whiteSpace: 'pre-wrap' }}>{j.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

function ReviewsTab() {
  const [reviews] = useStore<{ id: string; date: string; kind: string; wins?: string; lessons?: string; next?: string }[]>('reviews', []);
  return (
    <section className="card">
      <div className="card-h"><h3>Past reviews</h3><a href="/reviews" className="btn btn-sm">Start a review</a></div>
      {reviews.length === 0 ? <Empty title="No reviews yet">Weekly and monthly reviews live in Reviews and reports.</Empty> : reviews.map((r) => <div key={r.id} style={{ padding: '10px 0', borderTop: '1px solid var(--line)' }}><b style={{ fontWeight: 500 }}>{r.kind}</b> <span className="muted small">{fmtDate(r.date)}</span><p className="small" style={{ margin: '4px 0 0' }}>{r.wins}</p></div>)}
    </section>
  );
}
