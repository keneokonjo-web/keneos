import Link from 'next/link';
import { notFound } from 'next/navigation';
import Footer from '../../_c/Footer';
import PageHead from '../../_c/PageHead';
import { notes } from '@/content/site';

export function generateStaticParams() { return notes.map((n) => ({ slug: n.slug })); }

export default async function Entry({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const n = notes.find((x) => x.slug === slug);
  if (!n) notFound();
  return (
    <>
      <PageHead n={`02 / ${n.n}`} title={n.title} sub={n.date} />
      <section className="sec"><article className="entry">{n.body.map((t, i) => (<p key={i} className="rv">{t}</p>))}
        <p className="rv"><Link href="/field-notes" className="pill">Back to Field Notes</Link></p></article></section>
      <Footer />
    </>
  );
}
