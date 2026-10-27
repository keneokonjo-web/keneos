'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal, Field, Tabs } from './ui';
import { AREAS } from '@/lib/themes';
import { CURRENCIES, addTxn } from '@/lib/finance';
import { readKey, writeKey, uid, logActivity } from '@/lib/store';
import { isoToday } from '@/lib/dates';
import type { Account, Task } from '@/lib/types';

type T = 'task' | 'expense' | 'note' | 'idea' | 'waiting' | 'decision' | 'link';
const TABS: { id: T; label: string }[] = [
  { id: 'task', label: 'Task' }, { id: 'expense', label: 'Expense' }, { id: 'note', label: 'Note' },
  { id: 'idea', label: 'Idea' }, { id: 'waiting', label: 'Waiting' }, { id: 'decision', label: 'Decision' }, { id: 'link', label: 'Link' },
];

function push(key: string, row: Record<string, unknown>) {
  writeKey(key, [{ id: uid(), createdAt: new Date().toISOString(), ...row }, ...readKey<unknown[]>(key, [])]);
}

export function QuickAdd() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<T>('task');
  const [err, setErr] = useState('');
  useEffect(() => {
    const h = (e: Event) => { setType(((e as CustomEvent).detail?.type as T) || 'task'); setErr(''); setOpen(true); };
    window.addEventListener('kos:quickadd', h);
    return () => window.removeEventListener('kos:quickadd', h);
  }, []);
  if (!open) return null;
  const accounts = readKey<Account[]>('accounts', []);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const s = (k: string) => (f[k] ?? '').trim();
    if (type === 'task') {
      if (!s('title')) return setErr('Give the task a title.');
      push('tasks', { title: s('title'), area: s('area') || 'personal', priority: (s('priority') || 'normal') as Task['priority'], due: s('due') || undefined, today: f.today === 'on', done: false });
      logActivity(`Added task: ${s('title')}`, 'task', '/plan');
    } else if (type === 'expense') {
      const amount = Number(f.amount);
      if (!(amount > 0)) return setErr('Enter an amount above zero.');
      addTxn({ date: s('date') || isoToday(), desc: s('desc'), amount, currency: s('currency') || 'NGN', type: 'expense', category: s('category') || 'General', scope: s('scope') || 'personal', accountId: s('accountId') || undefined });
    } else if (type === 'note') {
      if (!s('text')) return setErr('Write something first.');
      push('journal', { text: s('text'), kind: 'Note', date: isoToday() });
      logActivity('Added a journal note', 'note', '/goals');
    } else if (type === 'idea') {
      if (!s('idea')) return setErr('Describe the idea.');
      push('life:ideas', { idea: s('idea'), platform: s('platform') || 'Instagram', status: 'Idea' });
      logActivity(`Captured idea: ${s('idea').slice(0, 50)}`, 'idea', '/lifestyle');
    } else if (type === 'waiting') {
      if (!s('what') || !s('who')) return setErr('Say what you are waiting for and from whom.');
      push('waiting', { what: s('what'), who: s('who'), asked: isoToday(), expected: s('expected') || undefined, area: s('area') || 'personal', resolved: false });
      logActivity(`Waiting on ${s('who')}: ${s('what')}`, 'waiting', '/waiting');
    } else if (type === 'decision') {
      if (!s('title')) return setErr('Name the decision.');
      push('biz:waykon:decisions', { title: s('title'), reasoning: s('reasoning'), status: 'Decided', date: isoToday() });
      logActivity(`Logged decision: ${s('title')}`, 'decision', '/businesses/waykon');
    } else if (type === 'link') {
      if (!s('url') || !s('title')) return setErr('A title and a URL are needed.');
      push('files:links', { title: s('title'), url: /^https?:/.test(s('url')) ? s('url') : 'https://' + s('url'), folder: s('folder') || 'General' });
      logActivity(`Saved link: ${s('title')}`, 'link', '/files');
    }
    setOpen(false);
    router.refresh();
  };

  return (
    <Modal title="Quick add" onClose={() => setOpen(false)}>
      <Tabs value={type} onChange={(t) => { setType(t); setErr(''); }} items={TABS} />
      <form key={type} onSubmit={submit} className="stack" style={{ marginTop: 16 }}>
        {type === 'task' && (<>
          <Field label="Title"><input className="input" name="title" autoFocus placeholder="What needs doing?" /></Field>
          <div className="formgrid">
            <Field label="Area"><select className="select" name="area">{AREAS.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}</select></Field>
            <Field label="Priority"><select className="select" name="priority" defaultValue="normal"><option value="high">High</option><option value="normal">Normal</option><option value="low">Low</option></select></Field>
            <Field label="Due"><input className="input" type="date" name="due" /></Field>
          </div>
          <label className="row small"><input type="checkbox" className="check" name="today" /> Make it a priority for today</label>
        </>)}
        {type === 'expense' && (<>
          <div className="formgrid">
            <Field label="Amount"><input className="input" name="amount" type="number" step="0.01" min="0" autoFocus placeholder="0.00" /></Field>
            <Field label="Currency"><select className="select" name="currency">{CURRENCIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
            <Field label="Date"><input className="input" type="date" name="date" defaultValue={isoToday()} /></Field>
          </div>
          <div className="formgrid">
            <Field label="Category"><input className="input" name="category" placeholder="Food, transport…" /></Field>
            <Field label="Personal or business"><select className="select" name="scope"><option value="personal">Personal</option><option value="business">Business</option></select></Field>
            <Field label="From account"><select className="select" name="accountId"><option value="">Do not adjust a balance</option>{accounts.map((a) => <option key={a.id} value={a.id}>{a.name} ({a.currency})</option>)}</select></Field>
          </div>
          <Field label="Description"><input className="input" name="desc" placeholder="Optional" /></Field>
        </>)}
        {type === 'note' && <Field label="Note"><textarea className="textarea" name="text" autoFocus placeholder="A thought, comment or reflection…" /></Field>}
        {type === 'idea' && (<>
          <Field label="Idea"><textarea className="textarea" name="idea" autoFocus placeholder="Content idea…" /></Field>
          <Field label="Platform"><select className="select" name="platform"><option>Instagram</option><option>YouTube</option><option>TikTok</option><option>Other</option></select></Field>
        </>)}
        {type === 'waiting' && (<>
          <Field label="Waiting for"><input className="input" name="what" autoFocus placeholder="e.g. Quote, reply, payment" /></Field>
          <div className="formgrid">
            <Field label="From whom"><input className="input" name="who" placeholder="Name" /></Field>
            <Field label="Expected by"><input className="input" type="date" name="expected" /></Field>
            <Field label="Area"><select className="select" name="area">{AREAS.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}</select></Field>
          </div>
        </>)}
        {type === 'decision' && (<>
          <Field label="Decision"><input className="input" name="title" autoFocus placeholder="What did you decide?" /></Field>
          <Field label="Reasoning"><textarea className="textarea" name="reasoning" placeholder="Why, and what it rules out" /></Field>
        </>)}
        {type === 'link' && (<>
          <Field label="Title"><input className="input" name="title" autoFocus /></Field>
          <Field label="URL"><input className="input" name="url" placeholder="https://" /></Field>
          <Field label="Folder"><input className="input" name="folder" placeholder="General" /></Field>
        </>)}
        {err && <p role="alert" style={{ color: 'var(--neg)', margin: 0 }}>{err}</p>}
        <div className="row" style={{ justifyContent: 'flex-end' }}><button type="button" className="btn" onClick={() => setOpen(false)}>Cancel</button><button className="btn btn-primary">Add</button></div>
      </form>
    </Modal>
  );
}
