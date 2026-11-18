/* Procedural flower art. Pure functions returning SVG markup strings.
   Most of it runs at BUILD time (Astro frontmatter), so guests download
   finished SVG instead of generating thousands of nodes on their phone. */

type Rand = () => number;

/* seeded random so the flowers look the same every visit */
export function rng(seed: number): Rand {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const f = (n: number) => +n.toFixed(1); // keep output small

/* ─────────── EMBROIDERED motifs (door panels) ─────────── */
const EMB = { petal: '#f8f1e2', petalEdge: '#c8b690', petalDeep: '#efe3c9', leaf: '#a3ad8a', leafDark: '#6f7d5c', lemon: '#ecd06a', lemonDeep: '#d4ab3c', stem: '#8a9672' };

export function leafE(x: number, y: number, len: number, ang: number, r: Rand) {
  const w = len * 0.32, hatch: string[] = [];
  for (let i = 1; i < 6; i++) {
    const t = i / 6, px = f(len * t), hw = f(w * 2 * t * (1 - t) * 0.8), px2 = f(len * t + len * 0.05);
    hatch.push(`M${px} 0L${px2} ${-hw}`, `M${px} 0L${px2} ${hw}`);
  }
  const col = r() < 0.5 ? EMB.leaf : '#b4bc9b';
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)})"><path d="M0 0Q${f(len * 0.5)} ${f(-w)} ${f(len)} 0Q${f(len * 0.5)} ${f(w)} 0 0Z" fill="${col}" stroke="${EMB.leafDark}" stroke-width=".7"/><path d="${hatch.join('')}" stroke="${EMB.leafDark}" stroke-width=".45" opacity=".55"/><path d="M0 0L${f(len * 0.95)} 0" stroke="${EMB.leafDark}" stroke-width=".7" stroke-dasharray="2 1.4"/></g>`;
}
export function roseE(x: number, y: number, s: number, rot: number) {
  let p = '';
  for (let i = 0; i < 6; i++) p += `<ellipse cy="${f(-s * 0.55)}" rx="${f(s * 0.48)}" ry="${f(s * 0.42)}" transform="rotate(${i * 60})" fill="${EMB.petal}" stroke="${EMB.petalEdge}" stroke-width=".7"/>`;
  for (let i = 0; i < 5; i++) p += `<ellipse cy="${f(-s * 0.32)}" rx="${f(s * 0.34)}" ry="${f(s * 0.3)}" transform="rotate(${i * 72 + 30})" fill="${EMB.petalDeep}" stroke="${EMB.petalEdge}" stroke-width=".6"/>`;
  p += `<circle r="${f(s * 0.28)}" fill="${EMB.petal}" stroke="${EMB.petalEdge}" stroke-width=".6"/><path d="M${f(-s * 0.16)} 0a${f(s * 0.16)} ${f(s * 0.16)} 0 1 1 ${f(s * 0.22)} ${f(s * 0.1)}a${f(s * 0.1)} ${f(s * 0.1)} 0 1 1 ${f(-s * 0.08)} ${f(-s * 0.14)}" fill="none" stroke="${EMB.petalEdge}" stroke-width=".7"/>`;
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)})">${p}</g>`;
}
export function blossomE(x: number, y: number, s: number, rot: number) {
  let p = '';
  for (let i = 0; i < 5; i++) p += `<g transform="rotate(${i * 72})"><path d="M0 0C${f(-s * 0.45)} ${f(-s * 0.4)} ${f(-s * 0.3)} ${f(-s)} 0 ${f(-s)}C${f(s * 0.3)} ${f(-s)} ${f(s * 0.45)} ${f(-s * 0.4)} 0 0Z" fill="${EMB.petal}" stroke="${EMB.petalEdge}" stroke-width=".6"/><path d="M0 ${f(-s * 0.25)}L0 ${f(-s * 0.75)}" stroke="${EMB.petalEdge}" stroke-width=".4" opacity=".7"/></g>`;
  p += `<circle r="${f(s * 0.2)}" fill="#e6c55a" stroke="#c39a35" stroke-width=".5"/>`;
  for (let i = 0; i < 6; i++) { const a = (i * 60 * Math.PI) / 180; p += `<circle cx="${f(Math.cos(a) * s * 0.3)}" cy="${f(Math.sin(a) * s * 0.3)}" r=".8" fill="#c39a35"/>`; }
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)})">${p}</g>`;
}
export function lemonE(x: number, y: number, s: number, rot: number) {
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)})"><path d="M${f(-s)} 0C${f(-s)} ${f(-s * 0.85)} ${f(s)} ${f(-s * 0.85)} ${f(s)} 0C${f(s)} ${f(s * 0.85)} ${f(-s)} ${f(s * 0.85)} ${f(-s)} 0Z" fill="${EMB.lemon}" stroke="${EMB.lemonDeep}" stroke-width=".7"/><path d="M${f(-s * 1.18)} 0L${f(-s)} 0M${f(s)} 0L${f(s * 1.15)} 0" stroke="${EMB.lemonDeep}" stroke-width="1.6" stroke-linecap="round"/><path d="M${f(-s * 0.5)} ${f(-s * 0.35)}Q0 ${f(-s * 0.55)} ${f(s * 0.45)} ${f(-s * 0.35)}" stroke="#fff6cf" stroke-width="1.6" fill="none" opacity=".8" stroke-linecap="round"/></g>`;
}
export function droopE(x: number, y: number, len: number, ang: number, r: Rand) {
  let p = `<path d="M0 0Q${f(len * 0.15)} ${f(len * 0.5)} 0 ${f(len)}" stroke="${EMB.stem}" stroke-width=".6" fill="none"/>`;
  const n = Math.round(len / 5);
  for (let i = 0; i < n; i++) {
    const t = i / n, cy = t * len, spread = (1 - t) * len * 0.18 + 2;
    for (let k = 0; k < 2; k++) {
      const cx = (r() - 0.5) * spread * 2, rr = (1 - t) * 2.6 + 1.2;
      p += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(rr)}" fill="${EMB.petal}" stroke="${EMB.petalEdge}" stroke-width=".5"/>`;
    }
  }
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)})">${p}</g>`;
}
export function sprayE(x: number, y: number, len: number, ang: number) {
  let p = `<path d="M0 0L${f(len)} 0" stroke="${EMB.stem}" stroke-width=".7"/>`;
  for (let i = 1; i < 7; i++) {
    const px = (len * i) / 7, l = len * 0.22 * (1 - i / 9);
    p += `<path d="M${f(px)} 0Q${f(px + l * 0.5)} ${f(-l * 0.6)} ${f(px + l)} ${f(-l * 0.8)}M${f(px)} 0Q${f(px + l * 0.5)} ${f(l * 0.6)} ${f(px + l)} ${f(l * 0.8)}" stroke="${EMB.leafDark}" stroke-width=".6" fill="none"/>`;
  }
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)})">${p}</g>`;
}

