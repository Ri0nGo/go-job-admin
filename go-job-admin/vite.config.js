import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src',
    }
  }
})
