import type { NextConfig } from "next";

const headers = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"], deviceSizes: [420, 640, 828, 1080, 1440, 1920] },
  async redirects() {
    const to = (from: string[], dest: string) => from.map((source) => ({ source, destination: dest, permanent: true }));
    return [...to(['/packages', '/tours', '/programs', '/programmes', '/destination'], '/destinations'), ...to(['/contacts', '/contact-us'], '/contact'), ...to(['/about-us', '/company'], '/about'), ...to(['/home', '/index'], '/'), ...to(['/luxury-trains', '/vip'], '/luxury'), ...to(['/sitemap', '/map'], '/site-map')];
  },
  async headers() { return [{ source: '/:path*', headers }]; },
};

export default nextConfig;
