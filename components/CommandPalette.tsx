'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as Icons from 'lucide-react';
import { Search } from 'lucide-react';
import { NAV } from '@/lib/nav';
import { VENTURES } from '@/lib/themes';
import { readKey, writeKey } from '@/lib/store';
import { openQuickAdd } from './ui';

type Item = { id: string; title: string; sub: string; icon: string; href?: string; run?: () => void; keys?: string[]; jump?: boolean };

function Ico({ name }: { name: string }) {
  const C = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>>)[name] ?? Icons.Circle;
  return <C size={18} strokeWidth={1.6} />;
}

const RECORDS: { key: string; label: string; field: string; href: string; icon: string }[] = [
  { key: 'tasks', label: 'Task', field: 'title', href: '/plan', icon: 'CheckSquare' },
  { key: 'goals', label: 'Goal', field: 'title', href: '/goals', icon: 'Target' },
  { key: 'journal', label: 'Journal', field: 'text', href: '/goals', icon: 'NotebookPen' },
  { key: 'waiting', label: 'Waiting on', field: 'what', href: '/waiting', icon: 'Hourglass' },
  { key: 'files:links', label: 'Link', field: 'title', href: '/files', icon: 'Link' },
  { key: 'life:watch', label: 'Watchlist', field: 'title', href: '/lifestyle', icon: 'Film' },
  { key: 'life:places', label: 'Place', field: 'name', href: '/lifestyle', icon: 'MapPin' },
  { key: 'life:ideas', label: 'Content idea', field: 'idea', href: '/lifestyle', icon: 'Lightbulb' },
  { key: 'edu:subjects', label: 'Subject', field: 'name', href: '/education', icon: 'GraduationCap' },
  { key: 'edu:coursework', label: 'Coursework', field: 'title', href: '/education', icon: 'GraduationCap' },
  { key: 'biz:plot42:events', label: 'Plot42 event', field: 'name', href: '/businesses/plot42', icon: 'Briefcase' },
  { key: 'biz:fieldwork:prospects', label: 'Fieldwork prospect', field: 'name', href: '/businesses/fieldwork', icon: 'Briefcase' },
  { key: 'biz:media:pipeline', label: 'Media content', field: 'title', href: '/businesses/media', icon: 'Briefcase' },
  { key: 'invest:holdings', label: 'Holding', field: 'symbol', href: '/investments', icon: 'TrendingUp' },
  { key: 'accounts', label: 'Account', field: 'name', href: '/finance', icon: 'Wallet' },
  { key: 'growth:reading', label: 'Book', field: 'title', href: '/growth', icon: 'BookOpen' },
];

