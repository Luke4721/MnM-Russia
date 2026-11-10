import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CatalogClient } from '@/components/CatalogClient';
import { catalog } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Направления: все туры по Индии',
  description: `${catalog.items.length} программ по Индии: групповые и индивидуальные туры, праздники, люкс-поезда, короткие поездки. Фильтры по месяцу, длительности и теме.`,
};

export default function Destinations() {
  return (
    <>
      <header className="page-head wrap">
        <p className="eyebrow" data-reveal="fade" data-intro>Направления</p>
        <h1 className="display h-mega" data-split="lines" data-intro>Куда и когда</h1>
        <p className="lede" data-reveal="up" data-intro data-delay="0.2">Все программы MnM в одном каталоге. Выберите месяц, и останутся маршруты, которые в это время лучше всего.</p>
      </header>
      <Suspense fallback={<div className="wrap" style={{ minHeight: '60vh' }} />}>
        <CatalogClient catalog={catalog} />
      </Suspense>
    </>
  );
}
