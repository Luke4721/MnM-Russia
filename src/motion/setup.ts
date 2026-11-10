// Global motion: runs once on the client, before the first page initializes.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ease, onPage, onScroll, prefersReducedMotion, setLoaderExit, setLoaderFormat, setLoaderProgress, setTransition } from '@/engine';
import { PIGMENTS } from '@/lib/site';
import { startPageMotion } from './pages';

gsap.registerPlugin(ScrollTrigger);

export function setupMotion() {
  // Loader: the Devanagari "namaste" fills with colour as the page really loads (grey to colour, the whole idea in one word).
  setLoaderFormat((p) => `${Math.round(p)}%`);
  setLoaderProgress((p, root) => root.querySelector<HTMLElement>('.loader__word')?.style.setProperty('--p', `${p}%`));
  setLoaderExit((root) => gsap.timeline()
    .to(root.querySelectorAll('.loader__name, .loader__count'), { autoAlpha: 0, duration: 0.3 })
    .to(root.querySelector('.loader__word'), { scale: 1.12, duration: 0.8, ease: ease.out }, 0)
    .to(root, { clipPath: 'circle(0% at 50% 50%)', duration: 0.85, ease: ease.inOut }, 0.1));

  // Page transition: a pigment disc blooms from the click point, covers the page, then retreats toward the top.
  let point = { x: innerWidth / 2, y: innerHeight };
  addEventListener('pointerdown', (e) => { point = { x: e.clientX, y: e.clientY }; });
  setTransition({
    leave: (c) => {
      const panel = c.querySelector<HTMLElement>('.curtain__panel')!;
      panel.style.background = PIGMENTS[Math.floor(Math.random() * PIGMENTS.length)];
      return gsap.timeline()
        .set(c, { autoAlpha: 1 })
        .fromTo(panel, { clipPath: `circle(0% at ${point.x}px ${point.y}px)` }, { clipPath: `circle(150% at ${point.x}px ${point.y}px)`, duration: 0.85, ease: ease.inOut });
    },
    enter: (c) => gsap.timeline()
      .to(c.querySelector('.curtain__panel'), { clipPath: `circle(0% at 50% -10%)`, duration: 0.95, ease: ease.inOut })
      .set(c, { autoAlpha: 0 }),
  });

  startPageMotion();

  // Header steps aside while reading down, returns on the way up.
  let last = 0;
  onScroll(({ y }) => {
    if (Math.abs(y - last) < 4) return;
    document.documentElement.classList.toggle('frame-away', y > 200 && y > last);
    last = y;
  });

  onPage(() => {
    if (prefersReducedMotion()) return;
    // Bloom: every photo with a veil dissolves from grey to colour around a point as it enters.
    const blooms = gsap.utils.toArray<HTMLElement>('.bloom:not(.bloom--done):not([data-bloom-manual])');
    ScrollTrigger.batch(blooms, {
      start: 'top 90%', once: true,
      onEnter: (els) => (els as HTMLElement[]).forEach((el, i) => {
        const veil = el.querySelector<HTMLElement>('.bloom__veil');
        if (!veil) return el.classList.add('bloom--done');
        const [ox, oy] = (el.dataset.bloomOrigin || `${20 + Math.random() * 60},${20 + Math.random() * 60}`).split(',');
        gsap.set(veil, { '--ox': `${ox}%`, '--oy': `${oy}%`, '--r': '-30%' });
        gsap.to(veil, { '--r': '150%', duration: 1.9, delay: i * 0.08, ease: 'power2.out', onComplete: () => el.classList.add('bloom--done') });
      }),
    });
    // Footer wordmark: grey to gulal as the page ends.
    const word = document.querySelector<HTMLElement>('[data-footer-word]');
    if (word) gsap.fromTo(word, { '--cs': '105%' }, { '--cs': '-80%', ease: 'none', scrollTrigger: { trigger: word, start: 'top 95%', end: 'bottom 60%', scrub: true } });
  });
}
