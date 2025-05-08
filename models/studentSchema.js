const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rollNo: {
    type: String,
    required: true,
    unique: true, // Roll number should be unique for each member
  },
  email: {
    type: String,
    required: true,
    unique: true, // Email should be unique for each member
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "member", // ✅ Yeh default admin set kar de
  }
});

const Member = mongoose.model("Member", memberSchema);

module.exports = Member;
