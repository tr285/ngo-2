import CrudModule from '../../components/crud/CrudModule';
import { volunteerService } from '../../services/entityServices';
import { arrayToCsv } from '../../utils/formatters';

const columns = [
  {
    key: 'user.firstName',
    label: 'Name',
    exportValue: (item) =>
      item.user ? `${item.user.firstName} ${item.user.lastName}` : '—',
    render: (item) =>
      item.user ? `${item.user.firstName} ${item.user.lastName}` : '—',
  },
  { key: 'user.email', label: 'Email' },
  {
    key: 'skills',
    label: 'Skills',
    render: (item) => (item.skills?.length ? item.skills.join(', ') : '—'),
  },
  { key: 'totalHours', label: 'Hours' },
  { key: 'status', label: 'Status', type: 'status' },
  { key: 'joinedAt', label: 'Joined', type: 'date' },
];

const fields = [
  { name: 'firstName', label: 'First Name', required: true, showOnEdit: false },
  { name: 'lastName', label: 'Last Name', required: true, showOnEdit: false },
  { name: 'email', label: 'Email', type: 'email', required: true, showOnEdit: false },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    showOnEdit: false,
    hint: 'Leave blank to use default: Volunteer@123',
  },
  { name: 'phone', label: 'Phone' },
  { name: 'firstName', label: 'First Name', showOnCreate: false },
  { name: 'lastName', label: 'Last Name', showOnCreate: false },
  { name: 'phone', label: 'Phone', showOnCreate: false },
  { name: 'bio', label: 'Bio', type: 'textarea', fullWidth: true },
  {
    name: 'skills',
    label: 'Skills',
    placeholder: 'Teaching, First Aid, Event Planning',
    hint: 'Comma-separated list',
    fullWidth: true,
  },
  { name: 'availability', label: 'Availability', fullWidth: true },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'pending', label: 'Pending' },
      { value: 'approved', label: 'Approved' },
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'rejected', label: 'Rejected' },
    ],
    showOnCreate: false,
  },
  { name: 'totalHours', label: 'Total Hours', type: 'number', min: 0, showOnCreate: false },
  { name: 'notes', label: 'Notes', type: 'textarea', fullWidth: true },
];

const initialFormData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phone: '',
  bio: '',
  skills: '',
  availability: '',
  status: 'pending',
  totalHours: 0,
  notes: '',
};

const mapItemToForm = (item) => ({
  firstName: item.user?.firstName || '',
  lastName: item.user?.lastName || '',
  phone: item.user?.phone || '',
  bio: item.bio || '',
  skills: arrayToCsv(item.skills),
  availability: item.availability || '',
  status: item.status || 'pending',
  totalHours: item.totalHours || 0,
  notes: item.notes || '',
});

const VolunteersPage = () => (
  <CrudModule
    title="Volunteer Management"
    description="Manage volunteer profiles, approvals, and activity."
    entityLabel="Volunteer"
    columns={columns}
    fields={fields}
    service={volunteerService}
    initialFormData={initialFormData}
    mapItemToForm={mapItemToForm}
    filters={[
      {
        name: 'status',
        label: 'All Statuses',
        options: [
          { value: 'pending', label: 'Pending' },
          { value: 'approved', label: 'Approved' },
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
          { value: 'rejected', label: 'Rejected' },
        ],
      },
    ]}
  />
);

export default VolunteersPage;
