import Link from 'next/link';
import { Bloom } from '@/components/Bloom';
import { Clocks } from '@/components/Clocks';
import { HeroBloom, type Scene } from '@/components/HeroBloom';
import { MonthSlices } from '@/components/MonthSlices';
import { RequestForm } from '@/components/RequestForm';
import { Ticket } from '@/components/Ticket';
import { articles } from '@/lib/blog';
import { catByCode, catByCodes, catalog, collectionStats, gallery, heroImgs } from '@/lib/data';
import { COLLECTIONS, COLLECTION_ORDER, fmtPrice, imgSrc, site } from '@/lib/site';

const SCENES: { place: string; when: string; alt: string; code: string }[] = [
  { place: 'Агра, Тадж-Махал на рассвете', when: 'в программе всех классических туров', alt: 'Тадж-Махал в утреннем тумане и отражение в реке Ямуна', code: 'MnM 1-01' },
  { place: 'Варанаси, утро на Ганге', when: 'священный город на берегу реки', alt: 'Садху в оранжевой одежде в лодке на Ганге', code: 'MnM 1-03' },
  { place: 'Пустыня Тар, Раджастхан', when: 'встреча Нового года среди дюн', alt: 'Всадник на верблюде и караван в пустыне на закате', code: 'MnM 3-05' },
  { place: 'Джайпур, Хава-Махал', when: 'розовый город в сумерках', alt: 'Дворец ветров в Джайпуре в вечерней подсветке', code: 'MnM 1-01' },
  { place: 'Амритсар, Золотой храм', when: 'ночью золото отражается в воде', alt: 'Золотой храм в Амритсаре ночью', code: 'MnM 3-03' },
  { place: 'Конарк, Одиша', when: 'храм-колесница бога солнца', alt: 'Каменные лестницы и скульптуры храма в Конарке на закате', code: 'MnM 2-12' },
];

const MANIFESTO: [string, string?][] = [
  ['Индия'], ['не'], ['одна'], ['страна,'], ['а'], ['двенадцать.', '#e5007e'], ['В'], ['январе'], ['Гуджарат'], ['пахнет'], ['бумажными'], ['змеями,', '#e8421b'],
  ['в'], ['июле'], ['юг'], ['звучит'], ['дождём,', '#3f3fd0'], ['в'], ['декабре'], ['Одиша'], ['живёт'], ['без'], ['спешки.', '#00a89d'],
  ['Поэтому'], ['мы'], ['возим'], ['не'], ['«в'], ['Индию»,'], ['а'], ['в'], ['нужный'], ['месяц.', '#ff8a1f'],
];

const STEPS = [
  ['Заявка', 'Напишите, когда можете поехать и что хотите увидеть. Мы пришлём программу, отели и цену на ваши даты.'],
  ['Виза', 'Помогаем с электронной визой. Нужны загранпаспорт, фото и анкета; месячную визу обычно рассматривают около 72 часов.'],
  ['Билеты', 'Авиабилеты вы покупаете отдельно. Групповой трансфер ждёт тех, кто летит рейсом Аэрофлота Москва, Дели, Москва.'],
  ['Встреча', 'В аэропорту Дели вас ждёт представитель с табличкой Monks & Monkeys Travels и вашей фамилией. Традиционное приветствие, завтрак, отель.'],
  ['Дорога', 'Русскоговорящий гид, транспорт с кондиционером, отели рядом с памятниками, все налоги и парковки уже в цене.'],
  ['Дома', 'Прощальный трансфер в аэропорт. А дальше обычно хочется вернуться: у нас есть другие двенадцать Индий.'],
];

const WHY = [
  ['Заезд от одного человека', 'Не нужно ждать, пока соберётся группа: ваше путешествие состоится в любом случае.'],
  ['Индия из первых рук', 'Мы принимающий оператор в Дели, а не посредник. Вопросы на месте решаем сами, круглосуточно.'],
  ['Свои гиды', 'Штатные русскоговорящие гиды с опытом: не пересказывают факты, а влюбляют в культуру и традиции.'],
  ['Отели рядом с главным', 'Выбираем отели поближе к памятникам и только те, в которых уверены сами. Это до двух часов в день без пробок.'],
  ['Насыщенно, но без спешки', 'Каждый час программы использован с пользой, но с запасом на отдых и фото у лучших видов.'],
  ['Настоящая Индия', 'Кроме дворцов в программе живые рынки и знакомство с бытом, чтобы увидеть страну такой, какая она есть.'],
];

