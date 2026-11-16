'use client';
// A different room of one Rajasthani fort palace behind every page, all low-poly and warm. Scrolling walks the camera slowly through it;
// nothing reacts to the pointer, and the Calm switch freezes it. Scenes: courtyard (home, programmes), jali gallery (catalogue, blog),
// durbar hall (luxury), Hawa Mahal facade (gallery), chhatri terrace (about), fort gate (contact).
import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { MOODS } from './moods';

export type Img = { id: string; w: number; h: number };
export type SceneName = 'courtyard' | 'gallery' | 'durbar' | 'facade' | 'terrace' | 'gate';
export type ToneName = 'pink' | 'peach' | 'gold' | 'rose' | 'honey' | 'sage' | 'dawn';
type Tone = { wall: string; pillar: string; arch: string; trim: string; floorA: string; floorB: string; water: string; gold: string; fog: string };
export const TONES: Record<ToneName, Tone> = {
  pink: { wall: '#e0ad90', pillar: '#ecc8a8', arch: '#dd9d7c', trim: '#f3dcc0', floorA: '#e9cfb2', floorB: '#d49c7c', water: '#c3d9d4', gold: '#d4a437', fog: '#f4dfcc' },
  peach: { wall: '#e6b99a', pillar: '#f1d2b4', arch: '#e2a888', trim: '#f8e6cf', floorA: '#f0d9bf', floorB: '#d9a888', water: '#c8dcd6', gold: '#d4a437', fog: '#f7e6d4' },
  gold: { wall: '#dcc392', pillar: '#efe0b8', arch: '#e2c47e', trim: '#faefd2', floorA: '#f1e4c2', floorB: '#d9bd78', water: '#cfe0d6', gold: '#c9962a', fog: '#f6ead0' },
  rose: { wall: '#e3a59a', pillar: '#f0c4b6', arch: '#d98b86', trim: '#f7dcc9', floorA: '#efd2c2', floorB: '#dca08f', water: '#cfdcd6', gold: '#d4a437', fog: '#f8e2d8' },
  honey: { wall: '#dfb98a', pillar: '#edd0a2', arch: '#d9a463', trim: '#f6e2bd', floorA: '#ecd7b2', floorB: '#d3a468', water: '#c9d9d0', gold: '#d4a437', fog: '#f5e4c8' },
  sage: { wall: '#d4c7a3', pillar: '#e6dcc0', arch: '#b7b88a', trim: '#f2ecd5', floorA: '#e8e0c6', floorB: '#bfc19a', water: '#bcd5cf', gold: '#c9a23c', fog: '#f1ecd9' },
  dawn: { wall: '#e2b48c', pillar: '#f0d0aa', arch: '#d8996c', trim: '#f9e6c6', floorA: '#f1d9b4', floorB: '#d7a374', water: '#c3d8d6', gold: '#d4a437', fog: '#fbe3c6' },
};

function cusped(r: number, cy: number, base: number, lobes = 5, depth = 0.13, steps = 36) {
  const pts: THREE.Vector2[] = [new THREE.Vector2(-r, base), new THREE.Vector2(-r, cy)];
  for (let i = 0; i <= steps; i++) {
    const a = Math.PI - (Math.PI * i) / steps;
    const rr = r - depth * Math.abs(Math.cos(lobes * a));
    pts.push(new THREE.Vector2(rr * Math.cos(a), cy + rr * Math.sin(a)));
  }
  pts.push(new THREE.Vector2(r, base));
  return pts;
}
const ex = (s: THREE.Shape, d: number) => new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false });
const mat = (color: string, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) => new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.85, metalness: 0.02, ...extra });
function tileTexture(a: string, b: string, rx: number, ry: number) {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d')!; g.fillStyle = a; g.fillRect(0, 0, 128, 128); g.fillStyle = b;
  g.beginPath(); g.moveTo(64, 0); g.lineTo(128, 64); g.lineTo(64, 128); g.lineTo(0, 64); g.fill();
  g.strokeStyle = 'rgba(120,70,40,.16)'; g.lineWidth = 2; g.strokeRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.repeat.set(rx, ry); return t;
}
function useMats(tone: Tone) {
  return useMemo(() => ({ wall: mat(tone.wall), pillar: mat(tone.pillar), arch: mat(tone.arch), trim: mat(tone.trim, { roughness: 0.6 }), gold: mat(tone.gold, { metalness: 0.6, roughness: 0.4, emissive: tone.gold, emissiveIntensity: 0.3 }), water: mat(tone.water, { roughness: 0.25, metalness: 0.1 }), dark: mat('#8a5238'), glow: new THREE.MeshBasicMaterial({ color: '#fff0d6' }) }), [tone]);
}
const G0 = () => ({ box: new THREE.BoxGeometry(1, 1, 1), plane: new THREE.PlaneGeometry(1, 1), cyl: new THREE.CylinderGeometry(0.2, 0.26, 4.6, 8), cylS: new THREE.CylinderGeometry(0.07, 0.07, 0.8, 6), dome: new THREE.SphereGeometry(1, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2), fin: new THREE.ConeGeometry(0.07, 0.6, 6), ball: new THREE.SphereGeometry(0.11, 6, 4), octa: new THREE.OctahedronGeometry(0.22, 0), cone: new THREE.ConeGeometry(1, 1, 5) });

