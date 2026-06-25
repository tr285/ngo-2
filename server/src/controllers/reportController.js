const reportService = require('../services/reportService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

const generateReport = asyncHandler(async (req, res) => {
  const report = await reportService.generateReport(req.body, req.user._id);

  sendSuccess(res, 'Report generated successfully', { report }, 201);
});

const getAllReports = asyncHandler(async (req, res) => {
  const { page, limit, reportType, search } = req.query;
  const result = await reportService.getAllReports({
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    reportType,
    search,
  });

  sendSuccess(res, 'Reports retrieved successfully', result);
});

const getReportById = asyncHandler(async (req, res) => {
  const report = await reportService.getReportById(req.params.id);

  sendSuccess(res, 'Report retrieved successfully', { report });
});

const downloadReport = asyncHandler(async (req, res) => {
  const { content, contentType, filename } = await reportService.getReportDownload(req.params.id);

  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(content);
});

const deleteReport = asyncHandler(async (req, res) => {
  await reportService.deleteReport(req.params.id);

  sendSuccess(res, 'Report deleted successfully');
});

module.exports = {
  generateReport,
  getAllReports,
  getReportById,
  downloadReport,
  deleteReport,
};
