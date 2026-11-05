const express = require('express');
const fs = require('fs');
const path = require('path');
const Gallery = require('../models/Gallery');
const auth = require('../middleware/auth');
const { upload, processAndSaveImage, UPLOAD_DIR } = require('../middleware/upload');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const list = await Gallery.find().sort({ order: 1, createdAt: 1 });
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create with URL (JSON) or file upload (multipart)
router.post('/', auth, (req, res) => {
  // If multipart, process upload first with Sharp
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data')) {
    return upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          error: err.code === 'LIMIT_FILE_SIZE' ? 'File too large (max 15 MB)' : err.message
        });
      }
      try {
        const caption = (req.body.caption || '').trim();
        if (!caption) return res.status(400).json({ error: 'Caption required' });
        if (!req.file) return res.status(400).json({ error: 'Image file required' });

        const baseUrl = process.env.API_URL || `${req.protocol}://${req.get('host')}`;
        const processed = await processAndSaveImage(req.file, baseUrl);

        // Save absolute/relative URL
        const item = await Gallery.create({ path: processed.url, full: processed.url, caption });
        res.status(201).json(item);
      } catch (e) {
        console.error('Gallery create error:', e);
        res.status(500).json({ error: 'Server error processing image' });
      }
    });
  }

  // JSON body with path URL
  (async () => {
    try {
      const { path: imgPath, full, caption } = req.body;
      if (!imgPath || !caption) return res.status(400).json({ error: 'path and caption required' });
      if (String(imgPath).includes('..')) return res.status(400).json({ error: 'Invalid image path' });
      const item = await Gallery.create({ path: imgPath, full: full || imgPath, caption });
      res.status(201).json(item);
    } catch (e) {
      res.status(500).json({ error: 'Server error' });
    }
  })();
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { caption, order } = req.body;
    const item = await Gallery.findByIdAndUpdate(
      req.params.id,
      { ...(caption !== undefined && { caption }), ...(order !== undefined && { order }) },
      { new: true }
    );
    if (!item) return res.status(404).json({ error: 'Gallery item not found' });
    res.json(item);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Gallery.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Gallery item not found' });
    if (item.path && item.path.includes('/uploads/')) {
      const filename = path.basename(item.path);
      const filePath = path.join(UPLOAD_DIR, filename);
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, () => {});
      }
    }
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
