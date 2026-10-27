'use client';
import { useMemo } from 'react';
import { useStore } from './store';
import { daysUntil, fmtDate } from './dates';
import { useSettings } from './settings';
import type { Bill, CalEvent, Task, Waiting } from './types';

export type Severity = 'info' | 'nudge' | 'alert' | 'escalate';
export type Notice = { id: string; title: string; body: string; severity: Severity; href: string; icon: string; when: string };

const sev = (n: number, lead: number): Severity | null => (n < 0 ? 'escalate' : n === 0 ? 'alert' : n <= lead ? 'nudge' : null);

type Prospect = { id: string; name: string; followup?: string; stage?: string };
type Coursework = { id: string; title: string; due?: string; status?: string };

// Notifications are derived from your real records, never invented.
export function useNotices(): Notice[] {
  const [settings] = useSettings();
  const [tasks] = useStore<Task[]>('tasks', []);
  const [bills] = useStore<Bill[]>('bills', []);
  const [waiting] = useStore<Waiting[]>('waiting', []);
  const [events] = useStore<CalEvent[]>('events', []);
  const [prospects] = useStore<Prospect[]>('biz:fieldwork:prospects', []);
  const [course] = useStore<Coursework[]>('edu:coursework', []);
  return useMemo(() => {
    const out: Notice[] = [];
    const lead = settings.leadDays;
    tasks.filter((t) => !t.done && t.due).forEach((t) => {
      const n = daysUntil(t.due)!;
      const s = sev(n, lead);
      if (s) out.push({ id: 't' + t.id, title: n < 0 ? 'Task overdue' : n === 0 ? 'Task due today' : 'Task due soon', body: `${t.title} · ${fmtDate(t.due)}`, severity: s, href: '/plan', icon: 'CalendarCheck', when: t.due! });
    });
    bills.filter((b) => !b.paid).forEach((b) => {
      const n = daysUntil(b.due)!;
      const s = sev(n, lead + 1);
      if (s) out.push({ id: 'b' + b.id, title: n < 0 ? 'Bill overdue' : 'Bill due', body: `${b.name} · ${fmtDate(b.due)}`, severity: s, href: '/finance', icon: 'Wallet', when: b.due });
    });
    waiting.filter((w) => !w.resolved && w.expected).forEach((w) => {
      const n = daysUntil(w.expected)!;
      if (n < 0) out.push({ id: 'w' + w.id, title: 'Still waiting', body: `${w.who} · ${w.what} (expected ${fmtDate(w.expected)})`, severity: 'nudge', href: '/waiting', icon: 'Hourglass', when: w.expected! });
    });
    events.forEach((e) => {
      const n = daysUntil(e.date);
      if (n === 0) out.push({ id: 'e' + e.id, title: 'Today in your calendar', body: `${e.time ? e.time + ' · ' : ''}${e.title}`, severity: 'info', href: '/plan', icon: 'CalendarCheck', when: e.date });
    });
    prospects.filter((p) => p.followup && p.stage !== 'Won' && p.stage !== 'Lost').forEach((p) => {
      const n = daysUntil(p.followup)!;
      const s = sev(n, 0);
      if (s) out.push({ id: 'p' + p.id, title: 'Fieldwork follow-up', body: `${p.name} · ${fmtDate(p.followup)}`, severity: s, href: '/businesses/fieldwork', icon: 'Briefcase', when: p.followup! });
    });
    course.filter((c) => c.due && c.status !== 'Done' && c.status !== 'Submitted').forEach((c) => {
      const n = daysUntil(c.due)!;
      const s = sev(n, lead + 5);
      if (s) out.push({ id: 'c' + c.id, title: n < 0 ? 'Coursework overdue' : 'Coursework deadline', body: `${c.title} · ${fmtDate(c.due)}`, severity: n < 0 ? 'escalate' : n <= 1 ? 'alert' : 'nudge', href: '/education', icon: 'GraduationCap', when: c.due! });
    });
    const rank: Record<Severity, number> = { escalate: 0, alert: 1, nudge: 2, info: 3 };
    return out.sort((a, b) => rank[a.severity] - rank[b.severity] || a.when.localeCompare(b.when));
  }, [settings.leadDays, tasks, bills, waiting, events, prospects, course]);
}
