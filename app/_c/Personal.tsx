import { asake, movies } from '@/content/site';

const words = ['Music', 'Film', 'Taste', 'Original by nature', 'Personal'];

export default function Personal() {
  return (
    <div className="ps">
      <section className="ps-hero">
        <div className="ps-mq" aria-hidden="true"><div className="t">{Array.from({ length: 6 }).map((_, k) => (<span key={k}>{words.map((w) => (<em key={w}>{w}<i>✦</i></em>))}</span>))}</div></div>
        <h1><span className="mask"><span>Personal</span></span></h1>
        <p className="rv">Getting to know me. The music I live in and the films I keep coming back to.</p>
      </section>

      <section className="ps-as" aria-label="Asake">
        <div className="ps-top">
          <h2>ASAKE<sup>®</sup></h2>
          <p>MY FAVOURITE ARTIST. EVERY ALBUM, RATED BY ME.</p>
        </div>
        <div className="ps-row">
          {asake.albums.map((a, i) => (
            <article key={a.title} className="ps-card rv" style={{ transitionDelay: i * 110 + 'ms' }}>
              <div className="ps-cv"><img src={`/img/${a.img}.jpg`} alt={`${a.title}, album cover`} loading="lazy" /></div>
              <label>Album</label><div className="f">{a.title}</div>
              <label>My rating</label><div className="f r">{a.rating}</div>
              <label>Released</label><div className="f">{a.year}</div>
              <div className="mk"><img src="/mark/cross-fleur-black.png" alt="" /><span>KJO</span></div>
            </article>
          ))}
        </div>
      </section>

      <section className="ps-mv" aria-label="Films">
        <div className="ps-mvh"><h2>Three films</h2><span className="mono">Lookbook</span></div>
        {movies.map((m, i) => (
          <article key={m.title} className={'mv' + (i % 2 ? ' flip' : '')}>
            <div className="mv-t">
              <span className="mono">{m.n}</span>
              <h3 className="rv">{m.title}</h3>
              <span className="mono">{m.meta}</span>
            </div>
            <div className="mv-g">
              {m.imgs.map((im, k) => (
                <figure key={im} className={'cr k' + (k + 1)} style={{ transitionDelay: k * 160 + 'ms' }}>
                  <img src={`/img/${im}.jpg`} alt={k === 0 ? m.title : ''} loading="lazy" />
                </figure>
              ))}
            </div>
            <div className="mv-bg" aria-hidden="true"><div className="t">{Array.from({ length: 4 }).map((_, k) => (<span key={k}>{m.title}</span>))}</div></div>
          </article>
        ))}
      </section>
    </div>
  );
}
