import Link from 'next/link';
import HeroClock from './_c/HeroClock';
import HeroSlides from './_c/HeroSlides';
import { heroLight, heroPhotos } from '@/content/site';

const mobileLinks = [
  { href: '/visuals', label: 'Visuals' },
  { href: '/field-notes', label: 'Field Notes' },
  { href: '/designedbykjo', label: 'Clothing' },
  { href: '/projects', label: 'Projects' },
];

export default function Home() {
  return (
    <>
      {/* The home page is the hero. It does not scroll. */}
      <section className="hero" aria-label="Introduction">
        <HeroSlides photos={heroPhotos} light={heroLight} />
        <div className="kjo"><img src="/mark/cross-fleur-white.png" alt="" /><span>KJO</span></div>
        <HeroClock />
        <div className="rbox"><span>Character, collection 001. Not yet released</span><span>[X]</span></div>
      </section>

      {/* Mobile hero: three stacked pictures, fixed to one screen, page links in the middle */}
      <section className="hero-m" aria-label="Pages">
        <img src="/img/p-0685.jpg" alt="" />
        <img src="/img/p-0680.jpg" alt="" />
        <img src="/img/p-0700.jpg" alt="" />
        <nav className="hm-links" aria-label="Pages">
          {mobileLinks.map((l) => (<Link key={l.href} href={l.href}>{l.label}</Link>))}
        </nav>
      </section>
    </>
  );
}
