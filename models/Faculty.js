const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true }, // designation
  designation: { type: String, default: '' },
  experience: { type: String, default: '' },
  qualification: { type: String, default: '' },
  image: { type: String, default: '' },
  subject: { type: String, default: '' },
  initials: { type: String, default: '' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Faculty', facultySchema);
