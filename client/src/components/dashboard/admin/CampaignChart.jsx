import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
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

const CampaignChart = ({ data, isDark }) => {
  const gridColor = isDark ? '#374151' : '#e5e7eb';
  const axisColor = isDark ? '#9ca3af' : '#6b7280';

  return (
    <div className="card">
      <div className="mb-6">
        <h3 className="font-semibold">Campaign Performance</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Amount raised vs goal by active campaign
        </p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: axisColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval={0}
            angle={-20}
            textAnchor="end"
            height={60}
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
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
            formatter={(value) => (
              <span className="text-gray-600 dark:text-gray-300">{value}</span>
            )}
          />
          <Bar
            dataKey="raised"
            name="Raised"
            fill="#2563eb"
            radius={[4, 4, 0, 0]}
            maxBarSize={32}
          />
          <Bar
            dataKey="goal"
            name="Goal"
            fill={isDark ? '#374151' : '#d1d5db'}
            radius={[4, 4, 0, 0]}
            maxBarSize={32}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CampaignChart;
