'use client';
import { useMemo, useState } from 'react';
import { ArrowLeftRight, ArrowDownRight, ArrowUpRight, Eye, EyeOff, Pencil, PiggyBank, Plus, Receipt, Trash2, Wallet } from 'lucide-react';
import { BarChart } from '@/components/BarChart';
import { Empty, Field, Modal, PageHead, Tabs, openQuickAdd } from '@/components/ui';
import { useCollection, readKey, writeKey, logActivity } from '@/lib/store';
import { CURRENCIES, convert, money, removeTxn } from '@/lib/finance';
import { useSettings } from '@/lib/settings';
import { useRates } from '@/lib/useRates';
import { daysUntil, fmtDate, isoToday, addDays } from '@/lib/dates';
import type { Account, Bill, SavingsGoal, Txn } from '@/lib/types';

const KINDS = ['Bank', 'Mobile wallet', 'Crypto wallet', 'Cash', 'Savings pot'];
const Tag = ({ children }: { children: React.ReactNode }) => <span className="chip" style={{ height: 20, fontSize: 10 }}>{children}</span>;

export default function Finance() {
  const [settings, setSettings] = useSettings();
  const { rates, error } = useRates();
  const base = settings.baseCurrency;
  const { items: accounts, add: addAcc, update: updAcc, remove: rmAcc } = useCollection<Account>('accounts');
  const { items: txns } = useCollection<Txn>('txns');
  const { items: goals, add: addGoal, update: updGoal, remove: rmGoal } = useCollection<SavingsGoal>('savings');
  const { items: bills, add: addBill, update: updBill, remove: rmBill } = useCollection<Bill>('bills');
  const [hide, setHide] = useState(settings.hideBalances);
  const [modal, setModal] = useState<null | 'account' | 'transfer' | 'goal' | 'bill'>(null);
  const [editAcc, setEditAcc] = useState<Account | null>(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [view, setView] = useState<'expense' | 'income'>('expense');
  const [tf, setTf] = useState({ type: 'all', scope: 'all' });
  const m = (v: string) => (hide ? '••••••' : v);
  const conv = (n: number, c: string) => convert(n, c, base, rates);
  const sum = (rows: { n: number; c: string }[]) => (rows.every((r) => conv(r.n, r.c) !== null) ? rows.reduce((s, r) => s + (conv(r.n, r.c) as number), 0) : null);
  const fmt = (v: number | null, d = 0) => (v === null ? '—' : m(money(v, base, d)));

  const personal = accounts.filter((a) => a.scope !== 'business');
  const business = accounts.filter((a) => a.scope === 'business');
  const totalPersonal = sum(personal.map((a) => ({ n: a.balance, c: a.currency })));
  const totalBusiness = sum(business.map((a) => ({ n: a.balance, c: a.currency })));
  const thisMonth = isoToday().slice(0, 7);
  const lastMonth = (() => { const d = new Date(); d.setMonth(d.getMonth() - 1); return isoToday(d).slice(0, 7); })();
  const flow = (month: string, type: 'income' | 'expense', scope = 'personal') => sum(txns.filter((t) => t.type === type && t.date.startsWith(month) && t.scope === scope).map((t) => ({ n: t.amount, c: t.currency })));
  const expNow = flow(thisMonth, 'expense'), expPrev = flow(lastMonth, 'expense'), incNow = flow(thisMonth, 'income');
  const delta = expNow !== null && expPrev ? ((expNow - expPrev) / expPrev) * 100 : null;
  const savedTotal = sum(goals.map((g) => ({ n: g.saved, c: g.currency })));

  const series = useMemo(() => Array.from({ length: 12 }, (_, i) => {
    const key = `${year}-${String(i + 1).padStart(2, '0')}`;
    const v = txns.filter((t) => t.type === view && t.scope === 'personal' && t.date.startsWith(key)).reduce((s, t) => s + (convert(t.amount, t.currency, base, rates) ?? 0), 0);
    return { label: new Date(year, i, 1).toLocaleDateString('en-GB', { month: 'short' }), value: v };
  }), [txns, year, view, base, rates]);

  const cats = useMemo(() => {
    const map = new Map<string, number>();
    txns.filter((t) => t.type === 'expense' && t.scope === 'personal' && t.date.startsWith(thisMonth)).forEach((t) => map.set(t.category, (map.get(t.category) ?? 0) + (convert(t.amount, t.currency, base, rates) ?? 0)));
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [txns, thisMonth, base, rates]);

  const shown = txns.filter((t) => (tf.type === 'all' || t.type === tf.type) && (tf.scope === 'all' || t.scope === tf.scope)).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 25);
  const upcoming = bills.filter((b) => !b.paid).sort((a, b) => a.due.localeCompare(b.due));

  return (
    <div className="page">
      <PageHead eyebrow="Personal finance" title="Money" sub="Balances are entered by you and labelled as actual. Targets and plans are labelled separately. Exchange rates are live; nothing else is estimated for you."
        actions={<><button className="btn" onClick={() => setHide(!hide)}>{hide ? <EyeOff size={15} /> : <Eye size={15} />} {hide ? 'Show' : 'Hide'} balances</button><button className="btn btn-primary" onClick={() => openQuickAdd('expense')}><Plus size={15} /> Add transaction</button></>} />
      {error && <p className="small" style={{ color: 'var(--neg)' }}>Live exchange rates could not be loaded, so totals across currencies show “—”.</p>}

      <div className="fin-grid">
        <section className="card" style={{ gridArea: 'bal' }}>
          <div className="card-h">
            <h3><span className="icotile"><Wallet size={16} /></span>Account balance <Tag>Actual · manual</Tag></h3>
            <select className="select" style={{ width: 96, height: 32 }} value={base} onChange={(e) => setSettings({ baseCurrency: e.target.value })} aria-label="Display currency">{CURRENCIES.map((c) => <option key={c}>{c}</option>)}</select>
          </div>
          <div className="big-num tnum" style={{ fontSize: 40 }}>{fmt(totalPersonal)}</div>
          <div className="row small" style={{ margin: '6px 0 16px' }}>
            {incNow !== null && expNow !== null ? <span className={`chip ${incNow - expNow >= 0 ? 'chip-pos' : 'chip-neg'}`}>{incNow - expNow >= 0 ? '+' : ''}{m(money(incNow - expNow, base, 0))}</span> : <span className="chip">—</span>}
            <span className="muted">net this month</span>
          </div>
          <div className="row"><button className="btn btn-primary grow" onClick={() => setModal('transfer')} disabled={accounts.length < 2}><ArrowLeftRight size={15} /> Move between pots</button><button className="btn grow" onClick={() => openQuickAdd('expense')}><Receipt size={15} /> Log expense</button></div>
          {accounts.length < 2 && accounts.length > 0 && <div className="small muted" style={{ marginTop: 6 }}>Add a second account to move money between pots.</div>}
          <div className="row between" style={{ margin: '20px 0 10px' }}><b style={{ fontWeight: 500 }}>My wallets</b><button className="btn btn-sm" onClick={() => { setEditAcc(null); setModal('account'); }}><Plus size={14} /> Add new</button></div>
          {accounts.length === 0 ? <Empty title="No accounts yet">Add a bank account, wallet or cash pot to begin.</Empty> : (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(170px,1fr))', gap: 10 }}>
              {accounts.map((a) => (
                <div key={a.id} style={{ background: 'var(--surface-2)', borderRadius: 14, padding: 12 }}>
                  <div className="row between"><span className="row" style={{ gap: 8 }}><span className="icotile" style={{ width: 28, height: 28, fontSize: 10, fontWeight: 600 }}>{a.currency}</span><span className="small" style={{ fontWeight: 500 }}>{a.name}</span></span>
                    <span className="row" style={{ gap: 0 }}><button className="btn btn-ghost btn-sm" style={{ padding: 4, height: 24 }} onClick={() => { setEditAcc(a); setModal('account'); }} aria-label={`Edit ${a.name}`}><Pencil size={12} /></button></span></div>
                  <div className="tnum" style={{ fontSize: 20, margin: '10px 0 4px' }}>{m(money(a.balance, a.currency))}</div>
                  <div className="row between small"><span className="muted">{a.kind}{a.scope === 'business' ? ' · business' : ''}</span><span className={a.status === 'active' ? 'chip chip-pos' : 'chip'} style={{ height: 18, fontSize: 10 }}>{a.status === 'active' ? 'Active' : 'Inactive'}</span></div>
                </div>
              ))}
            </div>
          )}
          {business.length > 0 && <div className="small muted" style={{ marginTop: 12 }}>Business accounts ({fmt(totalBusiness)}) are kept out of the personal total above.</div>}
        </section>

        <section className="card" style={{ gridArea: 'exp' }}>
          <div className="card-h"><h3><span className="icotile"><Receipt size={16} /></span>Total expenses</h3><Tag>This month · actual</Tag></div>
          <div className="big-num tnum">{fmt(expNow)}</div>
          <div className="row small" style={{ marginTop: 6 }}>{delta !== null ? <span className={`chip ${delta <= 0 ? 'chip-pos' : 'chip-neg'}`}>{delta <= 0 ? <ArrowDownRight size={12} /> : <ArrowUpRight size={12} />} {Math.abs(delta).toFixed(1)}%</span> : <span className="chip">No prior month</span>}<span className="muted">from last month</span></div>
        </section>
        <section className="card" style={{ gridArea: 'sav' }}>
          <div className="card-h"><h3><span className="icotile"><PiggyBank size={16} /></span>Total savings</h3><Tag>Actual · manual</Tag></div>
          <div className="big-num tnum">{fmt(savedTotal)}</div>
          <div className="small muted" style={{ marginTop: 6 }}>{goals.length} savings plan{goals.length === 1 ? '' : 's'}</div>
        </section>

        <section className="card" style={{ gridArea: 'chart' }}>
          <div className="card-h"><h3>Overview</h3>
            <div className="row"><Tabs value={view} onChange={setView} items={[{ id: 'expense', label: 'Expenses' }, { id: 'income', label: 'Income' }]} />
              <select className="select" style={{ width: 90, height: 32 }} value={year} onChange={(e) => setYear(Number(e.target.value))} aria-label="Year">{[0, 1, 2].map((n) => <option key={n}>{new Date().getFullYear() - n}</option>)}</select></div></div>
          {txns.length === 0 ? <Empty title="No transactions yet">Log income and expenses to see the monthly picture.</Empty> : <BarChart data={series} format={(n) => m(money(n, base, 0))} />}
        </section>

        <section className="card" style={{ gridArea: 'plan' }}>
          <div className="card-h"><h3><span className="icotile"><PiggyBank size={16} /></span>My savings plan <Tag>Target</Tag></h3><button className="btn btn-sm" onClick={() => setModal('goal')}><Plus size={14} /> Plan</button></div>
          {goals.length === 0 ? <Empty title="No savings plans">Set a target, a deadline and track what you have actually saved.</Empty> : (
            <div className="stack" style={{ gap: 12 }}>
              {goals.map((g) => {
                const pct = g.target ? Math.min(100, Math.round((g.saved / g.target) * 100)) : 0;
                const left = daysUntil(g.deadline);
                const months = left !== null && left > 0 ? Math.max(1, left / 30) : null;
                return (
                  <div key={g.id} style={{ background: 'var(--surface-2)', borderRadius: 14, padding: 14 }}>
                    <div className="row between"><b style={{ fontWeight: 500 }}>{g.name}</b><div className="row" style={{ gap: 2 }}><button className="btn btn-ghost btn-sm" onClick={() => { const v = prompt(`Amount saved so far for “${g.name}” (${g.currency})`, String(g.saved)); if (v !== null && !isNaN(Number(v))) updGoal(g.id, { saved: Number(v) }); }} aria-label="Update saved amount"><Pencil size={13} /></button><button className="btn btn-ghost btn-sm btn-danger" onClick={() => confirm('Delete this plan?') && rmGoal(g.id)} aria-label="Delete plan"><Trash2 size={13} /></button></div></div>
                    <div className="row between small" style={{ margin: '6px 0' }}><span className="tnum">{m(money(g.saved, g.currency, 0))} / {m(money(g.target, g.currency, 0))}</span><b>{pct}%</b></div>
                    <div className="progress"><i style={{ width: `${pct}%` }} /></div>
                    <div className="small muted" style={{ marginTop: 6 }}>{g.deadline ? `By ${fmtDate(g.deadline)}` : 'No deadline'}{months && g.target > g.saved ? ` · ${m(money((g.target - g.saved) / months, g.currency, 0))}/month needed` : ''}</div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="card" style={{ gridArea: 'tx' }}>
          <div className="card-h"><h3>Recent transactions</h3>
            <div className="row"><select className="select" style={{ width: 110, height: 32 }} value={tf.type} onChange={(e) => setTf({ ...tf, type: e.target.value })} aria-label="Type"><option value="all">All types</option><option value="income">Income</option><option value="expense">Expenses</option></select>
              <select className="select" style={{ width: 120, height: 32 }} value={tf.scope} onChange={(e) => setTf({ ...tf, scope: e.target.value })} aria-label="Scope"><option value="all">Personal + business</option><option value="personal">Personal</option><option value="business">Business</option></select></div></div>
          {shown.length === 0 ? <Empty title="No transactions">Nothing logged yet.</Empty> : (
            <div className="table-wrap"><table className="table"><thead><tr><th>Activity</th><th>Date</th><th>Amount</th><th>Scope</th><th aria-label="Actions" /></tr></thead><tbody>
              {shown.map((t) => <tr key={t.id}><td><b style={{ fontWeight: 500 }}>{t.desc || t.category}</b><div className="small muted">{t.category}</div></td><td>{fmtDate(t.date, { day: 'numeric', month: 'short' })}</td><td className="tnum" style={{ color: t.type === 'income' ? 'var(--pos)' : undefined }}>{t.type === 'income' ? '+' : '-'}{m(money(t.amount, t.currency))}</td><td><span className="chip">{t.scope}</span></td><td style={{ textAlign: 'right' }}><button className="btn btn-ghost btn-sm btn-danger" onClick={() => confirm('Delete this transaction? Any linked account balance is reversed.') && removeTxn(t.id)} aria-label="Delete transaction"><Trash2 size={14} /></button></td></tr>)}
            </tbody></table></div>
          )}
        </section>
      </div>

      <div className="grid g3" style={{ marginTop: 16, alignItems: 'start' }}>
        <FxPanel base={base} />
        <section className="card">
          <div className="card-h"><h3>Spending by category</h3><Tag>This month</Tag></div>
          {cats.length === 0 ? <Empty title="No spending logged this month" /> : cats.slice(0, 7).map(([c, v]) => <div key={c} style={{ marginBottom: 10 }}><div className="row between small"><span>{c}</span><span className="tnum">{m(money(v, base, 0))}</span></div><div className="progress" style={{ marginTop: 4 }}><i style={{ width: `${(v / cats[0][1]) * 100}%` }} /></div></div>)}
        </section>
        <section className="card">
          <div className="card-h"><h3>Bills and commitments</h3><button className="btn btn-sm" onClick={() => setModal('bill')}><Plus size={14} /> Bill</button></div>
          {upcoming.length === 0 ? <Empty title="No upcoming bills" /> : upcoming.map((b) => {
            const n = daysUntil(b.due)!;
            return <div key={b.id} className="row between" style={{ padding: '8px 0', borderTop: '1px solid var(--line)' }}><div><div>{b.name}</div><div className="small muted">{m(money(b.amount, b.currency, 0))} · {fmtDate(b.due, { day: 'numeric', month: 'short' })}{b.recurring === 'monthly' ? ' · monthly' : ''}</div></div>
              <div className="row" style={{ gap: 4 }}>{n <= 3 && <span className={`chip ${n < 0 ? 'chip-neg' : ''}`}>{n < 0 ? 'Overdue' : n === 0 ? 'Today' : `${n}d`}</span>}
                <button className="btn btn-sm" onClick={() => { if (b.recurring === 'monthly') { const d = new Date(b.due + 'T00:00:00'); d.setMonth(d.getMonth() + 1); updBill(b.id, { due: isoToday(d) }); } else updBill(b.id, { paid: true }); logActivity(`Paid bill: ${b.name}`, 'money', '/finance'); }}>Paid</button>
                <button className="btn btn-ghost btn-sm btn-danger" onClick={() => confirm('Delete this bill?') && rmBill(b.id)} aria-label="Delete bill"><Trash2 size={13} /></button></div></div>;
          })}
        </section>
      </div>

      {modal === 'account' && <AccountModal acc={editAcc} onClose={() => setModal(null)} onSave={(d) => { if (editAcc) updAcc(editAcc.id, d); else { addAcc(d as never); logActivity(`Added account: ${d.name}`, 'money', '/finance'); } setModal(null); }} onDelete={editAcc ? () => { if (confirm('Delete this account? Transactions stay, but will no longer adjust a balance.')) { rmAcc(editAcc.id); setModal(null); } } : undefined} />}
      {modal === 'transfer' && <TransferModal accounts={accounts} rates={rates} onClose={() => setModal(null)} />}
      {modal === 'goal' && (
        <Modal title="New savings plan" onClose={() => setModal(null)}>
          <form className="stack" onSubmit={(e) => { e.preventDefault(); const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>; if (!f.name.trim() || !(Number(f.target) > 0)) return; addGoal({ name: f.name.trim(), target: Number(f.target), saved: Number(f.saved) || 0, currency: f.currency, deadline: f.deadline || undefined } as never); logActivity(`Added savings plan: ${f.name.trim()}`, 'money', '/finance'); setModal(null); }}>
            <Field label="Name"><input className="input" name="name" autoFocus placeholder="Emergency fund" /></Field>
            <div className="formgrid"><Field label="Target"><input className="input" name="target" type="number" min="1" step="any" /></Field><Field label="Saved so far"><input className="input" name="saved" type="number" min="0" step="any" defaultValue={0} /></Field><Field label="Currency"><select className="select" name="currency" defaultValue={base}>{CURRENCIES.map((c) => <option key={c}>{c}</option>)}</select></Field><Field label="Deadline"><input className="input" type="date" name="deadline" /></Field></div>
            <div className="row" style={{ justifyContent: 'flex-end' }}><button type="button" className="btn" onClick={() => setModal(null)}>Cancel</button><button className="btn btn-primary">Save</button></div>
          </form>
        </Modal>
      )}
      {modal === 'bill' && (
        <Modal title="New bill" onClose={() => setModal(null)}>
          <form className="stack" onSubmit={(e) => { e.preventDefault(); const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>; if (!f.name.trim() || !f.due) return; addBill({ name: f.name.trim(), amount: Number(f.amount) || 0, currency: f.currency, due: f.due, recurring: f.recurring, paid: false } as never); setModal(null); }}>
            <Field label="Name"><input className="input" name="name" autoFocus /></Field>
            <div className="formgrid"><Field label="Amount"><input className="input" name="amount" type="number" step="any" min="0" /></Field><Field label="Currency"><select className="select" name="currency" defaultValue={base}>{CURRENCIES.map((c) => <option key={c}>{c}</option>)}</select></Field><Field label="Due"><input className="input" type="date" name="due" defaultValue={addDays(isoToday(), 7)} /></Field><Field label="Repeats"><select className="select" name="recurring"><option value="none">Once</option><option value="monthly">Monthly</option></select></Field></div>
            <div className="row" style={{ justifyContent: 'flex-end' }}><button type="button" className="btn" onClick={() => setModal(null)}>Cancel</button><button className="btn btn-primary">Save</button></div>
          </form>
        </Modal>
      )}
      <style>{`.fin-grid{display:grid;gap:16px;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr) minmax(0,1fr);grid-template-areas:"bal exp sav" "bal chart chart" "plan tx tx";align-items:start}
      @media(max-width:1000px){.fin-grid{grid-template-columns:1fr 1fr;grid-template-areas:"bal bal" "exp sav" "chart chart" "plan plan" "tx tx"}}
      @media(max-width:620px){.fin-grid{grid-template-columns:1fr;grid-template-areas:"bal" "exp" "sav" "chart" "plan" "tx"}}`}</style>
    </div>
  );
}

function AccountModal({ acc, onClose, onSave, onDelete }: { acc: Account | null; onClose: () => void; onSave: (d: Partial<Account>) => void; onDelete?: () => void }) {
  return (
    <Modal title={acc ? 'Edit account' : 'Add account'} onClose={onClose}>
      <form className="stack" onSubmit={(e) => { e.preventDefault(); const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>; if (!f.name.trim()) return; onSave({ name: f.name.trim(), currency: f.currency, kind: f.kind, balance: Number(f.balance) || 0, status: f.status, scope: f.scope }); }}>
        <Field label="Name"><input className="input" name="name" defaultValue={acc?.name} autoFocus placeholder="e.g. Main bank, Wise, Cash" /></Field>
        <div className="formgrid">
          <Field label="Currency"><select className="select" name="currency" defaultValue={acc?.currency ?? 'NGN'}>{CURRENCIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
          <Field label="Balance (actual)"><input className="input" name="balance" type="number" step="any" defaultValue={acc?.balance ?? 0} /></Field>
          <Field label="Type"><select className="select" name="kind" defaultValue={acc?.kind ?? 'Bank'}>{KINDS.map((k) => <option key={k}>{k}</option>)}</select></Field>
          <Field label="Status"><select className="select" name="status" defaultValue={acc?.status ?? 'active'}><option value="active">Active</option><option value="inactive">Inactive</option></select></Field>
          <Field label="Belongs to"><select className="select" name="scope" defaultValue={acc?.scope ?? 'personal'}><option value="personal">Personal</option><option value="business">Business</option></select></Field>
        </div>
        <p className="small muted" style={{ margin: 0 }}>Balances are entered by hand. Live bank and wallet links are a later phase.</p>
        <div className="row between">{onDelete ? <button type="button" className="btn btn-danger" onClick={onDelete}>Delete</button> : <span />}<div className="row"><button type="button" className="btn" onClick={onClose}>Cancel</button><button className="btn btn-primary">Save</button></div></div>
      </form>
    </Modal>
  );
}

function TransferModal({ accounts, rates, onClose }: { accounts: Account[]; rates: ReturnType<typeof useRates>['rates']; onClose: () => void }) {
  const [from, setFrom] = useState(accounts[0].id);
  const [to, setTo] = useState(accounts[1].id);
  const [amt, setAmt] = useState('');
  const [got, setGot] = useState('');
  const [err, setErr] = useState('');
  const a = accounts.find((x) => x.id === from)!, b = accounts.find((x) => x.id === to)!;
  const suggested = a && b && Number(amt) > 0 ? convert(Number(amt), a.currency, b.currency, rates) : null;
  return (
    <Modal title="Move between my pots" onClose={onClose}>
      <form className="stack" onSubmit={(e) => {
        e.preventDefault();
        if (from === to) return setErr('Choose two different accounts.');
        const out = Number(amt); const inn = Number(got || (suggested ?? (a.currency === b.currency ? amt : '')));
        if (!(out > 0) || !(inn > 0)) return setErr('Enter the amount sent and received.');
        const accts = readKey<Account[]>('accounts', []);
        writeKey('accounts', accts.map((x) => (x.id === from ? { ...x, balance: x.balance - out } : x.id === to ? { ...x, balance: x.balance + inn } : x)));
        logActivity(`Moved ${money(out, a.currency)} from ${a.name} to ${b.name}`, 'money', '/finance');
        onClose();
      }}>
        <div className="formgrid">
          <Field label="From"><select className="select" value={from} onChange={(e) => setFrom(e.target.value)}>{accounts.map((x) => <option key={x.id} value={x.id}>{x.name} ({x.currency})</option>)}</select></Field>
          <Field label="To"><select className="select" value={to} onChange={(e) => setTo(e.target.value)}>{accounts.map((x) => <option key={x.id} value={x.id}>{x.name} ({x.currency})</option>)}</select></Field>
          <Field label={`Amount sent (${a?.currency})`}><input className="input" type="number" step="any" min="0" value={amt} onChange={(e) => setAmt(e.target.value)} autoFocus /></Field>
          <Field label={`Amount received (${b?.currency})`}><input className="input" type="number" step="any" min="0" value={got} onChange={(e) => setGot(e.target.value)} placeholder={suggested ? suggested.toFixed(2) : ''} /></Field>
        </div>
        <p className="small muted" style={{ margin: 0 }}>This is a transfer, not income or spending, so it never affects your monthly totals. It records balances only and does not move real money.</p>
        {err && <p role="alert" style={{ color: 'var(--neg)', margin: 0 }}>{err}</p>}
        <div className="row" style={{ justifyContent: 'flex-end' }}><button type="button" className="btn" onClick={onClose}>Cancel</button><button className="btn btn-primary">Record transfer</button></div>
      </form>
    </Modal>
  );
}

function FxPanel({ base }: { base: string }) {
  const { rates, error, loading } = useRates();
  const [amt, setAmt] = useState('1');
  const [to, setTo] = useState(base === 'USD' ? 'NGN' : 'USD');
  const pairs = ['USD', 'GBP', 'EUR', 'CAD', 'GHS', 'ZAR'].filter((c) => c !== base).slice(0, 5);
  return (
    <section className="card">
      <div className="card-h"><h3>Exchange rates</h3><Tag>Live</Tag></div>
      {loading && <div className="muted small">Loading rates…</div>}
      {error && <Empty title="Rates unavailable">The rate feed did not respond. Try again shortly.</Empty>}
      {rates && (<>
        {pairs.map((c) => <div key={c} className="row between" style={{ padding: '7px 0', borderTop: '1px solid var(--line)' }}><span>1 {c}</span><b className="tnum" style={{ fontWeight: 500 }}>{convert(1, c, base, rates)?.toLocaleString('en-GB', { maximumFractionDigits: 2 })} {base}</b></div>)}
        <hr className="sep" />
        <div className="row"><input className="input" type="number" value={amt} onChange={(e) => setAmt(e.target.value)} aria-label="Amount" style={{ width: 100 }} /><span>{base} →</span><select className="select" value={to} onChange={(e) => setTo(e.target.value)} aria-label="Convert to" style={{ width: 90 }}>{CURRENCIES.filter((c) => c !== base).map((c) => <option key={c}>{c}</option>)}</select></div>
        <div className="big-num tnum" style={{ fontSize: 24, marginTop: 10 }}>{(convert(Number(amt) || 0, base, to, rates) ?? 0).toLocaleString('en-GB', { maximumFractionDigits: 2 })} {to}</div>
        <div className="small muted" style={{ marginTop: 6 }}>Source: open.er-api.com · updated {rates.updated.slice(0, 16)}</div>
      </>)}
    </section>
  );
}
