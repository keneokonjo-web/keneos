import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { companies } from '@/content/site';

export function generateStaticParams() { return companies.filter((c) => !c.internal).map((c) => ({ slug: c.slug })); }

export default async function Company({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = companies.find((x) => x.slug === slug);
  if (!c) notFound();
  if (c.internal) redirect(c.internal);
  return (
    <div className="white spread">
      <section className="pg-l">
        <div className="hd mono"><span>Work</span><span>{c.code}</span></div>
        <div className="meta mono">{c.meta.map((m) => (<div key={m}>{m}</div>))}</div>
        <h1>{c.name}</h1>
        <div className="txt mono">{c.text.map((t, i) => (<p key={i}>{t}</p>))}</div>
        <div className="pn mono">{c.code.replace('K-0', '')}</div>
      </section>
      <section className="pg-r">
        <div className="hd mono"><span>{c.name}</span><span>Preview</span></div>
        <div className="pv">
          {c.preview ? <img src={`/img/${c.preview}.jpg`} alt={`Preview of ${c.host}`} /> : <div className="nopv mono">Preview unavailable<br />{c.host}</div>}
        </div>
        <a className="disc mono" href={c.url} target="_blank" rel="noopener noreferrer">Discover <span aria-hidden="true">→</span> {c.host}</a>
        <div className="pn mono">{String(Number(c.code.replace('K-', '')) + 1).padStart(3, '0')}</div>
      </section>
      <Link href="/work" className="backw mono">‹ Work index</Link>
    </div>
  );
}
