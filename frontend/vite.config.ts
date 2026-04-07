import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  assetsInclude: ['**/*.svg', '**/*.csv'],

  server: {
    proxy: {
      '/auth': 'http://localhost:8000',
      '/games': 'http://localhost:8000',
      '/scores': 'http://localhost:8000',
      '/leaderboard': 'http://localhost:8000',
      '/tournaments': 'http://localhost:8000',
      '/wallet': 'http://localhost:8000',
      '/transactions': 'http://localhost:8000',
      '/notifications': 'http://localhost:8000',
      '/admin': 'http://localhost:8000',
      '/health': 'http://localhost:8000',
    },
  },
})
