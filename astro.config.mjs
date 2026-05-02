// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare'

import sanity from '@sanity/astro';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    platformProxy: {enabled: true},
    
  }),
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {}
    }
  },
  integrations: [sanity({
      projectId: "o7ggtpu6",
      dataset: "production",
      useCdn: true, // for static builds
    })],
  vite: {
    ssr: {
      external: ['node:buffer', 'node:path', 'node:stream', 'node:util']
    }
  }
});