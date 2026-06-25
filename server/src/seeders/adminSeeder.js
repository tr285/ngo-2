require('dotenv').config();

const connectDB = require('../config/database');
const User = require('../models/User');
const { ROLES } = require('../constants/roles');

const seedAdmin = async () => {
  await connectDB();

  const email = process.env.ADMIN_EMAIL || 'admin@ngo.org';
  const password = process.env.ADMIN_PASSWORD || 'Admin@1234';

  const existingAdmin = await User.findOne({ email });

  if (existingAdmin) {
    console.log(`Admin already exists: ${email}`);
    process.exit(0);
  }

  await User.create({
    firstName: 'System',
    lastName: 'Admin',
    email,
    password,
    role: ROLES.ADMIN,
  });

  console.log(`Admin user created: ${email}`);
  process.exit(0);
};

seedAdmin().catch((error) => {
  console.error('Admin seed failed:', error.message);
  process.exit(1);
});
