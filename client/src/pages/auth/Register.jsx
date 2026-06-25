import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Heart, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../../components/ui/ThemeToggle';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Register = () => {
  const { register, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'donor',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
      await register(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8 dark:bg-gray-950">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 text-white">
            <Heart size={28} />
          </div>
          <h1 className="text-2xl font-bold">Create account</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Join as a donor or volunteer
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium">
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  required
                  value={form.firstName}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium">
                  Last name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  required
                  value={form.lastName}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            </div>

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
                  minLength={8}
                  value={form.password}
                  onChange={handleChange}
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="role" className="mb-1.5 block text-sm font-medium">
                Register as
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="input pl-10"
                >
                  <option value="donor">Donor</option>
                  <option value="volunteer">Volunteer</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
