'use client';
// The scroll layer: Lenis smooth scroll, GSAP ScrollTrigger scenes (sun, skyline, arch portal, pinned month journey),
// the Spine (a thread drawn down the page), chapter rail and drifting petals. Everything is skipped for reduced motion.
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

const q = <T extends Element>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const qa = <T extends Element>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));

export function Motion() {
  const path = usePathname();
  const [chapters, setChapters] = useState<{ id: string; label: string }[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.documentElement.classList.add('motion');
    const small = innerWidth < 768;

    const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -88 } });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const secs = qa<HTMLElement>('[data-chapter]');
    setChapters(secs.map((el, i) => { el.id ||= `ch-${i}`; return { id: el.id, label: el.dataset.chapter || '' }; }));

    const ctx = gsap.context(() => {
      // Spine: a thread drawn as you scroll, with a bead at its tip.
      const sp = q<SVGPathElement>('.spine path'), bead = q<SVGCircleElement>('.spine circle');
      if (sp && bead) {
        let d = 'M14 0'; for (let y = 0; y <= 1000; y += 100) d += ` Q ${y % 200 ? 2 : 26} ${y + 50} 14 ${y + 100}`;
        sp.setAttribute('d', d);
        const len = sp.getTotalLength();
        gsap.set(sp, { strokeDasharray: len, strokeDashoffset: len });
        ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => {
          sp.style.strokeDashoffset = String(len * (1 - s.progress));
          const pt = sp.getPointAtLength(len * s.progress); bead.setAttribute('cx', String(pt.x)); bead.setAttribute('cy', String(pt.y));
        } });
      }
      ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => { const b = q<HTMLElement>('.progress'); if (b) b.style.transform = `scaleX(${s.progress})`; } });

      // Chapter rail
      secs.forEach((el, i) => ScrollTrigger.create({ trigger: el, start: 'top 55%', end: 'bottom 55%', onToggle: (s) => { if (s.isActive) { setActive(i); dispatchEvent(new CustomEvent('mood', { detail: i })); } } }));

      // Headline words rise out of a mask
      qa<HTMLElement>('[data-words]').forEach((h) => {
        const words = (h.textContent || '').split(' ');
        h.setAttribute('aria-label', h.textContent || '');
        h.innerHTML = words.map((w) => `<span class="w" aria-hidden="true"><span>${w}</span></span>`).join(' ');
        gsap.from(qa('.w > span', h), { yPercent: 115, rotate: 4, duration: 1.1, ease: 'power4.out', stagger: 0.07, scrollTrigger: { trigger: h, start: 'top 88%', once: true } });
      });

      // Hero: sun climbs, skyline layers drift at different speeds, copy drifts up
      const hero = q('.hero');
      if (hero) {
        const st = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };
        gsap.to('.hero__copy', { yPercent: -14, opacity: 0.25, ease: 'none', scrollTrigger: st });
        gsap.to('.hero__photo', { yPercent: -8, ease: 'none', scrollTrigger: st });
        gsap.from('.hero__title', { yPercent: 40, opacity: 0, duration: 1.4, ease: 'power4.out', delay: 0.1 });
      }

      // Portal: the arch opens into a full-bleed photograph
      const portal = q('.portal');
      if (portal) {
        const tl = gsap.timeline({ scrollTrigger: { trigger: portal, start: 'top top', end: '+=120%', scrub: true, pin: '.portal__stage', anticipatePin: 1 } });
        tl.fromTo('.portal__img', { clipPath: 'inset(20% 34% 0% 34% round 999px 999px 0px 0px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)', ease: 'none', duration: 1 }, 0)
          .fromTo('.portal__img img', { scale: 1.35 }, { scale: 1, ease: 'none', duration: 1 }, 0)
          .fromTo('.portal__hint', { opacity: 1 }, { opacity: 0, duration: 0.2 }, 0)
          .fromTo('.portal__text', { opacity: 0, yPercent: 14 }, { opacity: 1, yPercent: 0, duration: 0.4 }, 0.6);
      }

      // Months: pinned horizontal journey; the page tint follows the month
      const hs = q<HTMLElement>('.hs'), track = q<HTMLElement>('.hs__track');
      if (hs && track) {
        const cols = (hs.dataset.colors || '').split(',');
        const names = qa<HTMLElement>('.mcard:not(.mcard--end)', track);
        const dist = () => Math.max(0, track.scrollWidth - innerWidth + 2 * parseFloat(getComputedStyle(track).paddingLeft));
        const tw = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: {
          trigger: hs, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: (s) => {
            const i = Math.min(names.length - 1, Math.round(s.progress * (names.length - 1)));
            hs.style.setProperty('--tint', cols[i] || '#a8470f');
            const c = q('.hs__count', hs); if (c) c.textContent = `${String(i + 1).padStart(2, '0')} / ${names.length}`;
            const f = q<HTMLElement>('.hs__bar i', hs); if (f) f.style.transform = `scaleX(${s.progress})`;
          } } });
        names.forEach((c) => gsap.fromTo(q('img', c), { xPercent: -9 }, { xPercent: 9, ease: 'none', scrollTrigger: { trigger: c, containerAnimation: tw, start: 'left right', end: 'right left', scrub: true } }));
      }

      // Rows and cards enter with a stagger
      qa<HTMLElement>('[data-stagger]').forEach((g) => gsap.from(Array.from(g.children), { y: 46, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: g, start: 'top 85%', once: true } }));
      // Counters
      qa<HTMLElement>('[data-count]').forEach((el) => {
        const to = +(el.dataset.count || 0), o = { v: 0 };
        gsap.to(o, { v: to, duration: 1.8, ease: 'power2.out', onUpdate: () => { el.textContent = String(Math.round(o.v)); }, scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
      });
      // Marquee
      qa<HTMLElement>('.marquee__in').forEach((m, i) => gsap.to(m, { xPercent: i % 2 ? 50 : -50, ease: 'none', scrollTrigger: { trigger: m, start: 'top bottom', end: 'bottom top', scrub: 0.5 } }));
      // Depth: sections swing up out of the page, and tagged layers travel at their own speed
      qa<HTMLElement>('.section').forEach((el) => gsap.fromTo(el, { y: 28 }, { y: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top 98%', end: 'top 55%', scrub: true } }));
      qa<HTMLElement>('[data-speed]').forEach((el) => gsap.to(el, { yPercent: -(+(el.dataset.speed || 0)) * 100, ease: 'none', scrollTrigger: { trigger: el.parentElement || el, start: 'top bottom', end: 'bottom top', scrub: true } }));
      // Parallax images
      qa<HTMLElement>('[data-parallax] img').forEach((im) => gsap.fromTo(im, { yPercent: -7 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: im.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));
    });
    ScrollTrigger.refresh();

    return () => { dispatchEvent(new CustomEvent('mood', { detail: -1 })); ctx.revert(); lenis.destroy(); gsap.ticker.remove(tick); document.documentElement.classList.remove('motion'); };
  }, [path]);

  return (
    <>
      <div className="progress" aria-hidden="true" />
      <svg className="spine" viewBox="0 0 28 1000" preserveAspectRatio="none" aria-hidden="true"><path fill="none" stroke="var(--accent)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" /><circle r="4.5" cx="14" cy="0" fill="var(--accent)" /></svg>
      {chapters.length > 1 && (
        <nav className="rail" aria-label="Главы страницы">
          {chapters.map((c, i) => <a key={c.id} href={`#${c.id}`} className={i === active ? 'on' : ''} aria-current={i === active ? 'true' : undefined}><span>{c.label}</span><i /></a>)}
        </nav>
      )}
    </>
  );
}
