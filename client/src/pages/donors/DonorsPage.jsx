import CrudModule from '../../components/crud/CrudModule';
import { donorService } from '../../services/entityServices';
import { arrayToCsv, formatCurrency } from '../../utils/formatters';

const columns = [
  {
    key: 'user.firstName',
    label: 'Name',
    render: (item) =>
      item.user ? `${item.user.firstName} ${item.user.lastName}` : '—',
  },
  { key: 'user.email', label: 'Email' },
  { key: 'donorType', label: 'Type', render: (item) => item.donorType || '—' },
  { key: 'organization', label: 'Organization' },
  {
    key: 'totalDonated',
    label: 'Total Donated',
    render: (item) => formatCurrency(item.totalDonated),
  },
  { key: 'donationCount', label: 'Donations' },
  { key: 'status', label: 'Status', type: 'status' },
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
    hint: 'Leave blank to use default: Donor@123',
  },
  { name: 'phone', label: 'Phone' },
  { name: 'firstName', label: 'First Name', showOnCreate: false },
  { name: 'lastName', label: 'Last Name', showOnCreate: false },
  { name: 'phone', label: 'Phone', showOnCreate: false },
  {
    name: 'donorType',
    label: 'Donor Type',
    type: 'select',
    options: [
      { value: 'individual', label: 'Individual' },
      { value: 'corporate', label: 'Corporate' },
    ],
  },
  { name: 'organization', label: 'Organization' },
  {
    name: 'preferredCauses',
    label: 'Preferred Causes',
    placeholder: 'Education, Healthcare, Environment',
    hint: 'Comma-separated list',
    fullWidth: true,
  },
  { name: 'taxId', label: 'Tax ID' },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ],
  },
  {
    name: 'isAnonymous',
    label: 'Anonymous Donor',
    type: 'checkbox',
    checkboxLabel: 'Hide donor identity in public listings',
    fullWidth: true,
  },
  { name: 'notes', label: 'Notes', type: 'textarea', fullWidth: true },
];

const initialFormData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phone: '',
  donorType: 'individual',
  organization: '',
  preferredCauses: '',
  taxId: '',
  status: 'active',
  isAnonymous: false,
  notes: '',
};

const mapItemToForm = (item) => ({
  firstName: item.user?.firstName || '',
  lastName: item.user?.lastName || '',
  phone: item.user?.phone || '',
  donorType: item.donorType || 'individual',
  organization: item.organization || '',
  preferredCauses: arrayToCsv(item.preferredCauses),
  taxId: item.taxId || '',
  status: item.status || 'active',
  isAnonymous: item.isAnonymous || false,
  notes: item.notes || '',
});

const DonorsPage = () => (
  <CrudModule
    title="Donor Management"
    description="Manage donor profiles, preferences, and giving history."
    entityLabel="Donor"
    columns={columns}
    fields={fields}
    service={donorService}
    initialFormData={initialFormData}
    mapItemToForm={mapItemToForm}
    filters={[
      {
        name: 'status',
        label: 'All Statuses',
        options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ],
      },
      {
        name: 'donorType',
        label: 'All Types',
        options: [
          { value: 'individual', label: 'Individual' },
          { value: 'corporate', label: 'Corporate' },
        ],
      },
    ]}
  />
);

export default DonorsPage;
