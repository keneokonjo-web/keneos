import Link from 'next/link';
import Footer from '../_c/Footer';
import { companies } from '@/content/site';

export const metadata = { title: 'Work' };

export default function Work() {
  return (
    <div className="white">
      <section className="wk">
        <div className="idx">
          <h1>WORK INDEX</h1>
          <ul>
            {companies.map((c) => (
              <li key={c.code}>
                <Link href={c.internal ?? '/work/' + c.slug} className={c.red ? 'red' : ''}>
                  <span className="cd">{c.code}</span>
                  <span className="nm">{c.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <Footer />
    </div>
  );
}
