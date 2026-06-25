const statusColors = {
  pending: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
  approved: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
  active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
  inactive: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  rejected: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400',
  failed: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400',
  refunded: 'bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400',
  draft: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  generated: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
  published: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
  archived: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  upcoming: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
  ongoing: 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400',
  completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
  cancelled: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400',
  paused: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
  graduated: 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400',
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
      statusColors[status] || statusColors.inactive
    }`}
  >
    {status?.replace(/_/g, ' ')}
  </span>
);

export default StatusBadge;
