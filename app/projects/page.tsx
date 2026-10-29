import Footer from '../_c/Footer';
import PageHead from '../_c/PageHead';
import { projects } from '@/content/site';

export const metadata = { title: 'Projects' };

export default function Projects() {
  return (
    <>
      <PageHead n="06" title={<>Pro<span className="it">jects</span></>} sub="Personal projects. Made for no one, kept for the archive." />
      <section className="sec">
        <div className="lab mono rv"><span>Archive</span><span>{projects.length} entries</span></div>
        <div className="tbl">
          {projects.map((p) => (
            <div key={p.n} className="row rv"><span className="mono">{p.n}</span><span className="t">{p.title}</span><span className="x it">{p.note}</span><span className="mono">{p.year}</span></div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
