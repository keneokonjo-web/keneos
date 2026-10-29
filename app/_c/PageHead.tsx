export default function PageHead({ n, title, sub, nav }: { n: string; title: React.ReactNode; sub?: string; nav?: { href: string; label: string }[] }) {
  return (
    <header className="ph">
      <div className="n mono"><span>Index {n}</span><span>KJO</span></div>
      <h1><span className="mask in"><span>{title}</span></span></h1>
      {sub && <p className="sub rv">{sub}</p>}
      {nav && <div className="subnav mono">{nav.map((x) => (<a key={x.href} href={x.href}>{x.label}</a>))}</div>}
    </header>
  );
}
