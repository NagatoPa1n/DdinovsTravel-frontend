import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    open: true,
    // Media URLs arrive from the API host-relative (app.upload.public-url), so in dev they
    // would resolve against Vite and fall through to index.html — an <img> would receive
    // HTML. Proxying keeps them working without baking the API host into stored URLs,
    // which would then be wrong in production.
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
