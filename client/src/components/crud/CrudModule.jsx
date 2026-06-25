import { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, Download, FileDown } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import Modal from './Modal';
import ConfirmDialog from './ConfirmDialog';
import EntityForm from './EntityForm';
import StatusBadge from './StatusBadge';
import useDebounce from '../../hooks/useDebounce';
import { getNestedValue } from '../../utils/formatters';
import { downloadCsv } from '../../utils/exportCsv';
import { downloadTablePdf } from '../../utils/exportPdf';

const PAGE_SIZE_OPTIONS = [10, 25, 50];

const CrudModule = ({
  title,
  description,
  entityLabel,
  columns,
  fields,
  service,
  filters = [],
  initialFormData = {},
  mapItemToForm,
  mapFormToPayload,
  readOnly = false,
  exportFilename,
}) => {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [exporting, setExporting] = useState('');

  const debouncedSearch = useDebounce(search);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const getCellText = (column, item) => {
    if (column.exportValue) return column.exportValue(item);

    const value = getNestedValue(item, column.key);

    if (column.type === 'status') return value || '';
    if (column.type === 'date') {
      return value ? new Date(value).toLocaleDateString() : '';
    }
    if (column.type === 'datetime') {
      return value ? new Date(value).toLocaleString() : '';
    }
    if (column.type === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(value || 0);
    }

    if (Array.isArray(value)) return value.join(', ');
    return value ?? '';
  };

  const exportColumns = columns.map((column) => ({
    label: column.label,
    getValue: (item) => getCellText(column, item),
  }));

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const params = {
        page,
        limit: pageSize,
        search: debouncedSearch || undefined,
        ...filterValues,
      };
      const result = await service.getAll(params);
      setItems(result.items);
      setPagination(result.pagination);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to load ${entityLabel.toLowerCase()}s.`);
    } finally {
      setLoading(false);
    }
  }, [service, page, pageSize, debouncedSearch, filterValues, entityLabel]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const fetchExportRows = async () => {
    const params = {
      page: 1,
      limit: 100,
      search: debouncedSearch || undefined,
      ...filterValues,
    };
    const result = await service.getAll(params);
    return result.items;
  };

  const handleExportCsv = async () => {
    setExporting('csv');
    setError('');

    try {
      const rows = await fetchExportRows();
      downloadCsv(
        rows,
        exportColumns,
        exportFilename || `${entityLabel.toLowerCase()}s-${Date.now()}.csv`
      );
    } catch (err) {
      setError(err.response?.data?.message || 'CSV export failed.');
    } finally {
      setExporting('');
    }
  };

  const handleExportPdf = async () => {
    setExporting('pdf');
    setError('');

    try {
      const rows = await fetchExportRows();
      downloadTablePdf({
        title: `${title} Export`,
        subtitle: `Generated on ${new Date().toLocaleString()}`,
        columns: exportColumns,
        rows,
        filename: exportFilename || `${entityLabel.toLowerCase()}s`,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'PDF export failed.');
    } finally {
      setExporting('');
    }
  };

  const openCreate = () => {
    setEditingItem(null);
    setFormData(initialFormData);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormData(mapItemToForm ? mapItemToForm(item) : item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setFormData(initialFormData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = mapFormToPayload ? mapFormToPayload(formData) : formData;

      if (editingItem) {
        await service.update(editingItem._id, payload);
      } else {
        await service.create(payload);
      }

      closeModal();
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      await service.remove(deleteTarget._id);
      setDeleteTarget(null);
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed.');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const renderCell = (column, item) => {
    if (column.render) return column.render(item);
    const value = getNestedValue(item, column.key);
    if (column.type === 'status') return <StatusBadge status={value} />;
    if (column.type === 'date') {
      return value ? new Date(value).toLocaleDateString() : '—';
    }
    if (column.type === 'datetime') {
      return value ? new Date(value).toLocaleString() : '—';
    }
    if (column.type === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(value || 0);
    }
    return value ?? '—';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
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
          {!readOnly && (
            <button type="button" onClick={openCreate} className="btn-primary gap-2">
              <Plus size={16} />
              Add {entityLabel}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row">
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
            placeholder={`Search ${entityLabel.toLowerCase()}s...`}
            className="input pl-9"
          />
        </div>
        {filters.map((filter) => (
          <select
            key={filter.name}
            value={filterValues[filter.name] || ''}
            onChange={(e) => {
              setFilterValues((prev) => ({
                ...prev,
                [filter.name]: e.target.value || undefined,
              }));
              setPage(1);
            }}
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
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(1);
          }}
          className="input sm:w-32"
          aria-label="Rows per page"
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
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
        ) : items.length === 0 ? (
          <p className="p-6 text-sm text-gray-500 dark:text-gray-400">
            No {entityLabel.toLowerCase()}s found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="whitespace-nowrap px-6 py-3 font-medium text-gray-500 dark:text-gray-400"
                    >
                      {col.label}
                    </th>
                  ))}
                  {!readOnly && (
                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {items.map((item) => (
                  <tr
                    key={item._id}
                    className="transition hover:bg-gray-50 dark:hover:bg-gray-900/50"
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="whitespace-nowrap px-6 py-3.5">
                        {renderCell(col, item)}
                      </td>
                    ))}
                    {!readOnly && (
                      <td className="whitespace-nowrap px-6 py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(item)}
                            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-primary-600 dark:hover:bg-gray-800"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(item)}
                            className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
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
        <Modal
          title={editingItem ? `Edit ${entityLabel}` : `Add ${entityLabel}`}
          onClose={closeModal}
          wide
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <EntityForm
              fields={fields}
              formData={formData}
              onChange={setFormData}
              isEdit={Boolean(editingItem)}
            />
            <div className="flex justify-end gap-3">
              <button type="button" onClick={closeModal} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="btn-primary">
                {submitting ? 'Saving...' : editingItem ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title={`Delete ${entityLabel}`}
          message={`Are you sure you want to delete this ${entityLabel.toLowerCase()}? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
};

export default CrudModule;
