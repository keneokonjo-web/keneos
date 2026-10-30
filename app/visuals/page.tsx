import Link from 'next/link';
import Collage from '../_c/Collage';
import Footer from '../_c/Footer';
import { trips } from '@/content/site';

export const metadata = { title: 'Visuals' };

const t = (i: number) => trips[i];
function Text({ i, col, row }: { i: number; col: number; row: number }) {
  const x = t(i);
  return (
    <Link href={'/visuals/' + x.slug} className="st rv" style={{ gridColumn: col, gridRow: row }}>
      <span className="n">{x.n}</span>
      <b>{x.title}</b>
      <span>{x.kind}</span>
      <p>{x.text}</p>
    </Link>
  );
}
function Img({ src, col, row, p, link }: { src?: string; col: number; row: number; p?: boolean; link?: string }) {
  const inner = src ? <img src={`/img/${src}.jpg`} alt="" loading="lazy" /> : <span className="ghost">Image to be added</span>;
  const st = { gridColumn: col, gridRow: row } as React.CSSProperties;
  const cls = 'si rv' + (p ? ' p' : '') + (src ? '' : ' g');
  return link ? <Link href={link} className={cls} style={st} aria-label={`Open the ${link.split("/").pop()} gallery`}>{inner}</Link> : <div className={cls} style={st}>{inner}</div>;
}

export default function Visuals() {
  return (
    <>
      <Collage target="#trips" />
      <section className="sam" id="trips">
        <div className="grid6">
          {/* Row 1 */}
          <Text i={0} col={1} row={1} />
          <Img src="v-birds" col={2} row={1} link="/visuals/egypt" />
          <Img src="v-faces" col={3} row={1} />
          <Img src="v-camel" col={4} row={1} />
          <Img src="v-sail" col={5} row={1} link="/visuals/vietnam" />
          <Text i={1} col={6} row={1} />
          {/* Row 2 */}
          <Img src="me-1317" col={1} row={2} p />
          <Img col={2} row={2} />
          <Img src="v-sand" col={3} row={2} p />
          <Img src="v-smoke" col={4} row={2} link="/visuals/nigeria" />
          <Text i={2} col={5} row={2} />
          <Img src="v-ivory" col={6} row={2} p />
          {/* Row 3 */}
          <Img col={1} row={3} />
          <Img col={2} row={3} />
          <Text i={3} col={3} row={3} />
          <Img col={4} row={3} link="/visuals/uae" />
          <Img col={5} row={3} />
          <Img col={6} row={3} />
        </div>
      </section>
      <Footer />
    </>
  );
}
