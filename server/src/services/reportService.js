const {
  Report,
  Donation,
  Volunteer,
  Campaign,
  Beneficiary,
  Event,
} = require('../models');
const AppError = require('../utils/AppError');
const { paginateQuery } = require('../utils/pagination');
const { rowsToCsv } = require('../utils/csvExporter');
const { createPdfBuffer } = require('../utils/pdfExporter');

const REPORT_COLUMNS = {
  donation: [
    { label: 'Date', getValue: (row) => row.donatedAt ? new Date(row.donatedAt).toLocaleDateString() : '' },
    { label: 'Donor', getValue: (row) => row.donorName },
    { label: 'Campaign', getValue: (row) => row.campaignTitle },
    { label: 'Amount', getValue: (row) => row.amount },
    { label: 'Gateway', getValue: (row) => row.paymentGateway },
    { label: 'Status', getValue: (row) => row.status },
  ],
  volunteer: [
    { label: 'Name', getValue: (row) => row.name },
    { label: 'Email', getValue: (row) => row.email },
    { label: 'Skills', getValue: (row) => row.skills },
    { label: 'Hours', getValue: (row) => row.totalHours },
    { label: 'Status', getValue: (row) => row.status },
    { label: 'Joined', getValue: (row) => row.joinedAt },
  ],
  campaign: [
    { label: 'Title', getValue: (row) => row.title },
    { label: 'Category', getValue: (row) => row.category },
    { label: 'Goal', getValue: (row) => row.goalAmount },
    { label: 'Raised', getValue: (row) => row.raisedAmount },
    { label: 'Status', getValue: (row) => row.status },
    { label: 'Start Date', getValue: (row) => row.startDate },
  ],
  beneficiary: [
    { label: 'Name', getValue: (row) => row.name },
    { label: 'Type', getValue: (row) => row.beneficiaryType },
    { label: 'Gender', getValue: (row) => row.gender },
    { label: 'Status', getValue: (row) => row.status },
    { label: 'Enrolled', getValue: (row) => row.enrolledDate },
  ],
  event: [
    { label: 'Title', getValue: (row) => row.title },
    { label: 'Location', getValue: (row) => row.location },
    { label: 'Start', getValue: (row) => row.startDate },
    { label: 'End', getValue: (row) => row.endDate },
    { label: 'Status', getValue: (row) => row.status },
    { label: 'Volunteers', getValue: (row) => row.volunteerCount },
  ],
  financial: [
    { label: 'Date', getValue: (row) => row.donatedAt },
    { label: 'Campaign', getValue: (row) => row.campaignTitle },
    { label: 'Amount', getValue: (row) => row.amount },
    { label: 'Gateway', getValue: (row) => row.paymentGateway },
    { label: 'Receipt', getValue: (row) => row.receiptNumber },
  ],
};

const buildDateQuery = (startDate, endDate, field = 'createdAt') => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  return {
    [field]: { $gte: start, $lte: end },
  };
};

