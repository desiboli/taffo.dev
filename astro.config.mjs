// @ts-check

import { createRequire } from 'node:module';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

const require = createRequire(import.meta.url);

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  integrations: [mdx(), sitemap(), react()],

  fonts: [
      {
          provider: fontProviders.local(),
          name: 'Atkinson',
          cssVariable: '--font-atkinson',
          fallbacks: ['sans-serif'],
          options: {
              variants: [
                  {
                      src: ['./src/assets/fonts/atkinson-regular.woff'],
                      weight: 400,
                      style: 'normal',
                      display: 'swap',
                  },
                  {
                      src: ['./src/assets/fonts/atkinson-bold.woff'],
                      weight: 700,
                      style: 'normal',
                      display: 'swap',
                  },
              ],
          },
      },
  ],

  vite: {
    plugins: [tailwindcss()],
    // pnpm + Rolldown on Netlify can fail to resolve bare "tslib" imports
    // from react-remove-scroll even when tslib is a direct dependency.
    resolve: {
      alias: {
        tslib: require.resolve('tslib'),
      },
    },
  },
});
