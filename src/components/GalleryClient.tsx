'use client';
// Masonry of every photo from the programs. Tiles turn from grey to colour as they enter; a native dialog is the lightbox.
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { imgSrc } from '@/lib/site';
import type { GalleryItem } from '@/lib/types';

export function GalleryClient({ items }: { items: GalleryItem[] }) {
  const [theme, setTheme] = useState('');
  const [idx, setIdx] = useState<number | null>(null);
  const dlg = useRef<HTMLDialogElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const themes = useMemo(() => { const m: Record<string, number> = {}; items.forEach((g) => { if (g.tg) m[g.tg] = (m[g.tg] || 0) + 1; }); return Object.entries(m).sort((a, b) => b[1] - a[1]); }, [items]);
  const list = useMemo(() => (theme ? items.filter((g) => g.tg === theme) : items), [items, theme]);

  useEffect(() => {
    const el = root.current; if (!el) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    el.querySelectorAll('.gtile:not(.is-in)').forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [list]);

  useEffect(() => {
    const d = dlg.current; if (!d) return;
    if (idx !== null && !d.open) d.showModal();
    if (idx === null && d.open) d.close();
  }, [idx]);
  useEffect(() => {
    if (idx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setIdx((i) => (i === null ? i : (i + 1) % list.length));
      if (e.key === 'ArrowLeft') setIdx((i) => (i === null ? i : (i - 1 + list.length) % list.length));
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [idx, list.length]);

  const cur = idx !== null ? list[idx] : null;
  return (
    <div className="gallery" ref={root}>
      <div className="gallery__filters wrap" role="group" aria-label="Темы">
        <button type="button" className="chip" aria-pressed={!theme} onClick={() => setTheme('')}>Все <span>{items.length}</span></button>
        {themes.map(([t, n]) => <button key={t} type="button" className="chip" aria-pressed={theme === t} onClick={() => setTheme(theme === t ? '' : t)}>{t} <span>{n}</span></button>)}
      </div>
      <ul className="gallery__grid wrap">
        {list.map((g, i) => (
          <li key={g.id} className="gtile" style={{ aspectRatio: `${g.w} / ${g.h}`, '--c': g.c } as React.CSSProperties}>
            <button type="button" onClick={() => setIdx(i)} aria-label={`Открыть фото: ${g.t}`}>
              <Image src={imgSrc(g.id)} alt={g.t} fill sizes="(max-width: 767px) 92vw, (max-width: 1100px) 46vw, 31vw" quality={70} />
            </button>
          </li>
        ))}
      </ul>
      <dialog ref={dlg} className="lightbox" onClose={() => setIdx(null)} onClick={(e) => { if (e.target === dlg.current) setIdx(null); }} aria-label="Просмотр фотографии">
        {cur && (
          <div className="lightbox__inner">
            <div className="lightbox__img"><Image src={imgSrc(cur.id)} alt={cur.t} width={cur.w} height={cur.h} sizes="92vw" quality={80} /></div>
            <div className="lightbox__bar">
              <p className="display">{cur.t}</p>
              <Link className="alink" href={`/destinations/${cur.s}`}>К программе <span className="alink__arrow" aria-hidden="true">→</span></Link>
              <div className="lightbox__nav">
                <button type="button" className="chip" onClick={() => setIdx((i) => ((i ?? 0) - 1 + list.length) % list.length)} aria-label="Предыдущее фото">←</button>
                <span aria-live="polite">{(idx ?? 0) + 1} / {list.length}</span>
                <button type="button" className="chip" onClick={() => setIdx((i) => ((i ?? 0) + 1) % list.length)} aria-label="Следующее фото">→</button>
                <button type="button" className="chip" onClick={() => setIdx(null)}>Закрыть</button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
