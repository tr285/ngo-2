// api/index.js  — Vercel Serverless Function entry point
// This file is the single entry point for ALL /api/* requests on Vercel.
// Vercel does NOT run a persistent Express server; every request is a cold
// function invocation.  We therefore:
//   1. Connect to MongoDB lazily (cached across warm invocations).
//   2. Export the Express `app` as the default export (handler).
//   3. Never call app.listen() — Vercel manages the HTTP lifecycle.

require('dotenv').config();
const mongoose = require('mongoose');

// ── Lazy / cached MongoDB connection ──────────────────────────────────────────
// On Vercel, the module may be reused across many requests in the same Lambda
// container.  We cache the promise so we never open duplicate connections.
let connectionPromise = null;

const connectDB = () => {
  if (connectionPromise) return connectionPromise;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI environment variable is not set');

  connectionPromise = mongoose
    .connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    })
    .then((conn) => {
      console.log(`MongoDB connected: ${conn.connection.host}`);
      return conn;
    })
    .catch((err) => {
      // Reset so the next invocation retries
      connectionPromise = null;
      throw err;
    });

  return connectionPromise;
};

// ── Express app ───────────────────────────────────────────────────────────────
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Routes
const routes = require('../server/src/routes');
const notFound = require('../server/src/middleware/notFound');
const errorHandler = require('../server/src/middleware/errorHandler');

const app = express();

// ── CORS ─────────────────────────────────────────────────────────────────────
// In production on Vercel the frontend is served from the same domain, so the
// only CORS origin that matters is the Vercel deployment URL (or a custom
// domain).  We allow the env var CLIENT_URL for flexibility.
const allowedOrigins = [
  process.env.CLIENT_URL,
  // Allow the same-origin case (Vercel serves frontend + API from the same URL)
  /https:\/\/.*\.vercel\.app$/,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (server-to-server, curl, Postman)
      if (!origin) return callback(null, true);
      const allowed =
        allowedOrigins.some((o) =>
          o instanceof RegExp ? o.test(origin) : o === origin
        );
      if (allowed) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ── Security & body parsing ───────────────────────────────────────────────────
app.use(
  helmet({
    // Vercel already sets some security headers; avoid conflicts
    crossOriginResourcePolicy: false,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'NGO Management API is running',
    timestamp: new Date().toISOString(),
    mongoState: mongoose.connection.readyState,
  });
});

// ── Wrap all routes with DB connection guard ──────────────────────────────────
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(503).json({
      success: false,
      message: 'Database connection failed. Please try again.',
    });
  }
});

app.use('/api', routes);

// Note: /uploads static serving is NOT available on Vercel (read-only FS).
// For file uploads in production, use Cloudinary / S3 / Supabase Storage.
// The upload middleware is kept but disk storage will only work in dev.

app.use(notFound);
app.use(errorHandler);

// ── Export for Vercel (do NOT call app.listen) ────────────────────────────────
module.exports = app;
