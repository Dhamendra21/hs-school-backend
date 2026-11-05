const express = require('express');
const Content = require('../models/Content');
const auth = require('../middleware/auth');

const router = express.Router();
const ALLOWED = [
  'site', 'hero', 'highlights', 'about', 'why', 'academics',
  'facilities', 'studentLife', 'achievements', 'testimonials', 'admissionCta', 'popup'
];

// GET all content as object { site: ..., hero: ... }
router.get('/', async (req, res) => {
  try {
    const docs = await Content.find({});
    const out = {};
    docs.forEach(d => { out[d.key] = d.data; });
    res.json(out);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:section', async (req, res) => {
  try {
    if (!ALLOWED.includes(req.params.section)) {
      return res.status(404).json({ error: 'Unknown section' });
    }
    const doc = await Content.findOne({ key: req.params.section });
    res.json(doc ? doc.data : null);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:section', auth, async (req, res) => {
  try {
    const section = req.params.section;
    if (!ALLOWED.includes(section)) {
      return res.status(404).json({ error: 'Unknown section' });
    }
    const value = req.body.data !== undefined ? req.body.data : req.body;
    const doc = await Content.findOneAndUpdate(
      { key: section },
      { key: section, data: value },
      { upsert: true, new: true }
    );
    res.json({ message: 'Section updated', section, data: doc.data });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
