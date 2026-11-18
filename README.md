# Wedding RSVP: Ruchee & Wenekanma

A wedding invitation and RSVP site built with [Astro](https://astro.build).
It builds in about a second and ships plain HTML with 7 KB of script.

## Run it

```sh
npm install
npm run dev        # http://localhost:4321/Wedding-RSVP/
npm run build      # static site in dist/
```

You need Node 22.23.4 or newer (`node -v` shows your version).

## Change the details

| What | File |
|---|---|
| Names, date, venue, schedule, hotels, bank details, FAQs | `src/config/wedding.ts` |
| RSVP questions | `src/config/rsvp-fields.ts` |
| Colours and type | `src/styles/global.css` (`:root` at the top) |
| Flower art | `src/lib/flora.ts` (baked to images by `scripts/bake-flowers.ts`) |

### Add an RSVP question

Add one object to `rsvpFields`. The form, its validation and the data
sent all update automatically.

```ts
{ type: 'radio', name: 'meal', label: 'Main course', required: true,
  showIf: { field: 'attending', equals: 'yes' },
  options: [{ value: 'chicken', label: 'Chicken' }, { value: 'fish', label: 'Fish' }] },
```

Field types: `text`, `email`, `tel`, `textarea`, `select`, `radio`, `checkbox`.
`showIf` shows a question only when another answer matches.

## Where RSVP answers go

Set `PUBLIC_RSVP_ENDPOINT` to any URL that accepts a JSON `POST`.
The quickest free option is [Formspree](https://formspree.io): create a form and copy its endpoint.

- **Locally:** copy `.env.example` to `.env` and fill it in.
- **On GitHub Pages:** go to Settings → Secrets and variables → Actions → Variables, and add `PUBLIC_RSVP_ENDPOINT`.

If no endpoint is set, guests see a "didn't send" message. Answers are never
silently lost. In `npm run dev`, the answers are printed to the browser console instead.

## Publish

Pushing to `main` deploys to GitHub Pages using `.github/workflows/deploy.yml`.
First, turn it on once: **Settings → Pages → Source: GitHub Actions**.
The site will be at `https://bra11y.github.io/Wedding-RSVP/`.

## Why it's fast

- The flowers are drawn **once at build time** and saved as compressed WebP images
  (~720 KB in total, lazy-loaded below the fold). The old page built thousands of
  SVG shapes on every phone and rebuilt them on every resize.
- Animations use [Motion](https://motion.dev) (`motion/mini`), which runs on the
  browser's GPU animation engine. Only `transform` and `opacity` are animated.
- The fog is 14 soft GPU layers instead of a full-screen canvas redrawn every frame.
- Blend modes and big `drop-shadow` filters were removed. Shadows are baked into the images.
- The opening takes about 3.5 s instead of 12.6 s, and the page scrolls after 1.8 s.

## Accessibility

Built to WCAG 2.2 AA:
- a skip link (it also skips the opening)
- Escape skips the animation
- `prefers-reduced-motion` turns off all motion
- music is off until the guest turns it on
- the page stays readable without JavaScript
- the form has real labels, errors written in text, and focus moves to the first error

The original single-file version is kept in `legacy/`.
