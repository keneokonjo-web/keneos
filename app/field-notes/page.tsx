import Link from 'next/link';
import Footer from '../_c/Footer';

export const metadata = { title: 'Field Notes' };

export default function FieldNotes() {
  return (
    <>
      <article className="ed">
        <header className="ed-h">
          <h1>Field Notes</h1>
          <div className="ed-meta mono"><span>An autobiography</span><span>Kene Okonjo</span><span>Founder, WayKON Group</span></div>
        </header>

        <section className="ed-lede">
          <p className="rv">I am Kene Okonjo. I own WayKON Group, I design the clothes I wear, and I photograph the places I travel to. This is the short version of how those things became one life.</p>
        </section>

        <section className="ed-sec">
          <div className="ed-k mono">I. The group</div>
          <div className="ed-t rv">
            <p>I started WayKON Group, and I own it. It is the parent company, the one name that sits over everything I build in business. I did not start it to look important. I started it because I wanted the things I make to stand on a single, consistent standard, whoever they are for.</p>
            <p>Under the group sit the companies. Fieldwork builds practical technology for estate agencies, brokerages and property developers. 42 Events is the events company. Each one is built on its own terms, with its own site and its own work to do, and the group is what holds them together.</p>
            <p><Link href="/work" className="ed-a">See the companies</Link></p>
          </div>
          <figure className="ed-f rv"><img src="/img/me-night.jpg" alt="Kene Okonjo at night" loading="eager" decoding="async" /><figcaption className="mono">Kene Okonjo</figcaption></figure>
        </section>

        <blockquote className="ed-q rv">Original by nature.</blockquote>

        <section className="ed-sec flip">
          <div className="ed-k mono">II. The clothes</div>
          <div className="ed-t rv">
            <p>I have always designed clothes for myself first. That is how DesignedByKJO started, and how its first collection, Character, was drawn: from what I wanted to wear and could not find anywhere.</p>
            <p>Every piece begins as a drawing of a person, not a product. A pinstripe jacket, a camo trouser, a wide grey trouser, a silver beanie. The figures are painted in watercolour, and the clothes are made to be worn by someone who already has a point of view.</p>
            <p><Link href="/designedbykjo" className="ed-a">See the clothing</Link></p>
          </div>
          <figure className="ed-f rv"><img src="/img/ed-char.png" alt="Character, watercolour figure" loading="eager" decoding="async" className="ed-c" /><figcaption className="mono">Character, collection 001</figcaption></figure>
        </section>

        <section className="ed-sec">
          <div className="ed-k mono">III. The photographs</div>
          <div className="ed-t rv">
            <p>Photography is the oldest of the habits. I have taken it to Egypt, Vietnam, Nigeria and the United Arab Emirates, and I keep coming back to the same idea: photography is overlooked because the simplest things can be captured in such an amazing way.</p>
            <p>A cup on a stool, a pair of shutters, a camel crossing sand, a sail on the water. I am not looking for the monument. I am looking for the ordinary thing that, framed properly, tells you exactly where you were.</p>
            <p><Link href="/visuals" className="ed-a">See the visuals</Link></p>
          </div>
          <figure className="ed-f rv"><img src="/img/v-camel.jpg" alt="A camel in Egypt" loading="eager" decoding="async" /><figcaption className="mono">Egypt</figcaption></figure>
        </section>

        <section className="ed-sec flip">
          <div className="ed-k mono">IV. The taste</div>
          <div className="ed-t rv">
            <p>What I make comes out of what I take in. Asake is my favourite artist, and all four of his albums are tens to me. The Odyssey, Inglourious Basterds and Dune are the three films I keep returning to.</p>
            <p>None of it is a coincidence. I like work that is sure of itself, and I try to build the same way.</p>
            <p><Link href="/lookbook" className="ed-a">See the lookbook</Link></p>
          </div>
          <figure className="ed-f rv"><img src="/img/p-0685.jpg" alt="" loading="eager" decoding="async" /><figcaption className="mono">Nigeria</figcaption></figure>
        </section>

        <section className="ed-end rv">
          <p>That is the whole of it. A group, a clothing line, a camera, and a standard I try to keep. More to come.</p>
          <span className="mono">Kene Okonjo</span>
        </section>
      </article>
      <Footer />
    </>
  );
}
