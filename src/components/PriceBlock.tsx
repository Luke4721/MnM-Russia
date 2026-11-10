'use client';
// Price block: the client's published tables shown as they are, plus a calculator built from the first table when it has a clear shape.
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { fmtNum, fmtPrice } from '@/lib/site';

type Cur = 'USD' | 'RUB';
type Money = { v: number; cur: Cur };
const money = (s: string): Money | null => {
  const m = s.match(/(\d[\d\s]*\d|\d)/);
  if (!m) return null;
  const cur: Cur | null = /RUB|₽/.test(s) ? 'RUB' : /USD|\$/.test(s) ? 'USD' : /^\s*\d{3,}\s*$/.test(s) ? null : null;
  const v = +m[1].replace(/\s/g, '');
  return cur && v >= 30 ? { v, cur } : null;
};
const SUPP = /доплат|одноместн|\bSGL\b|supplement/i;
const SKIP = /вычет|праздн|Групповой тур \d|Рождеств|Новогод|Group Leader|ужин/i;
const pretty = (s: string) => s.replace(/\*/g, '★').replace(/\bDeluxe\b/gi, 'Делюкс').replace(/\bPerson\b/gi, 'чел.').replace(/\s*\/\s*$/, '').replace(/\s+\/\s+(Сезон|Низкий).*$/i, '');

type Model = { cols: { i: number; label: string }[]; rows: { label: string; cells: (Money | null)[] }[]; singles: Record<number, Money> | null; singleAny: Money | null; hb: Record<number, Money> | null; extras: { label: string; value: string }[] };
function model(t: string[][]): Model | null {
  const hasNum = (r: string[]) => r.some((c) => money(c));
  const header = t[0] && !hasNum(t[0]) ? t[0] : null;
  const body = t.slice(header ? 1 : 0);
  const cols = (header || body[0] || []).map((label, i) => ({ i, label: pretty(label) })).filter((c) => (header ? c.label && (c.i > 0 || body.some((r) => money(r[0] || ''))) : true));
  const labelCol = header ? !body.some((r) => money(r[0] || '')) : false;
  const dataCols = cols.filter((c) => !(labelCol && c.i === 0)).filter((c) => body.some((r) => money(r[c.i] || '')));
  if (!dataCols.length) return null;
  const rows: Model['rows'] = []; const extras: Model['extras'] = [];
  let singles: Record<number, Money> | null = null, singleAny: Money | null = null, hb: Record<number, Money> | null = null;
  for (const r of body) {
    const label = pretty(r[0] || '');
    const isSupp = SUPP.test(label);
    if (SKIP.test(label) && !/HB/i.test(label)) continue;
    const cells = dataCols.map((c) => money(r[c.i] || ''));
    if (!cells.some(Boolean)) { if (r.length === 2 && money(r[1])) { const m = money(r[1])!; if (isSupp) singleAny = m; else extras.push({ label, value: fmtPrice(m.cur, m.v) }); } continue; }
    if (isSupp && /одноместн|SGL|single/i.test(label)) { singles = Object.fromEntries(dataCols.map((c, k) => [c.i, cells[k]]).filter(([, v]) => v)) as Record<number, Money>; continue; }
    if (/HB|ужин/i.test(label) && /доплат/i.test(label)) { hb = Object.fromEntries(dataCols.map((c, k) => [c.i, cells[k]]).filter(([, v]) => v)) as Record<number, Money>; continue; }
    if (isSupp) { extras.push({ label, value: cells.filter(Boolean).map((m) => fmtPrice(m!.cur, m!.v)).join(' / ') }); continue; }
    rows.push({ label: labelCol || !header ? label : '', cells });
  }
  if (!rows.length) return null;
  return { cols: dataCols, rows, singles, singleAny, hb, extras };
}

function Table({ rows }: { rows: string[][] }) {
  const head = rows[0] && !rows[0].some((c) => money(c)) ? rows[0] : null;
  return (
    <div className="ptable-wrap">
      <table className="ptable">
        {head && <thead><tr>{head.map((h, i) => <th key={i} scope="col">{pretty(h)}</th>)}</tr></thead>}
        <tbody>
          {rows.slice(head ? 1 : 0).map((r, i) => <tr key={i}>{r.map((c, j) => (j === 0 && !money(c) ? <th key={j} scope="row">{pretty(c)}</th> : <td key={j}>{pretty(c)}</td>))}</tr>)}
        </tbody>
      </table>
    </div>
  );
}

