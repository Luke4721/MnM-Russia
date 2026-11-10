import type { Metadata } from 'next';
import Link from 'next/link';
import { Bloom } from '@/components/Bloom';
import { articles } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Блог: визы, подготовка, праздники и сезоны',
  description: 'Практические статьи для тех, кто едет в Индию: электронная виза для россиян, памятка туриста, условия и отмена, когда ехать и какие праздники выбрать.',
};

export default function Blog() {
  const [first, ...rest] = articles();
  return (
    <>
      <header className="page-head wrap">
        <p className="eyebrow" data-reveal="fade" data-intro>Блог</p>
        <h1 className="display h-mega" data-split="lines" data-intro>Перед поездкой</h1>
        <p className="lede" data-reveal="up" data-intro data-delay="0.2">Визы, документы, этикет, сезоны и праздники. Только то, что мы рассказываем гостям на самом деле.</p>
      </header>
      <section className="blog wrap">
        <Link href={`/blog/${first.slug}`} className="post post--lead" data-reveal="up">
          <Bloom id={first.cover} w={1400} h={900} c="#d8d8e0" alt="" sizes="(max-width: 767px) 92vw, 56vw" className="post__img" priority />
          <div>
            <p className="post__tag">{first.tag} · {first.read} мин · {first.updated}</p>
            <h2 className="display h-l post__title">{first.title}</h2>
            <p className="muted">{first.lede}</p>
            <span className="alink">Читать <span className="alink__arrow" aria-hidden="true">→</span></span>
          </div>
        </Link>
        <div className="posts__grid">
          {rest.map((a, i) => (
            <Link key={a.slug} href={`/blog/${a.slug}`} className="post" data-reveal="up" data-delay={String((i % 3) * 0.08)}>
              <Bloom id={a.cover} w={1400} h={900} c="#d8d8e0" alt="" sizes="(max-width: 767px) 92vw, 30vw" className="post__img" />
              <p className="post__tag">{a.tag} · {a.read} мин</p>
              <h2 className="display h-m post__title">{a.title}</h2>
              <p className="muted">{a.lede}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
