'use client';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Heart, ImagePlus, Pencil, Plus, Trash2 } from 'lucide-react';
import { Photo } from '@/components/Art';
import { Collection } from '@/components/Collection';
import { Empty, Field, Modal, PageHead, Stars, Tabs } from '@/components/ui';
import { useCollection, useStore, logActivity } from '@/lib/store';
import { resizeImage } from '@/lib/image';
import { isoToday } from '@/lib/dates';

type Tab = 'watch' | 'places' | 'ideas' | 'grid' | 'mood' | 'wish';

export default function Lifestyle() {
  const [tab, setTab] = useState<Tab>('watch');
  return (
    <div className="page">
      <Photo src="/images/lifestyle-hero.jpg" variant="terrain" style={{ height: 240, marginBottom: 28 }}>
        <div className="photo-cap"><div className="eyebrow" style={{ color: '#d8d6cf' }}>Lifestyle</div><div className="display" style={{ fontSize: 40, color: '#fff' }}>What you watch, where you go, what you make.</div></div>
      </Photo>
      <Tabs value={tab} onChange={setTab} items={[{ id: 'watch', label: 'Watchlist' }, { id: 'places', label: 'Places' }, { id: 'ideas', label: 'Content ideas' }, { id: 'grid', label: 'Instagram planner' }, { id: 'mood', label: 'Mood board' }, { id: 'wish', label: 'Wishlist' }]} />
      <div style={{ marginTop: 20 }}>
        {tab === 'watch' && <Watch />}
        {tab === 'places' && <Collection storeKey="life:places" title="Places to visit" noun="place" activityHref="/lifestyle" fields={[{ key: 'name', label: 'Place', required: true }, { key: 'where', label: 'City / country' }, { key: 'status', label: 'Status', type: 'select', options: ['Want to go', 'Planned', 'Visited'], defaultValue: 'Want to go' }, { key: 'url', label: 'Link', type: 'url' }, { key: 'notes', label: 'Notes', type: 'textarea', hideInTable: true }]} inlineSelect={['status']} emptyTitle="No places yet" />}
        {tab === 'ideas' && <Collection storeKey="life:ideas" title="Social content ideas" noun="idea" activityHref="/lifestyle" fields={[{ key: 'idea', label: 'Idea', type: 'textarea', required: true }, { key: 'platform', label: 'Platform', type: 'select', options: ['Instagram', 'YouTube', 'TikTok', 'Other'], defaultValue: 'Instagram' }, { key: 'status', label: 'Status', type: 'select', options: ['Idea', 'Developing', 'Filmed', 'Posted'], defaultValue: 'Idea' }]} inlineSelect={['status', 'platform']} emptyTitle="No ideas yet" emptyHint="Capture them anywhere with Quick add." />}
        {tab === 'grid' && <Grid />}
        {tab === 'mood' && <Mood />}
        {tab === 'wish' && <Collection storeKey="life:wishlist" title="Wishlist" noun="item" activityHref="/lifestyle" fields={[{ key: 'item', label: 'Item', required: true }, { key: 'price', label: 'Price', type: 'number' }, { key: 'url', label: 'Link', type: 'url' }, { key: 'priority', label: 'Priority', type: 'select', options: ['Someday', 'Soon', 'Next'], defaultValue: 'Someday' }]} inlineSelect={['priority']} emptyTitle="Nothing on the list" />}
      </div>
    </div>
  );
}

type W = { id: string; createdAt: string; title: string; kind: string; year?: string; rating: number; status: string; fav?: boolean; comment?: string; poster?: string };

