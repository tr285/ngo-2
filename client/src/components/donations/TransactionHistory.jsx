import { Search, Download, FileDown, FileText } from 'lucide-react';
import StatusBadge from '../crud/StatusBadge';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { downloadCsv } from '../../utils/exportCsv';
import { downloadTablePdf } from '../../utils/exportPdf';

const gatewayLabels = {
  razorpay: 'Razorpay',
  stripe: 'Stripe',
  manual: 'Manual',
};

const getDonorName = (donation) =>
  donation.isAnonymous
    ? 'Anonymous'
    : donation.donor?.user
      ? `${donation.donor.user.firstName} ${donation.donor.user.lastName}`
      : '—';

const TransactionHistory = ({
  donations,
  pagination,
  loading = false,
  search = '',
  onSearchChange,
  filters = [],
  filterValues = {},
  onFilterChange,
  pageSize = 10,
  onPageSizeChange,
  page = 1,
  onPageChange,
  onViewReceipt,
  showDonor = false,
  emptyMessage = 'No transactions found.',
  onExportCsv,
  onExportPdf,
  exporting = '',
}) => {
  const exportColumns = [
    {
      label: 'Date',
      getValue: (donation) => formatDateTime(donation.donatedAt || donation.createdAt),
    },
    ...(showDonor
      ? [{ label: 'Donor', getValue: (donation) => getDonorName(donation) }]
      : []),
    { label: 'Campaign', getValue: (donation) => donation.campaign?.title || '—' },
    {
      label: 'Amount',
      getValue: (donation) => formatCurrency(donation.amount, donation.currency),
    },
    {
      label: 'Gateway',
      getValue: (donation) =>
        gatewayLabels[donation.paymentGateway] || donation.paymentGateway,
    },
    { label: 'Status', getValue: (donation) => donation.status },
  ];

  const handleExportCsv = () => {
    if (onExportCsv) {
      onExportCsv();
      return;
    }
    downloadCsv(donations, exportColumns, `donations-${Date.now()}.csv`);
  };

  const handleExportPdf = () => {
    if (onExportPdf) {
      onExportPdf();
      return;
    }
    downloadTablePdf({
      title: 'Donation Transactions',
      subtitle: `Generated on ${new Date().toLocaleString()}`,
      columns: exportColumns,
      rows: donations,
    });
  };

  return (
    <div className="card overflow-hidden p-0">
      <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold">Transaction History</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              All donation transactions and payment records
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={Boolean(exporting)}
              className="btn-secondary gap-2"
            >
              <Download size={16} />
              {exporting === 'csv' ? 'Exporting...' : 'CSV'}
            </button>
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={Boolean(exporting)}
              className="btn-secondary gap-2"
            >
              <FileDown size={16} />
              {exporting === 'pdf' ? 'Exporting...' : 'PDF'}
            </button>
          </div>
        </div>

        {(onSearchChange || filters.length > 0 || onPageSizeChange) && (
          <div className="mt-4 flex flex-col gap-3 lg:flex-row">
            {onSearchChange && (
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search transactions..."
                  className="input pl-9"
                />
              </div>
            )}
            {filters.map((filter) => (
              <select
                key={filter.name}
                value={filterValues[filter.name] || ''}
                onChange={(e) => onFilterChange(filter.name, e.target.value || undefined)}
                className="input sm:w-44"
              >
                <option value="">{filter.label}</option>
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ))}
            {onPageSizeChange && (
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="input sm:w-32"
              >
                {[10, 25, 50].map((size) => (
                  <option key={size} value={size}>
                    {size} / page
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <p className="p-6 text-sm text-gray-500 dark:text-gray-400">Loading transactions...</p>
      ) : donations.length === 0 ? (
        <p className="p-6 text-sm text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
                <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Date</th>
                {showDonor && (
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Donor</th>
                )}
                <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Campaign</th>
                <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Amount</th>
                <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Gateway</th>
                <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {donations.map((donation) => (
                <tr
                  key={donation._id}
                  className="transition hover:bg-gray-50 dark:hover:bg-gray-900/50"
                >
                  <td className="whitespace-nowrap px-6 py-3.5 text-gray-600 dark:text-gray-300">
                    {formatDateTime(donation.donatedAt || donation.createdAt)}
                  </td>
                  {showDonor && (
                    <td className="whitespace-nowrap px-6 py-3.5 font-medium">
                      {getDonorName(donation)}
                    </td>
                  )}
                  <td className="whitespace-nowrap px-6 py-3.5">
                    {donation.campaign?.title || '—'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3.5 font-medium">
                    {formatCurrency(donation.amount, donation.currency)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3.5 capitalize text-gray-600 dark:text-gray-300">
                    {gatewayLabels[donation.paymentGateway] || donation.paymentGateway}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3.5">
                    <StatusBadge status={donation.status} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-3.5">
                    {donation.status === 'completed' ? (
                      <button
                        type="button"
                        onClick={() => onViewReceipt(donation._id)}
                        className="inline-flex items-center gap-1 text-primary-600 hover:underline dark:text-primary-400"
                      >
                        <FileText size={14} />
                        View
                      </button>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination && pagination.total > 0 && onPageChange && (
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-3 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Page {pagination.page} of {pagination.pages} ({pagination.total} total)
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="btn-secondary disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= pagination.pages}
              onClick={() => onPageChange(page + 1)}
              className="btn-secondary disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
