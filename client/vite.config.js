// client/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy /api calls to the local Express server during development.
    // This is only active when running `vite` (npm run dev).
    // In production (Vercel), /api is routed by vercel.json rewrites.
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        // Do NOT rewrite the path — Express is mounted at /api
      },
    },
  },
  build: {
    // Vercel's output directory setting must match this
    outDir: 'dist',
    // Generate source maps for easier debugging on Vercel
    sourcemap: false,
  },
});
