import Link from 'next/link';
import { Bloom } from '@/components/Bloom';
import { RequestForm } from '@/components/RequestForm';
import { Ticket } from '@/components/Ticket';
import { articles } from '@/lib/blog';
import { catByCodes, catalog, collectionStats, heroImgs } from '@/lib/data';
import { COLLECTIONS, COLLECTION_ORDER, MONTHS, fmtPrice, site } from '@/lib/site';

const STEPS = [
  ['Заявка', 'Напишите, когда можете поехать и что хотите увидеть. Пришлём программу, отели и цену на ваши даты.'],
  ['Виза', 'Поможем с электронной визой. Нужны загранпаспорт, фото и анкета; месячную визу обычно рассматривают около 72 часов.'],
  ['Встреча', 'В аэропорту Дели вас ждёт представитель с табличкой Monks & Monkeys Travels и вашей фамилией.'],
  ['Дорога', 'Русскоговорящий гид, транспорт с кондиционером, отели у памятников, налоги и парковки уже в цене.'],
];
const WHY = [
  ['Принимающая компания в Дели', 'Мы сами ведём маршрут и гидов, поэтому вопросы на месте решаем быстро, в том числе по ночам.'],
  ['Русскоговорящие гиды', 'Штатные гиды с опытом рассказывают о людях и традициях, а не только о датах.'],
  ['Отели у главного', 'В классических турах выбираем отели поближе к памятникам: меньше времени в пробках, больше на отдых.'],
  ['Заезд от одного человека', 'В классическом Золотом треугольнике тур состоится даже для одного гостя. В остальных групповых турах группа от двух человек.'],
  ['Не торопимся', 'Программа насыщенная, но с запасом на отдых и хорошие кадры.'],
  ['Настоящая Индия', 'Кроме дворцов в программе живые рынки и знакомство с бытом.'],
];

