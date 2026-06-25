import { useCallback, useEffect, useState } from 'react';
import { Heart, Target, Receipt, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <div className="card flex items-center gap-4">
    <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-0.5 text-2xl font-bold">{value}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  </div>
);

const DonorDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [donationsRes, campaignsRes] = await Promise.all([
        api.get('/donor/donations'),
        api.get('/campaigns', { params: { status: 'active', limit: 5 } }),
      ]);
      setData({
        donations: donationsRes.data.donations || [],
        donor: donationsRes.data.donor || null,
        campaigns: campaignsRes.data.campaigns || [],
      });
    } catch (err) {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <LoadingSpinner />;

  const donations = data?.donations || [];
  const donor = data?.donor;
  const campaigns = data?.campaigns || [];

  // Build monthly chart data (last 6 months of donations)
  const monthMap = {};
  donations.forEach((d) => {
    if (d.status !== 'completed') return;
    const key = new Date(d.donatedAt).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    monthMap[key] = (monthMap[key] || 0) + d.amount;
  });
  const chartData = Object.entries(monthMap)
    .slice(-6)
    .map(([month, amount]) => ({ month, amount }));

  const totalDonated = donor?.totalDonated || donations.filter(d => d.status === 'completed').reduce((s, d) => s + d.amount, 0);
  const donationCount = donor?.donationCount || donations.filter(d => d.status === 'completed').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Donor Dashboard</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Your giving history, active campaigns, and impact overview
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
          icon={Heart}
          label="Total Donated"
          value={`$${totalDonated.toLocaleString()}`}
          color="bg-primary-600"
        />
        <StatCard
          icon={Receipt}
          label="Donations Made"
          value={donationCount}
          color="bg-emerald-600"
        />
        <StatCard
          icon={Target}
          label="Active Campaigns"
          value={campaigns.length}
          color="bg-violet-600"
        />
      </div>

      {/* Donation chart */}
      {chartData.length > 0 && (
        <div className="card">
          <h3 className="mb-4 font-semibold">My Giving History</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(v) => [`$${v.toLocaleString()}`, 'Donated']}
                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="amount" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent donations */}
      <div className="card">
        <h3 className="mb-4 font-semibold">Recent Donations</h3>
        {donations.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No donations yet. Support an active campaign!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">Campaign</th>
                  <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">Amount</th>
                  <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">Date</th>
                  <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {donations.slice(0, 5).map((d) => (
                  <tr key={d._id}>
                    <td className="py-3">{d.campaign?.title || '—'}</td>
                    <td className="py-3 font-medium">${d.amount.toLocaleString()}</td>
                    <td className="py-3 text-gray-500">
                      {d.donatedAt ? new Date(d.donatedAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                        d.status === 'completed'
                          ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400'
                          : d.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
                      }`}>
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Active campaigns */}
      {campaigns.length > 0 && (
        <div className="card">
          <h3 className="mb-4 font-semibold">Active Campaigns You Can Support</h3>
          <div className="space-y-4">
            {campaigns.map((c) => {
              const progress = c.goalAmount ? Math.min(Math.round((c.raisedAmount / c.goalAmount) * 100), 100) : 0;
              return (
                <div key={c._id} className="rounded-lg border border-gray-100 p-4 dark:border-gray-800">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <p className="font-medium">{c.title}</p>
                    <span className="text-sm font-semibold text-primary-600">{progress}%</span>
                  </div>
                  <div className="mb-1 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className="h-full rounded-full bg-primary-500 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    ${c.raisedAmount?.toLocaleString()} raised of ${c.goalAmount?.toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorDashboard;
