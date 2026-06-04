import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['assets/logo.png', 'assets/favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Amman Earth Movers Quotations',
        short_name: 'AEM Quotes',
        description: 'Offline-first quotation generator for Amman Earth Movers field managers',
        theme_color: '#F39200',
        background_color: '#F9FAFB',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/assets/logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/assets/logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // Cache all static assets required for the app to function
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            // Cache any Google Fonts if added later
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ]
});