/** Shared camera + air: slow scroll travel, calm freeze, chapter-mood tint. */
function useRig(opts: { tone: Tone; inner: boolean; calm: boolean; onReady: () => void; path: (p: number, t: number, cam: THREE.PerspectiveCamera) => void }) {
  const told = useRef(false), off = useRef(0), p = useRef(0);
  const fogC = useMemo(() => new THREE.Color(opts.tone.fog), [opts.tone]);
  const target = useMemo(() => new THREE.Color(opts.tone.fog), [opts.tone]);
  useEffect(() => {
    const on = (e: Event) => { const i = (e as CustomEvent<number>).detail; if (i >= 0) target.set(opts.tone.fog).lerp(new THREE.Color(MOODS[i % MOODS.length].c[1]), 0.2); };
    addEventListener('mood', on); return () => removeEventListener('mood', on);
  }, [opts.tone, target]);
  useFrame(({ camera, clock, scene, size }) => {
    if (!told.current) { told.current = true; opts.onReady(); }
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    if (!opts.calm) p.current += (Math.min(1, scrollY / max) - p.current) * 0.05;
    opts.path(p.current, opts.calm ? 0 : clock.elapsedTime, camera as THREE.PerspectiveCamera);
    fogC.lerp(target, 0.03); (scene.background as THREE.Color).copy(fogC); (scene.fog as THREE.Fog).color.copy(fogC);
    const lead = Math.max(0, 1 - scrollY / (innerHeight * 0.8)), want = size.width < 768 ? 0 : -lead * size.width * 0.17;
    if (Math.abs(want - off.current) > 0.5) { off.current = want; (camera as THREE.PerspectiveCamera).setViewOffset(size.width, size.height, want, 0, size.width, size.height); }
    const base = opts.inner ? 0.42 : 0.1, top = opts.inner ? 0.74 : 0.7;
    document.documentElement.style.setProperty('--veil', String(base + (top - base) * Math.min(1, scrollY / (innerHeight * 0.9))));
  });
}

// ---------- halls: courtyard, jali gallery, durbar -------------------------------------------------------------
type HallCfg = { endWall: boolean; ceiling: boolean; jali: boolean; openLeft: boolean; water: boolean; rows2: boolean; lamps: 'crown' | 'hang' | 'none'; N: number };
const HALLS: Record<string, HallCfg> = {
  courtyard: { endWall: true, ceiling: false, jali: false, openLeft: false, water: true, rows2: false, lamps: 'crown', N: 24 },
  gallery: { endWall: false, ceiling: true, jali: true, openLeft: true, water: false, rows2: false, lamps: 'none', N: 22 },
  durbar: { endWall: true, ceiling: true, jali: false, openLeft: false, water: false, rows2: true, lamps: 'hang', N: 22 },
};
const LEN = 4.4;

