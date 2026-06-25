import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
    <h1 className="text-6xl font-bold text-primary-600">404</h1>
    <p className="mt-4 text-lg font-medium">Page not found</p>
    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
      The page you are looking for does not exist.
    </p>
    <Link to="/dashboard" className="btn-primary mt-6">
      Go to Dashboard
    </Link>
  </div>
);

export default NotFound;
