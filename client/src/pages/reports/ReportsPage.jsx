import { useCallback, useEffect, useState } from 'react';
import { Plus, Search, Download, FileDown, Trash2 } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/crud/Modal';
import ConfirmDialog from '../../components/crud/ConfirmDialog';
import StatusBadge from '../../components/crud/StatusBadge';
import useDebounce from '../../hooks/useDebounce';
import { reportService } from '../../services/reportService';
import { downloadBlob } from '../../utils/exportCsv';
import { formatDate } from '../../utils/formatters';

const REPORT_TYPES = [
  { value: 'donation', label: 'Donations' },
  { value: 'volunteer', label: 'Volunteers' },
  { value: 'campaign', label: 'Campaigns' },
  { value: 'beneficiary', label: 'Beneficiaries' },
  { value: 'event', label: 'Events' },
  { value: 'financial', label: 'Financial Summary' },
];

const FORMAT_OPTIONS = [
  { value: 'json', label: 'JSON' },
  { value: 'csv', label: 'CSV' },
  { value: 'pdf', label: 'PDF' },
];

const defaultForm = {
  title: '',
  reportType: 'donation',
  description: '',
  startDate: '',
  endDate: '',
  format: 'csv',
};

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [downloadingId, setDownloadingId] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const debouncedSearch = useDebounce(search);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const result = await reportService.getAll({
        page,
        limit: pageSize,
        search: debouncedSearch || undefined,
        reportType: typeFilter || undefined,
      });
      setReports(result.items);
      setPagination(result.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reports.');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, typeFilter]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleGenerate = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await reportService.generate(formData);
      setModalOpen(false);
      setFormData(defaultForm);
      fetchReports();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate report.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = async (reportId) => {
    setDownloadingId(reportId);
    setError('');

    try {
      const { blob, filename } = await reportService.download(reportId);
      downloadBlob(blob, filename);
    } catch (err) {
      setError(err.response?.data?.message || 'Download failed.');
    } finally {
      setDownloadingId('');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      await reportService.remove(deleteTarget._id);
      setDeleteTarget(null);
      fetchReports();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed.');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reports</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Generate, export, and manage NGO reports
          </p>
        </div>
        <button type="button" onClick={() => setModalOpen(true)} className="btn-primary gap-2">
          <Plus size={16} />
          Generate Report
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search reports..."
            className="input pl-9"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPage(1);
          }}
          className="input sm:w-48"
        >
          <option value="">All Types</option>
          {REPORT_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(1);
          }}
          className="input sm:w-32"
        >
          {[10, 25, 50].map((size) => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="card overflow-hidden p-0">
        {loading ? (
          <LoadingSpinner />
        ) : reports.length === 0 ? (
          <p className="p-6 text-sm text-gray-500 dark:text-gray-400">
            No reports found. Generate your first report to get started.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Title</th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Type</th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Period</th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Format</th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Records</th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Generated</th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {reports.map((report) => (
                  <tr key={report._id} className="transition hover:bg-gray-50 dark:hover:bg-gray-900/50">
                    <td className="px-6 py-3.5 font-medium">{report.title}</td>
                    <td className="px-6 py-3.5 capitalize">{report.reportType}</td>
                    <td className="whitespace-nowrap px-6 py-3.5 text-gray-600 dark:text-gray-300">
                      {formatDate(report.period?.startDate)} – {formatDate(report.period?.endDate)}
                    </td>
                    <td className="px-6 py-3.5 uppercase">{report.format}</td>
                    <td className="px-6 py-3.5">{report.summary?.totalRecords ?? 0}</td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={report.status} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-3.5 text-gray-600 dark:text-gray-300">
                      {formatDate(report.generatedAt || report.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleDownload(report._id)}
                          disabled={downloadingId === report._id}
                          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-950/30"
                        >
                          <Download size={14} />
                          {downloadingId === report._id ? '...' : 'Download'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(report)}
                          className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && pagination.total > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-6 py-3 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Page {pagination.page} of {pagination.pages} ({pagination.total} total)
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="btn-secondary disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= pagination.pages}
                onClick={() => setPage((p) => p + 1)}
                className="btn-secondary disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {modalOpen && (
        <Modal title="Generate Report" onClose={() => setModalOpen(false)} wide>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium">Title *</label>
                <input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input"
                  placeholder="Monthly Donation Report"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Report Type *</label>
                <select
                  required
                  value={formData.reportType}
                  onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
                  className="input"
                >
                  {REPORT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Export Format *</label>
                <select
                  required
                  value={formData.format}
                  onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                  className="input"
                >
                  {FORMAT_OPTIONS.map((format) => (
                    <option key={format.value} value={format.value}>
                      {format.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Start Date *</label>
                <input
                  required
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">End Date *</label>
                <input
                  required
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="input"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input resize-none"
                  rows={2}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="btn-primary gap-2">
                <FileDown size={16} />
                {submitting ? 'Generating...' : 'Generate Report'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Report"
          message="Are you sure you want to delete this report? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
};

export default ReportsPage;