function Watch() {
  const { items, add, update, remove } = useCollection<W>('life:watch');
  const [edit, setEdit] = useState<W | 'new' | null>(null);
  const [kind, setKind] = useState('all');
  const [status, setStatus] = useState('all');
  const [poster, setPoster] = useState<string | undefined>();
  const [err, setErr] = useState('');
  const list = items.filter((w) => (kind === 'all' || w.kind === kind) && (status === 'all' || w.status === status));
  const open = (w: W | 'new') => { setErr(''); setPoster(w === 'new' ? undefined : w.poster); setEdit(w); };
  return (
    <div className="stack" style={{ gap: 14 }}>
      <div className="row between wrap">
        <div className="row wrap"><Tabs value={kind} onChange={setKind} items={[{ id: 'all', label: 'All' }, { id: 'Movie', label: 'Movies' }, { id: 'Series', label: 'Series' }]} />
          <select className="select" style={{ width: 150 }} value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status"><option value="all">Any status</option><option>Want to watch</option><option>Watching</option><option>Watched</option></select></div>
        <button className="btn btn-primary btn-sm" onClick={() => open('new')}><Plus size={14} /> Add title</button>
      </div>
      {list.length === 0 ? <Empty title="Nothing here yet">Add movies and series with a poster, a rating out of five and your own comment.</Empty> : (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(170px,1fr))' }}>
          {list.map((w) => (
            <div key={w.id} className="card" style={{ padding: 10 }}>
              <div className="photo" style={{ aspectRatio: '2/3', position: 'relative' }}>
                {w.poster ? <img src={w.poster} alt={`Poster for ${w.title}`} /> : <div style={{ height: '100%', display: 'grid', placeItems: 'center', padding: 10, textAlign: 'center' }} className="display">{w.title}</div>}
                <button className="iconbtn" style={{ position: 'absolute', top: 8, right: 8, width: 30, height: 30, background: 'rgba(0,0,0,.55)', color: w.fav ? '#fff' : '#bbb' }} onClick={() => update(w.id, { fav: !w.fav })} aria-label={w.fav ? 'Remove favourite' : 'Mark favourite'} aria-pressed={!!w.fav}><Heart size={14} fill={w.fav ? 'currentColor' : 'none'} /></button>
              </div>
              <div style={{ padding: '10px 4px 2px' }}>
                <b style={{ fontWeight: 500 }}>{w.title}</b>
                <div className="small muted">{w.kind}{w.year ? ` · ${w.year}` : ''} · {w.status}</div>
                <div style={{ margin: '6px 0' }}><Stars value={w.rating} onChange={(n) => update(w.id, { rating: n })} size={15} /></div>
                {w.comment && <p className="small" style={{ margin: '0 0 6px', color: 'var(--ink-2)' }}>{w.comment}</p>}
                <div className="row" style={{ gap: 0 }}><button className="btn btn-ghost btn-sm" onClick={() => open(w)} aria-label="Edit"><Pencil size={13} /></button><button className="btn btn-ghost btn-sm btn-danger" onClick={() => confirm('Remove this title?') && remove(w.id)} aria-label="Remove"><Trash2 size={13} /></button></div>
              </div>
            </div>
          ))}
        </div>
      )}
      {edit && (
        <Modal title={edit === 'new' ? 'Add title' : 'Edit title'} onClose={() => setEdit(null)}>
          <form className="stack" onSubmit={(e) => {
            e.preventDefault();
            const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
            if (!f.title.trim()) return setErr('Add a title.');
            const data = { title: f.title.trim(), kind: f.kind, year: f.year || undefined, status: f.status, rating: Number(f.rating), comment: f.comment.trim() || undefined, poster };
            if (edit === 'new') { add(data as never); logActivity(`Added to watchlist: ${data.title}`, 'add', '/lifestyle'); } else update(edit.id, data);
            setEdit(null);
          }}>
            <Field label="Title"><input className="input" name="title" defaultValue={edit === 'new' ? '' : edit.title} autoFocus /></Field>
            <div className="formgrid">
              <Field label="Type"><select className="select" name="kind" defaultValue={edit === 'new' ? 'Movie' : edit.kind}><option>Movie</option><option>Series</option></select></Field>
              <Field label="Year"><input className="input" name="year" defaultValue={edit === 'new' ? '' : edit.year ?? ''} /></Field>
              <Field label="Status"><select className="select" name="status" defaultValue={edit === 'new' ? 'Want to watch' : edit.status}><option>Want to watch</option><option>Watching</option><option>Watched</option></select></Field>
              <Field label="Rating"><select className="select" name="rating" defaultValue={edit === 'new' ? 0 : edit.rating}>{[0, 1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n === 0 ? 'Not rated' : `${n} / 5`}</option>)}</select></Field>
            </div>
            <Field label="Your comment"><textarea className="textarea" name="comment" defaultValue={edit === 'new' ? '' : edit.comment ?? ''} /></Field>
            <Field label="Poster / cover">
              <div className="row">{poster && <img src={poster} alt="" style={{ height: 64, borderRadius: 8 }} />}<label className="btn btn-sm"><ImagePlus size={14} /> {poster ? 'Replace' : 'Upload'}<input type="file" accept="image/*" hidden onChange={async (e) => { const file = e.target.files?.[0]; if (file) try { setPoster(await resizeImage(file, 360)); } catch (x) { setErr((x as Error).message); } }} /></label>{poster && <button type="button" className="btn btn-ghost btn-sm" onClick={() => setPoster(undefined)}>Remove</button>}</div>
            </Field>
            {err && <p role="alert" style={{ color: 'var(--neg)', margin: 0 }}>{err}</p>}
            <div className="row" style={{ justifyContent: 'flex-end' }}><button type="button" className="btn" onClick={() => setEdit(null)}>Cancel</button><button className="btn btn-primary">Save</button></div>
          </form>
        </Modal>
      )}
    </div>
  );
}

