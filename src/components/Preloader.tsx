'use client';
// Opening sequence, once per visit: a gilded jharokha arch draws itself, the name appears, then the two halves of the curtain part on the castle.
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function Preloader() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current, html = document.documentElement;
    if (!el || !html.classList.contains('is-pre')) return;
    const finish = () => { html.classList.remove('is-pre'); try { sessionStorage.setItem('seen', '1'); } catch {} el.remove(); };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { finish(); return; }
    const q = (s: string) => el.querySelectorAll(s);
    const num = el.querySelector<HTMLElement>('.pre__n')!;
    const count = { v: 0 };
    let ready = false; const onReady = () => { ready = true; };
    addEventListener('castle-ready', onReady);
    const exit = () => {
      gsap.timeline({ onComplete: finish })
        .to(q('.pre__art, .pre__name, .pre__n'), { opacity: 0, y: -14, duration: 0.5, ease: 'power2.in', stagger: 0.05 })
        .to('.pre__half--t', { yPercent: -101, duration: 1.1, ease: 'power3.inOut' }, 0.35)
        .to('.pre__half--b', { yPercent: 101, duration: 1.1, ease: 'power3.inOut' }, 0.35)
        .to(el.querySelector('.pre__seam'), { opacity: 0, duration: 0.3 }, 0.35);
    };
    const paths = Array.from(q('.pre__draw')) as SVGGeometryElement[];
    paths.forEach((p) => { const l = p.getTotalLength(); p.style.strokeDasharray = `${l}`; p.style.strokeDashoffset = `${l}`; });
    const tl = gsap.timeline();
    tl.to(paths, { strokeDashoffset: 0, duration: 1.3, ease: 'power2.inOut', stagger: 0.14 }, 0.1)
      .fromTo(q('.pre__fill'), { opacity: 0 }, { opacity: 1, duration: 0.9 }, 1.1)
      .fromTo(q('.pre__name'), { opacity: 0, y: 14, letterSpacing: '0.5em' }, { opacity: 1, y: 0, letterSpacing: '0.22em', duration: 1.1, ease: 'power3.out' }, 0.9)
      .to(count, { v: 100, duration: 1.7, ease: 'power1.inOut', onUpdate: () => { num.textContent = String(Math.round(count.v)).padStart(2, '0'); } }, 0.2)
      .add(() => { const go = () => { removeEventListener('castle-ready', onReady); exit(); }; if (ready || html.classList.contains('gl')) go(); else { addEventListener('castle-ready', go, { once: true }); setTimeout(go, 2000); } });
    return () => { tl.kill(); removeEventListener('castle-ready', onReady); html.classList.remove('is-pre'); };
  }, []);

  return (
    <div ref={root} className="pre" aria-hidden="true">
      <div className="pre__half pre__half--t" />
      <div className="pre__half pre__half--b" />
      <div className="pre__seam" />
      <div className="pre__c">
        <svg className="pre__art" viewBox="0 0 160 200" fill="none">
          <path className="pre__fill" d="M30 190V96C30 62 58 40 80 12C102 40 130 62 130 96V190Z" fill="rgb(212 165 72 / 0.10)" />
          <path className="pre__draw" d="M14 192V94C14 54 48 34 80 4C112 34 146 54 146 94V192" stroke="#c99a3c" strokeWidth="2" />
          <path className="pre__draw" d="M30 190V98C30 64 58 44 80 18C102 44 130 64 130 98V190" stroke="#a8791f" strokeWidth="1.2" />
          <path className="pre__draw" d="M52 190V112C52 92 68 82 80 66C92 82 108 92 108 112V190" stroke="#d4a548" strokeWidth="1" />
          <path className="pre__draw" d="M80 100l10 14-10 14-10-14z" stroke="#c99a3c" strokeWidth="1.2" />
          <path className="pre__draw" d="M6 192H154" stroke="#c99a3c" strokeWidth="2" />
        </svg>
        <div className="pre__name">MONKS &amp; MONKEYS</div>
        <div className="pre__sub">India · Nepal · Bhutan</div>
        <div className="pre__n">00</div>
      </div>
    </div>
  );
}
