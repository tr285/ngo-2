import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';
import CrudModule from '../../components/crud/CrudModule';
import { campaignService } from '../../services/entityServices';
import { formatCurrency, toInputDate } from '../../utils/formatters';

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'category', label: 'Category', render: (item) => item.category?.replace(/_/g, ' ') },
  {
    key: 'goalAmount',
    label: 'Goal',
    render: (item) => formatCurrency(item.goalAmount, item.currency),
  },
  {
    key: 'raisedAmount',
    label: 'Raised',
    render: (item) => formatCurrency(item.raisedAmount, item.currency),
  },
  { key: 'status', label: 'Status', type: 'status' },
  { key: 'startDate', label: 'Start', type: 'date' },
  { key: 'endDate', label: 'End', type: 'date' },
];

const fields = [
  { name: 'title', label: 'Title', required: true, fullWidth: true },
  { name: 'shortDescription', label: 'Short Description', fullWidth: true },
  { name: 'description', label: 'Description', type: 'textarea', required: true, fullWidth: true, rows: 4 },
  {
    name: 'category',
    label: 'Category',
    type: 'select',
    options: [
      { value: 'education', label: 'Education' },
      { value: 'healthcare', label: 'Healthcare' },
      { value: 'environment', label: 'Environment' },
      { value: 'disaster_relief', label: 'Disaster Relief' },
      { value: 'community', label: 'Community' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'draft', label: 'Draft' },
      { value: 'active', label: 'Active' },
      { value: 'paused', label: 'Paused' },
      { value: 'completed', label: 'Completed' },
      { value: 'cancelled', label: 'Cancelled' },
    ],
  },
  { name: 'goalAmount', label: 'Goal Amount', type: 'number', required: true, min: 1 },
  { name: 'currency', label: 'Currency', placeholder: 'USD' },
  { name: 'startDate', label: 'Start Date', type: 'date', required: true },
  { name: 'endDate', label: 'End Date', type: 'date', required: true },
  { name: 'coverImage', label: 'Cover Image URL', fullWidth: true },
  {
    name: 'isFeatured',
    label: 'Featured',
    type: 'checkbox',
    checkboxLabel: 'Show on featured campaigns list',
    fullWidth: true,
  },
];

const initialFormData = {
  title: '',
  shortDescription: '',
  description: '',
  category: 'other',
  status: 'draft',
  goalAmount: '',
  currency: 'USD',
  startDate: '',
  endDate: '',
  coverImage: '',
  isFeatured: false,
};

const mapItemToForm = (item) => ({
  title: item.title || '',
  shortDescription: item.shortDescription || '',
  description: item.description || '',
  category: item.category || 'other',
  status: item.status || 'draft',
  goalAmount: item.goalAmount || '',
  currency: item.currency || 'USD',
  startDate: toInputDate(item.startDate),
  endDate: toInputDate(item.endDate),
  coverImage: item.coverImage || '',
  isFeatured: item.isFeatured || false,
});

const mapFormToPayload = (formData) => ({
  ...formData,
  goalAmount: Number(formData.goalAmount),
});

const CampaignsPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === ROLES.ADMIN;

  return (
    <CrudModule
      title="Campaign Management"
      description={
        isAdmin
          ? 'Create and manage fundraising campaigns.'
          : 'Browse active fundraising campaigns.'
      }
      entityLabel="Campaign"
      columns={columns}
      fields={fields}
      service={campaignService}
      initialFormData={initialFormData}
      mapItemToForm={mapItemToForm}
      mapFormToPayload={mapFormToPayload}
      readOnly={!isAdmin}
      filters={[
        {
          name: 'status',
          label: 'All Statuses',
          options: [
            { value: 'draft', label: 'Draft' },
            { value: 'active', label: 'Active' },
            { value: 'paused', label: 'Paused' },
            { value: 'completed', label: 'Completed' },
            { value: 'cancelled', label: 'Cancelled' },
          ],
        },
        {
          name: 'category',
          label: 'All Categories',
          options: [
            { value: 'education', label: 'Education' },
            { value: 'healthcare', label: 'Healthcare' },
            { value: 'environment', label: 'Environment' },
            { value: 'disaster_relief', label: 'Disaster Relief' },
            { value: 'community', label: 'Community' },
            { value: 'other', label: 'Other' },
          ],
        },
      ]}
    />
  );
};

export default CampaignsPage;
