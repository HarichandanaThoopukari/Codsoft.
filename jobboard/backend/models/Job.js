const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Job title is required'], trim: true },
  company: { type: String, required: [true, 'Company name is required'] },
  description: { type: String, required: [true, 'Description is required'] },
  responsibilities: [{ type: String }],
  requirements: [{ type: String }],
  skills: [{ type: String }],
  salary: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'USD' },
    period: { type: String, default: 'yearly' }
  },
  location: { type: String, required: [true, 'Location is required'] },
  jobType: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'], default: 'full-time' },
  experienceLevel: { type: String, enum: ['entry', 'mid', 'senior', 'executive'], default: 'mid' },
  category: { type: String },
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
  deadline: { type: Date },
  applicationsCount: { type: Number, default: 0 },
  views: { type: Number, default: 0 }
}, { timestamps: true });

jobSchema.index({ title: 'text', description: 'text', company: 'text', location: 'text' });

module.exports = mongoose.model('Job', jobSchema);
