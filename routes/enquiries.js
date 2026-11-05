const express = require('express');
const Enquiry = require('../models/Enquiry');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/enquiries - Public submission
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, subject, message } = req.body;
    if (!name || !phone || !message) {
      return res.status(400).json({ error: 'Name, Phone, and Message are required' });
    }
    const enquiry = await Enquiry.create({
      name,
      phone,
      email: email || '',
      subject: subject || 'Admission Enquiry',
      message
    });
    res.status(201).json({ message: 'Enquiry submitted successfully', enquiry });
  } catch (err) {
    console.error('Enquiry creation error:', err);
    res.status(500).json({ error: 'Server error. Failed to submit enquiry.' });
  }
});

// GET /api/enquiries - Admin only
router.get('/', auth, async (req, res) => {
  try {
    const list = await Enquiry.find({}).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/enquiries/:id - Admin only (update status)
router.put('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const item = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!item) return res.status(404).json({ error: 'Enquiry not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/enquiries/:id - Admin only
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Enquiry.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Enquiry not found' });
    res.json({ message: 'Enquiry deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
