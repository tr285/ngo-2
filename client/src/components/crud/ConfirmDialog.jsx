import Modal from './Modal';

const ConfirmDialog = ({ title, message, onConfirm, onCancel, loading }) => (
  <Modal title={title} onClose={onCancel}>
    <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>
    <div className="mt-6 flex justify-end gap-3">
      <button type="button" onClick={onCancel} className="btn-secondary">
        Cancel
      </button>
      <button
        type="button"
        onClick={onConfirm}
        disabled={loading}
        className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
      >
        {loading ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  </Modal>
);

export default ConfirmDialog;