const fetchReportData = async (reportType, { startDate, endDate, filters = {} }) => {
  switch (reportType) {
    case 'donation': {
      const query = {
        ...buildDateQuery(startDate, endDate, 'donatedAt'),
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.campaign ? { campaign: filters.campaign } : {}),
      };

      const donations = await Donation.find(query)
        .populate([
          { path: 'donor', populate: { path: 'user', select: 'firstName lastName email' } },
          { path: 'campaign', select: 'title' },
        ])
        .sort({ donatedAt: -1 });

      const rows = donations.map((donation) => ({
        donatedAt: donation.donatedAt,
        donorName: donation.isAnonymous
          ? 'Anonymous'
          : donation.donor?.user
            ? `${donation.donor.user.firstName} ${donation.donor.user.lastName}`
            : '—',
        campaignTitle: donation.campaign?.title || '—',
        amount: donation.amount,
        paymentGateway: donation.paymentGateway,
        status: donation.status,
      }));

      const totalAmount = rows.reduce((sum, row) => sum + (row.amount || 0), 0);

      return {
        rows,
        summary: {
          totalRecords: rows.length,
          totalAmount,
          highlights: [
            `${rows.length} donations recorded`,
            `$${Math.round(totalAmount).toLocaleString()} total amount`,
          ],
        },
      };
    }

    case 'financial': {
      const query = {
        status: 'completed',
        ...buildDateQuery(startDate, endDate, 'donatedAt'),
        ...(filters.campaign ? { campaign: filters.campaign } : {}),
      };

      const donations = await Donation.find(query)
        .populate({ path: 'campaign', select: 'title' })
        .sort({ donatedAt: -1 });

      const rows = donations.map((donation) => ({
        donatedAt: donation.donatedAt
          ? new Date(donation.donatedAt).toLocaleDateString()
          : '',
        campaignTitle: donation.campaign?.title || '—',
        amount: donation.amount,
        paymentGateway: donation.paymentGateway,
        receiptNumber: donation.receiptNumber,
      }));

      const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);

      return {
        rows,
        summary: {
          totalRecords: rows.length,
          totalAmount,
          highlights: [
            `$${Math.round(totalAmount).toLocaleString()} in completed donations`,
            `${rows.length} transactions`,
          ],
        },
      };
    }

    case 'volunteer': {
      const query = {
        ...buildDateQuery(startDate, endDate, 'joinedAt'),
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.volunteer ? { _id: filters.volunteer } : {}),
      };

      const volunteers = await Volunteer.find(query)
        .populate({ path: 'user', select: 'firstName lastName email' })
        .sort({ joinedAt: -1 });

      const rows = volunteers.map((volunteer) => ({
        name: volunteer.user
          ? `${volunteer.user.firstName} ${volunteer.user.lastName}`
          : '—',
        email: volunteer.user?.email || '—',
        skills: volunteer.skills?.join(', ') || '',
        totalHours: volunteer.totalHours || 0,
        status: volunteer.status,
        joinedAt: volunteer.joinedAt
          ? new Date(volunteer.joinedAt).toLocaleDateString()
          : '',
      }));

      return {
        rows,
        summary: {
          totalRecords: rows.length,
          totalAmount: 0,
          highlights: [`${rows.length} volunteer records`, `${rows.reduce((s, r) => s + r.totalHours, 0)} total hours`],
        },
      };
    }

    case 'campaign': {
      const query = {
        ...buildDateQuery(startDate, endDate, 'startDate'),
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.category ? { category: filters.category } : {}),
      };

      const campaigns = await Campaign.find(query).sort({ startDate: -1 });

      const rows = campaigns.map((campaign) => ({
        title: campaign.title,
        category: campaign.category,
        goalAmount: campaign.goalAmount,
        raisedAmount: campaign.raisedAmount,
        status: campaign.status,
        startDate: campaign.startDate
          ? new Date(campaign.startDate).toLocaleDateString()
          : '',
      }));

      const totalRaised = rows.reduce((sum, row) => sum + (row.raisedAmount || 0), 0);

      return {
        rows,
        summary: {
          totalRecords: rows.length,
          totalAmount: totalRaised,
          highlights: [`${rows.length} campaigns`, `$${Math.round(totalRaised).toLocaleString()} total raised`],
        },
      };
    }

    case 'beneficiary': {
      const query = {
        ...buildDateQuery(startDate, endDate, 'enrolledDate'),
        ...(filters.status ? { status: filters.status } : {}),
      };

      const beneficiaries = await Beneficiary.find(query).sort({ enrolledDate: -1 });

      const rows = beneficiaries.map((beneficiary) => ({
        name: `${beneficiary.firstName} ${beneficiary.lastName}`,
        beneficiaryType: beneficiary.beneficiaryType,
        gender: beneficiary.gender || '—',
        status: beneficiary.status,
        enrolledDate: beneficiary.enrolledDate
          ? new Date(beneficiary.enrolledDate).toLocaleDateString()
          : '',
      }));

      return {
        rows,
        summary: {
          totalRecords: rows.length,
          totalAmount: 0,
          highlights: [`${rows.length} beneficiaries enrolled`],
        },
      };
    }

    case 'event': {
      const query = {
        ...buildDateQuery(startDate, endDate, 'startDate'),
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.event ? { _id: filters.event } : {}),
      };

      const events = await Event.find(query).sort({ startDate: -1 });

      const rows = events.map((event) => ({
        title: event.title,
        location: event.location?.venue || event.location?.address || 'TBD',
        startDate: event.startDate ? new Date(event.startDate).toLocaleDateString() : '',
        endDate: event.endDate ? new Date(event.endDate).toLocaleDateString() : '',
        status: event.status,
        volunteerCount: event.volunteers?.length || 0,
      }));

      return {
        rows,
        summary: {
          totalRecords: rows.length,
          totalAmount: 0,
          highlights: [`${rows.length} events in period`],
        },
      };
    }

    default:
      throw new AppError('Unsupported report type.', 400);
  }
};

