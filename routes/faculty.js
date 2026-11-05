const express = require('express');
const Faculty = require('../models/Faculty');
const auth = require('../middleware/auth');
const router = express.Router();

function makeInitials(name) {
  const parts = String(name).replace(/^(Mrs\.|Mr\.|Ms\.|Dr\.)\s*/i, '').trim().split(/\s+/);
  return parts.map(p => p[0] || '').join('').slice(0, 2).toUpperCase() || 'T';
}

router.get('/', async (req, res) => {
  try {
    const list = await Faculty.find().sort({ order: 1, createdAt: 1 });
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { name, role, subject, initials } = req.body;
    if (!name || !role) return res.status(400).json({ error: 'Name and role required' });
    const item = await Faculty.create({
      name, role,
      subject: subject || '',
      initials: (initials || makeInitials(name)).toUpperCase().slice(0, 4)
    });
    res.status(201).json(item);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.name && !updates.initials) updates.initials = makeInitials(updates.name);
    const item = await Faculty.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ error: 'Faculty member not found' });
    res.json(item);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Faculty.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Faculty member not found' });
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
