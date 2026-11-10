import geo from '@/data/geo.json';

// A "constellation" map: only the places MnM goes, no borders (on purpose). Routes are lines between stops.
const ALL = geo as [string, number, number][];

export function RouteMap({ pts, title }: { pts: [string, number, number][]; title: string }) {
  if (pts.length < 2) return null;
  const lats = pts.map((p) => p[1]), lons = pts.map((p) => p[2]);
  const lat0 = (Math.min(...lats) + Math.max(...lats)) / 2;
  const k = Math.cos((lat0 * Math.PI) / 180);
  const W = 800, H = 640;
  let spanLon = (Math.max(...lons) - Math.min(...lons)) * k, spanLat = Math.max(...lats) - Math.min(...lats);
  spanLon = Math.max(spanLon, 4); spanLat = Math.max(spanLat, 3.2);
  const scale = Math.min((W * 0.74) / spanLon, (H * 0.74) / spanLat);
  const cx = (Math.min(...lons) + Math.max(...lons)) / 2, cy = lat0;
  const X = (lon: number) => W / 2 + (lon - cx) * k * scale;
  const Y = (lat: number) => H / 2 - (lat - cy) * scale;
  const xy = pts.map((p) => [X(p[2]), Y(p[1])] as const);
  const d = xy.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const near = ALL.filter(([, la, lo]) => { const x = X(lo), y = Y(la); return x > -20 && x < W + 20 && y > -20 && y < H + 20; });
  const label = pts.length <= 9 ? pts.map((_, i) => i) : pts.map((_, i) => i).filter((i) => i === 0 || i === pts.length - 1 || i % 2 === 0);
  // locator: all of India's places, with the current frame outlined
  const LW = 150, LH = 160, lk = Math.cos((22 * Math.PI) / 180), ls = Math.min((LW - 16) / (35 * lk), (LH - 16) / 31);
  const LX = (lon: number) => 8 + (lon - 68) * lk * ls, LY = (lat: number) => LH - 8 - (lat - 6) * ls;
  const fx0 = LX(cx - (W / 2) / (k * scale)), fx1 = LX(cx + (W / 2) / (k * scale)), fy0 = LY(cy + (H / 2) / scale), fy1 = LY(cy - (H / 2) / scale);
  return (
    <div className="rmap" data-route-map>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Карта маршрута: ${title}`}>
        <g className="rmap__bg">{near.map(([n, la, lo]) => <circle key={n} cx={X(lo)} cy={Y(la)} r="3.4" />)}</g>
        <path className="rmap__ghost" d={d} />
        <path className="rmap__route" d={d} data-route-line />
        {xy.map(([x, y], i) => (
          <g key={i} className="rmap__stop" data-stop={i} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
            <circle r="10" className="rmap__ring" />
            <circle r="5" className="rmap__dot" />
            {label.includes(i) && <text x="16" y="-14" className="rmap__label">{pts[i][0]}</text>}
          </g>
        ))}
      </svg>
      <svg className="rmap__loc" viewBox={`0 0 ${LW} ${LH}`} aria-hidden="true">
        {ALL.map(([n, la, lo]) => <circle key={n} cx={LX(lo)} cy={LY(la)} r="1.3" />)}
        <rect x={Math.max(1, fx0)} y={Math.max(1, fy0)} width={Math.max(6, Math.min(LW - 2, fx1) - Math.max(1, fx0))} height={Math.max(6, Math.min(LH - 2, fy1) - Math.max(1, fy0))} />
      </svg>
    </div>
  );
}