const generateReport = async (payload, userId) => {
  const {
    title,
    reportType,
    description,
    startDate,
    endDate,
    format = 'json',
    filters = {},
  } = payload;

  const { rows, summary } = await fetchReportData(reportType, {
    startDate,
    endDate,
    filters,
  });

  const report = await Report.create({
    title,
    reportType,
    description,
    period: { startDate, endDate },
    filters,
    summary,
    data: { rows },
    format,
    status: 'generated',
    generatedBy: userId,
    generatedAt: new Date(),
  });

  return report.populate({ path: 'generatedBy', select: 'firstName lastName email' });
};

const getAllReports = async ({ page, limit, reportType, search }) => {
  const query = {};

  if (reportType) query.reportType = reportType;

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const result = await paginateQuery(Report, {
    query,
    page,
    limit,
    sort: { generatedAt: -1 },
    populate: [{ path: 'generatedBy', select: 'firstName lastName email' }],
  });

  return { reports: result.items, pagination: result.pagination };
};

const getReportById = async (id) => {
  const report = await Report.findById(id).populate({
    path: 'generatedBy',
    select: 'firstName lastName email',
  });

  if (!report) {
    throw new AppError('Report not found.', 404);
  }

  return report;
};

const getReportDownload = async (id) => {
  const report = await getReportById(id);
  const rows = report.data?.rows || [];
  const columns = REPORT_COLUMNS[report.reportType] || [];

  if (columns.length === 0) {
    throw new AppError('No export format available for this report type.', 400);
  }

  const periodLabel = `${new Date(report.period.startDate).toLocaleDateString()} – ${new Date(report.period.endDate).toLocaleDateString()}`;
  const filenameBase = report.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();

  if (report.format === 'csv') {
    const content = rowsToCsv(rows, columns);
    return {
      content: Buffer.from(content, 'utf-8'),
      contentType: 'text/csv',
      filename: `${filenameBase}.csv`,
    };
  }

  if (report.format === 'pdf') {
    const buffer = await createPdfBuffer({
      title: report.title,
      subtitle: `${report.reportType} report · ${periodLabel}`,
      columns,
      rows,
      summaryLines: report.summary?.highlights || [],
    });

    return {
      content: buffer,
      contentType: 'application/pdf',
      filename: `${filenameBase}.pdf`,
    };
  }

  return {
    content: Buffer.from(JSON.stringify({ summary: report.summary, rows }, null, 2), 'utf-8'),
    contentType: 'application/json',
    filename: `${filenameBase}.json`,
  };
};

const deleteReport = async (id) => {
  const report = await Report.findByIdAndDelete(id);

  if (!report) {
    throw new AppError('Report not found.', 404);
  }

  return report;
};

module.exports = {
  generateReport,
  getAllReports,
  getReportById,
  getReportDownload,
  deleteReport,
  REPORT_COLUMNS,
};
