import Link from 'next/link';
import Collage from '../_c/Collage';
import Footer from '../_c/Footer';
import { blocks, trips } from '@/content/site';

export const metadata = { title: 'Visuals' };

function Text({ i, col, row }: { i: number; col: number; row: number }) {
  const x = blocks[i];
  return (
    <div className="st rv" style={{ gridColumn: col, gridRow: row }}>
      <span className="n">{x.n}</span>
      <b>{x.title}</b>
      <span>{x.kind}</span>
      <p>{x.text}</p>
    </div>
  );
}
function Img({ src, col, row, p }: { src?: string; col: number; row: number; p?: boolean }) {
  const st = { gridColumn: col, gridRow: row } as React.CSSProperties;
  return (
    <div className={'si rv' + (p ? ' p' : '') + (src ? '' : ' g')} style={st}>
      {src ? <img src={`/img/${src}.jpg`} alt="" loading="lazy" /> : <span className="ghost">Image to be added</span>}
    </div>
  );
}
// A trip cover: the picture and the country name under it both open the gallery.
function Trip({ i, col, row }: { i: number; col: number; row: number }) {
  const t = trips[i];
  return (
    <Link href={'/visuals/' + t.slug} className="trip-c rv" style={{ gridColumn: col, gridRow: row }}>
      <div className="si"><img src={`/img/${t.cover}.jpg`} alt={`${t.title} gallery`} loading="lazy" /></div>
      <span className="cap">{t.title}</span>
    </Link>
  );
}

export default function Visuals() {
  return (
    <div className="white">
      <section className="sam" id="trips">
        <div className="grid6">
          {/* Row 1: general text, four trips, general text */}
          <Text i={0} col={1} row={1} />
          <Trip i={0} col={2} row={1} />
          <Trip i={1} col={3} row={1} />
          <Trip i={2} col={4} row={1} />
          <Trip i={3} col={5} row={1} />
          <Text i={1} col={6} row={1} />
          {/* Row 2 */}
          <Img src="me-1317" col={1} row={2} p />
          <Img src="p-0689" col={2} row={2} />
          <Img src="v-sand" col={3} row={2} p />
          <Img src="p-0685" col={4} row={2} />
          <Text i={2} col={5} row={2} />
          <Img src="me-night" col={6} row={2} p />
          {/* Row 3 */}
          <Img src="p-0680" col={1} row={3} />
          <Img src="p-0682" col={2} row={3} />
          <Text i={3} col={3} row={3} />
          <Img src="p-0688" col={4} row={3} />
          <Img src="v-faces" col={5} row={3} />
          <Img src="me-6122" col={6} row={3} p />
        </div>
      </section>
      <Collage />
      <Footer light />
    </div>
  );
}
