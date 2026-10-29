import Footer from '../_c/Footer';
import PageHead from '../_c/PageHead';
import { favourites, film, plates } from '@/content/site';

export const metadata = { title: 'Visuals' };

export default function Visuals() {
  return (
    <>
      <PageHead n="01" title={<>Visu<span className="it">als</span></>} sub="Photography and film. Selected frames, one short film, and what I keep returning to."
        nav={[{ href: '#photography', label: 'Photography' }, { href: '#film', label: 'Film' }, { href: '#favourites', label: 'Favourites' }]} />

      <section className="sec" id="photography">
        <div className="lab mono rv"><span>Photography</span><span>Plates 001 — 006</span></div>
        <div className="plates">
          {plates.map((p) => (
            <figure key={p.n} className={'plate rv p' + (p.span === 'a' ? 'a' : p.span === 'b' ? 'b' : p.span === 'c' ? 'c' : p.span === 'd' ? 'd' : p.span === 'e' ? 'e' : 'f')}>
              <div className="im"><img src={`/img/${p.img}.jpg`} alt={`Plate ${p.n}`} loading="lazy" /></div>
              <figcaption className="cap mono"><span>Plate {p.n}</span><span>{p.title}</span></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="sec" id="film">
        <div className="lab mono rv"><span>Film</span><span>{film.status}</span></div>
        <h2 className="big rv" style={{ marginBottom: 40 }}>{film.title}</h2>
        <div className="film rv">
          {film.embed ? <iframe src={film.embed} title={film.title} allowFullScreen loading="lazy" /> : (<><span className="corner" style={{ left: 16, top: 14 }}>16:9</span><span className="corner" style={{ right: 16, top: 14 }}>{film.status}</span><div className="play" aria-hidden="true" /></>)}
        </div>
        <p className="rv" style={{ maxWidth: 520, marginTop: 24, opacity: .7 }}>{film.note}</p>
      </section>

      <section className="sec" id="favourites">
        <div className="lab mono rv"><span>Favourites</span><span>Films, shows, things watched</span></div>
        <div className="cols">
          {([['Films', favourites.films], ['Shows', favourites.shows], ['Watched and kept', favourites.watched]] as const).map(([h, items]) => (
            <div key={h} className="rv">
              <div className="mono" style={{ marginBottom: 14 }}>{h}</div>
              <ul className="list">{items.map((t, i) => (<li key={h + i}><em>{t}</em><span>{String(i + 1).padStart(2, '0')}</span></li>))}</ul>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
