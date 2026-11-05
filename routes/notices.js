const express = require('express');
const Notice = require('../models/Notice');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const list = await Notice.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { title, content, attachment, attachmentType } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'Title and content required' });
    const notice = await Notice.create({
      title,
      content,
      attachment: attachment || '',
      attachmentType: attachmentType || ''
    });
    res.status(201).json(notice);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        content: req.body.content,
        attachment: req.body.attachment || '',
        attachmentType: req.body.attachmentType || ''
      },
      { new: true, runValidators: true }
    );
    if (!notice) return res.status(404).json({ error: 'Notice not found' });
    res.json(notice);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ error: 'Notice not found' });
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
