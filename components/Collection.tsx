'use client';
import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useCollection, logActivity, readKey } from '@/lib/store';

type Row = { id: string; createdAt: string } & Record<string, unknown>;
import { dueLabel, fmtDate, daysUntil } from '@/lib/dates';
import { Empty, Field, Modal, Stars } from './ui';

export type FieldDef = {
  key: string;
  label: string;
  type?: 'text' | 'textarea' | 'date' | 'number' | 'select' | 'url' | 'rating';
  options?: string[];
  optionsFrom?: { key: string; field: string };
  required?: boolean;
  placeholder?: string;
  hideInTable?: boolean;
  warn?: boolean; // date field that should flag overdue / due soon
  prefix?: string;
  defaultValue?: string | number;
};

type Props = {
  storeKey: string;
  title: string;
  noun: string;
  fields: FieldDef[];
  emptyTitle: string;
  emptyHint?: string;
  inlineSelect?: string[];
  activityHref?: string;
  addLabel?: string;
  sort?: (a: Row, b: Row) => number;
  headless?: boolean;
};

function opts(fd: FieldDef): string[] {
  if (fd.optionsFrom) return readKey<Record<string, unknown>[]>(fd.optionsFrom.key, []).map((r) => String(r[fd.optionsFrom!.field] ?? '')).filter(Boolean);
  return fd.options ?? [];
}

export function Collection({ storeKey, title, noun, fields, emptyTitle, emptyHint, inlineSelect = [], activityHref, addLabel, sort, headless }: Props) {
  const { items: rawItems, add, update, remove } = useCollection<Row>(storeKey);
  const items = rawItems;
  const [editing, setEditing] = useState<Row | 'new' | null>(null);
  const [err, setErr] = useState('');
  const rows = sort ? [...items].sort(sort) : items;
  const cols = fields.filter((f) => !f.hideInTable);

  const save = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const data: Record<string, unknown> = {};
    for (const fd of fields) {
      const raw = (f[fd.key] ?? '').toString().trim();
      if (fd.required && !raw) return setErr(`${fd.label} is required.`);
      if (fd.type === 'rating') data[fd.key] = Number(f[fd.key] ?? 0);
      else if (fd.type === 'number') data[fd.key] = raw === '' ? undefined : Number(raw);
      else if (fd.type === 'url') data[fd.key] = raw && !/^https?:/.test(raw) ? 'https://' + raw : raw || undefined;
      else data[fd.key] = raw || undefined;
    }
    if (editing === 'new') {
      add(data as never);
      logActivity(`Added ${noun}: ${String(data[fields[0].key] ?? '')}`, 'add', activityHref);
    } else if (editing) update(editing.id, data as never);
    setEditing(null);
    setErr('');
  };

  const cell = (r: Row, fd: FieldDef) => {
    const v = r[fd.key];
    if (fd.type === 'select' && inlineSelect.includes(fd.key))
      return (
        <select className="select" style={{ height: 30, minWidth: 120 }} value={String(v ?? '')} onChange={(e) => update(r.id, { [fd.key]: e.target.value } as never)} aria-label={`${fd.label} for ${String(r[fields[0].key])}`}>
          {!v && <option value="">—</option>}
          {opts(fd).map((o) => <option key={o}>{o}</option>)}
        </select>
      );
    if (v === undefined || v === '' || v === null) return <span className="muted">—</span>;
    if (fd.type === 'date')
      return (
        <span className="row" style={{ gap: 8 }}>
          {fmtDate(String(v))}
          {fd.warn && (daysUntil(String(v)) ?? 99) <= 2 && <span className={`chip ${(daysUntil(String(v)) ?? 0) < 0 ? 'chip-neg' : ''}`}>{dueLabel(String(v))}</span>}
        </span>
      );
    if (fd.type === 'url') return <a href={String(v)} target="_blank" rel="noopener noreferrer" className="hl">{String(v).replace(/^https?:\/\//, '').slice(0, 32)}</a>;
    if (fd.type === 'rating') return <Stars value={Number(v)} size={14} />;
    if (fd.type === 'number') return <span className="tnum">{fd.prefix ?? ''}{Number(v).toLocaleString('en-GB')}</span>;
    return <span>{String(v)}</span>;
  };

  return (
    <div className="stack">
      {!headless && (
        <div className="row between">
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 500 }}>{title}</h3>
          <button className="btn btn-sm btn-primary" onClick={() => { setErr(''); setEditing('new'); }}><Plus size={14} /> {addLabel ?? `Add ${noun}`}</button>
        </div>
      )}
      {headless && <div><button className="btn btn-sm btn-primary" onClick={() => { setErr(''); setEditing('new'); }}><Plus size={14} /> {addLabel ?? `Add ${noun}`}</button></div>}
      {rows.length === 0 ? (
        <Empty title={emptyTitle}>{emptyHint}</Empty>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr>{cols.map((c) => <th key={c.key}>{c.label}</th>)}<th aria-label="Actions" /></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  {cols.map((c, i) => <td key={c.key} style={i === 0 ? { fontWeight: 500 } : undefined}>{cell(r, c)}</td>)}
                  <td style={{ whiteSpace: 'nowrap', textAlign: 'right' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => { setErr(''); setEditing(r); }} aria-label={`Edit ${noun}`}><Pencil size={14} /></button>
                    <button className="btn btn-ghost btn-sm btn-danger" onClick={() => { if (confirm(`Delete this ${noun}? This cannot be undone.`)) remove(r.id); }} aria-label={`Delete ${noun}`}><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {editing && (
        <Modal title={editing === 'new' ? `Add ${noun}` : `Edit ${noun}`} onClose={() => setEditing(null)}>
          <form onSubmit={save} className="stack">
            <div className="formgrid">
              {fields.map((fd, i) => {
                const cur = editing === 'new' ? fd.defaultValue : (editing[fd.key] as string | number | undefined);
                const wide = fd.type === 'textarea' || i === 0;
                return (
                  <div key={fd.key} style={wide ? { gridColumn: '1 / -1' } : undefined}>
                    <Field label={fd.label + (fd.required ? ' *' : '')}>
                      {fd.type === 'textarea' ? <textarea className="textarea" name={fd.key} defaultValue={cur ?? ''} placeholder={fd.placeholder} />
                        : fd.type === 'select' ? <select className="select" name={fd.key} defaultValue={cur ?? ''}>{!fd.required && <option value="">—</option>}{opts(fd).map((o) => <option key={o}>{o}</option>)}</select>
                        : fd.type === 'rating' ? <select className="select" name={fd.key} defaultValue={cur ?? 0}>{[0, 1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n === 0 ? 'Not rated' : `${n} / 5`}</option>)}</select>
                        : <input className="input" name={fd.key} type={fd.type === 'date' ? 'date' : fd.type === 'number' ? 'number' : 'text'} step={fd.type === 'number' ? 'any' : undefined} defaultValue={cur ?? ''} placeholder={fd.placeholder} autoFocus={i === 0} />}
                    </Field>
                  </div>
                );
              })}
            </div>
            {err && <p role="alert" style={{ color: 'var(--neg)', margin: 0 }}>{err}</p>}
            <div className="row" style={{ justifyContent: 'flex-end' }}><button type="button" className="btn" onClick={() => setEditing(null)}>Cancel</button><button className="btn btn-primary">Save</button></div>
          </form>
        </Modal>
      )}
    </div>
  );
}
