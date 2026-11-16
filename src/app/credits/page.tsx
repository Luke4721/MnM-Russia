import type { Metadata } from 'next';
import Link from 'next/link';
import credits from '@/data/credits.json';

export const metadata: Metadata = { title: 'Источники фотографий', description: 'Авторы и лицензии фотографий, взятых с Wikimedia Commons.' };

type Credit = { title: string; author: string; lic: string; page: string };

export default function Credits() {
  const rows = Object.values(credits as Record<string, Credit>).sort((a, b) => a.title.localeCompare(b.title));
  return (
    <>
      <header className="page-head wrap">
        <p className="eyebrow">Фото</p>
        <h1 className="display h-mega">Источники фотографий</h1>
        <p className="lede">Часть снимков взята с Wikimedia Commons по свободным лицензиям (общественное достояние, CC0, CC BY, CC BY-SA). Остальные фотографии из программ MnM. Авторам спасибо.</p>
      </header>
      <ul className="wrap credits">
        {rows.map((c) => (
          <li key={c.page}><a className="draw" href={c.page} target="_blank" rel="noopener noreferrer">{c.title.replace(/\.jpe?g$/i, '')}</a><span>{c.author || 'автор не указан'} · {c.lic}</span></li>
        ))}
      </ul>
      <p className="wrap credits__back"><Link className="alink" href="/gallery">В галерею <span className="alink__arrow" aria-hidden="true">→</span></Link></p>
    </>
  );
}
