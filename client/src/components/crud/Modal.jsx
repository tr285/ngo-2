import { X } from 'lucide-react';

const Modal = ({ title, children, onClose, wide = false }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div
      className="absolute inset-0 bg-black/50"
      onClick={onClose}
      aria-hidden="true"
    />
    <div
      className={`relative max-h-[90vh] w-full overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900 ${
        wide ? 'max-w-3xl' : 'max-w-lg'
      }`}
    >
      <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X size={18} />
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

export default Modal;
