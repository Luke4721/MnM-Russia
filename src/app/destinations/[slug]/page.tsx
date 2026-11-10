import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Bloom } from '@/components/Bloom';
import { PriceBlock } from '@/components/PriceBlock';
import { RequestForm } from '@/components/RequestForm';
import { RouteMap } from '@/components/RouteMap';
import { Ticket } from '@/components/Ticket';
import { allPackages, catalog, getPackage, related } from '@/lib/data';
import { COLLECTIONS, MONTHS, dayWord, devnum, fmtPrice, imgSrc, nightWord, ruDate, site } from '@/lib/site';
import type { Pkg } from '@/lib/types';

export function generateStaticParams() { return allPackages.map((p) => ({ slug: p.slug })); }

export async function generateMetadata({ params }: PageProps<'/destinations/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const p = getPackage(slug);
  if (!p) return {};
  const desc = (p.intro[0] || `${p.title}: ${dayWord(p.days)}, маршрут ${p.route.slice(0, 5).join(', ')}.`).replace(/\s+/g, ' ');
  return { title: p.title.length > 58 ? p.title.slice(0, 57) + '…' : p.title, description: desc.length > 158 ? desc.slice(0, 155) + '…' : desc, openGraph: { images: p.cover ? [imgSrc(p.cover.id)] : undefined } };
}

function when(p: Pkg): string {
  if (p.departure) return `вылет ${ruDate(p.departure)}`;
  if (p.weekly && p.weekday) return `каждую ${p.weekday}`;
  if (p.yearRound) return 'круглый год';
  if (p.collection === '12x') return `только в месяце: ${MONTHS[p.months[0] - 1].toLowerCase()}`;
  if (p.months.length > 0 && p.months.length < 12) return `сезон: ${MONTHS[p.months[0] - 1].toLowerCase()}–${MONTHS[p.months[p.months.length - 1] - 1].toLowerCase()}`;
  return 'даты подберём под вас';
}

