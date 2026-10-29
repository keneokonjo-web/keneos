'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { brand, pages } from '@/content/site';

export default function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [out, setOut] = useState(false);

  // loader: counts to 100 once per session, then lifts
  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains('seen')) return;
    document.body.style.overflow = 'hidden';
    const start = performance.now();
    const dur = 2400;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setCount(Math.round(100 * (1 - Math.pow(1 - p, 2.2))));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        setOut(true);
        document.body.style.overflow = '';
        setTimeout(() => { try { sessionStorage.setItem('kjo-seen', '1'); } catch {} root.classList.add('seen'); }, 1200);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // close menu on navigation / Escape
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, []);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; }, [open]);

  // scroll reveals
  useEffect(() => {
    window.scrollTo(0, 0);
    const els = Array.from(document.querySelectorAll('.rv,.mask'));
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [path]);

  return (
    <>
      <div className={'loader' + (out ? ' out' : '')} aria-hidden="true">
        <div className="wm"><div className="wmt">DesignedByKJO</div></div>
        <div className="count">{String(count).padStart(3, '0')}</div>
        <div className="lab">Original by nature</div>
        <div className="bar" style={{ width: count + '%' }} />
      </div>

      <header className="hdr">
        <div className="l">
          <Link href="/" className="logo" aria-label="KJO home"><img src="/mark/cross-fleur-white.png" alt="" /><span>{brand.name}</span></Link>
        </div>
        <div className="c">{brand.tagline}</div>
        <div className="x"><img src="/mark/cross-fleur-white.png" alt="" /></div>
        <div className="r">
          <button className="menubtn" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="menu">
            <span>{open ? 'Close' : 'Menu'}</span><i />
          </button>
        </div>
      </header>

      <nav id="menu" className={'menu' + (open ? ' open' : '')} aria-label="Contents" aria-hidden={!open}>
        <div className="in">
          <h2>Contents</h2>
          <div className="rows">
            {pages.map((p, i) => (
              <Link key={p.slug} href={'/' + p.slug} className="mrow" style={{ transitionDelay: open ? 250 + i * 70 + 'ms' : '0ms' }} tabIndex={open ? 0 : -1}>
                <div><div className="t">{p.title}</div><div className="s">{p.sub}</div></div>
                <div className="n">{Number(p.n)}</div>
                <div className="im"><img src={'/img/' + p.img + '.jpg'} alt="" style={{ objectPosition: p.pos }} /></div>
              </Link>
            ))}
          </div>
          <div className="foot"><span>{brand.mark}</span><span>Contents</span></div>
        </div>
      </nav>

      <main>{children}</main>
    </>
  );
}
