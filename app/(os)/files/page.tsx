'use client';
import { useState } from 'react';
import { ExternalLink, Eye, FolderClosed, FolderOpen, Pencil, Plus, Trash2 } from 'lucide-react';
import { Photo } from '@/components/Art';
import { Empty, Field, Modal, PageHead } from '@/components/ui';
import { useCollection, logActivity } from '@/lib/store';

type L = { id: string; createdAt: string; title: string; url: string; folder: string; notes?: string };
const FOLDERS = ['General', 'WAYKON Holdings', 'Plot42', 'Fieldwork', 'WAYKON Media', 'School', 'Finance', 'Personal'];
const TOOLS = [['Google Drive', 'https://drive.google.com'], ['Gmail', 'https://mail.google.com'], ['Google Calendar', 'https://calendar.google.com'], ['Google Docs', 'https://docs.google.com'], ['Google Sheets', 'https://sheets.google.com'], ['WhatsApp Web', 'https://web.whatsapp.com'], ['CapCut', 'https://www.capcut.com'], ['Pinterest', 'https://www.pinterest.com'], ['Instagram', 'https://www.instagram.com'], ['YouTube Studio', 'https://studio.youtube.com'], ['Vercel', 'https://vercel.com/dashboard'], ['GitHub', 'https://github.com']];

// Google Drive / Docs / Sheets / Slides links can be shown inside the OS using Google's own
// preview pages. They render only if this browser is signed in to a Google account with access.
function previewUrl(u: string): string | null {
  try {
    const x = new URL(u);
    const id = x.pathname.match(/\/d\/([^/]+)/)?.[1];
    if (!id) return null;
    if (x.hostname === 'drive.google.com') return `https://drive.google.com/file/d/${id}/preview`;
    if (x.hostname === 'docs.google.com') return `https://docs.google.com${x.pathname.replace(/\/(edit|view|preview).*$/, '')}/preview`;
  } catch { /* not a URL */ }
  return null;
}

