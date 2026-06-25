import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import ChartTooltip from './ChartTooltip';

const UserDistributionChart = ({ data }) => (
  <div className="card">
    <div className="mb-4">
      <h3 className="font-semibold">User Distribution</h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Breakdown by user type
      </p>
    </div>
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          dataKey="value"
          nameKey="name"
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          content={
            <ChartTooltip formatter={(value, name) => `${name}: ${value}`} />
          }
        />
      </PieChart>
    </ResponsiveContainer>
    <div className="mt-2 flex flex-wrap justify-center gap-4">
      {data.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {entry.name}
            <span className="ml-1 font-medium text-gray-900 dark:text-gray-100">
              ({entry.value})
            </span>
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default UserDistributionChart;
