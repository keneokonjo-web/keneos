import { notFound, redirect } from 'next/navigation';
import Book from '../../_c/Book';
import { companies } from '@/content/site';

export function generateStaticParams() { return companies.filter((c) => !c.internal).map((c) => ({ slug: c.slug })); }

export default async function Company({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = companies.find((x) => x.slug === slug);
  if (!c) notFound();
  if (c.internal) redirect(c.internal);
  const start = companies.filter((x) => !x.internal).findIndex((x) => x.slug === slug);
  return <div className="white"><Book start={start} /></div>;
}
