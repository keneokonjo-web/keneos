'use client';
import { useEffect, useRef, useState } from 'react';

const items = [
  { n: '001', name: 'Character 001', img: '/img/figure.png', locked: false },
  { n: '002', name: 'Character 002', img: '/img/figure.png', locked: true },
  { n: '003', name: 'Character 003', img: '/img/figure.png', locked: true },
];

export default function CharacterSelect() {
  const [i, setI] = useState(0);
  const root = useRef<HTMLElement>(null);
  const go = (d: number) => setI((v) => (v + d + items.length) % items.length);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const r = root.current?.getBoundingClientRect();
      if (!r || r.top > innerHeight * 0.6 || r.bottom < innerHeight * 0.4) return;
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, []);

  const off = (idx: number) => { let d = idx - i; if (d > 1) d -= items.length; if (d < -1) d += items.length; return d; };

  return (
    <section className="csel" ref={root} aria-label="Select your character">
      <img className="cw" src="/mark/character-hd-white.png" alt="Character" />
      <div className="stage">
        {items.map((c, idx) => {
          const d = off(idx);
          const x = d * 30; // vw
          const scale = d === 0 ? 1 : 0.55;
          return (
            <div key={c.n} className={'card' + (c.locked ? ' lock' : '')} aria-hidden={d !== 0}
              style={{ transform: `translate(calc(-50% + ${x}vw),-50%) scale(${scale})`, opacity: d === 0 ? 1 : 0.3 }}>
              <img src={c.img} alt={c.locked ? '' : 'Watercolour illustration of the first Character'} />
              {c.locked && d === 0 && <span className="tag">Locked, image to come</span>}
            </div>
          );
        })}
        <button className="arr l" onClick={() => go(-1)} aria-label="Previous character"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M15 4 7 12l8 8" /></svg></button>
        <button className="arr r" onClick={() => go(1)} aria-label="Next character"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="m9 4 8 8-8 8" /></svg></button>
      </div>
      <div className="sel"><b>Select your character</b><span className="mono">{items[i].n} / {String(items.length).padStart(3, '0')} · {items[i].name}</span></div>
    </section>
  );
}
