export function isoToday(d = new Date()) {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}
export function addDays(iso: string, n: number) {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return isoToday(d);
}
export function daysUntil(iso?: string) {
  if (!iso) return null;
  const a = new Date(isoToday() + 'T00:00:00').getTime();
  const b = new Date(iso + 'T00:00:00').getTime();
  return Math.round((b - a) / 86400000);
}
export function fmtDate(iso?: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }) {
  if (!iso) return '';
  return new Date(iso.length === 10 ? iso + 'T00:00:00' : iso).toLocaleDateString('en-GB', opts);
}
export function relTime(iso: string) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return 'Just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} hr ago`;
  if (s < 86400 * 7) return `${Math.floor(s / 86400)} d ago`;
  return fmtDate(iso);
}
export function startOfWeek(iso = isoToday()) {
  const d = new Date(iso + 'T00:00:00');
  const dow = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - dow);
  return isoToday(d);
}
export function dueLabel(iso?: string) {
  const n = daysUntil(iso);
  if (n === null) return '';
  if (n < 0) return `${-n}d overdue`;
  if (n === 0) return 'Today';
  if (n === 1) return 'Tomorrow';
  return `In ${n}d`;
}
