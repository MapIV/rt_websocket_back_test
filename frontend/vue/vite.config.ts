import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: true
  },
  build: {
    target: 'esnext',  // Ensure top-level await is supported
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext', // Also enable for dependencies
    },
  },
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
