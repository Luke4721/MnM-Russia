'use client';
// Page-to-page transition: the carved palace doors swing shut, the route changes behind them, then they swing open on the new room.
import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import gsap from 'gsap';

const OPEN = 86;

export function Doors() {
  const router = useRouter();
  const path = usePathname();
  const root = useRef<HTMLDivElement>(null), L = useRef<HTMLDivElement>(null), R = useRef<HTMLDivElement>(null);
  const pending = useRef(false), from = useRef(path), safety = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const enabled = useRef(true);

  const open = () => {
    pending.current = false; clearTimeout(safety.current);
    const tl = gsap.timeline({ onComplete: () => { if (root.current) root.current.style.visibility = 'hidden'; } });
    tl.to(L.current, { rotateY: OPEN, duration: 1.15, ease: 'power3.inOut' }, 0.05).to(R.current, { rotateY: -OPEN, duration: 1.15, ease: 'power3.inOut' }, 0.05)
      .to(root.current!.querySelector('.doors__seam'), { opacity: 0, duration: 0.5 }, 0);
  };

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { enabled.current = false; return; }
    gsap.set(L.current, { rotateY: OPEN }); gsap.set(R.current, { rotateY: -OPEN });
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || pending.current) return;
      const a = (e.target as Element).closest?.('a'); if (!a) return;
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('/') || href.startsWith('//') || a.target === '_blank' || a.hasAttribute('download')) return;
      const url = new URL(href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      e.preventDefault(); e.stopPropagation();
      pending.current = true; from.current = location.pathname;
      const r = root.current!; r.style.visibility = 'visible';
      gsap.set(r.querySelector('.doors__seam'), { opacity: 0 });
      gsap.timeline()
        .to(L.current, { rotateY: 0, duration: 0.6, ease: 'power2.in' }, 0).to(R.current, { rotateY: 0, duration: 0.6, ease: 'power2.in' }, 0)
        .to(r.querySelector('.doors__seam'), { opacity: 1, duration: 0.3 }, 0.35)
        .add(() => { if (!url.hash) scrollTo({ top: 0, behavior: 'instant' }); router.push(url.pathname + url.search + url.hash); safety.current = setTimeout(open, 5000); });
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // route changed while the doors are shut: wait for the new room to be ready, then open
  useEffect(() => {
    if (!enabled.current || !pending.current || path === from.current) return;
    let done = false;
    if (!location.hash) scrollTo({ top: 0, behavior: 'instant' }); // new room starts at its entrance
    const go = () => { if (done) return; done = true; removeEventListener('castle-ready', go); setTimeout(() => requestAnimationFrame(open), 180); };
    addEventListener('castle-ready', go);
    const t = setTimeout(go, 2600);
    return () => { clearTimeout(t); removeEventListener('castle-ready', go); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  return (
    <div ref={root} className="doors" aria-hidden="true">
      <div ref={L} className="door door--l"><span className="door__ring" /></div>
      <div ref={R} className="door door--r"><span className="door__ring" /></div>
      <div className="doors__seam" />
    </div>
  );
}
