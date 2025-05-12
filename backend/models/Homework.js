const mongoose = require('mongoose');

const homeworkSchema = new mongoose.Schema({
  classNumber: {
    type: String,
    required: true,
  },
  file: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Homework', homeworkSchema);