export function CommandPalette({ mac }: { mac: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const mod = mac ? '⌘' : 'Ctrl';

  useEffect(() => {
    const h = () => { setOpen(true); setQ(''); setSel(0); };
    window.addEventListener('kos:palette', h);
    return () => window.removeEventListener('kos:palette', h);
  }, []);

  const commands: Item[] = useMemo(() => {
    const pages: Item[] = NAV.flatMap((g) => g.items).map((i) => ({ id: 'p' + i.href, title: i.label, sub: `Go to ${i.label}`, icon: i.icon, href: i.href, jump: true }));
    const biz: Item[] = VENTURES.map((v) => ({ id: 'v' + v.slug, title: v.name, sub: `${v.tag}. ${v.status}`, icon: 'Briefcase', href: `/businesses/${v.slug}`, jump: true }));
    const acts: Item[] = [
      { id: 'a-task', title: 'Add task', sub: 'Create a task with a due date and area.', icon: 'Plus', run: () => openQuickAdd('task'), keys: [mod, 'J'] },
      { id: 'a-exp', title: 'Log expense', sub: 'Record spending against an account.', icon: 'Receipt', run: () => openQuickAdd('expense') },
      { id: 'a-note', title: 'Add journal note', sub: 'A personal comment, reflection or review.', icon: 'NotebookPen', run: () => openQuickAdd('note') },
      { id: 'a-idea', title: 'Capture content idea', sub: 'Social or media idea for later.', icon: 'Lightbulb', run: () => openQuickAdd('idea') },
      { id: 'a-wait', title: 'Add to waiting room', sub: 'Something you are waiting on someone for.', icon: 'Hourglass', run: () => openQuickAdd('waiting') },
      { id: 'a-dec', title: 'Log decision', sub: 'Record what you decided and why.', icon: 'Gavel', run: () => openQuickAdd('decision') },
      { id: 'a-link', title: 'Save link', sub: 'Keep a link in the library.', icon: 'Link', run: () => openQuickAdd('link') },
      { id: 'a-ask', title: 'Ask the assistant', sub: 'Open the chat with Jarvis.', icon: 'Bot', href: '/jarvis' },
      { id: 'a-rev', title: 'Start weekly review', sub: 'Reflect and plan the coming week.', icon: 'BarChart3', href: '/reviews' },
    ];
    return [...acts, ...biz, ...pages];
  }, [mod]);

  const results = useMemo<{ group: string; items: Item[] }[]>(() => {
    if (!open) return [];
    const term = q.trim().toLowerCase();
    if (!term) {
      const recent = readKey<Item[]>('cmd:recent', []);
      const out: { group: string; items: Item[] }[] = [];
      if (recent.length) out.push({ group: 'Recent', items: recent.map((r) => ({ ...r, run: undefined })) });
      out.push({ group: 'Actions', items: commands.slice(0, 7) });
      out.push({ group: 'Go to', items: commands.filter((c) => c.jump).slice(0, 8) });
      return out;
    }
    const cmd = commands.filter((c) => (c.title + ' ' + c.sub).toLowerCase().includes(term));
    const recs: Item[] = [];
    RECORDS.forEach((r) => {
      readKey<Record<string, unknown>[]>(r.key, []).forEach((row, i) => {
        const text = String(row[r.field] ?? '');
        if (text && text.toLowerCase().includes(term)) recs.push({ id: `${r.key}:${row.id ?? i}`, title: text.length > 70 ? text.slice(0, 70) + '…' : text, sub: r.label, icon: r.icon, href: r.href, jump: true });
      });
    });
    const out: { group: string; items: Item[] }[] = [];
    if (cmd.length) out.push({ group: 'Actions and pages', items: cmd.slice(0, 8) });
    if (recs.length) out.push({ group: 'Records', items: recs.slice(0, 8) });
    return out;
  }, [open, q, commands]);

  const flat = results.flatMap((g) => g.items);
  useEffect(() => setSel(0), [q]);
  useEffect(() => { listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' }); }, [sel]);

  if (!open) return null;
  const choose = (it: Item) => {
    setOpen(false);
    if (it.href) {
      const rec = readKey<Item[]>('cmd:recent', []).filter((r) => r.id !== it.id);
      writeKey('cmd:recent', [{ id: it.id, title: it.title, sub: it.sub, icon: it.icon, href: it.href, jump: true }, ...rec].slice(0, 4));
      router.push(it.href);
    }
    it.run?.();
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setOpen(false);
    else if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(flat.length - 1, s + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
    else if (e.key === 'Enter' && flat[sel]) choose(flat[sel]);
  };
  let idx = -1;
  return (
    <div className="cmd-wrap" onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)} onKeyDown={onKey}>
      <div className="cmd" role="dialog" aria-label="Command palette">
        <div className="cmd-input">
          <Search size={20} className="muted" />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type a command or search" aria-label="Command or search" />
          <span className="kbd">{mod} K</span>
        </div>
        <div className="cmd-list" ref={listRef}>
          {flat.length === 0 && <div className="empty" style={{ margin: 12 }}><b>No results</b>Nothing in your records matches “{q}”.</div>}
          {results.map((g) => (
            <div key={g.group}>
              <div className="cmd-group"><span>{g.group}</span>{g.group === 'Recent' && <a href="/settings" style={{ textDecoration: 'underline' }}>Customize</a>}</div>
              {g.items.map((it) => {
                idx++;
                const i = idx;
                return (
                  <div key={g.group + it.id} className="cmd-row" role="option" aria-selected={sel === i} onMouseMove={() => setSel(i)} onClick={() => choose(it)}>
                    <span className="icotile"><Ico name={it.icon} /></span>
                    <div className="grow"><div className="t">{it.title}</div><div className="s">{it.sub}</div></div>
                    {it.keys && <span className="row" style={{ gap: 4 }}>{it.keys.map((k) => <span key={k} className="kbd">{k}</span>)}</span>}
                    {it.jump && !it.keys && <span className="btn btn-sm">Jump to…</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="cmd-foot">
          <span><span className="kbd">↑</span><span className="kbd">↓</span> navigate</span>
          <span><span className="kbd">↵</span> open</span>
          <span><span className="kbd">esc</span> close</span>
        </div>
      </div>
    </div>
  );
}
