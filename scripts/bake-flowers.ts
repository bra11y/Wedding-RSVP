/* Bakes the procedural flower art into compressed WebP images.
   Runs before every build (npm run build → prebuild).

   Why: the original page drew thousands of live SVG shapes on every
   phone, re-drew them on resize, and added drop-shadow filters on top.
   A baked image is decoded once and composited by the GPU, so scrolling
   and the door animation stay smooth.  Shadows are baked in for free. */

import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { HERO, MEADOW, doorArt, heroFrame, illustrations, meadow, sprig } from '../src/lib/flora.ts';

const OUT = new URL('../public/flora/', import.meta.url);
const SCALE = 2; // retina sharpness

/* soft shadow under the art, the same look the old CSS drop-shadow gave */
const shadow = (id: string, dy: number, blur: number, op: number) =>
  `<filter id="${id}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur in="SourceAlpha" stdDeviation="${blur}"/><feOffset dy="${dy}"/><feComponentTransfer><feFuncA type="linear" slope="${op}"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;

/* watercolour: wobble the edges with noise, let a soft blurred copy bleed
   underneath, then lay a soft shadow. Free at runtime: it's baked in. */
const watercolour = (id: string, seed: number) =>
  `<filter id="${id}" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="${seed}" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" result="wob"/><feGaussianBlur in="wob" stdDeviation="1.6" result="bleed"/><feComponentTransfer in="bleed" result="bleed2"><feFuncA type="linear" slope=".45"/></feComponentTransfer><feGaussianBlur in="wob" stdDeviation=".3" result="soft"/><feGaussianBlur in="SourceAlpha" stdDeviation="1.4" result="sh"/><feOffset in="sh" dy="1.4" result="sh2"/><feComponentTransfer in="sh2" result="sh3"><feFuncA type="linear" slope=".2"/></feComponentTransfer><feMerge><feMergeNode in="sh3"/><feMergeNode in="bleed2"/><feMergeNode in="soft"/></feMerge></filter>`;

function svg(W: number, H: number, body: string, filter = watercolour('s', 7)) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W * SCALE}" height="${H * SCALE}" viewBox="0 0 ${W} ${H}"><defs>${filter}</defs><g filter="url(#s)">${body}</g></svg>`;
}

async function bake(name: string, W: number, H: number, body: string, quality = 76, filter?: string, scale = SCALE) {
  const buf = await sharp(Buffer.from(svg(W, H, body, filter)), { density: 72 * SCALE })
    .resize(Math.round(W * scale))
    .webp({ quality, alphaQuality: 80, effort: 6, smartSubsample: true })
    .toBuffer();
  await writeFile(new URL(`${name}.webp`, OUT), buf);
  return [name, Math.round(buf.length / 1024)] as const;
}

await mkdir(OUT, { recursive: true });

// Door panels: a tall strip anchored to each door's outer edge (CSS shows
// it at full door height, so wide screens just see more plain paper).
const DOOR = { W: 520, H: 1000 };
const embroidery = shadow('s', 1.2, 0.7, 0.35);

const ill = illustrations();
const jobs = [
  bake('hero', HERO.W, HERO.H, heroFrame(5), 70, undefined, 1.6),
  bake('meadow', MEADOW.W, MEADOW.H, meadow(404), 70, undefined, 1.6),
  bake('door-left', DOOR.W, DOOR.H, doorArt(DOOR.W, DOOR.H, 11, false), 72, embroidery, 1.6),
  bake('door-right', DOOR.W, DOOR.H, doorArt(DOOR.W, DOOR.H, 29, true), 72, embroidery, 1.6),
  ...[1, 2, 3, 4, 5, 6, 7, 8].map((n) => bake(`sprig-${n}`, 120, 150, sprig(n * 13))),
  ...Object.entries(ill).map(([k, body]) => bake(`illus-${k}`, 170, 150, body, 80)),
];

const done = await Promise.all(jobs);
const total = done.reduce((a, [, kb]) => a + kb, 0);
console.log(`🌼 baked ${done.length} flower images, ${total} KB total`);
for (const [n, kb] of done) console.log(`   ${n.padEnd(16)} ${kb} KB`);

/* ── link-preview card (WhatsApp, iMessage, Instagram, etc.) 1200×630 ── */
import { wildCluster, rng } from '../src/lib/flora.ts';
import { wedding } from '../src/config/wedding.ts';
{
  const r = rng(2027);
  let flowers = '';
  for (let y = -20; y < 680; y += 60) { flowers += wildCluster(40 + r() * 40, y, r, 1.1); flowers += wildCluster(1160 - r() * 40, y, r, 1.1); }
  for (let x = 140; x < 1080; x += 70) { flowers += wildCluster(x, 10 + r() * 20, r, 0.75); flowers += wildCluster(x, 620 - r() * 20, r, 0.75); }
  const [a, b] = wedding.partners;
  const esc = (s: string) => s.replace(/&/g, '&amp;');
  const card = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs>${watercolour('s', 3)}<radialGradient id="bg" cx=".5" cy=".4" r=".7"><stop offset="0" stop-color="#fffaf4"/><stop offset="1" stop-color="#f3e2db"/></radialGradient></defs>
  <rect width="1200" height="630" fill="url(#bg)"/><g filter="url(#s)">${flowers}</g>
  <g font-family="Cormorant Garamond, Georgia, 'Times New Roman', serif" text-anchor="middle" fill="#3f3833">
    <text x="600" y="190" font-family="Jost, Helvetica, Arial, sans-serif" font-size="24" letter-spacing="8" fill="#655a52">SAVE THE DATE</text>
    <text x="600" y="300" font-size="96" font-weight="300">${esc(a)}</text>
    <text x="600" y="368" font-size="56" font-style="italic" fill="#8f6f35">&amp;</text>
    <text x="600" y="462" font-size="96" font-weight="300">${esc(b)}</text>
    <text x="600" y="530" font-family="Jost, Helvetica, Arial, sans-serif" font-size="24" letter-spacing="6" fill="#655a52">${esc(wedding.dateLabel.toUpperCase())}</text>
  </g></svg>`;
  await sharp(Buffer.from(card)).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(new URL('../og.png', OUT).pathname);
  console.log('   og.png           share card');
}
