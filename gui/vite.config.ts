import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        ws: true
      },
      '/broker': {
        target: 'http://161.53.18.44:8000',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/broker/, ''),
        configure: (proxy) => {
          proxy.on('proxyReqWs', (proxyReq, req) => {
            proxyReq.setHeader('origin', 'http://161.53.18.44:8000');
            const url = new URL(req.url ?? '', 'http://localhost');
            const clientId = url.searchParams.get('client_id');
            const token = url.searchParams.get('token');
            if (clientId) proxyReq.setHeader('client-id', clientId);
            if (token) proxyReq.setHeader('token', token);
          });
        },
      },
    }
  },
  preview: {
    port: 3000,
    host: true,
  }
})

