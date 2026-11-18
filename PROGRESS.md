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
- [x] Formspree endpoint set (GitHub variable + Vercel env, all environments).
- [x] Live on Vercel: https://wedding-rsvp-ruby-tau.vercel.app (project `wedding-rsvp`).
- [ ] Send one test RSVP and confirm it in the Formspree email.
- [ ] Optional: `vercel git connect` so every push to main redeploys.
- [ ] Fill in the venue, hotels, bank details and the "Are children welcome?" answer in `src/config/wedding.ts`.
- [ ] Update local Node to 22.23.4 or newer (Astro 7.4.12 needs it).
- [ ] GitHub Actions is blocked by a GitHub billing lock. Fix billing, or disable `.github/workflows/deploy.yml`, if Vercel is the host.
