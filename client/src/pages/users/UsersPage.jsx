import CrudModule from '../../components/crud/CrudModule';
import { userService } from '../../services/entityServices';
import { ROLES, ROLE_LABELS } from '../../constants/roles';

const columns = [
  {
    key: 'firstName',
    label: 'Name',
    exportValue: (item) => `${item.firstName} ${item.lastName}`,
    render: (item) => `${item.firstName} ${item.lastName}`,
  },
  { key: 'email', label: 'Email' },
  {
    key: 'role',
    label: 'Role',
    exportValue: (item) => ROLE_LABELS[item.role] || item.role,
    render: (item) => ROLE_LABELS[item.role] || item.role,
  },
  { key: 'phone', label: 'Phone' },
  {
    key: 'isActive',
    label: 'Active',
    exportValue: (item) => (item.isActive ? 'Yes' : 'No'),
    render: (item) => (item.isActive ? 'Yes' : 'No'),
  },
  { key: 'createdAt', label: 'Joined', type: 'date' },
];

const fields = [
  { name: 'firstName', label: 'First Name', required: true },
  { name: 'lastName', label: 'Last Name', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true, showOnEdit: false },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    required: true,
    showOnEdit: false,
  },
  { name: 'phone', label: 'Phone' },
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    required: true,
    options: Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label })),
  },
  {
    name: 'isActive',
    label: 'Active Account',
    type: 'checkbox',
    showOnCreate: false,
    checkboxLabel: 'User is active',
  },
];

const initialFormData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phone: '',
  role: ROLES.DONOR,
  isActive: true,
};

const mapItemToForm = (item) => ({
  firstName: item.firstName || '',
  lastName: item.lastName || '',
  phone: item.phone || '',
  role: item.role || ROLES.DONOR,
  isActive: item.isActive ?? true,
});

const UsersPage = () => (
  <CrudModule
    title="User Management"
    description="Manage admin, volunteer, and donor accounts."
    entityLabel="User"
    columns={columns}
    fields={fields}
    service={userService}
    initialFormData={initialFormData}
    mapItemToForm={mapItemToForm}
    exportFilename="users"
    filters={[
      {
        name: 'role',
        label: 'All Roles',
        options: Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label })),
      },
    ]}
  />
);

export default UsersPage;
