import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Bloom } from '@/components/Bloom';
import { Ticket } from '@/components/Ticket';
import { articles, getArticle } from '@/lib/blog';
import { catalog } from '@/lib/data';
import { imgSrc, site } from '@/lib/site';

export function generateStaticParams() { return articles().map((a) => ({ slug: a.slug })); }

export async function generateMetadata({ params }: PageProps<'/blog/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return { title: a.title.length > 58 ? a.title.slice(0, 57) + '…' : a.title, description: a.lede, openGraph: { images: [imgSrc(a.cover)] } };
}

export default async function Article({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();
  const others = articles().filter((x) => x.slug !== a.slug).slice(0, 3);
  const toc = a.blocks.map((b, i) => (b.t === 'h2' ? { id: `s${i}`, text: b.text } : null)).filter(Boolean) as { id: string; text: string }[];
  const jsonLd = { '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.lede, image: `${site.url}${imgSrc(a.cover)}`, author: { '@type': 'Organization', name: site.name }, publisher: { '@type': 'Organization', name: site.name } };
  return (
    <article className="art">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <header className="art__head wrap">
        <nav aria-label="Навигация" className="crumbs"><Link className="draw" href="/blog">Блог</Link> <span aria-hidden="true">/</span> {a.tag}</nav>
        <h1 className="display h-xl" data-split="lines" data-intro>{a.title}</h1>
        <p className="lede" data-reveal="up" data-intro data-delay="0.2">{a.lede}</p>
        <p className="art__meta">{a.tag} · {a.read} мин чтения · {a.updated}</p>
      </header>
      <div className="art__cover wrap"><Bloom id={a.cover} w={1400} h={900} c="#d8d8e0" alt="" sizes="(max-width: 1440px) 96vw, 1400px" priority className="art__img" origin="40,50" /></div>
      <div className="art__layout wrap g12">
        {toc.length > 2 && (
          <nav className="art__toc" aria-label="Содержание">
            <p className="footer__label">В статье</p>
            <ol>{toc.map((t) => <li key={t.id}><a className="draw" href={`#${t.id}`}>{t.text}</a></li>)}</ol>
          </nav>
        )}
        <div className="art__body">
          {a.blocks.map((b, i) => {
            if (b.t === 'h2') return <h2 key={i} id={`s${i}`} className="display h-l">{b.text}</h2>;
            if (b.t === 'p') return <p key={i}>{b.text}</p>;
            if (b.t === 'ul') return <ul key={i} className="tick">{b.items.map((x) => <li key={x}>{x}</li>)}</ul>;
            if (b.t === 'note') return <aside key={i} className="note">{b.text}</aside>;
            if (b.t === 'table') return (
              <div key={i} className="ptable-wrap"><table className="ptable"><thead><tr>{b.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{b.rows.map((r, j) => <tr key={j}>{r.map((c, k) => (k === 0 ? <th key={k} scope="row">{c}</th> : <td key={k}>{c}</td>))}</tr>)}</tbody></table></div>
            );
            const items = b.items.map((p) => catalog.items.find((c) => c.s === p.slug)).filter(Boolean);
            return <div key={i} className="tickets tickets--art">{items.map((it) => <div key={it!.s} className="tickets__cell"><Ticket it={it!} sizes="(max-width: 767px) 92vw, 30vw" /></div>)}</div>;
          })}
          <div className="art__cta">
            <p className="display h-m">Остались вопросы?</p>
            <Link className="btn" href="/contact#zayavka"><span className="btn__label">Спросить у менеджера</span><span className="btn__arrow" aria-hidden="true">→</span></Link>
          </div>
        </div>
      </div>
      <section className="posts section wrap" aria-labelledby="more-h">
        <h2 id="more-h" className="display h-xl">Читайте также</h2>
        <div className="posts__grid">
          {others.map((o) => (
            <Link key={o.slug} href={`/blog/${o.slug}`} className="post">
              <Bloom id={o.cover} w={1400} h={900} c="#d8d8e0" alt="" sizes="(max-width: 767px) 92vw, 30vw" className="post__img" />
              <p className="post__tag">{o.tag} · {o.read} мин</p>
              <h3 className="display h-m post__title">{o.title}</h3>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
