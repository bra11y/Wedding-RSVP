import { defineConfig } from 'astro/config';

// GitHub Pages serves this repo at https://bra11y.github.io/Wedding-RSVP/
// If you move to a custom domain or Vercel/Netlify, set SITE_URL and BASE_PATH=/ (or delete `base`).
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://bra11y.github.io',
  base: process.env.BASE_PATH ?? '/Wedding-RSVP',
  build: { inlineStylesheets: 'always' },
});