type G = { id: string; createdAt: string; image?: string; caption?: string; date?: string; status: string; order: number };
function Grid() {
  const { items, add, update, remove } = useCollection<G>('life:grid');
  const [edit, setEdit] = useState<G | 'new' | null>(null);
  const [img, setImg] = useState<string | undefined>();
  const sorted = [...items].sort((a, b) => b.order - a.order);
  const move = (g: G, dir: -1 | 1) => {
    const i = sorted.findIndex((x) => x.id === g.id), j = i + dir;
    if (j < 0 || j >= sorted.length) return;
    update(g.id, { order: sorted[j].order }); update(sorted[j].id, { order: g.order });
  };
  return (
    <div className="stack" style={{ gap: 14 }}>
      <div className="row between wrap"><p className="muted" style={{ margin: 0, maxWidth: '60ch' }}>Plan how your dump or profile grid will look. Newest sits top-left. This only plans: it does not post to Instagram.</p><button className="btn btn-primary btn-sm" onClick={() => { setImg(undefined); setEdit('new'); }}><Plus size={14} /> Add post</button></div>
      {sorted.length === 0 ? <Empty title="Nothing planned">Upload images and drag them into order with the arrows.</Empty> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 4, maxWidth: 560 }}>
          {sorted.map((g) => (
            <div key={g.id} style={{ position: 'relative', aspectRatio: '4/5', background: 'var(--surface-2)', overflow: 'hidden' }}>
              {g.image ? <img src={g.image} alt={g.caption ?? 'Planned post'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div className="small muted" style={{ padding: 10 }}>{g.caption}</div>}
              <span className="chip" style={{ position: 'absolute', top: 6, left: 6, background: 'rgba(0,0,0,.6)', color: '#fff', border: 0 }}>{g.status}</span>
              <div className="row" style={{ position: 'absolute', bottom: 4, left: 4, right: 4, justifyContent: 'space-between', gap: 2 }}>
                <span className="row" style={{ gap: 2 }}><button className="iconbtn" style={{ width: 26, height: 26, background: 'rgba(0,0,0,.6)' }} onClick={() => move(g, -1)} aria-label="Move earlier"><ArrowLeft size={12} /></button><button className="iconbtn" style={{ width: 26, height: 26, background: 'rgba(0,0,0,.6)' }} onClick={() => move(g, 1)} aria-label="Move later"><ArrowRight size={12} /></button></span>
                <span className="row" style={{ gap: 2 }}><button className="iconbtn" style={{ width: 26, height: 26, background: 'rgba(0,0,0,.6)' }} onClick={() => { setImg(g.image); setEdit(g); }} aria-label="Edit"><Pencil size={12} /></button><button className="iconbtn" style={{ width: 26, height: 26, background: 'rgba(0,0,0,.6)' }} onClick={() => confirm('Remove this post?') && remove(g.id)} aria-label="Remove"><Trash2 size={12} /></button></span>
              </div>
            </div>
          ))}
        </div>
      )}
      {edit && (
        <Modal title={edit === 'new' ? 'Add post' : 'Edit post'} onClose={() => setEdit(null)}>
          <form className="stack" onSubmit={(e) => { e.preventDefault(); const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>; const data = { image: img, caption: f.caption.trim() || undefined, date: f.date || undefined, status: f.status }; if (edit === 'new') add({ ...data, order: Math.max(0, ...items.map((i) => i.order)) + 1 } as never); else update(edit.id, data); setEdit(null); }}>
            <div className="row">{img && <img src={img} alt="" style={{ height: 90, borderRadius: 8 }} />}<label className="btn btn-sm"><ImagePlus size={14} /> {img ? 'Replace image' : 'Upload image'}<input type="file" accept="image/*" hidden onChange={async (e) => { const file = e.target.files?.[0]; if (file) setImg(await resizeImage(file, 520)); }} /></label></div>
            <Field label="Caption"><textarea className="textarea" name="caption" defaultValue={edit === 'new' ? '' : edit.caption ?? ''} /></Field>
            <div className="formgrid"><Field label="Planned date"><input className="input" type="date" name="date" defaultValue={edit === 'new' ? isoToday() : edit.date ?? ''} /></Field><Field label="Status"><select className="select" name="status" defaultValue={edit === 'new' ? 'Idea' : edit.status}><option>Idea</option><option>Ready</option><option>Posted</option></select></Field></div>
            <div className="row" style={{ justifyContent: 'flex-end' }}><button type="button" className="btn" onClick={() => setEdit(null)}>Cancel</button><button className="btn btn-primary">Save</button></div>
          </form>
        </Modal>
      )}
    </div>
  );
}

