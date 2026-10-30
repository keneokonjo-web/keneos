'use client';
import { useEffect, useState } from 'react';

export default function HeroClock() {
  const [t, setT] = useState('');
  useEffect(() => {
    const f = () => setT(new Date().toLocaleTimeString('en-GB'));
    f();
    const id = setInterval(f, 1000);
    return () => clearInterval(id);
  }, []);
  return <div className="clock mono" suppressHydrationWarning>{t} [LOCAL]</div>;
}
