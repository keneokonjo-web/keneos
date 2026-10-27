'use client';
import { useEffect, useRef } from 'react';

export type OrbState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';

// White particle sphere. Motion is driven by `state` and by `level` (0..1, live mic or voice
// amplitude). Points sit on a sphere, nearest neighbours are joined by faint lines, and the
// whole shape breathes, swirls or pulses depending on what the assistant is doing.
const N = 820;
type Pt = { x: number; y: number; z: number; ph: number };

function build() {
  const pts: Pt[] = [];
  const g = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = g * i;
    pts.push({ x: Math.cos(th) * r, y, z: Math.sin(th) * r, ph: Math.random() * Math.PI * 2 });
  }
  const links: [number, number][] = [];
  const seen = new Set<number>();
  for (let i = 0; i < N; i++) {
    const d: [number, number][] = [];
    for (let j = 0; j < N; j++) {
      if (i === j) continue;
      const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, dz = pts[i].z - pts[j].z;
      d.push([dx * dx + dy * dy + dz * dz, j]);
    }
    d.sort((a, b) => a[0] - b[0]);
    for (let k = 0; k < 2; k++) {
      const j = d[k][1];
      const key = Math.min(i, j) * N + Math.max(i, j);
      if (!seen.has(key)) { seen.add(key); links.push([i, j]); }
    }
  }
  return { pts, links };
}

const TARGET: Record<OrbState, { speed: number; amp: number; swirl: number; alpha: number }> = {
  idle: { speed: 0.0016, amp: 0.025, swirl: 0, alpha: 0.85 },
  listening: { speed: 0.0028, amp: 0.05, swirl: 0, alpha: 1 },
  thinking: { speed: 0.009, amp: 0.045, swirl: 1, alpha: 1 },
  speaking: { speed: 0.003, amp: 0.06, swirl: 0, alpha: 1 },
  error: { speed: 0.0008, amp: 0.09, swirl: 0, alpha: 0.5 },
};

export function Orb({ state, level = 0 }: { state: OrbState; level?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const live = useRef({ state, level });
  live.current = { state, level };

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const { pts, links } = build();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, raf = 0, angle = 0, t = 0;
    const cur = { speed: 0.0016, amp: 0.025, swirl: 0, alpha: 0.85, lvl: 0 };
    const proj = new Float32Array(N * 3);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (document.hidden) return;
      const { state: st, level: lv } = live.current;
      const tg = TARGET[st];
      const k = 0.06;
      cur.speed += (tg.speed - cur.speed) * k;
      cur.amp += (tg.amp - cur.amp) * k;
      cur.swirl += (tg.swirl - cur.swirl) * k;
      cur.alpha += (tg.alpha - cur.alpha) * k;
      // speaking with no real audio level gets a soft synthetic envelope
      const synth = st === 'speaking' ? 0.45 + 0.35 * Math.sin(t * 7) * Math.sin(t * 2.3) : 0;
      cur.lvl += ((st === 'speaking' ? Math.max(lv, synth) : lv) - cur.lvl) * 0.25;
      t += 0.016;
      if (!reduce) angle += cur.speed * 16;

      ctx.clearRect(0, 0, w, h);
      const R = Math.min(w, h) * 0.36;
      const cx = w / 2, cy = h / 2;
      const cosA = Math.cos(angle), sinA = Math.sin(angle);
      const tilt = 0.35, cosT = Math.cos(tilt), sinT = Math.sin(tilt);
      const pulse = cur.amp + cur.lvl * 0.22;

      const halo = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.5);
      halo.addColorStop(0, `rgba(255,255,255,${0.07 + cur.lvl * 0.1})`);
      halo.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < N; i++) {
        const p = pts[i];
        const wob = reduce ? 0 : Math.sin(t * 2 + p.ph * 3 + p.y * 4) * pulse + (cur.swirl ? Math.sin(t * 5 + p.x * 6) * 0.04 * cur.swirl : 0);
        const rr = 1 + wob;
        let x = p.x * rr, y = p.y * rr, z = p.z * rr;
        const x1 = x * cosA + z * sinA, z1 = -x * sinA + z * cosA;
        const y2 = y * cosT - z1 * sinT, z2 = y * sinT + z1 * cosT;
        const persp = 2.6 / (2.6 - z2);
        proj[i * 3] = cx + x1 * R * persp;
        proj[i * 3 + 1] = cy + y2 * R * persp;
        proj[i * 3 + 2] = z2;
      }

      ctx.lineWidth = 0.6;
      for (const [a, b] of links) {
        const z = (proj[a * 3 + 2] + proj[b * 3 + 2]) / 2;
        const al = (0.04 + (z + 1) * 0.11) * cur.alpha;
        ctx.strokeStyle = `rgba(255,255,255,${al})`;
        ctx.beginPath();
        ctx.moveTo(proj[a * 3], proj[a * 3 + 1]);
        ctx.lineTo(proj[b * 3], proj[b * 3 + 1]);
        ctx.stroke();
      }
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < N; i++) {
        const z = proj[i * 3 + 2];
        const d = (z + 1) / 2;
        const size = (0.6 + d * 1.7) * (1 + cur.lvl * 0.5);
        ctx.fillStyle = `rgba(255,255,255,${(0.18 + d * 0.8) * cur.alpha})`;
        ctx.beginPath();
        ctx.arc(proj[i * 3], proj[i * 3 + 1], size, 0, 6.283);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    };
    frame();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return <canvas ref={ref} style={{ width: '100%', height: '100%', display: 'block' }} aria-hidden />;
}
