import Link from 'next/link';
import { Bloom } from './Bloom';
import { COLLECTIONS, MONTHS_SHORT, fmtPrice, ruDate } from '@/lib/site';
import type { CatItem } from '@/lib/types';

export function whenOf(it: CatItem): string {
  if (it.dep) { const [, m, d] = it.dep.split('-').map(Number); return `вылет ${d} ${MONTHS_SHORT[m - 1]}`; }
  if (it.wd) return `каждую ${it.wd.replace(/у$/, 'у')}`;
  if (it.yr) return 'круглый год';
  if (it.m.length && it.m.length < 12) return it.m.length === 1 ? MONTHS_SHORT[it.m[0] - 1] : `${MONTHS_SHORT[it.m[0] - 1]}–${MONTHS_SHORT[it.m[it.m.length - 1] - 1]}`;
  return 'даты по запросу';
}
export const priceOf = (it: CatItem) => (it.p ? { text: fmtPrice(it.p.c, it.p.v), from: true, note: it.p.n } : { text: 'по запросу', from: false, note: '' });

/** The package card is a ticket: photo, perforated stub with days, departure and price. */
export function Ticket({ it, priority = false, veil = true, sizes = '(max-width: 767px) 92vw, (max-width: 1100px) 46vw, 31vw' }: { it: CatItem; priority?: boolean; veil?: boolean; sizes?: string }) {
  const price = priceOf(it);
  return (
    <Link className="ticket" href={`/destinations/${it.s}`} data-cursor>
      <Bloom id={it.cv} w={it.cw} h={it.ch} c={it.cc} alt="" sizes={sizes} className="ticket__img" priority={priority} veil={veil} />
      <div className="ticket__body">
        <p className="ticket__code">{it.k} · {COLLECTIONS[it.c].short}</p>
        <h3 className="ticket__title display">{it.t}</h3>
        <p className="ticket__route">{it.r.slice(0, 4).join(' → ')}{it.r.length > 4 ? ' …' : ''}</p>
      </div>
      <dl className="ticket__stub">
        <div><dt>Дней</dt><dd>{it.d}</dd></div>
        <div><dt>Когда</dt><dd>{whenOf(it)}</dd></div>
        <div><dt>{price.from ? 'От' : 'Цена'}</dt><dd className={price.from ? 'ticket__price' : ''}>{price.text}</dd></div>
      </dl>
    </Link>
  );
}
export { ruDate };
