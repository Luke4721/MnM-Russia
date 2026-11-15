import type { Metadata } from 'next';
import Link from 'next/link';
import { Bloom } from '@/components/Bloom';
import { RequestForm } from '@/components/RequestForm';
import { catalog, heroImgs } from '@/lib/data';
import { dayWord } from '@/lib/site';
import type { CatItem } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Люкс: поезда-дворцы и VIP-маршруты по Индии',
  description: 'Махараджа Экспресс, Дворец на колёсах, Декан Одиссея и VIP-версии Золотого треугольника. Маршруты для тех, кто ценит сервис, тишину и время.',
};

// Hand-written, factual lines per train: routes and day counts come from the client's programs; prices and dates are confirmed on request.
const TRAIN_COPY: Record<string, string> = {
  'sokrovischa': 'Четыре дня на борту: Тадж-Махал, сафари в национальном парке Рантхамбор и форт Амбер. Два ресторана и лаундж-бар на борту, завтраки, обеды и ужины в вагонах.',
  'nasledie': 'Неделя от Мумбая до Дели по городам Раджастхана. Дворцы, форты и пустыня Тар, а ночь вы проводите в поезде.',
  'dekan': 'Восемь дней по Махараштре и побережью: пещеры Эллоры и Аджанты, Колхапур, Гоа и Синдхудург. Самая южная из королевских дорог.',
  'dvorets': 'Раджастхан целиком: Джайпур, Читторгарх, Удайпур, Джайсалмер, Джодхпур и Бхаратпур. Классический «Дворец на колёсах» на восемь дней.',
};
const copyFor = (s: string) => Object.entries(TRAIN_COPY).find(([k]) => s.includes(k))?.[1] ?? '';

const DEVA = ['१', '२', '३', '४', '५', '६'];
const PERKS = [
  ['Встреча с гирляндами', 'Традиционное приветствие в аэропорту: гирлянды из цветов и ваш личный встречающий.'],
  ['Номер выбранной категории', 'Делюкс 4–5★ или другая категория на ваш выбор. Отели рядом с главными памятниками.'],
  ['Завтраки каждый день', 'Ежедневный завтрак и, по желанию, ужины в отелях. На поездах-дворцах всё питание на борту.'],
  ['Транспорт с кондиционером', 'Трансферы и экскурсии по программе в комфортном транспорте. Все налоги, парковки и платные дороги в цене.'],
  ['Русскоговорящий гид', 'Опытный гид компании, который рассказывает о людях и традициях, а не только о датах.'],
  ['Маршрут под вас', 'Любую программу можно пересобрать: добавить ночь, сменить отель, переставить дни.'],
];

