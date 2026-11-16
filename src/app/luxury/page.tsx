import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { T } from '@/components/Lang';
import { RequestForm } from '@/components/RequestForm';
import { Tilt } from '@/components/Tilt';
import { catalog, heroImgs } from '@/lib/data';
import { dayWord, imgSrc } from '@/lib/site';
import type { CatItem } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Люкс: поезда-дворцы и VIP-маршруты по Индии',
  description: 'Махараджа Экспресс, Дворец на колёсах, Декан Одиссея и VIP-версии Золотого треугольника. Маршруты для тех, кто ценит сервис, тишину и время.',
};

// Routes and day counts come from the client's programs; prices and dates are confirmed on request.
const TRAIN_COPY: Record<string, [string, string]> = {
  sokrovischa: ['Четыре дня на борту: Тадж-Махал, сафари в национальном парке Рантхамбор и форт Амбер. Два ресторана и лаундж-бар на борту, завтраки, обеды и ужины в вагонах.', 'Four days aboard: the Taj Mahal, a safari in Ranthambore National Park and Amber Fort. Two restaurants and a lounge bar on board, with every meal served in the carriages.'],
  nasledie: ['Неделя от Мумбая до Дели по городам Раджастхана. Дворцы, форты и пустыня Тар, а ночь вы проводите в поезде.', 'A week from Mumbai to Delhi through the cities of Rajasthan. Palaces, forts and the Thar desert, with your nights spent aboard the train.'],
  dekan: ['Восемь дней по Махараштре и побережью: пещеры Эллоры и Аджанты, Колхапур, Гоа и Синдхудург.', 'Eight days across Maharashtra and the coast: the caves of Ellora and Ajanta, Kolhapur, Goa and Sindhudurg.'],
  dvorets: ['Раджастхан целиком: Джайпур, Читторгарх, Удайпур, Джайсалмер, Джодхпур и Бхаратпур. Классический «Дворец на колёсах» на восемь дней.', 'All of Rajasthan: Jaipur, Chittorgarh, Udaipur, Jaisalmer, Jodhpur and Bharatpur. The classic Palace on Wheels over eight days.'],
};
const copyFor = (s: string): [string, string] => Object.entries(TRAIN_COPY).find(([k]) => s.includes(k))?.[1] ?? ['', ''];

const DEVA = ['१', '२', '३', '४', '५', '६'];
const PERKS = [
  ['Встреча с гирляндами', 'Традиционное приветствие в аэропорту: гирлянды из цветов и ваш личный встречающий.', 'A garland welcome', 'The traditional airport greeting: flower garlands and your own personal greeter.'],
  ['Номер выбранной категории', 'Делюкс 4–5★ или другая категория на ваш выбор. Отели рядом с главными памятниками.', 'A room of your category', 'Deluxe 4–5★ or another category of your choice, in hotels close to the main monuments.'],
  ['Завтраки каждый день', 'Ежедневный завтрак и, по желанию, ужины в отелях. На поездах-дворцах всё питание на борту.', 'Breakfast every day', 'Daily breakfast and, if you wish, dinners at the hotels. On the palace trains every meal is on board.'],
  ['Транспорт с кондиционером', 'Трансферы и экскурсии по программе в комфортном транспорте. Все налоги, парковки и платные дороги в цене.', 'Air-conditioned transport', 'Transfers and tours in comfortable vehicles. All taxes, parking and tolls are included.'],
  ['Русскоговорящий гид', 'Опытный гид компании, который рассказывает о людях и традициях, а не только о датах.', 'A Russian-speaking guide', 'An experienced in-house guide who talks about people and traditions, not only dates.'],
  ['Маршрут под вас', 'Любую программу можно пересобрать: добавить ночь, сменить отель, переставить дни.', 'A route made for you', 'Any programme can be rebuilt: add a night, change a hotel, reorder the days.'],
];