function Hall({ kind, tone, img, small, inner, calm, onReady }: { kind: 'courtyard' | 'gallery' | 'durbar'; tone: Tone; img: Img; small: boolean; inner: boolean; calm: boolean; onReady: () => void }) {
  const cfg = HALLS[kind]; const N = small ? Math.min(cfg.N, 14) : cfg.N;
  const tex = useLoader(THREE.TextureLoader, `/p/${img.id}.jpg`);
  useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    const a = img.w / img.h, pa = 5.4 / 6.6;
    if (a > pa) { tex.repeat.set(pa / a, 1); tex.offset.set((1 - pa / a) / 2, 0); } else { tex.repeat.set(1, a / pa); tex.offset.set(0, (1 - a / pa) / 2); }
  }, [tex, img]);
  const M = useMats(tone); const g0 = useMemo(G0, []);
  const floorTex = useMemo(() => tileTexture(tone.floorA, tone.floorB, 7, N * LEN / 2 + 8), [tone, N]);
  const G = useMemo(() => {
    const archShape = new THREE.Shape(cusped(3.6, 3.1, 0, 7, 0.2)); archShape.holes.push(new THREE.Path(cusped(3.1, 3.1, 0, 7, 0.16).reverse()));
    const rect = (w: number, h: number) => new THREE.Shape([new THREE.Vector2(-w / 2, 0), new THREE.Vector2(w / 2, 0), new THREE.Vector2(w / 2, h), new THREE.Vector2(-w / 2, h)]);
    const wallS = rect(LEN, 7); wallS.holes.push(new THREE.Path(cusped(0.95, 3.7, 1.7, 5, 0.1, 24).reverse()));
    const jaliS = rect(LEN, 7);
    for (const cx of [-1.4, 0, 1.4]) for (const cy of [2.0, 4.6]) jaliS.holes.push(new THREE.Path(cusped(0.42, cy + 0.2, cy - 0.7, 3, 0.06, 14).map((p) => new THREE.Vector2(p.x + cx, p.y)).reverse()));
    const hole = cusped(1.5, 0.5, -2);
    const endS = new THREE.Shape([new THREE.Vector2(-7.7, -6), new THREE.Vector2(7.7, -6), new THREE.Vector2(7.7, 6), new THREE.Vector2(-7.7, 6)]); endS.holes.push(new THREE.Path(hole.slice().reverse()));
    const ring = (r: number, b: number) => { const s = new THREE.Shape(cusped(r, 0.5, b, 5, 0.16)); s.holes.push(new THREE.Path(hole.slice().reverse())); return s; };
    const niche = (x: number) => { const g = ex(new THREE.Shape(cusped(0.55, 1.2, -1.2, 3, 0.07, 18)), 0.1); g.translate(x, 0, 0); return g; };
    return { arch: ex(archShape, 0.4), wall: ex(wallS, 0.4), jali: ex(jaliS, 0.4), end: ex(endS, 0.6), ring1: ex(ring(1.78, -2.28), 0.28), ring2: ex(ring(2.12, -2.62), 0.16), nL: niche(-3.7), nR: niche(3.7), base: new THREE.BoxGeometry(0.7, 0.3, 0.7), cap: new THREE.BoxGeometry(0.8, 0.26, 0.8), brk: new THREE.BoxGeometry(0.26, 0.7, 0.9), capS: new THREE.BoxGeometry(0.42, 0.18, 0.42) };
  }, []);
  const merlons = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    const m = merlons.current; if (!m) return; const d = new THREE.Object3D(); let i = 0;
    for (const side of [-1, 1]) for (let k = 0; k < N * 4; k++) { d.position.set(side * 5.6, 7.3, -k * 1.1 + 4); d.scale.set(0.4, 0.55, 0.7); d.updateMatrix(); m.setMatrixAt(i++, d.matrix); }
    m.instanceMatrix.needsUpdate = true;
  }, [N]);
  const endGroup = useRef<THREE.Group>(null);
  const travel = Math.min(N * LEN - 14, 62);
  useRig({ tone, inner, calm, onReady, path: (p, t, cam) => {
    cam.position.set(Math.sin(t * 0.2) * 0.04, 2.5 + Math.sin(t * 0.3) * 0.02, 4 - p * travel);
    cam.lookAt(0, 2.7, cam.position.z - 20);
    if (endGroup.current) endGroup.current.position.y = 3.4 - Math.min(1, scrollY / (innerHeight * 0.9)) * 16;
  } });
  const L = N * LEN + 16, mid = -N * LEN / 2 + 6;
  const mods = Array.from({ length: N }, (_, i) => i);
  return (
    <>
      <color attach="background" args={[tone.fog]} /><fog attach="fog" args={[tone.fog, 10, small ? 34 : 52]} />
      <ambientLight intensity={0.95} color="#fff1dc" /><hemisphereLight args={['#ffe9c8', '#9a5a38', 0.55]} />
      <directionalLight position={[-6, 10, 8]} intensity={2.1} color="#ffd9a0" /><directionalLight position={[8, 4, -4]} intensity={0.6} color="#ffb98a" />
      <mesh geometry={g0.plane} position={[0, 0, mid]} rotation={[-Math.PI / 2, 0, 0]} scale={[14, L, 1]}><meshStandardMaterial map={floorTex} flatShading roughness={0.9} /></mesh>
      {cfg.water && <><mesh geometry={g0.plane} material={M.water} position={[0, 0.03, mid]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.1, L, 1]} /><mesh geometry={g0.box} material={M.trim} position={[0, 0.02, mid]} scale={[1.6, 0.04, L]} /></>}
      {mods.map((i) => (
        <group key={i} position={[0, 0, 2 - i * LEN]}>
          <mesh geometry={G.arch} material={M.arch} position={[0, 0.25, -0.2]} />
          {[-1, 1].map((s) => (
            <group key={s}>
              <mesh geometry={g0.cyl} material={M.pillar} position={[s * 3.35, 2.6, 0]} />
              <mesh geometry={G.base} material={M.trim} position={[s * 3.35, 0.15, 0]} /><mesh geometry={G.cap} material={M.trim} position={[s * 3.35, 4.95, 0]} />
              <mesh geometry={G.brk} material={M.arch} position={[s * 3.0, 5.35, 0]} rotation={[0, 0, -s * 0.5]} />
              {!(cfg.openLeft && s === -1) && <mesh geometry={cfg.jali && s === 1 ? G.jali : G.wall} material={M.wall} position={[s * 5.6, 0, 0]} rotation={[0, s * -Math.PI / 2, 0]} />}
              {cfg.rows2 && <group><mesh geometry={g0.cyl} material={M.pillar} position={[s * 7.6, 2.6, 0]} scale={[0.9, 1, 0.9]} /><mesh geometry={G.cap} material={M.trim} position={[s * 7.6, 4.95, 0]} /><mesh geometry={g0.box} material={M.arch} position={[s * 5.5, 5.4, 0]} scale={[4.2, 0.3, 0.5]} /></group>}
            </group>
          ))}
          {cfg.lamps === 'crown' && <mesh geometry={g0.octa} material={M.gold} position={[0, 6.0, 0]} scale={[1, 1.5, 1]} />}
          {cfg.lamps === 'hang' && [-1, 0, 1].map((x) => <group key={x} position={[x * 2.4, 0, 0]}><mesh geometry={g0.cylS} material={M.gold} position={[0, 6.45, 0]} scale={[0.5, 0.9, 0.5]} /><mesh geometry={g0.octa} material={M.gold} position={[0, 5.4, 0]} scale={[1.5, 2.2, 1.5]} /></group>)}
          {cfg.ceiling && <mesh geometry={g0.box} material={M.arch} position={[0, 6.75, 0]} scale={[cfg.rows2 ? 17 : 11.6, 0.3, 0.55]} />}
        </group>
      ))}
      {cfg.ceiling && <mesh geometry={g0.box} material={M.wall} position={[0, 7.05, mid]} scale={[cfg.rows2 ? 18 : 12, 0.25, L]} />}
      {cfg.openLeft && Array.from({ length: 9 }, (_, i) => <group key={i} position={[-24 - (i % 3) * 6, 0, 6 - i * 13]}><mesh geometry={g0.cone} material={M.arch} position={[0, 4, 0]} scale={[9, 8, 9]} /><mesh geometry={g0.box} material={M.trim} position={[0, 8.5, 0]} scale={[3.6, 0.7, 1.4]} /><mesh geometry={g0.dome} material={M.trim} position={[0, 9.0, 0]} scale={[0.9, 0.7, 0.9]} /></group>)}
      {!cfg.ceiling && <><mesh geometry={g0.box} material={M.trim} position={[-5.6, 6.85, mid]} scale={[0.7, 0.3, L]} /><mesh geometry={g0.box} material={M.trim} position={[5.6, 6.85, mid]} scale={[0.7, 0.3, L]} /><instancedMesh ref={merlons} args={[g0.box, M.trim, N * 8]} /></>}
      {cfg.endWall && <group ref={endGroup} position={[0, 3.4, -9.5]} scale={1.5}>
        <mesh geometry={G.end} material={M.wall} />
        <mesh geometry={G.ring1} material={M.trim} position={[0, 0, 0.6]} /><mesh geometry={G.ring2} material={M.arch} position={[0, 0, 0.6]} />
        <mesh geometry={G.nL} material={M.trim} position={[0, 0, 0.6]} /><mesh geometry={G.nR} material={M.trim} position={[0, 0, 0.6]} />
        <mesh geometry={g0.box} material={M.trim} position={[0, 3.55, 0.95]} scale={[15.4, 0.34, 0.8]} /><mesh geometry={g0.box} material={M.arch} position={[0, 3.9, 0.85]} scale={[15.4, 0.2, 0.6]} />
        <mesh geometry={g0.box} material={M.trim} position={[0, -2.12, 1.2]} scale={[4, 0.22, 1.3]} />
        {[-1.5, -0.5, 0.5, 1.5].map((x) => <mesh key={x} geometry={g0.box} material={M.arch} position={[x, -2.5, 1]} scale={[0.34, 0.6, 0.9]} rotation={[0.5, 0, 0]} />)}
        {[-1.5, -1, -0.5, 0, 0.5, 1, 1.5].map((x) => <mesh key={x} geometry={g0.cylS} material={M.trim} position={[x, -1.62, 1.7]} />)}
        <mesh geometry={g0.box} material={M.trim} position={[0, -1.18, 1.7]} scale={[3.8, 0.11, 0.2]} />
        {[-1.85, 1.85].map((x) => <group key={x}><mesh geometry={g0.cyl} material={M.pillar} position={[x, 0.6, 1.7]} scale={[0.6, 1.06, 0.6]} /><mesh geometry={G.capS} material={M.trim} position={[x, 3.1, 1.7]} /><mesh geometry={G.capS} material={M.trim} position={[x, -1.95, 1.7]} /></group>)}
        <mesh geometry={g0.box} material={M.trim} position={[0, 3.35, 1.45]} scale={[4.6, 0.2, 1.9]} />
        <mesh geometry={g0.dome} material={M.trim} position={[0, 3.45, 1.45]} scale={[1.65, 1.15, 0.9]} /><mesh geometry={g0.fin} material={M.gold} position={[0, 4.95, 1.45]} /><mesh geometry={g0.ball} material={M.gold} position={[0, 4.6, 1.45]} />
        <mesh position={[0, 0.1, -1.6]}><planeGeometry args={[5.4, 6.6]} /><meshBasicMaterial map={tex} toneMapped={false} /></mesh>
      </group>}
    </>
  );
}

