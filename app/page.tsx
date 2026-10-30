import Link from 'next/link';
import HeroClock from './_c/HeroClock';
import { heroPhotos, pages } from '@/content/site';

export default function Home() {
  const n = Math.max(heroPhotos.length, 1);
  return (
    <>
      {/* The home page is the hero. It does not scroll on desktop. */}
      <section className="hero" aria-label="Introduction">
        <div className="bg">
          {heroPhotos.map((p, i) => (<img key={p} src={`/img/${p}.jpg`} alt="" style={{ animationDelay: `${i * 10}s`, animationName: heroPhotos.length > 1 ? undefined : 'zoom', opacity: heroPhotos.length > 1 ? undefined : 1 }} />))}
        </div>
        <div className="kjo"><img src="/mark/cross-fleur-white.png" alt="" /><span>KJO</span></div>
        <HeroClock />
        <div className="rbox"><span>Character, collection 001. Not yet released</span><span>[X]</span></div>
      </section>

      {/* Mobile hero: stacked full-bleed panels, one per page */}
      <section className="hero-m" aria-label="Pages">
        {pages.map((p, i) => (
          <Link key={p.slug} href={'/' + p.slug} className={i === 0 ? 'first' : ''}>
            <img src={`/img/${i === 0 ? heroPhotos[0] : p.img}.jpg`} alt="" style={{ objectPosition: p.pos }} />
            <span>{p.title}</span>
          </Link>
        ))}
      </section>
    </>
  );
}
