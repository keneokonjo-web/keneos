import Footer from '../_c/Footer';
import PageHead from '../_c/PageHead';
import { work } from '@/content/site';

export const metadata = { title: 'Work' };

export default function Work() {
  return (
    <>
      <PageHead n="05" title={<>W<span className="it">o</span>rk</>} sub="Professional work. Discipline, direction, delivered." />
      <section className="sec">
        <div className="lab mono rv"><span>Selected</span><span>{work.length} entries</span></div>
        <div className="tbl">
          {work.map((w) => (
            <div key={w.n} className="row rv"><span className="mono">{w.n}</span><span className="t">{w.title}</span><span className="x it">{w.role}</span><span className="mono">{w.year}</span></div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