// ---------- Hawa Mahal facade --------------------------------------------------------------------------------------
function Facade({ tone, small, inner, calm, onReady }: { tone: Tone; small: boolean; inner: boolean; calm: boolean; onReady: () => void }) {
  const M = useMats(tone); const g0 = useMemo(G0, []);
  const frame = useMemo(() => { const s = new THREE.Shape(cusped(0.62, 1.5, 0, 3, 0.1, 20)); s.holes.push(new THREE.Path(cusped(0.46, 1.5, 0.12, 3, 0.07, 16).reverse())); return ex(s, 0.18); }, []);
  const hole = useMemo(() => ex(new THREE.Shape(cusped(0.5, 1.5, 0.1, 3, 0.07, 16)), 0.05), []);
  const tiers = [{ w: 22, h: 3.4, y: 0, z: 0, n: 9 }, { w: 19.6, h: 3.2, y: 3.4, z: -0.9, n: 8 }, { w: 16.4, h: 3, y: 6.6, z: -1.8, n: 7 }, { w: 13, h: 2.8, y: 9.6, z: -2.7, n: 6 }, { w: 8.4, h: 2.6, y: 12.4, z: -3.6, n: 4 }];
  const floor = useMemo(() => tileTexture(tone.floorA, tone.floorB, 10, 10), [tone]);
  useRig({ tone, inner, calm, onReady, path: (p, t, cam) => {
    cam.position.set(Math.sin(t * 0.15) * 0.3, 2.2 + p * 9, 17 - p * 4);
    cam.lookAt(0, 4.2 + p * 8.5, 0);
  } });
  return (
    <>
      <color attach="background" args={[tone.fog]} /><fog attach="fog" args={[tone.fog, 22, small ? 55 : 80]} />
      <ambientLight intensity={0.95} color="#fff1dc" /><hemisphereLight args={['#ffe9c8', '#9a5a38', 0.55]} />
      <directionalLight position={[-8, 14, 12]} intensity={2.2} color="#ffd9a0" />
      <mesh geometry={g0.plane} position={[0, 0, 12]} rotation={[-Math.PI / 2, 0, 0]} scale={[90, 50, 1]}><meshStandardMaterial map={floor} flatShading roughness={0.9} /></mesh>
      {tiers.map((t, ti) => (
        <group key={ti} position={[0, t.y, t.z]}>
          <mesh geometry={g0.box} material={M.wall} position={[0, t.h / 2, 0]} scale={[t.w, t.h, 1.4]} />
          <mesh geometry={g0.box} material={M.trim} position={[0, t.h + 0.12, 0.2]} scale={[t.w + 0.4, 0.26, 1.7]} />
          {Array.from({ length: t.n }, (_, i) => { const x = -t.w / 2 + (i + 0.5) * (t.w / t.n); return (
            <group key={i} position={[x, 0, 0]}>
              <mesh geometry={hole} material={M.dark} position={[0, 0.5, 0.71]} /><mesh geometry={frame} material={M.trim} position={[0, 0.5, 0.72]} />
              <mesh geometry={g0.box} material={M.arch} position={[0, 0.35, 0.95]} scale={[1.1, 0.12, 0.5]} />
              <mesh geometry={g0.dome} material={M.trim} position={[0, t.h + 0.26, 0.2]} scale={[0.55, 0.5, 0.5]} />
              {ti === 4 && <mesh geometry={g0.fin} material={M.gold} position={[0, t.h + 1.0, 0.2]} />}
            </group>); })}
        </group>
      ))}
      <mesh geometry={g0.box} material={M.trim} position={[0, 0.2, 0.4]} scale={[24, 0.4, 2.4]} />
      {[-1, 1].map((s) => <group key={s} position={[s * 14.5, 0, -1]}><mesh geometry={g0.box} material={M.wall} position={[0, 2.5, 0]} scale={[6, 5, 2]} /><mesh geometry={g0.dome} material={M.trim} position={[0, 5, 0]} scale={[2.2, 1.7, 1.2]} /><mesh geometry={g0.fin} material={M.gold} position={[0, 6.7, 0]} /></group>)}
      {Array.from({ length: 6 }, (_, i) => <mesh key={i} geometry={g0.cone} material={M.arch} position={[-60 + i * 24, 7, -30]} scale={[26, 14, 14]} />)}
    </>
  );
}

