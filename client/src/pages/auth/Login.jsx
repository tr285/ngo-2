import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../../components/ui/ThemeToggle';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Login = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from || '/dashboard';

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
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
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Sign in to your NGO Management account
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-primary-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Signing in...' : 'Sign in'}
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
