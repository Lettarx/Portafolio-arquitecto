// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sanity from '@sanity/astro';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    platformProxy: { enabled: true },
  }),
  integrations: [
    sanity({
      projectId: import.meta.env.PROJECTID_SANITY,
      dataset: import.meta.env.DATASET_SANITY,
      useCdn: true,
    }),
  ],
  vite: {
    ssr: {
      external: ['node:buffer', 'node:path', 'node:stream', 'node:util'],
    },
  },
});