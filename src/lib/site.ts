import type { Collection } from './types';

export const site = {
  name: 'MnM Travels',
  brand: 'Monks & Monkeys',
  url: 'https://mnm-travel-russian.vercel.app',
  since: 2008,
  office: '163 LGF, Ashram, New Delhi 110014, India',
  phone: '+91 11 4109 4061',
  phoneHref: 'tel:+911141094061',
  mobile: '+91 88008 89957',
  mobile2: '+91 80102 54885',
  whatsapp: 'https://wa.me/918800889957',
  telegram: 'https://t.me/+918800889957',
  email: 'admin@mnmtravels.in',
  title: 'MnM Travels: Индия в цвете. Туры для россиян',
  description: 'Авторские туры по Индии от принимающей компании из Дели: 12 маршрутов по месяцам, праздники, классика, люкс-поезда. Русскоговорящие гиды, группа от одного человека.',
};

export const NAV = [
  { href: '/', label: 'Главная' },
  { href: '/destinations', label: 'Направления' },
  { href: '/gallery', label: 'Галерея' },
  { href: '/about', label: 'О нас' },
  { href: '/blog', label: 'Блог' },
  { href: '/contact', label: 'Контакты' },
];

export const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
export const MONTHS_SHORT = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
export const MONTHS_GEN = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

// Gulal pigments: used only for the bloom, month marks and tags.
export const PIGMENTS = ['#FF8A1F', '#F4B400', '#E5007E', '#3F3FD0', '#00A89D', '#5DB32E', '#E8421B'];
// One pigment per month, taken from what that month looks like in its 12X region.
export const MONTH_COLOR = ['#E8421B', '#F4B400', '#E5007E', '#3F3FD0', '#00A89D', '#5DB32E', '#2A67C4', '#00A3C4', '#FF8A1F', '#D99A00', '#C2410C', '#D4006F'];

export const COLLECTIONS: Record<Collection, { name: string; short: string; blurb: string }> = {
  '12x': { name: 'Двенадцать месяцев', short: '12X India', blurb: 'Двенадцать авторских маршрутов, по одному на каждый месяц, когда регион раскрывается лучше всего.' },
  festival: { name: 'Праздники Индии', short: 'Праздники', blurb: 'Холи, Дивали, Махашиваратри, воздушные змеи и свадьбы: маршрут привязан к дате события.' },
  group: { name: 'Групповые туры', short: 'Группы', blurb: 'Еженедельные заезды круглый год. Тур состоится даже для одного человека.' },
  b2c: { name: 'Готовые поездки', short: 'Готовые', blurb: 'От дня в Дели до недели по Раджастхану. Цена в рублях, понятная сразу.' },
  private: { name: 'Индивидуальные туры', short: 'Индивидуальные', blurb: 'Свой гид, свой темп, свои даты. Больше шестидесяти готовых маршрутов, любой можно пересобрать.' },
  unique: { name: 'Малоизвестные регионы', short: 'Неизведанное', blurb: 'Племена Одиши и Чхаттисгарха, храмы без толпы.' },
  luxury: { name: 'Люкс и поезда', short: 'Люкс', blurb: 'Поезда-дворцы Махараджа Экспресс и Декан Одиссея, VIP-версии классики.' },
  short: { name: 'Короткие поездки', short: 'Короткие', blurb: 'От одного до трёх дней из Мумбая, Пуне, Кералы: добавьте к основному маршруту.' },
  neighbors: { name: 'Рядом с Индией', short: 'Соседи', blurb: 'Непал и Бутан: монастыри, горы и старые столицы.' },
};
export const COLLECTION_ORDER: Collection[] = ['12x', 'festival', 'group', 'b2c', 'private', 'unique', 'luxury', 'short', 'neighbors'];

export const fmtNum = (n: number) => n.toLocaleString('ru-RU').replace(/ /g, ' ');
export const fmtPrice = (cur: 'USD' | 'RUB', v: number) => (cur === 'USD' ? `$${fmtNum(v)}` : `${fmtNum(v)} ₽`);
export const imgSrc = (id: string) => `/p/${id}.jpg`;
export const plural = (n: number, one: string, few: string, many: string) => {
  const a = Math.abs(n) % 100, b = a % 10;
  return a > 10 && a < 20 ? many : b === 1 ? one : b > 1 && b < 5 ? few : many;
};
export const dayWord = (n: number) => `${n} ${plural(n, 'день', 'дня', 'дней')}`;
export const nightWord = (n: number) => `${n} ${plural(n, 'ночь', 'ночи', 'ночей')}`;
export const ruDate = (iso: string) => { const [y, m, d] = iso.split('-').map(Number); return `${d} ${MONTHS_GEN[m - 1]} ${y}`; };
export const DEV = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
export const devnum = (n: number) => String(n).split('').map((c) => DEV[+c]).join('');

/** Readable text colour (white or ink) on a given pigment, by WCAG contrast. */
export function onColor(hex: string): '#ffffff' | '#15122b' {
  const f = (c: number) => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const n = parseInt(hex.slice(1), 16);
  const L = 0.2126 * f(n >> 16) + 0.7152 * f((n >> 8) & 255) + 0.0722 * f(n & 255);
  return 1.05 / (L + 0.05) >= (L + 0.05) / 0.0576 ? '#ffffff' : '#15122b';
}
