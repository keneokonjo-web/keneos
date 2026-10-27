'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Field, PageHead } from '@/components/ui';
import { readKey, writeKey, uid, logActivity } from '@/lib/store';
import { CURRENCIES } from '@/lib/finance';
import { DEFAULTS, SHARE_AREAS, useSettings, type Settings } from '@/lib/settings';

const STEPS = ['About you', 'Education', 'Health', 'Money', 'Businesses', 'Assistant'] as const;
const row = (extra: Record<string, unknown>) => ({ id: uid(), createdAt: new Date().toISOString(), ...extra });
const lines = (v: string) => v.split('\n').map((l) => l.trim()).filter(Boolean);
const add = (key: string, rows: Record<string, unknown>[]) => rows.length && writeKey(key, [...rows.map(row), ...readKey<unknown[]>(key, [])]);

export default function Setup() {
  const router = useRouter();
  const [s, set] = useSettings();
  const [i, setI] = useState(0);
  const [saved, setSaved] = useState<string[]>([]);
  const [share, setShare] = useState<Settings['share']>(s.share);

  const next = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    if (i === 0) set({ ownerName: f.name.trim() || DEFAULTS.ownerName, assistantName: f.assistant.trim() || DEFAULTS.assistantName, baseCurrency: f.currency });
    if (i === 1) add('edu:subjects', lines(f.subjects ?? '').map((l) => { const [name, board, target] = l.split('|').map((x) => x.trim()); return { name, board, target }; }));
    if (i === 2) { add('habits', lines(f.habits ?? '').map((name) => ({ name, days: [] }))); add('health:ingredients', lines(f.ingredients ?? '').map((name) => ({ name, stock: 'Yes' }))); }
    if (i === 3) {
      add('accounts', lines(f.accounts ?? '').map((l) => { const [name, currency, balance, kind] = l.split('|').map((x) => x.trim()); return { name, currency: (currency || 'NGN').toUpperCase(), balance: Number(balance) || 0, kind: kind || 'Bank', status: 'active', scope: 'personal' }; }));
      if (f.goal?.trim()) add('savings', [{ name: f.goal.trim(), target: Number(f.target) || 0, saved: 0, currency: s.baseCurrency }]);
    }
    if (i === 4) {
      if (f.eventName?.trim()) add('biz:plot42:events', [{ name: f.eventName.trim(), date: f.eventDate || undefined, status: 'Planning' }]);
      if (f.offer?.trim()) writeKey('biz:fieldwork:offer', f.offer.trim());
    }
    if (i === 5) { set({ share }); writeKey('setup:done', true); logActivity('Finished the setup questionnaire', 'add', '/'); router.push('/'); return; }
    setSaved((p) => [...p, STEPS[i]]);
    setI(i + 1);
  };

  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <PageHead eyebrow={`Setup · step ${i + 1} of ${STEPS.length}`} title={STEPS[i]} sub="Answer what you can. Every answer creates a real record you can edit later. Skip anything you do not know; nothing is invented." />
      <div className="row wrap" style={{ marginBottom: 20 }}>{STEPS.map((x, n) => <span key={x} className={`chip ${n === i ? 'chip-solid' : ''}`}>{saved.includes(x) ? '✓ ' : ''}{x}</span>)}</div>
      <form key={i} onSubmit={next} className="card stack" style={{ gap: 16 }}>
        {i === 0 && (<div className="formgrid">
          <Field label="What should I call you?"><input className="input" name="name" defaultValue={s.ownerName} /></Field>
          <Field label="Assistant name"><input className="input" name="assistant" defaultValue={s.assistantName} /></Field>
          <Field label="Main currency"><select className="select" name="currency" defaultValue={s.baseCurrency}>{CURRENCIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
        </div>)}
        {i === 1 && <Field label="Your A-level subjects, one per line: Subject | Exam board | Target grade"><textarea className="textarea" name="subjects" style={{ minHeight: 130 }} placeholder={'Economics | Edexcel | A\nMathematics | AQA | A*'} /></Field>}
        {i === 2 && (<><Field label="Daily habits to track, one per line"><textarea className="textarea" name="habits" placeholder={'Gym\nRead 20 pages\nIn bed by 11'} /></Field>
          <Field label="Ingredients you usually buy, one per line"><textarea className="textarea" name="ingredients" /></Field></>)}
        {i === 3 && (<><Field label="Accounts and wallets, one per line: Name | Currency | Balance | Type"><textarea className="textarea" name="accounts" style={{ minHeight: 110 }} placeholder={'Main bank | NGN | 250000 | Bank\nDollar wallet | USD | 120 | Mobile wallet'} /></Field>
          <div className="formgrid"><Field label="A savings goal (optional)"><input className="input" name="goal" /></Field><Field label="Target amount"><input className="input" name="target" type="number" min="0" step="any" /></Field></div></>)}
        {i === 4 && (<>
          <div className="formgrid"><Field label="Plot42: next event name"><input className="input" name="eventName" placeholder="Summer event" /></Field><Field label="Event date (if fixed)"><input className="input" type="date" name="eventDate" /></Field></div>
          <Field label="Fieldwork: the offer as it stands today"><textarea className="textarea" name="offer" placeholder="Who it is for, what is included, price. Mark planned parts as planned." /></Field></>)}
        {i === 5 && (<div><p className="muted" style={{ marginTop: 0 }}>What may the assistant read? Switched-off areas are never sent.</p>
          {SHARE_AREAS.map(([k, l]) => <label key={k} className="row between" style={{ padding: '9px 0', borderTop: '1px solid var(--line)' }}>{l}<input type="checkbox" className="check" checked={share[k]} onChange={(e) => setShare({ ...share, [k]: e.target.checked })} /></label>)}</div>)}
        <div className="row between"><button type="button" className="btn" disabled={i === 0} onClick={() => setI(i - 1)}>Back</button><button className="btn btn-primary">{i === 5 ? 'Finish' : 'Save and continue'}</button></div>
      </form>
    </div>
  );
}
