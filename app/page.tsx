import Link from 'next/link';
import HeroClock from './_c/HeroClock';
import HeroSlides from './_c/HeroSlides';
import { heroLight, heroPhotos, pages } from '@/content/site';

export default function Home() {
  return (
    <>
      {/* The home page is the hero. It does not scroll on desktop. */}
      <section className="hero" aria-label="Introduction">
        <HeroSlides photos={heroPhotos} light={heroLight} />
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
