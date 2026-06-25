import { NavLink } from 'react-router-dom';
import {
  Heart,
  LayoutDashboard,
  Users,
  HandCoins,
  Calendar,
  UserCheck,
  FileText,
  Settings,
  X,
  UserPlus,
  HeartHandshake,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';

const iconMap = {
  LayoutDashboard,
  Users,
  HandCoins,
  Calendar,
  UserCheck,
  FileText,
  Settings,
  UserPlus,
  HeartHandshake,
};

const navByRole = {
  [ROLES.ADMIN]: [
    { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Volunteers', path: '/volunteers', icon: 'UserPlus' },
    { label: 'Donors', path: '/donors', icon: 'HeartHandshake' },
    { label: 'Campaigns', path: '/campaigns', icon: 'HandCoins' },
    { label: 'Beneficiaries', path: '/beneficiaries', icon: 'UserCheck' },
    { label: 'Events', path: '/events', icon: 'Calendar' },
    { label: 'Donations', path: '/donations', icon: 'HandCoins' },
    { label: 'Reports', path: '/reports', icon: 'FileText' },
    { label: 'Settings', path: '/settings', icon: 'Settings' },
  ],
  [ROLES.VOLUNTEER]: [
    { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Events', path: '/events', icon: 'Calendar' },
    { label: 'Tasks', path: '/tasks', icon: 'UserCheck' },
    { label: 'Settings', path: '/settings', icon: 'Settings' },
  ],
  [ROLES.DONOR]: [
    { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Campaigns', path: '/campaigns', icon: 'HandCoins' },
    { label: 'My Donations', path: '/donations', icon: 'HandCoins' },
    { label: 'Settings', path: '/settings', icon: 'Settings' },
  ],
};

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const navItems = navByRole[user?.role] || navByRole[ROLES.DONOR];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 dark:border-gray-800 dark:bg-gray-900 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white">
              <Heart size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold">NGO Manager</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Management System</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 lg:hidden dark:hover:bg-gray-800"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon];

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 p-4 dark:border-gray-800">
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
            <p className="text-sm font-medium">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs capitalize text-gray-500 dark:text-gray-400">
              {user?.role}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
