// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://bsgdataworks.com',
  // Emit `about.html` rather than `about/index.html` so the live URLs
  // (which are indexed and listed in sitemap.xml) survive the migration.
  build: { format: 'file' },
  trailingSlash: 'never',
});
