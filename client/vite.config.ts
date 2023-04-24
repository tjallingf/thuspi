import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../server/public',
    assetsDir: './',
    emptyOutDir: true,
  },
  server: {
    port: 4301,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4300',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:4300',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/'),
    },
  },
});
