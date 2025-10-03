import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 80,
      strictPort: true,
      proxy: {
        '/api': {
          target: env.VITE_API_URL ? env.VITE_API_URL.replace(/\/api$/, '') : 'http://localhost:5001',
          changeOrigin: true,
          secure: false,
          // NO rewrite here
        },
      },
    },
  }
})
