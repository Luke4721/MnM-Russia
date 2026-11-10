import type { Metadata } from 'next';
import Link from 'next/link';
import { Bloom } from '@/components/Bloom';
import { catalog, gallery } from '@/lib/data';
import geo from '@/data/geo.json';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'О нас: принимающая компания в Дели с 2008 года',
  description: 'MnM Travels (Monks & Monkeys): принимающий туроператор в Нью-Дели с 2008 года, член IATO. Свои русскоговорящие гиды, заезд от одного человека.',
};

const PLACES = geo as [string, number, number][];
const USP = [
  ['Максимум насыщенности без спешки', 'В программе каждый час использован с пользой, но с балансом между осмотром великих памятников и вашим комфортом.'],
  ['Лучшая логистика в Дели', 'Наши отели недалеко друг от друга и близко к объектам. Это экономит до двух часов в день на пробках: утром можно дольше отдыхать, вечером быстрее вернуться в отель.'],
  ['Проверено лично: цена и качество', 'Мы выбираем отели, в которых уверены сами. Вы получаете сервис и уют за честную цену, без переплат.'],
  ['Профессиональные гиды', 'С вами работают штатные гиды компании со стажем. Они не просто пересказывают факты, а влюбляют в культуру и традиции Индии.'],
  ['Гарантированный заезд от одного человека', 'Не нужно ждать сбора группы: ваше путешествие состоится в любом случае.'],
  ['Индия из первых рук', 'Мы принимающий оператор в Дели и знаем маршрут до мелочей. Любые вопросы на месте решаем круглосуточно.'],
  ['Фото-стопы в лучших местах', 'Гиды знают секретные точки для лучших кадров у Тадж-Махала и в «Розовом городе».'],
  ['Погружение в колорит', 'Кроме дворцов мы включаем живые рынки и знакомство с местным бытом, чтобы вы увидели настоящую Индию.'],
  ['Безопасность и сопровождение', 'Полный контроль качества на каждом этапе: от встречи в аэропорту до прощального трансфера.'],
];

export default function About() {
  const dots = PLACES;
  const lk = Math.cos((22 * Math.PI) / 180), W = 900, H = 760, s = Math.min((W - 60) / (35 * lk), (H - 60) / 31);
  const X = (lo: number) => 30 + (lo - 68) * lk * s, Y = (la: number) => H - 30 - (la - 6) * s;
  const pic = gallery[11];
  return (
    <>
      <header className="page-head wrap">
        <p className="eyebrow" data-reveal="fade" data-intro>О нас</p>
        <h1 className="display h-mega" data-split="lines" data-intro>Индия из первых рук</h1>
        <p className="lede" data-reveal="up" data-intro data-delay="0.2">MnM Travels, он же Monks &amp; Monkeys, принимает гостей в Нью-Дели с {site.since} года. Мы не посредник: маршруты, отели, гиды и транспорт наши.</p>
      </header>

      <section className="about__story wrap g12">
        <div className="about__text">
          <p className="display" data-reveal="up">Индию невозможно увидеть за одну поездку. Каждый регион страны имеет собственный характер, культуру, архитектуру, кухню, природу и праздники.</p>
          <p data-reveal="up">Поэтому мы создали коллекцию авторских путешествий: двенадцать маршрутов по месяцам, когда регион раскрывается ярче всего, и двенадцать праздничных, привязанных к дате события. Это маршруты не для массового туризма, а для тех, кто хочет открыть Индию глубже, ярче и совершенно по-новому.</p>
          <p data-reveal="up">В каталоге {catalog.items.length} программ: от дня в Дели и недели по Раджастхану до поездов-дворцов и племенных районов Одиши. Всё это придумано командой, которая много лет работает по всей Индии, любит её и хочет показать такой, какой её видят далеко не все.</p>
        </div>
        {pic && <div className="about__photo"><Bloom id={pic.id} w={pic.w} h={pic.h} c={pic.c} alt={pic.t} sizes="(max-width: 767px) 92vw, 36vw" /></div>}
      </section>

      <section className="about__facts wrap" aria-label="Коротко о нас">
        <dl>
          <div><dt>{site.since}</dt><dd>год, с которого мы принимаем гостей</dd></div>
          <div><dt>{catalog.items.length}</dt><dd>программ в каталоге</dd></div>
          <div><dt>24</dt><dd>авторских маршрута: 12 по месяцам и 12 праздничных</dd></div>
          <div><dt>1</dt><dd>человек достаточно для заезда</dd></div>
        </dl>
      </section>

      <section className="about__map section wrap g12" aria-labelledby="map-h">
        <div className="about__maphead">
          <h2 id="map-h" className="display h-xl" data-split="lines">Места, куда мы возим</h2>
          <p className="muted" data-reveal="up">Каждая точка это город, храм, форт или заповедник из наших маршрутов. Границ на этой карте нет: только места.</p>
        </div>
        <svg className="about__constellation" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Карта: ${dots.length} мест из маршрутов MnM`}>
          {dots.map(([n, la, lo], i) => <circle key={n} cx={X(lo)} cy={Y(la)} r={n === 'Дели' ? 7 : 3.4} className={n === 'Дели' ? 'cons__delhi' : 'cons__dot'} style={{ '--i': i % 12 } as React.CSSProperties} />)}
          <text x={X(77.21) + 14} y={Y(28.61) - 10} className="cons__label">Дели, наш офис</text>
        </svg>
      </section>

      <section className="about__usp section wrap" aria-labelledby="usp-h">
        <h2 id="usp-h" className="display h-xl" data-split="lines">Чем мы отличаемся</h2>
        <ul className="why__list">
          {USP.map(([t, d], i) => <li key={t} data-reveal="up" data-delay={String((i % 3) * 0.08)}><h3 className="display h-m">{t}</h3><p className="muted">{d}</p></li>)}
        </ul>
      </section>

      <section className="about__trust section wrap g12" aria-labelledby="trust-h">
        <h2 id="trust-h" className="display h-l">Нам доверяют</h2>
        <ul className="about__badges">
          <li><b>IATO</b> Член Индийской ассоциации туроператоров</li>
          <li><b>Tripadvisor</b> Travellers’ Choice</li>
          <li><b>{site.since}</b> Работаем в Индии с этого года</li>
        </ul>
        <address className="about__office">
          <p className="footer__label">Головной офис</p>
          <p>{site.office}</p>
          <p><a className="ulink" href={site.phoneHref}>{site.phone}</a>, <a className="ulink" href={`mailto:${site.email}`}>{site.email}</a></p>
          <Link className="btn" href="/contact#zayavka"><span className="btn__label">Написать нам</span><span className="btn__arrow" aria-hidden="true">→</span></Link>
        </address>
      </section>
    </>
  );
}
