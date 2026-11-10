import Link from 'next/link';
import { COLLECTIONS, COLLECTION_ORDER, NAV, site } from '@/lib/site';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer__grid">
        <div>
          <p className="footer__lead">Индия, которую не увидеть за одну поездку</p>
        </div>
        <div>
          <h2 className="footer__label">Разделы</h2>
          <ul className="footer__list">
            {NAV.map((n) => <li key={n.href}><Link className="draw" href={n.href}>{n.label}</Link></li>)}
          </ul>
        </div>
        <div>
          <h2 className="footer__label">Туры</h2>
          <ul className="footer__list">
            {COLLECTION_ORDER.slice(0, 7).map((c) => <li key={c}><Link className="draw" href={`/destinations?c=${c}`}>{COLLECTIONS[c].name}</Link></li>)}
          </ul>
        </div>
        <div>
          <h2 className="footer__label">Офис в Дели</h2>
          <address>{site.office}</address>
          <ul className="footer__list" style={{ marginTop: '1.2rem' }}>
            <li><a className="ulink" href={site.phoneHref}>{site.phone}</a></li>
            <li><a className="ulink" href={site.whatsapp} target="_blank" rel="noopener">WhatsApp {site.mobile}</a></li>
            <li><a className="ulink" href={site.telegram} target="_blank" rel="noopener">Telegram</a></li>
            <li><a className="ulink" href={`mailto:${site.email}`}>{site.email}</a></li>
          </ul>
        </div>
      </div>
      <p className="footer__word" data-footer-word aria-hidden="true">Индия в цвете</p>
      <div className="footer__legal">
        <span>© {site.name}, Нью-Дели. Принимаем гостей с {site.since} года.</span>
        <span>Член Индийской ассоциации туроператоров (IATO). Travellers’ Choice на Tripadvisor.</span>
        <span>Цены указаны за человека, если не сказано иначе.</span>
      </div>
    </footer>
  );
}
