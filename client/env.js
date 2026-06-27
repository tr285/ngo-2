// server/src/config/env.js
// Validates required env vars and exports a typed config object.
// dotenv.config() is called here so it works both in local dev (server.js)
// and in the Vercel serverless function (api/index.js).

require('dotenv').config();

const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];

const missingVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(', ')}`
  );
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5001,
  mongodbUri: process.env.MONGODB_URI,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  // CLIENT_URL is used for CORS. On Vercel, set this to your frontend URL,
  // e.g. https://your-app.vercel.app  (NO trailing slash).
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    keySecret: process.env.RAZORPAY_KEY_SECRET || 'razorpay_secret_placeholder',
  },
  stripe: {
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder',
    secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder',
  },
  isDevelopment: (process.env.NODE_ENV || 'development') === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

module.exports = env;