const Ornament = () => (
  <svg className="lux-diamond" viewBox="0 0 120 14" aria-hidden="true"><path d="M0 7h46M74 7h46" stroke="currentColor" strokeWidth="1" /><path d="M60 0l7 7-7 7-7-7z" fill="currentColor" /><circle cx="48" cy="7" r="1.6" fill="currentColor" /><circle cx="72" cy="7" r="1.6" fill="currentColor" /></svg>
);

function Train({ it, i }: { it: CatItem; i: number }) {
  const alt = it.s.includes('sokrovischa') ? heroImgs[0] : null; // the document's own cover is a collage
  const [ru, en] = copyFor(it.s);
  const src = alt ? alt.id : it.cv;
  return (
    <article className="lux-row" data-reveal="up">
      <Tilt className="lux-row__photo" max={5}>
        <div className="lux-frame" data-z="0"><div className="lux-frame__in" data-parallax><Image src={imgSrc(src)} alt={it.t} fill sizes="(max-width: 767px) 80vw, 40vw" quality={74} /></div></div>
        <span className="lux-row__num deva" data-z="60" aria-hidden="true">{DEVA[i]}</span>
      </Tilt>
      <div className="lux-row__text">
        <p className="lux-row__meta"><span>{dayWord(it.d)}</span><span><T ru="Поезд-дворец" en="Palace on rails" /></span></p>
        <h3 className="display lux-row__name">{it.t}</h3>
        <ol className="lux-stations" aria-label="Маршрут">{it.r.map((c) => <li key={c}><i aria-hidden="true" /><span>{c}</span></li>)}</ol>
        <p className="lux-row__desc"><T ru={ru} en={en} /> <T ru="Даты и цену на сезон подтверждаем по запросу." en="Dates and the season’s price are confirmed on request." /></p>
        <Link className="alink" href={`/destinations/${it.s}`}><T ru="Программа по дням" en="Day-by-day programme" /> <span className="alink__arrow" aria-hidden="true">→</span></Link>
      </div>
    </article>
  );
}

