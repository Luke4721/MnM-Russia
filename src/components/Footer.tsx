import Link from 'next/link';
import { T } from './Lang';
import { COLLECTIONS, COLLECTION_ORDER, NAV, site } from '@/lib/site';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer__grid">
        <div>
          <p className="footer__lead"><T ru="Индия, которую не увидеть за одну поездку" en="An India you cannot see in a single trip" /></p>
        </div>
        <div>
          <h2 className="footer__label"><T ru="Разделы" en="Pages" /></h2>
          <ul className="footer__list">
            {NAV.map((n) => <li key={n.href}><Link className="draw" href={n.href}><T ru={n.label} en={n.en} /></Link></li>)}
          </ul>
        </div>
        <div>
          <h2 className="footer__label"><T ru="Туры" en="Tours" /></h2>
          <ul className="footer__list">
            {COLLECTION_ORDER.slice(0, 7).map((c) => <li key={c}><Link className="draw" href={c === 'luxury' ? '/luxury' : `/destinations?c=${c}`}>{COLLECTIONS[c].name}</Link></li>)}
          </ul>
        </div>
        <div>
          <h2 className="footer__label"><T ru="Офис в Дели" en="Delhi office" /></h2>
          <address>{site.office}</address>
          <ul className="footer__list" style={{ marginTop: '1.2rem' }}>
            <li><a className="ulink" href={site.phoneHref}>{site.phone}</a></li>
            <li><a className="ulink" href={site.whatsapp} target="_blank" rel="noopener">WhatsApp {site.mobile}</a></li>
            <li><a className="ulink" href={site.telegram} target="_blank" rel="noopener">Telegram</a></li>
            <li><a className="ulink" href={`mailto:${site.email}`}>{site.email}</a></li>
          </ul>
        </div>
      </div>
      <p className="footer__deva deva" lang="hi">भारत में आपका स्वागत है</p>
      <p className="footer__word" data-footer-word aria-hidden="true">Индия в цвете</p>
      <div className="footer__legal">
        <span>© {site.name}, <T ru="Нью-Дели. Принимаем гостей с" en="New Delhi. Welcoming guests since" /> {site.since}.</span>
        <span><T ru="Член Индийской ассоциации туроператоров (IATO). Travellers’ Choice на Tripadvisor." en="Member of the Indian Association of Tour Operators (IATO). Tripadvisor Travellers’ Choice." /></span>
        <span><T ru="Цены указаны за человека, если не сказано иначе." en="Prices are per person unless stated otherwise." /></span>
        <Link className="ulink" href="/site-map"><T ru="Карта сайта" en="Site map" /></Link>
        <Link className="ulink" href="/credits"><T ru="Источники фото" en="Photo credits" /></Link>
      </div>
    </footer>
  );
}
