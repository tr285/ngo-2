import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';
import CrudModule from '../../components/crud/CrudModule';
import { eventService } from '../../services/entityServices';
import { arrayToCsv, toInputDateTime } from '../../utils/formatters';

const columns = [
  { key: 'title', label: 'Title' },
  {
    key: 'location.venue',
    label: 'Venue',
    render: (item) => item.location?.venue || item.location?.city || '—',
  },
  { key: 'startDate', label: 'Start', type: 'datetime' },
  { key: 'endDate', label: 'End', type: 'datetime' },
  {
    key: 'volunteers',
    label: 'Volunteers',
    render: (item) => item.volunteers?.filter((v) => v.status !== 'cancelled').length || 0,
  },
  { key: 'maxVolunteers', label: 'Capacity' },
  { key: 'status', label: 'Status', type: 'status' },
];

const fields = [
  { name: 'title', label: 'Title', required: true, fullWidth: true },
  { name: 'description', label: 'Description', type: 'textarea', required: true, fullWidth: true, rows: 4 },
  { name: 'location.venue', label: 'Venue' },
  { name: 'location.address', label: 'Address', fullWidth: true },
  { name: 'location.city', label: 'City' },
  { name: 'location.state', label: 'State' },
  { name: 'location.country', label: 'Country' },
  { name: 'startDate', label: 'Start Date & Time', type: 'datetime-local', required: true },
  { name: 'endDate', label: 'End Date & Time', type: 'datetime-local', required: true },
  { name: 'registrationDeadline', label: 'Registration Deadline', type: 'datetime-local' },
  { name: 'maxVolunteers', label: 'Max Volunteers', type: 'number', min: 1 },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'draft', label: 'Draft' },
      { value: 'upcoming', label: 'Upcoming' },
      { value: 'ongoing', label: 'Ongoing' },
      { value: 'completed', label: 'Completed' },
      { value: 'cancelled', label: 'Cancelled' },
    ],
  },
  {
    name: 'requiredSkills',
    label: 'Required Skills',
    placeholder: 'First Aid, Logistics',
    hint: 'Comma-separated list',
    fullWidth: true,
  },
  { name: 'coverImage', label: 'Cover Image URL', fullWidth: true },
  {
    name: 'isPublic',
    label: 'Public Event',
    type: 'checkbox',
    checkboxLabel: 'Visible to all users',
    fullWidth: true,
  },
];

const initialFormData = {
  title: '',
  description: '',
  location: { venue: '', address: '', city: '', state: '', country: '' },
  startDate: '',
  endDate: '',
  registrationDeadline: '',
  maxVolunteers: '',
  status: 'draft',
  requiredSkills: '',
  coverImage: '',
  isPublic: true,
};

const mapItemToForm = (item) => ({
  title: item.title || '',
  description: item.description || '',
  location: {
    venue: item.location?.venue || '',
    address: item.location?.address || '',
    city: item.location?.city || '',
    state: item.location?.state || '',
    country: item.location?.country || '',
  },
  startDate: toInputDateTime(item.startDate),
  endDate: toInputDateTime(item.endDate),
  registrationDeadline: toInputDateTime(item.registrationDeadline),
  maxVolunteers: item.maxVolunteers || '',
  status: item.status || 'draft',
  requiredSkills: arrayToCsv(item.requiredSkills),
  coverImage: item.coverImage || '',
  isPublic: item.isPublic !== false,
});

const mapFormToPayload = (formData) => ({
  ...formData,
  maxVolunteers: formData.maxVolunteers ? Number(formData.maxVolunteers) : undefined,
});

const EventsPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === ROLES.ADMIN;

  return (
    <CrudModule
      title="Event Management"
      description={
        isAdmin
          ? 'Create and manage NGO events and volunteer drives.'
          : 'View upcoming NGO events.'
      }
      entityLabel="Event"
      columns={columns}
      fields={fields}
      service={eventService}
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
            { value: 'upcoming', label: 'Upcoming' },
            { value: 'ongoing', label: 'Ongoing' },
            { value: 'completed', label: 'Completed' },
            { value: 'cancelled', label: 'Cancelled' },
          ],
        },
      ]}
    />
  );
};

export default EventsPage;
