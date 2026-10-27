'use client';
import Link from 'next/link';
import { ArrowUp, Mic, Maximize2 } from 'lucide-react';
import { Orb } from './Orb';
import { useAssistant } from './useAssistant';

const STATE_LABEL = { idle: 'Idle', listening: 'Listening', thinking: 'Working', speaking: 'Speaking', error: 'Error' } as const;
const SUGGEST = ['What should I do first today?', 'What am I waiting on?', 'Summarise my week so far'];

export function JarvisPanel({ compact = false }: { compact?: boolean }) {
  const a = useAssistant();
  const last = a.msgs.slice(-2);
  return (
    <section className="jv" aria-label="Assistant">
      <div className="jv-orb"><Orb state={a.state} level={a.level} /></div>
      <div className="jv-name">
        <h2 className="mono">{a.name.toUpperCase()}</h2>
        <span className="eyebrow" aria-live="polite">{STATE_LABEL[a.state]}</span>
      </div>
      {!compact && last.length > 0 && (
        <div className="jv-last" aria-live="polite">
          {last.map((m) => <p key={m.id} className={m.role === 'user' ? 'u' : m.error ? 'e' : ''}>{m.content}</p>)}
        </div>
      )}
      {a.notice && <p className="small" style={{ color: 'var(--neg)', textAlign: 'center', margin: '4px 0' }}>{a.notice}</p>}
      <form className="jv-input" onSubmit={(e) => { e.preventDefault(); a.send(a.draft); }}>
        <button type="button" className={`iconbtn ${a.state === 'listening' ? 'on' : ''}`} onClick={a.listen} aria-label={a.state === 'listening' ? 'Stop listening' : 'Talk'} aria-pressed={a.state === 'listening'}><Mic size={17} /></button>
        <input value={a.draft} onChange={(e) => a.setDraft(e.target.value)} placeholder={`Ask ${a.name}…`} aria-label={`Message ${a.name}`} disabled={a.state === 'thinking'} />
        <button className="iconbtn" aria-label="Send" disabled={!a.draft.trim() || a.state === 'thinking'}><ArrowUp size={17} /></button>
        {!compact && <Link href="/jarvis" className="iconbtn" aria-label="Open full chat"><Maximize2 size={15} /></Link>}
      </form>
      {!compact && a.msgs.length === 0 && (
        <div className="row wrap" style={{ justifyContent: 'center', marginTop: 10 }}>
          {SUGGEST.map((s) => <button key={s} type="button" className="chip" onClick={() => a.send(s)}>{s}</button>)}
        </div>
      )}
      <style>{css}</style>
    </section>
  );
}

const css = `
.jv{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:540px;position:relative;padding:8px 0 0}
.jv-orb{width:min(100%,520px);aspect-ratio:1;margin-bottom:-70px}
.jv-name{text-align:center;position:relative}
.jv-name h2{margin:0;font-weight:400;font-size:34px;letter-spacing:.42em;padding-left:.42em}
.jv-last{max-width:560px;margin:14px auto 4px;text-align:center;font-size:14px;color:var(--ink-2);display:flex;flex-direction:column;gap:6px;max-height:140px;overflow:auto}
.jv-last p{margin:0}.jv-last .u{color:var(--muted);font-size:13px}.jv-last .e{color:var(--neg)}
.jv-input{display:flex;gap:8px;align-items:center;width:min(100%,560px);margin-top:18px;padding:6px;border:1px solid var(--line-strong);border-radius:16px;background:rgba(18,18,19,.8);backdrop-filter:blur(6px)}
.jv-input input{flex:1;min-width:0;background:transparent;border:0;outline:0;height:36px;font-size:14px;padding:0 6px}
.jv-input .iconbtn{border-color:transparent;background:transparent}
.jv-input .iconbtn.on{background:var(--ink);color:#000}
.jv-input .iconbtn:disabled{opacity:.35}
@media(max-width:720px){.jv{min-height:440px}.jv-orb{margin-bottom:-50px}.jv-name h2{font-size:26px}}
`;