export default function Home() {
  const stats = collectionStats();
  const scenes: Scene[] = heroImgs.map((im, i) => {
    const it = catByCode(SCENES[i].code);
    return { id: im.id, w: im.w, h: im.h, place: SCENES[i].place, when: SCENES[i].when, alt: SCENES[i].alt, slug: it?.s ?? '', title: it ? it.t : 'Подобрать тур' };
  });
  const months12 = catalog.items.filter((i) => i.c === '12x').sort((a, b) => a.m[0] - b.m[0]);
  const featured = catByCodes(['MnM 3-08', 'MnM 2-08', 'MnM 1-01', 'MnM 4A-25', 'MnM 3-05', 'B10']);
  const preview = (c: string) => catalog.items.find((i) => i.c === c && i.cv)?.cv ?? '';
  const strip = [0, 3, 8, 14, 22, 31, 40, 52, 60, 75].map((i) => gallery[i]).filter(Boolean);
  const posts = articles().slice(0, 3);
  const total = catalog.items.length;

  return (
    <>
      {/* HERO: grey to colour. Text on snow, the bloom on the right. */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__grid">
          <div className="hero__copy">
            <p className="eyebrow" data-reveal="fade" data-intro>Принимаем гостей в Дели с {site.since} года</p>
            <h1 id="hero-title" className="display h-mega hero__title" data-split="lines" data-intro>Индия<br /><span className="hero__colour">в цвете</span></h1>
            <p className="lede hero__lede" data-split="lines" data-intro data-delay="0.25">Авторские туры от принимающей компании из Дели. Двенадцать маршрутов по месяцам, праздники, классика и поезда-дворцы. Гиды говорят по-русски, группа от одного человека.</p>
            <div className="hero__cta" data-reveal="up" data-intro data-delay="0.4">
              <Link className="btn" href="/destinations"><span className="btn__label">Выбрать тур</span><span className="btn__arrow" aria-hidden="true">→</span></Link>
              <a className="btn btn--ghost" href="#god"><span className="btn__label">Куда в этом месяце</span></a>
            </div>
          </div>
          <div className="hero__visual">
            <Bloom id={scenes[0].id} w={scenes[0].w} h={scenes[0].h} c="#9fb4b9" alt={scenes[0].alt} sizes="(max-width: 767px) 100vw, 58vw" className="hero__fallback" priority />
            <HeroBloom scenes={scenes} />
          </div>
          <div className="hero__strip">
            <dl className="hero__facts">
              <div><dt>{site.since}</dt><dd>год основания</dd></div>
              <div><dt>{total}</dt><dd>программ в каталоге</dd></div>
              <div><dt>1</dt><dd>человек для заезда</dd></div>
              <div><dt>IATO</dt><dd>член ассоциации туроператоров</dd></div>
            </dl>
            <Clocks />
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="manifesto wrap" aria-label="Наш подход">
        <p className="manifesto__eyebrow eyebrow">Почему двенадцать</p>
        <p className="manifesto__text display" data-manifesto>
          {MANIFESTO.map(([w, c], i) => <span key={i} className="mw" data-c={c}>{w}{' '}</span>)}
        </p>
      </section>

      {/* MONTHS */}
      <section className="months" id="god" aria-labelledby="months-title">
        <div className="wrap months__head g12">
          <h2 id="months-title" className="display h-xl months__title" data-split="lines">Выберите месяц</h2>
          <p className="months__lede" data-reveal="up">Коллекция 12X India: двенадцать авторских маршрутов, и каждый проходит один раз в год, когда регион раскрывается ярче всего. Откройте месяц, в который можете поехать.</p>
        </div>
        <div className="wrap"><MonthSlices items={months12} /></div>
      </section>

      {/* COLLECTIONS INDEX */}
      <section className="collections section wrap" aria-labelledby="coll-title">
        <h2 id="coll-title" className="display h-xl" data-split="lines">Как вы хотите поехать</h2>
        <ul className="index" data-index>
          {COLLECTION_ORDER.slice(0, 7).map((c) => {
            const s = stats[c];
            return (
              <li key={c}>
                <Link href={`/destinations?c=${c}`} className="index__row" data-preview={imgSrc(preview(c))}>
                  <span className="index__name display">{COLLECTIONS[c].name}</span>
                  <span className="index__blurb">{COLLECTIONS[c].blurb}</span>
                  <span className="index__meta">
                    <span>{s.n} программ</span>
                    {s.from && <span>от {fmtPrice(s.from.cur, s.from.v)}</span>}
                  </span>
                  <span className="index__arrow" aria-hidden="true">→</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="preview" aria-hidden="true"><img alt="" width={800} height={600} /></div>
      </section>

      {/* FEATURED */}
      <section className="featured section wrap" aria-labelledby="feat-title">
        <div className="featured__head">
          <h2 id="feat-title" className="display h-xl" data-split="lines">С чего начать</h2>
          <Link className="alink" href="/destinations">Все {total} программ <span className="alink__arrow" aria-hidden="true">→</span></Link>
        </div>
        <div className="tickets">
          {featured.map((it, i) => <div key={it.s} className="tickets__cell" data-reveal="up" data-delay={String((i % 3) * 0.08)}><Ticket it={it} priority={i < 3} /></div>)}
        </div>
      </section>

      {/* JOURNEY */}
      <section className="journey section wrap" aria-labelledby="journey-title">
        <div className="journey__head">
          <h2 id="journey-title" className="display h-xl" data-split="lines">От заявки до первого чая в Дели</h2>
          <p className="muted" data-reveal="up">Шесть шагов, и на каждом вам помогает человек, а не форма.</p>
        </div>
        <ol className="rail" data-rail>
          <span className="rail__line" aria-hidden="true"><span className="rail__fill" /></span>
          {STEPS.map(([t, d], i) => (
            <li key={t} className="rail__step">
              <span className="rail__num deva" aria-hidden="true">{['१', '२', '३', '४', '५', '६'][i]}</span>
              <div>
                <h3 className="display h-m">{t}</h3>
                <p>{d}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="journey__more"><Link className="alink" href="/blog/viza-v-indiyu-dlya-rossiyan">Подробно про визу <span className="alink__arrow" aria-hidden="true">→</span></Link></p>
      </section>

      {/* WHY */}
      <section className="why section wrap" aria-labelledby="why-title">
        <h2 id="why-title" className="display h-xl why__title" data-split="lines">Почему с нами спокойно</h2>
        <ul className="why__list">
          {WHY.map(([t, d], i) => (
            <li key={t} data-reveal="up" data-delay={String((i % 3) * 0.08)}>
              <h3 className="display h-m">{t}</h3>
              <p className="muted">{d}</p>
            </li>
          ))}
        </ul>
        <p className="why__trust" data-reveal="fade">Член Индийской ассоциации туроператоров (IATO) · Travellers’ Choice на Tripadvisor · С {site.since} года</p>
      </section>

      {/* GALLERY STRIP */}
      <section className="strip section" aria-labelledby="strip-title">
        <div className="wrap strip__head">
          <h2 id="strip-title" className="display h-xl" data-split="lines">Фотографии из программ</h2>
          <Link className="alink" href="/gallery">Вся галерея <span className="alink__arrow" aria-hidden="true">→</span></Link>
        </div>
        <ul className="strip__row">
          {strip.map((g, i) => (
            <li key={g.id} className="strip__item" style={{ '--i': i } as React.CSSProperties}>
              <Link href={`/destinations/${g.s}`} aria-label={g.t}>
                <Bloom id={g.id} w={g.w} h={g.h} c={g.c} alt="" sizes="(max-width: 767px) 60vw, 22vw" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* BLOG */}
      <section className="posts section wrap" aria-labelledby="posts-title">
        <div className="featured__head">
          <h2 id="posts-title" className="display h-xl" data-split="lines">Что нужно знать до поездки</h2>
          <Link className="alink" href="/blog">Все статьи <span className="alink__arrow" aria-hidden="true">→</span></Link>
        </div>
        <div className="posts__grid">
          {posts.map((a, i) => (
            <Link key={a.slug} href={`/blog/${a.slug}`} className="post" data-reveal="up" data-delay={String(i * 0.08)}>
              <Bloom id={a.cover} w={1400} h={900} c="#d8d8e0" alt="" sizes="(max-width: 767px) 92vw, 30vw" className="post__img" />
              <p className="post__tag">{a.tag} · {a.read} мин</p>
              <h3 className="display h-m post__title">{a.title}</h3>
              <p className="muted">{a.lede}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* REQUEST */}
      <section className="request section wrap g12" id="zayavka" aria-labelledby="req-title">
        <div className="request__head">
          <h2 id="req-title" className="display h-xl" data-split="lines">Подберём месяц и маршрут</h2>
          <p className="muted" data-reveal="up">Напишите, когда можете поехать и что хотите увидеть. Пришлём программу, отели и цену на ваши даты.</p>
          <ul className="direct" data-reveal="up" data-delay="0.1">
            <li><a className="alink" href={site.whatsapp} target="_blank" rel="noopener">Написать в WhatsApp <span className="alink__arrow" aria-hidden="true">→</span></a></li>
            <li><a className="alink" href={site.phoneHref}>Позвонить, {site.phone}</a></li>
          </ul>
        </div>
        <div className="request__form"><RequestForm id="request" /></div>
      </section>
    </>
  );
}
