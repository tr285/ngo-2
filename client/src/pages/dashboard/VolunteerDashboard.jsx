import { useCallback, useEffect, useState } from 'react';
import { Calendar, Clock, CheckSquare, TrendingUp } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="card flex items-center gap-4">
    <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-0.5 text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const VolunteerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [eventsRes, volunteerRes] = await Promise.all([
        api.get('/events', { params: { status: 'upcoming', limit: 5 } }),
        api.get('/volunteer/me').catch(() => ({ data: { volunteer: null } })),
      ]);
      setData({
        events: eventsRes.data.events || [],
        volunteer: volunteerRes.data.volunteer,
      });
    } catch (err) {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <LoadingSpinner />;

  const volunteer = data?.volunteer;
  const events = data?.events || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Volunteer Dashboard</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Track your contributions, upcoming events, and volunteer hours
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          icon={Clock}
          label="Total Hours"
          value={volunteer?.totalHours ?? 0}
          color="bg-primary-600"
        />
        <StatCard
          icon={Calendar}
          label="Upcoming Events"
          value={events.length}
          color="bg-emerald-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Status"
          value={volunteer?.status ? volunteer.status.charAt(0).toUpperCase() + volunteer.status.slice(1) : 'Pending'}
          color="bg-violet-600"
        />
      </div>

      {/* Upcoming Events */}
      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">Upcoming Events</h3>
          <Calendar size={18} className="text-gray-400" />
        </div>
        {events.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No upcoming events at this time.</p>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event._id}
                className="flex items-start gap-4 rounded-lg border border-gray-100 p-3 dark:border-gray-800"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-950">
                  <Calendar size={18} className="text-primary-600 dark:text-primary-400" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium">{event.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(event.startDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                  {event.location?.venue && (
                    <p className="text-xs text-gray-400">{event.location.venue}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile summary */}
      {volunteer && (
        <div className="card">
          <h3 className="mb-4 font-semibold">My Volunteer Profile</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {volunteer.skills?.length > 0 && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Skills</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {volunteer.skills.map((s) => (
                    <span key={s} className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-950 dark:text-primary-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {volunteer.availability && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Availability</p>
                <p className="mt-1 text-sm">{volunteer.availability}</p>
              </div>
            )}
            {volunteer.joinedAt && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Joined</p>
                <p className="mt-1 text-sm">
                  {new Date(volunteer.joinedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerDashboard;
