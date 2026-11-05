const express = require('express');
const auth = require('../middleware/auth');
const { upload, processAndSaveImage } = require('../middleware/upload');

const router = express.Router();

/**
 * POST /api/upload
 * multipart field name: "image"
 * returns { url, relativeUrl, filename, mimetype }
 */
router.post('/', auth, (req, res) => {
  upload.single('image')(req, res, async (err) => {
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

    try {
      // Determine base URL if absolute URL is desired or configured
      const baseUrl = process.env.API_URL || `${req.protocol}://${req.get('host')}`;
      const result = await processAndSaveImage(req.file, baseUrl);
      res.status(201).json(result);
    } catch (processErr) {
      console.error('Sharp Image processing error:', processErr);
      res.status(500).json({ error: 'Failed to process image with Sharp' });
    }
  });
});

module.exports = router;
