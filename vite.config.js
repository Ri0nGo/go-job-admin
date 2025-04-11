import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5000,
    host: '127.0.0.1',
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src',
    }
  },
})
