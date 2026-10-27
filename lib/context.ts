'use client';
import { readKey } from './store';
import { DEFAULTS, type Settings } from './settings';
import { daysUntil, isoToday } from './dates';
import type { Goal, Task, Waiting } from './types';

// Builds the compact, permission-filtered snapshot sent with each assistant request.
// Only areas switched on in Settings → Assistant privacy are included.
export function buildContext(): string {
  const s = { ...DEFAULTS, ...readKey<Partial<Settings>>('settings', {}) };
  const share = { ...DEFAULTS.share, ...(s.share ?? {}) };
  const parts: string[] = [`Today is ${isoToday()}. Owner: ${s.ownerName}.`];
  if (share.tasks) {
    const tasks = readKey<Task[]>('tasks', []).filter((t) => !t.done);
    parts.push(`OPEN TASKS (${tasks.length}): ` + (tasks.slice(0, 40).map((t) => `${t.title} [${t.area}${t.due ? `, due ${t.due}` : ''}${t.priority === 'high' ? ', high' : ''}${t.today ? ', today' : ''}]`).join('; ') || 'none'));
    const w = readKey<Waiting[]>('waiting', []).filter((x) => !x.resolved);
    parts.push(`WAITING ON (${w.length}): ` + (w.map((x) => `${x.who}: ${x.what}${x.expected ? ` (expected ${x.expected}, ${daysUntil(x.expected)}d)` : ''}`).join('; ') || 'none'));
  }
  if (share.goals) {
    const g = readKey<Goal[]>('goals', []);
    parts.push(`GOALS (${g.length}): ` + (g.map((x) => `${x.title} [${x.horizon}, ${x.progress}%]`).join('; ') || 'none'));
  }
  if (share.business) {
    parts.push('BUSINESSES: WAYKON Holdings (brand and intent, unregistered; intended 100% owner of the ventures), Plot42 (live; next event summer), Fieldwork (just started; no paying clients), WAYKON Media (not operating yet).');
    parts.push(`PLOT42 EVENTS: ${JSON.stringify(readKey<unknown[]>('biz:plot42:events', []).slice(0, 10))}`);
    parts.push(`FIELDWORK PROSPECTS: ${JSON.stringify(readKey<unknown[]>('biz:fieldwork:prospects', []).slice(0, 20))}`);
    parts.push(`MEDIA PIPELINE: ${JSON.stringify(readKey<unknown[]>('biz:media:pipeline', []).slice(0, 20))}`);
  }
  if (share.education) {
    parts.push(`A-LEVEL SUBJECTS: ${JSON.stringify(readKey<unknown[]>('edu:subjects', []))}; COURSEWORK: ${JSON.stringify(readKey<unknown[]>('edu:coursework', []).slice(0, 20))}`);
  }
  if (share.health) parts.push(`HABITS: ${JSON.stringify(readKey<unknown[]>('habits', []))}`);
  if (share.finance) {
    parts.push(`ACCOUNTS: ${JSON.stringify(readKey<unknown[]>('accounts', []))}; SAVINGS GOALS: ${JSON.stringify(readKey<unknown[]>('savings', []))}; HOLDINGS: ${JSON.stringify(readKey<unknown[]>('invest:holdings', []))}`);
  } else parts.push('FINANCE: not shared with the assistant.');
  return parts.join('\n');
}
