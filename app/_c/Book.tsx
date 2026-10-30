'use client';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { companies, type Company } from '@/content/site';

const items = companies.filter((c) => !c.internal);

function Left({ c, n }: { c: Company; n: number }) {
  return (
    <div className="pgi pg-l">
      <div className="hd mono"><span>Work</span><span>{c.code}</span></div>
      <div className="meta mono">{c.meta.map((m) => (<div key={m}>{m}</div>))}</div>
      <h1>{c.name}</h1>
      <div className="txt mono">{c.text.map((t, i) => (<p key={i}>{t}</p>))}</div>
      <div className="pn mono">{String(n * 2 + 1).padStart(3, '0')}</div>
    </div>
  );
}
function Right({ c, n }: { c: Company; n: number }) {
  return (
    <div className="pgi pg-r">
      <div className="hd mono"><span>{c.name}</span><span>Preview</span></div>
      <div className="grp">
        <div className="frame">
          <div className="cap mono"><span>Website preview</span><span>{c.code}</span></div>
          <div className="shot">
            {c.preview ? <img src={`/img/${c.preview}.jpg`} alt={`Preview of ${c.host}`} /> : <div className="nopv mono">Preview unavailable</div>}
          </div>
          <div className="cap mono"><span>{c.host}</span><span>Live site</span></div>
        </div>
        <a className="disc mono" href={c.url} target="_blank" rel="noopener noreferrer">Discover {c.name} <span aria-hidden="true">→</span></a>
      </div>
      <div className="pn mono">{String(n * 2 + 2).padStart(3, '0')}</div>
    </div>
  );
}

export default function Book({ start }: { start: number }) {
  const [i, setI] = useState(start);
  const [fl, setFl] = useState<null | { dir: 1 | -1; to: number; go: boolean }>(null);
  const busy = useRef(false);

  const go = useCallback((d: 1 | -1) => {
    if (busy.current) return;
    const to = i + d;
    if (to < 0 || to >= items.length) return;
    const flat = window.innerWidth <= 900 || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const done = () => { setI(to); setFl(null); busy.current = false; try { window.history.replaceState(null, '', '/work/' + items[to].slug); } catch {} };
    busy.current = true;
    if (flat) { done(); return; }
    setFl({ dir: d, to, go: false });
    requestAnimationFrame(() => requestAnimationFrame(() => setFl((f) => (f ? { ...f, go: true } : f))));
    window.setTimeout(done, 1050);
  }, [i]);

  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [go]);

  const cur = items[i];
  const tgt = fl ? items[fl.to] : cur;
  const leftC = fl && fl.dir === -1 ? tgt : cur;
  const rightC = fl && fl.dir === 1 ? tgt : cur;

  return (
    <div className="book" aria-label="Companies">
      <div className="half l"><Left c={leftC} n={items.indexOf(leftC)} /></div>
      <div className="half r"><Right c={rightC} n={items.indexOf(rightC)} /></div>
      <div className="gutter" aria-hidden="true" />
      {fl && (
        <div className={'flipper ' + (fl.dir === 1 ? 'next' : 'prev') + (fl.go ? ' go' : '')} aria-hidden="true">
          <div className="face front">{fl.dir === 1 ? <Right c={cur} n={i} /> : <Left c={cur} n={i} />}</div>
          <div className="face back">{fl.dir === 1 ? <Left c={tgt} n={fl.to} /> : <Right c={tgt} n={fl.to} />}</div>
        </div>
      )}
      <button className="bk bk-l" onClick={() => go(-1)} disabled={i === 0} aria-label="Previous company"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 4 7 12l8 8" /></svg></button>
      <button className="bk bk-r" onClick={() => go(1)} disabled={i === items.length - 1} aria-label="Next company"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m9 4 8 8-8 8" /></svg></button>
      <Link href="/work" className="backw mono">‹ My companies</Link>
    </div>
  );
}
