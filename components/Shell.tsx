'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import * as Icons from 'lucide-react';
import { Bell, ChevronDown, LogOut, Menu, Plus, Search, X } from 'lucide-react';
import { NAV } from '@/lib/nav';
import { useStore, useStoreVersion, storageBytes } from '@/lib/store';
import { useNotices } from '@/lib/notify';
import { useSettings } from '@/lib/settings';
import { isoToday } from '@/lib/dates';
import type { Task } from '@/lib/types';
import { signOut } from '@/app/login/actions';
import { CommandPalette } from './CommandPalette';
import { QuickAdd } from './QuickAdd';
import { openPalette, openQuickAdd } from './ui';

function Ico({ name, size = 18 }: { name: string; size?: number }) {
  const C = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>>)[name] ?? Icons.Circle;
  return <C size={size} strokeWidth={1.6} />;
}

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [settings] = useSettings();
  const notices = useNotices();
  const [tasks] = useStore<Task[]>('tasks', []);
  const [mac, setMac] = useState(false);
  const overdue = tasks.filter((t) => !t.done && t.due && t.due < isoToday()).length;
  const urgent = notices.filter((n) => n.severity !== 'info').length;

  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    setMac(/Mac|iPhone|iPad/.test(navigator.platform));
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openPalette(); }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') { e.preventDefault(); openQuickAdd(); }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  return (
    <>
      <header className="topbar">
        <button className="iconbtn" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={18} /></button>
        <Link href="/" className="brand hide-sm"><span className="brand-mark">K</span><span>Kene OS</span></Link>
        <button className="searchbtn" onClick={openPalette} aria-label="Search or run a command">
          <Search size={16} />
          <span className="grow hint-text">Search or type a command</span>
          <span className="kbd hide-sm">{mac ? '⌘' : 'Ctrl'} K</span>
        </button>
        <button className="btn btn-primary hide-sm" onClick={() => openQuickAdd()}><Plus size={16} /> Quick add</button>
        <button className="iconbtn show-sm" onClick={() => openQuickAdd()} aria-label="Quick add"><Plus size={18} /></button>
        <Link href="/activity" className="iconbtn" style={{ position: 'relative' }} aria-label={`Notifications${urgent ? `, ${urgent} need attention` : ''}`}>
          <Bell size={18} />
          {urgent > 0 && <span className="badge-dot" />}
        </Link>
        <Link href="/settings" className="iconbtn" aria-label="Profile and settings" style={{ fontWeight: 600 }}>{settings.ownerName.slice(0, 1).toUpperCase()}</Link>
      </header>

      {open && (
        <>
          <div className="scrim" onClick={() => setOpen(false)} />
          <nav className="drawer" aria-label="Main">
            <div className="row between">
              <Link href="/" className="brand"><span className="brand-mark">K</span><span>Kene OS</span></Link>
              <button className="iconbtn" onClick={() => setOpen(false)} aria-label="Close menu"><X size={16} /></button>
            </div>
            <button className="searchbtn" style={{ margin: '14px 0 0', maxWidth: 'none', width: '100%', flex: 'none' }} onClick={() => { setOpen(false); openPalette(); }}>
              <Search size={16} /><span className="grow">Search</span>
            </button>
            <div className="drawer-scroll">
              {NAV.map((g) => (
                <div key={g.label}>
                  <div className="nav-label">{g.label}</div>
                  {g.items.map((it) => {
                    const active = it.href === '/' ? path === '/' : path === it.href || path.startsWith(it.href + '/');
                    const count = it.badge === 'tasks' ? overdue : it.badge === 'activity' ? urgent : 0;
                    return (
                      <div key={it.href}>
                        <Link href={it.href} className="nav-item" aria-current={active && !it.children ? 'page' : undefined}>
                          <Ico name={it.icon} />
                          <span>{it.label}</span>
                          {count > 0 && <span className="nav-count">{count}</span>}
                          {it.children && <ChevronDown size={14} style={{ marginLeft: 'auto', opacity: 0.5, transform: active ? 'none' : 'rotate(-90deg)' }} />}
                        </Link>
                        {it.children && active && (
                          <div className="nav-sub">
                            {it.children.map((c) => (
                              <Link key={c.href} href={c.href} className="nav-item" aria-current={path === c.href ? 'page' : undefined}>{c.label}</Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <Meter />
            <form action={signOut}><button className="nav-item" style={{ marginTop: 8 }}><LogOut size={18} strokeWidth={1.6} /> Sign out</button></form>
          </nav>
        </>
      )}

      <main>{children}</main>
      <CommandPalette mac={mac} />
      <QuickAdd />
    </>
  );
}

function Meter() {
  const [bytes, setBytes] = useState(0);
  const v = useStoreVersion();
  useEffect(() => { setBytes(storageBytes()); }, [v]);
  const pct = Math.min(100, (bytes / (5 * 1024 * 1024)) * 100);
  const r = 40, c = Math.PI * r;
  return (
    <Link href="/settings#data" className="meter" style={{ display: 'block' }}>
      <svg viewBox="0 0 100 56" width="120" aria-hidden>
        <path d="M10 50 A40 40 0 0 1 90 50" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="5" strokeLinecap="round" />
        <path d="M10 50 A40 40 0 0 1 90 50" fill="none" stroke="#f3f1ea" strokeWidth="5" strokeLinecap="round" strokeDasharray={`${(pct / 100) * c} ${c}`} />
      </svg>
      <div style={{ marginTop: -10 }} className="tnum"><b>{(bytes / 1024).toFixed(0)} KB</b> <span className="muted">of ~5 MB</span></div>
      <div className="small muted">Stored on this device. Back up in Settings.</div>
    </Link>
  );
}