/* Embroidered border down the outer edge of one door. Runs ONCE in the
   browser (the doors depend on screen size) and is never rebuilt. */
export function doorArt(W: number, H: number, seed: number, mirror: boolean) {
  const r = rng(seed);
  let stems = '', leaves = '', flowers = '', fruit = '', droops = '';
  const edgeW = Math.min(W * 0.55, 150);
  let d = `M${f(edgeW * 0.25)} -10`;
  for (let y = 0; y <= H + 40; y += 60) d += `Q${f(edgeW * (0.15 + r() * 0.35))} ${y + 30} ${f(edgeW * (0.2 + r() * 0.2))} ${y + 60}`;
  stems += `<path d="${d}" stroke="${EMB.stem}" stroke-width="1" fill="none" stroke-dasharray="3 1.5"/>`;

  const nodes: [number, number][] = [];
  for (let y = 6; y < H; y += 30 + r() * 16) {
    const density = y < H * 0.3 || y > H * 0.7 ? 1 : 0.8;
    if (r() > density + 0.15) continue;
    nodes.push([edgeW * (0.12 + r() * 0.55) * (y < H * 0.22 || y > H * 0.78 ? 1.35 : 1), y]);
  }
  for (const [x, y] of nodes) {
    if (r() < 0.55) flowers += blossomE(x + (r() - 0.5) * 26, y + (r() - 0.5) * 22, 5 + r() * 3, r() * 72);
    for (let k = 0; k < 3; k++) leaves += leafE(x + (r() - 0.5) * 20, y + (r() - 0.5) * 20, 18 + r() * 16, r() * 360, r);
    if (r() < 0.25) leaves += sprayE(x, y, 30 + r() * 20, -30 + r() * 80);
    const pick = r();
    if (pick < 0.32) flowers += roseE(x, y, 12 + r() * 8, r() * 360);
    else if (pick < 0.75) {
      flowers += blossomE(x, y, 7 + r() * 5, r() * 72);
      if (r() < 0.6) flowers += blossomE(x + 10 + r() * 8, y + 8 + r() * 6, 5 + r() * 3, r() * 72);
    } else if (pick < 0.88) fruit += lemonE(x, y, 10 + r() * 4, -30 + r() * 60);
    else droops += droopE(x, y, 26 + r() * 22, -15 + r() * 30, r);
    if (r() < 0.22) droops += droopE(x + 8, y + 6, 22 + r() * 20, -10 + r() * 20, r);
  }
  for (const [cy, dir] of [[H * 0.05, 1], [H * 0.95, -1]] as const) {
    for (let i = 0; i < 6; i++) {
      const x = edgeW * 0.4 + (i * (W - edgeW * 0.4)) / 7, y = cy + dir * (r() * 30);
      leaves += leafE(x, y, 16 + r() * 12, r() * 360, r);
      if (i % 2 === 0) flowers += blossomE(x + 4, y + dir * 6, 6 + r() * 4, r() * 72);
      else if (r() < 0.5) droops += droopE(x, y, 18 + r() * 14, dir > 0 ? 0 : 180, r);
    }
  }
  return `<g${mirror ? ` transform="translate(${W} 0) scale(-1 1)"` : ''}>${stems}${leaves}${droops}${fruit}${flowers}</g>`;
}

