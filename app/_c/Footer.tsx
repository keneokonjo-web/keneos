import Link from 'next/link';
import { brand, pages } from '@/content/site';

export default function Footer({ light = false }: { light?: boolean }) {
  return (
    <footer className={'foot' + (light ? ' light' : '')}>
      <div className="top">
        <div className="mono">{brand.tagline}</div>
        <div className="mono" style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {pages.map((p) => (<Link key={p.slug} href={'/' + p.slug}>{p.title}</Link>))}
        </div>
        <div className="mono">{brand.email ? <a href={'mailto:' + brand.email}>{brand.email}</a> : 'Contact: to be added'}</div>
      </div>
      <div className="big2"><img src={light ? '/mark/designedbykjo-hd-black.png' : '/mark/designedbykjo-hd-white.png'} alt="DesignedByKJO" /></div>
      <div className="bot mono"><span>© {new Date().getFullYear()} KJO</span><span>Index · Archive · Signature</span></div>
    </footer>
  );
}