type M = { id: string; createdAt: string; image: string; caption?: string; link?: string };
function Mood() {
  const { items, add, remove } = useCollection<M>('life:mood');
  const [pin, setPin] = useStore<string>('life:pinterest', '');
  return (
    <div className="stack" style={{ gap: 14 }}>
      <div className="row between wrap">
        <div className="row"><input className="input" style={{ width: 280 }} placeholder="Pinterest board link (optional)" value={pin} onChange={(e) => setPin(e.target.value)} aria-label="Pinterest board link" />{/^https?:\/\//.test(pin) && <a className="btn btn-sm" href={pin} target="_blank" rel="noopener noreferrer">Open board</a>}</div>
        <label className="btn btn-primary btn-sm"><ImagePlus size={14} /> Add images<input type="file" accept="image/*" multiple hidden onChange={async (e) => { for (const f of Array.from(e.target.files ?? [])) add({ image: await resizeImage(f, 520) } as never); e.target.value = ''; }} /></label>
      </div>
      <p className="muted small" style={{ margin: 0 }}>Pinterest does not allow its boards to be pulled into other apps, so this holds your own saved images and links out to the board.</p>
      {items.length === 0 ? <Empty title="No images yet">Upload references, outfits, places, anything that sets the mood.</Empty> : (
        <div style={{ columnCount: 3, columnGap: 10 }} className="mood">
          {items.map((m) => <div key={m.id} style={{ breakInside: 'avoid', marginBottom: 10, position: 'relative' }}><img src={m.image} alt={m.caption ?? 'Mood board image'} style={{ width: '100%', borderRadius: 12, display: 'block' }} /><button className="iconbtn" style={{ position: 'absolute', top: 6, right: 6, width: 28, height: 28, background: 'rgba(0,0,0,.6)' }} onClick={() => confirm('Remove this image?') && remove(m.id)} aria-label="Remove image"><Trash2 size={12} /></button></div>)}
        </div>
      )}
      <style>{`@media(max-width:720px){.mood{column-count:2!important}}`}</style>
    </div>
  );
}
