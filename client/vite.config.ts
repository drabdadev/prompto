import { defineConfig, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { existsSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

export default defineConfig(async ({ command }) => {
  const plugins: PluginOption[] = [react()]
  const pluginPath = path.resolve(__dirname, '../../.react-grab/vite-plugin.js')
  if (command === 'serve' && existsSync(pluginPath)) {
    const { default: reactGrab } = await import(pathToFileURL(pluginPath).href)
    plugins.push(reactGrab({ agent: 'claude-code' }))
  }
  return {
  plugins,
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
  }
})
