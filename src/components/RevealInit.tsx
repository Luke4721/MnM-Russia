'use client';
// One observer, one class: elements with data-reveal or data-split ease in the first time they enter the viewport.
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function RevealInit() {
  const path = usePathname();
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.in),[data-split]:not(.in)');
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [path]);
  return null;
}
