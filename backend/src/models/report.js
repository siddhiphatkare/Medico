const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  filename: { type: String, required: true },
  fileUrl: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['pending', 'reviewed'], default: 'pending' },
  uploadedAt: { type: Date, default: Date.now },
  reviewedAt: { type: Date },
  reviewNotes: { type: String },
});

module.exports = mongoose.model('Report', reportSchema);
