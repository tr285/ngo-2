const env = require('../config/env');

/**
 * Placeholder Razorpay integration.
 * Replace with real Razorpay SDK calls when credentials are configured.
 */
const createRazorpayOrder = ({ amount, currency, donationId }) => {
  const orderId = `order_${Date.now()}_${donationId.toString().slice(-6)}`;

  return {
    gateway: 'razorpay',
    orderId,
    amount: Math.round(amount * 100),
    currency: currency || 'INR',
    keyId: env.razorpay.keyId,
    placeholder: true,
    message: 'Placeholder Razorpay order — configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET for live payments.',
  };
};

const verifyRazorpayPayment = ({ orderId, paymentId }) => {
  if (!orderId || !paymentId) {
    return { verified: false, message: 'Missing payment details.' };
  }

  return {
    verified: true,
    placeholder: true,
    orderId,
    paymentId,
    transactionId: paymentId,
    message: 'Placeholder verification — payment marked as successful in development.',
  };
};

/**
 * Placeholder Stripe integration.
 * Replace with real Stripe SDK calls when credentials are configured.
 */
const createStripePaymentIntent = ({ amount, currency, donationId }) => {
  const paymentIntentId = `pi_${Date.now()}_${donationId.toString().slice(-6)}`;
  const clientSecret = `${paymentIntentId}_secret_placeholder`;

  return {
    gateway: 'stripe',
    paymentIntentId,
    clientSecret,
    amount: Math.round(amount * 100),
    currency: (currency || 'usd').toLowerCase(),
    publishableKey: env.stripe.publishableKey,
    placeholder: true,
    message: 'Placeholder Stripe PaymentIntent — configure STRIPE_PUBLISHABLE_KEY and STRIPE_SECRET_KEY for live payments.',
  };
};

const confirmStripePayment = ({ paymentIntentId }) => {
  if (!paymentIntentId) {
    return { confirmed: false, message: 'Missing payment intent ID.' };
  }

  return {
    confirmed: true,
    placeholder: true,
    paymentIntentId,
    transactionId: paymentIntentId,
    message: 'Placeholder confirmation — payment marked as successful in development.',
  };
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
  createStripePaymentIntent,
  confirmStripePayment,
};
