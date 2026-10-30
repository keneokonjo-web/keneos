import Link from 'next/link';
import Footer from '../_c/Footer';
import { notes } from '@/content/site';

export const metadata = { title: 'Field Notes' };

const words = ['Field Notes', 'In my own words', 'Original by nature', 'Thoughts'];
const side = (
  <div className="t">{Array.from({ length: 8 }).map((_, k) => words.map((w) => (<em key={k + w}>{w}<i>✦</i></em>)))}</div>
);

export default function FieldNotes() {
  return (
    <>
      <section className="fn fn-list">
        <div className="fn-side l" aria-hidden="true">{side}</div>
        <div className="fn-side r" aria-hidden="true">{side}</div>
        <div className="fn-col">
          <h1>Field Notes</h1>
          <ul className="fn-ul">
            {notes.map((n) => (
              <li key={n.slug}><Link href={'/field-notes/' + n.slug}>{n.title}</Link></li>
            ))}
          </ul>
        </div>
      </section>
      <Footer />
    </>
  );
}
