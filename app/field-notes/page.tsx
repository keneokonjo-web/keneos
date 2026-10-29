import Link from 'next/link';
import Footer from '../_c/Footer';
import PageHead from '../_c/PageHead';
import { notes } from '@/content/site';

export const metadata = { title: 'Field Notes' };

export default function FieldNotes() {
  return (
    <>
      <PageHead n="02" title={<>Field <span className="it">Notes</span></>} sub="A journal. Short, personal, unpolished." />
      <section className="sec">
        <div className="lab mono rv"><span>Entries</span><span>{notes.length}</span></div>
        <div className="notes">
          {notes.map((n) => (
            <Link key={n.slug} href={'/field-notes/' + n.slug} className="rv">
              <span className="mono">{n.n}</span><span className="t">{n.title}</span><span className="e">{n.excerpt}</span><span className="mono d">{n.date}</span>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
