'use client';
import { useEffect, useState } from 'react';

export default function HeroSlides({ photos }: { photos: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (photos.length < 2) return;
    const id = setInterval(() => setI((v) => (v + 1) % photos.length), 4500);
    return () => clearInterval(id);
  }, [photos.length]);
  return (
    <div className="bg">
      {photos.map((p, k) => (<img key={p} src={`/img/${p}.jpg`} alt="" className={k === i ? 'on' : ''} />))}
      {photos.length > 1 && <div className="ctr">{String(i + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}</div>}
    </div>
  );
}
