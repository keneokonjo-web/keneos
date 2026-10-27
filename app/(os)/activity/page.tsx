'use client';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';
import { Empty, PageHead } from '@/components/ui';
import { useNotices, type Severity } from '@/lib/notify';
import { useStore, type Activity } from '@/lib/store';
import { relTime } from '@/lib/dates';

const SEV: Record<Severity, { label: string; cls: string }> = { escalate: { label: 'Overdue', cls: 'chip-neg' }, alert: { label: 'Today', cls: 'chip-solid' }, nudge: { label: 'Heads up', cls: '' }, info: { label: 'FYI', cls: '' } };
const KIND_ICON: Record<string, string> = { task: 'CheckSquare', money: 'Wallet', note: 'NotebookPen', idea: 'Lightbulb', waiting: 'Hourglass', decision: 'Gavel', link: 'Link', goal: 'Target', event: 'Calendar', review: 'BarChart3', add: 'Plus' };

export default function ActivityPage() {
  const notices = useNotices();
  const [log] = useStore<Activity[]>('activity', []);
  return (
    <div className="page">
      <PageHead eyebrow="Activity" title="Notifications and activity" sub="Alerts are worked out from your own deadlines, bills, follow-ups and waiting items. Nothing here is invented. Lead time is set in Settings." />
      <div className="grid g2" style={{ alignItems: 'start' }}>
        <section className="card">
          <div className="card-h"><h3>Notifications</h3><span className="chip">{notices.length}</span></div>
          {notices.length === 0 ? <Empty title="All clear">Nothing is overdue or due soon.</Empty> : notices.map((n) => {
            const I = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>>)[n.icon] ?? Icons.Bell;
            return (
              <Link key={n.id} href={n.href} className="notif">
                <span className="icotile" style={n.severity === 'escalate' ? { background: 'var(--maroon)', borderColor: 'var(--maroon)', color: '#fff' } : undefined}><I size={18} strokeWidth={1.6} /></span>
                <div className="grow"><div className="row between"><b style={{ fontWeight: 500 }}>{n.title}</b><span className={`chip ${SEV[n.severity].cls}`}>{SEV[n.severity].label}</span></div><div className="small muted" style={{ marginTop: 2 }}>{n.body}</div></div>
                <ArrowUpRight size={14} className="muted" />
              </Link>
            );
          })}
        </section>
        <section className="card">
          <div className="card-h"><h3>Recent activity</h3></div>
          {log.length === 0 ? <Empty title="No activity yet">Things you add, complete and log will build a timeline here.</Empty> : (
            <div className="timeline">
              {log.slice(0, 40).map((a, i) => {
                const I = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>>)[KIND_ICON[a.kind] ?? 'Circle'] ?? Icons.Circle;
                return (
                  <div key={a.id} className="tl-item">
                    <span className="tl-dot"><I size={15} strokeWidth={1.6} /></span>
                    <div className="grow" style={{ paddingTop: 2 }}>
                      <div className="row between"><span className="small muted">{relTime(a.createdAt)}</span>{i < 2 && <span style={{ width: 8, height: 8, borderRadius: 99, background: 'var(--maroon-lift)' }} aria-label="New" />}</div>
                      {a.href ? <Link href={a.href} className="hl">{a.text}</Link> : <span>{a.text}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
