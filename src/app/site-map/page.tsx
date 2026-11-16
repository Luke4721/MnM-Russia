import type { Metadata } from 'next';
import Link from 'next/link';
import { articles } from '@/lib/blog';
import { allPackages } from '@/lib/data';
import { COLLECTIONS, COLLECTION_ORDER, NAV, dayWord } from '@/lib/site';

export const metadata: Metadata = { title: 'Карта сайта', description: 'Все страницы сайта и все программы туров по Индии, Непалу и Бутану.' };

export default function SiteMap() {
  const arts = articles();
  return (
    <>
      <header className="page-head wrap">
        <p className="eyebrow">Карта сайта</p>
        <h1 className="display h-mega">Все страницы</h1>
        <p className="lede">Каждая программа и каждая статья в одном списке.</p>
      </header>
      <div className="wrap sitemap">
        <section aria-labelledby="sm-pages"><h2 id="sm-pages" className="display h-m">Разделы</h2>
          <ul>{NAV.map((n) => <li key={n.href}><Link className="draw" href={n.href}>{n.label}</Link></li>)}<li><Link className="draw" href="/contact#zayavka">Оставить заявку</Link></li></ul>
        </section>
        <section aria-labelledby="sm-blog"><h2 id="sm-blog" className="display h-m">Блог</h2>
          <ul>{arts.map((a) => <li key={a.slug}><Link className="draw" href={`/blog/${a.slug}`}>{a.title}</Link></li>)}</ul>
        </section>
        {COLLECTION_ORDER.map((c) => {
          const ps = allPackages.filter((p) => p.collection === c);
          if (!ps.length) return null;
          return (
            <section key={c} aria-labelledby={`sm-${c}`}>
              <h2 id={`sm-${c}`} className="display h-m">{COLLECTIONS[c].name} <small>{ps.length}</small></h2>
              <ul>{ps.map((p) => <li key={p.slug}><Link className="draw" href={`/destinations/${p.slug}`}>{p.title}</Link> <span className="muted">{dayWord(p.days)}</span></li>)}</ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
