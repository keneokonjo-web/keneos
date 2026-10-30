'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { brand, pages } from '@/content/site';

const left = [{ href: '/visuals', label: 'Visuals' }, { href: '/field-notes', label: 'Field Notes' }];
const right = [{ href: '/designedbykjo', label: 'Clothing' }, { href: '/projects', label: 'Projects' }];

export default function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [ar, setAr] = useState(false);
  const [en, setEn] = useState(false);
  const [out, setOut] = useState(false);
  const [done, setDone] = useState(false);
  const timers = useRef<number[]>([]);

  const finish = () => {
    timers.current.forEach((t) => clearTimeout(t));
    const root = document.documentElement;
    root.classList.add('ready');
    try { sessionStorage.setItem('kjo-seen', '1'); } catch {}
    document.body.style.overflow = '';
    setAr(false); setEn(false); setOut(true); setDone(true);
    setTimeout(() => root.classList.add('seen'), 1400);
  };

  // intro: black, Arabic fades in, English fades in beneath, both fade out, header fades in where it will live
  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains('seen')) { setDone(true); return; }
    document.body.style.overflow = 'hidden';
    const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));
    at(700, () => setAr(true));
    at(2400, () => setEn(true));
    at(5200, () => { setAr(false); setEn(false); });
    at(6300, () => { root.classList.add('ready'); setOut(true); });
    at(7700, finish);
    return () => timers.current.forEach((t) => clearTimeout(t));
  }, []);

  // header sits at mid-screen on the home hero (which does not scroll) and at the top everywhere else
  useEffect(() => {
    const root = document.documentElement;
    const home = path === '/';
    root.classList.toggle('home', home);
    root.classList.toggle('lock', home);
    const upd = () => {
      const y = home && window.innerWidth > 900 ? Math.max(0, window.innerHeight / 2 - 27) : 0;
      root.style.setProperty('--hy', y + 'px');
    };
    upd();
    window.addEventListener('resize', upd);
    return () => window.removeEventListener('resize', upd);
  }, [path]);
  useEffect(() => { document.documentElement.classList.toggle('menu-open', open); }, [open]);

  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, []);
  useEffect(() => { if (done) document.body.style.overflow = open ? 'hidden' : ''; }, [open, done]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const els = Array.from(document.querySelectorAll('.rv,.mask,.cr'));
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [path]);

  const group = (items: { href: string; label: string }[]) =>
    items.map((it, i) => (<span key={it.href}><Link href={it.href} className={path.startsWith(it.href) ? 'on' : ''}>{it.label}</Link>{i < items.length - 1 ? ', ' : ''}</span>));

  return (
    <>
      <div className={'loader' + (done ? ' fin' : ' on') + (out ? ' out' : '')} aria-hidden="true">
        <div className="bgc" />
        <div className="q">
          <div className={'ar' + (ar ? ' show' : '')} lang="ar">لا يمكنك أن تعلّم الأعمى كيف يرى</div>
          <div className={'en' + (en ? ' show' : '')}>You <i>can’t</i> teach a blind man to see.</div>
        </div>
        <button className="skip" onClick={finish}>Skip</button>
      </div>

      <header className="hdr">
        <Link href="/" className="logo" aria-label="DesignedByKJO, home"><img src="/mark/designedbykjo-hd-white.png" alt="DesignedByKJO" /></Link>
        <nav className="g g1" aria-label="Pages">{group(left)}</nav>
        <nav className="g g2" aria-label="Pages">{group(right)}</nav>
        <div className="r">
          <button className="menubtn" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="menu">
            <span>{open ? 'Close' : 'Menu'}</span><i />
          </button>
        </div>
      </header>

      <nav id="menu" className={'menu' + (open ? ' open' : '')} aria-label="Contents">
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
          <div className="marq" aria-hidden="true"><div className="mt" lang="ar">{Array.from({ length: 8 }).map((_, k) => (<span key={k}>لا يمكنك أن تعلّم الأعمى كيف يرى<i>✦</i></span>))}</div></div>
        </div>
      </nav>

      <main>{children}</main>
    </>
  );
}
