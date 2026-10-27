'use client';
import { Trash2 } from 'lucide-react';
import { useCollection, logActivity } from '@/lib/store';
import { dueLabel, daysUntil, isoToday } from '@/lib/dates';
import { areaLabel } from '@/lib/themes';
import type { Task } from '@/lib/types';
import { Empty } from './ui';

export function useTasks() {
  const c = useCollection<Task>('tasks');
  const toggle = (t: Task) => {
    const done = !t.done;
    c.update(t.id, { done, doneAt: done ? new Date().toISOString() : undefined } as Partial<Task>);
    if (done) logActivity(`Completed: ${t.title}`, 'task', '/plan');
  };
  return { ...c, toggle };
}

export function TaskRow({ t, toggle, remove, showArea = true }: { t: Task; toggle: (t: Task) => void; remove?: (id: string) => void; showArea?: boolean }) {
  const n = daysUntil(t.due);
  return (
    <div className="row" style={{ padding: '9px 0', borderTop: '1px solid var(--line)', alignItems: 'flex-start' }}>
      <input type="checkbox" className="check" checked={t.done} onChange={() => toggle(t)} aria-label={`Mark "${t.title}" ${t.done ? 'not done' : 'done'}`} style={{ marginTop: 2 }} />
      <div className="grow">
        <div style={{ textDecoration: t.done ? 'line-through' : 'none', color: t.done ? 'var(--muted)' : 'var(--ink)' }}>{t.title}</div>
        <div className="row wrap small muted" style={{ gap: 8, marginTop: 2 }}>
          {showArea && <span>{areaLabel(t.area)}</span>}
          {t.priority === 'high' && <span className="chip chip-solid">High</span>}
          {t.due && !t.done && <span className={`chip ${n !== null && n < 0 ? 'chip-neg' : ''}`}>{dueLabel(t.due)}</span>}
        </div>
      </div>
      {remove && <button className="btn btn-ghost btn-sm btn-danger" onClick={() => { if (confirm('Delete this task?')) remove(t.id); }} aria-label="Delete task"><Trash2 size={14} /></button>}
    </div>
  );
}

export function QuickTaskInput({ area = 'personal', today = true }: { area?: string; today?: boolean }) {
  const { add } = useTasks();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const el = e.currentTarget.elements.namedItem('t') as HTMLInputElement;
        const title = el.value.trim();
        if (!title) return;
        add({ title, area, priority: 'normal', today, done: false } as never);
        logActivity(`Added task: ${title}`, 'task', '/plan');
        el.value = '';
      }}
      className="row"
      style={{ marginTop: 10 }}
    >
      <input className="input" name="t" placeholder="Add a task and press Enter" aria-label="New task" />
    </form>
  );
}

export function isPriority(t: Task) {
  return !t.done && (t.today || t.priority === 'high' || (t.due !== undefined && t.due <= isoToday()));
}

export function EmptyTasks({ text }: { text: string }) {
  return <Empty title="Nothing here yet">{text}</Empty>;
}
