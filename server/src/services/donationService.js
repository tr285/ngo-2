const Donation = require('../models/Donation');
const Donor = require('../models/Donor');
const Campaign = require('../models/Campaign');
const AppError = require('../utils/AppError');
const { ROLES } = require('../constants/roles');
const { paginateQuery } = require('../utils/pagination');
const paymentService = require('./paymentService');

const populateOptions = [
  {
    path: 'donor',
    populate: { path: 'user', select: 'firstName lastName email' },
  },
  { path: 'campaign', select: 'title slug goalAmount raisedAmount currency status' },
  { path: 'recordedBy', select: 'firstName lastName email' },
];

const getDonorProfile = async (userId) => {
  const donor = await Donor.findOne({ user: userId });

  if (!donor) {
    throw new AppError('Donor profile not found. Please contact support.', 404);
  }

  return donor;
};

const updateCampaignStats = async (campaignId, amount, donorId, donationId) => {
  const campaign = await Campaign.findById(campaignId);

  if (!campaign) return;

  campaign.raisedAmount = (campaign.raisedAmount || 0) + amount;

  const priorDonation = await Donation.findOne({
    campaign: campaignId,
    donor: donorId,
    status: 'completed',
    _id: { $ne: donationId },
  });

  if (!priorDonation) {
    campaign.donorCount = (campaign.donorCount || 0) + 1;
  }

  if (campaign.raisedAmount >= campaign.goalAmount && campaign.status === 'active') {
    campaign.status = 'completed';
  }

  await campaign.save();
};

const updateDonorStats = async (donorId, amount) => {
  await Donor.findByIdAndUpdate(donorId, {
    $inc: { totalDonated: amount, donationCount: 1 },
    lastDonationAt: new Date(),
  });
};

const completeDonation = async (donation, { transactionId, gatewayPaymentId }) => {
  donation.status = 'completed';
  donation.transactionId = transactionId || donation.transactionId;
  donation.gatewayPaymentId = gatewayPaymentId || donation.gatewayPaymentId;
  donation.donatedAt = new Date();

  if (!donation.receiptUrl) {
    donation.receiptUrl = `/api/donations/${donation._id}/receipt`;
  }

  await donation.save();

  await updateCampaignStats(donation.campaign, donation.amount, donation.donor, donation._id);
  await updateDonorStats(donation.donor, donation.amount);

  return Donation.findById(donation._id).populate(populateOptions);
};

const getAllDonations = async ({ page, limit, search, status, campaign, paymentGateway }) => {
  const query = {};

  if (status) query.status = status;
  if (campaign) query.campaign = campaign;
  if (paymentGateway) query.paymentGateway = paymentGateway;

  if (search) {
    query.$or = [
      { receiptNumber: { $regex: search, $options: 'i' } },
      { transactionId: { $regex: search, $options: 'i' } },
      { gatewayOrderId: { $regex: search, $options: 'i' } },
      { gatewayPaymentId: { $regex: search, $options: 'i' } },
    ];
  }

  const result = await paginateQuery(Donation, {
    query,
    page,
    limit,
    populate: populateOptions,
    sort: { donatedAt: -1 },
  });

  return { donations: result.items, pagination: result.pagination };
};

const getDonorDonations = async (userId, { page, limit, status, search }) => {
  const donor = await getDonorProfile(userId);
  const query = { donor: donor._id };

  if (status) query.status = status;

  if (search) {
    query.$or = [
      { receiptNumber: { $regex: search, $options: 'i' } },
      { transactionId: { $regex: search, $options: 'i' } },
    ];
  }

  const result = await paginateQuery(Donation, {
    query,
    page,
    limit,
    populate: populateOptions,
    sort: { donatedAt: -1 },
  });

  return { donations: result.items, pagination: result.pagination, donor };
};

