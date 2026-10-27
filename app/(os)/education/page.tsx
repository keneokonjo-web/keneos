'use client';
import { useState } from 'react';
import { Collection } from '@/components/Collection';
import { BarChart } from '@/components/BarChart';
import { Empty, PageHead, Tabs } from '@/components/ui';
import { useCollection } from '@/lib/store';
import { dueLabel, fmtDate, isoToday, startOfWeek } from '@/lib/dates';

type Sub = { id: string; createdAt: string; name: string; board?: string; target?: string; current?: string; teacher?: string };
type Top = { id: string; createdAt: string; subject?: string; topic: string; status?: string };
type Sess = { id: string; createdAt: string; date?: string; subject?: string; minutes?: number };
type CW = { id: string; createdAt: string; title: string; subject?: string; due?: string; status?: string };
type Paper = { id: string; createdAt: string; subject?: string; paper?: string; date?: string; score?: number };

const subjectField = { key: 'subject', label: 'Subject', type: 'select' as const, optionsFrom: { key: 'edu:subjects', field: 'name' } };
const CONF: Record<string, number> = { 'Not started': 0, Learning: 0.4, Revised: 0.75, Confident: 1 };

export default function Education() {
  const [tab, setTab] = useState('overview');
  return (
    <div className="page">
      <PageHead eyebrow="Education" title="A-levels" sub="Subjects, revision, coursework, deadlines and results. Add your subjects first; everything else hangs off them." />
      <Tabs value={tab} onChange={setTab} items={[{ id: 'overview', label: 'Overview' }, { id: 'subjects', label: 'Subjects' }, { id: 'topics', label: 'Topics' }, { id: 'revision', label: 'Revision' }, { id: 'coursework', label: 'Coursework' }, { id: 'papers', label: 'Past papers' }, { id: 'performance', label: 'Performance' }]} />
      <div style={{ marginTop: 20 }}>
        {tab === 'overview' && <Overview />}
        {tab === 'subjects' && <Collection storeKey="edu:subjects" title="Subjects" noun="subject" activityHref="/education" fields={[{ key: 'name', label: 'Subject', required: true }, { key: 'board', label: 'Exam board' }, { key: 'target', label: 'Target grade' }, { key: 'current', label: 'Current / predicted' }, { key: 'teacher', label: 'Teacher' }]} emptyTitle="No subjects yet" emptyHint="Add each A-level you are taking, with its exam board and target grade." />}
        {tab === 'topics' && <Collection storeKey="edu:topics" title="Syllabus topics" noun="topic" activityHref="/education" fields={[subjectField, { key: 'topic', label: 'Topic', required: true }, { key: 'status', label: 'Status', type: 'select', options: Object.keys(CONF), defaultValue: 'Not started' }]} inlineSelect={['status']} emptyTitle="No topics" emptyHint="Add syllabus topics per subject and track how confident you are." />}
        {tab === 'revision' && <Revision />}
        {tab === 'coursework' && <Collection storeKey="edu:coursework" title="Coursework" noun="coursework" activityHref="/education" sort={(a, b) => String(a.due ?? '9999').localeCompare(String(b.due ?? '9999'))} fields={[{ key: 'title', label: 'Piece', required: true }, subjectField, { key: 'due', label: 'Deadline', type: 'date', warn: true }, { key: 'status', label: 'Status', type: 'select', options: ['Not started', 'Drafting', 'Review', 'Submitted', 'Done'], defaultValue: 'Not started' }, { key: 'notes', label: 'Notes', type: 'textarea', hideInTable: true }]} inlineSelect={['status']} emptyTitle="No coursework" emptyHint="Add each piece with its deadline. Alerts fire as the date gets close." />}
        {tab === 'papers' && <Collection storeKey="edu:papers" title="Past papers and mocks" noun="paper" activityHref="/education" sort={(a, b) => String(b.date ?? '').localeCompare(String(a.date ?? ''))} fields={[subjectField, { key: 'paper', label: 'Paper', required: true }, { key: 'date', label: 'Date', type: 'date', defaultValue: isoToday() }, { key: 'score', label: 'Score %', type: 'number' }, { key: 'weak', label: 'Weak topics' }]} emptyTitle="No papers logged" emptyHint="Log each past paper or mock and the percentage you scored." />}
        {tab === 'performance' && <Performance />}
      </div>
    </div>
  );
}

