import { useState, useEffect, useRef } from 'react';
import {
  User,
  Building2,
  Lock,
  Camera,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Heart,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { settingsService } from '../../services/settingsService';
import { ROLES } from '../../constants/roles';

const TABS = [
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'ngo', label: 'NGO Profile', icon: Building2, adminOnly: true },
  { id: 'password', label: 'Change Password', icon: Lock },
];

const Alert = ({ type, message }) => {
  if (!message) return null;
  const isError = type === 'error';
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${
        isError
          ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400'
          : 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/50 dark:text-green-400'
      }`}
    >
      {isError ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
      {message}
    </div>
  );
};

/* ─── Profile Tab ─────────────────────────────────────────── */
const ProfileTab = ({ user, onUserUpdate }) => {
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef();

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (avatarFile) fd.append('avatar', avatarFile);
      const updated = await settingsService.updateProfile(fd);
      onUserUpdate(updated);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Alert type="error" message={error} />
      <Alert type="success" message={success} />

      {/* Avatar */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="h-20 w-20 overflow-hidden rounded-full bg-primary-100 dark:bg-primary-900">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <User size={32} className="text-primary-500" />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-white shadow hover:bg-primary-700"
          >
            <Camera size={13} />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
        <div>
          <p className="font-semibold">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-sm capitalize text-gray-500 dark:text-gray-400">{user?.role}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
        </div>
      </div>

      {/* Fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium">First Name</label>
          <input name="firstName" value={form.firstName} onChange={handleChange} className="input" required />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Last Name</label>
          <input name="lastName" value={form.lastName} onChange={handleChange} className="input" required />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium">Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} className="input" placeholder="+91 98765 43210" />
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={saving} className="btn-primary gap-2">
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

/* ─── NGO Profile Tab ─────────────────────────────────────── */
const NgoTab = () => {
  const [ngo, setNgo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    settingsService.getNgoProfile()
      .then(setNgo)
      .catch(() => setError('Failed to load NGO profile.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-gray-500">Loading NGO profile…</p>;
  if (error) return <Alert type="error" message={error} />;

  const fields = [
    { label: 'Organization Name', value: ngo?.name },
    { label: 'Tagline', value: ngo?.tagline },
    { label: 'Contact Email', value: ngo?.email },
    { label: 'Phone', value: ngo?.phone },
    { label: 'Website', value: ngo?.website },
    { label: 'Address', value: ngo?.address },
    { label: 'Registration Number', value: ngo?.registrationNumber },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20">
          <Heart size={28} />
        </div>
        <div>
          <h3 className="text-lg font-bold">{ngo?.name}</h3>
          <p className="text-sm text-white/80">{ngo?.tagline}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map(({ label, value }) => (
          <div key={label} className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</p>
            <p className="mt-1 text-sm font-medium">{value || '—'}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-400">
        To update NGO details, set the environment variables (NGO_NAME, NGO_EMAIL, etc.) in the server <code>.env</code> file and restart the server.
      </div>
    </div>
  );
};

/* ─── Change Password Tab ─────────────────────────────────── */
const PasswordTab = () => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const toggleShow = (field) => setShow((p) => ({ ...p, [field]: !p[field] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (form.newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    setSaving(true);
    try {
      await settingsService.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSuccess('Password changed successfully!');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setSaving(false);
    }
  };

  const PasswordInput = ({ name, label, showKey }) => (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      <div className="relative">
        <input
          name={name}
          type={show[showKey] ? 'text' : 'password'}
          value={form[name]}
          onChange={handleChange}
          className="input pr-10"
          required
        />
        <button
          type="button"
          onClick={() => toggleShow(showKey)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show[showKey] ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <Alert type="error" message={error} />
      <Alert type="success" message={success} />
      <PasswordInput name="currentPassword" label="Current Password" showKey="current" />
      <PasswordInput name="newPassword" label="New Password" showKey="new" />
      <PasswordInput name="confirmPassword" label="Confirm New Password" showKey="confirm" />
      <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
        Password must be at least 8 characters long.
      </div>
      <div className="flex justify-end">
        <button type="submit" disabled={saving} className="btn-primary gap-2">
          <Lock size={16} />
          {saving ? 'Changing...' : 'Change Password'}
        </button>
      </div>
    </form>
  );
};

/* ─── Main SettingsPage ───────────────────────────────────── */
const SettingsPage = () => {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const visibleTabs = TABS.filter((t) => !t.adminOnly || user?.role === ROLES.ADMIN);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account and organization preferences</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1 dark:border-gray-800 dark:bg-gray-900">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-white text-primary-700 shadow dark:bg-gray-800 dark:text-primary-300'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
              }`}
            >
              <Icon size={15} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="card">
        {activeTab === 'profile' && (
          <ProfileTab user={user} onUserUpdate={(u) => setUser(u)} />
        )}
        {activeTab === 'ngo' && <NgoTab />}
        {activeTab === 'password' && <PasswordTab />}
      </div>
    </div>
  );
};

export default SettingsPage;
