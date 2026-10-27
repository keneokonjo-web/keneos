'use client';
import { Star, X } from 'lucide-react';
import { useEffect } from 'react';

export function Stars({ value, onChange, size = 16 }: { value: number; onChange?: (n: number) => void; size?: number }) {
  return (
    <span className="stars" role={onChange ? 'radiogroup' : 'img'} aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" className={n <= value ? 'on' : ''} disabled={!onChange} onClick={() => onChange?.(n === value ? 0 : n)} aria-label={`${n} star`}>
          <Star size={size} fill={n <= value ? 'currentColor' : 'none'} />
        </button>
      ))}
    </span>
  );
}

export function Tabs<T extends string>({ value, onChange, items }: { value: T; onChange: (v: T) => void; items: { id: T; label: string }[] }) {
  return (
    <div className="tabs" role="tablist">
      {items.map((i) => (
        <button key={i.id} role="tab" className="tab" aria-selected={value === i.id} onClick={() => onChange(i.id)}>
          {i.label}
        </button>
      ))}
    </div>
  );
}

export function Empty({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="empty">
      <b>{title}</b>
      {children}
    </div>
  );
}

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <div className="modal-wrap" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="card-h">
          <h3 style={{ fontSize: 16 }}>{title}</h3>
          <button className="iconbtn" onClick={onClose} aria-label="Close"><X size={16} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function PageHead({ eyebrow, title, sub, actions }: { eyebrow?: string; title: string; sub?: string; actions?: React.ReactNode }) {
  return (
    <header className="page-head">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1 className="display">{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
      {actions && <div className="row wrap">{actions}</div>}
    </header>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}

export function openPalette() { window.dispatchEvent(new CustomEvent('kos:palette')); }
export function openQuickAdd(type?: string) { window.dispatchEvent(new CustomEvent('kos:quickadd', { detail: { type } })); }
