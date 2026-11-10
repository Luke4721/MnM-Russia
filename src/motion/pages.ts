// Page-level motion registered once (each handler checks that its markup exists on the current page).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ease, isTouch, onPage, onScroll, prefersReducedMotion } from '@/engine';

gsap.registerPlugin(ScrollTrigger);

export function startPageMotion() {
  // Manifesto: words go from Moscow grey to ink, key words arrive in pigment, driven by scroll.
  onPage(() => {
    document.querySelectorAll<HTMLElement>('[data-manifesto]').forEach((root) => {
      const words = [...root.querySelectorAll<HTMLElement>('.mw')];
      if (!words.length || prefersReducedMotion()) return;
      words.forEach((w) => gsap.set(w, { color: '#c6c5d3' }));
      gsap.to(words, {
        color: (i, el: HTMLElement) => el.dataset.c || '#15122b', stagger: 0.12, ease: 'none',
        scrollTrigger: { trigger: root, start: 'top 78%', end: 'bottom 42%', scrub: 0.6 },
      });
    });
  });

  // Route rail: the line fills as the visitor moves through the steps.
  onPage(() => {
    document.querySelectorAll<HTMLElement>('[data-rail]').forEach((rail) => {
      const line = rail.querySelector<HTMLElement>('.rail__fill');
      if (!line || prefersReducedMotion()) return;
      gsap.fromTo(line, { scaleY: 0 }, { scaleY: 1, ease: 'none', transformOrigin: 'top', scrollTrigger: { trigger: rail, start: 'top 65%', end: 'bottom 65%', scrub: true } });
      rail.querySelectorAll<HTMLElement>('.rail__step').forEach((s) => {
        ScrollTrigger.create({ trigger: s, start: 'top 65%', onEnter: () => s.classList.add('is-on'), onLeaveBack: () => s.classList.remove('is-on') });
      });
    });
  });

  // Package page: the route line draws as you read the days, stops light up, the current day numeral turns pink.
  onPage(() => {
    const map = document.querySelector<HTMLElement>('[data-route-map]');
    const days = document.querySelector<HTMLElement>('[data-days]');
    const line = map?.querySelector<SVGPathElement>('[data-route-line]');
    if (!map || !days || !line) return;
    const stops = [...map.querySelectorAll<SVGGElement>('.rmap__stop')];
    if (prefersReducedMotion()) { stops.forEach((st) => st.classList.add('on')); return; }
    const len = line.getTotalLength();
    gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(line, {
      strokeDashoffset: 0, ease: 'none',
      scrollTrigger: { trigger: days, start: 'top 65%', end: 'bottom 70%', scrub: true, onUpdate: (self) => { const n = Math.round(self.progress * (stops.length - 1)); stops.forEach((st, i) => st.classList.toggle('on', i <= n)); } },
    });
    days.querySelectorAll<HTMLElement>('.day').forEach((d) => ScrollTrigger.create({ trigger: d, start: 'top 60%', end: 'bottom 60%', onToggle: (self) => d.classList.toggle('is-on', self.isActive) }));
  });

  // Parallax drift for editorial photos.
  onPage(() => {
    if (prefersReducedMotion()) return;
    gsap.utils.toArray<HTMLElement>('[data-drift]').forEach((el) => {
      const a = parseFloat(el.dataset.drift || '8');
      gsap.fromTo(el, { yPercent: -a }, { yPercent: a, ease: 'none', scrollTrigger: { trigger: el.parentElement || el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  });

  // Collections index: a colour photo follows the pointer and leans with its speed (desktop only).
  onPage(() => {
    const list = document.querySelector('[data-index]');
    const box = document.querySelector<HTMLElement>('.preview');
    if (!list || !box || isTouch()) return;
    const img = box.querySelector('img')!;
    const x = gsap.quickTo(box, 'x', { duration: 0.6, ease: 'power3.out' });
    const y = gsap.quickTo(box, 'y', { duration: 0.6, ease: 'power3.out' });
    const rot = gsap.quickTo(box, 'rotation', { duration: 0.8, ease: 'power3.out' });
    let lastX = 0, px = 0, py = 0;
    const move = (e: PointerEvent) => { px = e.clientX; py = e.clientY; x(px); y(py); rot(gsap.utils.clamp(-9, 9, (px - lastX) * 0.5)); lastX = px; };
    const hide = () => gsap.to(box, { autoAlpha: 0, scale: 0.88, duration: 0.4, ease: ease.out });
    const show = (e: Event) => {
      const src = (e.currentTarget as HTMLElement).dataset.preview;
      if (!src) return hide();
      img.src = src;
      gsap.to(box, { autoAlpha: 1, scale: 1, duration: 0.55, ease: ease.out });
    };
    list.querySelectorAll<HTMLElement>('a').forEach((a) => { a.addEventListener('pointerenter', show); const s = a.dataset.preview; if (s) new Image().src = s; });
    list.addEventListener('pointerleave', hide);
    addEventListener('pointermove', move);
    const off = onScroll(() => { if (!list.contains(document.elementFromPoint(px, py))) hide(); });
    return () => { removeEventListener('pointermove', move); off(); };
  });
}
