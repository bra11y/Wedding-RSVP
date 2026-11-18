/* RSVP form: conditional questions, accessible validation, and sending.
   The questions themselves live in src/config/rsvp-fields.ts.

   Where answers go: set PUBLIC_RSVP_ENDPOINT (see .env.example).
   Any service that accepts a JSON POST works: Formspree, Getform,
   a Google Apps Script web app, a Supabase edge function… */
import type { ShowIf } from '../config/rsvp-fields';

const ENDPOINT = import.meta.env.PUBLIC_RSVP_ENDPOINT as string | undefined;

const form = document.getElementById('rsvpForm') as HTMLFormElement;
const status = document.getElementById('formStatus')!;
const submitBtn = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
const submitLabel = submitBtn.querySelector('.label')!;
const thanks = document.getElementById('thanks')!;
const thanksTitle = document.getElementById('thanksTitle')!;
const thanksBody = document.getElementById('thanksBody')!;
const wrappers = [...form.querySelectorAll<HTMLElement>('.f')];

const controls = (w: HTMLElement) => [...w.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea')];
const valueOf = (name: string): string | string[] => {
  const w = form.querySelector<HTMLElement>(`.f[data-field="${name}"]`);
  if (!w || w.hidden) return '';
  const els = controls(w);
  const type = w.dataset.type;
  if (type === 'checkbox') return els.filter((e) => (e as HTMLInputElement).checked).map((e) => e.value);
  if (type === 'radio') return els.find((e) => (e as HTMLInputElement).checked)?.value ?? '';
  return els[0].value.trim();
};

/* ── show / hide follow-up questions ── */
function matches(rule: ShowIf) {
  const v = valueOf(rule.field);
  const val = Array.isArray(v) ? v : [v];
  if (rule.equals !== undefined) {
    const want = Array.isArray(rule.equals) ? rule.equals : [rule.equals];
    if (!val.some((x) => want.includes(x))) return false;
  }
  if (rule.min !== undefined && !(Number(val[0]) >= rule.min)) return false;
  return true;
}
function applyConditions() {
  // loop until stable so chains (attending → guests → guestNames) resolve
  for (let pass = 0; pass < 4; pass++) {
    let changed = false;
    for (const w of wrappers) {
      if (!w.dataset.showIf) continue;
      const show = matches(JSON.parse(w.dataset.showIf));
      if (w.hidden === show) {
        w.hidden = !show;
        controls(w).forEach((c) => (c.disabled = !show));
        if (!show) setError(w, '');
        changed = true;
      }
    }
    if (!changed) break;
  }
}
wrappers.filter((w) => w.dataset.showIf).forEach((w) => controls(w).forEach((c) => (c.disabled = true)));
form.addEventListener('change', applyConditions);
applyConditions();

/* ── validation ── */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+()\-\s\d]{7,20}$/;

function setError(w: HTMLElement, msg: string) {
  const err = w.querySelector<HTMLElement>('.err')!;
  err.textContent = msg;
  controls(w).forEach((c) => (msg ? c.setAttribute('aria-invalid', 'true') : c.removeAttribute('aria-invalid')));
}
function check(w: HTMLElement): string {
  if (w.hidden) return '';
  const v = valueOf(w.dataset.field!);
  const empty = Array.isArray(v) ? v.length === 0 : v === '';
  if (empty) return w.dataset.required ?? '';
  const s = String(v);
  if (w.dataset.type === 'email' && !EMAIL.test(s)) return 'Enter an email address in the format name@example.com.';
  if (w.dataset.type === 'tel' && !PHONE.test(s)) return 'Enter a phone number using digits, spaces, + or - only.';
  return '';
}
let tried = false;
form.addEventListener('input', (e) => {
  if (!tried) return;
  const w = (e.target as HTMLElement).closest<HTMLElement>('.f');
  if (w && !check(w)) setError(w, ''); // clear as soon as it's fixed; never nag while typing
});
form.addEventListener('change', (e) => {
  if (!tried) return;
  const w = (e.target as HTMLElement).closest<HTMLElement>('.f');
  if (w) setError(w, check(w));
});

/* ── send ── */
function busy(on: boolean) {
  submitBtn.setAttribute('aria-disabled', String(on));
  submitLabel.textContent = on ? 'Sending…' : 'Send response';
}
let sending = false;

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (sending) return;
  tried = true;
  applyConditions();

  const bad = wrappers.map((w) => [w, check(w)] as const).filter(([, m]) => m);
  wrappers.forEach((w) => setError(w, ''));
  bad.forEach(([w, m]) => setError(w, m));
  if (bad.length) {
    status.className = 'form-status bad';
    status.textContent = bad.length === 1 ? 'There is 1 problem with your reply.' : `There are ${bad.length} problems with your reply.`;
    controls(bad[0][0])[0].focus();
    return;
  }
  if ((form.elements.namedItem('company') as HTMLInputElement).value) return; // bot

  const answers: Record<string, string | string[]> = {};
  for (const w of wrappers) if (!w.hidden) answers[w.dataset.field!] = valueOf(w.dataset.field!);
  const payload = { ...answers, submittedAt: new Date().toISOString(), _subject: `RSVP: ${answers.fullName} (${answers.attending})` };

  sending = true;
  busy(true);
  status.className = 'form-status';
  status.textContent = 'Sending your reply…';
  try {
    if (!ENDPOINT) {
      if (import.meta.env.DEV) {
        console.info('[RSVP] No PUBLIC_RSVP_ENDPOINT set. This is what would be sent:', payload);
        await new Promise((r) => setTimeout(r, 500));
      } else throw new Error('RSVP endpoint not configured');
    } else {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    }
    const first = String(answers.fullName).split(/\s+/)[0] || 'friend';
    const yes = answers.attending === 'yes';
    thanksTitle.textContent = yes ? `Thank you, ${first}. We can't wait to see you!` : `Thank you, ${first}. You'll be missed.`;
    thanksBody.textContent = 'Your reply has been sent. If anything changes, you can send a new one.';
    status.textContent = '';
    form.hidden = true;
    thanks.hidden = false;
    thanksTitle.focus();
  } catch (err) {
    console.error('[RSVP]', err);
    status.className = 'form-status bad';
    status.textContent = "Sorry, your reply didn't send. Check your connection and try again. If it still fails, please message us directly.";
  } finally {
    sending = false;
    busy(false);
  }
});

document.getElementById('again')!.addEventListener('click', () => {
  thanks.hidden = true;
  form.hidden = false;
  controls(wrappers[0])[0].focus();
});
