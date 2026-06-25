const {
  User,
  Volunteer,
  Donor,
  Campaign,
  Donation,
  Event,
  Beneficiary,
  Report,
} = require('../models');

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatRelativeTime = (date) => {
  const diffMs = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;

  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const getMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  return { start, end: now };
};

const getDashboardAnalytics = async () => {
  const { start: monthStart, end: monthEnd } = getMonthRange();
  const lastMonthStart = new Date(monthEnd.getFullYear(), monthEnd.getMonth() - 1, 1);
  const lastMonthEnd = new Date(monthEnd.getFullYear(), monthEnd.getMonth(), 0, 23, 59, 59);

  const [
    totalUsers,
    activeCampaigns,
    pendingVolunteers,
    totalDonationStats,
    lastMonthDonationStats,
    monthlyAggregation,
    campaignPerformance,
    userCounts,
    recentDonationsRaw,
    recentVolunteers,
    recentReports,
    upcomingEventsRaw,
  ] = await Promise.all([
    User.countDocuments({ isActive: true }),
    Campaign.countDocuments({ status: 'active' }),
    Volunteer.countDocuments({ status: 'pending' }),
    Donation.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]),
    Donation.aggregate([
      {
        $match: {
          status: 'completed',
          donatedAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Donation.aggregate([
      {
        $match: {
          status: 'completed',
          donatedAt: { $gte: monthStart, $lte: monthEnd },
        },
      },
      {
        $group: {
          _id: { year: { $year: '$donatedAt' }, month: { $month: '$donatedAt' } },
          amount: { $sum: '$amount' },
          donors: { $addToSet: '$donor' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),
    Campaign.find({ status: { $in: ['active', 'completed'] } })
      .select('title raisedAmount goalAmount')
      .sort({ raisedAmount: -1 })
      .limit(6),
    Promise.all([
      Donor.countDocuments({ status: 'active' }),
      Volunteer.countDocuments({ status: { $in: ['approved', 'active'] } }),
      Beneficiary.countDocuments({ status: 'active' }),
    ]),
    Donation.find({ status: 'completed' })
      .populate([
        { path: 'donor', populate: { path: 'user', select: 'firstName lastName' } },
        { path: 'campaign', select: 'title' },
      ])
      .sort({ donatedAt: -1 })
      .limit(5),
    Volunteer.find()
      .populate({ path: 'user', select: 'firstName lastName' })
      .sort({ createdAt: -1 })
      .limit(3),
    Report.find({ status: 'generated' })
      .sort({ generatedAt: -1 })
      .limit(2),
    Event.find({
      status: { $in: ['upcoming', 'ongoing'] },
      startDate: { $gte: new Date() },
    })
      .sort({ startDate: 1 })
      .limit(3),
  ]);

  const totalAmount = totalDonationStats[0]?.total || 0;
  const lastMonthAmount = lastMonthDonationStats[0]?.total || 0;
  const donationChange =
    lastMonthAmount > 0
      ? (((totalAmount - lastMonthAmount) / lastMonthAmount) * 100).toFixed(1)
      : totalAmount > 0
        ? '100'
        : '0';

  const monthlyMap = new Map(
    monthlyAggregation.map((entry) => [
      `${entry._id.year}-${entry._id.month}`,
      { amount: entry.amount, donors: entry.donors.length },
    ])
  );

  const monthlyDonations = [];
  const cursor = new Date(monthStart);

  while (cursor <= monthEnd) {
    const key = `${cursor.getFullYear()}-${cursor.getMonth() + 1}`;
    const data = monthlyMap.get(key) || { amount: 0, donors: 0 };

    monthlyDonations.push({
      month: MONTH_LABELS[cursor.getMonth()],
      amount: data.amount,
      donors: data.donors,
    });

    cursor.setMonth(cursor.getMonth() + 1);
  }

  const [donorCount, volunteerCount, beneficiaryCount] = userCounts;

  const recentDonations = recentDonationsRaw.map((donation) => ({
    id: donation._id,
    donor: donation.isAnonymous
      ? 'Anonymous'
      : donation.donor?.user
        ? `${donation.donor.user.firstName} ${donation.donor.user.lastName}`
        : 'Donor',
    campaign: donation.campaign?.title || '—',
    amount: donation.amount,
    date: donation.donatedAt
      ? new Date(donation.donatedAt).toISOString().split('T')[0]
      : '—',
    status: donation.status.charAt(0).toUpperCase() + donation.status.slice(1),
  }));

  const activities = [];

  recentDonationsRaw.slice(0, 2).forEach((donation) => {
    const donorName = donation.isAnonymous
      ? 'Anonymous donor'
      : donation.donor?.user
        ? `${donation.donor.user.firstName} ${donation.donor.user.lastName}`
        : 'A donor';

    activities.push({
      id: `donation-${donation._id}`,
      type: 'donation',
      message: `${donorName} donated $${donation.amount} to ${donation.campaign?.title || 'a campaign'}`,
      time: formatRelativeTime(donation.donatedAt || donation.createdAt),
      icon: 'DollarSign',
      sortDate: donation.donatedAt || donation.createdAt,
    });
  });

  recentVolunteers.forEach((volunteer) => {
    activities.push({
      id: `volunteer-${volunteer._id}`,
      type: 'volunteer',
      message: `New volunteer application from ${volunteer.user?.firstName || 'Unknown'} ${volunteer.user?.lastName || ''}`.trim(),
      time: formatRelativeTime(volunteer.createdAt),
      icon: 'UserPlus',
      sortDate: volunteer.createdAt,
    });
  });

  campaignPerformance.slice(0, 1).forEach((campaign) => {
    const progress = campaign.goalAmount
      ? Math.round((campaign.raisedAmount / campaign.goalAmount) * 100)
      : 0;

    activities.push({
      id: `campaign-${campaign._id}`,
      type: 'campaign',
      message: `${campaign.title} campaign reached ${progress}% of its goal`,
      time: formatRelativeTime(campaign.updatedAt || campaign.createdAt),
      icon: 'Target',
      sortDate: campaign.updatedAt || campaign.createdAt,
    });
  });

  upcomingEventsRaw.forEach((event) => {
    activities.push({
      id: `event-${event._id}`,
      type: 'event',
      message: `${event.title} scheduled for ${new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      time: formatRelativeTime(event.createdAt),
      icon: 'Calendar',
      sortDate: event.createdAt,
    });
  });

  recentReports.forEach((report) => {
    activities.push({
      id: `report-${report._id}`,
      type: 'report',
      message: `${report.title} generated successfully`,
      time: formatRelativeTime(report.generatedAt || report.createdAt),
      icon: 'FileText',
      sortDate: report.generatedAt || report.createdAt,
    });
  });

  activities.sort((a, b) => new Date(b.sortDate) - new Date(a.sortDate));

  const upcomingEvents = upcomingEventsRaw.map((event) => ({
    id: event._id,
    title: event.title,
    date: new Date(event.startDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    location: event.location?.venue || event.location?.address || 'TBD',
    volunteers: event.volunteers?.length || 0,
  }));

  return {
    stats: [
      {
        id: 'users',
        label: 'Total Users',
        value: totalUsers.toLocaleString(),
        change: null,
        changeLabel: 'active accounts',
        trend: 'up',
        icon: 'Users',
        color: 'blue',
      },
      {
        id: 'campaigns',
        label: 'Active Campaigns',
        value: String(activeCampaigns),
        change: null,
        changeLabel: 'currently running',
        trend: 'up',
        icon: 'Target',
        color: 'violet',
      },
      {
        id: 'donations',
        label: 'Total Donations',
        value: `$${Math.round(totalAmount).toLocaleString()}`,
        change: `${Number(donationChange) >= 0 ? '+' : ''}${donationChange}%`,
        changeLabel: 'vs last month',
        trend: Number(donationChange) >= 0 ? 'up' : 'down',
        icon: 'DollarSign',
        color: 'green',
      },
      {
        id: 'volunteers',
        label: 'Pending Volunteers',
        value: String(pendingVolunteers),
        change: null,
        changeLabel: 'awaiting approval',
        trend: pendingVolunteers > 0 ? 'down' : 'up',
        icon: 'UserPlus',
        color: 'amber',
      },
    ],
    monthlyDonations,
    campaignPerformance: campaignPerformance.map((campaign) => ({
      name: campaign.title.length > 20 ? `${campaign.title.slice(0, 20)}…` : campaign.title,
      raised: campaign.raisedAmount || 0,
      goal: campaign.goalAmount || 0,
    })),
    userDistribution: [
      { name: 'Donors', value: donorCount, color: '#2563eb' },
      { name: 'Volunteers', value: volunteerCount, color: '#7c3aed' },
      { name: 'Beneficiaries', value: beneficiaryCount, color: '#059669' },
    ],
    recentDonations,
    recentActivities: activities.slice(0, 6).map(({ sortDate, ...rest }) => rest),
    upcomingEvents,
  };
};

module.exports = { getDashboardAnalytics };
