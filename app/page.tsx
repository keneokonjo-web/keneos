import Link from 'next/link';
import Footer from './_c/Footer';
import PeekIndex from './_c/PeekIndex';
import { brand, heroImages, pages, phrases, principles } from '@/content/site';

export default function Home() {
  return (
    <>
      {/* Desktop hero: full-bleed image field, pages on the hero, giant wordmark */}
      <section className="hero" aria-label="Introduction">
        <div className="bg">
          {heroImages.map((n, i) => (<img key={n} src={`/img/${n}.jpg`} alt="" style={{ animationDelay: `${i * 6}s` }} />))}
        </div>
        <div className="meta mono">Index<br />01 — 06</div>
        <nav className="idxrow" aria-label="Pages">
          {pages.map((p) => (
            <Link key={p.slug} href={'/' + p.slug}><span className="n">{p.n}</span><span className="t">{p.title}</span><span className="s">{p.sub}</span></Link>
          ))}
        </nav>
        <div className="word"><img src="/mark/designedbykjo-hd-white.png" alt="DesignedByKJO" /></div>
      </section>

      {/* Mobile hero: stacked full-bleed panels, one per page */}
      <section className="hero-m" aria-label="Pages">
        {pages.map((p, i) => (
          <Link key={p.slug} href={'/' + p.slug} className={i === 0 ? 'first' : ''}>
            <img src={`/img/${p.img}.jpg`} alt="" style={{ objectPosition: p.pos }} />
            {i === 0 && (<><div className="wm"><img src="/mark/designedbykjo-hd-white.png" alt="DesignedByKJO" /></div></>)}
            <span>{p.title}</span>
          </Link>
        ))}
      </section>

      <section className="sec">
        <div className="lab mono rv"><span>Direction</span><span>Distinction</span></div>
        <div className="statement">
          <h2 className="big"><span className="mask"><span>Original</span></span><span className="mask"><span>by <span className="it">nature.</span></span></span></h2>
          <p className="rv">A personal collection, on my own terms. Photography, film, field notes and a clothing line called Character. Kept quiet, kept exact.</p>
        </div>
      </section>

      <section className="sec">
        <div className="lab mono rv"><span>Index</span><span>01 — 06</span></div>
        <PeekIndex />
      </section>

      <section className="char">
        <div className="fig"><img src="/img/figure.png" alt="Character: watercolour illustration of a figure in a pinstripe suit and low headwear" /></div>
        <div className="tx">
          <div className="mono" style={{ display: 'flex', justifyContent: 'space-between' }}><span>The line</span><span>04</span></div>
          <div>
            <img className="cw rv" src="/mark/character-white.png" alt="Character" />
            <p className="rv" style={{ marginTop: 28 }}>Character is the clothing line from DesignedByKJO. A specimen at a time, shown the way it was drawn.</p>
          </div>
          <div className="rv"><Link href="/character" className="pill b">Open the specimen index</Link></div>
        </div>
      </section>

      <section className="sec">
        <div className="lab mono rv"><span>Principles</span><span>My personal standard</span></div>
        <div className="words">{principles.map((w) => (<span key={w} className="rv">{w}</span>))}</div>
      </section>
      <Footer />
    </>
  );
}
