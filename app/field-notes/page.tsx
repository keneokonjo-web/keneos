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


        <section className="ed-sec">
          <div className="ed-k mono">I. The group</div>
          <div className="ed-t rv">
            <p>I started WayKON Group, and I own it. It is the parent company, the one name that sits over everything I build in business. I started it because I wanted the things I make to stand on a single, consistent standard, whoever they are for.</p>
            <p>Under the group sit the companies. Fieldwork builds practical technology for estate agencies, brokerages and property developers. 42 Events is the events company. Each one is built on its own terms, with its own site and its own work to do, and the group is what holds them together.</p>
            <p><Link href="/work" className="ed-a">See the companies</Link></p>
          </div>
          <figure className="ed-f rv"><img src="/img/me-night.jpg" alt="Kene Okonjo at night" loading="eager" decoding="async" /><figcaption className="mono">Kene Okonjo</figcaption></figure>
        </section>


        <section className="ed-sec flip">
          <div className="ed-k mono">II. The clothes</div>
          <div className="ed-t rv">
            <p>I design clothes for myself and nobody else. That is how DesignedByKJO started, and how its first collection, Character, was drawn: from what I wanted to wear and could not find anywhere.</p>
            <p>Every piece begins as a watercolour drawing, and the work is more concept-based than anything else. The clothes are tailored to my style, and they will continue to be tailored to my style until I feel like changing that.</p>
            <p><Link href="/designedbykjo" className="ed-a">See the clothing</Link></p>
          </div>
          <figure className="ed-f rv"><img src="/img/ed-char.png" alt="Character, watercolour figure" loading="eager" decoding="async" className="ed-c" /><figcaption className="mono">Character, collection 001</figcaption></figure>
        </section>

        <section className="ed-sec">
          <div className="ed-k mono">III. The photographs</div>
          <div className="ed-t rv">
            <p>Photography is the oldest of the habits. I have taken it to Egypt, Vietnam, China and the United Arab Emirates, and I keep coming back to the same idea: photography is the key to happiness.</p>
            <p>A cup on a stool, a pair of shutters, a camel crossing sand, a sail on the water. I am not looking for the monument. I am looking for the ordinary thing that may change someone's perspective on the significance of good photography.</p>
            <p><Link href="/visuals" className="ed-a">See the visuals</Link></p>
          </div>
          <figure className="ed-f rv"><img src="/img/v-camel.jpg" alt="A camel in Egypt" loading="eager" decoding="async" /><figcaption className="mono">Egypt</figcaption></figure>
        </section>

        <section className="ed-sec flip">
          <div className="ed-k mono">IV. The taste</div>
          <div className="ed-t rv">
            <p>What I make comes out of what I take in. Asake is my favourite artist. The Odyssey, Inglourious Basterds and Dune are the three films I keep returning to.</p>
            <p>None of it is a coincidence. I like work that is sure of itself, and I try to build the same way.</p>
            <p><Link href="/lookbook" className="ed-a">See the lookbook</Link></p>
          </div>
          <figure className="ed-f rv"><img src="/img/p-0685.jpg" alt="" loading="eager" decoding="async" /></figure>
        </section>

        <section className="ed-end rv">
          <p>That is the whole of it. A group of companies, custom clothing, a camera, and a standard I try to keep. More to come.</p>
          <span className="mono">Kene Okonjo</span>
        </section>
      </article>
      <Footer />
    </>
  );
}
