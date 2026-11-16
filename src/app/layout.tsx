import type { Metadata, Viewport } from 'next';
import { preload } from 'react-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { RevealInit } from '@/components/RevealInit';
import { Motion } from '@/components/Motion';
import { heroImgs } from '@/lib/data';
import { Aura } from '@/components/Aura';
import { Doors } from '@/components/Doors';
import { Preloader } from '@/components/Preloader';
import { LangProvider } from '@/components/Lang';
import { site } from '@/lib/site';
import { deva, display, text } from './fonts';
import '@/styles/base.css';
import '@/styles/pages.css';
import '@/styles/inner.css';
import '@/styles/motion.css';
import '@/styles/luxury.css';
import '@/styles/castle.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s | ${site.name}` },
  description: site.description,
  alternates: { canonical: './' },
  openGraph: { type: 'website', siteName: site.name, locale: 'ru_RU', title: site.title, description: site.description, images: ['/og.png'] },
  twitter: { card: 'summary_large_image' },
};
export const viewport: Viewport = { themeColor: '#FBF7F0' };

// Runs before first paint: hidden-until-revealed styles only apply when JS and motion are on.
const flags = `document.documentElement.classList.add('js');try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('is-pre')}catch(e){}`;

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
  preload(`/p/${heroImgs[0].id}.jpg`, { as: 'image', fetchPriority: 'high', crossOrigin: 'anonymous' });
  return (
    <html lang="ru" className={`${display.variable} ${text.variable} ${deva.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: flags }} />
      </head>
      <body>
        <LangProvider>
        <Aura home={heroImgs[0]} lux={heroImgs[3]} />
        <a className="skip-link" href="#main">Перейти к содержанию</a>
        <Header />
        <main id="main" tabIndex={-1}>{children}</main>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
        <RevealInit />
        <Motion />
        <Doors />
        <Preloader />
        </LangProvider>
      </body>
    </html>
  );
}
