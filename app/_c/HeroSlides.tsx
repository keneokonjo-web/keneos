'use client';
import { useEffect, useState } from 'react';

// Hard cuts, no fades. Every image is mounted up front so nothing has to load or decode at the moment of a cut.
export default function HeroSlides({ photos, light = [] }: { photos: string[]; light?: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (photos.length < 2) return;
    const id = setInterval(() => setI((v) => (v + 1) % photos.length), 4000);
    return () => clearInterval(id);
  }, [photos.length]);
  useEffect(() => {
    document.documentElement.classList.toggle('hero-light', light.includes(photos[i]));
    return () => { document.documentElement.classList.remove('hero-light'); };
  }, [i, photos, light]);
  return (
    <div className="bg">
      {photos.map((p, k) => (<img key={p} src={`/img/${p}.jpg`} alt="" decoding="sync" className={(k === i ? 'on' : '') + (light.includes(p) ? ' light' : '')} />))}
    </div>
  );
}
