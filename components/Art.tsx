'use client';
import { useEffect, useRef, useState } from 'react';

// Generated placeholder artwork (dark architectural studies). Shown wherever a photo in
// /public/images has not been supplied yet.
export function Art({ variant = 'cantilever', tone = 'dark' }: { variant?: string; tone?: 'dark' | 'light' }) {
  const id = `g${variant}${tone}`;
  const sky = tone === 'dark' ? ['#9a99a0', '#4d4c52'] : ['#e4e2dc', '#b9b6ad'];
  if (variant === 'cantilever') {
    return (
      <svg viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <linearGradient id={id + 's'} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={sky[0]} /><stop offset="1" stopColor={sky[1]} /></linearGradient>
          <linearGradient id={id + 'g'} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3d5330" /><stop offset="1" stopColor="#16200f" /></linearGradient>
          <pattern id={id + 'p'} width="9" height="40" patternUnits="userSpaceOnUse"><rect width="3" height="40" fill="#0b0b0c" /></pattern>
        </defs>
        <rect width="600" height="800" fill={`url(#${id}s)`} />
        <polygon points="0,260 560,0 600,0 600,40 0,330" fill="#08080a" />
        <rect x="120" y="300" width="480" height="150" fill={`url(#${id}p)`} opacity=".92" />
        <polygon points="0,330 600,40 600,60 0,350" fill="#0b0b0d" />
        <rect x="120" y="450" width="480" height="230" fill="#161618" />
        <rect x="210" y="450" width="70" height="330" fill="#101012" />
        <path d="M0 640 Q250 560 600 520 L600 800 L0 800Z" fill={`url(#${id}g)`} />
        <rect width="600" height="800" fill="#000" opacity=".12" />
      </svg>
    );
  }
  if (variant === 'monolith') {
    return (
      <svg viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <rect width="600" height="800" fill={tone === 'dark' ? '#17171a' : '#d9d6cd'} />
        <rect x="90" y="120" width="190" height="560" fill={tone === 'dark' ? '#0b0b0d' : '#2a2a2b'} />
        <rect x="280" y="260" width="240" height="420" fill={tone === 'dark' ? '#242427' : '#bdb9ae'} />
        <rect x="280" y="260" width="240" height="14" fill={tone === 'dark' ? '#3a3a3e' : '#f4f2ec'} />
        <rect x="0" y="680" width="600" height="120" fill={tone === 'dark' ? '#050506' : '#a9a59a'} />
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x={300 + i * 18} y="300" width="3" height="340" fill={tone === 'dark' ? '#08080a' : '#8b887f'} />
        ))}
      </svg>
    );
  }
  // terrain: soft braided contours, in the spirit of aerial landscape photography
  return (
    <svg viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id={id + 't'} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6f7a77" /><stop offset=".55" stopColor="#2a2d2c" /><stop offset="1" stopColor="#7a5d27" /></linearGradient>
      </defs>
      <rect width="600" height="800" fill={`url(#${id}t)`} />
      {Array.from({ length: 22 }).map((_, i) => (
        <path key={i} d={`M-20 ${i * 40} C 150 ${i * 40 - 70}, 300 ${i * 40 + 90}, 640 ${i * 40 - 30}`} fill="none" stroke="#e9e6dc" strokeOpacity={0.06 + (i % 4) * 0.02} strokeWidth={1.2 + (i % 3)} />
      ))}
    </svg>
  );
}

export function Photo({ src, variant, tone, className, children, style }: { src?: string; variant?: string; tone?: 'dark' | 'light'; className?: string; children?: React.ReactNode; style?: React.CSSProperties }) {
  const [failed, setFailed] = useState(!src);
  const img = useRef<HTMLImageElement>(null);
  // the image can fail before React hydrates, so check again once mounted
  useEffect(() => { const el = img.current; if (el && el.complete && el.naturalWidth === 0) setFailed(true); }, []);
  return (
    <div className={`photo ${className ?? ''}`} style={style}>
      {failed ? <Art variant={variant} tone={tone} /> : <img ref={img} src={src} alt="" onError={() => setFailed(true)} />}
      {children}
    </div>
  );
}
