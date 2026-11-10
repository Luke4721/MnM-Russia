'use client';
import { useEffect, useState } from 'react';
import { gsap } from 'gsap';

const fmt = (tz: string) => new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit', timeZone: tz }).format(new Date());

/** Two real clocks: Moscow and Delhi (2 h 30 min ahead). Ticks on the one GSAP clock, once a second. */
export function Clocks() {
  const [t, setT] = useState<[string, string] | null>(null);
  useEffect(() => {
    let last = -1;
    const tick = () => { const s = Math.floor(Date.now() / 1000); if (s === last) return; last = s; setT([fmt('Europe/Moscow'), fmt('Asia/Kolkata')]); };
    tick();
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);
  return (
    <div className="clocks" aria-label="Время в Москве и Дели">
      <p><span className="clocks__city">Москва</span> <time className="clocks__t">{t ? t[0] : '--:--'}</time></p>
      <span className="clocks__arrow" aria-hidden="true">→</span>
      <p><span className="clocks__city">Дели</span> <time className="clocks__t">{t ? t[1] : '--:--'}</time></p>
    </div>
  );
}