// ---------- chhatri terrace ------------------------------------------------------------------------------------------
function Terrace({ tone, small, inner, calm, onReady }: { tone: Tone; small: boolean; inner: boolean; calm: boolean; onReady: () => void }) {
  const M = useMats(tone); const g0 = useMemo(G0, []);
  const floor = useMemo(() => tileTexture(tone.floorA, tone.floorB, 5, 40), [tone]);
  const n = small ? 5 : 8;
  useRig({ tone, inner, calm, onReady, path: (p, t, cam) => {
    cam.position.set(Math.sin(t * 0.2) * 0.05, 2.6, 6 - p * 48);
    cam.lookAt(0, 3.0, cam.position.z - 20);
  } });
  const chhatri = (x: number, z: number, k: number) => (
    <group key={k} position={[x, 0, z]}>
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => <mesh key={i} geometry={g0.cyl} material={M.pillar} position={[a * 1.1, 1.9, b * 1.1]} scale={[0.7, 0.8, 0.7]} />)}
      <mesh geometry={g0.box} material={M.trim} position={[0, 3.8, 0]} scale={[3.2, 0.25, 3.2]} />
      <mesh geometry={g0.dome} material={M.trim} position={[0, 3.9, 0]} scale={[1.9, 1.6, 1.9]} /><mesh geometry={g0.fin} material={M.gold} position={[0, 5.9, 0]} scale={[1.2, 1.3, 1.2]} />
      <mesh geometry={g0.box} material={M.arch} position={[0, 0.15, 0]} scale={[3.8, 0.3, 3.8]} />
    </group>);
  return (
    <>
      <color attach="background" args={[tone.fog]} /><fog attach="fog" args={[tone.fog, 14, small ? 46 : 70]} />
      <ambientLight intensity={1} color="#fff1dc" /><hemisphereLight args={['#ffe9c8', '#9a5a38', 0.5]} />
      <directionalLight position={[-6, 9, 4]} intensity={2.2} color="#ffd29a" />
      <mesh geometry={g0.plane} position={[0, 0, -30]} rotation={[-Math.PI / 2, 0, 0]} scale={[11, 110, 1]}><meshStandardMaterial map={floor} flatShading roughness={0.9} /></mesh>
      {[-1, 1].map((s) => <group key={s}><mesh geometry={g0.box} material={M.wall} position={[s * 5.6, 0.7, -30]} scale={[0.7, 1.4, 110]} /><mesh geometry={g0.box} material={M.trim} position={[s * 5.6, 1.5, -30]} scale={[1, 0.2, 110]} /></group>)}
      {Array.from({ length: n * 2 }, (_, i) => chhatri(i % 2 ? 3.4 : -3.4, 0 - Math.floor(i / 2) * 10 - (i % 2) * 5, i))}
      <mesh geometry={g0.plane} material={M.water} position={[0, -7, -40]} rotation={[-Math.PI / 2, 0, 0]} scale={[260, 200, 1]} />
      {Array.from({ length: 14 }, (_, i) => <mesh key={i} geometry={g0.cone} material={i % 2 ? M.arch : M.wall} position={[(i - 7) * 26, 5, -70 - (i % 3) * 18]} scale={[34, 22 + (i % 4) * 5, 20]} />)}
      {Array.from({ length: 22 }, (_, i) => <mesh key={i} geometry={g0.box} material={M.trim} position={[-60 + i * 6, 15 + (i % 3), -78]} scale={[2.4, 2.6, 1]} />)}
    </>
  );
}

