'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { brand, pages } from '@/content/site';

type Pos = { left: number; top: number };

export default function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [say, setSay] = useState(false);
  const [pts, setPts] = useState(false);
  const [slide, setSlide] = useState(false);
  const [done, setDone] = useState(false);
  const [pos, setPos] = useState<{ a: Pos; b: Pos; target: { a: Pos; b: Pos } } | null>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const timers = useRef<number[]>([]);

  const finish = () => {
    timers.current.forEach((t) => clearTimeout(t));
    const root = document.documentElement;
    root.classList.add('ready');
    try { sessionStorage.setItem('kjo-seen', '1'); } catch {}
    document.body.style.overflow = '';
    setDone(true);
    setTimeout(() => root.classList.add('seen'), 1300);
  };

  // loader: black, line of text fades in and out, then two marks slide up into the header
  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains('seen')) { setDone(true); return; }
    document.body.style.overflow = 'hidden';
    const measure = () => {
      const l = logoRef.current?.getBoundingClientRect();
      const m = menuRef.current?.getBoundingClientRect();
      if (!l || !m) return null;
      const mid = window.innerHeight / 2;
      return { a: { left: l.left, top: mid }, b: { left: m.left, top: mid }, target: { a: { left: l.left, top: l.top }, b: { left: m.left, top: m.top } } };
    };
    const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));
    at(600, () => setSay(true));        // text fades in
    at(2800, () => setSay(false));      // and out
    at(3900, () => { setPos(measure()); setPts(true); }); // two marks appear, left and right
    at(4900, () => setSlide(true));     // slide to the top, background lifts
    at(6200, finish);
    return () => timers.current.forEach((t) => clearTimeout(t));
  }, []);

  // close menu on navigation / Escape
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, []);
  useEffect(() => { if (done) document.body.style.overflow = open ? 'hidden' : ''; }, [open, done]);

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
      <div className={'loader' + (done ? ' fin' : ' on') + (slide ? ' slide' : '')} aria-hidden="true">
        <div className="bgc" />
        <div className={'say' + (say ? ' show' : '')}>Direction and distinction</div>
        {pos && (
          <>
            <div className={'pt' + (pts ? ' show' : '')} style={{ left: pos.a.left, top: slide ? pos.target.a.top : pos.a.top, transform: slide ? 'none' : 'translateY(-50%)' }}>
              <img src="/mark/cross-fleur-white.png" alt="" /><span className="logo">{brand.name}</span>
            </div>
            <div className={'pt ptm' + (pts ? ' show' : '')} style={{ left: pos.b.left, top: slide ? pos.target.b.top : pos.b.top, transform: slide ? 'none' : 'translateY(-50%)' }}>
              <span>Menu</span><i />
            </div>
          </>
        )}
        <button className="skip" onClick={finish}>Skip</button>
      </div>

      <header className="hdr">
        <div className="l">
          <Link ref={logoRef} href="/" className="logo" aria-label="KJO home"><img src="/mark/cross-fleur-white.png" alt="" /><span>{brand.name}</span></Link>
        </div>
        <div className="c">{brand.tagline}</div>
        <div className="x"><img src="/mark/cross-fleur-white.png" alt="" /></div>
        <div className="r">
          <button ref={menuRef} className="menubtn" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="menu">
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
