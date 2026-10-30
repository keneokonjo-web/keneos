import Link from 'next/link';
import { brand, pages } from '@/content/site';

export default function Footer({ dark = false }: { dark?: boolean }) {
  return (
    <footer className={'foot' + (dark ? ' dark' : ' light')}>
      <div className="top">
        <div className="mono">{brand.tagline}</div>
        <div className="mono" style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {pages.map((p) => (<Link key={p.slug} href={'/' + p.slug}>{p.title}</Link>))}
        </div>
        <div className="c3">
          <div className="mono">{brand.email ? <a href={'mailto:' + brand.email}>{brand.email}</a> : 'Contact: to be added'}</div>
          <img className="ic" src={dark ? '/mark/crescent-white.png' : '/mark/crescent-black.png'} alt="" />
        </div>
      </div>
      <div className="big2"><img src={dark ? '/mark/designedbykjo-hd-white.png' : '/mark/designedbykjo-hd-black.png'} alt="DesignedByKJO" /></div>
      <div className="bot mono"><span>© {new Date().getFullYear()} KJO</span><span>Index · Archive · Signature</span></div>
    </footer>
  );
}