export default function Home() {
  const stats = collectionStats();
  const hero = heroImgs[0];
  const months = catalog.items.filter((i) => i.c === '12x').sort((a, b) => a.m[0] - b.m[0]);
  const featured = catByCodes(['MnM 3-08', 'MnM 1-01', 'MnM 2-08']);
  const posts = articles().slice(0, 3);
  const total = catalog.items.length;
  const first = months[0];
  void first;
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__copy">
          <p className="eyebrow">Принимаем гостей в Дели с {site.since} года</p>
          <h1 id="hero-title" className="display hero__title" data-reveal>Индия без спешки</h1>
          <p className="lede" data-reveal>Авторские туры от принимающей компании из Дели: двенадцать маршрутов по месяцам, праздники и классика. Гиды говорят по-русски.</p>
          <div className="hero__cta">
            <Link className="btn" href="/destinations"><span className="btn__label">Выбрать тур</span><span className="btn__arrow" aria-hidden="true">→</span></Link>
            <a className="btn btn--ghost" href="#god"><span className="btn__label">Куда в этом месяце</span></a>
          </div>
        </div>
        <div className="hero__photo">
          <Bloom id={hero.id} w={hero.w} h={hero.h} c="#e9d9c3" alt="Тадж-Махал в утреннем тумане и отражение в реке Ямуна" sizes="(max-width: 767px) 82vw, 40vw" priority />
          <p className="hero__cap">Агра, Тадж-Махал на рассвете</p>
        </div>
        <dl className="hero__facts">
          <div><dt>{site.since}</dt><dd>год основания</dd></div>
          <div><dt>{total}</dt><dd>программ в каталоге</dd></div>
          <div><dt>12</dt><dd>маршрутов по месяцам</dd></div>
          <div><dt>IATO</dt><dd>член ассоциации туроператоров</dd></div>
        </dl>
      </section>

      <section className="section wrap" id="god" aria-labelledby="months-title">
        <div className="featured__head">
          <h2 id="months-title" className="display h-xl" data-reveal>Двенадцать месяцев, двенадцать Индий</h2>
          <Link className="alink" href="/destinations?c=12x">Все маршруты <span className="alink__arrow" aria-hidden="true">→</span></Link>
        </div>
        <div className="months__grid">
          {months.map((it) => (
            <Link key={it.s} href={`/destinations/${it.s}`} className="mcell">
              <span className="mcell__m">{MONTHS[it.m[0] - 1]}</span>
              <span className="mcell__r display">{it.t.split(':')[0]}</span>
              <span className="mcell__meta">{it.d} дн.{it.p ? ` · от ${fmtPrice(it.p.c, it.p.v)}` : ''}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section wrap" aria-labelledby="coll-title">
        <h2 id="coll-title" className="display h-xl" data-reveal>Как вы хотите поехать</h2>
        <ul className="index" style={{ marginTop: 'clamp(2rem,4vw,3.5rem)' }}>
          {COLLECTION_ORDER.slice(0, 7).map((c) => {
            const s = stats[c];
            return (
              <li key={c}>
                <Link href={c === 'luxury' ? '/luxury' : `/destinations?c=${c}`} className="index__row">
                  <span className="index__name display">{COLLECTIONS[c].name}</span>
                  <span className="index__blurb">{COLLECTIONS[c].blurb}</span>
                  <span className="index__meta"><span>{s.n} программ</span>{s.from && <span>от {fmtPrice(s.from.cur, s.from.v)}</span>}</span>
                  <span className="index__arrow" aria-hidden="true">→</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="section wrap" aria-labelledby="feat-title">
        <div className="featured__head">
          <h2 id="feat-title" className="display h-xl" data-reveal>С чего начать</h2>
          <Link className="alink" href="/destinations">Все {total} программ <span className="alink__arrow" aria-hidden="true">→</span></Link>
        </div>
        <div className="tickets">{featured.map((it, i) => <div key={it.s} data-reveal><Ticket it={it} priority={i === 0} /></div>)}</div>
      </section>

      <section className="section wrap" aria-labelledby="why-title">
        <h2 id="why-title" className="display h-xl" data-reveal>Почему с нами спокойно</h2>
        <ul className="why__list">{WHY.map(([t, d]) => <li key={t} data-reveal><h3 className="display h-m">{t}</h3><p className="muted">{d}</p></li>)}</ul>
      </section>

      <section className="section wrap" aria-labelledby="steps-title">
        <h2 id="steps-title" className="display h-xl" data-reveal>От заявки до первого чая в Дели</h2>
        <ol className="steps">
          {STEPS.map(([t, d], i) => <li key={t} data-reveal><span className="deva" aria-hidden="true">{['१', '२', '३', '४'][i]}</span><h3 className="display h-m">{t}</h3><p>{d}</p></li>)}
        </ol>
        <p style={{ marginTop: '1.6rem' }}><Link className="alink" href="/blog/viza-v-indiyu-dlya-rossiyan">Подробно про визу <span className="alink__arrow" aria-hidden="true">→</span></Link></p>
      </section>

      <section className="section wrap" aria-labelledby="posts-title">
        <div className="featured__head">
          <h2 id="posts-title" className="display h-xl" data-reveal>Что нужно знать до поездки</h2>
          <Link className="alink" href="/blog">Все статьи <span className="alink__arrow" aria-hidden="true">→</span></Link>
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

      <section className="section wrap g12 request" id="zayavka" aria-labelledby="req-title">
        <div className="request__head">
          <h2 id="req-title" className="display h-xl" data-reveal>Подберём месяц и маршрут</h2>
          <p className="muted">Напишите, когда можете поехать и что хотите увидеть. Пришлём программу, отели и цену на ваши даты.</p>
          <ul className="direct">
            <li><a className="alink" href={site.whatsapp} target="_blank" rel="noopener noreferrer">Написать в WhatsApp <span className="alink__arrow" aria-hidden="true">→</span></a></li>
            <li><a className="alink" href={site.phoneHref}>Позвонить: {site.phone}</a></li>
          </ul>
        </div>
        <div className="request__form"><RequestForm id="request" /></div>
      </section>
    </>
  );
}
