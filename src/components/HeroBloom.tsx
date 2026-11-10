'use client';
// The signature: a monochrome frame in which colour spreads like Holi powder. Each scene arrives grey at a noisy
// wavefront and saturates behind it. Click or tap sets the origin of the next scene. One clock (gsap ticker), paused off screen.
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { Mesh, Program, Renderer, Texture, Triangle } from 'ogl';
import { usePage } from '@/engine/next';
import { prefersReducedMotion } from '@/engine';

export type Scene = { id: string; w: number; h: number; place: string; when: string; slug: string; title: string; alt: string };

const VERT = /* glsl */ `
attribute vec2 uv; attribute vec2 position; varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }`;

const FRAG = /* glsl */ `
precision highp float;
uniform sampler2D uA; uniform sampler2D uB;
uniform vec2 uRes; uniform vec2 uImgA; uniform vec2 uImgB; uniform vec2 uOrigin; uniform vec2 uIntroOrigin; uniform vec2 uPointer;
uniform float uT; uniform float uMix; uniform float uIntro; uniform float uLens;
varying vec2 vUv;
vec2 cover(vec2 uv, vec2 res, vec2 img) { float rs = res.x / res.y, is = img.x / img.y; vec2 s = rs > is ? vec2(1.0, is / rs) : vec2(rs / is, 1.0); return (uv - 0.5) * s + 0.5; }
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y); }
float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; } return v; }
vec3 grey(vec3 c) { float l = dot(c, vec3(0.299, 0.587, 0.114)); return vec3(l * 0.97, l * 0.98, l * 1.02) * 0.94 + 0.045; }
void main() {
  vec2 uv = vUv;
  vec2 asp = vec2(uRes.x / uRes.y, 1.0);
  float z = 1.0 - 0.04 * (0.5 + 0.5 * sin(uT * 0.12));
  vec2 p = (uv - 0.5) * z + 0.5;
  vec2 dp = (uv - uPointer) * asp;
  float pl = exp(-dot(dp, dp) * 16.0) * uLens;
  p += (uPointer - uv) * pl * 0.05;
  vec3 a = texture2D(uA, cover(p, uRes, uImgA)).rgb;
  vec3 b = texture2D(uB, cover(p, uRes, uImgB)).rgb;

  // intro: scene A starts grey and blooms from the intro origin
  vec2 qi = (uv - uIntroOrigin) * asp;
  float di = length(qi) + (fbm(qi * 3.0 + 4.0) - 0.5) * 0.42;
  float ci = smoothstep(uIntro * 2.3, uIntro * 2.3 - 0.45, di);
  a = mix(grey(a), a, ci);

  // transition: scene B grows from the click origin, arrives grey, saturates behind the front
  vec2 q = (uv - uOrigin) * asp;
  float n = fbm(q * 3.2 + uT * 0.04);
  float dist = length(q) + (n - 0.5) * 0.4;
  float R = uMix * 2.35;
  float reveal = smoothstep(R, R - 0.1, dist);
  float colour = smoothstep(R - 0.3, R - 0.62, dist);
  vec3 bc = mix(grey(b), b, colour);
  vec3 col = mix(a, bc, reveal);
  float live = step(0.002, uMix) * step(uMix, 0.998);
  float ring = smoothstep(0.1, 0.0, abs(dist - R + 0.05)) * live;
  col += ring * vec3(0.92, 0.2, 0.5) * 0.16;

  // pointer lens: a little extra saturation under the cursor
  float l = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(vec3(l), col, 1.0 + pl * 0.55);
  gl_FragColor = vec4(col, 1.0);
}`;

const WHEN_AUTOPLAY = 6.8;

