// server/src/middleware/upload.js
// Uses multer with memoryStorage in production (Vercel has a read-only FS).
// Uses diskStorage in local development so files are saved to disk as before.

const multer = require('multer');
const path = require('path');
const AppError = require('../utils/AppError');

const isProduction = process.env.NODE_ENV === 'production';

// In production we must use memoryStorage because Vercel's filesystem is
// read-only (writes to /tmp only, not to project paths).
// If you want persistent file storage in production, integrate Cloudinary,
// AWS S3, or Supabase Storage and process req.file.buffer there.
const storage = isProduction
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (_req, _file, cb) => {
        cb(null, path.join(__dirname, '../../uploads'));
      },
      filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, uniqueName);
      },
    });

const fileFilter = (_req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|pdf/;
  const extValid = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeValid = allowedTypes.test(file.mimetype);

  if (extValid && mimeValid) {
    cb(null, true);
  } else {
    cb(new AppError('Only images and PDF files are allowed.', 400), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

module.exports = upload;
