import { CreditCard, IndianRupee, Loader2 } from 'lucide-react';

const PaymentGatewayButtons = ({
  amount,
  campaignId,
  onRazorpay,
  onStripe,
  loading,
  disabled,
}) => (
  <div className="space-y-4">
    <p className="text-sm text-gray-500 dark:text-gray-400">
      Choose a payment gateway to complete your donation. Placeholder integrations
      simulate successful payments in development.
    </p>

    <div className="grid gap-3 sm:grid-cols-2">
      <button
        type="button"
        disabled={disabled || loading || !amount || !campaignId}
        onClick={onRazorpay}
        className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-left transition hover:border-blue-300 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-blue-900 dark:bg-blue-950/40 dark:hover:bg-blue-950/60"
      >
        {loading === 'razorpay' ? (
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
            <IndianRupee size={20} />
          </div>
        )}
        <div>
          <p className="font-semibold text-blue-900 dark:text-blue-100">Razorpay</p>
          <p className="text-xs text-blue-700 dark:text-blue-300">
            UPI, cards, netbanking (INR)
          </p>
        </div>
      </button>

      <button
        type="button"
        disabled={disabled || loading || !amount || !campaignId}
        onClick={onStripe}
        className="flex items-center gap-3 rounded-xl border border-violet-200 bg-violet-50 p-4 text-left transition hover:border-violet-300 hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-violet-900 dark:bg-violet-950/40 dark:hover:bg-violet-950/60"
      >
        {loading === 'stripe' ? (
          <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-600 text-white">
            <CreditCard size={20} />
          </div>
        )}
        <div>
          <p className="font-semibold text-violet-900 dark:text-violet-100">Stripe</p>
          <p className="text-xs text-violet-700 dark:text-violet-300">
            Cards, wallets (USD &amp; more)
          </p>
        </div>
      </button>
    </div>
  </div>
);

export default PaymentGatewayButtons;
