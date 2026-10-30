import Footer from '../_c/Footer';
import { companies } from '@/content/site';

export const metadata = { title: 'Work' };

export default function Work() {
  return (
    <div className="white">
      <section className="wk">
        <div className="idx">
          <h1>MY COMPANIES</h1>
          <ul>
            {companies.map((c) => (
              <li key={c.code}>
                <a href={c.internal ?? c.url} target="_blank" rel="noopener noreferrer" className={c.red ? 'red' : ''}>
                  <span className="cd">{c.code}</span>
                  <span className="nm">{c.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <Footer />
    </div>
  );
}
