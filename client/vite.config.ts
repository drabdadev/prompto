import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import reactGrab from '../../.react-grab/vite-plugin.js'

export default defineConfig({
  plugins: [react(), reactGrab({ agent: 'claude-code' })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3080,
    strictPort: true,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5080',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
