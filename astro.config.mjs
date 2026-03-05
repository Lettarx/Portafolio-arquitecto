// @ts-check
import { defineConfig } from 'astro/config';

import sanity from '@sanity/astro';

// https://astro.build/config
export default defineConfig({
  integrations: [sanity({
      projectId: "o7ggtpu6",
      dataset: "production",
      useCdn: false, // for static builds
    })]
});