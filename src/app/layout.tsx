import type { Metadata, Viewport } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { RevealInit } from '@/components/RevealInit';
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
export const viewport: Viewport = { themeColor: '#FBF7F0' };

// Runs before first paint: hidden-until-revealed styles only apply when JS and motion are on.
const flags = `document.documentElement.classList.add('js')`;

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
        <Header />
        <main id="main" tabIndex={-1}>{children}</main>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
        <RevealInit />
      </body>
    </html>
  );
}
