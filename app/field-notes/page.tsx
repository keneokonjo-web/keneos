import Link from 'next/link';
import Footer from '../_c/Footer';
import { notes } from '@/content/site';

export const metadata = { title: 'Field Notes' };

export default function FieldNotes() {
  return (
    <>
      <section className="fn">
        <div className="col">
          <div className="tag">(Field Notes)</div>
          <h1>Field Notes</h1>
          <p className="sub">Thoughts on different topics, in my own words. Pick one.</p>
          <div className="list">
            {notes.map((n) => (
              <Link key={n.slug} href={'/field-notes/' + n.slug} className="item rv">
                <div className="tag">({n.topic})</div>
                <h2>{n.title}</h2>
                <p>{n.sub}</p>
                <div className="meta">Published {n.date} <span>{n.read}</span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
