const str = (v: unknown, min: number, max: number) => typeof v === 'string' && v.trim().length >= min && v.trim().length <= max;

export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return Response.json({ ok: false }, { status: 400 }); }
  if (b.company) return Response.json({ ok: true }); // honeypot: bots fill it, people never see it
  const people = Number(b.people);
  const ok = str(b.name, 1, 80) && str(b.contact, 3, 120) && str(b.tour ?? '', 0, 80) && Number.isInteger(people) && people >= 1 && people <= 50 && (b.message == null || str(b.message, 0, 1000));
  if (!ok) return Response.json({ ok: false }, { status: 422 });
  // shortcut: requests are only logged, not delivered. Connect email (Resend) or a Telegram bot before launch.
  console.log('[zayavka]', JSON.stringify({ name: b.name, contact: b.contact, tour: b.tour, people, message: b.message }));
  return Response.json({ ok: true });
}
