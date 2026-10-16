/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  if (command === 'serve' && mode !== 'test' && !env.CURRENCYBEACON_API_KEY) {
    console.warn('CURRENCYBEACON_API_KEY is empty.')
  }

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'https://api.currencybeacon.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          headers: { Authorization: `Bearer ${env.CURRENCYBEACON_API_KEY}` },
        },
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
    },
  }
})
