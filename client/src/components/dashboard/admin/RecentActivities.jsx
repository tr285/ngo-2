import {
  DollarSign,
  UserPlus,
  Target,
  Calendar,
  Users,
  FileText,
} from 'lucide-react';

const iconMap = {
  DollarSign,
  UserPlus,
  Target,
  Calendar,
  Users,
  FileText,
};

const typeStyles = {
  donation: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400',
  volunteer: 'bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400',
  campaign: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
  event: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400',
  user: 'bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400',
  report: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

const RecentActivities = ({ activities }) => (
  <div className="card">
    <div className="mb-4">
      <h3 className="font-semibold">Recent Activity</h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Latest updates across the platform
      </p>
    </div>
    <ul className="space-y-4">
      {activities.map((activity) => {
        const Icon = iconMap[activity.icon] || FileText;
        const style = typeStyles[activity.type] || typeStyles.report;

        return (
          <li key={activity.id} className="flex gap-3">
            <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${style}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-700 dark:text-gray-200">
                {activity.message}
              </p>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                {activity.time}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  </div>
);

export default RecentActivities;
