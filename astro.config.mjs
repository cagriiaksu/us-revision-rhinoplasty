// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  // Production domain for this US revision-rhinoplasty landing page. Served from
  // the /us/revision-rhinoplasty-in-turkey/ subfolder, so `base` is set to match
  // — all public asset paths are made base-aware via src/data/asset.ts. Still
  // noindex until real content is approved (see Layout robots meta).
  site: 'https://lp.celalalioglu.com',
  base: '/us/revision-rhinoplasty-in-turkey',
  integrations: [react()],
  output: 'static',
  compressHTML: true,
  build: {
    assets: 'assets',
    inlineStylesheets: 'auto',
    concurrency: 2,
  },
  image: {
    layout: 'constrained',
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Playfair Display',
      cssVariable: '--font-heading',
      options: {
        variants: [
          {
            weight: '400 900',
            style: 'normal',
            src: ['./src/assets/fonts/playfair-display-variable.woff2'],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Inter',
      cssVariable: '--font-body',
      options: {
        variants: [
          {
            weight: '300 700',
            style: 'normal',
            src: ['./src/assets/fonts/inter-variable.woff2'],
          },
        ],
      },
    },
  ],
  vite: {
    server: {
      fs: {
        allow: ['..'],
      },
    },
  },
});
