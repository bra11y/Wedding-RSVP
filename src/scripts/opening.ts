/* The gatefold opening.
   Motion's `mini` build drives everything through the browser's Web
   Animations API, so the doors, light, fog and hero reveal all run on
   the GPU compositor (transform + opacity only) and stay smooth even
   while the page is still loading. */
import { animate } from 'motion/mini';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;
const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector<T>(s)!;

const gate = $('#gate');
const gateBtn = $<HTMLButtonElement>('#gateBtn');
const skip = $<HTMLAnchorElement>('#skip');
const fog = $('#fog');
const bloom = $('#bloom');
const music = $('#music');
const heading = $('#couple');
const behind = [$('#main'), $('footer'), music];

/* While the doors are closed the page behind them is not reachable */
behind.forEach((el) => el.setAttribute('inert', ''));

/* timings in seconds after the tap: theatrical but short, and the
   page can be scrolled long before the last line settles */
const T = { glow: 0.5, part: 1.0, slide: 2.2, fog: 1.2, unlock: 1.8, frame: 1.5, std: 1.9, n1: 2.2, amp: 2.5, n2: 2.7, kick: 3.1, date: 3.3, pill: 3.5 };
type StepKey = keyof typeof T;
const DOOR: [number, number, number, number] = [0.65, 0, 0.25, 1];
const OUT: [number, number, number, number] = [0.2, 0.7, 0.2, 1];
const wait = (s: number) => new Promise((r) => setTimeout(r, s * 1000));
const rand = (a: number, b: number) => a + Math.random() * (b - a);

/* ── fog: ~14 soft layers that drift outward, plus a few gold sparks ── */
function buildFog() {
  const base = document.createElement('div');
  base.className = 'base';
  fog.append(base);
  const vmax = Math.max(innerWidth, innerHeight);
  const puffs: HTMLElement[] = [];
  for (let i = 0; i < 14; i++) {
    const p = document.createElement('div');
    p.className = 'puff';
    const a = (i / 14) * Math.PI * 2 + rand(-0.3, 0.3), d = rand(0.05, 0.35) * vmax;
    p.style.setProperty('--s', `${rand(45, 80)}vmax`);
    p.style.transform = `translate(${Math.cos(a) * d}px, ${Math.sin(a) * d}px)`;
    p.dataset.a = String(a);
    fog.append(p);
    puffs.push(p);
  }
  return { base, puffs, vmax };
}
let fogParts: ReturnType<typeof buildFog> | null = reduce ? null : buildFog();

function clearFog() {
  if (!fogParts) return;
  const { base, puffs, vmax } = fogParts;
  animate(base, { opacity: [1, 0] }, { duration: 2.2, ease: 'ease-out' });
  puffs.forEach((p, i) => {
    const a = +p.dataset.a!, from = p.style.transform, d = vmax * rand(0.9, 1.3);
    animate(p, { transform: [from, `translate(${Math.cos(a) * d}px, ${Math.sin(a) * d}px) scale(1.4)`], opacity: [1, 0] },
      { duration: rand(2.6, 3.4), delay: 0.1 + (i % 5) * 0.08, ease: OUT });
  });
  for (let i = 0; i < 22; i++) {
    const s = document.createElement('div');
    s.className = 'spark';
    s.style.left = `${rand(15, 85)}%`;
    s.style.top = `${rand(25, 70)}%`;
    s.style.transform = `scale(${rand(0.5, 1.2)})`;
    fog.append(s);
    animate(s, { opacity: [0, 1, 0], transform: [s.style.transform, `translateY(${-rand(40, 110)}px) ${s.style.transform}`] },
      { duration: rand(2, 3.2), delay: rand(0.3, 2.4), ease: 'ease-out' });
  }
  setTimeout(() => { fog.remove(); fogParts = null; }, 6500);
}

/* ── hero lines resolve in order ── */
function revealHero(instant: boolean) {
  document.querySelectorAll<HTMLElement>('.hero .step').forEach((el) => {
    const done = () => { el.style.opacity = '1'; };
    if (instant) return done();
    const at = T[el.dataset.at as StepKey] ?? 0;
    const frame = el.classList.contains('wild');
    animate(el, { opacity: [0, 1], transform: [frame ? 'scale(1.06)' : 'translateY(14px)', 'none'] },
      { duration: frame ? 2.4 : 1.2, delay: at, ease: OUT }).then(done);
    if (el.classList.contains('nm'))
      animate(el, { letterSpacing: ['0.3em', '0em'] }, { duration: 1.8, delay: at, ease: OUT });
  });
}

function unlock(moveFocus: boolean) {
  root.classList.remove('locked');
  behind.forEach((el) => el.removeAttribute('inert'));
  music.classList.add('show');
  if (moveFocus) heading.focus({ preventScroll: true });
}

let opened = false;
async function openGate({ instant = false, viaKeyboard = false } = {}) {
  if (opened) return;
  opened = true;
  const keyboard = viaKeyboard || document.activeElement === gateBtn;

  if (instant || reduce) {
    gate.classList.add('gone');
    fog.remove();
    bloom.remove();
    revealHero(true);
    unlock(true);
    return;
  }

  gate.classList.add('untie');
  revealHero(false);
  setTimeout(() => unlock(keyboard), T.unlock * 1000);

  await wait(T.glow);
  gate.classList.add('glow');
  await wait(T.part - T.glow);
  gate.classList.add('part');
  const doorOpts = { duration: T.slide, ease: DOOR };
  animate('.door.left', { transform: ['translateX(0)', 'translateX(-101%)'] }, doorOpts);
  animate('.door.right', { transform: ['translateX(0)', 'translateX(101%)'] }, doorOpts);
  animate('.light', { opacity: [0.9, 1, 0], transform: ['scaleX(1)', 'scaleX(380)'] }, { ...doorOpts, times: [0, 0.35, 1] } as never);
  animate(bloom, { opacity: [0, 1, 0], transform: ['scale(.15)', 'scale(.6)', 'scale(1.6)'] }, { duration: 3, ease: OUT, times: [0, 0.3, 1] } as never);
  setTimeout(clearFog, (T.fog - T.part) * 1000);
  await wait(T.slide);
  gate.classList.add('gone');
}

gateBtn.addEventListener('click', (e) => openGate({ viaKeyboard: (e as PointerEvent).pointerType === '' }));
skip.addEventListener('click', (e) => { e.preventDefault(); openGate({ instant: true }); });
addEventListener('keydown', (e) => { if (e.key === 'Escape' && !opened) openGate({ instant: true }); });
/* deep links (e.g. someone shares …/#rsvp) skip the ceremony */
const target = location.hash.length > 1 && location.hash !== '#top' ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
if (target) { openGate({ instant: true }); target.scrollIntoView(); }
