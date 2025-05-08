const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const eventSchema = new mongoose.Schema({
  title: String,
  posterUrl: String,
  endTime: Date,
  registrations: [registrationSchema],
});

module.exports = mongoose.model('Event', eventSchema);
