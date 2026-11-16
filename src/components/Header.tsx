'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { NAV, site } from '@/lib/site';
import { LangToggle, T, useLang } from './Lang';

export function Header() {
  const path = usePathname();
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);

  const [solid, setSolid] = useState(false);
  useEffect(() => { const f = () => setSolid(scrollY > 40); f(); addEventListener('scroll', f, { passive: true }); return () => removeEventListener('scroll', f); }, []);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); button.current?.focus(); } };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [open]);

  const current = (href: string) => (href === '/' ? path === '/' : path.startsWith(href));
  return (
    <header className={`site-header ${solid || open ? 'is-solid' : ''}`}>
      <Link className="brand" href="/" aria-current={path === '/' ? 'page' : undefined}>
        <Image src="/brand/logo.png" alt="" width={34} height={39} priority />
        <span className="brand__name">Monks &amp; Monkeys</span>
      </Link>
      <nav aria-label="Разделы" className={`site-nav ${open ? 'is-open' : ''}`} id="site-nav">
        <ul>
          {NAV.map((n) => (
            <li key={n.href}>
              <Link className="draw" href={n.href} aria-current={current(n.href) ? 'page' : undefined}>{lang === 'en' ? n.en : n.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="header__right">
        <LangToggle />
        <a className="header__phone ulink" href={site.phoneHref}>{site.phone}</a>
        <Link className="btn btn--small" href="/contact#zayavka"><span className="btn__label"><T ru="Подобрать тур" en="Plan my trip" /></span></Link>
        <button ref={button} className="menu-btn" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen((o) => !o)}>{open ? (lang === 'en' ? 'Close' : 'Закрыть') : (lang === 'en' ? 'Menu' : 'Меню')}</button>
      </div>
    </header>
  );
}
