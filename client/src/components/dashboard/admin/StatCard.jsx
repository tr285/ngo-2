import {
  Users,
  Target,
  DollarSign,
  UserPlus,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

const iconMap = {
  Users,
  Target,
  DollarSign,
  UserPlus,
};

const colorMap = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/50',
    icon: 'text-blue-600 dark:text-blue-400',
  },
  violet: {
    bg: 'bg-violet-50 dark:bg-violet-950/50',
    icon: 'text-violet-600 dark:text-violet-400',
  },
  green: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    icon: 'text-emerald-600 dark:text-emerald-400',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-950/50',
    icon: 'text-amber-600 dark:text-amber-400',
  },
};

const StatCard = ({ label, value, change, changeLabel, trend, icon, color }) => {
  const Icon = iconMap[icon] || Users;
  const colors = colorMap[color] || colorMap.blue;
  const isPositive = trend === 'up';

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
        </div>
        <div className={`rounded-lg p-2.5 ${colors.bg}`}>
          <Icon className={`h-5 w-5 ${colors.icon}`} />
        </div>
      </div>
      {change && (
        <div className="mt-4 flex items-center gap-1.5">
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500 dark:text-red-400" />
          )}
          <span
            className={`text-sm font-medium ${
              isPositive
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-red-500 dark:text-red-400'
            }`}
          >
            {change}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {changeLabel}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
