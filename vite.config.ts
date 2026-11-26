import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// On GitHub Pages the app lives at /<repo-name>/, so the deploy workflow
// passes BASE_PATH. Locally it is just "/".
const base = process.env.BASE_PATH ?? '/'

// Shown in Settings so you can see which version is running.
const version = process.env.npm_package_version ?? '0.0.0'
const buildTime = new Date().toLocaleString('en-GB', {
  timeZone: 'Asia/Jakarta', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
})

export default defineConfig({
  base,
  define: {
    __APP_VERSION__: JSON.stringify(version),
    __BUILD_TIME__: JSON.stringify(buildTime),
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false, // registered in src/pwa.ts
      includeAssets: ['icons/apple-touch-icon.png'],
      manifest: {
        name: 'Listrik — Electricity Estimator',
        short_name: 'Listrik',
        description: 'Estimate and manage home electricity cost (PLN token).',
        theme_color: '#0b0f14',
        background_color: '#0b0f14',
        display: 'standalone',
        orientation: 'portrait',
        start_url: base,
        scope: base,
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  test: { include: ['tests/**/*.test.ts'] },
})
