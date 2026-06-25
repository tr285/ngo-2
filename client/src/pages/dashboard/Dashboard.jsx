import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';
import AdminDashboard from './AdminDashboard';
import VolunteerDashboard from './VolunteerDashboard';
import DonorDashboard from './DonorDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case ROLES.ADMIN:
      return <AdminDashboard />;
    case ROLES.VOLUNTEER:
      return <VolunteerDashboard />;
    case ROLES.DONOR:
    default:
      return <DonorDashboard />;
  }
};

export default Dashboard;
