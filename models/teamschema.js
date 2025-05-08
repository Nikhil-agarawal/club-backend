const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamSchema = new Schema({
  teamNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true  // Trim whitespace
  },
  studentNames: [
    {
      name: {
        type: String,
        required: true,
        trim: true
      }
    }
  ]
});

// Add index for better performance and to ensure uniqueness
teamSchema.index({ teamNumber: 1 }, { unique: true });

const Team = mongoose.model('Team', teamSchema);
module.exports = Team;