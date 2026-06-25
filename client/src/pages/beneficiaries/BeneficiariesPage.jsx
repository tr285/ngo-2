import CrudModule from '../../components/crud/CrudModule';
import { beneficiaryService } from '../../services/entityServices';
import { arrayToCsv, toInputDate } from '../../utils/formatters';

const columns = [
  {
    key: 'firstName',
    label: 'Name',
    render: (item) => [item.firstName, item.lastName].filter(Boolean).join(' '),
  },
  { key: 'beneficiaryType', label: 'Type', render: (item) => item.beneficiaryType || '—' },
  {
    key: 'address.city',
    label: 'City',
    render: (item) => item.address?.city || '—',
  },
  {
    key: 'needs',
    label: 'Needs',
    render: (item) => (item.needs?.length ? item.needs.join(', ') : '—'),
  },
  {
    key: 'assignedVolunteer',
    label: 'Volunteer',
    render: (item) =>
      item.assignedVolunteer?.user
        ? `${item.assignedVolunteer.user.firstName} ${item.assignedVolunteer.user.lastName}`
        : '—',
  },
  { key: 'status', label: 'Status', type: 'status' },
];

const fields = [
  { name: 'firstName', label: 'First Name', required: true },
  { name: 'lastName', label: 'Last Name' },
  {
    name: 'beneficiaryType',
    label: 'Type',
    type: 'select',
    options: [
      { value: 'individual', label: 'Individual' },
      { value: 'family', label: 'Family' },
      { value: 'community', label: 'Community' },
    ],
  },
  {
    name: 'gender',
    label: 'Gender',
    type: 'select',
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' },
      { value: 'prefer_not_to_say', label: 'Prefer not to say' },
    ],
  },
  { name: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
  { name: 'contactInfo.phone', label: 'Phone' },
  { name: 'contactInfo.email', label: 'Email', type: 'email' },
  { name: 'address.city', label: 'City' },
  { name: 'address.state', label: 'State' },
  { name: 'address.country', label: 'Country' },
  {
    name: 'needs',
    label: 'Needs',
    placeholder: 'Food, Shelter, Education',
    hint: 'Comma-separated list',
    fullWidth: true,
  },
  { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'graduated', label: 'Graduated' },
    ],
  },
  { name: 'notes', label: 'Notes', type: 'textarea', fullWidth: true },
];

const initialFormData = {
  firstName: '',
  lastName: '',
  beneficiaryType: 'individual',
  gender: '',
  dateOfBirth: '',
  contactInfo: { phone: '', email: '' },
  address: { city: '', state: '', country: '' },
  needs: '',
  description: '',
  status: 'active',
  notes: '',
};

const mapItemToForm = (item) => ({
  firstName: item.firstName || '',
  lastName: item.lastName || '',
  beneficiaryType: item.beneficiaryType || 'individual',
  gender: item.gender || '',
  dateOfBirth: toInputDate(item.dateOfBirth),
  contactInfo: {
    phone: item.contactInfo?.phone || '',
    email: item.contactInfo?.email || '',
  },
  address: {
    city: item.address?.city || '',
    state: item.address?.state || '',
    country: item.address?.country || '',
  },
  needs: arrayToCsv(item.needs),
  description: item.description || '',
  status: item.status || 'active',
  notes: item.notes || '',
});

const BeneficiariesPage = () => (
  <CrudModule
    title="Beneficiary Management"
    description="Manage beneficiaries supported by the NGO."
    entityLabel="Beneficiary"
    columns={columns}
    fields={fields}
    service={beneficiaryService}
    initialFormData={initialFormData}
    mapItemToForm={mapItemToForm}
    filters={[
      {
        name: 'status',
        label: 'All Statuses',
        options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
          { value: 'graduated', label: 'Graduated' },
        ],
      },
      {
        name: 'beneficiaryType',
        label: 'All Types',
        options: [
          { value: 'individual', label: 'Individual' },
          { value: 'family', label: 'Family' },
          { value: 'community', label: 'Community' },
        ],
      },
    ]}
  />
);

export default BeneficiariesPage;
