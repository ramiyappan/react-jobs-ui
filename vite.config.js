import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port:5173, 
    proxy: {
      '/api' : {
        // use target: 'http://localhost:8888' for netlify dev
        target: 'https://stupendous-meerkat-014f48.netlify.app', 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/.netlify/functions/jobs')
      }
    }
  },
})
