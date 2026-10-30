import { companies, notes, products, trips } from '@/content/site';

const index = [
  ['P-001', 'Project to be added', 'Case file', 'In progress', '2026'],
  ['P-002', 'Project to be added', 'Experiment', 'Idea', '2026'],
  ['P-003', 'Project to be added', 'Record', 'Archived', '2026'],
  ['P-004', 'Project to be added', 'Case file', 'Planned', '2026'],
  ['P-005', 'Project to be added', 'Experiment', 'Idea', '2026'],
];
const files = [
  { n: '001', t: 'Case file title', s: 'In progress', p: 62 },
  { n: '002', t: 'Case file title', s: 'Planned', p: 18 },
  { n: '003', t: 'Case file title', s: 'Archived', p: 100 },
];
const stages = ['Idea', 'Sketch', 'Draft', 'Build', 'Ship'];
const nodes = companies.filter((c) => !c.internal).concat(companies.filter((c) => c.internal));
const ideas = ['Idea 001', 'Idea 002', 'Idea 003', 'Idea 004', 'Idea 005', 'Idea 006'];

export default function ProjectsBody() {
  const pos = [[18, 22], [82, 22], [18, 78], [82, 78]];
  return (
    <div className="pjb">
      <section className="blk">
        <div className="bh"><span className="mono">01</span><h2>Project index</h2><span className="mono">Placeholders</span></div>
        <table className="ix"><thead><tr><th>No.</th><th>Project</th><th>Type</th><th>Status</th><th>Year</th></tr></thead>
          <tbody>{index.map((r) => (<tr key={r[0]}>{r.map((c, i) => (<td key={i} className={i === 0 ? 'cd' : ''}>{c}</td>))}</tr>))}</tbody></table>
      </section>

      <section className="blk">
        <div className="bh"><span className="mono">02</span><h2>Case files</h2><span className="mono">3 open</span></div>
        <div className="cases">
          {files.map((f) => (
            <article key={f.n} className="cs"><div className="tab mono">File {f.n}</div>
              <div className="body"><h3>{f.t}</h3><p className="mono">{f.s}</p><div className="meter"><i style={{ width: f.p + '%' }} /></div><p className="mono">{f.p}%</p></div></article>
          ))}
        </div>
      </section>

      <section className="blk">
        <div className="bh"><span className="mono">03</span><h2>Timeline</h2><span className="mono">Milestones</span></div>
        <ol className="tl">
          {['2026 Q1', '2026 Q2', '2026 Q3', '2026 Q4', '2027'].map((t, i) => (
            <li key={t}><span className="mono">{t}</span><i /><b>Milestone {i + 1}</b><span>To be added</span></li>
          ))}
        </ol>
      </section>

      <section className="blk">
        <div className="bh"><span className="mono">04</span><h2>Organisation map</h2><span className="mono">KJO and its companies</span></div>
        <div className="map">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {pos.map((p, i) => (<line key={i} x1="50" y1="50" x2={p[0]} y2={p[1]} />))}
          </svg>
          <div className="node core" style={{ left: '50%', top: '50%' }}><b>KJO</b><span className="mono">Origin</span></div>
          {nodes.slice(0, 4).map((c, i) => (
            <div key={c.code} className="node" style={{ left: pos[i][0] + '%', top: pos[i][1] + '%' }}><span className="mono">{c.code}</span><b>{c.name}</b></div>
          ))}
        </div>
      </section>

      <section className="blk">
        <div className="bh"><span className="mono">05</span><h2>Behind the work</h2><span className="mono">Dashboard</span></div>
        <div className="dash">
          {[['Companies', nodes.length], ['Photo trips', trips.length], ['Clothing pieces', products.length], ['Field notes', notes.length]].map(([k, v]) => (
            <div key={k as string} className="tile"><span className="mono">{k}</span><b>{String(v).padStart(2, '0')}</b></div>
          ))}
        </div>
        <ul className="pipe">{stages.map((s, i) => (<li key={s}><span className="mono">{String(i + 1).padStart(2, '0')}</span>{s}<i style={{ width: (100 - i * 20) + '%' }} /></li>))}</ul>
      </section>

      <section className="blk">
        <div className="bh"><span className="mono">06</span><h2>Ideas and experiments</h2><span className="mono">Loose ends</span></div>
        <div className="ideas">{ideas.map((x) => (<span key={x} className="chip mono">{x}</span>))}</div>
      </section>
    </div>
  );
}
