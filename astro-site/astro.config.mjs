// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://bsgdataworks.com',
  // Extensionless URLs: `about.astro` -> `about/index.html`, served at
  // `/about`. The previous `.html` paths are 301'd in public/_redirects —
  // they are indexed, so those redirects must ship with every deploy.
  build: { format: 'directory' },
  trailingSlash: 'never',
});
