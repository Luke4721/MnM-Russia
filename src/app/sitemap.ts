import type { MetadataRoute } from 'next';
import { articles } from '@/lib/blog';
import { catalog } from '@/lib/data';
import { site } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['/', '/destinations', '/luxury', '/gallery', '/about', '/blog', '/contact', '/site-map', '/credits', ...catalog.items.map((i) => `/destinations/${i.s}`), ...articles().map((a) => `/blog/${a.slug}`)];
  return paths.map((p) => ({ url: `${site.url}${p}` }));
}
