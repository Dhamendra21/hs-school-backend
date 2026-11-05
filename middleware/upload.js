const path = require('path');
const fs = require('fs');
const multer = require('multer');
const crypto = require('crypto');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const ALLOWED = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf'
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const rawExt = path.extname(file.originalname).toLowerCase();
    const safe = rawExt.match(/^\.(jpe?g|png|webp|gif|pdf)$/) ? rawExt : '.jpg';
    const name = crypto.randomBytes(16).toString('hex') + safe;
    cb(null, name);
  }
});

function fileFilter(_req, file, cb) {
  if (!ALLOWED.has(file.mimetype) && !file.originalname.toLowerCase().endsWith('.pdf')) {
    return cb(new Error('Only JPEG, PNG, WebP, GIF images, and PDF documents are allowed'));
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15 MB
  }
});

module.exports = { upload, UPLOAD_DIR };
