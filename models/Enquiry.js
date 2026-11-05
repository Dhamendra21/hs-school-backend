const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  subject: { type: String, default: 'Admission Enquiry' },
  message: { type: String, required: true },
  status: { type: String, enum: ['unread', 'read', 'contacted'], default: 'unread' }
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);
