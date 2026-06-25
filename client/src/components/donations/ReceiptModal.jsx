import Modal from '../crud/Modal';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { Printer } from 'lucide-react';

const ReceiptModal = ({ receipt, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal title="Donation Receipt" onClose={onClose} wide>
      <div id="donation-receipt" className="space-y-6">
        <div className="rounded-lg border border-dashed border-gray-200 p-6 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Official Receipt
              </p>
              <p className="mt-1 text-lg font-bold">{receipt.receiptNumber}</p>
            </div>
            <div className="text-right text-sm text-gray-500 dark:text-gray-400">
              <p>Issued on</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {formatDateTime(receipt.issuedAt)}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Donor</p>
              <p className="font-medium">{receipt.donor}</p>
              {receipt.donorEmail && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {receipt.donorEmail}
                </p>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Campaign</p>
              <p className="font-medium">{receipt.campaign}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(receipt.amount, receipt.currency)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Payment</p>
              <p className="font-medium capitalize">
                {receipt.paymentGateway} · {receipt.paymentMethod?.replace(/_/g, ' ')}
              </p>
              {receipt.transactionId && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  TXN: {receipt.transactionId}
                </p>
              )}
            </div>
          </div>

          {receipt.notes && (
            <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">Notes</p>
              <p className="text-sm">{receipt.notes}</p>
            </div>
          )}

          <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
            Thank you for your generous contribution. This receipt confirms your donation
            to our NGO.
          </p>
        </div>

        <div className="flex justify-end gap-3 print:hidden">
          <button type="button" onClick={onClose} className="btn-secondary">
            Close
          </button>
          <button type="button" onClick={handlePrint} className="btn-primary gap-2">
            <Printer size={16} />
            Print Receipt
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ReceiptModal;