const getTransactionHistory = async (user) => {
  const isAdmin = user.role === ROLES.ADMIN;
  const query = isAdmin ? {} : { donor: (await getDonorProfile(user._id))._id };

  const [donations, stats] = await Promise.all([
    Donation.find(query)
      .populate(populateOptions)
      .sort({ donatedAt: -1 })
      .limit(50),
    Donation.aggregate([
      { $match: { ...query, status: 'completed' } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  const summary = stats[0] || { totalAmount: 0, count: 0 };

  const byGateway = await Donation.aggregate([
    { $match: { ...query, status: 'completed' } },
    { $group: { _id: '$paymentGateway', total: { $sum: '$amount' }, count: { $sum: 1 } } },
  ]);

  return {
    donations,
    summary: {
      totalAmount: summary.totalAmount,
      totalDonations: summary.count,
      byGateway: byGateway.map((g) => ({
        gateway: g._id || 'manual',
        total: g.total,
        count: g.count,
      })),
    },
  };
};

const getDonationById = async (id, user) => {
  const donation = await Donation.findById(id).populate(populateOptions);

  if (!donation) {
    throw new AppError('Donation not found.', 404);
  }

  if (user.role !== ROLES.ADMIN) {
    const donor = await getDonorProfile(user._id);

    if (donation.donor._id.toString() !== donor._id.toString()) {
      throw new AppError('You do not have permission to view this donation.', 403);
    }
  }

  return donation;
};

const getReceipt = async (id, user) => {
  const donation = await getDonationById(id, user);

  if (donation.status !== 'completed') {
    throw new AppError('Receipt is only available for completed donations.', 400);
  }

  const donorUser = donation.donor?.user;
  const displayName = donation.isAnonymous
    ? 'Anonymous Donor'
    : donorUser
      ? `${donorUser.firstName} ${donorUser.lastName}`
      : 'Donor';

  return {
    receiptNumber: donation.receiptNumber,
    issuedAt: donation.donatedAt,
    donor: displayName,
    donorEmail: donation.isAnonymous ? null : donorUser?.email,
    campaign: donation.campaign?.title,
    amount: donation.amount,
    currency: donation.currency,
    paymentMethod: donation.paymentMethod,
    paymentGateway: donation.paymentGateway,
    transactionId: donation.transactionId || donation.gatewayPaymentId,
    status: donation.status,
    notes: donation.notes,
  };
};

const createManualDonation = async (data, recordedBy) => {
  const { donor: donorId, campaign: campaignId, amount, ...rest } = data;

  const [donor, campaign] = await Promise.all([
    Donor.findById(donorId),
    Campaign.findById(campaignId),
  ]);

  if (!donor) throw new AppError('Donor not found.', 404);
  if (!campaign) throw new AppError('Campaign not found.', 404);

  const donation = await Donation.create({
    donor: donorId,
    campaign: campaignId,
    amount,
    ...rest,
    paymentGateway: 'manual',
    status: rest.status || 'completed',
    recordedBy: recordedBy._id,
  });

  if (donation.status === 'completed') {
    await completeDonation(donation, { transactionId: rest.transactionId });
    return Donation.findById(donation._id).populate(populateOptions);
  }

  return Donation.findById(donation._id).populate(populateOptions);
};

const initiateCheckout = async ({ campaignId, amount, paymentGateway, isAnonymous }, user) => {
  const donor = await getDonorProfile(user._id);
  const campaign = await Campaign.findById(campaignId);

  if (!campaign) throw new AppError('Campaign not found.', 404);
  if (campaign.status !== 'active') {
    throw new AppError('This campaign is not accepting donations.', 400);
  }

  if (!['razorpay', 'stripe'].includes(paymentGateway)) {
    throw new AppError('Invalid payment gateway.', 400);
  }

  const paymentMethod = paymentGateway === 'razorpay' ? 'razorpay' : 'stripe';
  const currency = paymentGateway === 'razorpay' ? 'INR' : (campaign.currency || 'USD');

  const donation = await Donation.create({
    donor: donor._id,
    campaign: campaignId,
    amount,
    currency,
    paymentMethod,
    paymentGateway,
    status: 'pending',
    isAnonymous: isAnonymous || false,
    recordedBy: user._id,
  });

  let gatewayData;

  if (paymentGateway === 'razorpay') {
    const order = paymentService.createRazorpayOrder({
      amount,
      currency,
      donationId: donation._id,
    });
    donation.gatewayOrderId = order.orderId;
    await donation.save();
    gatewayData = order;
  } else {
    const intent = paymentService.createStripePaymentIntent({
      amount,
      currency,
      donationId: donation._id,
    });
    donation.gatewayOrderId = intent.paymentIntentId;
    await donation.save();
    gatewayData = intent;
  }

  const populated = await Donation.findById(donation._id).populate(populateOptions);

  return { donation: populated, gateway: gatewayData };
};

const confirmRazorpayPayment = async ({ donationId, orderId, paymentId }, user) => {
  const donation = await getDonationById(donationId, user);

  if (donation.status !== 'pending') {
    throw new AppError('Donation is not pending.', 400);
  }

  const verification = paymentService.verifyRazorpayPayment({ orderId, paymentId });

  if (!verification.verified) {
    donation.status = 'failed';
    await donation.save();
    throw new AppError(verification.message || 'Payment verification failed.', 400);
  }

  return completeDonation(donation, {
    transactionId: verification.transactionId,
    gatewayPaymentId: paymentId,
  });
};

const confirmStripePayment = async ({ donationId, paymentIntentId }, user) => {
  const donation = await getDonationById(donationId, user);

  if (donation.status !== 'pending') {
    throw new AppError('Donation is not pending.', 400);
  }

  const confirmation = paymentService.confirmStripePayment({ paymentIntentId });

  if (!confirmation.confirmed) {
    donation.status = 'failed';
    await donation.save();
    throw new AppError(confirmation.message || 'Payment confirmation failed.', 400);
  }

  return completeDonation(donation, {
    transactionId: confirmation.transactionId,
    gatewayPaymentId: paymentIntentId,
  });
};

const getCampaignProgress = async () => {
  const campaigns = await Campaign.find({ status: { $in: ['active', 'completed'] } })
    .select('title slug goalAmount raisedAmount currency status donorCount endDate')
    .sort({ raisedAmount: -1 })
    .limit(20);

  return campaigns.map((campaign) => ({
    _id: campaign._id,
    title: campaign.title,
    slug: campaign.slug,
    goalAmount: campaign.goalAmount,
    raisedAmount: campaign.raisedAmount,
    currency: campaign.currency,
    status: campaign.status,
    donorCount: campaign.donorCount,
    endDate: campaign.endDate,
    progressPercent: campaign.goalAmount
      ? Math.min(Math.round((campaign.raisedAmount / campaign.goalAmount) * 100), 100)
      : 0,
  }));
};

const updateDonation = async (id, updates) => {
  const allowedFields = ['status', 'notes', 'transactionId'];
  const filteredUpdates = {};

  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) {
      filteredUpdates[field] = updates[field];
    }
  });

  const donation = await Donation.findByIdAndUpdate(id, filteredUpdates, {
    new: true,
    runValidators: true,
  }).populate(populateOptions);

  if (!donation) {
    throw new AppError('Donation not found.', 404);
  }

  return donation;
};

const deleteDonation = async (id) => {
  const donation = await Donation.findByIdAndDelete(id);

  if (!donation) {
    throw new AppError('Donation not found.', 404);
  }

  return donation;
};

module.exports = {
  getAllDonations,
  getDonorDonations,
  getTransactionHistory,
  getDonationById,
  getReceipt,
  createManualDonation,
  initiateCheckout,
  confirmRazorpayPayment,
  confirmStripePayment,
  getCampaignProgress,
  updateDonation,
  deleteDonation,
};