export default function Luxury() {
  const lux = catalog.items.filter((i) => i.c === 'luxury');
  const trains = lux.filter((i) => !i.s.startsWith('vip-'));
  const vip = lux.filter((i) => i.s.startsWith('vip-'));
  const hero = heroImgs[3]; // Hawa Mahal at dusk
  return (
    <div className="lux">
      <section className="lux-hero" data-chapter="Люкс" aria-labelledby="lux-title">
        <div className="lux-hero__copy">
          <p className="lux__eyebrow"><T ru="Люкс · по приглашению" en="Luxury · by invitation" /></p>
          <h1 id="lux-title" className="display lux-hero__title"><T ru="Индия, как её видят" en="India, as the" /> <span className="gold"><T ru="махараджи" en="maharajas saw it" /></span></h1>
          <p className="lux-hero__lede"><T ru="Поезда-дворцы, VIP-версии классических маршрутов и поездки для тех, кто ценит сервис, тишину и своё время." en="Palace trains, VIP versions of the classic routes and journeys for those who value service, silence and their own time." /></p>
          <dl className="lux-hero__facts">
            <div><dt>{trains.length}</dt><dd><T ru="поезда-дворца" en="palace trains" /></dd></div>
            <div><dt>{vip.length}</dt><dd><T ru="VIP-маршрутов" en="VIP routes" /></dd></div>
            <div><dt>24/7</dt><dd><T ru="личный куратор" en="personal host" /></dd></div>
          </dl>
          <div className="lux-hero__cta">
            <a className="btn btn--gold" href="#concierge"><span className="btn__label"><T ru="Подобрать маршрут" en="Plan a journey" /></span><span className="btn__arrow" aria-hidden="true">→</span></a>
            <a className="alink" href="#trains"><T ru="Поезда-дворцы" en="Palace trains" /> <span className="alink__arrow" aria-hidden="true">↓</span></a>
          </div>
        </div>
        <div className="lux-hero__arch">
          <Tilt className="lux-hero__tilt" max={6}>
            <div className="lux-frame" data-z="0"><div className="lux-frame__in"><Image src={imgSrc(hero.id)} alt="Хава-Махал в Джайпуре в вечерней подсветке" fill sizes="(max-width: 767px) 78vw, 36vw" quality={76} priority /></div></div>
            <p className="lux-hero__note" data-z="50"><T ru="Джайпур, Хава-Махал" en="Jaipur, Hawa Mahal" /></p>
          </Tilt>
        </div>
      </section>

      <section className="lux-sec" id="trains" data-chapter="Поезда" aria-labelledby="trains-h">
        <div className="lux-sec__head">
          <Ornament />
          <h2 id="trains-h" className="display" data-words><T ru="Королевские дороги" en="The royal roads" /></h2>
          <p><T ru="Дорога сама становится путешествием: ужин в вагоне-ресторане, утро в новом городе, и ни одного переезда с чемоданами." en="The road becomes the journey: dinner in the dining car, morning in a new city, and not one move with suitcases." /></p>
        </div>
        <div className="lux-rows">{trains.map((it, i) => <Train key={it.s} it={it} i={i} />)}</div>
      </section>

      <section className="lux-sec lux-sec--tint" data-chapter="VIP" aria-labelledby="vip-h">
        <div className="lux-sec__head">
          <Ornament />
          <h2 id="vip-h" className="display" data-words><T ru="VIP: классика в высшем исполнении" en="VIP: the classics, perfected" /></h2>
          <p><T ru="Золотой треугольник и его продолжения: Кхаджурахо и Варанаси. Та же Индия, но с вниманием к каждой детали." en="The Golden Triangle and its extensions to Khajuraho and Varanasi. The same India, with attention to every detail." /></p>
        </div>
        <div className="lux-vip" data-stagger>
          {vip.map((it) => (
            <Tilt key={it.s} className="lux-card" max={8}>
              <Link href={`/destinations/${it.s}`}>
                <p className="lux-card__days display" data-z="40">{it.d}<small><T ru="дней" en="days" /></small></p>
                <h3 className="display">{it.t.replace(/^VIP \d+D /i, '').replace(/^./, (c) => c.toUpperCase())}</h3>
                <p>{it.r.slice(0, 6).join(' · ')}{it.r.length > 6 ? ' …' : ''}</p>
                <span className="alink"><T ru="Смотреть программу" en="View the programme" /> <span className="alink__arrow" aria-hidden="true">→</span></span>
              </Link>
            </Tilt>
          ))}
        </div>
      </section>

      <section className="lux-sec" data-chapter="Сервис" aria-labelledby="perks-h">
        <div className="lux-sec__head">
          <Ornament />
          <h2 id="perks-h" className="display" data-words><T ru="Что вы получаете" en="What you receive" /></h2>
        </div>
        <ul className="lux-list" data-stagger>
          {PERKS.map(([t, d, te, de], i) => (
            <li key={t}>
              <span className="deva" aria-hidden="true">{DEVA[i]}</span>
              <h3 className="display"><T ru={t} en={te} /></h3>
              <p><T ru={d} en={de} /></p>
            </li>
          ))}
        </ul>
      </section>

      <section className="lux-sec lux-cta" id="concierge" data-chapter="Консьерж" aria-labelledby="conc-h">
        <div className="lux-cta__head">
          <Ornament />
          <p className="lux__eyebrow"><T ru="Личный подбор" en="Personal planning" /></p>
          <h2 id="conc-h" className="display" data-words><T ru="Расскажите о пожеланиях" en="Tell us what you wish for" /></h2>
          <p className="muted"><T ru="Сезон, число гостей, отели, ритм поездки. Мы соберём маршрут и пришлём программу с ценой на ваши даты." en="Season, number of guests, hotels, the pace of the trip. We will build the route and send a programme with a price for your dates." /></p>
        </div>
        <div className="lux-cta__form"><RequestForm id="lux-form" /></div>
      </section>
    </div>
  );
}
