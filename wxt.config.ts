import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { getManifest } from './scripts/manifest';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  outDir: 'output',
  publicDir: 'src/assets',
  modules: ['@wxt-dev/module-react'],
  webExt: {
    binaries: {
      edge: '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    },
    chromiumArgs: ['--user-data-dir=./.wxt/chromium-data'],
  },
  manifest: getManifest({ port: 5080 }),
  dev: {
    server: {
      port: 5080,
      hostname: '127.0.0.1',
    },
  },
  vite: () => ({
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  }),
});