export default async function Package({ params }: PageProps<'/destinations/[slug]'>) {
  const { slug } = await params;
  const p = getPackage(slug);
  if (!p) notFound();
  const price = p.price.kind !== 'request' ? p.price : null;
  const rel = related(p, 3);
  const cat = catalog.items.filter((i) => rel.some((r) => r.slug === i.s));
  const sights = (n: number) => (p.summary.find((s) => s.n === n)?.sights || '').split(' / ').map((s) => s.trim()).filter(Boolean).slice(0, 9);
  const detailed = p.program.length > 1;
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'TouristTrip', name: p.title, description: p.intro[0] || p.title,
    touristType: 'Путешественники из России', itinerary: p.route.map((r) => ({ '@type': 'Place', name: r })),
    ...(price ? { offers: { '@type': 'Offer', priceCurrency: price.cur, price: price.from, availability: 'https://schema.org/InStock', url: `${site.url}/destinations/${p.slug}` } } : {}),
    provider: { '@type': 'TravelAgency', name: site.name, url: site.url },
  };

  return (
    <article className="pkg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <header className="pkg__head wrap">
        <nav aria-label="Навигация" className="crumbs"><Link className="draw" href="/destinations">Направления</Link> <span aria-hidden="true">/</span> <Link className="draw" href={`/destinations?c=${p.collection}`}>{COLLECTIONS[p.collection].name}</Link></nav>
        <p className="pkg__code">{p.code}</p>
        <h1 className="display h-xl pkg__title" data-split="lines" data-intro>{p.title}</h1>
        {p.tagline && <p className="pkg__tag display" data-reveal="up" data-intro data-delay="0.2">{p.tagline}</p>}
      </header>

      {p.cover && (
        <div className="pkg__hero wrap">
          <Bloom id={p.cover.id} w={p.cover.w} h={p.cover.h} c={p.cover.c} alt={p.title} sizes="(max-width: 1440px) 96vw, 1400px" priority className="pkg__cover" origin="35,55" />
        </div>
      )}

      <dl className="pass wrap">
        <div><dt>Длительность</dt><dd>{dayWord(p.days)}{p.nights > 0 ? `, ${nightWord(p.nights)}` : ''}</dd></div>
        <div><dt>Когда</dt><dd>{when(p)}</dd></div>
        <div><dt>Маршрут</dt><dd>{p.route[0]}{p.route.length > 1 ? ` → ${p.route[p.route.length - 1]}` : ''}</dd></div>
        <div className="pass__price"><dt>{price ? 'От' : 'Цена'}</dt><dd>{price ? fmtPrice(price.cur, price.from) : 'по запросу'}{price && price.fromNote ? <small> {price.fromNote}</small> : null}</dd></div>
      </dl>

      <div className="pkg__layout wrap g12">
        <div className="pkg__main">
          {p.intro.length > 0 && (
            <section className="pkg__intro" aria-label="О программе">
              {p.intro.map((t, i) => <p key={i} className={i === 0 ? 'display' : ''} data-reveal="up">{t}</p>)}
            </section>
          )}

          {p.route.length > 1 && (
            <section className="pkg__route" aria-labelledby="route-h">
              <h2 id="route-h" className="display h-l">Маршрут</h2>
              <ol className="stops">{p.route.map((r, i) => <li key={i}>{r}</li>)}</ol>
            </section>
          )}

          <section className="pkg__days" aria-labelledby="days-h" data-days>
            <h2 id="days-h" className="display h-l">{detailed ? 'День за днём' : 'Программа'}</h2>
            <ol className="days">
              {p.program.map((d) => {
                const chips = detailed ? sights(d.n) : [];
                const cut = (t: string) => { if (t.length < 380) return [t, '']; const m = t.slice(300).search(/[.!?]\s/); return m < 0 ? [t, ''] : [t.slice(0, 300 + m + 1), t.slice(300 + m + 2)]; };
                const [first, spill] = d.text.length ? cut(d.text[0]) : ['', ''];
                const rest = [...(spill ? [spill] : []), ...d.text.slice(1)];
                const title = d.title || (detailed ? '' : p.title);
                return (
                  <li key={d.n} className="day" id={`day-${d.n}`} data-day={d.n}>
                    <div className="day__mark">
                      {detailed && <span className="day__deva deva" aria-hidden="true">{devnum(d.n)}</span>}
                      <span className="day__n">{detailed ? `День ${d.n}` : ''}</span>
                      {d.label && /^\d\d-\d\d-\d{4}$/.test(d.label) && <span className="day__date">{ruDate(d.label.split('-').reverse().join('-'))}</span>}
                    </div>
                    <div className="day__body">
                      {title && <h3 className="display h-m day__title">{title}</h3>}
                      {chips.length > 0 && <ul className="day__chips">{chips.map((c) => <li key={c} className="chip"><i />{c}</li>)}</ul>}
                      {first && <p className="day__lead">{first}</p>}
                      {rest.length > 0 && (
                        <details className="day__more">
                          <summary>Подробнее о дне</summary>
                          {rest.map((t, i) => <p key={i}>{t}</p>)}
                        </details>
                      )}
                    </div>
                    {d.img && (
                      <div className="day__photo">
                        <Bloom id={d.img.id} w={d.img.w} h={d.img.h} c={d.img.c} alt="" sizes="(max-width: 767px) 92vw, 30vw" />
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>

          <section className="pkg__price" id="price" aria-labelledby="price-h">
            <h2 id="price-h" className="display h-l">Цена</h2>
            <PriceBlock tables={p.price.tables} rub={p.price.rub} note={price?.note || ''} kind={p.price.kind} code={p.code} />
          </section>

          {(p.included.length > 0 || p.excluded.length > 0) && (
            <section className="pkg__terms" aria-label="Что входит в стоимость">
              {p.included.length > 0 && <div><h2 className="display h-m">Включено</h2><ul className="tick">{p.included.map((x) => <li key={x}>{x}</li>)}</ul></div>}
              {p.excluded.length > 0 && <div><h2 className="display h-m">Оплачивается отдельно</h2><ul className="cross">{p.excluded.map((x) => <li key={x}>{x}</li>)}</ul></div>}
            </section>
          )}

          {p.hotels && p.hotels.length > 1 && (
            <section className="pkg__hotels" aria-labelledby="hotels-h">
              <h2 id="hotels-h" className="display h-m">Отели или аналогичные</h2>
              <div className="ptable-wrap"><table className="ptable"><thead><tr>{p.hotels[0].map((h, i) => <th key={i} scope="col">{h.replace(/\*/g, '★')}</th>)}</tr></thead><tbody>{p.hotels.slice(1).map((r, i) => <tr key={i}>{r.map((c, j) => (j === 0 ? <th key={j} scope="row">{c}</th> : <td key={j}>{c}</td>))}</tr>)}</tbody></table></div>
            </section>
          )}

          {p.why.length > 0 && (
            <section className="pkg__why" aria-labelledby="why-h">
              <h2 id="why-h" className="display h-m">Почему стоит выбрать этот тур</h2>
              <ul className="tick">{p.why.map((x) => <li key={x}>{x}</li>)}</ul>
            </section>
          )}
        </div>

        <aside className="pkg__aside" aria-label="Заказ и карта">
          <div className="boarding">
            <p className="boarding__code">{p.code}</p>
            <p className="boarding__price display">{price ? <><small>от</small> {fmtPrice(price.cur, price.from)}</> : 'Цена по запросу'}</p>
            <p className="boarding__when">{dayWord(p.days)} · {when(p)}</p>
            <Link className="btn" href={`/contact?tur=${encodeURIComponent(p.code)}#zayavka`}><span className="btn__label">Оставить заявку</span><span className="btn__arrow" aria-hidden="true">→</span></Link>
            <a className="alink" href={site.whatsapp} target="_blank" rel="noopener">Спросить в WhatsApp <span className="alink__arrow" aria-hidden="true">→</span></a>
          </div>
          <RouteMap pts={p.pts} title={p.title} />
        </aside>
      </div>

      <section className="pkg__request wrap g12" id="request" aria-labelledby="req-h">
        <div className="request__head">
          <h2 id="req-h" className="display h-xl">Хочу в этот тур</h2>
          <p className="muted">Напишите даты и число путешественников. Пришлём программу, отели и точную цену.</p>
        </div>
        <div className="request__form"><RequestForm tour={p.code} tourLabel={`${p.code}: ${p.title}`} id="pkg-form" /></div>
      </section>

      {cat.length > 0 && (
        <section className="pkg__related section wrap" aria-labelledby="rel-h">
          <h2 id="rel-h" className="display h-xl">Похожие поездки</h2>
          <div className="tickets">{cat.map((it) => <div key={it.s} className="tickets__cell"><Ticket it={it} /></div>)}</div>
        </section>
      )}

      <div className="pkg__bar" role="region" aria-label="Заказ">
        <p className="display">{price ? `от ${fmtPrice(price.cur, price.from)}` : 'Цена по запросу'}</p>
        <Link className="btn btn--small" href={`/contact?tur=${encodeURIComponent(p.code)}#zayavka`}><span className="btn__label">Заявка</span></Link>
      </div>
    </article>
  );
}