export function PriceBlock({ tables, rub, note, kind, code }: { tables: string[][][]; rub: { note: string; tables: string[][][] } | null; note: string; kind: 'usd' | 'rub' | 'request'; code: string }) {
  const m = useMemo(() => (tables[0] ? model(tables[0]) : null), [tables]);
  const [col, setCol] = useState(0), [row, setRow] = useState(0), [n, setN] = useState(2), [single, setSingle] = useState(0), [hbOn, setHb] = useState(false);
  const [rate, setRate] = useState<string>('');
  const [rateInfo, setRateInfo] = useState('');
  useEffect(() => {
    if (!m || m.cols[0] && !tables[0].flat().some((c) => /USD|\$/.test(c))) return;
    fetch('https://www.cbr-xml-daily.ru/daily_json.js').then((r) => r.json()).then((j) => { setRate(String(Math.round(j.Valute.USD.Value * 100) / 100).replace('.', ',')); setRateInfo(`курс ЦБ на ${new Date(j.Date).toLocaleDateString('ru-RU')}`); }).catch(() => {});
  }, [m, tables]);

  if (kind === 'request' || !m) {
    return (
      <div className="price price--request">
        <p className="display h-m">Цена зависит от дат, отелей и состава группы</p>
        <p className="muted">Мы рассчитаем её под ваши даты и пришлём вместе с программой и отелями.</p>
        <Link className="btn" href={`/contact?tur=${encodeURIComponent(code)}#zayavka`}><span className="btn__label">Узнать цену</span><span className="btn__arrow" aria-hidden="true">→</span></Link>
      </div>
    );
  }
  const c = Math.min(col, m.cols.length - 1), r = Math.min(row, m.rows.length - 1);
  const pp = m.rows[r].cells[c] ?? m.rows[r].cells.find(Boolean)!;
  const sg = (m.singles && m.singles[m.cols[c].i]) || m.singleAny;
  const hbv = m.hb && m.hb[m.cols[c].i];
  const singles = Math.min(single, n);
  const total = pp.v * n + (sg ? sg.v * singles : 0) + (hbv && hbOn ? hbv.v * n : 0);
  const rateN = parseFloat(rate.replace(',', '.'));
  const rubTotal = pp.cur === 'USD' && rateN > 0 ? Math.round((total * rateN) / 100) * 100 : null;
  const optLabel = (x: { label: string }, i: number) => x.label || `Вариант ${i + 1}`;
  return (
    <div className="price">
      <div className="calc">
        <p className="calc__title display h-m">Посчитайте поездку</p>
        <div className="calc__grid">
          {m.cols.length > 1 && (
            <label className="field"><span>{m.rows[0].label ? 'Вариант' : 'Размер группы'}</span>
              <select value={c} onChange={(e) => setCol(+e.target.value)}>{m.cols.map((x, i) => <option key={i} value={i}>{optLabel(x, i)}</option>)}</select>
            </label>
          )}
          {m.rows.length > 1 && (
            <label className="field"><span>{'Состав и категория'}</span>
              <select value={r} onChange={(e) => setRow(+e.target.value)}>{m.rows.map((x, i) => <option key={i} value={i}>{optLabel(x, i)}</option>)}</select>
            </label>
          )}
          <label className="field field--short"><span>Человек</span>
            <input type="number" min={1} max={20} value={n} onChange={(e) => { const v = Math.max(1, Math.min(20, +e.target.value || 1)); setN(v); setSingle((s) => Math.min(s, v)); }} />
          </label>
          {sg && <label className="field field--short"><span>Одноместных номеров</span><input type="number" min={0} max={n} value={singles} onChange={(e) => setSingle(Math.max(0, Math.min(n, +e.target.value || 0)))} /></label>}
          {hbv && <label className="calc__check"><input type="checkbox" checked={hbOn} onChange={(e) => setHb(e.target.checked)} /> <span>Добавить ужины в отеле, +{fmtPrice(hbv.cur, hbv.v)} за человека</span></label>}
        </div>
        <div className="calc__out" aria-live="polite">
          <p className="calc__pp"><span>За человека</span> <b>{fmtPrice(pp.cur, pp.v)}</b></p>
          <p className="calc__total"><span>Итого за {n} {n === 1 ? 'человека' : n < 5 ? 'человека' : 'человек'}</span> <b className="display">{fmtPrice(pp.cur, total)}</b></p>
          {pp.cur === 'USD' && (
            <p className="calc__rub">
              {rubTotal ? <>≈ <b>{fmtNum(rubTotal)}&nbsp;₽</b> <span className="muted">по курсу {rate} ₽ ({rateInfo || 'введён вручную'})</span></> : <span className="muted">Рублёвый эквивалент зависит от курса в день оплаты.</span>}
              <label className="calc__rate"><span className="sr-only">Курс доллара</span><input inputMode="decimal" placeholder="курс ₽" value={rate} onChange={(e) => { setRate(e.target.value); setRateInfo(''); }} /></label>
            </p>
          )}
        </div>
        {m.extras.length > 0 && <ul className="calc__extras">{m.extras.map((x, i) => <li key={i}><span>{x.label}</span> <b>{x.value}</b></li>)}</ul>}
        <p className="calc__note muted">{note || 'Цена за человека при указанном размещении. Авиабилеты, виза и страховка не включены.'} Окончательную цену подтвердим на ваши даты.</p>
      </div>
      <details className="price__tables">
        <summary>Таблицы цен как в программе</summary>
        {tables.map((t, i) => <Table key={i} rows={t} />)}
        {rub && <><p className="price__sub">Цена в рублях</p>{rub.tables.map((t, i) => <Table key={'r' + i} rows={t} />)}{rub.note && <p className="muted">{rub.note}</p>}</>}
      </details>
      <div className="price__cta"><Link className="btn" href={`/contact?tur=${encodeURIComponent(code)}#zayavka`}><span className="btn__label">Забронировать или задать вопрос</span><span className="btn__arrow" aria-hidden="true">→</span></Link></div>
    </div>
  );
}
