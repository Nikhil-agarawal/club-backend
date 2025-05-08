// models/Attendance.js
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  attendanceData: [
    {
      name: {
        type: String,
        required: true
      },
      status: {
        type: String,
        enum: ['Present', 'Absent'],
        required: true
      }
    }
  ],
  date: {
    type: Date,
    required: true,
    unique: true // Ensure only one attendance record per date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create an index on the date field for faster lookups
attendanceSchema.index({ date: 1 });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;