export function HeroBloom({ scenes }: { scenes: Scene[] }) {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [gl, setGl] = useState<'off' | 'on'>('off');
  const api = useRef<{ go: (i: number, ox?: number, oy?: number) => void; pause: (p: boolean) => void } | null>(null);

  useEffect(() => {
    const el = canvas.current, host = box.current;
    if (!el || !host || prefersReducedMotion()) return;
    let renderer: Renderer;
    try { renderer = new Renderer({ canvas: el, dpr: Math.min(devicePixelRatio || 1, matchMedia('(max-width: 767px)').matches ? 1.5 : 1.75), alpha: false, antialias: false, powerPreference: 'high-performance' }); } catch { return; }
    const g = renderer.gl;
    if (!g) return;
    const tex = scenes.map(() => new Texture(g, { generateMipmaps: false, minFilter: g.LINEAR, magFilter: g.LINEAR, wrapS: g.CLAMP_TO_EDGE, wrapT: g.CLAMP_TO_EDGE }));
    const loaded: boolean[] = scenes.map(() => false);
    const load = (i: number) => new Promise<void>((res) => {
      if (loaded[i]) return res();
      const im = new Image();
      im.decoding = 'async';
      im.onload = () => { tex[i].image = im; loaded[i] = true; res(); };
      im.onerror = () => res();
      im.src = `/p/${scenes[i].id}.jpg`;
    });
    const program = new Program(g, {
      vertex: VERT, fragment: FRAG,
      uniforms: {
        uA: { value: tex[0] }, uB: { value: tex[1 % scenes.length] },
        uRes: { value: [1, 1] }, uImgA: { value: [scenes[0].w, scenes[0].h] }, uImgB: { value: [scenes[1 % scenes.length].w, scenes[1 % scenes.length].h] },
        uOrigin: { value: [0.5, 0.5] }, uIntroOrigin: { value: [0.62, 0.42] }, uPointer: { value: [0.5, 0.5] },
        uT: { value: 0 }, uMix: { value: 0 }, uIntro: { value: 0 }, uLens: { value: 0 },
      },
    });
    const mesh = new Mesh(g, { geometry: new Triangle(g), program });
    const U = program.uniforms;
    const resize = () => { const r = host.getBoundingClientRect(); renderer.setSize(r.width, r.height); U.uRes.value = [r.width, r.height]; };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(host);

    let cur = 0, busy = false, visible = true, isPaused = false, timer: gsap.core.Tween | null = null;
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, lens: 0 };
    const onMove = (e: PointerEvent) => { const r = host.getBoundingClientRect(); pointer.tx = (e.clientX - r.left) / r.width; pointer.ty = 1 - (e.clientY - r.top) / r.height; pointer.lens = 1; };
    const onLeave = () => { pointer.lens = 0; };
    host.addEventListener('pointermove', onMove); host.addEventListener('pointerleave', onLeave);

    const schedule = () => { timer?.kill(); if (!isPaused) timer = gsap.delayedCall(WHEN_AUTOPLAY, () => (visible ? go((cur + 1) % scenes.length) : schedule())); };
    const go = async (i: number, ox?: number, oy?: number) => {
      if (busy || i === cur) return;
      busy = true; timer?.kill();
      await load(i);
      U.uB.value = tex[i]; U.uImgB.value = [scenes[i].w, scenes[i].h];
      U.uOrigin.value = [ox ?? 0.2 + Math.random() * 0.6, oy ?? 0.25 + Math.random() * 0.5];
      setActive(i);
      gsap.fromTo(U.uMix, { value: 0 }, { value: 1, duration: 2.3, ease: 'power2.inOut', onComplete: () => {
        U.uA.value = tex[i]; U.uImgA.value = [scenes[i].w, scenes[i].h]; U.uMix.value = 0; cur = i; busy = false; schedule();
      } });
    };
    const onClick = (e: MouseEvent) => {
      const r = host.getBoundingClientRect();
      if ((e.target as HTMLElement).closest('a,button')) return;
      go((cur + 1) % scenes.length, (e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
    };
    host.addEventListener('click', onClick);

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.05 });
    io.observe(host);
    const tick = (t: number) => {
      pointer.x += (pointer.tx - pointer.x) * 0.08; pointer.y += (pointer.ty - pointer.y) * 0.08;
      U.uPointer.value = [pointer.x, pointer.y];
      U.uLens.value += (pointer.lens - U.uLens.value) * 0.06;
      U.uT.value = t;
      if (visible && !document.hidden) renderer.render({ scene: mesh });
    };
    gsap.ticker.add(tick);

    let started = false;
    load(0).then(() => { load(1 % scenes.length); tick(0); setGl('on'); });
    api.current = {
      go: (i, ox, oy) => go(i, ox, oy),
      pause: (p) => { isPaused = p; p ? timer?.kill() : schedule(); },
    };
    (host as HTMLElement & { __intro?: () => void }).__intro = () => {
      if (started) return; started = true;
      gsap.to(U.uIntro, { value: 1, duration: 2.6, ease: 'power2.out', onComplete: schedule });
    };
    return () => {
      gsap.ticker.remove(tick); timer?.kill(); ro.disconnect(); io.disconnect();
      host.removeEventListener('pointermove', onMove); host.removeEventListener('pointerleave', onLeave); host.removeEventListener('click', onClick);
      g.getExtension('WEBGL_lose_context')?.loseContext();
      api.current = null;
    };
  }, [scenes]);

  // Starts with the page intro (after the loader lifts), so the bloom is the first thing the visitor sees.
  usePage(({ intro }) => {
    const host = box.current as (HTMLDivElement & { __intro?: () => void }) | null;
    intro.add(() => host?.__intro?.(), 0.15);
  });

  const s = scenes[active];
  return (
    <div ref={box} className={`hb ${gl === 'on' ? 'is-gl' : ''}`} data-cursor="Дальше">
      <canvas ref={canvas} className="hb__canvas" aria-hidden="true" />
      <div className="hb__caption" aria-live="polite">
        <p className="hb__place">{s.place}</p>
        <p className="hb__when">{s.when}</p>
        <Link className="alink" href={`/destinations/${s.slug}`}>
          <span>{s.title}</span> <span className="alink__arrow" aria-hidden="true">→</span>
        </Link>
      </div>
      <div className="hb__ctrl">
        <ol className="hb__dots" aria-label="Сцены">
          {scenes.map((sc, i) => (
            <li key={sc.id}>
              <button type="button" aria-label={`${sc.place}`} aria-current={i === active ? 'true' : undefined} onClick={() => api.current?.go(i)} />
            </li>
          ))}
        </ol>
        <button type="button" className="hb__pause" aria-pressed={paused} onClick={() => { setPaused((p) => { api.current?.pause(!p); return !p; }); }}>
          {paused ? 'Смена кадров: продолжить' : 'Смена кадров: пауза'}
        </button>
      </div>
    </div>
  );
}
