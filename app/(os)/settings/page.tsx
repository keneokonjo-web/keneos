'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Download, LogOut, Upload } from 'lucide-react';
import { PageHead } from '@/components/ui';
import { signOut } from '@/app/login/actions';
import { HOME_WIDGETS, SHARE_AREAS, useSettings } from '@/lib/settings';
import { CURRENCIES } from '@/lib/finance';
import { clearAll, exportAll, importAll, storageBytes, useStoreVersion } from '@/lib/store';

function Toggle({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return <label className="row between" style={{ padding: '9px 0', borderTop: '1px solid var(--line)' }}><span>{label}{hint && <span className="small muted" style={{ display: 'block' }}>{hint}</span>}</span><input type="checkbox" className="check" checked={checked} onChange={(e) => onChange(e.target.checked)} /></label>;
}

export default function Settings() {
  const [s, set] = useSettings();
  const [status, setStatus] = useState<{ assistant: boolean } | null>(null);
  const [bytes, setBytes] = useState(0);
  const v = useStoreVersion();
  const file = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState('');
  useEffect(() => { fetch('/api/status').then((r) => r.json()).then(setStatus).catch(() => setStatus({ assistant: false })); }, []);
  useEffect(() => setBytes(storageBytes()), [v]);

  const download = () => {
    const blob = new Blob([JSON.stringify({ app: 'kene-os', exportedAt: new Date().toISOString(), data: exportAll() }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `kene-os-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const restore = async (f: File) => {
    try {
      const j = JSON.parse(await f.text()) as { app?: string; data?: Record<string, unknown> };
      if (j.app !== 'kene-os' || !j.data) throw new Error();
      if (!confirm('Restore this backup? It replaces matching records on this device.')) return;
      importAll(j.data);
      setMsg('Backup restored.');
    } catch { setMsg('That file is not a Kene OS backup.'); }
  };

  const integrations: [string, string, string][] = [
    ['Gmail', 'Not connected', 'Needed for the important-inbox widget. Planned next, read-only first.'],
    ['Google Calendar', 'Not connected', 'Planned alongside Gmail. Events you add here stay local until then.'],
    ['Google Drive', 'Link library only', 'Docs, Sheets and Drive links preview in Files. Full Drive browse and search needs a Google sign-in.'],
    ['Assistant (Claude)', status === null ? 'Checking…' : status.assistant ? 'Connected' : 'Not connected', 'Server-side key. Required for replies. Never exposed to the browser.'],
    ['Exchange rates', 'Live', 'open.er-api.com, refreshed hourly.'],
    ['Bank and wallet links', 'Not connected', 'Balances are manual for now. Read-only links are a later phase.'],
    ['Movie and series posters', 'Manual upload', 'TMDB lookup can be added later.'],
    ['WhatsApp', 'Not possible', 'Personal WhatsApp has no official connection. Use quick links in Files.'],
  ];

  return (
    <div className="page" style={{ maxWidth: 940 }}>
      <PageHead eyebrow="Settings" title="Control" sub="Everything configurable lives here. No source-code edits needed." />
      <div className="stack" style={{ gap: 16 }}>
        <section className="card">
          <div className="card-h"><h3>Profile</h3><Link href="/setup" className="btn btn-sm">Run setup questionnaire</Link></div>
          <div className="formgrid">
            <div className="field"><label htmlFor="n">Your name</label><input id="n" className="input" value={s.ownerName} onChange={(e) => set({ ownerName: e.target.value })} /></div>
            <div className="field"><label htmlFor="a">Assistant name</label><input id="a" className="input" value={s.assistantName} onChange={(e) => set({ assistantName: e.target.value })} /></div>
            <div className="field"><label htmlFor="c">Display currency</label><select id="c" className="select" value={s.baseCurrency} onChange={(e) => set({ baseCurrency: e.target.value })}>{CURRENCIES.map((c) => <option key={c}>{c}</option>)}</select></div>
          </div>
          <Toggle label="Hide balances by default" checked={s.hideBalances} onChange={(v) => set({ hideBalances: v })} />
        </section>

        <section className="card">
          <div className="card-h"><h3>Home screen</h3></div>
          {HOME_WIDGETS.map(([k, l]) => <Toggle key={k} label={l} checked={s.home[k] !== false} onChange={(v) => set({ home: { ...s.home, [k]: v } })} />)}
        </section>

        <section className="card">
          <div className="card-h"><h3>Notifications</h3></div>
          <div className="row between" style={{ padding: '4px 0' }}><span>Warn me this many days before something is due<span className="small muted" style={{ display: 'block' }}>Applies to tasks, bills and coursework. Overdue items always show, and escalate.</span></span>
            <select className="select" style={{ width: 90 }} value={s.leadDays} onChange={(e) => set({ leadDays: Number(e.target.value) })} aria-label="Lead days">{[0, 1, 2, 3, 5, 7].map((n) => <option key={n} value={n}>{n} day{n === 1 ? '' : 's'}</option>)}</select></div>
          <p className="small muted" style={{ marginBottom: 0 }}>Push and email delivery are not set up. Alerts appear in Activity and on the bell.</p>
        </section>

        <section className="card" id="assistant">
          <div className="card-h"><h3>Assistant privacy</h3></div>
          <p className="muted" style={{ marginTop: 0 }}>Choose what the assistant may read when you talk to it. Anything switched off is never sent. It cannot change records, send messages or spend money.</p>
          {SHARE_AREAS.map(([k, l]) => <Toggle key={k} label={l} checked={s.share[k]} onChange={(v) => set({ share: { ...s.share, [k]: v } })} />)}
          <Toggle label="Speak replies aloud" hint="Uses your browser’s built-in voice." checked={s.voiceReplies} onChange={(v) => set({ voiceReplies: v })} />
        </section>

        <section className="card" id="integrations">
          <div className="card-h"><h3>Integrations</h3></div>
          <div className="table-wrap"><table className="table"><thead><tr><th>Service</th><th>Status</th><th>Notes</th></tr></thead><tbody>
            {integrations.map(([n, st, note]) => <tr key={n}><td style={{ fontWeight: 500 }}>{n}</td><td><span className={`chip ${st === 'Connected' || st === 'Live' ? 'chip-pos' : ''}`}>{st}</span></td><td className="small muted">{note}</td></tr>)}
          </tbody></table></div>
        </section>

        <section className="card" id="data">
          <div className="card-h"><h3>Your data</h3><span className="chip">{(bytes / 1024).toFixed(0)} KB on this device</span></div>
          <p className="muted" style={{ marginTop: 0 }}>Everything you enter is stored in this browser on this device. It is not on a server yet, so it will not follow you to another device and can be lost if site data is cleared. Back up regularly until a database is connected.</p>
          <div className="row wrap"><button className="btn btn-primary" onClick={download}><Download size={15} /> Download backup</button><button className="btn" onClick={() => file.current?.click()}><Upload size={15} /> Restore backup</button>
            <input ref={file} type="file" accept="application/json" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) restore(f); e.target.value = ''; }} />
            <button className="btn btn-danger" onClick={() => { if (prompt('This erases all data on this device. Type DELETE to confirm.') === 'DELETE') { clearAll(); setMsg('All local data erased.'); } }}>Erase all data</button></div>
          {msg && <p role="status" className="small" style={{ marginBottom: 0 }}>{msg}</p>}
        </section>

        <section className="card">
          <div className="card-h"><h3>Security</h3></div>
          <p className="muted" style={{ marginTop: 0 }}>One owner account. Sessions last 30 days. Account creation closes once an account exists.</p>
          <form action={signOut}><button className="btn"><LogOut size={15} /> Sign out</button></form>
        </section>
      </div>
    </div>
  );
}
