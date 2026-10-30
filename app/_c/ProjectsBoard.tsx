'use client';
import { useEffect, useState } from 'react';

// One unit = 1% of the board width. Everything on the board is sized in these units so it scales as one picture.
const u = (n: number) => `calc(var(--u) * ${n})`;
const pos = (x: number, y: number, w: number, h: number, r = 0): React.CSSProperties =>
  ({ left: u(x), top: u(y), width: u(w), height: u(h), ['--r' as string]: `${r}deg` });

const Bar = ({ w = 8 }: { w?: number }) => <div className="bar" style={{ width: u(w), height: u(1.6) }} />;
const Fp = () => <div className="fp" />;

export default function ProjectsBoard() {
  const [open, setOpen] = useState<string | null>(null);
  const [tf, setTf] = useState('');

  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null);
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, []);

  const toggle = (id: string, el: HTMLElement) => {
    if (open === id) { setOpen(null); return; }
    const r = el.getBoundingClientRect();
    const vw = window.innerWidth, vh = window.innerHeight;
    const s = Math.min((vh * 0.8) / r.height, (vw * 0.72) / r.width, 4.4);
    setTf(`translate(${vw / 2 - (r.left + r.width / 2)}px, ${vh / 2 - (r.top + r.height / 2)}px) scale(${s})`);
    setOpen(id);
  };

  const doc = (id: string, label: string, cls: string, style: React.CSSProperties, children: React.ReactNode) => (
    <div
      key={id} role="button" tabIndex={0} aria-label={`${label}. Click to enlarge.`}
      className={`doc ${cls}${open === id ? ' open' : ''}`}
      style={open === id ? { ...style, transform: tf } : style}
      onClick={(e) => toggle(id, e.currentTarget)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(id, e.currentTarget); } }}
    >{children}</div>
  );

  return (
    <div className="pj">
      {open && <div className="pj-ov" onClick={() => setOpen(null)} aria-hidden="true" />}
      <div className="pj-scroll">
        <div className="board">

          {/* kraft folder behind the case file */}
          <div className="doc static kraft" style={pos(1.2, 3, 30, 34, -1.2)}><div className="tab" /><div className="clip" /></div>

          {/* CASE FILE */}
          {doc('case', 'Case file', 'paper', pos(3, 4.5, 25, 32, 1), <>
            <div className="cf-h">
              <img className="crest" src="/mark/cross-fleur-black.png" alt="" />
              <div><b>OFFICE OF RECORDS</b><b>DESIGNEDBYKJO</b></div>
              <div className="cf-no"><i>CASE FILE NO. K-0001</i><i>PURPOSE CODE P-1014</i><i>REF. ORIGINAL BY NATURE</i></div>
            </div>
            <div className="cf-b">
              <div className="ph3">
                <img className="big" src="/img/f-three.jpg" alt="" />
                <img className="s1" src="/img/f-side.jpg" alt="" />
                <img className="s2" src="/img/f-front.jpg" alt="" />
              </div>
              <div className="cf-r">
                <div className="sj"><b>SUBJECT: KENE O.<br />(KJO)</b></div>
                <div className="fpg"><span>FINGERPRINT</span><div><Fp /><Fp /><Fp /><Fp /><Fp /><Fp /></div></div>
              </div>
            </div>
            <div className="cf-d">
              <b>DESCRIPTION</b>
              <table><tbody>
                <tr><td>Date of Birth:</td><td>Withheld</td><td>Hair:</td><td>On file</td></tr>
                <tr><td>Place of Birth:</td><td>Withheld</td><td>Eyes:</td><td>On file</td></tr>
                <tr><td>Height:</td><td>On file</td><td>Build:</td><td>On file</td></tr>
                <tr><td>Occupation:</td><td>Photographer</td><td>Remarks:</td><td>None</td></tr>
                <tr><td>Scars and Marks:</td><td>None</td><td>Status:</td><td>At large</td></tr>
              </tbody></table>
              <div className="sg"><span>Signature</span><em>Kene O.</em></div>
              <div className="dt"><span>Date</span><em>2026</em></div>
            </div>
          </>)}

          {/* ID PHOTO sheet */}
          {doc('idsheet', 'ID photo sheet', 'paper', pos(33, 2, 22, 24, 0.6), <>
            <b className="idh">ID PHOTO</b>
            <span className="small">ISSUING AUTHORITY<br />DesignedByKJO Office of Records</span>
            <div className="ids">
              <div className="grid">{[0, 1, 2, 3, 4, 5, 6, 7].map((k) => (<img key={k} src={k % 2 ? '/img/f-front.jpg' : '/img/f-three.jpg'} alt="" />))}</div>
              <img className="lg" src="/img/f-front.jpg" alt="" />
            </div>
            <div className="idf"><span>KJO NO.1</span><Bar w={9} /></div>
          </>)}

          {/* WANTED poster */}
          {doc('wanted', 'Wanted poster', 'paper wanted', pos(56, 2.2, 23.5, 33.8, -0.8), <>
            <div className="wh"><span>Issued by DesignedByKJO Office of Records</span><span>OCTOBER 2026</span></div>
            <b className="wt">WANTED BY KJO</b>
            <div className="wp"><figure><img src="/img/f-front.jpg" alt="" /><figcaption>Front-facing portrait</figcaption></figure><figure><img src="/img/f-side.jpg" alt="" /><figcaption>Side-facing portrait</figcaption></figure></div>
            <div className="wdesc">
              <p><b>NAME:</b> Kene O. <b>ALIASES:</b> KJO. <b>HEIGHT:</b> On file. <b>IDENTIFYING FEATURES:</b> Often found behind a lens.</p>
              <p><b>THREAT ASSESSMENT</b><br />EXTREME. Considered armed with an unusually original eye. Do not approach with a template.</p>
              <p><b>CHARGES</b><br />Disorderly originality. Possession of a signature. Distinction in the first degree.</p>
              <p><b>INSTRUCTIONS TO THE PUBLIC</b><br />If you have information regarding this individual, you are advised to look twice.</p>
            </div>
            <img className="seal" src="/mark/cross-fleur-black.png" alt="" />
          </>)}

          {/* Envelope with stamps */}
          <div className="doc static kraft env" style={pos(81, 2.6, 18, 12.5, 2.5)}>
            <span className="stamp">CLASSIFIED</span><span className="addr">TO: THE PUBLIC<br />FROM: DESIGNEDBYKJO</span>
          </div>

          {/* Black ID card (back) */}
          {doc('idback', 'ID card, back', 'black', pos(81.5, 17.4, 17.5, 11.2, -1.2), <>
            <i>ISSUING AUTHORITY</i><b>DesignedByKJO</b><em>Original by Nature Company</em><span className="mag" />
          </>)}

          {/* white ID card */}
          {doc('idfront', 'ID card, front', 'paper card', pos(33, 28.8, 16.5, 10.4, -1.4), <>
            <div className="ct"><b>KJO</b><span>Original by Nature</span></div>
            <div className="cb"><img src="/img/f-front.jpg" alt="" /><div><i>Name: Kene O.</i><i>Alias: KJO</i><i>Status: Active</i><i>Index: K-0001</i></div></div>
            <Bar w={7} /><em className="cs">Kene O.</em>
          </>)}

          {/* polaroids */}
          {doc('eye', 'Polaroid, eye', 'polaroid', pos(3.2, 38.5, 11.8, 14.6, -2.5), <><img src="/img/f-eye.jpg" alt="" /><em>Classified</em></>)}
          {doc('pid', 'Polaroid, positive ID', 'polaroid', pos(13, 40.2, 11.8, 14.6, 2.2), <><img src="/img/f-eye2.jpg" alt="" /><em className="circle">Positive ID</em></>)}

          {/* passport cover */}
          {doc('cover', 'Passport cover', 'black cover', pos(25.5, 37, 12.6, 18, -3), <>
            <b>PASSPORT</b><img src="/mark/cross-fleur-white.png" alt="" /><i>DESIGNEDBYKJO</i><span>ORIGINAL BY NATURE</span><span className="chip" />
          </>)}

          {/* open passport */}
          {doc('passport', 'Open passport', 'paper pass', pos(39, 38.6, 31, 16.6, 1), <>
            <div className="pl">
              <i>The passport contains 32 pages</i>
              <b>PASSPORTI<br /><em>PASSPORT</em></b>
              <small>DESIGNEDBYKJO · ORIGINAL BY NATURE</small>
              <dl><dt>No. of passport</dt><dd>051014</dd><dt>Name of bearer</dt><dd className="hand">Kene O.</dd><dt>Accompanied by</dt><dd>His principles</dd></dl>
            </div>
            <div className="pr"><img src="/img/f-three.jpg" alt="" /><span className="visa">VISA<br />STAMPS</span><em className="hand">Kene O.</em></div>
          </>)}

          {/* second polaroid and photo-booth strip on the right */}
          {doc('strip', 'Photo strip', 'paper strip', pos(87.5, 30.5, 11, 24.5, 2), <>
            {['f-front', 'f-three', 'f-side', 'f-front'].map((n, k) => (<img key={k} src={`/img/${n}.jpg`} alt="" />))}
          </>)}
          {doc('pol3', 'Polaroid, portrait', 'polaroid', pos(72.4, 38.4, 13.2, 16, -2), <><img src="/img/f-side.jpg" alt="" /><em>Subject K-0001</em></>)}

        </div>
      </div>
      <p className="pj-hint mono">Click any document to open it</p>
    </div>
  );
}
