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
  port: parseInt(process.env.PORT, 10) || 5000,
  mongodbUri: process.env.MONGODB_URI,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
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
