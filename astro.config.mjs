import { defineConfig } from 'astro/config';
import sanity from '@sanity/astro';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [sanity({
    projectId: "o7ggtpu6",
    dataset: "production",
    useCdn: true,
  })],
  vite: {
    ssr: {
      external: ['node:buffer', 'node:path', 'node:stream', 'node:util']
    }
  }
});