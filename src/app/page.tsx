import Image from 'next/image';
import Link from 'next/link';
import { Bloom } from '@/components/Bloom';
import { Tilt } from '@/components/Tilt';
import { T } from '@/components/Lang';
import { RequestForm } from '@/components/RequestForm';
import { Ticket } from '@/components/Ticket';
import { articles } from '@/lib/blog';
import { catByCodes, catalog, collectionStats, heroImgs } from '@/lib/data';
import { COLLECTIONS, COLLECTION_ORDER, MONTHS, fmtPrice, imgSrc, site } from '@/lib/site';

const STEPS = [
  ['Заявка', 'Напишите, когда можете поехать и что хотите увидеть. Пришлём программу, отели и цену на ваши даты.', 'Request', 'Tell us when you can travel and what you want to see. We send a programme, hotels and a price for your dates.'],
  ['Виза', 'Поможем с электронной визой. Нужны загранпаспорт, фото и анкета; месячную визу обычно рассматривают около 72 часов.', 'Visa', 'We help with the e-visa. You need a passport, a photo and a form; a one-month visa is usually processed in about 72 hours.'],
  ['Встреча', 'В аэропорту Дели вас ждёт представитель с табличкой Monks & Monkeys Travels и вашей фамилией.', 'Arrival', 'A representative waits at Delhi airport with a Monks & Monkeys Travels sign and your surname.'],
  ['Дорога', 'Русскоговорящий гид, транспорт с кондиционером, отели у памятников, налоги и парковки уже в цене.', 'The road', 'A Russian-speaking guide, air-conditioned transport, hotels near the monuments, taxes and parking all included.'],
];
const WHY = [
  ['Принимающая компания в Дели', 'Мы сами ведём маршрут и гидов, поэтому вопросы на месте решаем быстро, в том числе по ночам.', 'A host company in Delhi', 'We run the route and the guides ourselves, so problems on the ground get solved fast, nights included.'],
  ['Русскоговорящие гиды', 'Штатные гиды с опытом рассказывают о людях и традициях, а не только о датах.', 'Russian-speaking guides', 'Experienced in-house guides talk about people and traditions, not only dates.'],
  ['Отели у главного', 'В классических турах выбираем отели поближе к памятникам: меньше времени в пробках, больше на отдых.', 'Hotels by the main sights', 'On classic tours we pick hotels close to the monuments: less time in traffic, more time to rest.'],
  ['Заезд от одного человека', 'В классическом Золотом треугольнике тур состоится даже для одного гостя. В остальных групповых турах группа от двух человек.', 'Departures from one guest', 'The classic Golden Triangle runs even for a single guest. Other group tours need two people.'],
  ['Не торопимся', 'Программа насыщенная, но с запасом на отдых и хорошие кадры.', 'No rush', 'A full programme, but with room to rest and to take the good photographs.'],
  ['Настоящая Индия', 'Кроме дворцов в программе живые рынки и знакомство с бытом.', 'The real India', 'Beyond the palaces: living markets and a glimpse of everyday life.'],
];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
// Muted warm washes for the month journey: one family, so the page never shouts.
const TINTS = ['#f3e5d0', '#f4e1c9', '#f3ddc9', '#f0d9cc', '#ecdcc9', '#e8dcc6', '#e6dccb', '#ebdcc9', '#f0dec6', '#f1dbc0', '#f0d6bb', '#edd2c0'];

