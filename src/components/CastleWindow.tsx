'use client';
// Lets a package page put its own cover photograph in the castle's far window.
import { useEffect } from 'react';

export function CastleWindow({ img }: { img: { id: string; w: number; h: number } }) {
  useEffect(() => { dispatchEvent(new CustomEvent('castle-img', { detail: img })); }, [img]);
  return null;
}
