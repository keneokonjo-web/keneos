'use client';
import { notFound, useParams } from 'next/navigation';
import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Photo } from '@/components/Art';
import { Collection } from '@/components/Collection';
import { QuickTaskInput, TaskRow, useTasks } from '@/components/TaskList';
import { Empty, Tabs } from '@/components/ui';
import { ventureBySlug, type Venture } from '@/lib/themes';
import { useCollection, useStore, logActivity } from '@/lib/store';
import { daysUntil, fmtDate, isoToday } from '@/lib/dates';
import { money } from '@/lib/finance';

const sortByDate = (k: string) => (a: Record<string, unknown>, b: Record<string, unknown>) => String(a[k] ?? '9999').localeCompare(String(b[k] ?? '9999'));

export default function Workspace() {
  const { slug } = useParams<{ slug: string }>();
  const v = ventureBySlug(slug);
  if (!v) notFound();
  const style = { ...v.theme, '--v-font': v.fontHead, '--v-weight': v.headWeight, '--v-track': v.headTracking } as React.CSSProperties;
  return (
    <div className="venture" style={style}>
      <div className="page">
        <Hero v={v} />
        <Body v={v} />
      </div>
    </div>
  );
}

function Hero({ v }: { v: Venture }) {
  return (
    <header style={{ marginBottom: 28 }}>
      <div className="row between wrap" style={{ alignItems: 'flex-end', gap: 20 }}>
        <div>
          <div className="v-label">( Workspace ) · {v.tag}</div>
          <h1 className="v-head" style={{ fontSize: 'clamp(44px, 9vw, 96px)', marginTop: 10 }}>{v.name}</h1>
          <p style={{ margin: '12px 0 0', color: 'var(--v-muted)', maxWidth: '58ch' }}>{v.blurb} <b style={{ color: 'var(--v-ink)', fontWeight: 500 }}>{v.status}</b></p>
        </div>
        <div className="row wrap">
          {v.url ? <a href={v.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary"><ExternalLink size={15} /> {v.urlLabel}</a> : <span className="chip">No website yet</span>}
        </div>
      </div>
      <Photo src={`/images/${v.slug}.jpg`} variant={v.slug === 'waykon' ? 'monolith' : v.slug === 'media' ? 'terrain' : 'cantilever'} tone={v.theme['--v-bg'] === '#f9f9f8' || v.theme['--v-bg'] === '#f3f2ed' ? 'light' : 'dark'} style={{ height: 220, marginTop: 24, borderRadius: 4 }} />
      {v.provisional && <p className="small muted" style={{ margin: '10px 0 0' }}>Styling for this workspace is provisional until a real reference is supplied.</p>}
    </header>
  );
}

function VentureTasks({ slug }: { slug: string }) {
  const { items, toggle, remove } = useTasks();
  const list = items.filter((t) => t.area === `business:${slug}`);
  return (
    <section className="card">
      <div className="card-h"><h3>Checklist</h3><span className="chip">{list.filter((t) => !t.done).length} open</span></div>
      {list.length === 0 ? <Empty title="No tasks yet">Add the first thing that needs doing for this venture.</Empty> : list.map((t) => <TaskRow key={t.id} t={t} toggle={toggle} remove={remove} showArea={false} />)}
      <QuickTaskInput area={`business:${slug}`} today={false} />
    </section>
  );
}

function Notes({ slug }: { slug: string }) {
  const [n, setN] = useStore<string>(`biz:${slug}:notes`, '');
  return (
    <section className="card">
      <div className="card-h"><h3>Notes</h3></div>
      <textarea className="textarea" style={{ minHeight: 160 }} value={n} onChange={(e) => setN(e.target.value)} placeholder="Working notes, links, context…" aria-label="Notes" />
      <div className="small muted" style={{ marginTop: 6 }}>Saved as you type, on this device.</div>
    </section>
  );
}

function Stats({ items }: { items: [string, string][] }) {
  return (
    <div className="grid g4" style={{ marginBottom: 16 }}>
      {items.map(([l, v]) => <div key={l} className="card"><div className="v-label">{l}</div><div className="big-num tnum" style={{ marginTop: 8 }}>{v}</div></div>)}
    </div>
  );
}

function Body({ v }: { v: Venture }) {
  if (v.slug === 'waykon') return <Waykon />;
  if (v.slug === 'plot42') return <Plot42 />;
  if (v.slug === 'fieldwork') return <Fieldwork />;
  return <Media />;
}

/* ---------- WAYKON Holdings ---------- */
const REG_SUGGEST = ['Check and reserve the company name', 'Choose the registration route', 'Gather director and shareholder documents', 'Open a business bank account', 'Register for tax'];
function Waykon() {
  const [tab, setTab] = useState('overview');
  const { items, add } = useTasks();
  return (
    <div className="stack" style={{ gap: 18 }}>
      <Tabs value={tab} onChange={setTab} items={[{ id: 'overview', label: 'Overview' }, { id: 'registration', label: 'Registration' }, { id: 'decisions', label: 'Decision log' }, { id: 'brand', label: 'Brand' }]} />
      {tab === 'overview' && (
        <div className="grid g2" style={{ alignItems: 'start' }}>
          <section className="card">
            <div className="v-label">( Structure )</div>
            <h3 className="v-head" style={{ fontSize: 30, margin: '8px 0 14px' }}>Intended, not yet legal</h3>
            <p className="muted" style={{ marginTop: 0 }}>WAYKON Holdings is a brand and intent. Nothing below is registered.</p>
            <div className="stack" style={{ gap: 8 }}>
              <div className="row between"><span>Kene Okonjo</span><span className="chip">owns 100% of WAYKON Holdings (intended)</span></div>
              {['Plot42', 'Fieldwork', 'WAYKON Media'].map((n) => <div key={n} className="row between"><span>↳ {n}</span><span className="chip">100% held by WAYKON Holdings (intended)</span></div>)}
            </div>
          </section>
          <VentureTasks slug="waykon" />
          <Notes slug="waykon" />
        </div>
      )}
      {tab === 'registration' && (
        <section className="card">
          <div className="card-h"><h3>Registration checklist</h3></div>
          <p className="muted" style={{ marginTop: 0 }}>Suggested starting points. Tap one to add it to the WAYKON checklist, then edit it in the Overview tab.</p>
          <div className="row wrap">
            {REG_SUGGEST.map((s) => { const has = items.some((t) => t.title === s); return <button key={s} className="chip" disabled={has} onClick={() => { add({ title: s, area: 'business:waykon', priority: 'normal', done: false } as never); logActivity(`Added task: ${s}`, 'task', '/businesses/waykon'); }} style={has ? { opacity: .5 } : undefined}>{has ? '✓ ' : '+ '}{s}</button>; })}
          </div>
        </section>
      )}
      {tab === 'decisions' && (
        <Collection storeKey="biz:waykon:decisions" title="Decision log" noun="decision" activityHref="/businesses/waykon" sort={sortByDate('date')}
          fields={[{ key: 'title', label: 'Decision', required: true }, { key: 'reasoning', label: 'Reasoning', type: 'textarea' }, { key: 'status', label: 'Status', type: 'select', options: ['Considering', 'Decided', 'Reversed'], defaultValue: 'Decided' }, { key: 'date', label: 'Date', type: 'date', defaultValue: isoToday() }]}
          inlineSelect={['status']} emptyTitle="No decisions logged" emptyHint="Record what you decided and why, so it doesn’t disappear into chat history." />
      )}
      {tab === 'brand' && (
        <section className="card">
          <div className="v-label">( Identity )</div>
          <div className="row wrap" style={{ gap: 18, marginTop: 14 }}>
            {[['Signature maroon', '#550000'], ['Off-white', '#F9F9F8'], ['Black', '#111111']].map(([n, c]) => <div key={n}><div style={{ width: 96, height: 64, borderRadius: 6, background: c, border: '1px solid var(--v-line)' }} /><div className="small" style={{ marginTop: 6 }}>{n}</div><div className="small muted mono">{c}</div></div>)}
          </div>
          <p className="muted">Wordmark: serif capitals, “WAYKON GROUP”. Reference: waykongroup.com.</p>
        </section>
      )}
    </div>
  );
}

/* ---------- Plot42 ---------- */
function Plot42() {
  const [tab, setTab] = useState('overview');
  const { items: events } = useCollection<{ id: string; createdAt: string; name: string; date?: string; status?: string }>('biz:plot42:events');
  const next = [...events].filter((e) => e.date && e.date >= isoToday() && e.status !== 'Cancelled').sort((a, b) => a.date!.localeCompare(b.date!))[0];
  const n = next ? daysUntil(next.date) : null;
  return (
    <div className="stack" style={{ gap: 18 }}>
      <Tabs value={tab} onChange={setTab} items={[{ id: 'overview', label: 'Overview' }, { id: 'events', label: 'Events' }, { id: 'budget', label: 'Budget' }, { id: 'tickets', label: 'Tickets' }, { id: 'people', label: 'Vendors and people' }, { id: 'clothing', label: 'Clothing' }]} />
      {tab === 'overview' && (<>
        <Stats items={[['Next event', next ? next.name : 'Not set'], ['Countdown', n === null ? '—' : `${n}d`], ['Events logged', String(events.length)], ['Status', 'Live']]} />
        {!next && <Empty title="Summer event not entered yet">Add it in the Events tab with its date to start the countdown.</Empty>}
        <div className="grid g2" style={{ alignItems: 'start' }}><VentureTasks slug="plot42" /><Notes slug="plot42" /></div>
      </>)}
      {tab === 'events' && <Collection storeKey="biz:plot42:events" title="Event pipeline" noun="event" activityHref="/businesses/plot42" sort={sortByDate('date')}
        fields={[{ key: 'name', label: 'Event', required: true }, { key: 'date', label: 'Date', type: 'date', warn: true }, { key: 'venue', label: 'Venue' }, { key: 'status', label: 'Status', type: 'select', options: ['Idea', 'Planning', 'Confirmed', 'Live', 'Done', 'Cancelled'], defaultValue: 'Planning' }, { key: 'notes', label: 'Notes', type: 'textarea', hideInTable: true }]}
        inlineSelect={['status']} emptyTitle="No events yet" emptyHint="Add the summer event to start tracking its timeline and budget." />}
      {tab === 'budget' && <><p className="muted" style={{ margin: 0 }}>Planned and actual figures are kept separate. Ticket sales are not cash received.</p><Collection storeKey="biz:plot42:budget" title="Budget lines" noun="budget line" activityHref="/businesses/plot42"
        fields={[{ key: 'item', label: 'Item', required: true }, { key: 'event', label: 'Event' }, { key: 'planned', label: 'Planned (₦)', type: 'number', prefix: '₦' }, { key: 'actual', label: 'Actual paid (₦)', type: 'number', prefix: '₦' }, { key: 'due', label: 'Payment due', type: 'date', warn: true }]} emptyTitle="No budget lines" emptyHint="Add costs as they are quoted. Leave Actual empty until money has been paid." /><BudgetTotals /></>}
      {tab === 'tickets' && <><p className="muted" style={{ margin: 0 }}>Enter only confirmed tiers for a real event. Nothing is pre-filled.</p><Collection storeKey="biz:plot42:tickets" title="Ticket tiers" noun="ticket tier" activityHref="/businesses/plot42"
        fields={[{ key: 'tier', label: 'Tier', required: true }, { key: 'event', label: 'Event' }, { key: 'price', label: 'Price (₦)', type: 'number', prefix: '₦' }, { key: 'quantity', label: 'Quantity', type: 'number' }, { key: 'sold', label: 'Sold', type: 'number' }, { key: 'received', label: 'Cash received (₦)', type: 'number', prefix: '₦' }]} emptyTitle="No ticket tiers" /></>}
      {tab === 'people' && <Collection storeKey="biz:plot42:people" title="Vendors, artists, venues and sponsors" noun="contact" activityHref="/businesses/plot42"
        fields={[{ key: 'name', label: 'Name', required: true }, { key: 'role', label: 'Role', type: 'select', options: ['Venue', 'Artist', 'DJ', 'Supplier', 'Sponsor', 'Crew', 'Other'] }, { key: 'contact', label: 'Contact' }, { key: 'status', label: 'Status', type: 'select', options: ['To contact', 'In talks', 'Confirmed', 'Paid', 'Dropped'], defaultValue: 'To contact' }, { key: 'deposit', label: 'Deposit due', type: 'date', warn: true }, { key: 'notes', label: 'Notes', type: 'textarea', hideInTable: true }]}
        inlineSelect={['status']} emptyTitle="No contacts yet" />}
      {tab === 'clothing' && <><p className="muted" style={{ margin: 0 }}>Limited releases only. Add an item once it is actually being made or sold.</p><Collection storeKey="biz:plot42:clothing" title="Clothing releases" noun="item" activityHref="/businesses/plot42"
        fields={[{ key: 'item', label: 'Item', required: true }, { key: 'status', label: 'Status', type: 'select', options: ['Concept', 'In production', 'On sale', 'Sold out'], defaultValue: 'Concept' }, { key: 'cost', label: 'Unit cost (₦)', type: 'number', prefix: '₦' }, { key: 'price', label: 'Price (₦)', type: 'number', prefix: '₦' }, { key: 'stock', label: 'Stock', type: 'number' }]} inlineSelect={['status']} emptyTitle="No clothing items" /></>}
    </div>
  );
}
function BudgetTotals() {
  const { items } = useCollection<{ id: string; createdAt: string; planned?: number; actual?: number }>('biz:plot42:budget');
  if (!items.length) return null;
  const p = items.reduce((s, r) => s + (r.planned ?? 0), 0), a = items.reduce((s, r) => s + (r.actual ?? 0), 0);
  return <Stats items={[['Planned (estimate)', money(p, 'NGN', 0)], ['Actually paid', money(a, 'NGN', 0)], ['Still to pay', money(Math.max(0, p - a), 'NGN', 0)], ['Lines', String(items.length)]]} />;
}

/* ---------- Fieldwork ---------- */
function Fieldwork() {
  const [tab, setTab] = useState('overview');
  const { items: prospects } = useCollection<{ id: string; createdAt: string; stage?: string; followup?: string }>('biz:fieldwork:prospects');
  const { items: pay } = useCollection<{ id: string; createdAt: string; amount?: number; kind?: string }>('biz:fieldwork:payments');
  const [offer, setOffer] = useStore<string>('biz:fieldwork:offer', '');
  const won = prospects.filter((p) => p.stage === 'Won').length;
  const due = prospects.filter((p) => p.followup && p.followup <= isoToday() && p.stage !== 'Won' && p.stage !== 'Lost').length;
  const rec = pay.filter((p) => p.kind === 'Recurring').reduce((s, r) => s + (r.amount ?? 0), 0);
  const one = pay.filter((p) => p.kind !== 'Recurring').reduce((s, r) => s + (r.amount ?? 0), 0);
  return (
    <div className="stack" style={{ gap: 18 }}>
      <Tabs value={tab} onChange={setTab} items={[{ id: 'overview', label: 'Overview' }, { id: 'pipeline', label: 'Pipeline' }, { id: 'offer', label: 'Offer' }, { id: 'clients', label: 'Clients and systems' }, { id: 'revenue', label: 'Revenue' }]} />
      {tab === 'overview' && (<>
        <Stats items={[['Prospects', String(prospects.length)], ['Follow-ups due', String(due)], ['Clients won', String(won)], ['Recurring revenue', money(rec, 'GBP', 0)]]} />
        <div className="grid g2" style={{ alignItems: 'start' }}><VentureTasks slug="fieldwork" /><Notes slug="fieldwork" /></div>
      </>)}
      {tab === 'pipeline' && <Collection storeKey="biz:fieldwork:prospects" title="Prospects and outreach" noun="prospect" activityHref="/businesses/fieldwork" sort={sortByDate('followup')}
        fields={[{ key: 'name', label: 'Company', required: true }, { key: 'contact', label: 'Contact' }, { key: 'stage', label: 'Stage', type: 'select', options: ['Prospect', 'Contacted', 'Replied', 'Proposal sent', 'Won', 'Lost'], defaultValue: 'Prospect' }, { key: 'last', label: 'Last contacted', type: 'date' }, { key: 'followup', label: 'Follow up', type: 'date', warn: true }, { key: 'notes', label: 'Notes', type: 'textarea', hideInTable: true }]}
        inlineSelect={['stage']} emptyTitle="No prospects yet" emptyHint="Add property businesses you plan to contact, and set a follow-up date." />}
      {tab === 'offer' && (
        <section className="card">
          <div className="card-h"><h3>The offer</h3></div>
          <p className="muted" style={{ marginTop: 0 }}>Write the offer as it stands today: who it is for, what is included, the price and the outcome. Mark anything not built yet as planned.</p>
          <textarea className="textarea" style={{ minHeight: 220 }} value={offer} onChange={(e) => setOffer(e.target.value)} aria-label="Offer" />
        </section>
      )}
      {tab === 'clients' && (<>
        <Collection storeKey="biz:fieldwork:clients" title="Clients" noun="client" activityHref="/businesses/fieldwork" fields={[{ key: 'name', label: 'Client', required: true }, { key: 'package', label: 'Package' }, { key: 'status', label: 'Status', type: 'select', options: ['Onboarding', 'Building', 'Live', 'Paused', 'Ended'], defaultValue: 'Onboarding' }, { key: 'url', label: 'Site', type: 'url' }]} inlineSelect={['status']} emptyTitle="No clients yet" emptyHint="Nobody is paying yet. Clients appear here once a deal is won." />
        <Collection storeKey="biz:fieldwork:deployed" title="Systems actually deployed" noun="deployment" activityHref="/businesses/fieldwork" fields={[{ key: 'client', label: 'Client', required: true }, { key: 'system', label: 'System' }, { key: 'status', label: 'Status', type: 'select', options: ['Planned', 'Building', 'Live', 'Retired'], defaultValue: 'Planned' }, { key: 'date', label: 'Date', type: 'date' }]} inlineSelect={['status']} emptyTitle="Nothing deployed yet" emptyHint="Only record systems that are really live for a client." />
      </>)}
      {tab === 'revenue' && (<>
        <Stats items={[['Recurring (received)', money(rec, 'GBP', 0)], ['One-off (received)', money(one, 'GBP', 0)], ['Payments logged', String(pay.length)], ['Basis', 'Cash received']]} />
        <Collection storeKey="biz:fieldwork:payments" title="Payments received" noun="payment" activityHref="/businesses/fieldwork" sort={(a, b) => String(b.date ?? '').localeCompare(String(a.date ?? ''))}
          fields={[{ key: 'client', label: 'Client', required: true }, { key: 'amount', label: 'Amount (£)', type: 'number', prefix: '£', required: true }, { key: 'kind', label: 'Type', type: 'select', options: ['One-off', 'Recurring'], defaultValue: 'One-off', required: true }, { key: 'date', label: 'Date', type: 'date', defaultValue: isoToday() }]} emptyTitle="No revenue yet" emptyHint="Log only money actually received." />
      </>)}
    </div>
  );
}

/* ---------- WAYKON Media ---------- */
function Media() {
  const [tab, setTab] = useState('overview');
  const { items } = useCollection<{ id: string; createdAt: string; stage?: string; publish?: string }>('biz:media:pipeline');
  const published = items.filter((i) => i.stage === 'Published').length;
  const next = [...items].filter((i) => i.publish && i.publish >= isoToday() && i.stage !== 'Published').sort((a, b) => a.publish!.localeCompare(b.publish!))[0];
  return (
    <div className="stack" style={{ gap: 18 }}>
      <Tabs value={tab} onChange={setTab} items={[{ id: 'overview', label: 'Overview' }, { id: 'pipeline', label: 'Content pipeline' }, { id: 'sources', label: 'Sources and facts' }, { id: 'formats', label: 'Series and formats' }, { id: 'performance', label: 'Performance' }]} />
      {tab === 'overview' && (<>
        <Stats items={[['In pipeline', String(items.length - published)], ['Published', String(published)], ['Next publish', next?.publish ? fmtDate(next.publish, { day: 'numeric', month: 'short' }) : '—'], ['Platforms', 'Instagram · YouTube']]} />
        <div className="grid g2" style={{ alignItems: 'start' }}><VentureTasks slug="media" /><Notes slug="media" /></div>
      </>)}
      {tab === 'pipeline' && <Collection storeKey="biz:media:pipeline" title="Content pipeline" noun="piece" activityHref="/businesses/media" sort={sortByDate('publish')}
        fields={[{ key: 'title', label: 'Title', required: true }, { key: 'platform', label: 'Platform', type: 'select', options: ['Instagram', 'YouTube', 'Both'], defaultValue: 'Instagram' }, { key: 'format', label: 'Format' }, { key: 'stage', label: 'Stage', type: 'select', options: ['Idea', 'Research', 'Script', 'Filming', 'Editing (CapCut)', 'Scheduled', 'Published'], defaultValue: 'Idea' }, { key: 'fact', label: 'Fact status', type: 'select', options: ['Unchecked', 'Needs verification', 'Confirmed', 'Analysis', 'Opinion'], defaultValue: 'Unchecked' }, { key: 'publish', label: 'Publish date', type: 'date', warn: true }, { key: 'notes', label: 'Notes', type: 'textarea', hideInTable: true }]}
        inlineSelect={['stage', 'fact']} emptyTitle="Nothing in the pipeline" emptyHint="Operations haven’t started. Add the first story or format idea." />}
      {tab === 'sources' && <Collection storeKey="biz:media:sources" title="Research and sources" noun="source" activityHref="/businesses/media"
        fields={[{ key: 'topic', label: 'Topic', required: true }, { key: 'claim', label: 'Claim or fact', type: 'textarea' }, { key: 'url', label: 'Source link', type: 'url' }, { key: 'status', label: 'Status', type: 'select', options: ['Needs verification', 'Confirmed', 'Disputed', 'Opinion'], defaultValue: 'Needs verification' }]} inlineSelect={['status']} emptyTitle="No sources yet" emptyHint="Keep facts, unverified claims, analysis and opinion separate." />}
      {tab === 'formats' && <Collection storeKey="biz:media:formats" title="Series and formats" noun="format" activityHref="/businesses/media"
        fields={[{ key: 'name', label: 'Name', required: true }, { key: 'style', label: 'Style', type: 'select', options: ['Narrated clips with footage', 'Real-life footage', 'Short explainer', 'Long-form', 'Other'] }, { key: 'cadence', label: 'Cadence' }, { key: 'status', label: 'Status', type: 'select', options: ['Idea', 'Testing', 'Active', 'Paused'], defaultValue: 'Idea' }, { key: 'notes', label: 'Notes', type: 'textarea', hideInTable: true }]} inlineSelect={['status']} emptyTitle="No formats yet" />}
      {tab === 'performance' && <Collection storeKey="biz:media:performance" title="Performance by post" noun="result" activityHref="/businesses/media"
        fields={[{ key: 'post', label: 'Post', required: true }, { key: 'platform', label: 'Platform', type: 'select', options: ['Instagram', 'YouTube'] }, { key: 'date', label: 'Published', type: 'date' }, { key: 'views', label: 'Views', type: 'number' }, { key: 'reach', label: 'Reach', type: 'number' }, { key: 'watch', label: 'Watch time (min)', type: 'number' }, { key: 'engagement', label: 'Engagement', type: 'number' }]} emptyTitle="No performance data" emptyHint="Enter numbers once you start publishing. Nothing is estimated." />}
    </div>
  );
}
