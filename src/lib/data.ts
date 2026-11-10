// Server-side access to the full dataset. Never import this from a client component (packages.json is ~4 MB).
import packages from '@/data/packages.json';
import catalogJson from '@/data/catalog.json';
import galleryJson from '@/data/gallery.json';
import heroJson from '@/data/hero-ids.json';
import type { Catalog, GalleryItem, Img, Pkg } from './types';

export const allPackages = packages as unknown as Pkg[];
export const catalog = catalogJson as unknown as Catalog;
export const gallery = galleryJson as unknown as GalleryItem[];
export const heroImgs = heroJson as Img[];
export const getPackage = (slug: string) => allPackages.find((p) => p.slug === slug);
export const byCode = (code: string) => allPackages.find((p) => p.code === code);

export function related(p: Pkg, n = 3): Pkg[] {
  const score = (q: Pkg) => (q.collection === p.collection ? 2 : 0) + q.tags.filter((t) => p.tags.includes(t)).length * 3 - Math.abs(q.days - p.days) * 0.2;
  return allPackages.filter((q) => q.slug !== p.slug && q.cover && !q.coverBorrowed && q.collection !== 'short').sort((a, b) => score(b) - score(a)).slice(0, n);
}

/** Cheapest published "from" price per collection, in its own currency (for the collection index). */
export function collectionStats() {
  const out: Record<string, { n: number; from: { cur: 'USD' | 'RUB'; v: number } | null }> = {};
  for (const it of catalog.items) {
    const s = (out[it.c] ||= { n: 0, from: null });
    s.n++;
    if (it.p && (!s.from || (it.p.c === s.from.cur && it.p.v < s.from.v))) s.from = { cur: it.p.c, v: it.p.v };
  }
  return out;
}

export const catByCode = (code: string) => catalog.items.find((i) => i.k === code);
export const catByCodes = (codes: string[]) => codes.map(catByCode).filter(Boolean) as Catalog['items'];
