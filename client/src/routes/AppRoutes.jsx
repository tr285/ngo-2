import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import PublicRoute from '../components/common/PublicRoute';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import Dashboard from '../pages/dashboard/Dashboard';
import VolunteersPage from '../pages/volunteers/VolunteersPage';
import DonorsPage from '../pages/donors/DonorsPage';
import CampaignsPage from '../pages/campaigns/CampaignsPage';
import BeneficiariesPage from '../pages/beneficiaries/BeneficiariesPage';
import EventsPage from '../pages/events/EventsPage';
import DonationsPage from '../pages/donations/DonationsPage';
import ReportsPage from '../pages/reports/ReportsPage';
import UsersPage from '../pages/users/UsersPage';
import SettingsPage from '../pages/settings/SettingsPage';
import PlaceholderPage from '../pages/PlaceholderPage';
import NotFound from '../pages/NotFound';
import { ROLES } from '../constants/roles';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />

    {/* Public routes */}
    <Route element={<PublicRoute />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Route>

    {/* Protected routes */}
    <Route element={<ProtectedRoute />}>
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Admin only */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/volunteers" element={<VolunteersPage />} />
          <Route path="/donors" element={<DonorsPage />} />
          <Route path="/beneficiaries" element={<BeneficiariesPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Route>

        {/* Admin + Volunteer */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.VOLUNTEER]} />}>
          <Route
            path="/tasks"
            element={<PlaceholderPage title="Tasks" description="View and manage volunteer tasks." />}
          />
        </Route>

        {/* All authenticated users */}
        <Route path="/campaigns" element={<CampaignsPage />} />
        <Route path="/events" element={<EventsPage />} />

        {/* Admin + Donor */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.DONOR]} />}>
          <Route path="/donations" element={<DonationsPage />} />
        </Route>

        {/* All roles */}
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
