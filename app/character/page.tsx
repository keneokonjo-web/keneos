import Footer from '../_c/Footer';
import { brand, specimens } from '@/content/site';

export const metadata = { title: 'Character' };

export default function Character() {
  return (
    <>
      <section className="chero">
        <div className="a">
          <div className="mono" style={{ display: 'flex', justifyContent: 'space-between' }}><span>Index 04</span><span>DesignedByKJO</span></div>
          <div>
            <img className="cw" src="/mark/character-white.png" alt="Character" />
            <p className="rv" style={{ marginTop: 28, maxWidth: 420, opacity: .75 }}>The clothing line. Not a shop in the usual sense: a specimen index. Each piece is documented, drawn and numbered before it is ever released.</p>
          </div>
          <div className="mono" style={{ opacity: .7 }}>Collection 001 · Not yet released</div>
        </div>
        <div className="b"><img src="/img/figure.png" alt="Watercolour illustration of the Character look" /></div>
      </section>

      <section className="sec">
        <div className="lab mono rv"><span>Specimen index</span><span>001 — {String(specimens.length).padStart(3, '0')}</span></div>
        {specimens.map((s) => (
          <div key={s.n} className="spec rv">
            <span className="mono">{s.n}</span>
            <div><div className="t">{s.name}</div><span className="stat">{s.status}</span></div>
            <table><tbody>
              <tr><td>Fit</td><td>{s.fit}</td></tr><tr><td>Fabric</td><td>{s.fabric}</td></tr>
              <tr><td>Colour</td><td>{s.colour}</td></tr><tr><td>Sizes</td><td>{s.sizes}</td></tr>
            </tbody></table>
          </div>
        ))}
        <div className="rv" style={{ borderTop: '1px solid var(--line)', paddingTop: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <h2 className="big" style={{ fontSize: 'clamp(40px,7vw,110px)' }}>First access, <span className="it">by name.</span></h2>
          {brand.email ? <a className="pill b" href={'mailto:' + brand.email + '?subject=Character%20first%20access'}>Request first access</a> : <span className="pill">Contact to be added</span>}
        </div>
      </section>
      <Footer />
    </>
  );
}
