export const stats = [
  {
    id: 'users',
    label: 'Total Users',
    value: '1,248',
    change: '+12.5%',
    changeLabel: 'vs last month',
    trend: 'up',
    icon: 'Users',
    color: 'blue',
  },
  {
    id: 'campaigns',
    label: 'Active Campaigns',
    value: '18',
    change: '+3',
    changeLabel: 'new this month',
    trend: 'up',
    icon: 'Target',
    color: 'violet',
  },
  {
    id: 'donations',
    label: 'Total Donations',
    value: '$284,520',
    change: '+8.2%',
    changeLabel: 'vs last month',
    trend: 'up',
    icon: 'DollarSign',
    color: 'green',
  },
  {
    id: 'volunteers',
    label: 'Pending Volunteers',
    value: '24',
    change: '-6',
    changeLabel: 'from last week',
    trend: 'down',
    icon: 'UserPlus',
    color: 'amber',
  },
];

export const monthlyDonations = [
  { month: 'Jan', amount: 18500, donors: 42 },
  { month: 'Feb', amount: 22300, donors: 51 },
  { month: 'Mar', amount: 19800, donors: 47 },
  { month: 'Apr', amount: 27600, donors: 63 },
  { month: 'May', amount: 31200, donors: 71 },
  { month: 'Jun', amount: 35400, donors: 78 },
  { month: 'Jul', amount: 29800, donors: 65 },
  { month: 'Aug', amount: 33100, donors: 74 },
  { month: 'Sep', amount: 36700, donors: 82 },
  { month: 'Oct', amount: 38900, donors: 88 },
  { month: 'Nov', amount: 42100, donors: 95 },
  { month: 'Dec', amount: 45300, donors: 102 },
];

export const campaignPerformance = [
  { name: 'Clean Water', raised: 42000, goal: 50000 },
  { name: 'Education', raised: 38500, goal: 40000 },
  { name: 'Healthcare', raised: 31200, goal: 45000 },
  { name: 'Food Relief', raised: 27800, goal: 30000 },
  { name: 'Shelter', raised: 19400, goal: 35000 },
  { name: 'Disaster Aid', raised: 15600, goal: 25000 },
];

export const userDistribution = [
  { name: 'Donors', value: 842, color: '#2563eb' },
  { name: 'Volunteers', value: 312, color: '#7c3aed' },
  { name: 'Beneficiaries', value: 94, color: '#059669' },
];

export const recentDonations = [
  {
    id: 1,
    donor: 'Sarah Mitchell',
    campaign: 'Clean Water Initiative',
    amount: 500,
    date: '2026-06-25',
    status: 'Completed',
  },
  {
    id: 2,
    donor: 'James Chen',
    campaign: 'Education for All',
    amount: 250,
    date: '2026-06-24',
    status: 'Completed',
  },
  {
    id: 3,
    donor: 'Anonymous',
    campaign: 'Healthcare Access',
    amount: 1000,
    date: '2026-06-24',
    status: 'Completed',
  },
  {
    id: 4,
    donor: 'Maria Garcia',
    campaign: 'Food Relief Program',
    amount: 150,
    date: '2026-06-23',
    status: 'Pending',
  },
  {
    id: 5,
    donor: 'Robert Kim',
    campaign: 'Shelter Support',
    amount: 750,
    date: '2026-06-23',
    status: 'Completed',
  },
];

export const recentActivities = [
  {
    id: 1,
    type: 'donation',
    message: 'Sarah Mitchell donated $500 to Clean Water Initiative',
    time: '2 minutes ago',
    icon: 'DollarSign',
  },
  {
    id: 2,
    type: 'volunteer',
    message: 'New volunteer application from Alex Thompson',
    time: '15 minutes ago',
    icon: 'UserPlus',
  },
  {
    id: 3,
    type: 'campaign',
    message: 'Education for All campaign reached 96% of its goal',
    time: '1 hour ago',
    icon: 'Target',
  },
  {
    id: 4,
    type: 'event',
    message: 'Community Food Drive event scheduled for July 5',
    time: '2 hours ago',
    icon: 'Calendar',
  },
  {
    id: 5,
    type: 'user',
    message: 'Admin approved 3 new volunteer accounts',
    time: '3 hours ago',
    icon: 'Users',
  },
  {
    id: 6,
    type: 'report',
    message: 'Monthly impact report generated successfully',
    time: '5 hours ago',
    icon: 'FileText',
  },
];

export const upcomingEvents = [
  {
    id: 1,
    title: 'Community Food Drive',
    date: 'Jul 5, 2026',
    location: 'Central Community Center',
    volunteers: 24,
  },
  {
    id: 2,
    title: 'Health Camp',
    date: 'Jul 12, 2026',
    location: 'Riverside Clinic',
    volunteers: 18,
  },
  {
    id: 3,
    title: 'Fundraising Gala',
    date: 'Jul 20, 2026',
    location: 'Grand Hotel Ballroom',
    volunteers: 32,
  },
];
