import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Clocks } from '@/components/Clocks';
import { RequestForm } from '@/components/RequestForm';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Контакты: офис в Дели, WhatsApp, Telegram',
  description: `Офис в Нью-Дели, ${site.phone}, WhatsApp, Telegram, ${site.email}. Оставьте заявку, и мы пришлём программу и цену на ваши даты.`,
};

const FAQ = [
  ['Нужна ли виза и как её получить?', 'Для россиян действует электронная виза (e-Visa): месячная, годовая и 5-летняя. Нужны загранпаспорт со сроком не менее 6 месяцев, цветное фото и анкета. Обычное рассмотрение занимает около 72 часов. Подробности в статье про визу.'],
  ['Что входит в стоимость тура?', 'Проживание, питание по программе, трансферы, экскурсии в транспорте с кондиционером, русскоговорящий гид, налоги, парковки и платные дороги. Авиабилеты, виза, страховка, входные билеты и чаевые оплачиваются отдельно, если в программе не сказано иное.'],
  ['Можно ли поехать одному?', 'Да. В групповых турах заезд гарантирован от одного человека, вам не придётся ждать, пока соберётся группа. Для комфорта можно заказать одноместный номер за доплату.'],
  ['Кто встретит в аэропорту?', 'Наш представитель встретит вас с табличкой Monks & Monkeys Travels и вашей фамилией. Групповой трансфер предоставляется гостям, которые летят рейсом Аэрофлота Москва, Дели, Москва; для других рейсов организуем индивидуальный трансфер за доплату.'],
  ['Как оплатить и что с отменой?', 'Условия отмены зависят от срока: без штрафа более чем за 15 дней до начала тура, дальше 10%, 25%, 50% и 100% стоимости. Полную таблицу мы публикуем в статье про условия.'],
  ['Во сколько можно связаться?', 'Мы на связи в WhatsApp и Telegram. Дели опережает Москву на 2,5 часа, поэтому утренние сообщения мы часто читаем раньше, чем вы проснётесь.'],
];

export default function Contact() {
  const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq).replace(/</g, '\\u003c') }} />
      <header className="page-head wrap">
        <p className="eyebrow" data-reveal="fade" data-intro>Контакты</p>
        <h1 className="display h-mega" data-split="lines" data-intro>Напишите нам</h1>
        <p className="lede" data-reveal="up" data-intro data-delay="0.2">Расскажите, когда можете поехать и что хотите увидеть. Мы пришлём программу, отели и цену на ваши даты.</p>
      </header>

      <section className="contact wrap g12" id="zayavka">
        <div className="contact__info">
          <Clocks />
          <ul className="contact__list">
            <li><span>WhatsApp</span><a className="ulink" href={site.whatsapp} target="_blank" rel="noopener">{site.mobile}</a></li>
            <li><span>Telegram</span><a className="ulink" href={site.telegram} target="_blank" rel="noopener">{site.mobile}</a></li>
            <li><span>Телефон офиса</span><a className="ulink" href={site.phoneHref}>{site.phone}</a></li>
            <li><span>Второй номер</span><a className="ulink" href="tel:+918010254885">{site.mobile2}</a></li>
            <li><span>Почта</span><a className="ulink" href={`mailto:${site.email}`}>{site.email}</a></li>
          </ul>
          <address className="contact__addr">
            <p className="footer__label">Головной офис</p>
            <p>{site.office}</p>
            <a className="alink" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('163 LGF Ashram New Delhi 110014')}`} target="_blank" rel="noopener">Открыть на карте <span className="alink__arrow" aria-hidden="true">→</span></a>
          </address>
        </div>
        <div className="contact__form">
          <Suspense><RequestForm id="contact-form" /></Suspense>
        </div>
      </section>

      <section className="faq section wrap g12" aria-labelledby="faq-h">
        <h2 id="faq-h" className="display h-xl">Частые вопросы</h2>
        <div className="faq__list">
          {FAQ.map(([q, a]) => (
            <details key={q}><summary className="display h-m">{q}</summary><p>{a}</p></details>
          ))}
        </div>
      </section>
    </>
  );
}
