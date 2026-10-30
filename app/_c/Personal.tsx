import { asake, movies } from '@/content/site';

export default function Personal() {
  return (
    <div className="ps">
      <section className="ps-mv" aria-label="Films">
        <div className="ps-mvh"><h2>My Favorite Films</h2><span className="mono">Lookbook</span></div>
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
    </div>
  );
}
