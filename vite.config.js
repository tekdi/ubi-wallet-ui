import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    VitePWA({
      registerType: 'autoUpdate', // Automatically updates service workers
      includeAssets: ['favicon.ico'], //, 'robots.txt', 'apple-touch-icon.png'
      manifest: {
        name: 'E-Wallet',
        short_name: 'Wallet',
        description: 'E Wallet for Piramal',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'favicon.ico',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'favicon.ico',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'favicon.ico',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
})
