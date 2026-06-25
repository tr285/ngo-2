import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Heart, ArrowLeft, CheckCircle } from 'lucide-react';
import ThemeToggle from '../../components/ui/ThemeToggle';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call — in production wire to a real forgot-password endpoint
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 text-white">
            <Heart size={28} />
          </div>
          <h1 className="text-2xl font-bold">Forgot Password?</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Enter your email and we&apos;ll send you reset instructions
          </p>
        </div>

        <div className="card">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input pl-10"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>
          ) : (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
                <CheckCircle size={28} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold">Check your email</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  If <strong>{email}</strong> is registered, you&apos;ll receive password reset instructions shortly.
                </p>
              </div>
              <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                Note: Email reset is not yet configured. Please contact your system administrator to reset your password.
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:underline"
            >
              <ArrowLeft size={14} />
              Back to Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