export default function Files() {
  const { items, add, update, remove } = useCollection<L>('files:links');
  const [folder, setFolder] = useState('all');
  const [edit, setEdit] = useState<L | 'new' | null>(null);
  const [view, setView] = useState<L | null>(null);
  const [q, setQ] = useState('');
  const folders = [...new Set([...FOLDERS, ...items.map((i) => i.folder)])];
  const count = (f: string) => items.filter((i) => i.folder === f).length;
  const list = items.filter((i) => (folder === 'all' || i.folder === folder) && (i.title + i.url + (i.notes ?? '')).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="page">
      <Photo src="/images/files.jpg" variant="monolith" tone="dark" style={{ height: 180, marginBottom: 24 }} />
      <PageHead eyebrow="Files" title="Documents and links" sub="Google Drive remains the home of your files. Here you keep links to the ones that matter, grouped by area, and preview Google documents without leaving the OS."
        actions={<button className="btn btn-primary" onClick={() => setEdit('new')}><Plus size={15} /> Add link</button>} />
      <div className="files-grid">
        <aside className="card" style={{ alignSelf: 'start' }}>
          <input className="input" placeholder="Search links" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search links" />
          <div className="stack" style={{ gap: 2, marginTop: 12 }}>
            <button className="nav-item" aria-current={folder === 'all' ? 'page' : undefined} onClick={() => setFolder('all')}><FolderOpen size={17} /> All links <span className="nav-count">{items.length}</span></button>
            {folders.map((f) => <button key={f} className="nav-item" aria-current={folder === f ? 'page' : undefined} onClick={() => setFolder(f)}><FolderClosed size={17} /> {f}<span className="nav-count">{count(f)}</span></button>)}
          </div>
        </aside>
        <div className="stack" style={{ gap: 16, minWidth: 0 }}>
          <section className="card">
            <div className="card-h"><h3>Google Drive</h3><span className="chip">Not connected</span></div>
            <p className="muted" style={{ marginTop: 0 }}>Browsing and searching all of Drive from here needs a Google sign-in, which is a later phase. Until then, save links to your key files below. Docs, Sheets, Slides and Drive file links can be previewed inside the OS.</p>
            <a className="btn" href="https://drive.google.com" target="_blank" rel="noopener noreferrer"><ExternalLink size={14} /> Open Google Drive</a>
          </section>
          <section className="card">
            <div className="card-h"><h3>{folder === 'all' ? 'All links' : folder}</h3><span className="chip">{list.length}</span></div>
            {list.length === 0 ? <Empty title="No links here">Save links to documents, spreadsheets, briefs and anything you open often.</Empty> : (
              <div className="table-wrap"><table className="table"><thead><tr><th>Name</th><th>Folder</th><th aria-label="Actions" /></tr></thead><tbody>
                {list.map((l) => <tr key={l.id}><td><b style={{ fontWeight: 500 }}>{l.title}</b><div className="small muted">{l.url.replace(/^https?:\/\//, '').slice(0, 52)}</div></td><td><span className="chip">{l.folder}</span></td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>{previewUrl(l.url) && <button className="btn btn-sm" onClick={() => setView(l)}><Eye size={13} /> Preview</button>} <a className="btn btn-sm" href={l.url} target="_blank" rel="noopener noreferrer"><ExternalLink size={13} /> Open</a>
                    <button className="btn btn-ghost btn-sm" onClick={() => setEdit(l)} aria-label="Edit link"><Pencil size={13} /></button><button className="btn btn-ghost btn-sm btn-danger" onClick={() => confirm('Delete this link?') && remove(l.id)} aria-label="Delete link"><Trash2 size={13} /></button></td></tr>)}
              </tbody></table></div>
            )}
          </section>
          <section className="card">
            <div className="card-h"><h3>Everyday tools</h3></div>
            <p className="muted small" style={{ marginTop: 0 }}>Things that cannot be embedded open in a new tab.</p>
            <div className="row wrap">{TOOLS.map(([n, u]) => <a key={n} className="chip" style={{ height: 30, fontSize: 13 }} href={u} target="_blank" rel="noopener noreferrer">{n} <ExternalLink size={11} /></a>)}</div>
          </section>
        </div>
      </div>
      {edit && (
        <Modal title={edit === 'new' ? 'Add link' : 'Edit link'} onClose={() => setEdit(null)}>
          <form className="stack" onSubmit={(e) => { e.preventDefault(); const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>; if (!f.title.trim() || !f.url.trim()) return; const data = { title: f.title.trim(), url: /^https?:/.test(f.url.trim()) ? f.url.trim() : 'https://' + f.url.trim(), folder: f.folder.trim() || 'General', notes: f.notes.trim() || undefined }; if (edit === 'new') { add(data as never); logActivity(`Saved link: ${data.title}`, 'link', '/files'); } else update(edit.id, data); setEdit(null); }}>
            <Field label="Title"><input className="input" name="title" defaultValue={edit === 'new' ? '' : edit.title} autoFocus /></Field>
            <Field label="URL"><input className="input" name="url" defaultValue={edit === 'new' ? '' : edit.url} placeholder="https://docs.google.com/…" /></Field>
            <Field label="Folder"><input className="input" name="folder" list="folders" defaultValue={edit === 'new' ? (folder === 'all' ? 'General' : folder) : edit.folder} /><datalist id="folders">{folders.map((f) => <option key={f} value={f} />)}</datalist></Field>
            <Field label="Notes"><input className="input" name="notes" defaultValue={edit === 'new' ? '' : edit.notes ?? ''} /></Field>
            <div className="row" style={{ justifyContent: 'flex-end' }}><button type="button" className="btn" onClick={() => setEdit(null)}>Cancel</button><button className="btn btn-primary">Save</button></div>
          </form>
        </Modal>
      )}
      {view && (
        <div className="modal-wrap" onMouseDown={(e) => e.target === e.currentTarget && setView(null)}>
          <div className="modal" style={{ width: 'min(1000px,100%)', height: '86vh', display: 'flex', flexDirection: 'column' }}>
            <div className="card-h"><h3>{view.title}</h3><div className="row"><a className="btn btn-sm" href={view.url} target="_blank" rel="noopener noreferrer"><ExternalLink size={13} /> Open in Google</a><button className="btn btn-sm" onClick={() => setView(null)}>Close</button></div></div>
            <iframe src={previewUrl(view.url)!} title={view.title} style={{ flex: 1, border: 0, borderRadius: 12, background: '#fff' }} />
            <p className="small muted" style={{ margin: '8px 0 0' }}>If this stays blank, your browser is not signed in to a Google account with access, or it is blocking embedded Google pages. Use “Open in Google”.</p>
          </div>
        </div>
      )}
      <style>{`.files-grid{display:grid;grid-template-columns:260px minmax(0,1fr);gap:16px}@media(max-width:900px){.files-grid{grid-template-columns:1fr}}`}</style>
    </div>
  );
}
