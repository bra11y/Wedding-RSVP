import { defineConfig } from 'astro/config';

// Where the site lives:
// - Vercel (sets VERCEL=1 while building): served from the domain root.
// - GitHub Pages: served at https://bra11y.github.io/Wedding-RSVP/
// Override either with SITE_URL / BASE_PATH.
const onVercel = !!process.env.VERCEL;
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;

export default defineConfig({
  site: process.env.SITE_URL ?? (onVercel && vercelUrl ? `https://${vercelUrl}` : 'https://bra11y.github.io'),
  base: process.env.BASE_PATH ?? (onVercel ? '/' : '/Wedding-RSVP'),
  build: { inlineStylesheets: 'always' },
});
