import Link from 'next/link';
import Footer from '../_c/Footer';
import PageHead from '../_c/PageHead';
import { looks } from '@/content/site';

export const metadata = { title: 'Wardrobe' };
const sw = ['#0a0a0b', '#b9bcc0', '#0873b9', '#d1121b', '#3a2418', '#16233e'];

export default function Wardrobe() {
  return (
    <>
      <PageHead n="03" title={<>Ward<span className="it">robe</span></>} sub="Personal style, indexed. Looks drawn and worn, one at a time." />
      <section className="sec" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <div className="wd">
          <div className="fig"><img src="/img/figure.png" alt="Watercolour illustration of a figure in a pinstripe suit" /><span className="cap mono">Look 01 · Illustration</span></div>
          <div className="looks">
            {looks.map((l, i) => (
              <div key={l.n} className="look rv">
                <span className="mono">{l.n}</span>
                <div><div className="t">{l.name}</div><p>{l.note}</p>
                  <div className="swatches">{sw.slice(0, 3 + (i % 3)).map((c) => (<i key={c} style={{ background: c }} />))}</div></div>
              </div>
            ))}
            <div className="look rv" style={{ borderBottom: '1px solid var(--line)' }}>
              <span className="mono">→</span>
              <div><div className="t it">Character</div><p>The clothing line, as specimens.</p><p style={{ marginTop: 20 }}><Link href="/character" className="pill b">Open Character</Link></p></div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
