'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { pages } from '@/content/site';

export default function PeekIndex() {
  const [on, setOn] = useState(false);
  const [img, setImg] = useState(pages[0].img);
  const el = useRef<HTMLDivElement>(null);
  const move = (e: React.MouseEvent) => {
    if (el.current) el.current.style.transform = `translate(${e.clientX}px,${e.clientY}px) translate(-50%,-50%) scale(${on ? 1 : 0.9})`;
  };
  return (
    <div className="index" onMouseMove={move} onMouseLeave={() => setOn(false)}>
      {pages.map((p) => (
        <Link key={p.slug} href={'/' + p.slug} onMouseEnter={() => { setImg(p.img); setOn(true); }} className="rv">
          <span className="mono">{p.n}</span>
          <span className="t">{p.title}</span>
          <span className="s">{p.sub}</span>
        </Link>
      ))}
      <div ref={el} className={'peek' + (on ? ' on' : '')} aria-hidden="true"><img src={'/img/' + img + '.jpg'} alt="" /></div>
    </div>
  );
}
