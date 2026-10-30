'use client';
import { useEffect, useRef } from 'react';

const tiles = [
  { d: 0.02, s: 'left:34%;top:9%;width:24%;height:56%;z-index:3', img: 'cup', pos: '40% 60%' },
  { d: 0.04, s: 'left:20%;top:26%;width:16%;height:30%;z-index:2', img: 'shutters' },
  { d: 0.03, s: 'left:58%;top:6%;width:17%;height:30%;z-index:2', img: 'doors' },
  { d: 0.05, s: 'left:78%;top:12%;width:14%;height:36%;z-index:2', img: 'tag', pos: '50% 40%' },
  { d: 0.02, s: 'left:62%;top:44%;width:20%;height:30%;z-index:4', img: 'wall' },
  { d: 0.05, s: 'left:6%;top:12%;width:11%;height:22%;z-index:1', img: 'stencil' },
  { d: 0.04, s: 'left:41%;top:62%;width:14%;height:22%;z-index:5', img: 'doors', pos: '20% 50%' },
];
const css = (s: string): React.CSSProperties => Object.fromEntries(s.split(';').map((x) => { const [k, v] = x.split(':'); return [k.replace(/-(\w)/g, (_, c) => c.toUpperCase()), v]; }));

export default function Collage() {
  const el = useRef<HTMLElement>(null);
  useEffect(() => {
    const m = (e: MouseEvent) => {
      const x = e.clientX - innerWidth / 2, y = e.clientY - innerHeight / 2;
      el.current?.querySelectorAll<HTMLElement>('.c').forEach((c) => { const d = Number(c.dataset.d); c.style.transform = `translate(${-x * d}px,${-y * d}px)`; });
    };
    window.addEventListener('mousemove', m);
    return () => window.removeEventListener('mousemove', m);
  }, []);
  return (
    <>
      <section className="collage" ref={el} aria-label="Visuals">
        {tiles.map((t, i) => (<div key={i} className="c" data-d={t.d} style={css(t.s)}><img src={`/img/${t.img}.jpg`} alt="" style={t.pos ? { objectPosition: t.pos } : undefined} /></div>))}
        <div className="word"><img src="/mark/designedbykjo-hd-black.png" alt="DesignedByKJO" /></div>
        <div className="note">A personal collection, <em>on my own terms.</em></div>
      </section>
      <section className="collage-m" aria-label="Visuals">
        <div className="gr">{['cup', 'shutters', 'doors', 'tag', 'wall', 'stencil'].map((n) => (<img key={n} src={`/img/${n}.jpg`} alt="" loading="lazy" />))}</div>
        <div className="word"><img src="/mark/designedbykjo-hd-black.png" alt="DesignedByKJO" /></div>
        <p>A personal collection, <em className="it">on my own terms.</em></p>
      </section>
    </>
  );
}
