import { useCallback, useEffect, useState } from 'react';
import { DollarSign, TrendingUp, Receipt, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/crud/Modal';
import CampaignProgress from '../../components/donations/CampaignProgress';
import PaymentGatewayButtons from '../../components/donations/PaymentGatewayButtons';
import TransactionHistory from '../../components/donations/TransactionHistory';
import ReceiptModal from '../../components/donations/ReceiptModal';
import useDebounce from '../../hooks/useDebounce';
import { donationService } from '../../services/donationService';
import { campaignService, donorService } from '../../services/entityServices';
import { formatCurrency } from '../../utils/formatters';
import { downloadCsv } from '../../utils/exportCsv';
import { downloadTablePdf } from '../../utils/exportPdf';

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="card">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="mt-2 text-2xl font-bold">{value}</p>
      </div>
      <div className={`rounded-lg p-2.5 ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </div>
);

const DonationsPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === ROLES.ADMIN;
  const isDonor = user?.role === ROLES.DONOR;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [history, setHistory] = useState({ donations: [], summary: {} });
  const [transactions, setTransactions] = useState([]);
  const [transactionPagination, setTransactionPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionSearch, setTransactionSearch] = useState('');
  const [transactionFilters, setTransactionFilters] = useState({});
  const [transactionPage, setTransactionPage] = useState(1);
  const [transactionPageSize, setTransactionPageSize] = useState(10);
  const [exporting, setExporting] = useState('');
  const debouncedTransactionSearch = useDebounce(transactionSearch);
  const [campaigns, setCampaigns] = useState([]);
  const [activeCampaigns, setActiveCampaigns] = useState([]);

  const [checkoutAmount, setCheckoutAmount] = useState('');
  const [checkoutCampaign, setCheckoutCampaign] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState('');

  const [receipt, setReceipt] = useState(null);
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [donors, setDonors] = useState([]);
  const [manualForm, setManualForm] = useState({
    donor: '',
    campaign: '',
    amount: '',
    paymentMethod: 'cash',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchTransactions = useCallback(async () => {
    setTransactionsLoading(true);

    try {
      const params = {
        page: transactionPage,
        limit: transactionPageSize,
        search: debouncedTransactionSearch || undefined,
        ...transactionFilters,
      };
      const result = await donationService.getAll(params);
      setTransactions(result.items);
      setTransactionPagination(result.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load transactions.');
    } finally {
      setTransactionsLoading(false);
    }
  }, [
    transactionPage,
    transactionPageSize,
    debouncedTransactionSearch,
    transactionFilters,
  ]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [historyData, progressData, campaignList] = await Promise.all([
        donationService.getHistory(),
        donationService.getCampaignProgress(),
        campaignService.getAll({ status: 'active', limit: 50 }),
      ]);

      setHistory(historyData);
      setCampaigns(progressData);
      setActiveCampaigns(campaignList.items);

      if (isAdmin) {
        const donorList = await donorService.getAll({ limit: 100 });
        setDonors(donorList.items);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load donation data.');
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const fetchExportTransactions = async () => {
    const params = {
      page: 1,
      limit: 100,
      search: debouncedTransactionSearch || undefined,
      ...transactionFilters,
    };
    const result = await donationService.getAll(params);
    return result.items;
  };

  const handleExportCsv = async () => {
    setExporting('csv');
    setError('');

    try {
      const rows = await fetchExportTransactions();
      downloadCsv(
        rows,
        [
          {
            label: 'Date',
            getValue: (donation) =>
              new Date(donation.donatedAt || donation.createdAt).toLocaleString(),
          },
          ...(isAdmin
            ? [
                {
                  label: 'Donor',
                  getValue: (donation) =>
                    donation.isAnonymous
                      ? 'Anonymous'
                      : donation.donor?.user
                        ? `${donation.donor.user.firstName} ${donation.donor.user.lastName}`
                        : '—',
                },
              ]
            : []),
          { label: 'Campaign', getValue: (donation) => donation.campaign?.title || '—' },
          { label: 'Amount', getValue: (donation) => donation.amount },
          { label: 'Gateway', getValue: (donation) => donation.paymentGateway },
          { label: 'Status', getValue: (donation) => donation.status },
        ],
        `donations-${Date.now()}.csv`
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
      const rows = await fetchExportTransactions();
      downloadTablePdf({
        title: isAdmin ? 'Donation Transactions' : 'My Donations',
        subtitle: `Generated on ${new Date().toLocaleString()}`,
        columns: [
          {
            label: 'Date',
            getValue: (donation) =>
              new Date(donation.donatedAt || donation.createdAt).toLocaleString(),
          },
          ...(isAdmin
            ? [
                {
                  label: 'Donor',
                  getValue: (donation) =>
                    donation.isAnonymous
                      ? 'Anonymous'
                      : donation.donor?.user
                        ? `${donation.donor.user.firstName} ${donation.donor.user.lastName}`
                        : '—',
                },
              ]
            : []),
          { label: 'Campaign', getValue: (donation) => donation.campaign?.title || '—' },
          { label: 'Amount', getValue: (donation) => `$${donation.amount}` },
          { label: 'Status', getValue: (donation) => donation.status },
        ],
        rows,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'PDF export failed.');
    } finally {
      setExporting('');
    }
  };

  const handleViewReceipt = async (donationId) => {
    try {
      const receiptData = await donationService.getReceipt(donationId);
      setReceipt(receiptData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load receipt.');
    }
  };

  const handleGatewayPayment = async (gateway) => {
    setPaymentLoading(gateway);
    setError('');

    try {
      const { donation, gateway: gatewayData } = await donationService.initiateCheckout({
        campaignId: checkoutCampaign,
        amount: Number(checkoutAmount),
        paymentGateway: gateway,
        isAnonymous,
      });

      let completed;

      if (gateway === 'razorpay') {
        completed = await donationService.confirmRazorpay({
          donationId: donation._id,
          orderId: gatewayData.orderId,
          paymentId: `pay_placeholder_${Date.now()}`,
        });
      } else {
        completed = await donationService.confirmStripe({
          donationId: donation._id,
          paymentIntentId: gatewayData.paymentIntentId,
        });
      }

      setCheckoutAmount('');
      setCheckoutCampaign('');
      await Promise.all([fetchData(), fetchTransactions()]);

      if (completed?._id) {
        handleViewReceipt(completed._id);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed.');
    } finally {
      setPaymentLoading('');
    }
  };

  const handleManualSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await donationService.createManual({
        ...manualForm,
        amount: Number(manualForm.amount),
        status: 'completed',
      });
      setManualModalOpen(false);
      setManualForm({ donor: '', campaign: '', amount: '', paymentMethod: 'cash', notes: '' });
      await Promise.all([fetchData(), fetchTransactions()]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record donation.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const { summary } = history;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {isAdmin ? 'Donation Management' : 'My Donations'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isAdmin
              ? 'Track transactions, record donations, and monitor campaign progress.'
              : 'Make donations, view transaction history, and download receipts.'}
          </p>
        </div>
        {isAdmin && (
          <button type="button" onClick={() => setManualModalOpen(true)} className="btn-primary gap-2">
            <Plus size={16} />
            Record Donation
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Total Donated"
          value={formatCurrency(summary.totalAmount || 0)}
          icon={DollarSign}
          color="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
        />
        <StatCard
          label="Transactions"
          value={summary.totalDonations || 0}
          icon={TrendingUp}
          color="bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
        />
        <StatCard
          label="Completed Receipts"
          value={history.donations.filter((d) => d.status === 'completed').length}
          icon={Receipt}
          color="bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400"
        />
      </div>

      {summary.byGateway?.length > 0 && (
        <div className="card">
          <h3 className="font-semibold">Payments by Gateway</h3>
          <div className="mt-4 flex flex-wrap gap-4">
            {summary.byGateway.map((entry) => (
              <div
                key={entry.gateway}
                className="rounded-lg border border-gray-100 px-4 py-3 dark:border-gray-800"
              >
                <p className="text-xs capitalize text-gray-500 dark:text-gray-400">
                  {entry.gateway}
                </p>
                <p className="font-semibold">{formatCurrency(entry.total)}</p>
                <p className="text-xs text-gray-500">{entry.count} transactions</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {isDonor && (
        <div className="card space-y-4">
          <div>
            <h3 className="font-semibold">Make a Donation</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Select a campaign and pay via Razorpay or Stripe placeholder gateways
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Campaign</label>
              <select
                value={checkoutCampaign}
                onChange={(e) => setCheckoutCampaign(e.target.value)}
                className="input"
              >
                <option value="">Select campaign...</option>
                {activeCampaigns.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Amount</label>
              <input
                type="number"
                min="1"
                value={checkoutAmount}
                onChange={(e) => setCheckoutAmount(e.target.value)}
                className="input"
                placeholder="Enter amount"
              />
            </div>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary-600"
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Donate anonymously
            </span>
          </label>

          <PaymentGatewayButtons
            amount={checkoutAmount}
            campaignId={checkoutCampaign}
            loading={paymentLoading}
            onRazorpay={() => handleGatewayPayment('razorpay')}
            onStripe={() => handleGatewayPayment('stripe')}
          />
        </div>
      )}

      <CampaignProgress campaigns={campaigns} />

      <TransactionHistory
        donations={transactions}
        pagination={transactionPagination}
        loading={transactionsLoading}
        search={transactionSearch}
        onSearchChange={(value) => {
          setTransactionSearch(value);
          setTransactionPage(1);
        }}
        filters={
          isAdmin
            ? [
                {
                  name: 'status',
                  label: 'All Statuses',
                  options: [
                    { value: 'completed', label: 'Completed' },
                    { value: 'pending', label: 'Pending' },
                    { value: 'failed', label: 'Failed' },
                    { value: 'refunded', label: 'Refunded' },
                  ],
                },
                {
                  name: 'paymentGateway',
                  label: 'All Gateways',
                  options: [
                    { value: 'razorpay', label: 'Razorpay' },
                    { value: 'stripe', label: 'Stripe' },
                    { value: 'manual', label: 'Manual' },
                  ],
                },
              ]
            : [
                {
                  name: 'status',
                  label: 'All Statuses',
                  options: [
                    { value: 'completed', label: 'Completed' },
                    { value: 'pending', label: 'Pending' },
                    { value: 'failed', label: 'Failed' },
                  ],
                },
              ]
        }
        filterValues={transactionFilters}
        onFilterChange={(name, value) => {
          setTransactionFilters((prev) => ({ ...prev, [name]: value }));
          setTransactionPage(1);
        }}
        pageSize={transactionPageSize}
        onPageSizeChange={(size) => {
          setTransactionPageSize(size);
          setTransactionPage(1);
        }}
        page={transactionPage}
        onPageChange={setTransactionPage}
        onViewReceipt={handleViewReceipt}
        showDonor={isAdmin}
        onExportCsv={handleExportCsv}
        onExportPdf={handleExportPdf}
        exporting={exporting}
        emptyMessage={
          isDonor
            ? "You haven't made any donations yet."
            : 'No donation transactions recorded yet.'
        }
      />

      {receipt && (
        <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />
      )}

      {manualModalOpen && (
        <Modal title="Record Manual Donation" onClose={() => setManualModalOpen(false)} wide>
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Donor *</label>
                <select
                  required
                  value={manualForm.donor}
                  onChange={(e) => setManualForm({ ...manualForm, donor: e.target.value })}
                  className="input"
                >
                  <option value="">Select donor...</option>
                  {donors.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.user?.firstName} {d.user?.lastName} ({d.user?.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Campaign *</label>
                <select
                  required
                  value={manualForm.campaign}
                  onChange={(e) => setManualForm({ ...manualForm, campaign: e.target.value })}
                  className="input"
                >
                  <option value="">Select campaign...</option>
                  {activeCampaigns.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Amount *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={manualForm.amount}
                  onChange={(e) => setManualForm({ ...manualForm, amount: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Payment Method</label>
                <select
                  value={manualForm.paymentMethod}
                  onChange={(e) => setManualForm({ ...manualForm, paymentMethod: e.target.value })}
                  className="input"
                >
                  <option value="cash">Cash</option>
                  <option value="cheque">Cheque</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="upi">UPI</option>
                  <option value="card">Card</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Notes</label>
              <textarea
                value={manualForm.notes}
                onChange={(e) => setManualForm({ ...manualForm, notes: e.target.value })}
                className="input resize-none"
                rows={2}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setManualModalOpen(false)} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="btn-primary">
                {submitting ? 'Saving...' : 'Record Donation'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default DonationsPage;
