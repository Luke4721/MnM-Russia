'use client';
// Chooses which room of the castle sits behind the current page, keeps the veil that protects text, and hosts the Calm switch and mood chip.
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useLang } from './Lang';
import { MOODS } from './moods';
import type { Img, SceneName, ToneName } from './Castle3D';

const load = () => import('./Castle3D');
const Castle = dynamic(load, { ssr: false });
// start fetching three.js and the scene as this script runs, in parallel with hydration, not after it
if (typeof window !== 'undefined') load();

function roomFor(path: string): { scene: SceneName; tone: ToneName; hero: boolean } {
  if (path === '/') return { scene: 'courtyard', tone: 'pink', hero: true };
  if (path.startsWith('/luxury')) return { scene: 'durbar', tone: 'gold', hero: true };
  if (path === '/destinations') return { scene: 'gallery', tone: 'honey', hero: false };
  if (path.startsWith('/destinations/')) return { scene: 'courtyard', tone: 'peach', hero: false };
  if (path.startsWith('/gallery')) return { scene: 'facade', tone: 'rose', hero: false };
  if (path.startsWith('/about')) return { scene: 'terrace', tone: 'dawn', hero: false };
  if (path.startsWith('/blog')) return { scene: 'gallery', tone: 'sage', hero: false };
  if (path.startsWith('/contact')) return { scene: 'gate', tone: 'pink', hero: false };
  return { scene: 'courtyard', tone: 'peach', hero: false };
}

export function Aura({ home, lux }: { home: Img; lux: Img }) {
  const path = usePathname();
  const { lang } = useLang();
  const [mood, setMood] = useState<number | null>(null);
  const [ok, setOk] = useState(false);
  const [calm, setCalm] = useState(false);
  const [win, setWin] = useState<{ path: string; img: Img } | null>(null);
  useEffect(() => {
    try { if (document.createElement('canvas').getContext('webgl') && !matchMedia('(prefers-reduced-motion: reduce)').matches) setOk(true); } catch {}
    try { if (localStorage.getItem('calm') === '1') setCalm(true); } catch {}
    const on = (e: Event) => { const i = (e as CustomEvent<number>).detail; setMood(i < 0 ? null : i % MOODS.length); };
    const img = (e: Event) => setWin({ path: location.pathname, img: (e as CustomEvent<Img>).detail });
    addEventListener('mood', on); addEventListener('castle-img', img);
    return () => { removeEventListener('mood', on); removeEventListener('castle-img', img); document.documentElement.classList.remove('gl'); };
  }, []);
  const room = roomFor(path);
  const img = path.startsWith('/luxury') ? lux : win && win.path === path ? win.img : home;
  const key = `${room.scene}-${room.tone}-${img.id}`;
  const prev = useRef(key);
  // same room on the next page: tell the doors straight away, there is no new scene to wait for
  useEffect(() => { const same = prev.current === key; prev.current = key; if (!same) return; const t = setTimeout(() => dispatchEvent(new Event('castle-ready')), 60); return () => clearTimeout(t); }, [path, key]);
  const toggle = () => setCalm((c) => { const n = !c; try { localStorage.setItem('calm', n ? '1' : '0'); } catch {} document.documentElement.classList.toggle('calm', n); return n; });
  const mo = mood === null ? null : MOODS[mood];
  return (
    <>
      {ok && <Castle key={key} scene={room.scene} tone={room.tone} img={img} inner={!room.hero} calm={calm} onReady={() => { document.documentElement.classList.add('gl'); dispatchEvent(new Event('castle-ready')); }} />}
      <div className="veil" aria-hidden="true" />
      <div className="dock">
        {mo && <p className="mood" aria-hidden="true"><i style={{ background: mo.c[1] }} /><span>{lang === 'en' ? 'Mood' : 'Настроение'}: <b>{lang === 'en' ? mo.en : mo.ru}</b></span></p>}
        {ok && <button type="button" className="calm-btn" aria-pressed={calm} onClick={toggle}>{calm ? (lang === 'en' ? 'Calm: on' : 'Покой: вкл') : (lang === 'en' ? 'Calm' : 'Покой')}</button>}
      </div>
    </>
  );
}
