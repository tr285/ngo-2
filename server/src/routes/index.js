const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const adminRoutes = require('./adminRoutes');
const volunteerRoutes = require('./volunteerRoutes');
const donorRoutes = require('./donorRoutes');
const volunteerManagementRoutes = require('./volunteerManagementRoutes');
const donorManagementRoutes = require('./donorManagementRoutes');
const campaignRoutes = require('./campaignRoutes');
const beneficiaryRoutes = require('./beneficiaryRoutes');
const eventRoutes = require('./eventRoutes');
const donationRoutes = require('./donationRoutes');
const reportRoutes = require('./reportRoutes');
const settingsRoutes = require('./settingsRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/volunteer', volunteerRoutes);
router.use('/donor', donorRoutes);
router.use('/volunteers', volunteerManagementRoutes);
router.use('/donors', donorManagementRoutes);
router.use('/campaigns', campaignRoutes);
router.use('/beneficiaries', beneficiaryRoutes);
router.use('/events', eventRoutes);
router.use('/donations', donationRoutes);
router.use('/reports', reportRoutes);
router.use('/settings', settingsRoutes);

module.exports = router;
