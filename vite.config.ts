import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from "vite-plugin-dts";
import {resolve} from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), dts({
    entryRoot: resolve(__dirname, "./lib"),
  })],
  resolve: {
    alias: {
      'uniform': resolve(__dirname, "./lib")
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/index.ts'),
      name: 'UniForm',
      fileName: 'uniform',
    },
    rollupOptions: {
      external: ['react', 'zod'],
      output: {
        globals: {
          react: 'React',
          zod: 'zod',
        },
      },
    },
  },
})