// ---------- fort gate ------------------------------------------------------------------------------------------------
function Gate({ tone, small, inner, calm, onReady }: { tone: Tone; small: boolean; inner: boolean; calm: boolean; onReady: () => void }) {
  const M = useMats(tone); const g0 = useMemo(G0, []);
  const arch = useMemo(() => { const s = new THREE.Shape(cusped(5.2, 6, 0, 7, 0.3)); s.holes.push(new THREE.Path(cusped(3.4, 4.6, 0, 7, 0.2).reverse())); const wall = new THREE.Shape([new THREE.Vector2(-16, 0), new THREE.Vector2(16, 0), new THREE.Vector2(16, 13), new THREE.Vector2(-16, 13)]); wall.holes.push(new THREE.Path(cusped(3.4, 4.6, 0, 7, 0.2).reverse())); return { frame: ex(s, 2.4), wall: ex(wall, 2) }; }, []);
  const floor = useMemo(() => tileTexture(tone.floorA, tone.floorB, 10, 24), [tone]);
  const doorL = useRef<THREE.Group>(null), doorR = useRef<THREE.Group>(null);
  useRig({ tone, inner, calm, onReady, path: (p, t, cam) => {
    cam.position.set(Math.sin(t * 0.2) * 0.06, 2.8 + p * 1.2, 15 - p * 12);
    cam.lookAt(0, 4.4, -14);
    const open = Math.min(1, p * 1.6) * 1.15;
    if (doorL.current) doorL.current.rotation.y = -open;
    if (doorR.current) doorR.current.rotation.y = open;
  } });
  const studs = useMemo(() => Array.from({ length: 28 }, (_, i) => [(i % 4) * 1.4 + 0.4, 1 + Math.floor(i / 4) * 1.3]), []);
  const door = (s: number, ref: React.RefObject<THREE.Group | null>) => (
    <group ref={ref} position={[s * 3.4, 0, -13.2]}>
      <mesh geometry={g0.box} material={M.dark} position={[-s * 2.8, 3.3, 0]} scale={[5.6, 6.6, 0.3]} />
      {studs.map(([x, y], i) => <mesh key={i} geometry={g0.cone} material={M.gold} position={[-s * x, y + 0.2, 0.22]} scale={[0.16, 0.34, 0.16]} rotation={[Math.PI / 2, 0, 0]} />)}
    </group>);
  return (
    <>
      <color attach="background" args={[tone.fog]} /><fog attach="fog" args={[tone.fog, 16, small ? 50 : 72]} />
      <ambientLight intensity={0.95} color="#fff1dc" /><hemisphereLight args={['#ffe9c8', '#9a5a38', 0.5]} />
      <directionalLight position={[-6, 12, 14]} intensity={2.2} color="#ffd29a" />
      <mesh geometry={g0.plane} position={[0, 0, -6]} rotation={[-Math.PI / 2, 0, 0]} scale={[60, 90, 1]}><meshStandardMaterial map={floor} flatShading roughness={0.95} /></mesh>
      <mesh geometry={arch.wall} material={M.wall} position={[0, 0, -15]} />
      <mesh geometry={arch.frame} material={M.trim} position={[0, 0, -15.2]} />
      <mesh geometry={g0.box} material={M.trim} position={[0, 13.2, -14]} scale={[32.6, 0.5, 2.6]} />
      {Array.from({ length: 24 }, (_, i) => <mesh key={i} geometry={g0.box} material={M.trim} position={[-15 + i * 1.3, 14, -14]} scale={[0.7, 1.1, 1.2]} />)}
      {[-1, 1].map((s) => <group key={s} position={[s * 11, 0, -12]}><mesh geometry={g0.cyl} material={M.wall} position={[0, 6.5, 0]} scale={[4.6, 2.9, 4.6]} /><mesh geometry={g0.dome} material={M.trim} position={[0, 13.4, 0]} scale={[4.6, 3.4, 4.6]} /><mesh geometry={g0.fin} material={M.gold} position={[0, 17, 0]} scale={[1.4, 2, 1.4]} /></group>)}
      <mesh geometry={g0.plane} material={M.glow} position={[0, 4, -34]} scale={[40, 26, 1]} />
      {[-2, 2].map((s) => Array.from({ length: 4 }, (_, i) => <mesh key={`${s}${i}`} geometry={g0.cyl} material={M.pillar} position={[s * 5, 2.4, -22 - i * 5]} />))}
      {door(-1, doorL)}{door(1, doorR)}
      {[0, 1, 2].map((i) => <mesh key={i} geometry={g0.box} material={M.trim} position={[0, 0.15 + i * 0.15, -10 + i * 1.4]} scale={[11 - i * 0.6, 0.3, 1.4]} />)}
    </>
  );
}

export default function Castle3D({ scene, tone, img, inner, calm, onReady }: { scene: SceneName; tone: ToneName; img: Img; inner: boolean; calm: boolean; onReady: () => void }) {
  const small = typeof innerWidth !== 'undefined' && innerWidth < 768;
  const common = { tone: TONES[tone], small, inner, calm, onReady };
  return (
    <Canvas dpr={[1, small ? 1 : 1.5]} camera={{ fov: 40, position: [0, 2.5, 4], near: 0.1, far: 120 }} gl={{ antialias: !small, powerPreference: 'high-performance' }} style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}>
      <Suspense fallback={null}>
        {scene === 'facade' ? <Facade {...common} /> : scene === 'terrace' ? <Terrace {...common} /> : scene === 'gate' ? <Gate {...common} /> : <Hall kind={scene} img={img} {...common} />}
      </Suspense>
    </Canvas>
  );
}
