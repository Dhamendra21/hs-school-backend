const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  path: { type: String, required: true },
  full: { type: String, default: '' },
  caption: { type: String, required: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);
