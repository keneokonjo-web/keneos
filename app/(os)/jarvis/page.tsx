'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowUp, Mic, Trash2 } from 'lucide-react';
import { Orb } from '@/components/Orb';
import { useAssistant } from '@/components/useAssistant';
import { PageHead } from '@/components/ui';
import { useSettings, SHARE_AREAS } from '@/lib/settings';
import { relTime } from '@/lib/dates';

export default function JarvisPage() {
  const a = useAssistant();
  const [s] = useSettings();
  const [live, setLive] = useState<boolean | null>(null);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { fetch('/api/status').then((r) => r.json()).then((d) => setLive(Boolean(d.assistant))).catch(() => setLive(false)); }, []);
  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }); }, [a.msgs.length, a.state]);
  const shared = SHARE_AREAS.filter(([k]) => s.share[k]).map(([, l]) => l);
  return (
    <div className="page" style={{ maxWidth: 980 }}>
      <PageHead eyebrow="Assistant" title={`Chat with ${a.name}`} sub="Your chief of staff. It answers from the records you allow it to see, says when it does not know, and cannot send, edit, pay or publish anything." actions={<button className="btn" onClick={() => confirm('Clear this conversation?') && a.clear()}><Trash2 size={15} /> Clear</button>} />
      {live === false && <div className="card" style={{ marginBottom: 16, borderColor: 'rgba(210,122,110,.4)' }}><b style={{ fontWeight: 500 }}>The assistant is not connected yet.</b><p className="muted small" style={{ margin: '4px 0 0' }}>Add <span className="mono">ANTHROPIC_API_KEY</span> in the Vercel project’s environment variables and redeploy. Typing here will return an error until then.</p></div>}
      <div className="jp">
        <div className="jp-orb"><Orb state={a.state} level={a.level} /></div>
        <div className="card jp-chat">
          <div className="jp-msgs" aria-live="polite">
            {a.msgs.length === 0 && <p className="muted" style={{ margin: 'auto', textAlign: 'center' }}>Ask what to do first today, what you are waiting on, or to summarise your week.</p>}
            {a.msgs.map((m) => <div key={m.id} className={`jp-m ${m.role}`} style={m.error ? { color: 'var(--neg)' } : undefined}><div style={{ whiteSpace: 'pre-wrap' }}>{m.content}</div><div className="small muted">{relTime(m.at)}</div></div>)}
            {a.state === 'thinking' && <div className="jp-m assistant muted">Working…</div>}
            <div ref={end} />
          </div>
          {a.notice && <p className="small" style={{ color: 'var(--neg)', margin: '8px 0 0' }}>{a.notice}</p>}
          <form className="row" style={{ marginTop: 12 }} onSubmit={(e) => { e.preventDefault(); a.send(a.draft); }}>
            <button type="button" className={`iconbtn ${a.state === 'listening' ? 'btn-primary' : ''}`} onClick={a.listen} aria-label="Talk" aria-pressed={a.state === 'listening'}><Mic size={17} /></button>
            <input className="input" value={a.draft} onChange={(e) => a.setDraft(e.target.value)} placeholder={`Message ${a.name}…`} aria-label="Message" />
            <button className="btn btn-primary" disabled={!a.draft.trim() || a.state === 'thinking'}><ArrowUp size={16} /> Send</button>
          </form>
        </div>
      </div>
      <p className="small muted">It can currently see: {shared.join(', ') || 'nothing'}. Change this in <Link href="/settings#assistant" className="hl">Settings</Link>. Conversations are stored on this device only.</p>
      <style>{`.jp{display:grid;grid-template-columns:260px minmax(0,1fr);gap:16px;align-items:start}.jp-orb{aspect-ratio:1;position:sticky;top:80px}.jp-chat{display:flex;flex-direction:column;min-height:420px}.jp-msgs{flex:1;display:flex;flex-direction:column;gap:12px;max-height:56vh;overflow:auto;min-height:300px}.jp-m{max-width:86%;padding:10px 14px;border-radius:14px;background:var(--surface-2)}.jp-m.user{align-self:flex-end;background:var(--surface-3)}@media(max-width:800px){.jp{grid-template-columns:1fr}.jp-orb{max-width:240px;margin:0 auto;position:static}}`}</style>
    </div>
  );
}
