const express = require('express');
const fs = require('fs');
const path = require('path');
const Gallery = require('../models/Gallery');
const auth = require('../middleware/auth');
const { upload, UPLOAD_DIR } = require('../middleware/upload');

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
  // If multipart, process upload first
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data')) {
    return upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          error: err.code === 'LIMIT_FILE_SIZE' ? 'File too large (max 5 MB)' : err.message
        });
      }
      try {
        const caption = (req.body.caption || '').trim();
        if (!caption) return res.status(400).json({ error: 'Caption required' });
        if (!req.file) return res.status(400).json({ error: 'Image file required' });
        const url = `/uploads/${req.file.filename}`;
        const item = await Gallery.create({ path: url, full: url, caption });
        res.status(201).json(item);
      } catch (e) {
        res.status(500).json({ error: 'Server error' });
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

router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Gallery.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Photo not found' });
    // Delete local file if it was uploaded
    if (item.path && item.path.startsWith('/uploads/')) {
      const file = path.join(UPLOAD_DIR, path.basename(item.path));
      fs.unlink(file, () => {});
    }
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