/* ─────────── WATERCOLOUR wildflowers (inside page) ─────────── */
const WC = { daisy: '#fffdf8', daisyEdge: '#d9d2c4', centre: '#e6b743', lav: '#b49ccb', lavDeep: '#8f78ad', euc: '#a8b9a6', eucDark: '#7f957f', stem: '#93a184', breath: '#fffaf3' };

export function daisy(x: number, y: number, s: number, rot: number) {
  let p = '';
  for (let i = 0; i < 14; i++) p += `<ellipse cy="${f(-s * 0.6)}" rx="${f(s * 0.16)}" ry="${f(s * 0.5)}" transform="rotate(${f((i * 360) / 14)})" fill="${WC.daisy}" stroke="${WC.daisyEdge}" stroke-width=".5"/>`;
  p += `<circle r="${f(s * 0.24)}" fill="${WC.centre}" stroke="#c4922c" stroke-width=".6" stroke-dasharray="1 1"/>`;
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)})">${p}</g>`;
}
export function lavender(x: number, y: number, len: number, ang: number) {
  let p = `<path d="M0 0L${f(len)} 0" stroke="${WC.stem}" stroke-width=".9"/>`;
  for (let i = 0; i < 9; i++) {
    const px = f(len * (0.35 + i * 0.075)), s = f(3.4 - i * 0.2), ry = f(s * 0.6), px2 = f(px + 1.5);
    p += `<ellipse cx="${px}" cy="-2.2" rx="${s}" ry="${ry}" transform="rotate(-25 ${px} -2.2)" fill="${i % 2 ? WC.lav : WC.lavDeep}" opacity=".9"/><ellipse cx="${px2}" cy="2.2" rx="${s}" ry="${ry}" transform="rotate(25 ${px2} 2.2)" fill="${i % 2 ? WC.lavDeep : WC.lav}" opacity=".9"/>`;
  }
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)})">${p}</g>`;
}
export function euc(x: number, y: number, len: number, ang: number, r: Rand) {
  let p = `<path d="M0 0Q${f(len * 0.5)} ${f(len * 0.06)} ${f(len)} 0" stroke="${WC.eucDark}" stroke-width=".8" fill="none"/>`;
  for (let i = 1; i < 7; i++) {
    const px = (len * i) / 7, s = 7 - i * 0.6, side = i % 2 ? -1 : 1;
    p += `<circle cx="${f(px)}" cy="${f(side * s * 0.9)}" r="${f(s)}" fill="${r() < 0.5 ? WC.euc : '#b9c7b4'}" stroke="${WC.eucDark}" stroke-width=".4" opacity=".92"/>`;
  }
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)})">${p}</g>`;
}
export function breath(x: number, y: number, s: number, r: Rand) {
  let lines = '', dots = '';
  for (let i = 0; i < 9; i++) {
    const a = r() * Math.PI * 2, d = r() * s, cx = f(Math.cos(a) * d), cy = f(Math.sin(a) * d);
    lines += `M0 0L${cx} ${cy}`;
    dots += `<circle cx="${cx}" cy="${cy}" r="${f(1.4 + r() * 1.4)}" fill="${WC.breath}" stroke="#ddd5c6" stroke-width=".4"/>`;
  }
  return `<g transform="translate(${f(x)} ${f(y)})"><path d="${lines}" stroke="${WC.stem}" stroke-width=".4"/>${dots}</g>`;
}
function wildLeaf(x: number, y: number, len: number, ang: number, r: Rand) {
  const w = len * 0.3;
  return `<path d="M0 0Q${f(len * 0.5)} ${f(-w)} ${f(len)} 0Q${f(len * 0.5)} ${f(w)} 0 0Z" transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)})" fill="${r() < 0.5 ? '#9fb08f' : '#b8c4a6'}" opacity=".88"/>`;
}
export function wildCluster(x: number, y: number, r: Rand, scale = 1) {
  let o = '';
  for (let i = 0; i < 4; i++) o += euc(x, y, (40 + r() * 30) * scale, r() * 360, r);
  for (let i = 0; i < 4; i++) o += wildLeaf(x + (r() - 0.5) * 30 * scale, y + (r() - 0.5) * 30 * scale, (18 + r() * 14) * scale, r() * 360, r);
  for (let i = 0; i < 2; i++) o += lavender(x, y, (40 + r() * 24) * scale, r() * 360);
  o += breath(x + (r() - 0.5) * 24, y + (r() - 0.5) * 24, 18 * scale, r);
  o += daisy(x + (r() - 0.5) * 18 * scale, y + (r() - 0.5) * 18 * scale, (12 + r() * 7) * scale, r() * 30);
  if (r() < 0.6) o += daisy(x + (r() - 0.5) * 36 * scale, y + (r() - 0.5) * 36 * scale, (8 + r() * 5) * scale, r() * 30);
  return o;
}

