import { site } from '@/lib/site';

const str = (v: unknown, min: number, max: number) => typeof v === 'string' && v.trim().length >= min && v.trim().length <= max;
const clean = (v: unknown) => String(v ?? '').split(/\s+/).join(' ').slice(0, 1000); // collapses CR/LF and line separators: no log injection

export async function POST(req: Request) {
  const origin = req.headers.get('origin');
  if (origin && new URL(origin).host !== new URL(site.url).host && !/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) && !/\.vercel\.app$/.test(new URL(origin).host)) return Response.json({ ok: false }, { status: 403 });
  if (!(req.headers.get('content-type') || '').includes('application/json') || Number(req.headers.get('content-length') || 0) > 8192) return Response.json({ ok: false }, { status: 415 });
  let b: unknown;
  try { b = JSON.parse((await req.text()).slice(0, 8192)); } catch { return Response.json({ ok: false }, { status: 400 }); }
  if (!b || typeof b !== 'object' || Array.isArray(b)) return Response.json({ ok: false }, { status: 400 });
  const r = b as Record<string, unknown>;
  if (r.company) return Response.json({ ok: true }); // honeypot: bots fill it, people never see it
  const people = Number(r.people);
  const ok = str(r.name, 1, 80) && str(r.contact, 3, 120) && str(r.tour ?? '', 0, 80) && Number.isInteger(people) && people >= 1 && people <= 50 && (r.message == null || str(r.message, 0, 1000));
  if (!ok) return Response.json({ ok: false }, { status: 422 });
  // shortcut: requests are only logged, not delivered. Connect email (Resend) or a Telegram bot before launch, and rate-limit by IP then.
  console.log('[zayavka]', JSON.stringify({ name: clean(r.name), contact: clean(r.contact), tour: clean(r.tour), people, message: clean(r.message) }));
  return Response.json({ ok: true });
}
