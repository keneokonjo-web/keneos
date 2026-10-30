import Link from 'next/link';
import { notFound } from 'next/navigation';
import Footer from '../../_c/Footer';
import { notes } from '@/content/site';

export function generateStaticParams() { return notes.map((n) => ({ slug: n.slug })); }

export default async function Entry({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const n = notes.find((x) => x.slug === slug);
  if (!n) notFound();
  return (
    <>
      <article className="fn fn-note">
        <div className="col">
          <div className="tag">({n.topic})</div>
          <h1>{n.title}</h1>
          <div className="meta">Published {n.date} <span>{n.read}</span></div>
          <div className="disc"><b>About this note.</b> {n.disclaimer}</div>
          <div className="body">{n.body.map((t, i) => (<p key={i}>{t}</p>))}</div>
          <Link href="/field-notes" className="back">‹ All field notes</Link>
        </div>
      </article>
      <Footer />
    </>
  );
}
