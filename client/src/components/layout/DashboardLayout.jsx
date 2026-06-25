import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/volunteers': 'Volunteers',
  '/donors': 'Donors',
  '/users': 'Users',
  '/campaigns': 'Campaigns',
  '/donations': 'Donations',
  '/events': 'Events',
  '/beneficiaries': 'Beneficiaries',
  '/reports': 'Reports',
  '/tasks': 'Tasks',
  '/settings': 'Settings',
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Dashboard';

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-screen flex-1 flex-col lg:ml-0">
        <Navbar
          title={title}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
