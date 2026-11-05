const express = require('express');
const auth = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

/**
 * POST /api/upload
 * multipart field name: "image"
 * returns { url, filename }
 */
router.post('/', auth, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      const msg = err.message || 'Upload failed';
      const status = err.code === 'LIMIT_FILE_SIZE' ? 400 : 400;
      return res.status(status).json({
        error: err.code === 'LIMIT_FILE_SIZE' ? 'File too large (max 15 MB)' : msg
      });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }
    const url = `/uploads/${req.file.filename}`;
    res.status(201).json({
      url,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  });
});

module.exports = router;
