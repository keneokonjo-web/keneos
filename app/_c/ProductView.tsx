import { products } from '@/content/site';

export default function ProductView() {
  return (
    <section className="pvs" aria-label="Product viewing">
      <div className="pv-grid">
        {products.map((p, i) => (
          <figure key={p.img} className={'pvi p' + i + ' rv'}>
            <div className="pt"><img src={`/img/${p.img}.png`} alt={p.name} loading="lazy" /></div>
            <figcaption><span>{p.name}</span><i>{p.price}</i></figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
