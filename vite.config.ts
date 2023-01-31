import { fileURLToPath, URL } from 'node:url';
import { resolve } from 'path';

import { defineConfig, resolveBaseUrl } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
