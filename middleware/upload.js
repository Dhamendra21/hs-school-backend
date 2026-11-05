const path = require('path');
const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');
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

// Memory storage to process in-memory with Sharp
const storage = multer.memoryStorage();

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

/**
 * Helper to process buffer with Sharp into WebP and save to disk
 * Returns the final URL path: e.g. "/uploads/hash.webp"
 */
async function processAndSaveImage(file, baseUrl = '') {
  if (!file) throw new Error('No file provided');

  const isPdf = file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf');
  const baseName = crypto.randomBytes(16).toString('hex');

  let filename = '';
  let finalPath = '';

  if (isPdf) {
    filename = `${baseName}.pdf`;
    finalPath = path.join(UPLOAD_DIR, filename);
    await fs.promises.writeFile(finalPath, file.buffer);
  } else {
    filename = `${baseName}.webp`;
    finalPath = path.join(UPLOAD_DIR, filename);

    // Sharp pipeline: auto-rotate from EXIF, resize max 1920px width/height, convert to webp 82% quality
    await sharp(file.buffer)
      .rotate()
      .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(finalPath);
  }

  // Generate full or relative URL
  const relativeUrl = `/uploads/${filename}`;
  const fullUrl = baseUrl ? `${baseUrl.replace(/\/+$/, '')}${relativeUrl}` : relativeUrl;

  return {
    url: fullUrl,
    relativeUrl,
    filename,
    mimetype: isPdf ? 'application/pdf' : 'image/webp'
  };
}

module.exports = { upload, processAndSaveImage, UPLOAD_DIR };
