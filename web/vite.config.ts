import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 6683,
    strictPort: true,
  },
  build: {
    outDir: '../dist/web',
    emptyOutDir: true,
  }
})