/* Fixed-size canvases: rendered once at build, scaled by CSS. */
export const HERO = { W: 440, H: 900 };
export function heroFrame(seed = 5) {
  const { W, H } = HERO, r = rng(seed);
  let o = '';
  for (const side of [0, 1]) {
    for (let y = -10; y < H + 20; y += 52) {
      const x = side ? W - (30 + r() * 26) : 30 + r() * 26;
      o += wildCluster(x, y, r, y < H * 0.25 || y > H * 0.75 ? 1.05 : 0.75);
    }
  }
  for (let i = 0; i < 6; i++) { o += wildCluster(50 + i * 28, 10 + r() * 22, r, 0.7); o += wildCluster(W - 50 - i * 28, 10 + r() * 22, r, 0.7); }
  return o;
}
export function sprig(seed: number) {
  const r = rng(seed);
  return wildCluster(95, 30, r, 0.85) + wildCluster(105, 90, r, 0.65) + lavender(110, 60, 55, 200) + euc(110, 120, 50, 210, r);
}
export const MEADOW = { W: 440, H: 260 };
export function meadow(seed = 404) {
  const { W, H } = MEADOW, r = rng(seed);
  let o = '';
  for (let x = -10; x < W + 20; x += 26) { o += wildCluster(x, H - 20 - r() * 90, r, 0.75); o += lavender(x, H, 60 + r() * 70, -80 - r() * 20); o += euc(x + 10, H, 50 + r() * 50, -70 - r() * 40, r); }
  for (let x = 0; x < W; x += 34) o += wildCluster(x + r() * 14, H - r() * 20, r, 0.9);
  return o;
}

