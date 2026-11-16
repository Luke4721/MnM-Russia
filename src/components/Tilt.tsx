'use client';
// Pointer-driven 3D tilt: children marked data-z="n" lift n px off the card, so photo, title and price sit at different depths.
import { useRef } from 'react';

export function Tilt({ children, className = '', max = 9, as: Tag = 'div' }: { children: React.ReactNode; className?: string; max?: number; as?: 'div' | 'li' }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--rx', `${(-y * max).toFixed(2)}deg`); el.style.setProperty('--ry', `${(x * max).toFixed(2)}deg`);
    el.style.setProperty('--gx', `${(x + 0.5) * 100}%`); el.style.setProperty('--gy', `${(y + 0.5) * 100}%`);
  };
  const leave = () => { const el = ref.current; if (!el) return; el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); };
  const P = Tag as 'div';
  return <P ref={ref} className={`tilt ${className}`} onPointerMove={move} onPointerLeave={leave}>{children}</P>;
}
