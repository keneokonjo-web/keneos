'use client';
import { useEffect, useState } from 'react';

const chars = ['/img/char-1.png', '/img/char-2.png', '/img/char-3.png'];

export default function DHero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % chars.length), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <section className="dh-hero" aria-label="DesignedByKJO">
      <h1 className="sr">DesignedByKJO. Begin by choosing.</h1>
      <div className="chars">{chars.map((s, k) => (<img key={s} src={s} alt="" className={k === i ? 'on' : ''} />))}</div>
      <div className="jp" aria-hidden="true" lang="ja">
        <span className="c1">選んで始まる。</span>
        <span className="c2">選んで始まる。</span>
        <span className="c3">始まる。</span>
      </div>
      <div className="cap"><span>Begin by choosing</span><img src="/mark/character-logo-black.png" alt="Character" /></div>
    </section>
  );
}
