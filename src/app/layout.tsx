import type { Metadata, Viewport } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Motion } from '@/components/Motion';
import { site } from '@/lib/site';
import { deva, display, text } from './fonts';
import '@/styles/base.css';
import '@/styles/pages.css';
import '@/styles/inner.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s | ${site.name}` },
  description: site.description,
  alternates: { canonical: './' },
  openGraph: { type: 'website', siteName: site.name, locale: 'ru_RU', title: site.title, description: site.description, images: ['/og.png'] },
  twitter: { card: 'summary_large_image' },
};
export const viewport: Viewport = { themeColor: '#F6F7FA' };

// Runs before first paint: hidden-until-revealed styles only apply when JS and motion are on.
const flags = `document.documentElement.classList.add('js');if(location.pathname!=='/')document.documentElement.classList.add('no-loader');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion')`;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  name: site.name,
  alternateName: site.brand,
  url: site.url,
  email: site.email,
  telephone: site.phone,
  foundingDate: String(site.since),
  address: { '@type': 'PostalAddress', streetAddress: '163 LGF, Ashram', addressLocality: 'New Delhi', postalCode: '110014', addressCountry: 'IN' },
  areaServed: 'RU',
  knowsLanguage: ['ru', 'en'],
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ru" className={`${display.variable} ${text.variable} ${deva.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: flags }} />
      </head>
      <body>
        <a className="skip-link" href="#main">Перейти к содержанию</a>
        <div id="curtain" aria-hidden="true"><div className="curtain__panel" /></div>
        <div id="loader" role="status" aria-label="Загрузка">
          <p className="loader__word" data-t="नमस्ते" aria-hidden="true">नमस्ते</p>
          <p className="loader__name">Monks &amp; Monkeys</p>
          <p className="loader__count" data-loader-count>0%</p>
        </div>
        <Header />
        <main id="main" tabIndex={-1}>{children}</main>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
        <Motion />
      </body>
    </html>
  );
}
