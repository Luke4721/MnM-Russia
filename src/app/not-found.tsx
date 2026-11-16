import Link from 'next/link';

export const metadata = { title: 'Такой страницы нет' };

export default function NotFound() {
  return (
    <section className="nf wrap">
      <p className="nf__num display" aria-hidden="true">404</p>
      <h1 className="display h-xl" data-split="lines" data-intro>Здесь пока серо</h1>
      <p className="lede">Такой страницы нет, но цвета в Индии хватит на всех. Вернитесь к программам.</p>
      <Link className="btn" href="/destinations"><span className="btn__label">Смотреть направления</span><span className="btn__arrow" aria-hidden="true">→</span></Link>
      <ul className="nf__links">
        {[['/', 'Главная'], ['/destinations', 'Направления'], ['/luxury', 'Люкс'], ['/gallery', 'Галерея'], ['/blog', 'Блог'], ['/contact', 'Контакты'], ['/site-map', 'Карта сайта']].map(([h, l]) => <li key={h}><Link className="draw" href={h}>{l}</Link></li>)}
      </ul>
    </section>
  );
}
