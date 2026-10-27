'use client';
import { useState } from 'react';

export type Bar = { label: string; value: number };
export function BarChart({ data, format, height = 230, accent = '#f3f1ea' }: { data: Bar[]; format: (n: number) => string; height?: number; accent?: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.value));
  const W = 640, padL = 8, padB = 26, padT = 18;
  const bw = (W - padL) / data.length;
  const ticks = [0, 0.5, 1];
  return (
    <div style={{ position: 'relative' }}>
      <svg viewBox={`0 0 ${W} ${height}`} width="100%" role="img" aria-label="Bar chart" onMouseLeave={() => setHover(null)}>
        {ticks.map((t) => <line key={t} x1={0} x2={W} y1={padT + (height - padB - padT) * (1 - t)} y2={padT + (height - padB - padT) * (1 - t)} stroke="currentColor" strokeOpacity={0.08} strokeDasharray="3 4" />)}
        {data.map((d, i) => {
          const h = ((height - padB - padT) * d.value) / max;
          const x = padL + i * bw + bw * 0.14;
          const w = bw * 0.72;
          const y = height - padB - h;
          return (
            <g key={d.label} onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)} tabIndex={0} aria-label={`${d.label}: ${format(d.value)}`}>
              <rect x={x - 2} y={0} width={w + 4} height={height - padB} fill="transparent" />
              <rect x={x} y={d.value > 0 ? y : height - padB - 3} width={w} height={d.value > 0 ? Math.max(h, 3) : 3} rx={6} fill={hover === i ? accent : 'currentColor'} fillOpacity={hover === i ? 1 : d.value > 0 ? 0.22 : 0.08} />
              <text x={x + w / 2} y={height - 8} textAnchor="middle" fontSize={11} fill="currentColor" fillOpacity={0.55}>{d.label}</text>
            </g>
          );
        })}
      </svg>
      {hover !== null && (
        <div style={{ position: 'absolute', left: `${((padL + hover * bw + bw / 2) / W) * 100}%`, top: 0, transform: 'translate(-50%, -4px)', background: 'var(--surface-3)', border: '1px solid var(--line-strong)', borderRadius: 10, padding: '6px 10px', fontSize: 12, pointerEvents: 'none', whiteSpace: 'nowrap' }}>
          <div className="muted">{data[hover].label}</div><b className="tnum">{format(data[hover].value)}</b>
        </div>
      )}
    </div>
  );
}
