import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy';
import systemConfig from '../server/config/system.json';
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['last 2 versions', '> 0.2%', 'not dead']
    }),
    viteSingleFile({
      inlinePattern: [
        '**/src/styles/critical.scss',
        '**/src/critical.js'
      ]
    })
  ],
  build: {
    outDir: '../server/public',
    assetsDir: './'
  },
  server: {
    port: systemConfig.webClient.devPort,
    strictPort: true,
    proxy: {
      '/api': {
        target: `http://localhost:${systemConfig.webClient.port}/`,
        changeOrigin: true
      },
    }
  }
})
