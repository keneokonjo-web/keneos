'use client';
import { useEffect, useState } from 'react';

// A new picture every 0.7s, hard cuts. The word across the middle is a difference blend, so it re-colours itself on every cut.
export default function ProjectsHero({ images }: { images: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % images.length), 700);
    return () => clearInterval(id);
  }, [images.length]);
  return (
    <section className="ph-hero" aria-label="Projects">
      {images.map((s, k) => (<img key={s} src={`/img/${s}.jpg`} alt="" decoding="sync" className={k === i ? 'on' : ''} />))}
      <h1>Projects</h1>
      <div className="cap mono"><span>Experiments, indexes and case files</span><span>Scroll</span></div>
    </section>
  );
}