/* ─────────── section illustrations (170×150) ─────────── */
export function illustrations() {
  const R = rng(77);
  return {
    hourglass: `${wildCluster(48, 118, R, 0.7)}${wildCluster(124, 120, R, 0.6)}<rect x="58" y="14" width="54" height="7" rx="2" fill="#cfae6a"/><rect x="58" y="122" width="54" height="7" rx="2" fill="#cfae6a"/><path d="M62 21L62 26C62 52 82 62 85 71C82 80 62 90 62 116L62 122M108 21L108 26C108 52 88 62 85 71C88 80 108 90 108 116L108 122" stroke="#b8935a" stroke-width="2.2" fill="none"/><path d="M66 26C66 50 84 60 85 71C86 60 104 50 104 26Z" fill="#fbf5ea" stroke="#d8c9ad" stroke-width=".8"/><path d="M85 71C84 84 66 92 66 116L104 116C104 92 86 84 85 71Z" fill="#fbf5ea" stroke="#d8c9ad" stroke-width=".8"/><path d="M72 40L98 40C94 52 87 60 85 68C83 60 76 52 72 40Z" fill="#e8cf9b"/><path d="M68 116C72 100 80 96 85 92C90 96 98 100 102 116Z" fill="#e8cf9b"/><circle cx="118" cy="122" r="9" fill="none" stroke="#d1ad5c" stroke-width="3"/><circle cx="130" cy="125" r="8" fill="none" stroke="#e1c27a" stroke-width="2.6"/>${daisy(56, 124, 10, 0)}`,
    arbour: `<path d="M40 140L40 62C40 22 130 22 130 62L130 140" stroke="#c9b48e" stroke-width="5" fill="none"/><path d="M48 140L48 64C48 32 122 32 122 64L122 140" stroke="#e1d3b8" stroke-width="2" fill="none"/><rect x="62" y="104" width="46" height="36" fill="#f3e9da" opacity=".9"/><path d="M62 104L108 104" stroke="#d9c9ad"/>${wildCluster(44, 40, R, 0.75)}${wildCluster(126, 44, R, 0.75)}${wildCluster(85, 26, R, 0.7)}${wildCluster(40, 98, R, 0.6)}${wildCluster(132, 104, R, 0.6)}${wildCluster(42, 138, R, 0.55)}${wildCluster(128, 138, R, 0.55)}`,
    cake: `${wildCluster(40, 124, R, 0.6)}${wildCluster(132, 126, R, 0.55)}<rect x="52" y="96" width="66" height="34" rx="4" fill="#fbf6ee" stroke="#ddd0b8"/><rect x="60" y="68" width="50" height="30" rx="4" fill="#fdf9f3" stroke="#ddd0b8"/><rect x="68" y="44" width="34" height="26" rx="4" fill="#fbf6ee" stroke="#ddd0b8"/><path d="M52 104Q60 110 68 104Q76 110 85 104Q94 110 102 104Q110 110 118 104M60 76Q68 82 76 76Q85 82 94 76Q102 82 110 76" stroke="#e5d7bd" fill="none"/>${blossomE(85, 42, 7, 10)}${blossomE(76, 46, 5, 40)}${leafE(92, 44, 12, -20, R)}${leafE(70, 48, 10, 200, R)}${daisy(104, 74, 6, 0)}${daisy(64, 100, 6, 0)}<path d="M28 70L36 70L34 92L30 92Z" fill="#f3e2b5" opacity=".75" stroke="#cfb57d" stroke-width=".7"/><path d="M32 92L32 112M27 112L37 112" stroke="#cfb57d"/><path d="M136 66L144 66L142 88L138 88Z" fill="#f3e2b5" opacity=".75" stroke="#cfb57d" stroke-width=".7"/><path d="M140 88L140 108M135 108L145 108" stroke="#cfb57d"/>`,
    outfits: `<path d="M60 22Q60 14 66 14Q72 14 72 20L60 30L84 30" stroke="#b9a88a" stroke-width="1.4" fill="none"/><path d="M54 32L78 32L80 52C96 82 104 112 108 138L26 138C30 112 40 82 54 52Z" fill="#c9a6c9" fill-opacity=".75" stroke="#a582a6" stroke-width=".8"/><path d="M54 52L80 52" stroke="#a582a6" stroke-width="2.4"/><path d="M64 56C58 90 48 112 44 138M70 56C72 92 78 116 86 138" stroke="#b392b4" stroke-width=".8" fill="none"/><path d="M112 18Q112 10 118 10Q124 10 124 16L112 26L138 26" stroke="#b9a88a" stroke-width="1.4" fill="none"/><path d="M100 28L150 28L156 120L94 120Z" fill="#a9b68d"/><path d="M125 28L116 60L125 74L134 60Z" fill="#f8f1e6"/><path d="M110 28L125 74M140 28L125 74" stroke="#7d8c62" stroke-width="1.4" fill="none"/><circle cx="125" cy="86" r="1.8" fill="#6c7a52"/><circle cx="125" cy="100" r="1.8" fill="#6c7a52"/>${daisy(142, 46, 6, 0)}`,
    suitcase: `<path d="M68 46L68 36Q68 30 74 30L96 30Q102 30 102 36L102 46" stroke="#a57a4e" stroke-width="4" fill="none"/><rect x="38" y="46" width="94" height="78" rx="10" fill="#d9b48a" stroke="#a57a4e" stroke-width="1.2"/><path d="M60 46L60 124M110 46L110 124" stroke="#a57a4e" stroke-width="3"/><path d="M42 60L128 60" stroke="#c49a6c" stroke-width=".8"/><circle cx="85" cy="88" r="10" fill="#f6ead6" stroke="#c9a676"/><path d="M80 88L90 88M85 83L85 93" stroke="#b08a5a"/>${wildCluster(42, 118, R, 0.6)}${wildCluster(128, 52, R, 0.5)}${lavender(30, 40, 46, 40)}${euc(140, 130, 40, 200, R)}`,
    giftbox: `${wildCluster(36, 120, R, 0.6)}${wildCluster(136, 118, R, 0.55)}<rect x="44" y="68" width="82" height="62" rx="4" fill="#f6ecdd" stroke="#d6c4a2"/><rect x="38" y="54" width="94" height="18" rx="3" fill="#fbf4e8" stroke="#d6c4a2"/><rect x="80" y="54" width="10" height="76" fill="#9fb08f"/><path d="M85 54C70 30 50 38 60 50C66 56 80 54 85 54C90 54 104 56 110 50C120 38 100 30 85 54Z" fill="#a9b998" stroke="#7f957f" stroke-width=".8"/><path d="M85 54L74 72M85 54L96 72" stroke="#8fa27f" stroke-width="3" stroke-linecap="round"/><rect x="96" y="84" width="24" height="16" rx="2" fill="#fffaf2" stroke="#d6c4a2" transform="rotate(-8 108 92)"/>`,
    book: `<path d="M85 50C70 40 44 40 28 46L28 124C44 118 70 118 85 128Z" fill="#fbf6ec" stroke="#d6c4a2"/><path d="M85 50C100 40 126 40 142 46L142 124C126 118 100 118 85 128Z" fill="#fdf9f2" stroke="#d6c4a2"/><path d="M85 50L85 128" stroke="#cdb994"/><path d="M38 62Q58 56 76 62M38 74Q58 68 76 74M38 86Q58 80 76 86M38 98Q58 92 76 98M94 62Q112 56 132 62M94 74Q112 68 132 74" stroke="#e2d6c0" fill="none"/>${lavender(100, 118, 70, -70)}${lavender(108, 116, 60, -62)}${euc(96, 120, 50, -80, R)}${daisy(118, 92, 8, 0)}${breath(126, 80, 14, R)}`,
    letter: `<rect x="34" y="50" width="102" height="70" rx="4" fill="#fbf5ea" stroke="#d6c4a2"/><path d="M34 52L85 92L136 52" stroke="#d6c4a2" fill="#f6ecdc"/><circle cx="85" cy="90" r="10" fill="#b9332f" opacity=".85"/><path d="M80 90Q85 84 90 90Q85 96 80 90" stroke="#e7a7a0" fill="none"/><path d="M120 20L140 76" stroke="#7a6a58" stroke-width="2.2" stroke-linecap="round"/><path d="M118 14C124 18 132 22 136 30C128 30 122 24 118 14Z" fill="#c8b6d8" stroke="#a48fb8" stroke-width=".7"/>${wildCluster(40, 124, R, 0.55)}${lavender(26, 46, 40, -40)}`,
    wreath: (() => { let o = ''; const r = rng(91); for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2; o += wildCluster(85 + Math.cos(a) * 48, 75 + Math.sin(a) * 48, r, 0.4); } return o; })(),
  };
}

/* stylised map (decorative — the button opens the real one) */
export const mapArt = `<rect width="360" height="200" fill="#efe9de"/><path d="M0 150C80 130 120 170 200 150C260 135 300 160 360 140L360 200L0 200Z" fill="#cfe0e3"/><path d="M0 60L360 90M60 0L110 200M200 0L180 200M290 0L330 200M0 120L360 110" stroke="#fffaf2" stroke-width="7"/><path d="M0 60L360 90M60 0L110 200M200 0L180 200M290 0L330 200M0 120L360 110" stroke="#e3d9c8"/><rect x="120" y="20" width="60" height="40" rx="4" fill="#dfe6d2"/><rect x="220" y="96" width="50" height="30" rx="4" fill="#dfe6d2"/><g transform="translate(190 92)"><ellipse cy="22" rx="10" ry="3" fill="rgba(0,0,0,.15)"/><path d="M0 22C-14 4 -14 -14 0 -14C14 -14 14 4 0 22Z" fill="#d23a33"/><circle cy="-3" r="5" fill="#fff"/></g>`;
