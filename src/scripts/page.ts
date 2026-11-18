/* Countdown, copy buttons, scroll reveal and the optional music box. */

/* ── countdown ── */
const count = document.getElementById('count')!;
const start = new Date(count.dataset.start!).getTime();
const units = Object.fromEntries([...count.querySelectorAll<HTMLElement>('[data-unit]')].map((el) => [el.dataset.unit!, el]));
const pad = (n: number) => String(n).padStart(2, '0');
function tick() {
  const d = Math.max(0, start - Date.now());
  units.d.textContent = String(Math.floor(d / 864e5));
  units.h.textContent = pad(Math.floor(d / 36e5) % 24);
  units.m.textContent = pad(Math.floor(d / 6e4) % 60);
  units.s.textContent = pad(Math.floor(d / 1e3) % 60);
}
tick();
setInterval(tick, 1000);

/* ── toast (a polite live region, so screen readers hear it too) ── */
const toast = document.getElementById('toast')!;
let toastTimer: number | undefined;
export function showToast(text: string) {
  toast.textContent = text;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2200);
}

document.querySelectorAll<HTMLButtonElement>('.copy').forEach((b) =>
  b.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(b.dataset.copy!);
      showToast(`${b.dataset.label} copied`);
    } catch {
      showToast(`${b.dataset.label}: ${b.dataset.copy}`);
    }
  }),
);

/* ── sections fade up as they scroll into view ── */
const io = new IntersectionObserver(
  (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
  { threshold: 0.12, rootMargin: '0px 0px -5% 0px' },
);
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

/* ── MUSIC: a soft music-box melody made in the browser.
   Off by default. It only plays when the guest presses the button. ── */
const btn = document.getElementById('music') as HTMLButtonElement;
let ctx: AudioContext | undefined, master: GainNode, timer: number | undefined, next = 0, step = 0, on = false;
const mf = (m: number) => 440 * Math.pow(2, (m - 69) / 12);
const chords = [[50, 57, 62, 66, 69, 74], [47, 54, 59, 62, 66, 71], [43, 50, 55, 59, 62, 67], [45, 52, 57, 61, 64, 69]];
const pattern = [0, 2, 3, 4, 3, 2];
const melody = [[78, 0, 76, 74, 0, 76], [74, 0, 73, 71, 0, 0], [71, 0, 73, 74, 0, 76], [73, 0, 0, 69, 0, 0]];
const beat = 0.42;

function init() {
  ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  master = ctx.createGain();
  master.gain.value = 0;
  const len = ctx.sampleRate * 3.5, buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) { const d = buf.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
  const conv = ctx.createConvolver(); conv.buffer = buf;
  const wet = ctx.createGain(); wet.gain.value = 0.5;
  master.connect(ctx.destination); master.connect(conv); conv.connect(wet); wet.connect(ctx.destination);
}
function note(m: number, t: number, dur: number, vol: number) {
  const c = ctx!, o = c.createOscillator(), o2 = c.createOscillator(), g = c.createGain(), g2 = c.createGain();
  o.frequency.value = mf(m); o2.frequency.value = mf(m) * 3.01; g2.gain.value = 0.06;
  o.connect(g); o2.connect(g2); g2.connect(g); g.connect(master);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.start(t); o2.start(t); o.stop(t + dur + 0.05); o2.stop(t + dur + 0.05);
}
function schedule() {
  while (next < ctx!.currentTime + 0.6) {
    const bar = Math.floor(step / 6) % 4, i = step % 6, ch = chords[bar];
    if (i === 0) note(ch[0] - 12, next, beat * 6, 0.16);
    note(ch[pattern[i]], next, beat * 3, 0.07);
    if (melody[bar][i]) note(melody[bar][i], next, beat * 4, 0.11);
    next += beat; step++;
  }
}
function fade(to: number, secs: number) {
  const t = ctx!.currentTime;
  master.gain.cancelScheduledValues(t);
  master.gain.setValueAtTime(master.gain.value, t);
  master.gain.linearRampToValueAtTime(to, t + secs);
}
btn.addEventListener('click', () => {
  try {
    if (!on) {
      if (!ctx) init();
      ctx!.resume();
      if (!timer) { next = ctx!.currentTime + 0.1; timer = window.setInterval(schedule, 120); }
      fade(0.55, 3);
    } else fade(0, 1);
    on = !on;
    btn.setAttribute('aria-pressed', String(on));
  } catch { /* audio not available: leave the button off */ }
});
