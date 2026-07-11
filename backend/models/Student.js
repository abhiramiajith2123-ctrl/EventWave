const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  registerNumber: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
  },
  department: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
  yearOfStudy: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
