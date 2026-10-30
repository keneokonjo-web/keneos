const cards = [
  { src: '/img/char-1.png', kind: 'ch', name: 'Character 001' },
  { src: '/img/f-side.jpg', kind: 'ph', name: 'Subject 002' },
  { src: '/img/char-2.png', kind: 'ch', name: 'Character 003' },
  { src: '/img/f-front.jpg', kind: 'ph', name: 'Subject 004' },
  { src: '/img/char-3.png', kind: 'ch', name: 'Character 005' },
  { src: '/img/f-three.jpg', kind: 'ph', name: 'Subject 006' },
  { src: '/img/p-0700.jpg', kind: 'ph', name: 'Subject 007' },
];

export default function YouthArchive() {
  return (
    <section className="ya" aria-label="Archive">
      <div className="ya-top">
        <h2><span>—DESIGNEDBYKJO ARCHIVE</span><span>THE RULE: ORIGINAL ONLY<sup>®</sup></span></h2>
        <p>THROUGH THIS ARCHIVE WE WANT TO SHOW THE ENDLESS RANGE OF CHARACTER, WHILE HONOURING THE INDIVIDUAL STYLE OF EACH PERSON IN IT. TEXT TO BE REPLACED.</p>
      </div>
      <div className="ya-row">
        {cards.map((c, i) => (
          <article key={i} className="ya-card">
            <div className={'ya-ph ' + c.kind}><img src={c.src} alt={c.kind === 'ch' ? 'Watercolour illustration' : ''} loading="lazy" /></div>
            <label>Name</label><div className="f">{c.name}</div>
            <label>Age</label><div className="f">00</div>
            <label>Ig</label><div className="f">@handle</div>
            <label>Original/100</label><div className="f">100</div>
            <div className="mk"><img src="/mark/cross-fleur-black.png" alt="" /><span>KJO</span></div>
          </article>
        ))}
      </div>
    </section>
  );
}
