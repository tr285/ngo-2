// client/src/services/api.js
// Central Axios instance used by all service modules.
//
// API URL resolution on Vercel:
// ─────────────────────────────
// The client and server are deployed to the SAME Vercel project (monorepo).
// The frontend (React SPA) is served as static files.
// The backend (Express) runs as a serverless function at /api/*.
//
// Because both share the same origin, we can use a relative base URL ("/api")
// without setting VITE_API_URL at all in production — requests automatically
// go to the same domain.
//
// In local development, Vite's proxy (vite.config.js) forwards /api → Express,
// so the relative URL works there too.
//
// NEVER hardcode http://localhost:5001 in any env var that gets bundled into
// the production build.  The .env.production file (or Vercel env vars) should
// leave VITE_API_URL blank or set it to "/api".

import axios from 'axios';
import { TOKEN_KEY } from '../constants/roles';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // Include credentials so cookies work cross-origin if you add them later
  withCredentials: false,
});

// ── Request interceptor: attach JWT ──────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 globally ────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      // Redirect to login if we're not already there
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
