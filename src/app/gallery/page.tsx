import type { Metadata } from 'next';
import { GalleryClient } from '@/components/GalleryClient';
import { gallery } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Галерея: Индия в фотографиях',
  description: `${gallery.length} фотографий из наших программ: Тадж-Махал, Варанаси, Ладакх, Керала, Раджастхан. Каждое фото ведёт к туру, в котором вы это увидите.`,
};

export default function Gallery() {
  return (
    <>
      <header className="page-head wrap">
        <p className="eyebrow" data-reveal="fade" data-intro>Галерея</p>
        <h1 className="display h-mega" data-split="lines" data-intro>Индия, какой её видят наши гости</h1>
        <p className="lede" data-reveal="up" data-intro data-delay="0.2">Фотографии из программ MnM. Нажмите на любую, чтобы увидеть её крупно и перейти к туру, в котором вы там окажетесь.</p>
      </header>
      <GalleryClient items={gallery} />
    </>
  );
}