export default function Home() {
  const stats = collectionStats();
  const hero = heroImgs[0];
  const months = catalog.items.filter((i) => i.c === '12x').sort((a, b) => a.m[0] - b.m[0]);
  const featured = catByCodes(['MnM 3-08', 'MnM 1-01', 'MnM 2-08']);
  const posts = articles().slice(0, 3);
  const total = catalog.items.length;
  const portal = heroImgs[1];
  const nb = catalog.items.filter((i) => i.c === 'neighbors');
  const nepal = nb.filter((i) => i.r[0] === 'Катманду'), bhutan = nb.filter((i) => i.r[0] === 'Паро');
  const lowest = (xs: typeof nb) => Math.min(...xs.filter((i) => i.p && i.p.c === 'USD').map((i) => i.p!.v));
  const NEIGH = [
    { k: 'nepal', ru: 'Непал', en: 'Nepal', dru: 'Катманду, Покхара и Читван: древние столицы, Гималаи и джунгли.', den: 'Kathmandu, Pokhara and Chitwan: ancient capitals, the Himalaya and the jungle.', xs: nepal },
    { k: 'bhutan', ru: 'Бутан', en: 'Bhutan', dru: 'Паро и Тхимпху: монастыри на скалах и страна, где меряют счастье.', den: 'Paro and Thimphu: cliffside monasteries and a country that measures happiness.', xs: bhutan },
  ];
  const cols = months.map((it) => TINTS[it.m[0] - 1]).join(',');
  return (
    <>
      <section className="hero" data-chapter="Начало" aria-labelledby="hero-title">
        <div className="hero__copy">
          <p className="eyebrow"><T ru="Принимаем гостей в Дели с" en="Welcoming guests in Delhi since" /> {site.since}</p>
          <h1 id="hero-title" className="display hero__title"><T ru="Индия" en="India," /> <em><T ru="без спешки" en="unhurried" /></em></h1>
          <p className="lede"><T ru="Авторские туры от принимающей компании из Дели: двенадцать маршрутов по месяцам, праздники и классика. Гиды говорят по-русски." en="Tours by a Delhi host company: twelve routes, one for every month, plus festivals and the classics. Our guides speak Russian." /></p>
          <div className="hero__cta">
            <Link className="btn" href="/destinations"><span className="btn__label"><T ru="Выбрать тур" en="Choose a tour" /></span><span className="btn__arrow" aria-hidden="true">→</span></Link>
            <a className="btn btn--ghost" href="#god"><span className="btn__label"><T ru="Куда в этом месяце" en="Where this month" /></span></a>
          </div>
        </div>
        <div className="hero__photo">
          <Bloom id={hero.id} w={hero.w} h={hero.h} c="#e9d9c3" alt="Тадж-Махал в Агре утром" sizes="(max-width: 767px) 82vw, 40vw" priority />
          <p className="hero__cap"><T ru="Агра, Тадж-Махал утром" en="Agra, the Taj Mahal in the morning" /></p>
        </div>
        <p className="hero__scroll" aria-hidden="true"><span><T ru="листайте" en="scroll" /></span><i /></p>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee__in">{[0, 1].map((k) => <span key={k}>Дели · Агра · Джайпур · Варанаси · Керала · Раджастхан · Гоа · Ладакх · Ришикеш · Удайпур · Кхаджурахо · Амритсар · </span>)}</div>
      </div>

      <dl className="band wrap">
        <div><dt data-count={site.since}>{site.since}</dt><dd><T ru="год основания" en="founded" /></dd></div>
        <div><dt data-count={total}>{total}</dt><dd><T ru="программ в каталоге" en="programmes" /></dd></div>
        <div><dt data-count="12">12</dt><dd><T ru="маршрутов по месяцам" en="monthly routes" /></dd></div>
        <div><dt>IATO</dt><dd><T ru="член ассоциации туроператоров" en="tour operators’ association member" /></dd></div>
      </dl>

      <section className="portal" data-chapter="Месяцы" aria-labelledby="portal-title">
        <div className="portal__stage">
          <p className="portal__hint eyebrow" aria-hidden="true"><T ru="Откройте дверь" en="Open the door" /></p>
          <div className="portal__img"><Image src={imgSrc(portal.id)} alt="" fill sizes="100vw" quality={72} /></div>
          <div className="portal__text">
            <p className="eyebrow"><T ru="Глава I" en="Chapter I" /></p>
            <h2 id="portal-title" className="display"><T ru="Двенадцать месяцев, двенадцать Индий" en="Twelve months, twelve Indias" /></h2>
          </div>
        </div>
      </section>

      <section className="hs-wrap" aria-label="Маршруты по месяцам">
      <div className="hs" id="god" data-colors={cols}>
        <div className="hs__head">
          <p className="eyebrow"><T ru="Выберите месяц" en="Choose a month" /></p>
          <p className="hs__count" aria-hidden="true">01 / {months.length}</p>
          <div className="hs__bar" aria-hidden="true"><i /></div>
        </div>
        <ul className="hs__track">
          {months.map((it) => (
            <li key={it.s} className="mcard">
              <Link href={`/destinations/${it.s}`}>
                <div className="mcard__img"><Image src={imgSrc(it.cv)} alt="" width={it.cw} height={it.ch} sizes="(max-width: 767px) 80vw, 30vw" quality={70} /></div>
                <span className="mcard__m display"><T ru={MONTHS[it.m[0] - 1]} en={MONTHS_EN[it.m[0] - 1]} /></span>
                <span className="mcard__r display">{it.t.split(':')[0]}</span>
                <span className="mcard__meta">{it.d} <T ru="дн." en="days" />{it.p ? ` · ${fmtPrice(it.p.c, it.p.v)}` : ''}</span>
              </Link>
            </li>
          ))}
          <li className="mcard mcard--end"><Link href="/destinations?c=12x" className="display"><T ru="Все маршруты" en="All routes" /> <span aria-hidden="true">→</span></Link></li>
        </ul>
      </div>
      </section>

      <section className="section wrap" data-chapter="Форматы" aria-labelledby="coll-title">
        <h2 id="coll-title" className="display h-xl" data-words><T ru="Как вы хотите поехать" en="How would you like to travel" /></h2>
        <ul className="index" data-stagger style={{ marginTop: 'clamp(2rem,4vw,3.5rem)' }}>
          {COLLECTION_ORDER.slice(0, 7).map((c) => {
            const s = stats[c];
            return (
              <li key={c}>
                <Link href={c === 'luxury' ? '/luxury' : `/destinations?c=${c}`} className="index__row">
                  <span className="index__name display">{COLLECTIONS[c].name}</span>
                  <span className="index__blurb">{COLLECTIONS[c].blurb}</span>
                  <span className="index__meta"><span>{s.n} <T ru="программ" en="programmes" /></span>{s.from && <span><T ru="от" en="from" /> {fmtPrice(s.from.cur, s.from.v)}</span>}</span>
                  <span className="index__arrow" aria-hidden="true">→</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="section wrap neigh" data-chapter="Соседи" aria-labelledby="neigh-title">
        <div className="neigh__head">
          <p className="eyebrow"><T ru="Рядом с Индией" en="Next door" /></p>
          <h2 id="neigh-title" className="display h-xl" data-words><T ru="Добавьте Гималаи" en="Add the Himalaya" /></h2>
          <p className="muted"><T ru="Непал и Бутан удобно соединить с Индией в одной поездке или поехать в них отдельно." en="Nepal and Bhutan pair naturally with India in one trip, or stand alone." /></p>
        </div>
        <div className="neigh__cards">
          {NEIGH.map((n) => (
            <Tilt key={n.k} className="ncard">
              <Link href={`/destinations?c=neighbors`}>
                <div className="ncard__img" data-z="0"><Image src={imgSrc(n.xs[0].cv)} alt="" fill sizes="(max-width: 767px) 80vw, 30vw" quality={72} /></div>
                <div className="ncard__body" data-z="46">
                  <h3 className="display"><T ru={n.ru} en={n.en} /></h3>
                  <p><T ru={n.dru} en={n.den} /></p>
                  <span className="ncard__meta">{n.xs.length} <T ru="программ" en="programmes" /> · <T ru="от" en="from" /> {fmtPrice('USD', lowest(n.xs))}</span>
                </div>
              </Link>
            </Tilt>
          ))}
        </div>
      </section>

      <section className="section wrap" data-chapter="Старт" aria-labelledby="feat-title">
        <div className="featured__head">
          <h2 id="feat-title" className="display h-xl" data-words><T ru="С чего начать" en="Where to start" /></h2>
          <Link className="alink" href="/destinations"><T ru="Все" en="All" /> {total} <T ru="программ" en="programmes" /> <span className="alink__arrow" aria-hidden="true">→</span></Link>
        </div>
        <div className="tickets">{featured.map((it, i) => <div key={it.s} data-reveal><Tilt max={6}><Ticket it={it} priority={i === 0} /></Tilt></div>)}</div>
      </section>

      <section className="section wrap" data-chapter="Забота" aria-labelledby="why-title">
        <h2 id="why-title" className="display h-xl" data-words><T ru="Почему с нами спокойно" en="Why travelling with us is easy" /></h2>
        <ul className="why__list" data-stagger>{WHY.map(([t, d, te, de]) => <li key={t}><h3 className="display h-m"><T ru={t} en={te} /></h3><p className="muted"><T ru={d} en={de} /></p></li>)}</ul>
      </section>

      <section className="section wrap" data-chapter="Путь" aria-labelledby="steps-title">
        <h2 id="steps-title" className="display h-xl" data-words><T ru="От заявки до первого чая в Дели" en="From request to the first chai in Delhi" /></h2>
        <ol className="steps" data-stagger>
          {STEPS.map(([t, d, te, de], i) => <li key={t}><span className="deva" aria-hidden="true">{['१', '२', '३', '४'][i]}</span><h3 className="display h-m"><T ru={t} en={te} /></h3><p><T ru={d} en={de} /></p></li>)}
        </ol>
        <p style={{ marginTop: '1.6rem' }}><Link className="alink" href="/blog/viza-v-indiyu-dlya-rossiyan"><T ru="Подробно про визу" en="More about the visa" /> <span className="alink__arrow" aria-hidden="true">→</span></Link></p>
      </section>

      <section className="section wrap" data-chapter="Статьи" aria-labelledby="posts-title">
        <div className="featured__head">
          <h2 id="posts-title" className="display h-xl" data-words><T ru="Что нужно знать до поездки" en="Before you go" /></h2>
          <Link className="alink" href="/blog"><T ru="Все статьи" en="All articles" /> <span className="alink__arrow" aria-hidden="true">→</span></Link>
        </div>
        <div className="posts__grid">
          {posts.map((a) => (
            <Link key={a.slug} href={`/blog/${a.slug}`} className="post" data-reveal>
              <Bloom id={a.cover} w={1400} h={900} c="#e9d9c3" alt="" sizes="(max-width: 767px) 92vw, 30vw" className="post__img" />
              <p className="post__tag">{a.tag} · {a.read} мин</p>
              <h3 className="display post__title">{a.title}</h3>
              <p className="muted">{a.lede}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section wrap g12 request" data-chapter="Заявка" id="zayavka" aria-labelledby="req-title">
        <div className="request__head">
          <h2 id="req-title" className="display h-xl" data-words><T ru="Подберём месяц и маршрут" en="Let us pick your month and route" /></h2>
          <p className="muted"><T ru="Напишите, когда можете поехать и что хотите увидеть. Пришлём программу, отели и цену на ваши даты." en="Tell us when you can travel and what you want to see. We will send a programme, hotels and a price for your dates." /></p>
          <ul className="direct">
            <li><a className="alink" href={site.whatsapp} target="_blank" rel="noopener noreferrer"><T ru="Написать в WhatsApp" en="Message on WhatsApp" /> <span className="alink__arrow" aria-hidden="true">→</span></a></li>
            <li><a className="alink" href={site.phoneHref}><T ru="Позвонить" en="Call" />: {site.phone}</a></li>
          </ul>
        </div>
        <div className="request__form"><RequestForm id="request" /></div>
      </section>
    </>
  );
}
