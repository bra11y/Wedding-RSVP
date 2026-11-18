# PROGRESS

## 2026-11-18 — Moved from one HTML file to Astro
**Done**
- Rebuilt the invitation in Astro 7 (`src/pages/index.astro`). The original file is in `legacy/`.
- The flowers are baked to WebP at build time (`scripts/bake-flowers.ts`), with a watercolour edge and baked shadows. 2.5 MB of art became 720 KB.
- The opening animation now uses Motion (`motion/mini`, MIT) and GPU layers for the fog. It takes 3.5 s instead of 12.6 s.
- The RSVP form is built from config (`src/config/rsvp-fields.ts`): email, phone, guest count, guest names, dietary needs, access needs, a song request and a message, with conditional questions.
- Accessibility: skip link, Escape skips the intro, reduced motion supported, music off by default, contrast fixed, real labels and errors.
- Added a share card (`og.png`) and a GitHub Pages workflow.

**Decisions**
- Motion over GSAP: same smoothness, real MIT licence.
- No Lenis smooth-scroll: it takes over native scrolling, which is bad for people with motion sensitivity.
- Flower repos (nonflowers, @nbot/flowers, svg-plant, vector-bloom) are inactive or don't match the style. The existing art was kept and baked.

**Open**
- [ ] Choose where RSVPs go (Formspree is the quickest) and set `PUBLIC_RSVP_ENDPOINT`.
- [ ] Fill in the venue, hotels, bank details and the "Are children welcome?" answer in `src/config/wedding.ts`.
- [ ] Update local Node to 22.23.4 or newer (Astro 7.4.12 needs it).
- [ ] Turn on GitHub Pages (Settings → Pages → Source: GitHub Actions), then commit and push.
