import Link from 'next/link';
import Collage from './_c/Collage';
import CharacterSelect from './_c/CharacterSelect';
import Footer from './_c/Footer';
import { pages } from '@/content/site';

const heroImages = ['hero-birds', 'hero-faces'];

export default function Home() {
  return (
    <>
      {/* Desktop hero: moving photography, the header sits mid-screen and slides up on scroll */}
      <section className="hero" aria-label="Introduction">
        <div className="bg">
          {heroImages.map((n, i) => (<img key={n} src={`/img/${n}.jpg`} alt="" style={{ animationDelay: `${i * 10}s` }} />))}
        </div>
        <div className="kjo"><img src="/mark/cross-fleur-white.png" alt="" /><span>KJO</span></div>
        <div className="ctr">1 / {heroImages.length}</div>
        <div className="pill"><span>Character, collection 001. Not yet released</span><span>[X]</span></div>
      </section>

      {/* Mobile hero: stacked full-bleed panels, one per page */}
      <section className="hero-m" aria-label="Pages">
        {pages.map((p, i) => (
          <Link key={p.slug} href={'/' + p.slug} className={i === 0 ? 'first' : ''}>
            <img src={`/img/${i === 0 ? 'hero-birds' : p.img}.jpg`} alt="" style={{ objectPosition: p.pos }} />
            <span>{p.title}</span>
          </Link>
        ))}
      </section>

      <Collage />
      <CharacterSelect />
      <Footer />
    </>
  );
}
