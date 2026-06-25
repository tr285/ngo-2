import { Menu, Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLE_LABELS } from '../../constants/roles';
import ThemeToggle from '../ui/ThemeToggle';

const Navbar = ({ onMenuClick, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden dark:hover:bg-gray-800"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-lg font-semibold">{title}</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Welcome back, {user?.firstName}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden rounded-full bg-primary-50 px-3 py-1 text-xs font-medium capitalize text-primary-700 sm:inline dark:bg-primary-950 dark:text-primary-300">
          {ROLE_LABELS[user?.role] || user?.role}
        </span>

        <button
          type="button"
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>

        <ThemeToggle />

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
          aria-label="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
