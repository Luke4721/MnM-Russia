'use client';
// Twelve vertical slices, one colour per month. The open slice shows that month's tour in colour; the rest stay pigment.
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MONTHS, MONTH_COLOR, fmtPrice, imgSrc, onColor, ruDate } from '@/lib/site';
import type { CatItem } from '@/lib/types';

export function MonthSlices({ items }: { items: CatItem[] }) {
  const [open, setOpen] = useState(0);
  useEffect(() => setOpen(new Date().getMonth()), []);
  return (
    <div className="slices" role="list">
      {items.map((it, i) => {
        const on = i === open;
        return (
          <article key={it.s} role="listitem" className={`slice ${on ? 'is-open' : ''}`} style={{ '--mc': MONTH_COLOR[i], '--mt': onColor(MONTH_COLOR[i]) } as React.CSSProperties}
            onMouseEnter={() => setOpen(i)} onFocus={() => setOpen(i)}>
            <button type="button" className="slice__tab" aria-expanded={on} aria-controls={`slice-${i}`} onClick={() => setOpen(i)}>
              <span className="slice__num">{String(i + 1).padStart(2, '0')}</span>
              <span className="slice__month">{MONTHS[i]}</span>
            </button>
            <div className="slice__panel" id={`slice-${i}`} aria-hidden={!on}>
              <div className="slice__photo">
                <Image src={imgSrc(it.cv)} alt="" fill sizes="(max-width: 767px) 92vw, 45vw" quality={70} />
              </div>
              <div className="slice__text">
                <p className="slice__where">{MONTHS[i]} · {it.t.split(':')[0]}</p>
                <h3 className="display slice__title">{(() => { const t = it.t.includes(':') ? it.t.split(':').slice(1).join(':').trim() || it.t : it.t; return t.charAt(0).toUpperCase() + t.slice(1); })()}</h3>
                {it.g && <p className="slice__tag">{it.g}</p>}
                <p className="slice__meta">{it.d} дн. · {it.r.slice(0, 4).join(', ')}{it.r.length > 4 ? ' …' : ''}</p>
                <div className="slice__foot">
                  <span className="slice__price">{it.p ? `от ${fmtPrice(it.p.c, it.p.v)}` : 'цена по запросу'}</span>
                  {it.dep && <span className="slice__dep">вылет {ruDate(it.dep)}</span>}
                  <Link className="alink" href={`/destinations/${it.s}`} tabIndex={on ? 0 : -1}>Программа по дням <span className="alink__arrow" aria-hidden="true">→</span></Link>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
