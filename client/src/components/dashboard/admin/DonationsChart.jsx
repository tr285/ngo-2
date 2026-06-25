import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ChartTooltip from './ChartTooltip';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);

const DonationsChart = ({ data, isDark }) => {
  const gridColor = isDark ? '#374151' : '#e5e7eb';
  const axisColor = isDark ? '#9ca3af' : '#6b7280';

  return (
    <div className="card">
      <div className="mb-6">
        <h3 className="font-semibold">Donation Trends</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Monthly donation volume over the past year
        </p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="donationGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: axisColor, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: axisColor, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            width={48}
          />
          <Tooltip
            content={
              <ChartTooltip
                formatter={(value) => formatCurrency(value)}
              />
            }
          />
          <Area
            type="monotone"
            dataKey="amount"
            name="Donations"
            stroke="#2563eb"
            strokeWidth={2}
            fill="url(#donationGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DonationsChart;
