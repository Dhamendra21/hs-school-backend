const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  content: { type: String, required: true, maxlength: 5000 },
  date: { type: String, default: () => new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
  attachment: { type: String, default: '' },
  attachmentType: { type: String, default: '' } // 'pdf' | 'image' | ''
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);
