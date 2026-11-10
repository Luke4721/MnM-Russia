'use client';
// The catalogue: every program, filterable by collection, month, length, theme and text. State lives in the URL.
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Ticket } from './Ticket';
import { COLLECTION_ORDER, MONTHS, MONTH_COLOR, MONTHS_SHORT, plural } from '@/lib/site';
import type { Catalog, CatItem, Collection } from '@/lib/types';

const DAYS = [['1-3', 'до 3 дней', 1, 3], ['4-7', '4–7 дней', 4, 7], ['8-10', '8–10 дней', 8, 10], ['11+', 'от 11 дней', 11, 99]] as const;
const PAGE = 24;
const usd = (it: CatItem) => (it.p ? (it.p.c === 'RUB' ? it.p.v / 90 : it.p.v) : 1e9);
const ORDER = [...COLLECTION_ORDER.filter((c) => c !== 'short' && c !== 'neighbors'), 'neighbors', 'short'];

export function CatalogClient({ catalog }: { catalog: Catalog }) {
  const router = useRouter(), path = usePathname(), sp = useSearchParams();
  const get = (k: string) => sp.get(k) || '';
  const c = get('c') as Collection | '', m = +get('m') || 0, t = get('t'), d = get('d'), q = get('q'), s = get('s') || 'rec', onlyPriced = get('p') === '1';
  const [shown, setShown] = useState(PAGE);
  const [open, setOpen] = useState(false);
  const [qText, setQText] = useState(q);
  const grid = useRef<HTMLDivElement>(null);

  const set = (patch: Record<string, string>) => {
    const n = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(patch)) { if (v) n.set(k, v); else n.delete(k); }
    router.replace(`${path}${n.size ? '?' + n : ''}`, { scroll: false });
    setShown(PAGE);
  };
  useEffect(() => { const h = setTimeout(() => { if (qText !== q) set({ q: qText }); }, 280); return () => clearTimeout(h); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [qText]);

  const list = useMemo(() => {
    const ql = q.trim().toLowerCase();
    const bucket = DAYS.find((x) => x[0] === d);
    let r = catalog.items.filter((it) => {
      if (c && it.c !== c) return false;
      if (m && it.m.length && !it.m.includes(m)) return false;
      if (t !== '' && !it.tg.includes(+t)) return false;
      if (bucket && (it.d < bucket[2] || it.d > bucket[3])) return false;
      if (onlyPriced && !it.p) return false;
      if (ql && !(it.t + ' ' + it.r.join(' ') + ' ' + it.g).toLowerCase().includes(ql)) return false;
      return true;
    });
    r = [...r].sort((a, b) => (s === 'days' ? a.d - b.d : s === 'price' ? usd(a) - usd(b) : ORDER.indexOf(a.c) - ORDER.indexOf(b.c) || a.k.localeCompare(b.k, 'ru', { numeric: true })));
    return r;
  }, [catalog, c, m, t, d, q, s, onlyPriced]);

  const counts = useMemo(() => { const o: Record<string, number> = {}; catalog.items.forEach((it) => { o[it.c] = (o[it.c] || 0) + 1; }); return o; }, [catalog]);
  const visible = list.slice(0, shown);

  // Tickets arrive with a short rise whenever the result set changes.
  useEffect(() => {
    const el = grid.current; if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cells = el.querySelectorAll('.tickets__cell');
    gsap.fromTo(cells, { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.035, ease: 'expo.out', overwrite: true, clearProps: 'transform,opacity,visibility' });
  }, [c, m, t, d, q, s, onlyPriced]);

  const active = [c, m, t, d, q, onlyPriced ? 1 : ''].filter(Boolean).length;
  const reset = () => { setQText(''); router.replace(path, { scroll: false }); setShown(PAGE); };

  return (
    <div className="catalog">
      <div className="catalog__bar wrap">
        <div className="catalog__tabs" role="group" aria-label="Коллекции">
          <button type="button" className="chip" aria-pressed={!c} onClick={() => set({ c: '' })}>Все <span>{catalog.items.length}</span></button>
          {ORDER.map((k) => <button key={k} type="button" className="chip" aria-pressed={c === k} onClick={() => set({ c: c === k ? '' : k })}>{catalog.collections[k as Collection]} <span>{counts[k]}</span></button>)}
        </div>
        <button type="button" className="catalog__toggle btn btn--ghost btn--small" aria-expanded={open} aria-controls="filters" onClick={() => setOpen((o) => !o)}><span className="btn__label">Фильтры{active ? ` (${active})` : ''}</span></button>
        <div className={`filters ${open ? 'is-open' : ''}`} id="filters">
          <fieldset className="filters__group">
            <legend>Месяц поездки</legend>
            <div className="filters__months">
              {MONTHS.map((n, i) => (
                <button key={n} type="button" className="mchip" style={{ '--mc': MONTH_COLOR[i] } as React.CSSProperties} aria-pressed={m === i + 1} aria-label={n} onClick={() => set({ m: m === i + 1 ? '' : String(i + 1) })}>{MONTHS_SHORT[i]}</button>
              ))}
            </div>
          </fieldset>
          <fieldset className="filters__group">
            <legend>Длительность</legend>
            <div className="filters__row">{DAYS.map(([k, label]) => <button key={k} type="button" className="chip" aria-pressed={d === k} onClick={() => set({ d: d === k ? '' : k })}>{label}</button>)}</div>
          </fieldset>
          <fieldset className="filters__group filters__group--wide">
            <legend>Тема</legend>
            <div className="filters__row">{catalog.tags.map((tg, i) => <button key={tg} type="button" className="chip" aria-pressed={t === String(i)} onClick={() => set({ t: t === String(i) ? '' : String(i) })}>{tg}</button>)}</div>
          </fieldset>
          <div className="filters__tools">
            <label className="field"><span>Поиск по городу или названию</span><input type="search" value={qText} onChange={(e) => setQText(e.target.value)} placeholder="Варанаси, тигры, Гоа" /></label>
            <label className="field"><span>Сортировка</span><select value={s} onChange={(e) => set({ s: e.target.value === 'rec' ? '' : e.target.value })}><option value="rec">Сначала рекомендуемые</option><option value="days">Короче сначала</option><option value="price">Дешевле сначала</option></select></label>
            <label className="calc__check"><input type="checkbox" checked={onlyPriced} onChange={(e) => set({ p: e.target.checked ? '1' : '' })} /> <span>Только с ценой на сайте</span></label>
          </div>
        </div>
      </div>

      <div className="catalog__count wrap" aria-live="polite">
        <p>{list.length} {plural(list.length, 'программа', 'программы', 'программ')}{active ? ' по вашим условиям' : ''}</p>
        {active > 0 && <button type="button" className="alink" onClick={reset}>Сбросить фильтры</button>}
      </div>

      <div className="wrap">
        {visible.length ? (
          <div className="tickets tickets--grid" ref={grid}>
            {visible.map((it) => <div key={it.s} className="tickets__cell"><Ticket it={it} veil={false} /></div>)}
          </div>
        ) : (
          <div className="catalog__empty">
            <p className="display h-l">По таким условиям пока ничего нет</p>
            <p className="muted">Попробуйте другой месяц или уберите часть фильтров. Или напишите нам: любой маршрут можно собрать под ваши даты.</p>
            <button type="button" className="btn" onClick={reset}><span className="btn__label">Сбросить фильтры</span></button>
          </div>
        )}
        {list.length > shown && (
          <div className="catalog__more"><button type="button" className="btn btn--ghost" onClick={() => setShown((x) => x + PAGE)}><span className="btn__label">Показать ещё {Math.min(PAGE, list.length - shown)}</span></button></div>
        )}
      </div>
    </div>
  );
}
