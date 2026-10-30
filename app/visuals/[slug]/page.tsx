import Link from 'next/link';
import { notFound } from 'next/navigation';
import Footer from '../../_c/Footer';
import { trips } from '@/content/site';

export function generateStaticParams() { return trips.map((t) => ({ slug: t.slug })); }

export default async function Trip({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = trips.find((x) => x.slug === slug);
  if (!t) notFound();
  const slots = Math.max(t.images.length, 4);
  return (
    <div className="white">
      <section className="sam trip">
        <div className="tt">
          <Link href="/visuals" className="back">‹ Visuals</Link>
          <h1>{t.title}</h1>
          <span>Photography</span>
          <p>{t.text}</p>
        </div>
        <div className="tg">
          {Array.from({ length: slots }).map((_, i) => t.images[i]
            ? <div key={i} className="si rv"><img src={`/img/${t.images[i]}.jpg`} alt="" loading="lazy" /></div>
            : <div key={i} className="si g rv"><span className="ghost">Photograph to be added</span></div>)}
        </div>
      </section>
      <Footer light />
    </div>
  );
}