function Overview() {
  const { items: subs } = useCollection<Sub>('edu:subjects');
  const { items: tops } = useCollection<Top>('edu:topics');
  const { items: sess } = useCollection<Sess>('edu:sessions');
  const { items: cw } = useCollection<CW>('edu:coursework');
  const week = startOfWeek();
  const mins = sess.filter((s) => (s.date ?? '') >= week).reduce((a, s) => a + (s.minutes ?? 0), 0);
  const due = cw.filter((c) => c.due && c.status !== 'Done' && c.status !== 'Submitted').sort((a, b) => a.due!.localeCompare(b.due!)).slice(0, 5);
  if (!subs.length) return <Empty title="Start with your subjects">Open the Subjects tab and add each A-level, its exam board and your target grade.</Empty>;
  return (
    <div className="stack" style={{ gap: 16 }}>
      <div className="grid g3">
        {subs.map((s) => {
          const t = tops.filter((x) => x.subject === s.name);
          const pct = t.length ? Math.round((t.reduce((a, x) => a + (CONF[x.status ?? 'Not started'] ?? 0), 0) / t.length) * 100) : 0;
          return <div key={s.id} className="card"><div className="row between"><b style={{ fontWeight: 500 }}>{s.name}</b><span className="chip">{s.board || 'Board not set'}</span></div><div className="small muted" style={{ margin: '4px 0 12px' }}>Target {s.target || '—'} · Now {s.current || '—'}</div><div className="row between small"><span>Topic confidence</span><span className="tnum">{t.length ? `${pct}%` : 'No topics'}</span></div><div className="progress" style={{ marginTop: 6 }}><i style={{ width: `${pct}%` }} /></div></div>;
        })}
      </div>
      <div className="grid g2" style={{ alignItems: 'start' }}>
        <section className="card"><div className="card-h"><h3>Upcoming deadlines</h3></div>{due.length === 0 ? <Empty title="No deadlines" /> : due.map((c) => <div key={c.id} className="row between" style={{ padding: '8px 0', borderTop: '1px solid var(--line)' }}><div><div>{c.title}</div><div className="small muted">{c.subject} · {fmtDate(c.due)}</div></div><span className="chip">{dueLabel(c.due)}</span></div>)}</section>
        <section className="card"><div className="card-h"><h3>Revision this week</h3></div><div className="big-num tnum">{Math.floor(mins / 60)}h {mins % 60}m</div><div className="small muted">Logged since Monday</div></section>
      </div>
    </div>
  );
}

function Revision() {
  const { items } = useCollection<Sess>('edu:sessions');
  const week = startOfWeek();
  const total = items.filter((s) => (s.date ?? '') >= week).reduce((a, s) => a + (s.minutes ?? 0), 0);
  return (<div className="stack" style={{ gap: 14 }}><p className="muted" style={{ margin: 0 }}>{Math.floor(total / 60)}h {total % 60}m this week.</p>
    <Collection storeKey="edu:sessions" title="Study sessions" noun="session" activityHref="/education" sort={(a, b) => String(b.date ?? '').localeCompare(String(a.date ?? ''))} fields={[subjectField, { key: 'date', label: 'Date', type: 'date', defaultValue: isoToday(), required: true }, { key: 'minutes', label: 'Minutes', type: 'number', required: true }, { key: 'focus', label: 'What you covered' }]} emptyTitle="No sessions logged" /></div>);
}

function Performance() {
  const { items: subs } = useCollection<Sub>('edu:subjects');
  const { items: papers } = useCollection<Paper>('edu:papers');
  if (!papers.length) return <Empty title="No results yet">Log past papers and mocks to see scores by subject here.</Empty>;
  const data = subs.map((s) => { const p = papers.filter((x) => x.subject === s.name && x.score !== undefined); return { label: s.name.slice(0, 8), value: p.length ? p.reduce((a, x) => a + (x.score ?? 0), 0) / p.length : 0 }; });
  return (
    <div className="grid g2" style={{ alignItems: 'start' }}>
      <section className="card"><div className="card-h"><h3>Average paper score by subject</h3></div><BarChart data={data} format={(n) => `${n.toFixed(0)}%`} /></section>
      <section className="card"><div className="card-h"><h3>Target vs now</h3></div><div className="table-wrap"><table className="table"><thead><tr><th>Subject</th><th>Target</th><th>Current</th><th>Papers</th></tr></thead><tbody>{subs.map((s) => <tr key={s.id}><td>{s.name}</td><td>{s.target || '—'}</td><td>{s.current || '—'}</td><td>{papers.filter((p) => p.subject === s.name).length}</td></tr>)}</tbody></table></div></section>
    </div>
  );
}