function Train({ it, i }: { it: CatItem; i: number }) {
  return (
    <article className="lux-row" data-reveal="up">
      <div className="lux-row__photo">
        <Bloom id={it.cv} w={it.cw} h={it.ch} c={it.cc} alt={it.t} sizes="(max-width: 767px) 80vw, 40vw" />
      </div>
      <div className="lux-row__text">
        <span className="lux-row__num deva" aria-hidden="true">{DEVA[i]}</span>
        <p className="lux-row__meta"><span>{dayWord(it.d)}</span><span>Поезд-дворец</span></p>
        <h3 className="display lux-row__name">{it.t}</h3>
        <p className="lux-row__route">{it.r.map((c, k) => <span key={c}>{k > 0 && <i aria-hidden="true">·</i>}{c}</span>)}</p>
        <p className="lux-row__desc">{copyFor(it.s)} Даты и цену на сезон подтверждаем по запросу.</p>
        <Link className="alink" href={`/destinations/${it.s}`}>Программа по дням <span className="alink__arrow" aria-hidden="true">→</span></Link>
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
      <section className="lux-hero" aria-labelledby="lux-title">
        <div className="lux-hero__copy">
          <p className="lux__eyebrow" data-reveal="fade" data-intro>Люкс</p>
          <h1 id="lux-title" className="display lux-hero__title" data-split="lines" data-intro>Индия, как её видят <span className="gold">махараджи</span></h1>
          <p className="lux-hero__lede" data-reveal="up" data-intro data-delay="0.25">Поезда-дворцы, VIP-версии классических маршрутов и поездки для тех, кто ценит сервис, тишину и своё время.</p>
          <div className="lux-hero__cta" data-reveal="up" data-intro data-delay="0.4">
            <a className="btn btn--gold" href="#concierge"><span className="btn__label">Подобрать маршрут</span><span className="btn__arrow" aria-hidden="true">→</span></a>
            <a className="alink" href="#trains">Поезда-дворцы <span className="alink__arrow" aria-hidden="true">↓</span></a>
          </div>
        </div>
        <div className="lux-hero__arch">
          <Bloom id={hero.id} w={hero.w} h={hero.h} c="#d9a066" alt="Хава-Махал в Джайпуре в вечерней подсветке" sizes="(max-width: 767px) 78vw, 40vw" priority origin="50,40" />
          <p className="lux-hero__note">Джайпур, Хава-Махал</p>
        </div>
      </section>

      <section className="lux-sec" id="trains" aria-labelledby="trains-h">
        <div className="lux-sec__head">
          <div className="lux-orn" aria-hidden="true" />
          <h2 id="trains-h" className="display" data-split="lines">Королевские дороги</h2>
          <p data-reveal="up">Дорога сама становится путешествием: ужин в вагоне-ресторане, утро в новом городе, и ни одного переезда с чемоданами.</p>
        </div>
        <div className="lux-rows">{trains.map((it, i) => <Train key={it.s} it={it} i={i} />)}</div>
      </section>

      <section className="lux-sec" aria-labelledby="vip-h">
        <div className="lux-sec__head">
          <div className="lux-orn" aria-hidden="true" />
          <h2 id="vip-h" className="display" data-split="lines">VIP: классика в высшем исполнении</h2>
          <p data-reveal="up">Золотой треугольник и его продолжения: Кхаджурахо и Варанаси. Та же Индия, но с вниманием к каждой детали.</p>
        </div>
        <div className="lux-vip">
          {vip.map((it) => (
            <Link key={it.s} href={`/destinations/${it.s}`} className="lux-card" data-reveal="up">
              <p className="lux-card__days display">{it.d}<small>дней</small></p>
              <h3 className="display">{it.t.replace(/^VIP \d+D /i, '').replace(/^./, (c) => c.toUpperCase())}</h3>
              <p>{it.r.slice(0, 6).join(' · ')}{it.r.length > 6 ? ' …' : ''}</p>
              <span className="alink">Смотреть программу <span className="alink__arrow" aria-hidden="true">→</span></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="lux-sec" aria-labelledby="perks-h">
        <div className="lux-sec__head">
          <div className="lux-orn" aria-hidden="true" />
          <h2 id="perks-h" className="display" data-split="lines">Что вы получаете</h2>
        </div>
        <ul className="lux-list">
          {PERKS.map(([t, d], i) => (
            <li key={t} data-reveal="up" data-delay={String((i % 3) * 0.08)}>
              <span className="deva" aria-hidden="true">{DEVA[i]}</span>
              <h3 className="display">{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="lux-sec lux-cta" id="concierge" aria-labelledby="conc-h">
        <div className="lux-cta__head">
          <p className="lux__eyebrow">Личный подбор</p>
          <h2 id="conc-h" className="display" data-split="lines">Расскажите о пожеланиях</h2>
          <p className="muted" data-reveal="up">Сезон, число гостей, отели, ритм поездки. Мы соберём маршрут и пришлём программу с ценой на ваши даты.</p>
        </div>
        <div className="lux-cta__form"><RequestForm id="lux-form" /></div>
      </section>
    </div>
  );
}
