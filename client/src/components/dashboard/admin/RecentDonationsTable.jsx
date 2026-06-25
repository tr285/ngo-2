const statusStyles = {
  Completed:
    'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
  Pending:
    'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
  Failed: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400',
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);

const RecentDonationsTable = ({ donations }) => (
  <div className="card overflow-hidden p-0">
    <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
      <h3 className="font-semibold">Recent Donations</h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Latest contributions across all campaigns
      </p>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
            <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">
              Donor
            </th>
            <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">
              Campaign
            </th>
            <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">
              Amount
            </th>
            <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">
              Date
            </th>
            <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
          {donations.map((donation) => (
            <tr
              key={donation.id || donation._id}
              className="transition hover:bg-gray-50 dark:hover:bg-gray-900/50"
            >
              <td className="whitespace-nowrap px-6 py-3.5 font-medium">
                {donation.donor}
              </td>
              <td className="whitespace-nowrap px-6 py-3.5 text-gray-600 dark:text-gray-300">
                {donation.campaign}
              </td>
              <td className="whitespace-nowrap px-6 py-3.5 font-medium">
                {formatCurrency(donation.amount)}
              </td>
              <td className="whitespace-nowrap px-6 py-3.5 text-gray-600 dark:text-gray-300">
                {donation.date}
              </td>
              <td className="whitespace-nowrap px-6 py-3.5">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    statusStyles[donation.status] || statusStyles.Pending
                  }`}
                >
                  {donation.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default RecentDonationsTable;
