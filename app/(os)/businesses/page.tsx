'use client';
import Link from 'next/link';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { Photo } from '@/components/Art';
import { Empty, PageHead } from '@/components/ui';
import { VENTURES } from '@/lib/themes';
import { useStore } from '@/lib/store';
import { TaskRow, useTasks } from '@/components/TaskList';

export default function Businesses() {
  const { items: tasks, toggle } = useTasks();
  const [decisions] = useStore<unknown[]>('biz:waykon:decisions', []);
  const open = tasks.filter((t) => !t.done && t.area.startsWith('business:'));
  return (
    <div className="page">
      <Photo src="/images/businesses.jpg" variant="monolith" style={{ height: 260, marginBottom: 28 }}>
        <div className="photo-cap"><div className="eyebrow" style={{ color: '#d8d6cf' }}>N° 01 — The group</div><div className="display" style={{ fontSize: 40, color: '#fff' }}>Building businesses for the long term.</div></div>
      </Photo>
      <PageHead eyebrow="Businesses" title="Portfolio" sub="Each venture opens its own workspace. WAYKON Holdings is a brand and intent, not yet registered. None of the ventures is registered either." />

      <section className="card" style={{ marginBottom: 16 }}>
        <div className="eyebrow">Intended structure — not a legal fact</div>
        <div className="row wrap" style={{ marginTop: 14, gap: 10 }}>
          {['Kene Okonjo', '100%', 'WAYKON Holdings', '100%'].map((x, i) => i % 2 ? <span key={i} className="muted small">→ {x} →</span> : <span key={i} className="chip chip-solid" style={{ height: 30, fontSize: 13 }}>{x}</span>)}
          <span className="row wrap" style={{ gap: 8 }}>{VENTURES.filter((v) => v.slug !== 'waykon').map((v) => <span key={v.slug} className="chip" style={{ height: 30, fontSize: 13 }}>{v.name}</span>)}</span>
        </div>
      </section>

      <div className="grid g2">
        {VENTURES.map((v, i) => {
          const openCount = open.filter((t) => t.area === `business:${v.slug}`).length;
          return (
            <section key={v.slug} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <Link href={`/businesses/${v.slug}`} style={{ display: 'block' }}>
                <div style={{ background: v.theme['--v-bg'], color: v.theme['--v-ink'], padding: 22, minHeight: 190, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div className="row between"><span className="mono" style={{ fontSize: 11, letterSpacing: '.08em', opacity: .7 }}>N° {String(i + 1).padStart(2, '0')} — {v.tag.toUpperCase()}</span><ArrowUpRight size={18} /></div>
                  <div>
                    <div style={{ fontFamily: v.fontHead, fontWeight: v.headWeight, letterSpacing: v.headTracking, fontSize: 40, lineHeight: 1 }}>{v.name}</div>
                    <div style={{ marginTop: 10, opacity: .7, fontSize: 13 }}>{v.status}</div>
                  </div>
                </div>
              </Link>
              <div className="row between" style={{ padding: '12px 18px' }}>
                <span className="small muted">{openCount} open task{openCount === 1 ? '' : 's'}{v.provisional ? ' · styling provisional' : ''}</span>
                {v.url ? <a href={v.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm"><ExternalLink size={13} /> {v.urlLabel}</a> : <span className="chip">No website yet</span>}
              </div>
            </section>
          );
        })}
      </div>

      <div className="grid g2" style={{ marginTop: 16, alignItems: 'start' }}>
        <section className="card">
          <div className="card-h"><h3>Cross-business tasks</h3><span className="chip">{open.length} open</span></div>
          {open.length === 0 ? <Empty title="No open business tasks">Add a task and set its area to a venture.</Empty> : open.slice(0, 10).map((t) => <TaskRow key={t.id} t={t} toggle={toggle} />)}
        </section>
        <section className="card">
          <div className="card-h"><h3>Group decision log</h3></div>
          <p className="muted" style={{ marginTop: 0 }}>{decisions.length} decision{decisions.length === 1 ? '' : 's'} recorded.</p>
          <Link href="/businesses/waykon" className="btn">Open the log in WAYKON Holdings</Link>
        </section>
      </div>
    </div>
  );
}
